## Plan: Fix frontend deployment and improve fetch error logging

TL;DR - Investigate CI/deployment failures, ensure required secrets/env are present in the workflow and Azure Container Apps, improve frontend error logging for network/CORS/fetch failures, add CI guards and verification steps. I recommend first reproducing locally and checking the GitHub Actions deploy logs, then apply small targeted fixes (env + CORS + stronger logging) and re-run the deployment.

**Steps**

1. Discovery & repro (blocking):
   - Pull the latest branch, run `npm install` and `npm run build` in `frontend/` to reproduce build/runtime errors locally.
   - Reproduce the login flow locally (or on a staging app) to capture the exact `fetch failed` stack and network details.
2. Inspect CI / deployment (parallel with step 1 where possible):
   - Open and review `.github/workflows/deploy.yml` to see deploy steps, env leakage, and where secrets are used.
   - Review the failed GitHub Actions run logs (Actions → workflow run) and capture failing step logs and error details.
3. Validate GitHub secrets and runtime env (blocks deploy fix):
   - Verify that `BACKEND_URL`, `PARSER_URL`, `SUPABASE_*` and any other env used by `frontend` are present in repo secrets and referenced in the workflow.
   - If deploying to Azure Container Apps, ensure the Container App has the same env vars configured or the Azure deployment step injects them.
4. Add stronger client-side logging (non-blocking; can be done quickly):
   - Update the auth/login error handling and supabase client wrapper to log: URL being requested, HTTP method, response status, full error object (message + stack), and a short trace id.
   - Capture and display a user-friendly message in the UI while sending the detailed error to logs (console and optional telemetry).
5. Add CI/runtime guard for missing secrets (low effort):
   - Fail the workflow early if required secrets are not defined or are empty. Add a workflow step that prints which required env keys are present (masked) and fails if any missing.
6. Fix server-side CORS / network issues if any (depends on repro):
   - If errors indicate CORS or backend unreachability, update backend to allow the frontend origin, or update DNS / container networking.
7. Re-run CI / redeploy & verify (blocking):
   - Trigger GitHub Actions with the next commit. Verify the deploy step succeeds and login endpoint returns expected results.
8. Post-deploy monitoring (optional):
   - Add Sentry or server-side structured logs for future debugging.

**Relevant files**

- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — inspect deployment steps and env usage
- [frontend/src/app/(auth)/actions.ts](<frontend/src/app/(auth)/actions.ts>) — login action and UI error flow (update error messages)
- [frontend/providers/AuthProvider.tsx](frontend/providers/AuthProvider.tsx) — auth initialization and session handling
- [frontend/src/utils/supabase/client.ts](frontend/src/utils/supabase/client.ts) — supabase client wrapper (augment logging & error details)
- [frontend/.env.local.example] (if exists) — ensure examples match required secrets

**Verification**

1. Local: `cd frontend && npm ci && npm run build && npm start` and exercise the login flow; confirm richer console output and capture network tab.
2. CI: trigger Actions run; confirm the deploy workflow prints env presence check, and the deploy step succeeds.
3. Runtime: After deploy, sign in and confirm no `fetch failed` UI message — instead a user-friendly message appears and console contains detailed trace.

**Decisions & Assumptions**

- Assumed frontend uses Supabase (vendor chunk shows Supabase auth). The `fetch failed` originates from the client-side fetch failing (likely network/CORS or missing backend URL).
- We will add stronger logging client-side first because it yields immediate diagnostic information.

**Further Considerations**

1. Do you want automatic error telemetry (Sentry) added now? Option A: Yes (high-value, extra setup). Option B: No (only console + logs).
2. If deploy target is Azure Container Apps, ensure the Container App ingress and environment variables match the workflow; we may need to update the Azure deployment action.
