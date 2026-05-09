# AI Workflow Rules

This document defines mandatory operating rules for any AI coding agent working on this project. These are execution rules, not suggestions. Follow them strictly.

---

# 1. Overall Development Approach

## 1.1 Work Spec-First

Do not begin implementation until:

* The feature scope is clearly defined.
* Inputs and outputs are explicit.
* Data ownership is known.
* Success criteria are measurable.

Read before implementation:

* `project-overview.md`
* `architecture.md`
* `code-standards.md`

Do not invent architecture during implementation.

---

## 1.2 Build Incrementally

Implement one unit of functionality at a time.

Do not:

* Build multiple unrelated systems in one change.
* Mix persistence, rendering, parser logic, and UI work in a single implementation pass.
* Introduce future-facing abstractions before they are needed.

Each implementation unit must:

* Compile independently.
* Be testable independently.
* Be reviewable independently.

---

## 1.3 Preserve Existing Architecture

Respect the established architecture boundaries.

Do not:

* Move responsibilities between layers.
* Bypass the UML semantic model.
* Introduce duplicate state ownership.
* Allow the visual canvas to become the source of truth.

The UML semantic model remains the canonical source of state.

---

# 2. Scoping Rules

## 2.1 Work One Unit at a Time

A unit is a single isolated capability.

Examples of valid units:

* Add UML class node rendering.
* Implement relationship creation.
* Implement method signature parsing.
* Implement diagram auto-save.

Examples of invalid units:

* Build the full editor.
* Build persistence plus parser plus rendering together.
* Refactor unrelated systems while implementing a feature.

---

## 2.2 Do Not Make Speculative Changes

Do not implement:

* Collaboration support.
* AI-assisted editing.
* GitHub import.
* Multi-language parsing.
* Two-way code synchronization.

unless explicitly requested.

Do not create abstractions for hypothetical future systems.

Only implement what is required for the current scope.

---

## 2.3 Do Not Expand Scope Mid-Task

If a task reveals additional work:

* Stop.
* Identify the new requirement.
* Isolate it.
* Request confirmation before continuing.

Do not silently expand the implementation scope.

---

# 3. Task Splitting Rules

## 3.1 Split Large Work Into Subtasks

Split work if:

* The implementation touches more than one architectural layer.
* The task requires more than one state domain.
* The feature cannot be validated independently.
* The implementation exceeds roughly 300 lines of new logic.

---

## 3.2 Required Order of Execution

When implementing features, follow this order:

1. Shared types.
2. Validation rules.
3. State/store logic.
4. Services/API layer.
5. UI rendering.
6. Persistence.
7. Tests.
8. Documentation updates.

Do not begin UI implementation before the data model exists.

---

## 3.3 Complete One Layer Before Moving Downstream

Example:

Correct:

1. Define UML relationship type.
2. Add validation.
3. Add store action.
4. Render edge.

Incorrect:

1. Render temporary edge.
2. Invent store shape later.
3. Patch validation afterward.

---

# 4. Handling Ambiguous Requirements

## 4.1 Stop on Ambiguity

If requirements are unclear:

* Stop implementation.
* Ask for clarification.
* Do not assume hidden behavior.

Examples:

* Undefined ownership rules.
* Undefined save behavior.
* Undefined relationship semantics.
* Undefined parser edge-case handling.

---

## 4.2 Prefer Explicit Constraints

If multiple valid implementations exist:

* Present tradeoffs.
* Request a decision.
* Do not silently choose a large architectural direction.

---

## 4.3 Never Invent Product Features

Do not add:

* New relationship types.
* New editor behaviors.
* Additional export systems.
* Hidden shortcuts.

unless explicitly requested.

---

# 5. File Ownership Rules

## 5.1 Do Not Modify Generated Files

Do not modify generated or external library files unless explicitly instructed.

Protected areas include:

```text
node_modules/
```

```text
generated/
```

```text
supabase/generated/
```

```text
packages/ui/generated/
```

---

## 5.2 Respect Package Ownership

Each package owns its responsibility.

Examples:

* Parser logic belongs only in `services/java-parser`.
* Shared UML types belong only in `packages/shared-model`.
* React Flow rendering belongs only in frontend editor features.

Do not duplicate logic across packages.

---

