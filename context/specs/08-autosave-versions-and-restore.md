# Unit 08 — Auto-Save, Explicit Save Versions, and Restore State

## Overview

Implement the complete persistence lifecycle: debounced auto-save to the working snapshot,
explicit named version saves, save status UI, dirty-state tracking, and full reload
restoration of the UML model, layout state, and viewport state. After this unit, the
canvas returns to the exact state it was in — classes, relationships, positions, zoom,
and pan — after every reload.

---

## Goal

Changes to the diagram auto-save to Supabase within 1–2 seconds of the last edit.
The user can also click "Save Version" to create an immutable named version.
Reloading the page or returning later restores the diagram exactly as it was left.

---

## Dependencies

- Unit 03 (Supabase schema and API)
- Unit 04 (canvas and store hydration)
- Unit 05 (class editing and umlStore)
- Unit 07 (relationships)

---

## Scope

### In Scope

- `persistenceStore` fully implemented (dirty state, save status, retry state)
- `useAutoSave` hook — debounced, cancellable, deduplicated
- Auto-save calls `PUT /api/v1/diagrams/:id` with current UML model + layout + viewport
- `PUT /api/v1/diagrams/:id` API route — updates the working snapshot only
- Explicit save: `POST /api/v1/diagrams/:id/versions` creates immutable version
- Save Version modal (name input)
- Version list panel (list of saved versions, restore button)
- `GET /api/v1/diagrams/:id/versions` — returns version metadata
- `POST /api/v1/versions/:versionId/restore` — restores a version to working snapshot
- Save status indicator in `TopNav` and `BottomStatusBar` (Saving… / Saved / Error)
- Dirty flag set whenever `umlStore` or `layoutStore` changes

### Out of Scope

- Local draft recovery (edge case — covered in Unit 12)
- Parser-generated diagrams (Unit 10)

---

## Packages Affected

| Package | Action |
|---|---|
| `apps/web` | Add autosave hook, persistence triggers, version UI |
| `apps/api` | Add PUT diagram route, version routes, restore route |
| `packages/persistence` | Create — autosave queue helpers |

---

## Folder Structure

```text
apps/web/src/
├── hooks/
│   ├── useAutoSave.ts
│   └── useSaveVersion.ts
├── features/
│   └── persistence/
│       ├── SaveVersionModal.tsx
│       └── VersionListPanel.tsx
├── stores/
│   └── persistenceStore.ts  (fully implemented)
└── services/
    └── persistenceService.ts

packages/persistence/src/
├── queue/
│   └── SaveQueue.ts
└── index.ts
```

---

## persistenceStore — Full Implementation

```ts
type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

interface PersistenceStoreState {
  saveStatus: SaveStatus
  lastSavedAt: string | null
  isDirty: boolean
  retryCount: number
  setSaveStatus: (status: SaveStatus) => void
  setDirty: (dirty: boolean) => void
  resetRetry: () => void
  incrementRetry: () => void
}
```

---

## useAutoSave Hook

```ts
function useAutoSave(diagramId: string): void
```

Behavior:
- Subscribes to `umlStore` and `layoutStore` changes
- Sets `persistenceStore.isDirty = true` on any change
- Debounces 1000ms after last change
- On debounce trigger: calls `persistenceService.saveWorkingSnapshot()`
- Sets status: `saving` → `saved` or `error`
- On error: retries up to 3 times with exponential backoff
- Cancels pending requests if newer changes arrive

Rules:
- Auto-save must NEVER create an immutable version
- Auto-save must NEVER overwrite immutable version records
- Must only update the `working` snapshot type

---

## API Routes — New in This Unit

### PUT /api/v1/diagrams/:id (update working snapshot)

Request:
```json
{
  "diagram": { ...UMLDiagram },
  "layout": { "nodes": [...] },
  "viewport": { "zoom": 1, "x": 0, "y": 0 }
}
```

Response:
```json
{ "success": true, "data": { "savedAt": "ISO timestamp" } }
```

