# Unit 06 — UML Validation for Manual Editing

## Overview

Add a validation layer that rejects invalid UML structures before they reach the store
or the database. Validation must happen in `packages/validation` (shared, reusable)
and be enforced at both the UI layer (real-time form feedback) and the API layer
(server-side rejection). Invalid inputs must never silently persist.

---

## Goal

Invalid UML inputs — duplicate class names, malformed method signatures,
self-inheritance, invalid visibility values — are caught before store mutation
and shown to the user with clear inline error messages.
Valid input continues to render and persist normally.

---

## Dependencies

- Unit 05 (class editor form and store must exist)

---

## Scope

### In Scope

- `packages/validation` — all UML validation schemas using Zod
- Validation rules:
  1. Class name must not be empty
  2. Class name must be unique within the diagram
  3. Method signature must follow the accepted format
  4. Field name and type must not be empty
  5. Visibility must be one of: `public`, `private`, `protected`, `package`
  6. Self-inheritance must be rejected (source ≠ target for relationships)
  7. Circular inheritance detection (A → B → A)
  8. Dangling relationship detection (target entity must exist)
- UI-level validation: inline errors shown on form fields before save
- API-level validation: backend rejects malformed payloads

### Out of Scope

- Relationship validation UI (Unit 7 adds relationships)
- Parser validation (Unit 10)
- Autosave validation (covered by Unit 8 using this unit's validators)

---

## Packages Affected

| Package | Action |
|---|---|
| `packages/validation` | Create — all Zod schemas and validation functions |
| `apps/web` | Wire UI validation into form fields |
| `apps/api` | Wire server-side validation into API handlers |

---

## Folder Structure

```text
packages/validation/src/
├── uml/
│   ├── classValidation.ts
│   ├── methodValidation.ts
│   ├── fieldValidation.ts
│   └── relationshipValidation.ts
├── api/
│   └── diagramPayloadSchema.ts
└── index.ts
```

---

## Validation Contracts

### Class Name Validation

```ts
function validateClassName(
  name: string,
  existingNames: string[]
): ValidationResult

interface ValidationResult {
  valid: boolean
  error?: string
}
```

Rules:
- Must not be empty or whitespace-only
- Must be unique (case-sensitive) within the diagram's current class list
- Must reject names that match existing interface names too

---

### Method Signature Validation

```ts
function validateMethodSignature(signature: string): ValidationResult
```

Accepted format:
```text
methodName(param1: Type, param2: Type): ReturnType
```

Reject if:
- No return type
- Parameters missing `: Type` separator
- Empty method name
- Empty signature

Examples:
```text
VALID:   login(email: String): boolean
VALID:   getUser(): User
VALID:   process(): void
INVALID: login(email String): boolean   ← missing colon in param
INVALID: (): boolean                    ← empty method name
INVALID: login(email: String)           ← missing return type
```

---

### Field Validation

```ts
function validateField(field: Partial<UMLField>): ValidationResult
```

Rules:
- Field name must not be empty
- Field type must not be empty
- Visibility must be a valid `UMLVisibility` value

---

### Relationship Validation

```ts
function validateRelationship(
  relationship: Partial<UMLRelationship>,
  diagram: UMLDiagram
): ValidationResult
```

Rules:
- `sourceId` must reference an existing entity
- `targetId` must reference an existing entity
- `sourceId` must not equal `targetId` (no self-inheritance)
- Inheritance relationships must not create cycles
- Type must be a valid `UMLRelationshipType`

---

### API Payload Schemas (Zod)

```ts
// packages/validation/src/api/diagramPayloadSchema.ts
const CreateDiagramSchema = z.object({
  name: z.string().min(1),
  sourceType: z.enum(['manual', 'java-generated', 'mixed']),
})

const UpdateDiagramSchema = z.object({
  diagram: UMLDiagramSchema,
  layout: DiagramLayoutSchema,
  viewport: DiagramViewportSchema,
})
```

---

## UI Validation Integration

Validation fires:
- On field `onBlur` — show error if invalid
- On form submit — recheck all fields, block save if any invalid

Error display:
- Inline red text below the invalid field
- Use `text.error` token (`#FF7B72`)
- Border switches to `border.error` on the input
- Save button disabled while any error exists

---

## API Validation Integration

Every mutating API route must:
1. Parse the request body using the matching Zod schema
2. Return a structured 400 error if schema fails
3. Run semantic validators (uniqueness, relationship constraints) after schema validation

```ts
// Example API handler pattern
const parsed = CreateDiagramSchema.safeParse(req.body)
if (!parsed.success) {
  return res.status(400).json({
    success: false,
    error: { code: 'VALIDATION_ERROR', message: parsed.error.message }
  })
}
```

---

## Implementation Order

1. `packages/validation/src/uml/classValidation.ts`
2. `packages/validation/src/uml/methodValidation.ts`
3. `packages/validation/src/uml/fieldValidation.ts`
4. `packages/validation/src/uml/relationshipValidation.ts`
5. `packages/validation/src/api/diagramPayloadSchema.ts`
6. `packages/validation/src/index.ts` — re-export all
7. Update `ClassEditorPanel.tsx` — wire UI validation
8. Update `FieldEditor.tsx` — wire field validation
9. Update `MethodEditor.tsx` — wire method signature validation
10. Update API handlers in `apps/api` — wire Zod parsing + semantic checks

---

## Acceptance Criteria

- [ ] Empty class name prevents save with inline error
- [ ] Duplicate class name prevents save with inline error
- [ ] Invalid method signature prevents save with inline error
- [ ] Empty field name or type prevents save with inline error
- [ ] Invalid visibility value is rejected
- [ ] API returns 400 for invalid payloads with structured error
- [ ] No invalid UML state ever reaches the store
- [ ] No invalid UML state ever persists to the database
- [ ] All validation lives in `packages/validation` — no duplicate validators
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- Validation must occur BEFORE store mutation
- `packages/validation` must not import React or React Flow
- API must validate independently of the frontend
- Never auto-rename or silently normalize invalid input

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 6 complete
