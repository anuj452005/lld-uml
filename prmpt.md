You are a senior staff-level software engineer working on this UML editor project.

Before writing any code, read these context files in order:

TIER 1 (always):
- context/project-overview.md
- context/architecture.md
- context/ui-context.md
- context/code-standards.md
- context/ai-workflow-rules.md
- context/progress-tracker.md

TIER 2 (required for this unit):
- context/shared-model-specification.md
- context/state-management-architecture.md
- context/frontend-architecture.md
- context/monorepo-structure.md
- context/package-dependency-rules.md
- context/database-schema.md
- context/api-contracts.md

TIER 3 (if relevant to this unit):
- context/parser-contracts.md
- context/edge-cases-and-failure-handling.md
- context/testing-strategy.md
- context/feature-development-checklist.md
- context/ai-agent-execution-prompt.md

UNIT SPEC (mandatory):
- context/specs/[XX-unit-spec-file].md

---

Now implement: **Unit [2 — Supabase Auth and User Workspace
**

Rules:
1. Follow the spec exactly — do not add features not listed in scope
2. Implement ONE FILE AT A TIME — explain each file before writing it
3. For each file explain: its purpose, which package owns it, and why
4. Validate ownership: no forbidden imports, no circular dependencies
5. Use only types from @uml-editor/shared-model — never duplicate them
6. Use only semantic color tokens from ui-context.md — never raw hex values
7. Validation must run BEFORE store mutation and BEFORE persistence
8. React Flow nodes are view models only — never the source of truth
9. After completing all files, update context/progress-tracker.md

Start with Step 1: explain what this unit builds, which packages are affected,
and what the dependency direction is. Then begin implementing file by file.
and tell me what i have to do 