## 5.3 Do Not Introduce Circular Dependencies

Never create:

* frontend → parser service imports
* shared-model → frontend imports
* UI → persistence direct coupling

Dependency direction must remain clean.

---

# 6. State Management Rules

## 6.1 Preserve State Separation

The following state domains must remain separate:

| State Domain       | Responsibility                  |
| ------------------ | ------------------------------- |
| UML semantic model | Classes, methods, relationships |
| Layout state       | Node positions                  |
| Viewport state     | Zoom and pan                    |
| UI state           | Panels, selections, dialogs     |
| Persistence state  | Dirty flag, save status         |

Do not merge unrelated state.

---

## 6.2 Never Mutate State Directly

All state updates must go through explicit store actions.

Bad:

```ts
store.umlModel.classes.push(classNode)
```

Correct:

```ts
addClass(classNode)
```

---

## 6.3 Preserve the UML Source of Truth

The diagram renderer must derive nodes and edges from the UML model.

Do not:

* Use the rendered graph as the canonical data source.
* Store business state only in React Flow nodes.
* Mutate diagram state without updating the UML model.

---

# 7. Validation Rules

## 7.1 Validate at Every Layer

Validation must exist in:

* UI layer
* API layer
* Parser layer

Frontend validation alone is insufficient.

---

## 7.2 Reject Invalid UML Structures

Prevent:

* Self-inheritance.
* Duplicate class names.
* Relationships to non-existent nodes.
* Invalid method signatures.
* Malformed parser output.

---

## 7.3 Fail Explicitly

Return structured errors.

Do not:

* Swallow exceptions.
* Ignore parser failures.
* Return partial malformed state silently.

---

# 8. Documentation Synchronization Rules

## 8.1 Documentation Must Match Implementation

Whenever architecture or behavior changes:

* Update documentation in the same task.
* Keep examples aligned with the current implementation.
* Remove outdated references immediately.

---

## 8.2 Required Documentation Updates

Update relevant files when changing:

| Change Type         | Required Update        |
| ------------------- | ---------------------- |
| New feature         | `project-overview.md`  |
| Architecture change | `architecture.md`      |
| New convention      | `code-standards.md`    |
| AI execution rule   | `ai-workflow-rules.md` |

---

## 8.3 Do Not Leave TODO Architecture

Do not leave:

* Placeholder architecture.
* Undefined ownership rules.
* Empty service contracts.
* Incomplete type definitions.

---

# 9. Persistence Rules

## 9.1 Auto-Save Rules

Auto-save must:

* Be debounced.
* Preserve editor responsiveness.
* Never overwrite explicit version history.

---

## 9.2 Restore Rules

On reload, the system must restore:

* UML model.
* Node positions.
* Zoom and pan.
* Last persisted editor state.

---

## 9.3 Parser Isolation

The parser service:

* Must remain stateless.
* Must not write to the database.
* Must return structured UML data only.

---

# 10. Verification Checklist Before Completing a Unit

Before moving to the next unit, verify all of the following.

## 10.1 Type Safety

* No `any` types introduced.
* Shared model types reused correctly.
* No duplicated type definitions.

---

## 10.2 Architectural Consistency

* UML model remains the source of truth.
* No layer ownership violations exist.
* No circular dependencies introduced.

---

## 10.3 Validation

* Invalid states are rejected.
* Parser errors are handled explicitly.
* Relationship constraints are enforced.

---

## 10.4 Persistence

* Auto-save still works.
* Reload restores state correctly.
* Version history remains intact.

---

## 10.5 UI Consistency

* Components follow naming standards.
* Tailwind usage matches existing patterns.
* No duplicated UI logic exists.

---

## 10.6 Documentation

* Relevant markdown files updated.
* Examples still match implementation.
* No outdated architectural statements remain.

---

# 11. Hard Constraints

The following rules are absolute.

1. The UML semantic model is always the canonical source of truth.
2. The parser service must never directly modify persistence state.
3. The frontend must never store business state only inside React Flow nodes.
4. Auto-save must never overwrite explicit saved versions.
5. Generated diagrams and manually created diagrams must use the same rendering pipeline.
6. All ownership checks must happen before diagram persistence.
7. No feature may assume real-time collaboration exists.
8. No speculative architecture may be introduced without explicit approval.
