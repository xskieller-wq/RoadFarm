/** Live Supabase (auth, feed, profiles). Off in local dev unless NEXT_PUBLIC_SUPABASE_LIVE=true. */
export function isPhase1SupabaseEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_USE_SUPABASE !== "true") {
    return false;
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false;
  }
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_SUPABASE_LIVE !== "true"
  ) {
    return false;
  }
  return true;
}
