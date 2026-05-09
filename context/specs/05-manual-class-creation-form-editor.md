# Unit 05 — Manual Class Creation with Structured Form Editor

## Overview

Implement the full manual UML class creation and editing workflow.
Users can add new class nodes through a side-panel form, enter class name,
visibility, fields, methods, and full method signatures.
Created classes appear immediately on the canvas as proper UML nodes.

---

## Goal

A user opens a diagram, clicks "Add Class", fills in a structured form
with class name, fields, and methods, and sees the new class appear as
a properly styled UML node on the canvas.
Clicking an existing node opens the form pre-filled for editing.

---

## Dependencies

- Unit 03 (shared model and UML types)
- Unit 04 (canvas, stores, hydration)

---

## Scope

### In Scope

- "Add Class" button in the left sidebar
- Side panel editor (slides from right, 360px wide)
- Form fields:
  - Class name (text)
  - Visibility selector (public / private / protected / package)
  - Abstract toggle
  - Fields list: name, type, visibility, static, readonly
  - Methods list: full method signature string, visibility, static, abstract
- Method signature entry in monospace input
- `addClass` and `updateClass` actions in `umlStore`
- `UMLClassNode` custom React Flow node component (compartments: title / fields / methods)
- Selecting a node on canvas opens the editor panel
- Deleting a class (button in form panel)
- Node drag updates `layoutStore` position

### Out of Scope

- UML validation (Unit 6) — no duplicate name or signature checks yet
- Relationships (Unit 7)
- Auto-save (Unit 8) — changes go to store only, not persisted

---

## Packages Affected

| Package | Action |
|---|---|
| `apps/web` | Add class editor, class node, umlStore mutations |
| `packages/diagram-engine` | Update transform to render real class nodes |

---

## Folder Structure

```text
apps/web/src/
├── features/
│   └── class-editor/
│       ├── ClassEditorPanel.tsx
│       ├── FieldEditor.tsx
│       ├── MethodEditor.tsx
│       └── useClassEditor.ts
├── components/
│   └── canvas/
│       ├── UMLClassNode.tsx
│       └── nodeTypes.ts
└── stores/
    └── umlStore.ts  (extended with addClass, updateClass, deleteClass)
```

---

## umlStore — New Actions

```ts
// Extend umlStore
addClass(cls: UMLClass): void
updateClass(id: string, updates: Partial<UMLClass>): void
deleteClass(id: string): void
```

Rules:
- Actions must update `UMLDiagram.classes` in store
- Actions do NOT trigger persistence yet (Unit 8 wires this)
- After mutation: `layoutStore` auto-assigns position if not present
- No direct canvas mutation — always go through store → transform

---

## Class Node Design

```text
┌─────────────────────────────┐
│ «interface» / «abstract»    │  ← stereotype label (if applicable)
│ ClassName                   │  ← class name, bold, inter font
├─────────────────────────────┤
│ - fieldName: Type           │  ← fields, monospace, text.sm
│ + staticField: Type         │
├─────────────────────────────┤
│ + methodName(): ReturnType  │  ← methods, monospace, text.sm
│ - privateMethod(): void     │
└─────────────────────────────┘
```

Colors:
- Node background: `diagram.node.background`
- Node border: `diagram.node.border`
- Selected: `diagram.node.selected` (blue outline)
- Header: slightly different shade — `bg.surface.secondary`
- Text: `text.primary` for name, `text.secondary` for fields/methods

Visibility symbols:
- `+` public, `-` private, `#` protected, `~` package

---

## Side Panel Specification

```text
Width: 360px
Slides in from right
Header: "Add Class" or "Edit Class [ClassName]"
Sections:
  1. Class Info
     - Name input (monospace, required)
     - Visibility dropdown
     - Abstract toggle
  2. Fields
     - Add Field button
     - Per field: name, type, visibility, static, readonly
     - Delete field button
  3. Methods
     - Add Method button
     - Per method: full signature string (monospace), visibility, static, abstract
     - Delete method button
Footer:
  - "Save" button (primary) — commits to store
  - "Delete Class" button (destructive) — only on edit mode
  - "Cancel" button (secondary)
```

---

## Method Signature Format

Accepted format:
```text
methodName(param1: Type, param2: Type): ReturnType
```

Display in node:
```text
+ login(email: String): boolean
```

Parsing of the signature into structured `parameters` and `returnType` happens
in the `MethodEditor` component — extract name, params, return type from the raw string.

---

## Node Drag Behavior

```text
User drags node on canvas
    ↓
React Flow `onNodeDragStop` fires
    ↓
layoutStore.updateNodePosition(entityId, x, y)
    ↓
Position persisted in layoutStore only (not to DB yet)
```

---

## Implementation Order

1. Extend `umlStore.ts` — `addClass`, `updateClass`, `deleteClass`
2. `packages/diagram-engine` — update `transformDiagramToFlow` for real class data
3. `apps/web/src/components/canvas/UMLClassNode.tsx`
4. `apps/web/src/components/canvas/nodeTypes.ts` — register custom node type
5. `apps/web/src/features/class-editor/MethodEditor.tsx`
6. `apps/web/src/features/class-editor/FieldEditor.tsx`
7. `apps/web/src/features/class-editor/useClassEditor.ts`
8. `apps/web/src/features/class-editor/ClassEditorPanel.tsx`
9. Update `DiagramCanvas.tsx` — wire `onNodeClick` to open editor panel
10. Update `LeftSidebar.tsx` — add "Add Class" button
11. Wire node drag to `layoutStore.updateNodePosition`

---

## Acceptance Criteria

- [ ] "Add Class" opens side panel
- [ ] Class name is required — form does not submit without it
- [ ] Fields can be added, edited, and removed
- [ ] Methods can be added with full signature, edited, and removed
- [ ] Clicking "Save" adds class to `umlStore` and renders node on canvas
- [ ] Clicking a canvas node opens editor pre-filled with existing data
- [ ] "Delete Class" removes the class from `umlStore` and canvas
- [ ] Node shows title / fields / methods compartments correctly
- [ ] Visibility symbols render correctly (`+`, `-`, `#`, `~`)
- [ ] Monospace font used for fields and methods
- [ ] Node drag updates `layoutStore` position
- [ ] Selected node has blue outline
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- `umlStore` is the only owner of class data
- React Flow nodes are derived from `umlStore` + `layoutStore` — never the reverse
- No persistence calls yet — auto-save belongs to Unit 8
- Method signature parsing must be client-side only — no API call

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 5 complete
