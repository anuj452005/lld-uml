# Edge Cases and Failure Handling

This document defines the known edge cases, failure scenarios, invalid states, and recovery strategies for the UML editor project.

Do not scatter edge-case handling rules across unrelated files.

This file is the single source of truth for:

* parser edge cases
* persistence failures
* invalid UML states
* synchronization problems
* rendering failures
* recovery behavior
* save/version conflicts
* UI failure states

---

# Why This Is a Separate File

Do not place edge cases inside:

* `project-overview.md`
* `ui-context.md`
* `architecture.md`
* `code-standards.md`

Those files define:

* scope
* structure
* architecture
* standards
* UI language

Edge cases are operational behavior and failure handling.

Keeping them separate:

* prevents bloated architecture files
* keeps AI agents deterministic
* makes debugging easier
* creates a dedicated recovery reference

---

# 1. Authentication Edge Cases

## 1.1 Expired Session

### Problem

The user's Supabase session expires while editing.

### Handling

* Detect expired JWT.
* Attempt silent refresh.
* If refresh fails:

  * preserve local draft state
  * redirect to login
  * restore draft after login

### Never

* Lose unsaved diagram changes.

---

## 1.2 User Opens Invalid Diagram ID

### Problem

User manually changes URL to another diagram ID.

### Handling

* Verify ownership before returning data.
* Return 403 if user does not own diagram.
* Redirect to dashboard.

### Never

* Leak another user's diagram metadata.

---

# 2. UML Model Edge Cases

## 2.1 Duplicate Class Names

### Problem

Two classes named `User` exist.

### Handling

* Reject creation.
* Show inline validation error.

### Never

* Auto-rename silently.

---

## 2.2 Self-Inheritance

### Problem

`User extends User`

### Handling

* Reject relationship creation.
* Highlight invalid edge.

### Never

* Persist invalid inheritance.

---

## 2.3 Circular Inheritance

### Problem

```text
A extends B
B extends A
```

### Handling

* Detect inheritance cycles.
* Reject second edge.

### Never

* Allow cyclic inheritance graphs.

---

## 2.4 Relationship References Missing Node

### Problem

Relationship points to deleted node.

### Handling

* Remove dangling relationships automatically.
* Revalidate graph after deletion.

### Never

* Render orphaned edges.

---

## 2.5 Duplicate Relationships

### Problem

Two identical inheritance edges exist.

### Handling

* Prevent duplicate relationship creation.

### Never

* Allow duplicate semantic edges.

---

## 2.6 Invalid Method Signatures

### Problem

```text
login(email String): boolean
```

### Handling

* Reject signature.
* Show parser error.
* Preserve user input for editing.

### Never

* Save malformed signatures.

---

## 2.7 Empty Class Name

### Problem

User creates class with empty name.

### Handling

* Disable save.
* Highlight field.

### Never

* Persist unnamed classes.

---

## 2.8 Unsupported UML Relationship Type

### Problem

Unknown relationship type appears in payload.

### Handling

* Reject API request.
* Log validation error.

### Never

* Render unknown edge styles.

---

# 3. Diagram Rendering Edge Cases

## 3.1 Overlapping Nodes

### Problem

Generated nodes overlap completely.

### Handling

* Apply automatic layout offset.
* Preserve manual positions afterward.

### Never

* Stack nodes invisibly.

---

## 3.2 Node Render Overflow

### Problem

Long method signatures overflow node boundaries.

### Handling

* Truncate visually.
* Support tooltip or expandable view.
* Preserve full underlying value.

### Never

* Break node layout entirely.

---

## 3.3 Extreme Zoom Levels

### Problem

User zooms too far in or out.

### Handling

* Clamp zoom range.

Example:

```text
Min Zoom: 0.2
Max Zoom: 2.5
```

### Never

* Allow canvas corruption from extreme transforms.

---

## 3.4 Large Diagram Performance

### Problem

Diagram contains many nodes and edges.

### Handling

* Memoize node rendering.
* Avoid unnecessary rerenders.
* Use virtualization patterns where possible.

### Never

* Trigger full graph rerender on every small edit.

---

## 3.5 Broken Layout State

### Problem

Saved layout contains invalid coordinates.

### Handling

* Fallback to auto-layout.
* Preserve semantic UML data.

### Never

* Crash the editor during hydration.

---

# 4. Persistence Edge Cases

## 4.1 Auto-Save Race Conditions

### Problem

Multiple auto-save requests overlap.

### Handling

* Use request cancellation or save queue.
* Persist latest state only.

### Never

* Persist stale state after newer edits.

---

## 4.2 Save Failure During Editing

### Problem

Network fails during auto-save.

### Handling

* Save locally.
* Retry in background.
* Show save warning indicator.

### Never

* Discard unsaved edits.

---

## 4.3 Reload During Pending Save

### Problem

User refreshes page before save completes.

### Handling

* Restore latest local draft.
* Retry persistence after reload.

### Never

* Lose the pending state.

---

## 4.4 Version History Corruption

### Problem

Explicit save overwrites previous version.

### Handling

* Create immutable versions.
* Use append-only version strategy.

### Never

* Mutate historical versions.

---

## 4.5 Partial Persistence State

### Problem

UML model saves but layout fails.

### Handling

* Use transactional persistence.
* Rollback failed save.

### Never

* Save inconsistent state slices.

---

# 5. Java Parsing Edge Cases

## 5.1 Invalid Java Syntax

### Problem

User pastes malformed Java.

