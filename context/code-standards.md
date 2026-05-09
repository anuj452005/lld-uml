# Code Standards

This document defines the coding conventions, architectural patterns, folder ownership rules, and implementation standards for the UML editor project. Every feature, module, and API route must follow these rules so the codebase remains consistent, predictable, and maintainable as the project grows.

---

# 1. General Principles

## 1.1 Consistency Over Preference

* Follow the existing project structure before introducing a new pattern.
* Do not introduce multiple ways to solve the same problem.
* Prefer explicit and predictable code over clever abstractions.

## 1.2 Strong Typing

* All application code must be written in TypeScript.
* Avoid `any`.
* Prefer explicit interfaces and type aliases.
* Shared types must live in the shared model package.

## 1.3 Single Responsibility

* Components should focus on rendering.
* Business logic belongs in services, hooks, or stores.
* Parser logic must never exist inside UI components.

## 1.4 Separation of Concerns

The system is divided into:

* UML semantic model
* Diagram rendering layer
* Persistence layer
* Parser layer
* UI layer

No layer may directly bypass another layer's ownership rules.

---

# 2. Technology Standards

| Area             | Standard          |
| ---------------- | ----------------- |
| Language         | TypeScript only   |
| Frontend         | React             |
| Diagram Engine   | React Flow        |
| State Management | Zustand           |
| Styling          | Tailwind CSS      |
| Backend API      | Node.js           |
| Database         | Supabase Postgres |
| Authentication   | Supabase Auth     |
| Java Parsing     | Java + JavaParser |
| Package Manager  | pnpm              |

---

# 3. File and Folder Organization

## 3.1 Frontend Structure (`frontend/src/`)

```text
src/
├── app/           # Next.js App Router (Routing and pages)
├── components/    # Shared reusable UI components
├── features/      # Feature-specific UI and logic
├── hooks/         # Reusable React hooks
├── services/      # API calls and backend communication
├── stores/        # Zustand stores and editor state
├── lib/           # Core utilities and integrations
├── types/         # TypeScript types (including shared UML)
├── utils/         # Pure utility functions
└── styles/        # Global styles and Tailwind setup
```

---

## 3.2 Backend Structure (`backend/src/`)

```text
src/
├── routes/        # API route definitions
├── controllers/   # Request handlers
├── services/      # Business logic and DB orchestration
├── middleware/    # Auth and validation middleware
├── validators/    # Request payload validators
├── types/         # TypeScript types (including shared UML)
└── lib/           # Third-party integrations (Supabase)
```

---

## 3.3 Folder Responsibilities

| Folder | Responsibility |
| ------------- | ----------------------------------- |
| `app/` | Routing and page composition (Frontend) |
| `routes/` | API route definitions (Backend) |
| `components/` | Shared reusable UI components |
| `features/` | Feature-specific UI and logic |
| `hooks/` | Reusable React hooks |
| `services/` | API calls or Business logic |
| `stores/` | Zustand stores and editor state |
| `types/` | TypeScript types |
| `utils/` | Pure utility functions |

Do not place feature-specific code in global folders unless it is reused across multiple features.

---

# 4. Naming Conventions

## 4.1 File Names

| Type            | Convention                    | Example                   |
| --------------- | ----------------------------- | ------------------------- |
| React component | PascalCase                    | `ClassNode.tsx`           |
| Hook            | camelCase with `use` prefix   | `useDiagramState.ts`      |
| Utility         | camelCase                     | `parseMethodSignature.ts` |
| Store           | camelCase with `Store` suffix | `diagramStore.ts`         |
| Types           | PascalCase                    | `UMLClass.ts`             |

---

## 4.2 Variable Naming

| Entity           | Convention       |
| ---------------- | ---------------- |
| Variables        | camelCase        |
| Constants        | UPPER_SNAKE_CASE |
| Types/interfaces | PascalCase       |
| React components | PascalCase       |
| Functions        | camelCase        |

Avoid abbreviations unless universally understood.

Bad:

```ts
const cls = {}
```

Good:

```ts
const umlClass = {}
```

---

# 5. TypeScript Rules

## 5.1 Never Use `any`

Bad:

```ts
const data: any = response
```

Good:

```ts
const data: DiagramResponse = response
```

---

## 5.2 Prefer Explicit Interfaces

Bad:

```ts
function save(data) {}
```

Good:

```ts
interface SaveDiagramPayload {
  diagramId: string
  umlModel: UMLModel
}

function save(payload: SaveDiagramPayload) {}
```

---

## 5.3 Shared Types Must Be Centralized

Canonical UML types must live in:

```text
packages/shared-model/
```

The frontend and backend must import from the same model package.

---

# 6. React Standards

## 6.1 Component Rules

Components must:

* Be functional components.
* Use named exports.
* Be focused on presentation.
* Avoid large business logic blocks.

Bad:

