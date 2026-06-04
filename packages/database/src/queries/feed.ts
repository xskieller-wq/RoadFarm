import type { SupabaseClient } from "@supabase/supabase-js";
import type { HomeFeedItem } from "@routefarm/shared";

export async function getHomeFeed(
  supabase: SupabaseClient,
  limit = 24
): Promise<HomeFeedItem[]> {
  const { data, error } = await supabase
    .from("home_feed_items")
    .select("*")
    .order("sort_score", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as HomeFeedItem[];
}
