# Unit 14 — Documentation Sync and Release Readiness

## Overview

Audit and update all context documentation to match the implemented system exactly.
Verify that every context file accurately reflects the shipped architecture, features,
and design decisions. This unit produces no new features — it closes the gap between
documentation intent and implementation reality, and confirms the project is ready
for ongoing development or handoff.

---

## Goal

Every file in `context/` accurately describes the system that was actually built.
No context file contradicts the implementation. The `progress-tracker.md` reflects
all completed units. The repository is in a state where a new contributor (or AI agent)
can read the context and understand the system correctly.

---

## Dependencies

- All prior units (01–13) must be complete

---

## Scope

### In Scope

- Audit and update `context/project-overview.md` against delivered features
- Audit and update `context/architecture.md` against actual stack and boundaries
- Audit and update `context/ui-context.md` — verify all tokens, layouts, and rules match implementation
- Audit and update `context/code-standards.md` — verify standards align with actual code patterns
- Audit and update `context/ai-workflow-rules.md` — remove stale guidance, add lessons learned
- Audit and update `context/shared-model-specification.md` — verify types match implementation
- Audit and update `context/state-management-architecture.md` — verify store domains match
- Audit and update `context/frontend-architecture.md` — verify component and hook patterns
- Audit and update `context/monorepo-structure.md` — verify folder structure matches reality
- Audit and update `context/package-dependency-rules.md` — verify no forbidden imports exist
- Audit and update `context/database-schema.md` — verify schema matches migrations
- Audit and update `context/api-contracts.md` — verify all routes match implementation
- Audit and update `context/parser-contracts.md` — verify parser I/O matches implementation
- Audit and update `context/edge-cases-and-failure-handling.md` — verify all handled cases
- Audit and update `context/testing-strategy.md` — verify coverage matches Unit 13
- Audit and update `context/feature-development-checklist.md` — refine based on experience
- Finalize `context/progress-tracker.md` — mark all units complete
- Update `agents.md` if any tier ordering or file list changed
- Verify all spec files in `context/specs/` match the completed implementations

### Out of Scope

- New features
- Refactoring code
- Performance optimization

---

## Audit Checklist

For each context file, verify:

```text
- [ ] Does it match the implemented system?
- [ ] Are any outdated references removed?
- [ ] Are new patterns (not in original) documented?
- [ ] Are invariants still accurate?
- [ ] Are acceptance criteria achievable with the current implementation?
```

---

## Specific Verification Areas

### project-overview.md

Verify:
- Feature list matches what was built (Units 1–13)
- Out-of-scope list is still accurate
- Success criteria all true for the shipped system

Update if:
- Any feature was descoped or changed during implementation
- Success criteria were adjusted

---

### architecture.md

Verify:
- Stack table matches installed versions
- System boundary descriptions match the actual package structure
- Storage model matches Supabase schema
- Auth flow matches Supabase Auth implementation
- Invariants are still enforced in the code

---

### shared-model-specification.md

Verify:
- All TypeScript interfaces match `packages/shared-model` source exactly
- No types in the spec are missing from the implementation
- No types in the implementation are missing from the spec
- Serialization rules are followed (no Date, Map, Set, class instances)

---

### database-schema.md

Verify:
- SQL schema in spec matches all migration files in `infrastructure/supabase/migrations/`
- RLS policies match the implemented policies
- Index definitions match

---

### api-contracts.md

Verify:
- Every route in the spec exists in `apps/api/src/routes/`
- Request/response shapes match actual API behavior
- Error codes match what is returned

---

### state-management-architecture.md

Verify:
- All store files listed exist in `apps/web/src/stores/`
- Store interface shapes match actual store implementations
- Event flow diagram matches actual data flow

---

### monorepo-structure.md

Verify:
- Actual folder structure matches the documented structure
- No undocumented top-level packages exist

---

### testing-strategy.md

Verify:
- Required test areas (from spec) are all covered by tests from Unit 13
- Test framework choices are documented correctly

---

## progress-tracker.md — Final State

```markdown
# Progress Tracker

## Current Phase
Release Readiness

## Completed
- Unit 01 — Project Shell and App Layout
- Unit 02 — Supabase Auth and User Workspace
- Unit 03 — Diagram Data Model, Storage Schema, and Create/Open Diagram Flow
- Unit 04 — Canvas Rendering Skeleton and State Hydration
- Unit 05 — Manual Class Creation with Structured Form Editor
- Unit 06 — UML Validation for Manual Editing
- Unit 07 — Relationship Creation and Editing
- Unit 08 — Auto-Save, Explicit Save Versions, and Restore State
- Unit 09 — Java Input Editor and Parser Service Contract
- Unit 10 — Java to UML Parsing and Model Extraction
- Unit 11 — Post-Generation Editing Parity
- Unit 12 — Error Handling, Status Surfaces, and UX Hardening
- Unit 13 — Testing Coverage for Core Flows
- Unit 14 — Documentation Sync and Release Readiness

## In Progress
- None

## Next Up
- None (v1.0 complete)

## Open Questions
- None

## Architecture Decisions
[Record all decisions made during implementation]

## Session Notes
[Record context needed for future sessions]
```

---

## Implementation Order

1. Audit `project-overview.md` — update feature list and success criteria
2. Audit `architecture.md` — update stack, boundaries, storage model
3. Audit `shared-model-specification.md` — verify against `packages/shared-model` source
4. Audit `database-schema.md` — compare to migration files
5. Audit `api-contracts.md` — compare to route handlers
6. Audit `state-management-architecture.md` — compare to store files
7. Audit `monorepo-structure.md` — compare to actual directory tree
8. Audit `frontend-architecture.md` — compare to component patterns
9. Audit `package-dependency-rules.md` — run import analysis if needed
10. Audit `parser-contracts.md` — compare to Java service implementation
11. Audit `edge-cases-and-failure-handling.md` — verify all handled
12. Audit `testing-strategy.md` — compare to Unit 13 coverage
13. Audit `ui-context.md` — compare to Tailwind config and component tokens
14. Audit `code-standards.md` — verify patterns match actual code
15. Audit `ai-workflow-rules.md` — refine based on what worked
16. Audit `feature-development-checklist.md` — refine checklist
17. Update `progress-tracker.md` — mark all units complete
18. Update `agents.md` if any changes to reading order needed
19. Final review: every spec in `context/specs/` matches the shipped behavior

---

## Acceptance Criteria

- [ ] Every context file audited for accuracy
- [ ] No context file contradicts the actual implementation
- [ ] `shared-model-specification.md` matches `packages/shared-model` source exactly
- [ ] `database-schema.md` matches migration files exactly
- [ ] `api-contracts.md` matches route implementations
- [ ] `state-management-architecture.md` matches store implementations
- [ ] `monorepo-structure.md` matches actual directory tree
- [ ] `progress-tracker.md` shows all 14 units as completed
- [ ] No open architecture questions remain unresolved
- [ ] Repository is in a state where a new contributor can read context and understand the system

---

## Invariants to Preserve

- Documentation must NEVER describe features that were not implemented
- Context files must NEVER fall behind implementation reality
- Documentation accuracy is a release blocker — not optional

---

## Notes for Future Development

After this unit completes, any new feature development must:
1. Create a new spec in `context/specs/` with the next numbered file
2. Update `progress-tracker.md` to show the new unit as In Progress
3. Update relevant context files after implementation
4. Follow the 4-tier reading order in `agents.md`
