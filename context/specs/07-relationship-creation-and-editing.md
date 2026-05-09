# Unit 07 — Relationship Creation and Editing

## Overview

Implement drag-edge relationship creation between class nodes, a relationship type
selector modal, visual rendering of all six UML relationship types, and the ability
to edit or delete existing relationships. All relationship data flows through the
canonical UML model — React Flow edges are derived view models only.

---

## Goal

A user drags from one class node's handle to another, selects the relationship type
(association, inheritance, realization, aggregation, composition, dependency),
and sees a correctly styled UML edge appear on the canvas.
Clicking an edge opens an edit panel to change the type or delete the relationship.

---

## Dependencies

- Unit 05 (class nodes must exist on canvas)
- Unit 06 (relationship validation must exist)

---

## Scope

### In Scope

- Connection handles on UML class nodes (top, right, bottom, left)
- `onConnect` handler in `DiagramCanvas` — triggers relationship type selector
- `RelationshipTypeSelectorModal` — pick from 6 UML types
- `addRelationship`, `updateRelationship`, `deleteRelationship` in `umlStore`
- Custom React Flow edge components for all 6 types with correct UML rendering:
  - Association — open arrow
  - Inheritance — open triangle arrowhead
  - Realization — dashed line with open triangle
  - Aggregation — diamond tail (outlined) with open arrow
  - Composition — diamond tail (filled) with open arrow
  - Dependency — dashed line with open arrow
- Edge click opens a relationship editor panel (type change, label, delete)
- `transformDiagramToFlow` extended to map relationships → edges
- Validation from Unit 06 applied: no self-loops, no duplicate relationships, no circular inheritance

### Out of Scope

- Auto-save (Unit 8)
- Parser-generated relationships (Unit 10)

---

## Packages Affected

| Package | Action |
|---|---|
| `apps/web` | Add relationship modal, edge components, umlStore mutations |
| `packages/diagram-engine` | Update transform to include edges |

---

## Folder Structure

```text
apps/web/src/
├── features/
│   └── relationship-editor/
│       ├── RelationshipTypeSelectorModal.tsx
│       ├── RelationshipEditorPanel.tsx
│       └── useRelationshipEditor.ts
├── components/
│   └── canvas/
│       ├── edges/
│       │   ├── AssociationEdge.tsx
│       │   ├── InheritanceEdge.tsx
│       │   ├── RealizationEdge.tsx
│       │   ├── AggregationEdge.tsx
│       │   ├── CompositionEdge.tsx
│       │   └── DependencyEdge.tsx
│       └── edgeTypes.ts
```

---

## umlStore — New Actions

```ts
addRelationship(rel: UMLRelationship): void
updateRelationship(id: string, updates: Partial<UMLRelationship>): void
deleteRelationship(id: string): void
```

Rules:
- `addRelationship` must call `validateRelationship` before mutating store
- Rejected relationships must not reach the store
- On `deleteClass`, all relationships referencing that class must also be removed

---

## Relationship Creation Flow

```text
User drags from source node handle to target node handle
    ↓
React Flow fires onConnect({ source, target })
    ↓
Open RelationshipTypeSelectorModal
    ↓
User selects type (e.g., Inheritance)
    ↓
validateRelationship() — reject self-loop or cycle
    ↓
umlStore.addRelationship(newRelationship)
    ↓
transformDiagramToFlow() re-runs → edge renders on canvas
```

---

## UML Edge Visual Spec

| Type | Line Style | Source End | Target End |
|---|---|---|---|
| Association | Solid | None | Open arrow |
| Inheritance | Solid | None | Open triangle |
| Realization | Dashed | None | Open triangle |
| Aggregation | Solid | Outlined diamond | Open arrow |
| Composition | Solid | Filled diamond | Open arrow |
| Dependency | Dashed | None | Open arrow |

Edge colors:
- Default: `diagram.edge.default` (`#6E7681`)
- Hovered/selected: `diagram.edge.active` (`#58A6FF`)

SVG markers must be defined per edge type as custom arrowheads/diamonds.

---

## Relationship Type Selector Modal

```text
Trigger: onConnect fires
Layout: centered modal, max-width 400px
Title: "Select Relationship Type"
Options: 6 buttons, one per type, with UML symbol preview
Buttons:
  - "Cancel" — discard connection
  - Each type button — creates relationship and closes modal
```

---

## Relationship Editor Panel

```text
Trigger: click on edge
Width: 360px, slides from right
Fields:
  - Type selector (dropdown from 6 types)
  - Label input (optional)
Buttons:
  - "Save" (primary)
  - "Delete Relationship" (destructive)
  - "Cancel" (secondary)
```

---

## Edge Transform Extension

```ts
// packages/diagram-engine — extend transformDiagramToFlow

relationships.map(rel => ({
  id: rel.id,
  source: rel.sourceId,
  target: rel.targetId,
  type: rel.type,           // maps to custom edge component
  label: rel.label,
  data: { relType: rel.type }
}))
```

---

## Implementation Order

1. Extend `umlStore.ts` — `addRelationship`, `updateRelationship`, `deleteRelationship`
2. `packages/diagram-engine` — extend `transformDiagramToFlow` with edges
3. `apps/web/src/components/canvas/edges/` — all 6 custom edge components
4. `apps/web/src/components/canvas/edgeTypes.ts` — register edge types
5. `apps/web/src/features/relationship-editor/RelationshipTypeSelectorModal.tsx`
6. `apps/web/src/features/relationship-editor/RelationshipEditorPanel.tsx`
7. `apps/web/src/features/relationship-editor/useRelationshipEditor.ts`
8. Update `DiagramCanvas.tsx` — wire `onConnect`, `onEdgeClick`
9. Update `UMLClassNode.tsx` — add connection handles

---

## Acceptance Criteria

- [ ] User can drag from node handle to create a connection
- [ ] Relationship type selector appears after drag
- [ ] All 6 relationship types can be selected
- [ ] Each type renders with correct UML visual (line style + arrowhead)
- [ ] Self-loop relationships are rejected with an error
- [ ] Circular inheritance is rejected with an error
- [ ] Clicking an edge opens the relationship editor
- [ ] Relationship type can be changed via editor
- [ ] Relationship can be deleted
- [ ] Deleting a class also removes its relationships
- [ ] Edge colors match `diagram.edge` tokens
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- `umlStore` owns all relationship data
- React Flow edges are derived view models only
- Validation (Unit 06) must run before any relationship is added to the store
- No relationship type constants duplicated — use `UMLRelationshipType` from `shared-model`

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 7 complete
