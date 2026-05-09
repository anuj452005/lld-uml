# Architecture

This project is a developer-focused UML editor with two primary workflows: manual UML creation through structured forms and Java-to-UML generation from pasted code. The application stores diagram state in Supabase, restores the full canvas state on reload, and is designed so the visual editor, semantic UML model, and code parser remain separate layers.

## Stack

| Layer                        | Technology                                  | Role                                                                                                 |
| ---------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Frontend app                 | Next.js (React)                             | Hosts the editor UI, diagram workspace, forms, and navigation.                                       |
| Diagram rendering            | React Flow                                  | Renders nodes, edges, drag/drop behavior, and interactive canvas interactions.                       |
| State management             | Zustand                                     | Holds the UML model, layout state, viewport state, dirty flags, and editor session state.            |
| Code editor                  | Monaco Editor                               | Provides the Java input editor with syntax highlighting and a developer-friendly editing experience. |
| Backend API                  | Node.js + Express.js                        | Exposes application APIs for diagram persistence, versioning, and parser orchestration.              |
| Java parser service          | Java + JavaParser                           | Parses pasted Java source into an AST and converts it into a UML semantic model.                     |
| Auth                         | Supabase Auth                               | Handles sign-in, session creation, and identity verification.                                        |
| Database                     | Supabase Postgres                           | Stores users' diagrams, versions, and metadata.                                                      |
| Cache / client draft storage | Browser storage (localStorage or IndexedDB) | Stores temporary draft state for recovery before server save completes.                              |
| Styling                      | Tailwind CSS                                | Provides the UI styling system for the editor and forms.                                             |

## Tech Stack
### Frontend
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Framework | Next.js (App Router) | Main frontend framework |
| Language | TypeScript | Strong typing and shared models |
| Diagram Engine | React Flow | UML canvas, nodes, and relationships |
| State Management | Zustand | UML model, layout state, viewport state |
| Code Editor | Monaco Editor | Java paste editor |
| Styling | Tailwind CSS | UI styling system |
| Icons | Lucide Icons | Developer-focused icon system |

### Backend
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| API Server | Node.js | Backend APIs |
| Runtime Framework | Express.js | API routing and middleware |
| Authentication | Supabase | User authentication and sessions |
| Database | PostgreSQL via Supabase | Diagram persistence and versioning |
| Local Draft Cache | Browser localStorage / IndexedDB | Unsaved recovery state |

### Java Parsing Service
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Language | Java | Parsing runtime |
| Parser Library | JavaParser | Java AST extraction |
| Communication | REST API | Parser service communication |

### Shared Infrastructure
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Package Manager | npm | Standard package management |
| Structure | Split Directories | Separate `frontend` and `backend` folders |
| Shared Types | Duplicate / Symlink | Canonical UML model types |
| Version Control | Git | Source control |

## System Boundaries

### `frontend/`
Owns the UI and client-side editor behavior.

Responsibilities:
* Render the manual UML editor.
* Render the Java input editor.
* Render the diagram canvas.
* Handle user interactions such as dragging nodes, editing class forms, and selecting relationship types.
* Maintain local editor state in Zustand.
* Trigger auto-save and explicit save actions.
* Hydrate the canvas from persisted state on load.

Does not own:
* Database writes directly.
* Java parsing logic.
* Authentication token verification.

### `backend/`
Owns the application backend.

Responsibilities:
* Accept authenticated requests from the frontend.
* Persist diagram records and versions.
* Return saved diagram state for hydration.
* Orchestrate calls to the Java parser service.
* Enforce ownership checks on all diagram operations.

Does not own:
* Diagram rendering.
* UI validation.
* Browser-local draft storage.

### `services/java-parser`
Owns Java source analysis and UML extraction.

Responsibilities:
* Parse pasted Java source code.
* Extract classes, interfaces, fields, methods, inheritance, and implemented interfaces.
* Convert parsed code into the internal UML semantic model.
* Return parser errors in a structured format.