* Parsing Java directly inside components.
* Direct database calls inside components.
* Large inline state mutation logic.

---

## 6.2 Component Size

Rules:

* Prefer components under 200 lines.
* Extract repeated logic into hooks.
* Extract complex rendering into child components.

---

## 6.3 Hooks Rules

Custom hooks:

* Must begin with `use`.
* Must not directly mutate global state.
* Must encapsulate reusable behavior.

Example:

```ts
useAutoSave()
useDiagramHydration()
useViewportSync()
```

---

# 7. Zustand State Management Standards

## 7.1 State Separation

The following state domains must remain separate:

| State             | Responsibility             |
| ----------------- | -------------------------- |
| UML model         | Semantic diagram data      |
| Layout state      | Node positions             |
| Viewport state    | Zoom and pan               |
| UI state          | Modals, panels, selections |
| Persistence state | Save status, dirty state   |

Do not combine unrelated state into a single object.

---

## 7.2 State Updates

State updates must go through store actions.

Bad:

```ts
store.umlModel.classes.push(newClass)
```

Good:

```ts
addClass(newClass)
```

---

# 8. UML Model Standards

## 8.1 UML Model Is the Source of Truth

The semantic UML model owns:

* Classes
* Interfaces
* Fields
* Methods
* Relationships

The diagram renderer must derive visual nodes from the UML model.

The canvas must never become the only source of state.

---

## 8.2 Relationship Rules

Relationships must:

* Have unique IDs.
* Define explicit direction.
* Define a relationship type.
* Reference existing nodes only.

---

## 8.3 Method Signature Standards

Supported format:

```text
login(email: String): boolean
```

Method parsing must:

* Normalize whitespace.
* Validate parameter format.
* Validate return types.
* Reject malformed signatures.

---

# 9. API Standards

## 9.1 API Structure

```text
/apps/api/src/
├── routes/
├── controllers/
├── services/
├── middleware/
├── validators/
└── types/
```

---

## 9.2 Route Rules

Routes:

* Must remain thin.
* Must delegate business logic to services.
* Must validate request input.
* Must verify ownership before mutation.

---

## 9.3 Response Shape

All API responses must follow a consistent structure.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Invalid method signature"
  }
}
```

---

# 10. Validation Standards

Validation must exist at:

* UI layer
* API layer
* Parser layer

Do not trust frontend validation alone.

Examples:

* Prevent self-inheritance.
* Prevent duplicate class names.
* Reject invalid relationships.
* Reject malformed method signatures.

---

# 11. Styling Standards

## 11.1 Tailwind Rules

Use Tailwind utility classes.

Do not:

* Mix multiple styling systems.
* Add inline styles unless dynamic rendering requires them.
* Use deeply nested custom CSS.

---

## 11.2 UI Consistency

All panels, dialogs, forms, and node editors must:

* Use consistent spacing.
* Use shared typography.
* Use reusable UI primitives.
* Use shared color tokens.

---

# 12. Error Handling Standards

## 12.1 Frontend Errors

UI must:

* Show actionable messages.
* Preserve user work.
* Avoid full crashes.

Example:

```text
Invalid Java syntax near line 12
```

Not:

```text
Something went wrong
```

---

## 12.2 Parser Errors

Parser errors must:

* Return structured metadata.
* Include line information where possible.
* Never crash the backend process.

---

# 13. Persistence Standards

## 13.1 Auto-Save

Auto-save must:

* Use debounce.
* Never fire on every keystroke.
* Update the current working state only.

---

## 13.2 Explicit Save

Explicit save must:

* Create a new version.
* Never overwrite version history.

---

## 13.3 Restore Rules

On reload:

* Restore UML model.
* Restore node positions.
* Restore zoom and pan.
* Restore unsaved local draft if remote recovery fails.

---

# 14. Testing Standards

## 14.1 Required Test Areas

The following systems require tests:

| Area                    | Requirement       |
| ----------------------- | ----------------- |
| Method signature parser | Unit tests        |
| UML transformations     | Unit tests        |
| Relationship validation | Unit tests        |
| API routes              | Integration tests |
| Persistence flow        | Integration tests |

---

## 14.2 Parser Tests

Parser tests must include:

* Valid signatures.
* Invalid signatures.
* Multiple parameters.
* Empty parameters.
* Whitespace normalization.

---

# 15. Invariants

The following rules must never be violated.

1. The UML semantic model is the source of truth. The diagram is always derived from it.
2. UI components must never directly mutate shared state objects.
3. The parser service must never write directly to the database.
4. Auto-save must never destroy version history.
5. Every diagram operation must verify ownership before persistence.
6. The frontend and backend must use the same canonical UML types.
7. Relationship edges must always reference valid existing nodes.
8. Manual editing and generated diagrams must use the same rendering pipeline.
9. The application must restore diagram state after reload, including layout and viewport.
10. No feature may assume real-time collaboration exists in the current release.
