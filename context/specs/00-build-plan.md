Full Implementation Plan
Unit 1 — Project Shell and App Layout
What it builds: The base React app shell, dark IDE-like layout, top bar, left sidebar, diagram workspace, and bottom status bar.
Visible result: A working UI frame with the final visual structure, even before any diagram logic exists.
Dependencies that must exist first: None.
Unit 2 — Supabase Auth and User Workspace
What it builds: Supabase sign-in, session handling, protected routes, and a basic user workspace that loads only after authentication.
Visible result: A user can sign in and reach the app workspace.
Dependencies that must exist first: Unit 1.
Unit 3 — Diagram Data Model, Storage Schema, and Create/Open Diagram Flow
What it builds: The canonical UML model types, diagram metadata schema, Supabase tables/queries, create-new-diagram flow, and open-existing-diagram flow.
Visible result: A signed-in user can create a blank diagram and reopen it later.
Dependencies that must exist first: Unit 2.
Unit 4 — Canvas Rendering Skeleton and State Hydration
What it builds: React Flow canvas integration, empty node/edge rendering, layout state, viewport state, and restore-on-load behavior.
Visible result: A blank diagram canvas appears and restores its zoom/pan/layout state after reload.
Dependencies that must exist first: Units 2 and 3.
Unit 5 — Manual Class Creation with Structured Form Editor
What it builds: Class node creation, side-panel form editing, class name, fields, methods, visibility, and full method signature entry.
Visible result: A user can add and edit UML classes manually and see them render on the canvas.
Dependencies that must exist first: Units 3 and 4.
Unit 6 — UML Validation for Manual Editing
What it builds: Validation for duplicate class names, invalid method signatures, invalid visibility values, and self-inheritance prevention.
Visible result: Invalid UML input is rejected with clear errors while valid input saves and renders normally.
Dependencies that must exist first: Unit 5.
Unit 7 — Relationship Creation and Editing
What it builds: Drag-edge relationship creation, relationship type selection, edge rendering for association/inheritance/realization/aggregation/composition, and relationship updates.
Visible result: A user can connect classes with typed UML relationships and edit or remove them.
Dependencies that must exist first: Units 5 and 6.
Unit 8 — Auto-Save, Explicit Save Versions, and Restore State
What it builds: Debounced auto-save, explicit version save, save status UI, dirty-state tracking, and full reload restoration of UML model, layout, and viewport.
Visible result: The canvas returns to the exact same state after reload or returning later.
Dependencies that must exist first: Units 3, 4, 5, and 7.
Unit 9 — Java Input Editor and Parser Service Contract
What it builds: The Java paste editor, parser request/response schema, parser error display, and the API contract between frontend and Java parsing service.
Visible result: A user can paste Java code and request UML generation from the UI.
Dependencies that must exist first: Units 1, 2, and 3.
Unit 10 — Java to UML Parsing and Model Extraction
What it builds: JavaParser-based AST parsing, extraction of classes, interfaces, fields, methods, inheritance, and implemented interfaces, and conversion into the canonical UML model.
Visible result: Pasted Java code generates a UML diagram.
Dependencies that must exist first: Unit 9.
Unit 11 — Post-Generation Editing Parity
What it builds: The same manual editing workflow for generated diagrams, including moving nodes, adding/removing classes, and changing relationships while tracking generated-vs-modified state.
Visible result: A generated diagram becomes editable with the same controls as a manual diagram.
Dependencies that must exist first: Units 5, 7, and 10.
Unit 12 — Error Handling, Status Surfaces, and UX Hardening
What it builds: Parser error banners, save/error indicators, loading states, empty states, and consistent editor feedback for success/failure.
Visible result: The app clearly shows whether parsing, saving, or loading succeeded or failed.
Dependencies that must exist first: Units 4, 8, and 10.
Unit 13 — Testing Coverage for Core Flows
What it builds: Unit tests for method signature parsing, UML validation, relationship rules, parser conversion, and persistence hydration.
Visible result: Core behavior is verified automatically and regressions become visible quickly.
Dependencies that must exist first: Units 5, 6, 7, 8, and 10.
Unit 14 — Documentation Sync and Release Readiness
What it builds: Final alignment of project-overview.md, architecture.md, code-standards.md, ai-workflow-rules.md, and ui-context.md with the implemented system.
Visible result: The repository documentation matches the shipped behavior exactly.
Dependencies that must exist first: All prior units.
Build Order Summary
Shell and layout
Auth and workspace access
Diagram model and persistence schema
Canvas and hydration
Manual class editor
Validation
Relationships
Auto-save, versions, reload restore
Java editor and parser contract
Java to UML extraction
Edit generated diagrams
UX states and error handling
Tests
Documentation sync and release readiness