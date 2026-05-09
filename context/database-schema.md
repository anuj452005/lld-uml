# Database Schema

This document defines the canonical persistence schema for the UML editor project.

The database is responsible for:

- diagram ownership
- diagram persistence
- autosave state
- immutable versions
- recovery metadata
- authentication linkage

The database is NOT responsible for:

- rendering state derivation
- parser execution
- React Flow state ownership

---

# 1. Persistence Philosophy

Persistence must preserve:

- semantic UML state
- layout state
- viewport state
- version history

The semantic UML model is the canonical persisted state.

React Flow nodes and edges must never be persisted directly.

---

# 2. Database Technology

Database:

```text
Supabase Postgres
```

Authentication:

```text
Supabase Auth
```

Access control:

```text
Postgres Row-Level Security (RLS)
```

---

# 3. Core Tables

```text
diagrams
diagram_versions
diagram_snapshots
```

Optional future tables:

```text
diagram_recovery
parser_jobs
exports
```

Do NOT implement future tables now.

---

# 4. diagrams Table

Purpose:

- diagram identity
- ownership
- latest version pointer
- metadata

Schema:

```sql
CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_id UUID NOT NULL,

  name TEXT NOT NULL,

  source_type TEXT NOT NULL,

  current_version_id UUID,

  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

# 5. diagrams Constraints

Rules:

- every diagram has exactly one owner
- name cannot be empty
- soft delete only
- source_type constrained to valid values

Allowed source types:

```text
manual
java-generated
mixed
```

---

# 6. diagram_versions Table

Purpose:

- immutable version history
- explicit saves
- version restore

Schema:

```sql
CREATE TABLE diagram_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  diagram_id UUID NOT NULL REFERENCES diagrams(id),

  version_name TEXT,

  snapshot_id UUID NOT NULL,

  created_by UUID NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

# 7. Versioning Rules

Explicit saves create immutable versions.

Never mutate version history.

Correct:

```text
append-only versioning
```

Forbidden:

```text
overwrite existing versions
```

---

# 8. diagram_snapshots Table

Purpose:

- persisted UML semantic state
- layout state
- viewport state

Schema:

```sql
CREATE TABLE diagram_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  diagram_id UUID NOT NULL REFERENCES diagrams(id),

  snapshot_type TEXT NOT NULL,

  uml_model JSONB NOT NULL,

  layout_state JSONB NOT NULL,

  viewport_state JSONB NOT NULL,

  metadata JSONB NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

# 9. Snapshot Types

Allowed values:

```text
working
version
autosave
```

Definitions:

| Type | Meaning |
|---|---|
| working | Current mutable state |
| version | Immutable named save |
| autosave | Recovery checkpoint |

---

# 10. Persistence Rules

Persist separately:

- semantic UML state
- layout state
- viewport state

Never persist:

- React Flow nodes
- React Flow edges
- temporary UI state
- modal visibility

---

# 11. JSONB Persistence Structure

`uml_model`

Contains:

```json
{
  "classes": [],
  "interfaces": [],
  "relationships": []
}
```

`layout_state`

Contains:

```json
{
  "nodes": []
}
```

`viewport_state`

Contains:

```json
{
  "zoom": 1,
  "x": 0,
  "y": 0
}
```

---

# 12. Ownership Rules

Every persistence operation must verify ownership.

Required rule:

```text
diagram.owner_id === authenticated_user.id
```

Never trust client-provided ownership.

---

# 13. Row-Level Security Rules

RLS must enforce:

- owner-only reads
- owner-only writes
- owner-only deletes

Example policy:

```sql
auth.uid() = owner_id
```

---

# 14. Autosave Rules

Autosave updates ONLY:

```text
working snapshot
```

Autosave must NEVER:

- overwrite immutable versions
- destroy version history

---

# 15. Recovery Rules

Recovery priority:

```text
1. explicit version
2. latest autosave
3. local draft
4. fallback empty state
```

---

# 16. Transaction Rules

Persistence operations must be transactional.

Never allow:

```text
semantic state saved
layout failed
```

Use atomic persistence.

---

# 17. Soft Delete Rules

Deleting diagrams:

```text
is_deleted = true
```

Do NOT hard delete initially.

Reason:

- future recovery support
- auditability
- safer undo capability

---

# 18. API Persistence Rules

The frontend must NEVER:

- write directly to tables
- bypass backend ownership validation

Frontend → API → Database

Always.

---

# 19. Migration Rules

All schema changes must use migrations.

Never:

- manually mutate production schema
- edit historical migrations

---

# 20. Indexing Rules

Required indexes:

```sql
CREATE INDEX idx_diagrams_owner
ON diagrams(owner_id);

CREATE INDEX idx_versions_diagram
ON diagram_versions(diagram_id);

CREATE INDEX idx_snapshots_diagram
ON diagram_snapshots(diagram_id);
```

---

# 21. Payload Size Rules

Large diagrams require safeguards.

Recommended limits:

| Area | Limit |
|---|---|
| Snapshot payload | 5MB |
| Parser input | 1MB |
| Autosave frequency | debounced |

Reject oversized payloads safely.

---

# 22. Future Expansion Rules

Future support may include:

- collaboration
- comments
- exports
- code sync

Do NOT implement schema for these now.

Avoid speculative tables.

---

# 23. Hard Constraints

1. The UML semantic model is the canonical persisted state.
2. React Flow nodes and edges must never persist directly.
3. Every diagram must have exactly one owner.
4. Version history must remain immutable.
5. Autosave must never overwrite explicit versions.
6. All persistence operations must verify ownership.
7. Persistence operations must remain transactional.
8. Layout and viewport state must persist separately.
9. Row-level security must protect all diagram access.
10. The frontend must never bypass backend persistence APIs.