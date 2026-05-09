# Unit 02 — Supabase Auth and User Workspace

## Overview

Integrate Supabase authentication so users must sign in before reaching the app workspace.
This unit wires Supabase Auth to the frontend, protects the diagram workspace route, and
establishes the session store that subsequent units consume.

---

## Goal

A user opens the app, is redirected to a sign-in screen, authenticates via Supabase,
and lands in the workspace. Session state persists across page refreshes.
Unauthenticated users cannot reach any workspace route.

---

## Dependencies

- Unit 01 (app shell and router must exist)

---

## Scope

### In Scope

- Supabase project configuration (env vars, client init)
- Sign-in page (email + password)
- Sign-up page (email + password)
- Supabase `onAuthStateChange` listener wired to `sessionStore`
- Protected route wrapper — redirects unauthenticated users to sign-in
- Sign-out button in top navigation
- `sessionStore` (Zustand) — stores `user`, `isLoading`, `isAuthenticated`
- Minimal user workspace screen (placeholder post-auth landing)

### Out of Scope

- OAuth providers (Google, GitHub)
- Diagram data
- Row-level security enforcement (belongs to Unit 3)
- Any real workspace content

---

## Projects Affected

| Project | Action |
|---|---|
| `frontend/` | Add auth pages, session store, protected route |
| `backend/` | Implement auth verification middleware |

---

## Folder Structure

```text
frontend/src/
├── features/
│   └── auth/
│       ├── SignInPage.tsx
│       ├── SignUpPage.tsx
│       └── authService.ts
├── stores/
│   └── sessionStore.ts
├── providers/
│   └── AuthProvider.tsx
├── components/
│   └── ProtectedRoute.tsx
└── lib/
    └── supabaseClient.ts
```

---

## Session Store Contract

```ts
// stores/sessionStore.ts
interface SessionState {
  user: SupabaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: SupabaseUser | null) => void
  setLoading: (loading: boolean) => void
}
```

Rules:
- `sessionStore` must NOT own diagram state
- `sessionStore` must NOT own persistence queues
- Session is derived entirely from Supabase Auth — do not replicate tokens

---

## Auth Service Contract

```ts
// features/auth/authService.ts
signIn(email: string, password: string): Promise<AuthResult>
signUp(email: string, password: string): Promise<AuthResult>
signOut(): Promise<void>
getSession(): Promise<Session | null>
```

- `authService` must remain thin — wraps Supabase SDK only
- No business logic inside `authService`

---

## Auth Flow

```text
User opens app
    ↓
AuthProvider mounts → getSession()
    ↓
If session exists → set user in sessionStore → render workspace
If no session → redirect to /sign-in
    ↓
User signs in → Supabase Auth → onAuthStateChange fires
    ↓
sessionStore updates → ProtectedRoute allows through
    ↓
User reaches workspace
```

---

## UI Specification

### Sign-In Page

```text
Background: bg.canvas
Form centered: max-width 400px
Fields:
  - Email input (type="email")
  - Password input (type="password")
Buttons:
  - Primary: "Sign In"
  - Link: "Create account" → /sign-up
Validation:
  - Both fields required
  - Show auth error inline below form
```

### Sign-Up Page

```text
Same layout as sign-in
Fields:
  - Email
  - Password
  - Confirm Password
Validation:
  - Passwords must match
  - Email format required
```

### TopNav Sign-Out

```text
User email shown in top-right
Sign Out button: secondary style, small
On click: signOut() → redirect to /sign-in
```

---

## Route Structure

```text
/sign-in     → SignInPage (public)
/sign-up     → SignUpPage (public)
/workspace   → WorkspacePage (protected)
/            → redirect to /workspace if authed, else /sign-in
```

---

## Environment Variables

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit credentials. Use `.env.local` only.

---

## Implementation Order

1. `apps/web/.env.local` — env vars
2. `apps/web/src/lib/supabaseClient.ts` — Supabase client init
3. `apps/web/src/stores/sessionStore.ts` — Zustand session store
4. `apps/web/src/features/auth/authService.ts` — auth wrapper
5. `apps/web/src/providers/AuthProvider.tsx` — onAuthStateChange listener
6. `apps/web/src/components/ProtectedRoute.tsx`
7. `apps/web/src/features/auth/SignInPage.tsx`
8. `apps/web/src/features/auth/SignUpPage.tsx`
9. Update `App.tsx` — add routes and AuthProvider
10. Update `TopNav.tsx` — add user display and sign-out

---

## Acceptance Criteria

- [ ] Unauthenticated users are redirected to `/sign-in`
- [ ] User can sign in with email + password
- [ ] User can sign up with email + password
- [ ] Session persists on page refresh without re-login
- [ ] Sign-out clears session and redirects to `/sign-in`
- [ ] Auth errors are shown inline (not via alert)
- [ ] `sessionStore` holds user correctly
- [ ] No JWT tokens logged to console
- [ ] TypeScript compiles with no errors
- [ ] No `any` types

---

## Invariants to Preserve

- Frontend never verifies ownership — only identifies the user
- JWT tokens must never be logged
- `sessionStore` must never own diagram state

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 2 complete
