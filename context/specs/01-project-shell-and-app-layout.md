# Unit 01 — Project Shell and App Layout

## Overview

Build the base monorepo scaffold and the dark IDE-like application shell.
This unit produces the visible UI frame that all subsequent units populate.
No diagram logic exists yet — only structure and layout.

---

## Goal

A working browser renders the full application chrome:
top navigation, collapsible left sidebar, diagram workspace area, and bottom status bar.
All visual tokens and typography are in place.

---

## Dependencies

None. This is the first unit.

---

## Scope

### In Scope

- Initialize the `frontend/` directory with Next.js (App Router)
- Initialize the `backend/` directory with Express.js + TypeScript
- Create a `services/java-parser` scaffold
- Configure Tailwind CSS in `frontend/` with the design token system from `ui-context.md`
- Build the application shell layout in Next.js:
  - Top navigation bar (56px fixed height)
  - Left sidebar (280px fixed width, collapsible)
  - Diagram workspace (fills remaining space)
  - Bottom status bar (28px fixed height)
- Apply Inter (UI) and JetBrains Mono (code) fonts
- Set all background, border, and text tokens as Tailwind CSS custom tokens

### Out of Scope

- Authentication
- Diagram logic
- Zustand stores
- Any real data

---

## Folders Affected

| Folder | Action |
|---|---|
| `frontend/` | Create — Next.js app shell |
| `backend/` | Create — Express API scaffold |
| `services/java-parser` | Create — Java parser scaffold |

---

## Folder Structure

```text
uml-editor/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx (AppShell)
│   │   │   └── page.tsx (Home)
│   │   ├── components/
│   │   │   ├── TopNav.tsx
│   │   │   ├── LeftSidebar.tsx
│   │   │   ├── DiagramWorkspace.tsx
│   │   │   └── BottomStatusBar.tsx
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── types/
│   │       └── uml.ts (Shared Model copy)
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   └── types/
│   │       └── uml.ts (Shared Model copy)
│   ├── tsconfig.json
│   └── package.json
└── services/
    └── java-parser/
```

---

## Design Token Setup

Tailwind must map all tokens from `ui-context.md`:

```ts
// tailwind.config.ts
colors: {
  bg: {
    canvas: '#0D1117',
    surface: {
      primary: '#161B22',
      secondary: '#1C2128',
      tertiary: '#21262D',
    },
    overlay: '#0B0F14CC',
  },
  border: {
    primary: '#30363D',
    secondary: '#21262D',
    active: '#388BFD',
    error: '#F85149',
  },
  text: {
    primary: '#E6EDF3',
    secondary: '#9DA7B3',
    tertiary: '#6E7681',
    inverse: '#0D1117',
    error: '#FF7B72',
  },
  accent: {
    primary: '#388BFD',
  },
  status: {
    success: '#3FB950',
    warning: '#D29922',
    error: '#F85149',
    info: '#58A6FF',
  },
  diagram: {
    node: { background: '#161B22', border: '#30363D', selected: '#388BFD' },
    edge: { default: '#6E7681', active: '#58A6FF' },
    grid: '#161B22',
  },
}
```

---

## Layout Specification

### TopNav

```text
Height: 56px
Background: bg.surface.primary
Border-bottom: border.primary
Contains: [Logo/App Name] [spacer] [Save Status] [User Menu]
```

### LeftSidebar

```text
Width: 280px
Background: bg.surface.primary
Border-right: border.primary
Collapsible: yes — toggle button in sidebar header
Contains: [placeholder sections]
```

### DiagramWorkspace

```text
Fills: remaining width and height
Background: bg.canvas
Contains: [placeholder — React Flow canvas in Unit 4]
```

### BottomStatusBar

```text
Height: 28px
Background: bg.surface.primary
Border-top: border.primary
Font: text.xs, text.tertiary
Contains: [Save Status] [Parser Status] [Zoom Level]
```

---

## Implementation Order

1. `frontend/` — initialize Next.js
2. `frontend/tailwind.config.ts` — full token map
3. `frontend/src/app/globals.css` — font imports, base reset
4. `frontend/src/components/TopNav.tsx`
5. `frontend/src/components/LeftSidebar.tsx`
6. `frontend/src/components/DiagramWorkspace.tsx`
7. `frontend/src/components/BottomStatusBar.tsx`
8. `frontend/src/app/layout.tsx` — compose all layout pieces (AppShell)
9. `backend/` — initialize Express + TypeScript
10. `backend/src/index.ts` — basic health check

---

## Acceptance Criteria

- [ ] App renders in browser with dark background (`#0D1117`)
- [ ] Top nav is 56px tall with correct background and border
- [ ] Left sidebar is 280px wide and collapsible
- [ ] Diagram workspace fills remaining space
- [ ] Bottom status bar is 28px tall
- [ ] Inter font loads for UI text
- [ ] JetBrains Mono font loads for code areas
- [ ] No raw hex values in components — tokens only
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- No business logic in layout components
- No state management beyond sidebar collapse toggle
- No Supabase or network calls

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 1 complete
