# Unit 03 — Diagram Data Model, Storage Schema, and Create/Open Diagram Flow

## Overview

Define the canonical UML model types in `packages/shared-model`, create the Supabase
database schema, and implement the create-new-diagram and open-existing-diagram flows.
This unit establishes the persistence foundation that all editing units rely on.

---

## Goal

A signed-in user can create a blank named diagram, have it persisted to Supabase,
and reopen it later from a list of their diagrams.

---

## Dependencies

- Unit 01 (app shell)
- Unit 02 (auth and session)

---

## Scope

### In Scope

- All canonical UML types in `packages/shared-model` (from `shared-model-specification.md`)
- Supabase database migration for `diagrams`, `diagram_versions`, `diagram_snapshots`
- Row-level security policies for all three tables
- API routes:
  - `POST /api/v1/diagrams` — create diagram
  - `GET /api/v1/diagrams` — list user's diagrams
  - `GET /api/v1/diagrams/:id` — get single diagram
- Diagram list screen (post-auth landing)
- Create diagram modal (name input + source type selection)
- Open diagram navigation

### Out of Scope

- Canvas rendering (Unit 4)
- Class editing (Unit 5)
- Auto-save (Unit 8)

---

## Projects Affected

| Project | Action |
|---|---|
| `frontend/` | Add diagram list screen and types |
| `backend/` | Add diagram routes and Supabase persistence |
| `infrastructure/supabase` | Add migration files |

---

## Shared Model — Canonical Types

All of the following types must be implemented in `frontend/src/types/uml.ts` and `backend/src/types/uml.ts`:

```ts
// Core diagram
interface UMLDiagram {
  id: string
  name: string
  description?: string
  sourceType: DiagramSourceType
  classes: UMLClass[]
  interfaces: UMLInterface[]
  relationships: UMLRelationship[]
  layout: DiagramLayoutState
  viewport: DiagramViewportState
  metadata: DiagramMetadata
  createdAt: string
  updatedAt: string
}

type DiagramSourceType = 'manual' | 'java-generated' | 'mixed'

// Entities
interface UMLEntityBase {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface UMLClass extends UMLEntityBase {
  type: 'class'
  visibility: UMLVisibility
  isAbstract: boolean
  fields: UMLField[]
  methods: UMLMethod[]
  annotations?: string[]
}

interface UMLInterface extends UMLEntityBase {
  type: 'interface'
  methods: UMLMethod[]
}

interface UMLField {
  id: string
  name: string
  type: string
  visibility: UMLVisibility
  isStatic: boolean
  isReadonly: boolean
  defaultValue?: string
}

interface UMLMethod {
  id: string
  signature: string
  name: string
  parameters: UMLMethodParameter[]
  returnType: string
  visibility: UMLVisibility
  isStatic: boolean
  isAbstract: boolean
}

interface UMLMethodParameter { id: string; name: string; type: string }

type UMLVisibility = 'public' | 'private' | 'protected' | 'package'

interface UMLRelationship {
  id: string
  sourceId: string
  targetId: string
  type: UMLRelationshipType
  label?: string
  createdAt: string
}

type UMLRelationshipType =
  | 'association'
  | 'inheritance'
  | 'realization'
  | 'aggregation'
  | 'composition'
  | 'dependency'

// Layout and viewport
interface DiagramLayoutState { nodes: DiagramNodeLayout[] }
interface DiagramNodeLayout { entityId: string; x: number; y: number; width?: number; height?: number }
interface DiagramViewportState { zoom: number; x: number; y: number }
interface DiagramMetadata {
  isModified: boolean
  lastManualEditAt?: string
  generatedFrom?: 'java'
  parserVersion?: string
}
```

Rules:
- All types must be JSON-serializable (no Date, Map, Set, class instances)
- No React, React Flow, Supabase, or Zustand imports in this package

---

## Database Schema

### Migration: `001_create_diagrams.sql`

```sql
CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL CHECK (name <> ''),
  source_type TEXT NOT NULL CHECK (source_type IN ('manual', 'java-generated', 'mixed')),
  current_version_id UUID,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diagrams_owner ON diagrams(owner_id);
```

### Migration: `002_create_diagram_versions.sql`

```sql
CREATE TABLE diagram_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagram_id UUID NOT NULL REFERENCES diagrams(id),
  version_name TEXT,
  snapshot_id UUID NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_versions_diagram ON diagram_versions(diagram_id);
```

### Migration: `003_create_diagram_snapshots.sql`

```sql
CREATE TABLE diagram_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagram_id UUID NOT NULL REFERENCES diagrams(id),
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('working', 'version', 'autosave')),
  uml_model JSONB NOT NULL,
  layout_state JSONB NOT NULL,
  viewport_state JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_snapshots_diagram ON diagram_snapshots(diagram_id);
```

### RLS Policies

```sql
-- diagrams: owner-only access
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner access" ON diagrams
  USING (auth.uid() = owner_id);

-- diagram_versions and diagram_snapshots: same pattern
```

---

## API Routes

### POST /api/v1/diagrams

Request:
```json
{ "name": "My Diagram", "sourceType": "manual" }
```

Response:
```json
{ "success": true, "data": { "diagramId": "uuid" } }
```

### GET /api/v1/diagrams

Response:
```json
{ "success": true, "data": { "diagrams": [{ "id": "uuid", "name": "...", "sourceType": "manual", "updatedAt": "..." }] } }
```

### GET /api/v1/diagrams/:id

Response:
```json
{ "success": true, "data": { "diagram": { ...UMLDiagram } } }
```

All routes require authenticated JWT. Ownership verified before any data returned.

---

## Frontend Screens

### Diagram List Screen (`/workspace`)

```text
Header: "My Diagrams" + "New Diagram" button
Body: grid or list of diagram cards
Each card: name, source type badge, updated_at
Click card: navigate to /workspace/:diagramId
Empty state: "No diagrams yet. Create your first one."
```

### Create Diagram Modal

```text
Trigger: "New Diagram" button
Form:
  - Diagram name input (required)
  - Source type selector: Manual | Java Generated
Buttons:
  - "Create" (primary)
  - "Cancel" (secondary)
On success: navigate to /workspace/:newDiagramId
```

---

## Implementation Order

1. `packages/shared-model/src/` — all canonical types
2. `infrastructure/supabase/migrations/` — 3 migration files + RLS
3. `apps/api/src/` — Supabase server client, diagram service, routes
4. `apps/web/src/services/diagramService.ts` — API calls
5. `apps/web/src/features/diagrams/DiagramListPage.tsx`
6. `apps/web/src/features/diagrams/CreateDiagramModal.tsx`
7. Update router in `App.tsx`

---

## Acceptance Criteria

- [ ] All shared model types defined and exported from `packages/shared-model`
- [ ] All three Supabase tables created with correct schema
- [ ] RLS prevents users from reading other users' diagrams
- [ ] User can create a diagram with a name
- [ ] Diagram list shows only the authenticated user's diagrams
- [ ] User can click a diagram and navigate to the editor route
- [ ] Empty state shown when no diagrams exist
- [ ] API returns structured errors on failure
- [ ] No raw hex values in components
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- `packages/shared-model` must never import React, React Flow, or Supabase
- Frontend must never write directly to database tables
- Every API route must verify ownership via `auth.uid() = owner_id`
- No React Flow types may exist in shared model

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 3 complete
