# Feature Development Checklist

This document defines the mandatory implementation checklist for every feature added to the UML editor project.

This checklist exists to:

- preserve architectural consistency
- prevent hidden scope creep
- enforce validation-first implementation
- maintain deterministic AI-assisted development
- ensure documentation synchronization

Every feature implementation must follow this checklist.

No exceptions.

---

# 1. Pre-Implementation Checklist

Before writing code:

- [ ] Read `project-overview.md`
- [ ] Read `architecture.md`
- [ ] Read `code-standards.md`
- [ ] Read `ai-workflow-rules.md`
- [ ] Read `monorepo-structure.md`
- [ ] Read `package-dependency-rules.md`
- [ ] Identify ownership layer
- [ ] Verify dependency direction
- [ ] Verify no existing feature already owns the capability
- [ ] Define success criteria
- [ ] Define failure behavior
- [ ] Define validation rules

Do NOT begin implementation before ownership is clear.

---

# 2. Scoping Checklist

Before implementation:

- [ ] Feature scope isolated to one capability
- [ ] No unrelated refactors included
- [ ] No speculative future architecture added
- [ ] No hidden collaboration assumptions introduced
- [ ] No AI-specific architecture introduced
- [ ] No undocumented behavior added

If scope expands:

- stop
- document new requirement
- resolve separately

---

# 3. Shared Model Checklist

If feature touches UML entities:

- [ ] Shared model updated first
- [ ] Canonical types reused
- [ ] No duplicate type definitions created
- [ ] Serialization remains valid
- [ ] React Flow types not leaked into shared model

The UML semantic model remains the source of truth.

---

# 4. Validation Checklist

Before persistence:

- [ ] UI validation added
- [ ] API validation added
- [ ] Parser validation added where applicable
- [ ] Invalid UML states rejected
- [ ] Structured errors returned
- [ ] Duplicate entity validation added
- [ ] Relationship validation added

Never trust frontend validation alone.

---

# 5. State Management Checklist

If feature touches frontend state:

- [ ] Correct store domain used
- [ ] No unrelated state added to existing store
- [ ] No direct state mutation
- [ ] Store actions used
- [ ] React Flow remains derived state only
- [ ] Semantic state isolated from rendering state

---

# 6. Rendering Checklist

If feature affects rendering:

- [ ] Rendering derived from UML semantic model
- [ ] No direct canvas-only state introduced
- [ ] Node rendering memoized where needed
- [ ] Edge rendering validated
- [ ] Invalid graph state prevented

---

# 7. Persistence Checklist

If feature affects persistence:

- [ ] Ownership validated
- [ ] Transactions used where required
- [ ] Autosave behavior preserved
- [ ] Explicit versions remain immutable
- [ ] Recovery behavior tested
- [ ] Payload limits respected

---

# 8. Parser Checklist

If feature affects parsing:

- [ ] Parser remains stateless
- [ ] AST types isolated
- [ ] Output normalized into shared model
- [ ] Structured parser errors returned
- [ ] Unsupported syntax handled safely

---

# 9. API Checklist

If feature affects APIs:

- [ ] Route validation added
- [ ] Consistent response shape used
- [ ] Ownership checks enforced
- [ ] Error structure consistent
- [ ] Request limits enforced
- [ ] API versioning preserved

---

# 10. UI Checklist

If feature affects UI:

- [ ] Semantic color tokens used
- [ ] Shared spacing scale used
- [ ] Keyboard accessibility preserved
- [ ] Focus states preserved
- [ ] Dark theme consistency preserved
- [ ] No raw hex colors introduced
- [ ] No mixed icon libraries introduced

Must follow:

- `ui-context.md`

---

# 11. Error Handling Checklist

- [ ] Failure states handled explicitly
- [ ] User work preserved
- [ ] Structured error messages shown
- [ ] Recovery behavior defined
- [ ] Network failure behavior defined
- [ ] Parser failure behavior defined

Never fail silently.

---

# 12. Testing Checklist

Required before completion:

- [ ] Unit tests added
- [ ] Integration tests added where required
- [ ] Edge cases tested
- [ ] Regression tests added
- [ ] Invalid states tested
- [ ] Recovery behavior tested

---

# 13. Documentation Checklist

If implementation changes behavior:

- [ ] `project-overview.md` updated
- [ ] `architecture.md` updated
- [ ] `code-standards.md` updated
- [ ] `ai-workflow-rules.md` updated
- [ ] `progress-tracker.md` updated

Documentation must match implementation exactly.

---

# 14. Final Verification Checklist

Before marking feature complete:

- [ ] Typecheck passes
- [ ] Tests pass
- [ ] No `any` types introduced
- [ ] No circular dependencies introduced
- [ ] No ownership violations introduced
- [ ] No duplicated business logic introduced
- [ ] No React Flow business-state ownership introduced
- [ ] No speculative architecture added

---

# 15. Non-Negotiable Rules

1. The UML semantic model remains the source of truth.
2. React Flow nodes remain derived view models only.
3. Validation occurs before persistence.
4. Parser services remain stateless.
5. Autosave must never overwrite explicit versions.
6. Shared types must remain centralized.
7. Ownership boundaries must remain enforced.
8. Every feature must define failure behavior.
9. Every feature must include validation coverage.
10. Documentation must remain synchronized with implementation.