import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('[Supabase Server] ERROR: Missing environment variables:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
    // We don't throw here to avoid crashing the whole request if only some routes need it,
    // but the error will be evident in the logs when a fetch attempt is made.
  }

  return createServerClient(
    supabaseUrl || '',
    supabaseKey || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
