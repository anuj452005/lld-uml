# Unit 13 — Testing Coverage for Core Flows

## Overview

Add automated test coverage across the most critical behavioral systems:
UML validation, method signature parsing, relationship rules, parser model
normalization, diagram transformation correctness, and persistence hydration.
Tests must catch regressions early and verify behavioral correctness, not snapshots.

---

## Goal

Running the test suite verifies that UML validation rejects invalid inputs,
method signatures parse correctly, relationship constraints hold, the Java parser
produces well-formed output, diagram transformation produces correct React Flow
nodes and edges, and persistence hydration restores the correct state.

---

## Dependencies

- Unit 05 (class editor and store mutations)
- Unit 06 (UML validation)
- Unit 07 (relationship rules)
- Unit 08 (persistence and restore)
- Unit 10 (parser output normalization)

---

## Scope

### In Scope

- Unit tests for all validators in `packages/validation`
- Unit tests for method signature parsing
- Unit tests for `transformDiagramToFlow` in `packages/diagram-engine`
- Unit tests for `umlStore` actions (class and relationship mutations)
- Integration tests for `POST /api/v1/diagrams`, `PUT /api/v1/diagrams/:id`, version routes
- Integration tests for `POST /api/v1/parser/java`
- Parser unit tests in Java (`services/java-parser`)
- Recovery flow integration test: save → reload → hydrate
- All tests in `src/**/*.test.ts` (or `.spec.ts`) per package

### Out of Scope

- E2E browser tests (full E2E suite is out of scope for this unit)
- UI snapshot tests
- Performance load tests (noted but not required here)

---

## Test Framework Choices

| Package | Framework |
|---|---|
| `packages/validation` | Vitest |
| `packages/diagram-engine` | Vitest |
| `apps/web` (stores, hooks) | Vitest + React Testing Library |
| `apps/api` | Vitest or Jest + Supertest |
| `services/java-parser` | JUnit 5 |

---

## Test Coverage Map

### 1. Validation Tests (`packages/validation`)

#### Class Name Validation

```ts
describe('validateClassName')
  it('rejects empty string')
  it('rejects whitespace-only string')
  it('rejects duplicate name in existing class list')
  it('rejects name matching existing interface name')
  it('accepts unique valid name')
```

#### Method Signature Validation

```ts
describe('validateMethodSignature')
  it('accepts: login(email: String): boolean')
  it('accepts: getUser(): User')
  it('accepts: process(): void')
  it('rejects: login(email String): boolean  ← missing colon in param')
  it('rejects: (): boolean                   ← empty method name')
  it('rejects: login(email: String)          ← missing return type')
  it('rejects: empty string')
```

#### Field Validation

```ts
describe('validateField')
  it('rejects empty field name')
  it('rejects empty field type')
  it('rejects invalid visibility')
  it('accepts valid field')
```

#### Relationship Validation

```ts
describe('validateRelationship')
  it('rejects self-loop (source === target)')
  it('rejects circular inheritance A→B, B→A')
  it('rejects reference to non-existent entity')
  it('rejects duplicate relationship of same type between same nodes')
  it('accepts valid inheritance')
  it('accepts valid association')
```

---

### 2. Transformation Tests (`packages/diagram-engine`)

```ts
describe('transformDiagramToFlow')
  it('produces one node per UMLClass')
  it('produces one node per UMLInterface')
  it('produces one edge per UMLRelationship')
  it('maps entityId to node id correctly')
  it('maps layout positions to node x/y')
  it('returns empty nodes and edges for empty diagram')
  it('is pure — calling twice with same input returns identical output')
```

---

### 3. Store Tests (`apps/web` — umlStore)

```ts
describe('umlStore — addClass')
  it('adds class to classes array')
  it('does not duplicate on same id')

describe('umlStore — deleteClass')
  it('removes class from classes array')
  it('removes relationships referencing deleted class')

describe('umlStore — addRelationship')
  it('adds relationship to relationships array')

describe('umlStore — sourceType tracking')
  it('sets sourceType to "mixed" on first manual edit of a java-generated diagram')
  it('keeps sourceType as "manual" for manual diagrams')
```

