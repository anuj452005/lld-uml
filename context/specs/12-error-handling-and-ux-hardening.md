# Unit 12 — Error Handling, Status Surfaces, and UX Hardening

## Overview

Implement consistent error handling, loading states, empty states, and status
feedback surfaces across all application flows: parsing, saving, loading,
and auth. This unit also adds local draft recovery as a fallback when the
network fails during auto-save. After this unit, the application clearly
communicates what is happening at all times and never silently fails.

---

## Goal

Every operation in the app — parsing, saving, loading diagrams, auth —
has a visible loading state, a success confirmation, and a graceful error state
that preserves user work. The user is never left confused about whether
their diagram is saved.

---

## Dependencies

- Unit 04 (canvas and hydration — loading state on open)
- Unit 08 (auto-save and save status — error surfaces)
- Unit 09 (parser errors — structured error display)
- Unit 10 (parser output — edge cases from real parsing)

---

## Scope

### In Scope

- Loading skeleton for diagram canvas on initial load
- Empty canvas state when diagram has no classes
- Parser error banner (full parser failure)
- Save error state with retry button
- Network failure detection and local draft save (localStorage fallback)
- Local draft recovery prompt on reload (if draft newer than remote)
- Corrupted draft handling (malformed JSON → silent fallback to remote)
- Auth session expiry handling (silent refresh attempt → redirect if fails)
- Timeout banners for parser requests
- Consistent `ErrorBoundary` on main workspace
- Toast notification system for transient messages (saved, version created, etc.)

### Out of Scope

- Multi-user conflict resolution
- Offline-first sync
- Push notifications

---

## Packages Affected

| Package | Action |
|---|---|
| `apps/web` | Add all error surfaces, recovery hook, toast system |
| `packages/persistence` | Add local draft helpers |

---

## Folder Structure

```text
apps/web/src/
├── features/
│   ├── recovery/
│   │   ├── LocalDraftRecoveryPrompt.tsx
│   │   └── useLocalDraftRecovery.ts
│   └── error/
│       ├── WorkspaceErrorBoundary.tsx
│       └── ParserErrorBanner.tsx
├── components/
│   ├── ui/
│   │   ├── Toast.tsx
│   │   ├── ToastProvider.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── EmptyCanvasState.tsx
│   └── status/
│       ├── SaveStatusIndicator.tsx
│       └── ParserStatusIndicator.tsx
└── hooks/
    └── useLocalDraft.ts

packages/persistence/src/
├── draft/
│   ├── localDraft.ts
│   └── draftSchema.ts
```

---

## Loading States

### Diagram Canvas Loading

```text
While `useDiagramHydration` is loading:
  Show: skeleton overlay on canvas area
  Skeleton: 3 placeholder node shapes, animated pulse
  Background: bg.canvas
  No interaction possible
```

### Parser Loading

```text
While parsing:
  Monaco editor: read-only
  "Generate UML" button: disabled, shows spinner
  BottomStatusBar: "Parsing Java source…"
```

### Diagram List Loading

```text
While fetching diagrams:
  Show: skeleton list of 3 placeholder cards
```

---

## Empty States

### Empty Canvas

```text
No classes on canvas:
  Centered message:
    Icon: Lucide PlusCircle
    Title: "This diagram is empty"
    Body: "Add a class using the sidebar, or generate a diagram from Java code."
    Button: "Add Class" (primary)
```

### Empty Diagram List

```text
No diagrams:
  Centered message:
    Icon: Lucide LayoutDashboard
    Title: "No diagrams yet"
    Body: "Create your first UML diagram."
    Button: "New Diagram" (primary)
```

---

## Error States

### Save Error

```text
Location: TopNav save indicator
Display: "Save failed" + warning icon (status.error)
Action: "Retry" button
On retry: trigger immediate auto-save
After 3 failed retries: "Saving to local backup" message
```

### Parser Error Banner

```text
Location: below Monaco editor
Display: red bar — "Parsing failed"
Expandable: show list of error objects
Does NOT clear the Monaco editor content
```

