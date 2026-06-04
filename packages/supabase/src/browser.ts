import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { isSupabaseEnabled } from "./enabled";

let browserClient: ReturnType<typeof createSupabaseBrowserClient> | undefined;

export function createClient() {
  if (!isSupabaseEnabled()) {
    throw new Error(
      "Supabase browser client is disabled in local demo mode. Set NEXT_PUBLIC_SUPABASE_LIVE=true when Supabase is running."
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!browserClient) {
    browserClient = createSupabaseBrowserClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return browserClient;
}
