# Unit 11 — Post-Generation Editing Parity

## Overview

Ensure that a UML diagram generated from Java code is fully editable using
the same class editor, relationship editor, and canvas interactions as a
manually created diagram. This unit also implements generated-vs-modified
state tracking: the diagram is marked as `mixed` source type as soon as the
user makes any manual change after generation.

---

## Goal

A user generates a UML diagram from Java code, then edits it by moving nodes,
renaming a class, adding a new class, removing a relationship, and dragging
new relationships. All of these interactions work identically to a manually
created diagram. The app marks the diagram as "user-modified" and does not
pretend it still matches the original source.

---

## Dependencies

- Unit 05 (class editor and umlStore mutations)
- Unit 07 (relationship editor)
- Unit 10 (Java-to-UML generation must produce a `UMLDiagram`)

---

## Scope

### In Scope

- Generated diagram flows into `umlStore` after successful parse (Unit 09/10 already sets the diagram)
- Confirm that all Unit 05 and Unit 07 operations work on generated diagrams
- `sourceType` tracking:
  - On generation: `sourceType = "java-generated"`
  - On any manual edit: `sourceType = "mixed"`, `metadata.isModified = true`, `metadata.lastManualEditAt = now()`
- "Regenerate" flow: warn user before overwriting with new parse result
- Node auto-layout on first generation (no positions provided by parser):
  - Arrange nodes in a grid or hierarchical layout
  - Preserve manual positions after first layout

### Out of Scope

- Two-way sync (code ↔ diagram)
- Multi-file parsing
- Undo/redo history

---

## Packages Affected

| Package | Action |
|---|---|
| `apps/web` | Source type tracking, regenerate warning, auto-layout on generation |
| `packages/diagram-engine` | Auto-layout helper for generated diagrams |

---

## Source Type Tracking

### In umlStore

Every mutating action must check `sourceType` and set it to `'mixed'` if it was `'java-generated'`:

```ts
// Wrapper applied in addClass, updateClass, deleteClass,
// addRelationship, updateRelationship, deleteRelationship:

function markModifiedIfGenerated(state: UMLDiagram): Partial<UMLDiagram> {
  if (state.sourceType === 'java-generated') {
    return {
      sourceType: 'mixed',
      metadata: {
        ...state.metadata,
        isModified: true,
        lastManualEditAt: new Date().toISOString(),
      }
    }
  }
  return {}
}
```

Rules:
- Once `mixed`, never revert to `java-generated`
- `isModified` is set to `true` permanently after the first manual edit
- Auto-save (Unit 8) persists the updated `sourceType` and `metadata`

---

## Regenerate Warning Flow

Triggered when the user clicks "Generate UML" on a diagram where `sourceType === 'mixed'`:

```text
User clicks "Generate UML"
    ↓
Diagram is 'mixed' (user has made manual edits)
    ↓
Show confirmation dialog:
  "Regenerating will replace your current diagram with the new parser output.
   Your manual edits will be lost. Continue?"
  [Regenerate] [Cancel]
    ↓
If confirmed: replace umlStore with new parsed diagram
If cancelled: do nothing
```

---

## Auto-Layout on Generation

The parser returns `layout: { nodes: [] }` — no positions.

After successful parse, `packages/diagram-engine` must run an auto-layout pass:

```ts
// packages/diagram-engine/src/layout/autoLayout.ts
function autoLayoutDiagram(diagram: UMLDiagram): DiagramNodeLayout[]
```

Strategy (simple grid layout):
- Arrange nodes in rows of 3
- Each node: 250px wide, 200px tall (estimated), 60px gutter
- Result assigned to `layoutStore.setNodes()`

Rules:
- Auto-layout runs only when `layout.nodes` is empty
- Once a node has been manually positioned, its position is preserved
- Auto-layout must be a pure function — no side effects

---

## UI — Source Type Badge

Display a badge in the left sidebar or TopNav indicating source type:

```text
"Manual"        → neutral badge (border.primary)
"Java Generated" → blue badge (accent.primary)
"Modified"      → warning badge (status.warning)
```

---

## Confirmation Dialog Spec

```text
Type: centered modal, max-width 480px
Icon: warning (Lucide TriangleAlert)
Title: "Overwrite Diagram?"
Body: explanation text
Buttons:
  - "Regenerate" (destructive primary)
  - "Cancel" (secondary)
```

---

## Implementation Order

1. `packages/diagram-engine/src/layout/autoLayout.ts`
2. Extend `umlStore.ts` — add `markModifiedIfGenerated` wrapper to all mutating actions
3. Update `parserService.ts` — after success, run auto-layout before setting layout store
4. Update `JavaEditorPanel.tsx` — add regenerate confirmation flow
5. Update `LeftSidebar.tsx` (or `TopNav.tsx`) — add source type badge
6. Update `umlStore.ts` — expose `setSourceType` if needed

---

## Acceptance Criteria

- [ ] Generated diagram nodes appear positioned (auto-layout applied)
- [ ] All class editing operations (add, edit, delete) work on generated diagrams
- [ ] All relationship operations work on generated diagrams
- [ ] Node drag works on generated diagrams
- [ ] After any manual edit, `sourceType` changes to `'mixed'`
- [ ] After any manual edit, `metadata.isModified = true`
- [ ] After any manual edit, `metadata.lastManualEditAt` is set
- [ ] Regenerating a `mixed` diagram shows a confirmation warning
- [ ] Confirming regenerate replaces the diagram with fresh parser output
- [ ] Cancelling regenerate leaves the diagram unchanged
- [ ] Source type badge shows correct state
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- Manual editing and parser-generated editing use the SAME store actions
- `sourceType` must never revert from `mixed` to `java-generated`
- Two-way sync is explicitly out of scope — do not design for it
- Auto-layout is only applied when `layout.nodes` is empty

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 11 complete
