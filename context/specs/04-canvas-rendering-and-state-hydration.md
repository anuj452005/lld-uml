# Unit 04 — Canvas Rendering Skeleton and State Hydration

## Overview

Integrate React Flow to render an empty interactive canvas, establish Zustand stores
for layout and viewport state, and implement reload-safe state hydration from the
persisted diagram snapshot. After this unit, the canvas restores zoom, pan, and
node positions exactly as they were on last save.

---

## Goal

Opening a diagram route renders a blank React Flow canvas.
Zoom, pan, and (eventually) node positions are restored correctly from
the persisted working snapshot on every page reload.

---

## Dependencies

- Unit 02 (auth and session)
- Unit 03 (diagram model, API routes, Supabase schema)

---

## Scope

### In Scope

- React Flow installed and mounted in `DiagramWorkspace`
- Dark grid background on canvas (dots/lines, low contrast)
- `umlStore` — owns the canonical `UMLDiagram` state
- `layoutStore` — owns node coordinates
- `viewportStore` — owns zoom and pan
- `uiStore` — owns selection and modal state (scaffold only)
- `persistenceStore` — owns dirty flags and save status (scaffold only)
- `useDiagramHydration` hook — loads diagram from API and hydrates all stores
- Canvas restores viewport (zoom, pan) from `viewport_state` in snapshot
- Canvas restores node positions from `layout_state` in snapshot
- React Flow transformation: `UMLDiagram → React Flow Nodes/Edges`
- `transformDiagramToFlow()` pure function in `packages/diagram-engine`

### Out of Scope

- Class editing forms (Unit 5)
- UML validation (Unit 6)
- Relationship creation (Unit 7)
- Auto-save (Unit 8)
- Real UML nodes (nodes are empty placeholders here)

---

## Packages Affected

| Package | Action |
|---|---|
| `apps/web` | Add canvas, stores, hydration hook |
| `packages/diagram-engine` | Create — UML-to-flow transformation |

---

## Folder Structure

```text
apps/web/src/
├── stores/
│   ├── umlStore.ts
│   ├── layoutStore.ts
│   ├── viewportStore.ts
│   ├── uiStore.ts
│   └── persistenceStore.ts
├── hooks/
│   └── useDiagramHydration.ts
├── features/
│   └── canvas/
│       ├── DiagramCanvas.tsx
│       └── PlaceholderNode.tsx
└── lib/
    └── reactFlowAdapter.ts

packages/diagram-engine/src/
└── transformers/
    └── transformDiagramToFlow.ts
```

---

## Store Contracts

### umlStore

```ts
interface UMLStoreState {
  diagram: UMLDiagram | null
  setDiagram: (diagram: UMLDiagram) => void
  clearDiagram: () => void
}
```

### layoutStore

```ts
interface LayoutStoreState {
  nodes: DiagramNodeLayout[]
  setNodes: (nodes: DiagramNodeLayout[]) => void
  updateNodePosition: (entityId: string, x: number, y: number) => void
}
```

### viewportStore

```ts
interface ViewportStoreState {
  zoom: number
  x: number
  y: number
  setViewport: (viewport: DiagramViewportState) => void
}
```

### uiStore (scaffold)

```ts
interface UIStoreState {
  selectedNodeId: string | null
  selectedEdgeId: string | null
  setSelectedNode: (id: string | null) => void
}
```

### persistenceStore (scaffold)

```ts
type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

interface PersistenceStoreState {
  saveStatus: SaveStatus
  setSaveStatus: (status: SaveStatus) => void
}
```

---

## Transformation Contract

```ts
// packages/diagram-engine/src/transformers/transformDiagramToFlow.ts

function transformDiagramToFlow(
  diagram: UMLDiagram,
  layout: DiagramNodeLayout[]
): { nodes: FlowNode[]; edges: FlowEdge[] }
```

Rules:
- This function must be **pure** — no side effects
- Input: canonical UML model + layout positions
- Output: React Flow nodes and edges (view models only)
- React Flow types must never leak into `packages/shared-model`
- Nodes contain only display data derived from UML entities

---

## Hydration Flow

```text
User navigates to /workspace/:diagramId
    ↓
useDiagramHydration mounts
    ↓
GET /api/v1/diagrams/:id
    ↓
API returns { uml_model, layout_state, viewport_state }
    ↓
umlStore.setDiagram(uml_model)
layoutStore.setNodes(layout_state.nodes)
viewportStore.setViewport(viewport_state)
    ↓
DiagramCanvas reads stores → transformDiagramToFlow()
    ↓
React Flow renders with restored viewport
```

---

## Canvas Specification

```text
Background: bg.canvas (#0D1117)
Grid: subtle dot grid, low contrast
Controls: React Flow minimap + zoom controls
Initial viewport: restored from viewportStore
Empty state: "This diagram is empty. Add a class to get started."
```

Zoom limits:
```text
Min: 0.2
Max: 2.5
```

---

## Implementation Order

1. Install `reactflow` in `apps/web`
2. `packages/diagram-engine/src/transformers/transformDiagramToFlow.ts`
3. `apps/web/src/stores/umlStore.ts`
4. `apps/web/src/stores/layoutStore.ts`
5. `apps/web/src/stores/viewportStore.ts`
6. `apps/web/src/stores/uiStore.ts` (scaffold)
7. `apps/web/src/stores/persistenceStore.ts` (scaffold)
8. `apps/web/src/hooks/useDiagramHydration.ts`
9. `apps/web/src/features/canvas/PlaceholderNode.tsx`
10. `apps/web/src/features/canvas/DiagramCanvas.tsx`
11. Update `DiagramWorkspace.tsx` to mount `DiagramCanvas`
12. Update router — add `/workspace/:diagramId` route

---

## Acceptance Criteria

- [ ] Canvas renders with dark background and subtle grid
- [ ] Canvas is scrollable/zoomable within min 0.2, max 2.5
- [ ] Diagram hydrates from API on route load
- [ ] Viewport (zoom, pan) restores correctly after reload
- [ ] `umlStore`, `layoutStore`, `viewportStore` hold correct state after hydration
- [ ] `transformDiagramToFlow` is pure — no side effects
- [ ] React Flow node/edge types do not appear in `packages/shared-model`
- [ ] No real UML editing yet — placeholder only
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- React Flow is a rendering engine only — never the source of truth
- UML semantic model must always be the owner of business state
- Layout state and semantic state remain in separate stores
- `transformDiagramToFlow` must remain pure and side-effect free

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 4 complete
