# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Unit 6 Completed: UML Validation and Constraints

## Current Goal

- Implement relationship management and edge persistence (Unit 7)
- Enable drawing connections between classes with type-specific arrows
- Persist relationship data to Supabase

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

- ✅ **Unit 4: React Flow Canvas Integration**
  - Integrated React Flow in `DiagramWorkspace`.
  - Implemented Zustand stores for semantic model, layout, and viewport.
  - Implemented the Graph Adapter/Transformer to derive Flow elements from UML data.
  - Implemented reload-safe state hydration from the persisted snapshot.

- ✅ **Unit 5: Manual Class Creation and Form Editor**
  - Implemented the `UMLClassNode` renderer with title, fields, and methods compartments.
  - Created the slide-over `ClassEditorPanel` with structured forms.
  - Implemented field and method editors with signature parsing.
  - Integrated "Add Class" button in both sidebar and floating toolbar.
  - Wired node selection and dragging to store mutations.

- ✅ **Unit 6: UML Validation and Constraints**
  - Implemented shared validation logic for class names, fields, and methods.
  - Integrated real-time validation feedback in `ClassEditorPanel`.
  - Added signature validation for methods with auto-parsing.
  - Enforced server-side validation using Zod schemas in API routes.
  - Added store-level semantic checks to prevent invalid UML structures.
  - Implemented circular inheritance detection.
  - Verified both frontend and backend type-check/build commands pass.

## Next Up

- **Unit 7: Relationship Management and Edge Persistence**
  - Enable dragging edges between nodes.
  - Relationship type selection (Inheritance, Composition, etc.).
  - Persisting edges to the database.

## Open Questions

- None currently

## Architecture Decisions

- **Duplication with Sync**: Canonical UML types and validation logic are duplicated between frontend and backend to maintain isolation while ensuring consistency.
- **Store-Level Guarding**: Store actions perform semantic validation before committing state changes.
- **Zod API Contracts**: All diagram update payloads are strictly validated via Zod on the backend.
- **React Flow as Derived View**: React Flow nodes and edges are strictly derived from the semantic UML model; they are never the source of truth.
