# Unit 09 — Java Input Editor and Parser Service Contract

## Overview

Build the Java paste editor using Monaco, define the API contract between the
frontend and the Java parsing service, implement the API route that proxies
requests to the Java parser, and display structured parser errors in the UI.
The actual Java parsing logic lives in Unit 10 — this unit only establishes
the input surface and the wire protocol.

---

## Goal

A user can paste Java source code into a Monaco editor, click "Generate UML",
see a loading state, and receive either a generated diagram or structured
parser error messages. The frontend sends to the backend; the backend
forwards to the Java parser service and returns the normalized response.

---

## Dependencies

- Unit 01 (app shell and layout)
- Unit 02 (auth and session)
- Unit 03 (diagram model and shared types)

---

## Scope

### In Scope

- Monaco Editor installed in `apps/web`
- `JavaEditorPanel.tsx` — Monaco editor component for Java source input
- Sidebar toggle between "Structure" view and "Code Import" view
- `parserStore` — owns parsing loading state, warnings, and errors
- `parseJava` action in `parserStore`
- API route: `POST /api/v1/parser/java` — proxy to Java parser service
- `parser-client` package — builds parser request, normalizes parser response
- Parser error display: structured error list (code, message, line)
- Parser warning display: collapsible warning list
- Loading indicator during parsing

### Out of Scope

- Actual Java parsing (Unit 10 — the Java service implementation)
- Auto-save integration (Unit 8)
- Post-generation editing (Unit 11)

---

## Packages Affected

| Package | Action |
|---|---|
| `apps/web` | Add Java editor, parserStore, parser UI |
| `apps/api` | Add parser proxy route |
| `packages/parser-client` | Create — request/response normalization |

---

## Folder Structure

```text
apps/web/src/
├── features/
│   └── java-editor/
│       ├── JavaEditorPanel.tsx
│       ├── ParserErrorList.tsx
│       └── ParserWarningList.tsx
├── stores/
│   └── parserStore.ts
└── services/
    └── parserService.ts

packages/parser-client/src/
├── api/
│   └── parserApiClient.ts
├── contracts/
│   └── parserContracts.ts
└── index.ts
```

---

## parserStore Contract

```ts
type ParseStatus = 'idle' | 'loading' | 'success' | 'error'

interface ParserStoreState {
  status: ParseStatus
  warnings: ParserWarning[]
  errors: ParserError[]
  lastParsedSource: string | null
  setStatus: (status: ParseStatus) => void
  setResult: (warnings: ParserWarning[], errors: ParserError[]) => void
  clearResult: () => void
}
```

Rules:
- `parserStore` must NOT directly mutate `umlStore`
- On success: the calling service feeds the resulting `UMLDiagram` into `umlStore`
- `parserStore` owns only the parse lifecycle state

---

## API Contract

### POST /api/v1/parser/java

Request (from frontend):
```json
{ "source": "public class User { ... }" }
```

Backend behavior:
1. Validates auth
2. Validates payload (non-empty, under 1MB)
3. Forwards to Java parser service
4. Returns normalized response

Response on success:
```json
{
  "success": true,
  "data": {
    "diagram": { ...UMLDiagram },
    "warnings": [],
    "errors": []
  }
}
```

Response on parse failure:
```json
{
  "success": false,
  "data": {
    "diagram": null,
    "warnings": [],
    "errors": [{ "code": "PARSE_ERROR", "message": "...", "line": 4 }]
  }
}
```

Rules:
- A parse failure must NEVER crash the API (return 200 with `success:false` in data)
- A parser timeout must return a structured timeout error
- Payload over 1MB must return 413

---

## Parser Client Package

```ts
// packages/parser-client/src/contracts/parserContracts.ts
interface ParserRequest { source: string }
interface ParserResponse {
  success: boolean
  diagram?: UMLDiagram
  warnings: ParserWarning[]
  errors: ParserError[]
}

// packages/parser-client/src/api/parserApiClient.ts
async function parseJava(source: string): Promise<ParserResponse>
```

Rules:
- `parser-client` must import types from `@uml-editor/shared-model` only
- Must not contain actual parser logic
- Must not contain React components

---

## Java Editor UI Specification

```text
Location: left sidebar — replaces structure panel when "Code Import" tab active
Monaco Editor:
  - Language: Java
  - Theme: dark (vs-dark or custom matching app theme)
  - Font: JetBrains Mono, 13px
  - Min height: 400px
  - Full syntax highlighting

Above Monaco:
  - Tab toggle: "Structure" | "Code Import"

Below Monaco:
  - "Generate UML" button (primary, full-width)
  - Disabled with spinner while loading

Below button:
  - Parser error list (if errors present) — red section
  - Parser warning list (if warnings present) — yellow collapsible section
```

---

## Parser Error List

```text
Per error:
  - Error code badge (monospace)
  - Message text
  - Line number (if available)
  - Color: text.error, border border.error
```

## Parser Warning List

```text
Collapsible — "N warnings" toggle
Per warning:
  - Warning code
  - Message
  - Line number
  - Color: status.warning
```

---

## Parsing Flow

```text
User pastes Java into Monaco editor
    ↓
User clicks "Generate UML"
    ↓
parserStore.setStatus('loading')
    ↓
parserService.parseJava(source) → POST /api/v1/parser/java
    ↓
API proxies to Java parser service
    ↓
Response returned
    ↓
If success:
  umlStore.setDiagram(result.diagram)
  parserStore.setStatus('success')
  parserStore.setResult(warnings, [])
If failure:
  parserStore.setStatus('error')
  parserStore.setResult(warnings, errors)
```

---

## Implementation Order

1. Install Monaco Editor in `apps/web`
2. `packages/parser-client/src/contracts/parserContracts.ts`
3. `packages/parser-client/src/api/parserApiClient.ts`
4. `apps/web/src/stores/parserStore.ts`
5. `apps/web/src/services/parserService.ts`
6. API route: `POST /api/v1/parser/java` (proxy — returns stub until Unit 10)
7. `apps/web/src/features/java-editor/JavaEditorPanel.tsx`
8. `apps/web/src/features/java-editor/ParserErrorList.tsx`
9. `apps/web/src/features/java-editor/ParserWarningList.tsx`
10. Update `LeftSidebar.tsx` — add Code Import tab

---

## Acceptance Criteria

- [ ] Monaco editor renders with Java syntax highlighting
- [ ] "Generate UML" button triggers `POST /api/v1/parser/java`
- [ ] Loading spinner shows during parsing
- [ ] Parser errors display in structured list with code, message, line
- [ ] Parser warnings display in collapsible section
- [ ] Payload over 1MB is rejected with error before API call
- [ ] API route returns structured response even on parse failure
- [ ] `parserStore` correctly tracks loading / success / error
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- `parserStore` does not mutate `umlStore` directly
- Parser errors are preserved in UI — user input is never cleared on failure
- The Java parser service is never imported directly into `apps/web`
- `packages/parser-client` has no React dependencies

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 9 complete
