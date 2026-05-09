# Testing Strategy

This document defines the canonical testing architecture, testing boundaries, test ownership rules, and verification standards for the UML editor project.

The purpose of this document is to:

- prevent untested core logic
- isolate regressions early
- preserve UML semantic correctness
- enforce deterministic behavior
- stabilize parser and persistence flows
- standardize test placement

Testing must validate:

- semantic UML correctness
- rendering transformation correctness
- persistence integrity
- parser reliability
- recovery safety

---

# 1. Testing Philosophy

The UML semantic model is the highest-priority testing surface.

Critical systems must be tested before UI polish.

Priority order:

```text
1. Shared model correctness
2. Validation correctness
3. Persistence correctness
4. Parser correctness
5. Rendering transformation correctness
6. UI interaction correctness
```

---

# 2. Testing Layers

| Layer | Purpose |
|---|---|
| Unit Tests | Isolated logic verification |
| Integration Tests | Cross-module behavior |
| End-to-End Tests | Real user workflow validation |
| Performance Tests | Large-diagram behavior |
| Recovery Tests | Failure and restoration flows |

---

# 3. Repository Test Structure

```text
tests/
├── integration/
├── e2e/
└── performance/
```

Package-local tests:

```text
src/**/*.test.ts
src/**/*.spec.ts
```

---

# 4. Required Testing Areas

The following systems REQUIRE tests.

| System | Test Requirement |
|---|---|
| UML validation | Unit |
| Method signature parser | Unit |
| Relationship validation | Unit |
| Diagram transformations | Unit |
| Parser normalization | Unit |
| Persistence services | Integration |
| Recovery flows | Integration |
| API routes | Integration |
| Diagram editing flow | E2E |
| Autosave flow | E2E |

---

# 5. Unit Testing Rules

Unit tests must:

- isolate logic
- avoid network access
- avoid database dependency
- avoid UI rendering when unnecessary

Focus on:

- deterministic logic
- validation
- transformations
- invariants

---

# 6. Shared Model Test Rules

Test:

- entity creation
- relationship constraints
- serialization
- normalization
- invalid structures

Examples:

```text
duplicate class names
self inheritance
circular inheritance
dangling relationships
```

---

# 7. Validation Testing Rules

Validation tests must verify rejection of:

- malformed method signatures
- invalid visibility values
- duplicate entities
- invalid relationships
- unsupported payloads

Validation must fail explicitly.

Never silently normalize invalid structures.

---

# 8. Parser Testing Rules

Parser tests must include:

- valid Java syntax
- malformed Java syntax
- unsupported syntax
- duplicate classes
- inheritance extraction
- interface extraction
- relationship generation

---

# 9. Parser Edge Case Tests

Required parser edge cases:

```text
empty input
large input
partial parse
invalid generics
unsupported annotations
syntax errors
```

---

# 10. Persistence Testing Rules

Persistence tests must verify:

- autosave behavior
- version creation
- restore behavior
- transaction safety
- ownership enforcement

---

# 11. Persistence Failure Tests

Required tests:

```text
network failure
save retry
partial failure
reload during save
autosave cancellation
duplicate save requests
```

---

# 12. API Testing Rules

API integration tests must verify:

- authentication
- ownership validation
- schema validation
- error formatting
- parser orchestration

Every protected route requires ownership tests.

---

# 13. E2E Testing Rules

E2E tests simulate real workflows.

Required workflows:

```text
sign in
create diagram
add class
create relationship
save diagram
reload diagram
generate UML from Java
restore version
```

---

# 14. UI Testing Rules

UI tests should verify:

- rendering correctness
- validation messaging
- interaction behavior
- keyboard accessibility

Avoid excessive snapshot testing.

Prefer behavioral verification.

---

# 15. React Flow Testing Rules

Do NOT test React Flow internals.

Test ONLY:

- transformation correctness
- edge generation
- node mapping
- interaction orchestration

---

# 16. Recovery Testing Rules

Recovery tests must verify:

- local draft restoration
- corrupted draft handling
- autosave recovery
- reload during pending save
- remote/local conflict handling

Never lose semantic UML state during recovery.

---

# 17. Performance Testing Rules

Performance tests required for:

- large diagrams
- large parser input
- rapid editing
- autosave frequency

Required metrics:

| Area | Target |
|---|---|
| Canvas interaction | responsive |
| Parser response | <15s |
| Autosave debounce | stable |
| Hydration | predictable |

---

# 18. Mocking Rules

Allowed mocks:

- Supabase
- parser API
- network requests
- timers

Avoid mocking:

- core UML validation
- semantic transformation logic

Core domain logic should run real implementations.

---

# 19. Snapshot Testing Rules

Avoid large snapshot tests.

Allowed:

- stable UI primitives
- deterministic rendering output

Avoid:

- huge React trees
- unstable generated structures

---

# 20. Regression Testing Rules

Every bug fix must include:

- regression reproduction test
- explicit edge case validation

Never fix bugs without test coverage.

---

# 21. CI Testing Rules

CI must block merges when:

- tests fail
- type checks fail
- lint fails
- circular dependencies detected

---

# 22. Test Naming Rules

Use explicit names.

Good:

```text
should reject self inheritance relationship
```

Bad:

```text
relationship test
```

---

# 23. Test Data Rules

Use deterministic test fixtures.

Avoid:

- random IDs
- unstable timestamps
- environment-dependent data

---

# 24. Hard Constraints

1. UML semantic validation requires automated tests.
2. Parser failures must be tested explicitly.
3. Persistence recovery flows require integration coverage.
4. Ownership enforcement requires integration tests.
5. Every regression fix must include a regression test.
6. React Flow internals must not become testing targets.
7. Recovery tests must prioritize semantic UML preservation.
8. Performance tests must exist for large-diagram workflows.
9. Core domain logic should use real implementations in tests.
10. CI must block merges on failed verification.