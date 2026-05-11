import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function generateTraceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try { return crypto.randomUUID(); } catch {}
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function patchBrowserFetchForLogging() {
  if (typeof window === 'undefined') return;
  const win = window as any;
  if (win.__patchedFetchForLogging__) return;
  const nativeFetch = window.fetch.bind(window);

  win.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const traceId = generateTraceId();
    const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
    const method = init?.method ?? (typeof input === 'object' && (input as Request).method) ?? 'GET';
    try {
      const res = await nativeFetch(input, init);

      if (!res.ok) {
        // Single-line log so devtools always show URL/status (object-only logs often look like `{}`).
        console.error(
          `[fetch][trace:${traceId}] Non-2xx ${res.status} ${res.statusText} ${method} ${url}`,
        );
      }

      return res;
    } catch (err) {
      try {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'object' && err !== null && 'message' in err
              ? String((err as { message: unknown }).message)
              : String(err)
        console.error(
          `[fetch][trace:${traceId}] Network/CORS or fetch error ${method} ${url} — ${message}`,
          err instanceof Error ? err.stack : undefined,
        );
      } catch (e) {
        // swallow logging errors
      }
      throw err;
    }
  };

  win.__patchedFetchForLogging__ = true;
}

export const createClient = () => {
  // Patch browser fetch only in client environments to improve diagnostics for "fetch failed" issues.
  try {
    patchBrowserFetchForLogging();
  } catch (e) {
    // don't prevent client construction if logging patch fails
    // eslint-disable-next-line no-console
    console.warn('[Supabase client] failed to patch fetch for logging', e);
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
};
