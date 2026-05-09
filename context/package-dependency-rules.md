# Package Dependency Rules

This document defines the allowed dependency graph, import boundaries, ownership contracts, and package interaction rules for the UML editor project.

The project uses a split-directory structure with independent `frontend` and `backend` projects.

---

# 1. Dependency Philosophy

Dependencies must flow toward stable domain contracts.

The UML semantic model (defined in `context/shared-model-specification.md`) is the architectural center.

Everything depends on the canonical domain model. In this split structure, the domain model is duplicated or symlinked into each project's `src/types/` directory.

---

# 2. Architectural Layering

The architecture follows this dependency direction:

```text
UI Layer (frontend/)
    ↓
Application Layer (backend/)
    ↓
Infrastructure Layer (Supabase / Java Parser)
```

The dependency graph must always remain directional.

Never create reverse dependencies.

---

# 3. Canonical Dependency Graph

```text
frontend/
    ↓
    Internal Modules (src/components, src/features, etc.)
    External APIs (backend/)

backend/
    ↓
    Internal Modules (src/routes, src/services, etc.)
    External APIs (services/java-parser)

services/java-parser
    ↓
    Internal Modules (src/parser, src/transformers)
```

Rules:
- `frontend/` communicates with `backend/` via HTTP APIs only.
- `backend/` communicates with `services/java-parser` via HTTP APIs only.
- No direct code imports between `frontend/`, `backend/`, and `services/`.
- Shared models must be manually kept in sync between `frontend/src/types/` and `backend/src/types/`.

---

# 4. Core Dependency Rules

## 4.1 Shared Model Is the Foundation

All UML entities must follow the specification in `context/shared-model-specification.md`.

Examples:
- UMLClass
- UMLMethod
- UMLField
- UMLRelationship
- UMLDiagram

Rules:
- The model must remain framework-independent.
- The model must not depend on React or React Flow.
- The model must not depend on Supabase SDK.

---

# 5. React Flow Isolation Rules

React Flow types are forbidden outside:
- `frontend/` (specifically in diagram rendering features).

Never expose React Flow node types to the backend or the parser service.

---

# 6. Zustand Isolation Rules

Zustand stores belong ONLY in:
- `frontend/src/stores/`

No other part of the system may depend on Zustand state.

---

# 7. Supabase Isolation Rules

Supabase SDK usage is allowed in:
- `frontend/` (for client-side auth and direct storage if needed).
- `backend/` (for admin operations and ownership validation).

---

# 8. Hard Constraints

1. The UML semantic model is the single source of truth.
2. React Flow nodes and edges are derived view models only.
3. Parser services must remain stateless and isolated.
4. Shared UML types must remain consistent across frontend and backend.
5. No direct imports are allowed across the top-level project boundaries.
6. Circular dependencies are forbidden within each project.
7. Every dependency must follow the defined architectural direction.
8. Infrastructure configuration must remain outside application logic.