### Handling

* Return structured parser error.
* Include line number.
* Preserve source input.

### Never

* Crash parser service.

---

## 5.2 Unsupported Java Features

### Problem

Code contains unsupported syntax.

Examples:

* advanced generics
* annotations
* reflection-heavy code

### Handling

* Parse supported structures only.
* Return warnings.
* Continue partial extraction where safe.

### Never

* Produce corrupted UML.

---

## 5.3 Extremely Large Code Input

### Problem

User pastes massive source file.

### Handling

* Enforce payload size limit.
* Reject oversized payload.

### Never

* Freeze parser service.

---

## 5.4 Duplicate Classes in Pasted Source

### Problem

Two classes share same name.

### Handling

* Reject parser output.
* Return conflict error.

### Never

* Merge conflicting entities automatically.

---

## 5.5 Parser Produces Incomplete Relationship Data

### Problem

Relationship target class missing.

### Handling

* Mark relationship invalid.
* Skip edge rendering.
* Preserve parser warning.

### Never

* Create broken graph edges.

---

# 6. Generated Diagram Editing Edge Cases

## 6.1 Generated Diagram Modified Manually

### Problem

User edits generated UML.

### Handling

* Mark diagram as modified.
* Break strict sync with original source.

### Never

* Pretend diagram still fully matches source code.

---

## 6.2 Regenerate After Manual Edits

### Problem

User regenerates diagram after editing.

### Handling

* Show overwrite warning.
* Require explicit confirmation.

### Never

* Silently destroy manual edits.

---

## 6.3 Delete Generated Class

### Problem

User deletes class that originated from code.

### Handling

* Allow deletion.
* Mark model as user-modified.

### Never

* Force regeneration immediately.

---

# 7. UI and Interaction Edge Cases

## 7.1 Double Click Race Conditions

### Problem

Rapid repeated clicks trigger duplicate actions.

### Handling

* Disable button during pending action.
* Debounce interactions.

### Never

* Create duplicate entities.

---

## 7.2 Modal State Loss

### Problem

Modal closes unexpectedly.

### Handling

* Preserve unsaved form state temporarily.

### Never

* Discard partially entered data instantly.

---

## 7.3 Keyboard Shortcut Conflicts

### Problem

Shortcut conflicts with browser behavior.

### Handling

* Use standard editor shortcuts.
* Avoid overriding browser-critical shortcuts.

### Never

* Block browser accessibility behavior.

---

## 7.4 Invalid Drag Behavior

### Problem

Edge drag released outside node.

### Handling

* Cancel edge creation cleanly.
* Remove temporary edge.

### Never

* Leave ghost edges.

---

# 8. Local Storage and Recovery Edge Cases

## 8.1 Corrupted Local Draft

### Problem

localStorage contains malformed JSON.

### Handling

* Ignore corrupted draft.
* Load server state.
* Log recovery warning.

### Never

* Crash hydration flow.

---

## 8.2 Local Draft Newer Than Remote State

### Problem

Browser draft newer than saved server version.

### Handling

* Ask user which state to restore.

### Never

* Silently overwrite newer draft.

---

## 8.3 Storage Quota Exceeded

### Problem

Browser storage limit reached.

### Handling

* Stop local caching.
* Warn user.
* Continue server persistence.

### Never

* Crash editor state.

---

# 9. API and Backend Edge Cases

## 9.1 Invalid Payload Shape

### Problem

Frontend sends malformed request.

### Handling

* Validate schema.
* Reject request with structured error.

### Never

* Persist malformed payloads.

---

## 9.2 Duplicate Save Requests

### Problem

Frontend retries same request.

### Handling

* Use idempotent save strategy.
* Detect duplicate requests.

### Never

* Create duplicate versions unintentionally.

---

## 9.3 Backend Timeout

### Problem

Parser or persistence request times out.

### Handling

* Abort request.
* Preserve local state.
* Show retry option.

### Never

* Leave editor stuck indefinitely.

---

# 10. Security Edge Cases

## 10.1 Unauthorized API Access

### Problem

Request sent without valid token.

### Handling

* Reject request.
* Return 401.

### Never

* Return protected diagram data.

---

## 10.2 Injection Through Method Signatures

### Problem

User attempts script injection.

### Handling

* Escape all rendered content.
* Never render raw HTML.

### Never

* Trust user-generated strings.

---

## 10.3 Oversized Payload Attack

### Problem

Huge request body sent intentionally.

### Handling

* Enforce body size limits.
* Reject oversized requests.

### Never

* Allow memory exhaustion.

---

# 11. Recovery Rules

## 11.1 Recovery Priority Order

When restoring state:

```text
1. Explicit saved version
2. Latest remote autosave
3. Latest local draft
4. Empty fallback state
```

---

## 11.2 Safe Failure Rule

If recovery cannot fully succeed:

* preserve semantic UML data first
* preserve layout second
* preserve viewport third

Never discard semantic model if visual state fails.

---

# 12. Non-Negotiable Invariants

1. The UML semantic model is always the source of truth.
2. Invalid UML structures must never persist.
3. Auto-save must never overwrite explicit saved versions.
4. Parser failures must never crash the application.
5. Every relationship must reference valid nodes.
6. Every persistence operation must verify ownership.
7. Manual edits to generated diagrams must mark the diagram as modified.
8. Local draft recovery must always prioritize preserving user work.
9. Corrupted persistence state must fail safely.
10. No edge case handler may silently mutate semantic UML data.