### Network Error Banner

```text
Floating banner at top of workspace
Display: "Connection lost — working in local draft mode"
Color: status.warning background
Disappears when connection restored
```

### Auth Session Expiry

```text
On 401 response from any API:
  Attempt Supabase silent token refresh
  If refresh succeeds: retry the original request
  If refresh fails:
    Save local draft
    Show modal: "Session expired. Please sign in again."
    Redirect to /sign-in on confirm
```

---

## Local Draft Recovery

### Write Draft

```ts
// packages/persistence/src/draft/localDraft.ts
function saveDraft(diagramId: string, state: DiagramSnapshot): void
function loadDraft(diagramId: string): DiagramSnapshot | null
function clearDraft(diagramId: string): void
```

Trigger: on every auto-save attempt (write to localStorage before API call)

### Recovery Prompt

On page load, after API hydration:

```text
If localStorage draft exists AND draft.savedAt > remote.updatedAt:
  Show prompt:
    Title: "Unsaved draft found"
    Body: "We found a local draft from [timestamp]. Would you like to restore it?"
    Buttons: "Restore Draft" | "Use Saved Version"

If localStorage draft exists but is corrupted JSON:
  Silent fallback: discard draft, load remote state
  Log warning to console only
```

---

## Toast Notification System

Transient messages shown as small toasts:

```text
Position: bottom-right corner
Auto-dismiss: 3 seconds
Max simultaneous: 3

Types:
  success — green left border, status.success
  warning — yellow left border, status.warning
  error   — red left border, status.error
  info    — blue left border, status.info

Triggers:
  - "Diagram saved" (on auto-save success — show only once, not every save)
  - "Version created"
  - "Version restored"
  - "Class deleted"
  - "Relationship deleted"
```

---

## ErrorBoundary

```text
Wraps: entire diagram workspace
On React render error:
  Show: "Something went wrong" message
  Button: "Reload diagram" → refresh page
  Never clear diagram data from local storage
```

---

## Implementation Order

1. `packages/persistence/src/draft/localDraft.ts`
2. `apps/web/src/hooks/useLocalDraft.ts`
3. `apps/web/src/components/ui/Toast.tsx` + `ToastProvider.tsx`
4. `apps/web/src/components/ui/LoadingSkeleton.tsx`
5. `apps/web/src/components/ui/EmptyCanvasState.tsx`
6. `apps/web/src/components/status/SaveStatusIndicator.tsx`
7. `apps/web/src/features/error/WorkspaceErrorBoundary.tsx`
8. `apps/web/src/features/error/ParserErrorBanner.tsx`
9. `apps/web/src/features/recovery/LocalDraftRecoveryPrompt.tsx`
10. `apps/web/src/features/recovery/useLocalDraftRecovery.ts`
11. Update `useDiagramHydration.ts` — integrate draft recovery check
12. Update `useAutoSave.ts` — write local draft before API call
13. Update API service — handle 401 with silent refresh
14. Wire `ToastProvider` into `App.tsx`
15. Wrap workspace in `WorkspaceErrorBoundary`

---

## Acceptance Criteria

- [ ] Canvas shows loading skeleton during hydration
- [ ] Empty canvas shows empty state with "Add Class" prompt
- [ ] Diagram list shows skeleton while loading
- [ ] Save error shown with retry button when network fails
- [ ] After 3 retry failures, local draft is saved to localStorage
- [ ] On reload with valid local draft newer than remote, recovery prompt shown
- [ ] Corrupted localStorage draft is silently discarded
- [ ] Session expiry attempts silent refresh before redirecting
- [ ] Toast notifications appear for key user actions
- [ ] `WorkspaceErrorBoundary` catches render errors without data loss
- [ ] Parser error banner shows on total parse failure
- [ ] Network loss banner shows when connection drops
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- User work must NEVER be silently lost
- Draft recovery must never overwrite confirmed remote saves automatically
- Parser failures must preserve the Monaco editor content
- ErrorBoundary must never clear local storage

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 12 complete