Does not own:
* Authentication.
* Diagram persistence.
* Canvas rendering.

### `packages/shared-model`

Owns shared UML schema and transformation contracts.

Responsibilities:

* Define the canonical UML model shape.
* Define node, edge, class, method, field, and relationship types.
* Keep parser output and frontend state aligned.

Does not own:

* Network calls.
* UI components.
* Database access.

### `packages/ui`

Owns reusable UI components.

Responsibilities:

* Shared form controls.
* Buttons, panels, dialogs, and sidebars.
* Common editor widgets.

Does not own:

* Persistence.
* Parsing.
* Business rules.

## Storage Model

### Database

Use the database for durable, queryable application state.

Store in the database:

* User-owned diagrams.
* Diagram metadata such as name, source type, language, created_at, updated_at.
* UML semantic model.
* Layout state, including node positions.
* Viewport state, including zoom and pan.
* Version history.
* Dirty/modified state.

Suggested table split:

| Table                                            | Purpose                                                                             |
| ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `diagrams`                                       | Stores diagram identity, ownership, title, timestamps, and current version pointer. |
| `diagram_versions`                               | Stores immutable saved versions of a diagram.                                       |
| `diagram_snapshots` or embedded JSON in versions | Stores the UML model, layout state, and viewport state for a version.               |

### File Storage

The initial product does not require object storage for the core workflow.

Use file storage only if future features need it, such as:

* Exported PNG files.
* Exported PDF files.
* Uploaded attachments.

For the current scope:

* Do not store diagram state in object storage.
* Do not store source code files in object storage.

### Cache / Ephemeral Storage

Use cache or browser-local storage only for short-lived recovery.

Store in cache or browser-local storage:

* Unsaved draft state.
* Last editor session recovery state.
* Temporary autosave fallback if network persistence fails.

Do not store in cache:

* Final source of truth.
* Ownership records.
* Version history.

## Auth and Access Model

Authentication and identity are handled by Supabase Auth.

### Authentication flow

1. The user signs in through Supabase Auth.
2. Supabase issues a session/JWT.
3. The frontend sends authenticated requests to the backend.
4. The backend verifies the session and resolves the user identity.
5. The backend checks that the user owns the requested diagram before reading or writing it.

### Ownership rules

* Every diagram belongs to exactly one user.
* A user can read, update, and version only diagrams they own.
* There is no shared editing in the initial version.
* There is no public diagram access in the initial version.

### Access control implementation

* Enforce row-level security in the database.
* Enforce ownership checks in backend API handlers.
* Reject any request that tries to access a diagram outside the authenticated user's scope.

## AI and Background Task Model

### AI

No AI feature is in scope for the current release.

Do not introduce:

* AI-assisted diagram generation.
* AI code understanding.
* AI relationship suggestions.
* Natural-language diagram editing.

### Background tasks

The current architecture should support light background work only where needed.

Relevant background work:

* Debounced auto-save after user edits.
* Optional export generation in the future.

Not in scope:

* Long-running batch jobs.
* Queues for collaboration sync.
* Multi-user conflict resolution workers.

## Invariants

1. The UML semantic model is the source of truth. The rendered diagram is always derived from the model, never the other way around.
2. Diagram state must be restorable after a reload using persisted data. Node positions, relationships, zoom, and pan must survive a refresh.
3. Every diagram must have a single owner, and every write must be checked against that owner before persistence.
4. Manual editing and code-generated editing must use the same canonical UML model and the same rendering pipeline.
5. The frontend must never bypass the model layer and mutate the canvas as the only state change. UI actions must update the UML model first, then re-render.
6. The Java parser service must not write directly to the database. It only returns parsed UML data or parser errors.
7. Auto-save must never destroy version history. Explicit save creates a new version; auto-save updates the latest working state.
8. The project remains single-user in the current release. No feature may assume live multi-user collaboration exists.
