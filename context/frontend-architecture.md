# Frontend Architecture

This document defines the frontend architecture, rendering pipeline, feature boundaries, UI orchestration flow, and React application structure for the UML editor project.

The frontend is responsible for:

- rendering the UML workspace
- orchestrating editor interactions
- maintaining local editor state
- transforming semantic UML into visual diagrams
- managing editor workflows
- handling recovery and autosave UX

The frontend is NOT responsible for:

- parser implementation
- direct database ownership
- persistence authority
- business rule ownership duplication

The UML semantic model remains the canonical source of truth.

---

# 1. Frontend Philosophy

The frontend architecture must remain:

- feature-oriented
- state-isolated
- deterministic
- strongly typed
- rendering-efficient
- architecture-safe

The frontend must preserve strict separation between:

```text
Semantic State
Visual Rendering
Persistence State
UI State
```

---

# 2. Frontend Technology Stack

| Area | Technology |
|---|---|
| Framework | React |
| Language | TypeScript |
| State Management | Zustand |
| Diagram Engine | React Flow |
| Styling | Tailwind CSS |
| Editor | Monaco Editor |
| Routing | React Router |
| Build Tool | Vite |

---

# 3. Frontend Root Structure

```text
apps/web/src/
├── app/
├── components/
├── features/
├── hooks/
├── layouts/
├── services/
├── stores/
├── lib/
├── utils/
├── styles/
├── types/
└── providers/
```

---

# 4. Folder Ownership Rules

| Folder | Responsibility |
|---|---|
| `app/` | routing and app bootstrapping |
| `components/` | reusable shared components |
| `features/` | feature-owned modules |
| `hooks/` | reusable hooks |
| `layouts/` | application layouts |
| `services/` | API communication |
| `stores/` | Zustand stores |
| `lib/` | framework integrations |
| `utils/` | pure utilities |
| `providers/` | React providers |

---

# 5. Feature-Oriented Structure

Large features must remain isolated.

Example:

```text
features/diagram-editor/
├── components/
├── hooks/
├── services/
├── stores/
├── transformers/
├── utils/
├── validators/
└── types/
```

Feature internals must not leak globally unless reused.

---

# 6. Application Layout

Canonical layout:

```text
┌─────────────────────────────────────────────┐
│ Top Navigation                              │
├──────────────┬──────────────────────────────┤
│ Left Sidebar │ Diagram Workspace            │
│              │                              │
│              │                              │
├──────────────┴──────────────────────────────┤
│ Bottom Status Bar                           │
└─────────────────────────────────────────────┘
```

Must match:

- `ui-context.md`

---

# 7. Frontend Rendering Pipeline

The rendering flow MUST remain:

```text
UML Semantic Model
    ↓
Transformation Layer
    ↓
React Flow Nodes/Edges
    ↓
Canvas Rendering
```

Never reverse this flow.

Forbidden:

```text
React Flow Nodes
    ↓
Business State
```

---

# 8. Semantic State Ownership

Semantic UML state belongs ONLY to:

```text
umlStore.ts
```

The semantic state owns:

- classes
- interfaces
- methods
- fields
- relationships

React components must not own canonical UML state.

---

# 9. Rendering State Ownership

Rendering state includes:

- node positions
- dimensions
- viewport
- hover state
- selections

This state must remain isolated from semantic UML entities.

---

# 10. React Flow Rules

React Flow is a rendering engine only.

It must NOT become:

- the source of truth
- the persistence source
- the semantic graph owner

Allowed:

```text
visual interaction orchestration
```

Forbidden:

```text
semantic ownership
```

---

# 11. Node Transformation Rules

Transformation responsibilities belong to:

```text
packages/diagram-engine
```

Responsibilities:

- UML → node transformation
- relationship → edge transformation
- layout mapping

Transformations must remain PURE.

---

# 12. Pure Transformation Rules

Correct:

```ts
transformDiagramToFlow(diagram)
```

Forbidden:

```ts
transformDiagramToFlowAndSave()
```

No side effects allowed.

---

# 13. Component Architecture

Components must remain:

- presentation-focused
- isolated
- small
- reusable

Avoid:

- large state orchestration
- parser logic
- persistence logic
- heavy async flows

---

# 14. Component Size Rules

Recommended:

| Component Type | Max Size |
|---|---|
| UI Primitive | 100 lines |
| Feature Component | 200 lines |
| Complex Container | 300 lines |

Extract logic into hooks/services when exceeded.

---

# 15. Hook Architecture

Hooks own reusable orchestration logic.

Examples:

```text
useAutoSave()
useDiagramHydration()
useDiagramSelection()
useViewportSync()
```

Hooks must NOT:

- mutate external state silently
- perform unrelated responsibilities
- duplicate service logic

---

# 16. Service Layer Rules

Frontend services own:

- API communication
- parser requests
- persistence requests
- auth communication

Services must remain framework-independent where possible.

---

# 17. Async Flow Rules

Async behavior belongs in:

- services
- orchestrator hooks
- persistence coordinators

Avoid async-heavy UI components.

---

# 18. Validation Flow

Validation order:

```text
User Input
    ↓
Validation
    ↓
State Mutation
    ↓
Derived Rendering
```

Never persist invalid semantic UML.

---

# 19. Diagram Editing Flow

Correct flow:

```text
User Action
    ↓
Store Action
    ↓
Validation
    ↓
Semantic Update
    ↓
View Transformation
    ↓
React Flow Render
```

---

# 20. Persistence Flow

Correct flow:

```text
Semantic Update
    ↓
Dirty State
    ↓
Debounced Autosave
    ↓
API Request
```

Never persist directly from UI components.

---

# 21. Recovery Flow

Recovery order:

```text
1. Explicit version
2. Remote autosave
3. Local draft
4. Empty fallback
```

Recovery must prioritize preserving semantic UML state.

---

# 22. UI State Rules

UI state includes:

- selected node
- open panels
- modals
- hover state
- context menus

UI state must NEVER own business rules.

---

# 23. Monaco Editor Rules

Monaco is used ONLY for:

- Java source editing
- syntax highlighting
- parser input workflows

Monaco content must normalize into parser contracts before usage.

---

# 24. Accessibility Rules

Required:

- keyboard navigation
- visible focus states
- semantic labels
- accessible dialogs

Avoid inaccessible custom interactions.

---

# 25. Error Handling Rules

Frontend failures must:

- preserve user work
- preserve semantic UML state
- provide structured feedback

Never:

- clear editor automatically
- silently reset diagrams

---

# 26. Performance Rules

Large diagrams require:

- memoized selectors
- memoized node rendering
- isolated subscriptions
- minimized rerenders

Avoid:

```text
global rerender loops
```

---

# 27. Frontend Security Rules

Never trust:

- frontend ownership
- parser payloads
- client-only validation

All critical validation must exist server-side too.

---

# 28. Responsive Rules

Primary target:

```text
Desktop-first
```

Minimum supported width:

```text
1280px
```

Mobile editing optimization is NOT required initially.

---

# 29. Hard Constraints

1. The UML semantic model is the source of truth.
2. React Flow nodes remain derived view models only.
3. Semantic state must remain isolated from rendering state.
4. Components must remain presentation-focused.
5. Async orchestration must remain outside rendering components.
6. Validation must occur before state mutation.
7. Persistence must never originate directly from UI components.
8. Recovery flows must prioritize preserving user work.
9. Frontend services must not own parser implementation.
10. React Flow must never become the canonical business state.