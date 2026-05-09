# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Unit 2 Completed: Supabase Auth and User Workspace

## Current Goal

- Frontend authentication system fully integrated
- Session state managed via Zustand
- Protected routes enforced
- Ready for Unit 3 (Diagram Data Model and Storage Schema)

## Completed

- ✅ **Unit 1: Project Shell and App Layout (Next.js)**
  - Initializing `frontend/` with Next.js + Tailwind + Lucide.
  - Configuring design tokens in Tailwind.
  - Implementing AppShell and layout components (TopNav, Sidebar, Workspace).

- ✅ **Unit 3: Diagram Data Model and Storage Schema**
  - Defined canonical UML types in both frontend and backend.
  - Created Supabase migrations for `diagrams`, `diagram_versions`, and `diagram_snapshots`.
  - Implemented backend service layer and API routes for diagram CRUD.
  - Implemented frontend `DiagramService` and workspace list page.
  - Enabled creation of new diagrams and navigation to the editor.

## In Progress

- [/] **Unit 4: React Flow Canvas Integration**
  - Setting up React Flow in the `DiagramWorkspace`.
  - Implementing the Graph Adapter to transform canonical UML models into React Flow elements.

## Next Up

- **Unit 3: Diagram Data Model and Storage Schema**
  - Supabase database schema setup (diagrams, diagram_versions, diagram_snapshots tables)
  - Row-level security (RLS) policies
  - Backend API scaffolding
  - Ownership validation logic

## Open Questions

- None currently

## Architecture Decisions

- Used Zustand for state management (future) — scaffolded store structure
- Design tokens centralized in `packages/ui` — all apps import from this
- Monorepo uses pnpm workspaces + Turborepo for incremental builds
- React Flow canvas will integrate in Unit 4 (currently a placeholder)
- Java parser service separate from main monorepo (services/java-parser, future)

## Session Notes

- Unit 1 establishes the visual foundation: IDE-like dark theme, fixed layout, semantic token system
- Unit 2 establishes authentication layer:
  - Zustand session store owns ONLY user identity (user, isLoading, isAuthenticated)
  - sessionStore does NOT own diagram state, workspace state, or persistence state (separate stores in future units)
  - AuthProvider wraps entire app tree to listen for auth changes
  - ProtectedRoute redirects unauthenticated users to /sign-in
  - Routes: /sign-in (public), /sign-up (public), /workspace (protected), / (redirect)
  - User email displayed in TopNav with sign-out button
- All semantic tokens used throughout auth pages — no raw hex values
- Dependency direction maintained: App → AuthProvider → AuthService → Supabase SDK
- Ready for Unit 3 (database schema and backend APIs)