---

### 4. API Integration Tests (`apps/api`)

```ts
describe('POST /api/v1/diagrams')
  it('creates diagram for authenticated user')
  it('returns 401 for unauthenticated request')
  it('returns 400 for empty name')

describe('PUT /api/v1/diagrams/:id')
  it('updates working snapshot')
  it('does not create a version record')
  it('returns 403 for diagram owned by another user')

describe('POST /api/v1/diagrams/:id/versions')
  it('creates immutable version record')
  it('does not mutate working snapshot')

describe('POST /api/v1/parser/java')
  it('returns structured diagram on valid Java')
  it('returns structured error on malformed Java')
  it('returns 413 for source over 1MB')
  it('returns 401 without auth token')
```

---

### 5. Parser Tests (Java — `services/java-parser`)

```java
class ClassExtractorTest
  @Test void extractsClassName()
  @Test void extractsAbstractFlag()
  @Test void extractsVisibility()

class FieldExtractorTest
  @Test void extractsFieldName()
  @Test void extractsStaticFlag()
  @Test void extractsReadonlyFlag()

class MethodExtractorTest
  @Test void extractsMethodSignature()
  @Test void extractsReturnType()
  @Test void extractsParameters()

class RelationshipExtractorTest
  @Test void extractsInheritance()
  @Test void extractsRealization()

class ParserValidatorTest
  @Test void rejectsDuplicateClassNames()
  @Test void rejectsSelfInheritance()

class ParserControllerTest
  @Test void returnsUmlDiagramForValidJava()
  @Test void returnsErrorForMalformedJava()
  @Test void returnsErrorForEmptySource()
```

---

### 6. Persistence / Recovery Integration Test

```ts
describe('Diagram hydration after save')
  it('restores uml_model from working snapshot after reload')
  it('restores layout_state.nodes positions correctly')
  it('restores viewport_state zoom and pan correctly')
  it('loads empty diagram without crashing')
  it('handles corrupted layout gracefully (falls back to auto-layout)')
```

---

## Test Data Rules

- Use deterministic fixed UUIDs in test fixtures
- Do not use random IDs or `Date.now()` in test data
- Use fixture factories for `UMLClass`, `UMLDiagram`, `UMLRelationship`

Example fixture:

```ts
// tests/fixtures/umlFixtures.ts
export const mockClass: UMLClass = {
  id: 'class-001',
  type: 'class',
  name: 'User',
  visibility: 'public',
  isAbstract: false,
  fields: [],
  methods: [],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}
```

---

## Test Running

```bash
# All TypeScript packages
pnpm turbo run test

# Java parser
cd services/java-parser
./gradlew test
```

CI must block merges when any test fails.

---

## Implementation Order

1. Create fixture files in `packages/validation/src/__tests__/`
2. Validation tests — class, method, field, relationship
3. `packages/diagram-engine` transformation tests
4. `apps/web` store tests — umlStore actions
5. API integration tests — diagram CRUD and parser routes
6. Parser Java unit tests — all extractors and validator
7. Parser Java integration test — controller endpoint
8. Persistence/hydration integration test

---

## Acceptance Criteria

- [ ] All validation tests pass (class name, method signature, field, relationship)
- [ ] All transformation tests pass
- [ ] All umlStore action tests pass including sourceType tracking
- [ ] API integration tests: auth enforcement, ownership checks, schema validation
- [ ] Java parser unit tests: extraction, validation, error cases
- [ ] Persistence hydration test restores UML model, layout, viewport correctly
- [ ] No `any` types in test files
- [ ] Tests use deterministic fixtures — no random data
- [ ] CI pipeline runs all tests and blocks on failure
- [ ] Test coverage satisfies: all validators, all store actions, all API routes

---

## Invariants to Preserve

- Core domain logic tests use real implementations — not mocked validators
- Parser tests do not test React rendering
- Snapshot tests are avoided in favor of behavioral assertions
- Every regression fix in earlier units must add a corresponding test here

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 13 complete
