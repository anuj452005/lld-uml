# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Unit 9 Completed: Java Editor and Parser Contract

## Current Goal

- Implement Java parsing logic (Unit 10)
- Extract UML from Java source code automatically from Java AST

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

- ✅ **Unit 7: Relationship Creation and Editing**
  - Added explicit relationship mutations to the UML store with validation-first guards.
  - Extended the React Flow transform to derive custom relationship edges from the semantic model.
  - Implemented all six UML edge renderers with semantic color tokens and custom markers.
  - Added relationship type selection and relationship editing UI surfaces.
  - Wired canvas connection and edge click handling into the derived model flow.
  - Fixed frontend validation barrel imports so the build compiles successfully.

- ✅ **Unit 8: Auto-Save, Versions, and Restore**
  - Created new `@repo/persistence` package with `SaveQueue` class for debounced operations.
  - Fully implemented `persistenceStore` with dirty state, save status, retry count, and error tracking.
  - Implemented `persistenceService` with four API methods: saveWorkingSnapshot, createVersion, getVersions, restoreVersion.
  - Implemented `useAutoSave` hook subscribing to diagram changes with 1.5s debounce via SaveQueue.
  - Implemented `useSaveVersion` hook for explicit version creation orchestration.
  - Created `PersistenceController` backend handlers for all persistence operations with ownership validation.
  - Added backend routes: PUT /:id (save snapshot), POST /:id/versions (create version), GET /:id/versions (list), POST /versions/:id/restore.
  - Created `SaveVersionModal` and `VersionListPanel` components for UI.
  - Enhanced `TopNav` with save status indicator and version management buttons.
  - Enhanced `BottomStatusBar` with compact save status display.
  - Wired `useAutoSave` hook into `DiagramWorkspace` for automatic background saving.
  - Verified frontend build and backend startup with all new routes working.

- ✅ **Unit 9: Java Editor and Parser Contract**
  - Installed Monaco Editor for high-fidelity Java code editing.
  - Created `@repo/parser-client` shared package for standardized API contracts.
  - Implemented `parserStore` for reactive tracking of parse lifecycles and results.
  - Implemented `parserService` orchestrating the bridge between the editor and the UML model.
  - Created backend proxy route `POST /api/v1/parser/java` for service isolation.
  - Implemented sidebar tab system to toggle between UML structure and Java import views.
  - Implemented structured error and collapsible warning UI components.
  - Verified end-to-end wire protocol between frontend and backend proxy.

## Next Up

- **Unit 10: Java Parser Service Implementation**
  - Implement the actual Java parsing logic using a Java-based service.
  - Translate Java AST to canonical UML semantic model.
  - Handle complex Java structures (inheritance, fields, methods, interfaces).

## Open Questions

- None currently

## Architecture Decisions

- **Duplication with Sync**: Canonical UML types and validation logic are duplicated between frontend and backend to maintain isolation while ensuring consistency.
- **Store-Level Guarding**: Store actions perform semantic validation before committing state changes.
- **Zod API Contracts**: All diagram update payloads are strictly validated via Zod on the backend.
- **React Flow as Derived View**: React Flow nodes and edges are strictly derived from the semantic UML model; they are never the source of truth.
- **SaveQueue in Separate Package**: Debouncing and cancellation logic isolated in `@repo/persistence` for testability and reusability.
- **Auto-Save Never Creates Versions**: Working snapshot updates via PUT; only explicit "Save Version" POST creates immutable version records.
- **Append-Only Versioning**: Versions are immutable; restore creates a new working snapshot but never modifies version records.
- **Parser Isolation**: The Java parser is treated as a stateless external service, accessed via a backend proxy to prevent leaking parsing internals into the frontend.
- **Contract-First Communication**: Standardized request/response shapes in `@repo/parser-client` ensure type safety across the entire stack.
- **Stateless Parsing**: The parser takes source code and returns a UML model; it does not manage state or persistence itself.
- **Preserve Source on Failure**: The editor retains user input on parse failure to allow for manual correction.
