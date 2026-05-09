# Project Structure

This document defines the canonical repository structure, folder ownership rules, and module placement strategy for the UML editor project.

The project follows a split-directory structure with a separate `frontend` and `backend`, avoiding complex monorepo management tools as per user request.

---

## Root Repository Structure

```text
uml-editor/
├── frontend/          # Next.js Application
├── backend/           # Express.js API
├── services/          # Independent services (e.g., Java Parser)
├── infrastructure/    # Deployment and infra configuration
├── context/           # AI-readable architecture and project context
├── docs/              # Human-oriented documentation
├── .github/           # CI/CD workflows
└── README.md
```

---

## Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `frontend/` | User-facing Next.js application |
| `backend/` | Application backend and API |
| `services/` | Independent backend/runtime services (Java Parser) |
| `infrastructure/` | Deployment and infra configuration |
| `context/` | AI-readable architecture and project context |
| `docs/` | Human-oriented documentation |

---

## frontend/ Ownership

```text
frontend/
├── src/
│   ├── app/           # Next.js App Router (pages/layouts)
│   ├── components/    # Reusable UI components
│   ├── features/      # Feature-specific modules
│   ├── hooks/         # Custom React hooks
│   ├── services/      # Client-side API services
│   ├── stores/        # Zustand state stores
│   ├── types/         # TypeScript types (including shared UML)
│   └── styles/        # Global styles and Tailwind config
├── public/            # Static assets
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

Responsibilities:
- React frontend (Next.js)
- Editor UI & React Flow rendering
- Zustand state management
- Authentication UI
- Diagram interaction and persistence triggers

---

## backend/ Ownership

```text
backend/
├── src/
│   ├── routes/        # API route definitions
│   ├── controllers/   # Request handlers
│   ├── services/      # Business logic and DB orchestration
│   ├── middleware/    # Auth and validation middleware
│   ├── types/         # TypeScript types (including shared UML)
│   └── lib/           # Third-party integrations (Supabase)
├── tsconfig.json
└── package.json
```

Responsibilities:
- Authenticated APIs
- Persistence orchestration and ownership validation
- Version management
- Parser service orchestration

---

## services/java-parser Ownership

```text
services/java-parser/
├── src/
│   ├── parser/        # Java parsing logic
│   ├── transformers/  # AST to UML transformation
│   └── contracts/     # Parser input/output contracts
├── build.gradle       # Java build configuration
└── README.md
```

Responsibilities:
- Java parsing and UML extraction
- Parser error generation
- Stateless transformation service

---

## Shared Type Strategy

Instead of a shared monorepo package, we use a **Duplication with Sync** strategy:
1. Canonical types are defined in `context/shared-model-specification.md`.
2. Types are implemented in `frontend/src/types/uml.ts` and `backend/src/types/uml.ts`.
3. Any change to the semantic model must be updated in both locations.

---

## Hard Constraints

1. The UML semantic model remains the single source of truth.
2. `frontend` and `backend` must remain independent projects with their own `package.json`.
3. No relative imports are allowed between `frontend` and `backend`.
4. All communication between frontend and backend must happen via HTTP APIs.
5. Infrastructure configuration (Supabase migrations, Docker) must remain in the `infrastructure/` folder.