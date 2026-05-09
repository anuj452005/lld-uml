# Shared Model Specification

This document defines the canonical UML semantic model for the UML editor project.

The UML semantic model is the single source of truth for the entire application.

Everything derives from this model:

- rendering
- persistence
- parser output
- validation
- autosave
- versioning
- API payloads

React Flow nodes and edges are NOT the source of truth.

---

# 1. Core Principles

The UML semantic model must remain:

- framework-independent
- serialization-safe
- strongly typed
- deterministic
- persistence-friendly
- renderer-agnostic

The model must never depend on:

- React
- React Flow
- Supabase
- Zustand
- Monaco
- browser APIs

---

# 2. Root Diagram Model

```ts
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
```

---

# 3. Diagram Source Type

```ts
type DiagramSourceType =
  | "manual"
  | "java-generated"
  | "mixed"
```

Rules:

- `manual`
  → fully manual diagram

- `java-generated`
  → untouched parser-generated diagram

- `mixed`
  → generated diagram modified manually

---

# 4. UML Entity Base

```ts
interface UMLEntityBase {
  id: string
  name: string

  createdAt: string
  updatedAt: string
}
```

---

# 5. UML Class

```ts
interface UMLClass extends UMLEntityBase {
  type: "class"

  visibility: UMLVisibility

  isAbstract: boolean

  fields: UMLField[]
  methods: UMLMethod[]

  annotations?: string[]
}
```

---

# 6. UML Interface

```ts
interface UMLInterface extends UMLEntityBase {
  type: "interface"

  methods: UMLMethod[]
}
```

---

# 7. UML Field

```ts
interface UMLField {
  id: string

  name: string
  type: string

  visibility: UMLVisibility

  isStatic: boolean
  isReadonly: boolean

  defaultValue?: string
}
```

---

# 8. UML Method

```ts
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
```

---

# 9. UML Method Parameter

```ts
interface UMLMethodParameter {
  id: string

  name: string
  type: string
}
```

---

# 10. UML Visibility

```ts
type UMLVisibility =
  | "public"
  | "private"
  | "protected"
  | "package"
```

---

# 11. UML Relationship

```ts
interface UMLRelationship {
  id: string

  sourceId: string
  targetId: string

  type: UMLRelationshipType

  label?: string

  createdAt: string
}
```

---

# 12. UML Relationship Types

```ts
type UMLRelationshipType =
  | "association"
  | "inheritance"
  | "realization"
  | "aggregation"
  | "composition"
  | "dependency"
```

---

# 13. Layout State

Layout state is visual-only state.

It must remain separate from semantic UML entities.

```ts
interface DiagramLayoutState {
  nodes: DiagramNodeLayout[]
}
```

---

# 14. Node Layout

```ts
interface DiagramNodeLayout {
  entityId: string

  x: number
  y: number

  width?: number
  height?: number
}
```

Rules:

- `entityId` must reference valid UML entities
- coordinates must be finite numbers
- invalid coordinates trigger auto-layout fallback

---

# 15. Viewport State

```ts
interface DiagramViewportState {
  zoom: number

  x: number
  y: number
}
```

---

# 16. Diagram Metadata

```ts
interface DiagramMetadata {
  isModified: boolean

  lastManualEditAt?: string

  generatedFrom?: "java"

  parserVersion?: string
}
```

---

# 17. Parser Result

```ts
interface ParserResult {
  success: boolean

  diagram?: UMLDiagram

  warnings: ParserWarning[]

  errors: ParserError[]
}
```

---

# 18. Parser Warning

```ts
interface ParserWarning {
  code: string

  message: string

  line?: number
}
```

---

# 19. Parser Error

```ts
interface ParserError {
  code: string

  message: string

  line?: number

  column?: number
}
```

---

# 20. Persistence Snapshot

```ts
interface DiagramSnapshot {
  diagram: UMLDiagram

  savedAt: string

  versionId: string
}
```

---

# 21. Version Record

```ts
interface DiagramVersion {
  id: string

  diagramId: string

  name?: string

  snapshotId: string

  createdAt: string
}
```

---

# 22. Semantic Model Rules

The UML semantic model is the source of truth.

Never:

- mutate React Flow state directly
- persist React Flow nodes
- derive semantic state from canvas state

Always:

```text
UML Model
   ↓
View Transformation
   ↓
React Flow Nodes/Edges
```

---

# 23. Entity Constraints

## Class Name Rules

- class names must be unique
- empty names forbidden
- whitespace normalized

---

## Relationship Rules

Relationships must:

- reference existing entities
- define explicit type
- prevent self-inheritance
- prevent circular inheritance

---

## Method Rules

Method signatures must:

- include valid parameter structure
- include valid return type
- normalize whitespace

Supported example:

```text
login(email: String): boolean
```

---

# 24. Generated Diagram Rules

Generated diagrams become:

```text
sourceType = "mixed"
```

after manual edits.

Never silently preserve:

```text
sourceType = "java-generated"
```

after user modifications.

---

# 25. Serialization Rules

All shared models must be:

- JSON serializable
- deterministic
- persistence-safe

Forbidden:

- functions
- Dates
- Maps
- Sets
- class instances

Use plain objects only.

---

# 26. Extensibility Rules

Future UML entity types may include:

- enums
- packages
- namespaces

Do not implement now.

The current release supports only:

- classes
- interfaces
- relationships

---

# 27. Hard Constraints

1. The UML semantic model is the canonical source of truth.
2. React Flow nodes and edges are derived view models only.
3. Shared model types must remain framework-independent.
4. Relationships must reference valid entities.
5. Invalid UML structures must never persist.
6. Layout state must remain separate from semantic state.
7. Parser output must normalize into the canonical UML model.
8. Manual and generated diagrams must use the same model.
9. All model structures must remain serialization-safe.
10. No renderer-specific types may exist in the shared model.