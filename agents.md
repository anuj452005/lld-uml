## Application Building Context

Read the following files **in tier order** before implementing
or making any architectural decision.

---

### Tier 1 — Always Read First (Mandatory Before Any Work)

1. `context/project-overview.md` — product definition,
   goals, features, scope, and success criteria
2. `context/architecture.md` — system structure,
   boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography,
   and component conventions
4. `context/code-standards.md` — implementation rules
   and conventions
5. `context/ai-workflow-rules.md` — development workflow,
   scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase,
   completed work, open questions, and next steps

---

### Tier 2 — Read Before Implementation (Required Per Feature)

7.  `context/shared-model-specification.md` — canonical UML
    semantic model types and serialization rules
8.  `context/state-management-architecture.md` — Zustand store
    domains, event flow, and mutation rules
9.  `context/frontend-architecture.md` — rendering pipeline,
    component rules, service layer, and async flow
10. `context/monorepo-structure.md` — repository structure,
    package ownership, and dependency direction
11. `context/package-dependency-rules.md` — allowed imports,
    circular dependency prevention, and isolation rules
12. `context/database-schema.md` — Supabase schema, RLS,
    persistence rules, and snapshot strategy
13. `context/api-contracts.md` — API routes, request/response
    shapes, validation, and ownership rules

---

### Tier 3 — Read When Working on Specific Systems

14. `context/parser-contracts.md` — Java parser isolation,
    input/output contracts, and stateless rules
15. `context/edge-cases-and-failure-handling.md` — known edge
    cases, failure scenarios, and recovery strategies
16. `context/testing-strategy.md` — test layers, coverage
    requirements, and behavioral verification rules
17. `context/feature-development-checklist.md` — mandatory
    pre-implementation, scoping, and completion checklists
18. `context/ai-agent-execution-prompt.md` — master execution
    contract: invariants, SOLID rules, patterns, and response format

---

### Tier 4 — Reference When Applicable

19. `context/specs/` — individual feature specifications;
    read the relevant spec before implementing that feature

---

## Update Rules

Update `context/progress-tracker.md` after **every**
meaningful implementation change.

If implementation changes the architecture, scope, or
standards documented in any context file, update the
**relevant file** before continuing — do not defer it.

If a new feature spec is needed, create it under
`context/specs/` following the naming convention of
existing specs in that folder.

---

## Context File Ownership Summary

| File | Purpose |
|---|---|
| `project-overview.md` | Product goals, scope, success criteria |
| `architecture.md` | System boundaries and invariants |
| `ui-context.md` | Design tokens and component conventions |
| `code-standards.md` | Implementation and coding rules |
| `ai-workflow-rules.md` | Workflow, scoping, delivery approach |
| `progress-tracker.md` | Current status and next steps |
| `shared-model-specification.md` | Canonical UML model types |
| `state-management-architecture.md` | Store domains and event flow |
| `frontend-architecture.md` | Rendering pipeline and component rules |
| `monorepo-structure.md` | Repository structure and package ownership |
| `package-dependency-rules.md` | Import rules and dependency graph |
| `database-schema.md` | Supabase schema and persistence rules |
| `api-contracts.md` | API routes, request/response contracts |
| `parser-contracts.md` | Java parser isolation and contracts |
| `edge-cases-and-failure-handling.md` | Edge cases and recovery strategies |
| `testing-strategy.md` | Test coverage and verification rules |
| `feature-development-checklist.md` | Pre/post implementation checklists |
| `ai-agent-execution-prompt.md` | Master agent execution contract |
| `specs/` | Per-feature implementation specifications |