Rules:
- Must verify ownership
- Must update or upsert the `working` snapshot record
- Must NOT create a new version record
- Must update `diagrams.updated_at`

---

### POST /api/v1/diagrams/:id/versions (create explicit version)

Request:
```json
{ "versionName": "Before refactor" }
```

Response:
```json
{ "success": true, "data": { "versionId": "uuid" } }
```

Rules:
- Creates a new `diagram_versions` record
- Copies the current working snapshot as a `version` snapshot
- Immutable — never overwritten

---

### GET /api/v1/diagrams/:id/versions (list versions)

Response:
```json
{ "success": true, "data": { "versions": [{ "id": "uuid", "name": "...", "createdAt": "..." }] } }
```

Returns metadata only — no full snapshot payload.

---

### POST /api/v1/versions/:versionId/restore

Response:
```json
{ "success": true }
```

Rules:
- Copies version snapshot content into the working snapshot
- Does NOT mutate the immutable version record
- Frontend re-hydrates stores from the restored working snapshot

---

## Save Status UI

### TopNav indicator

```text
- "Saving…" — spinner, text.tertiary
- "Saved" — checkmark icon, status.success
- "Unsaved changes" — dot, status.warning
- "Save failed" — warning icon, status.error + retry button
```

### BottomStatusBar

```text
Right side: compact status text only
Same states as above
```

---

## Version UI

### Save Version Modal

```text
Trigger: "Save Version" button in TopNav
Input: version name (optional — defaults to timestamp)
Button: "Save" (primary), "Cancel" (secondary)
```

### Version List Panel

```text
Location: left sidebar section
List: versions in reverse chronological order
Per item: version name, createdAt
Button per item: "Restore" (secondary)
Confirm restore: brief confirmation before overwriting working state
```

---

## Persistence Flow

```text
User edits diagram (class, relationship, position, viewport)
    ↓
umlStore or layoutStore updates
    ↓
persistenceStore.setDirty(true)
    ↓
useAutoSave debounces 1000ms
    ↓
persistenceService.saveWorkingSnapshot() → PUT /api/v1/diagrams/:id
    ↓
Response: savedAt timestamp
    ↓
persistenceStore.setSaveStatus('saved')
```

---

## Implementation Order

1. `packages/persistence/src/queue/SaveQueue.ts`
2. Fully implement `persistenceStore.ts`
3. `apps/web/src/services/persistenceService.ts`
4. `apps/web/src/hooks/useAutoSave.ts`
5. `apps/web/src/hooks/useSaveVersion.ts`
6. API route: `PUT /api/v1/diagrams/:id`
7. API route: `POST /api/v1/diagrams/:id/versions`
8. API route: `GET /api/v1/diagrams/:id/versions`
9. API route: `POST /api/v1/versions/:versionId/restore`
10. `apps/web/src/features/persistence/SaveVersionModal.tsx`
11. `apps/web/src/features/persistence/VersionListPanel.tsx`
12. Update `TopNav.tsx` — save status + Save Version button
13. Update `BottomStatusBar.tsx` — save status
14. Wire `useAutoSave` into canvas route

---

## Acceptance Criteria

- [ ] Editing a class triggers auto-save within ~1000ms
- [ ] Moving a node triggers auto-save
- [ ] Save status shows "Saving…" during save and "Saved" on success
- [ ] Save status shows error + retry button on failure
- [ ] "Save Version" creates an immutable version record
- [ ] Version list shows all saved versions in reverse order
- [ ] "Restore" replaces working state with the selected version
- [ ] Restoring a version does NOT delete the version record
- [ ] Reloading the page restores UML model, layout, and viewport exactly
- [ ] Auto-save never creates a new version record
- [ ] Immutable versions are never overwritten
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- Auto-save only touches the `working` snapshot
- Explicit saves only create new `version` snapshot records — append-only
- Persistence never originates from a UI component directly
- React Flow state is never persisted — only the canonical UML model

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 8 complete
