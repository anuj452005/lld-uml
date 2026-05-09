# State Management Architecture

This document defines the canonical state architecture for the UML editor project.

The purpose of this document is to:

- prevent state ownership confusion
- preserve UML semantic integrity
- isolate rendering state from business state
- prevent React Flow from becoming the source of truth
- standardize Zustand store structure
- define event flow and mutation rules

This file is mandatory for all frontend implementation work.

---

# 1. Core Principle

The UML semantic model is the single source of truth.

The rendered diagram is always derived from the UML semantic model.

Never reverse this relationship.

Correct:

```text
UML Model
    ↓
Transformation Layer
    ↓
React Flow Nodes/Edges
```

Forbidden:

```text
React Flow Nodes
    ↓
Business State
```

---

# 2. State Domains

The application state is divided into independent domains.

Each domain has one responsibility only.

---

# 3. Canonical State Domains

| State Domain | Responsibility |
|---|---|
| UML Semantic State | Classes, interfaces, methods, relationships |
| Layout State | Node coordinates and dimensions |
| Viewport State | Zoom and pan |
| UI State | Panels, modals, selections |
| Persistence State | Dirty flags, save status |
| Session State | Auth/session identity |
| Parser State | Parsing/loading/errors |
| Recovery State | Draft recovery and sync |

These domains must remain isolated.

---

# 4. Zustand Store Structure

Recommended structure:

```text
apps/web/src/stores/
├── umlStore.ts
├── layoutStore.ts
├── viewportStore.ts
├── uiStore.ts
├── persistenceStore.ts
├── parserStore.ts
├── sessionStore.ts
└── recoveryStore.ts
```

Do NOT create a single giant global store.

---

# 5. UML Semantic Store

File:

```text
umlStore.ts
```

Responsibilities:

- UML entities
- class creation
- class updates
- relationship management
- semantic validation triggers

Owns:

- UMLDiagram
- UMLClass
- UMLRelationship
- UMLMethod
- UMLField

Must NOT own:

- React Flow nodes
- viewport state
- modal state
- persistence queues

---

# 6. Layout Store

File:

```text
layoutStore.ts
```

Responsibilities:

- node coordinates
- node dimensions
- auto-layout positioning

Must NOT own:

- semantic UML entities
- relationships
- parser state

---

# 7. Viewport Store

File:

```text
viewportStore.ts
```

Responsibilities:

- zoom
- pan
- viewport restoration

Must remain fully isolated.

---

# 8. UI Store

File:

```text
uiStore.ts
```

Responsibilities:

- modal visibility
- selected node
- selected edge
- panel visibility
- hover states

Must NOT contain:

- persistence logic
- parser output
- semantic UML state

---

# 9. Persistence Store

File:

```text
persistenceStore.ts
```

Responsibilities:

- autosave status
- dirty tracking
- save queue state
- retry state
- sync status

Example:

```ts
type SaveStatus =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "error"
```

---

# 10. Parser Store

File:

```text
parserStore.ts
```

Responsibilities:

- parser loading state
- parser warnings
- parser errors
- parser request lifecycle

Must NOT:

- directly mutate persistence state
- directly mutate React Flow state

---

# 11. Session Store

File:

```text
sessionStore.ts
```

Responsibilities:

- authenticated user
- auth loading
- session refresh state

Must NOT contain:

- diagram state
- persistence queues

---

# 12. Recovery Store

File:

```text
recoveryStore.ts
```

Responsibilities:

- local draft recovery
- restore conflicts
- offline recovery metadata

---

# 13. Event Flow Architecture

All state updates must follow this flow.

```text
UI Action
    ↓
Store Action
    ↓
Validation
    ↓
Semantic State Update
    ↓
Derived View Transformation
    ↓
Persistence Queue
```

Never bypass validation.

Never mutate rendered state directly.

---

# 14. React Flow Integration Rules

React Flow nodes and edges are DERIVED VIEW MODELS ONLY.

They must be generated from:

```text
UML semantic state
+
layout state
```

Never persist React Flow nodes directly.

Never store business state only inside React Flow nodes.

---

# 15. Derived View Pipeline

Correct flow:

```text
UMLDiagram
    ↓
transformDiagramToFlow()
    ↓
React Flow Nodes/Edges
```

The transformation must remain pure.

---

# 16. Mutation Rules

All state mutations must happen through explicit store actions.

Forbidden:

```ts
store.diagram.classes.push(newClass)
```

Correct:

```ts
addClass(newClass)
```

---

# 17. Validation Flow

Validation occurs BEFORE semantic state mutation.

Correct:

```text
UI Input
    ↓
Validation
    ↓
Store Mutation
```

Forbidden:

```text
Mutation
    ↓
Validation
```

---

# 18. Persistence Trigger Rules

Persistence must trigger AFTER semantic updates.

Correct:

```text
Semantic Update
    ↓
Dirty State
    ↓
Debounced Autosave
```

Never persist partial invalid state.

---

# 19. Autosave Architecture

Autosave must:

- debounce updates
- deduplicate saves
- cancel stale requests
- preserve responsiveness

Recommended debounce:

```text
800ms–1500ms
```

---

# 20. Save Queue Rules

Only one save operation may execute at a time.

If a new save occurs:

- older pending requests may cancel
- latest valid state wins

---

# 21. Recovery Priority Rules

Recovery order:

```text
1. Explicit saved version
2. Latest autosave
3. Local draft
4. Empty fallback
```

Never discard semantic UML data first.

---

# 22. Large Diagram Performance Rules

For large diagrams:

- memoize node rendering
- memoize selectors
- avoid full rerenders
- isolate updates by domain

Avoid:

```text
single giant rerender loop
```

---

# 23. Store Communication Rules

Stores may communicate through:

- selectors
- actions
- controlled subscriptions

Avoid:

- direct store mutation
- hidden side effects
- cyclical subscriptions

---

# 24. Async Rules

Async behavior belongs in:

- services
- persistence orchestration
- parser orchestration

Avoid large async blocks inside UI components.

---

# 25. Error Handling Rules

State errors must:

- fail safely
- preserve semantic data
- preserve unsaved work

Never:

- clear state silently
- reset diagrams automatically

---

# 26. Hard Constraints

1. The UML semantic model is the source of truth.
2. React Flow nodes are derived view models only.
3. Semantic state must remain isolated from rendering state.
4. All mutations must happen through explicit store actions.
5. Validation must occur before mutation.
6. Persistence must occur after semantic updates.
7. Autosave must never overwrite explicit versions.
8. Store domains must remain isolated.
9. Async logic must not live inside rendering components.
10. State recovery must prioritize preserving user work.