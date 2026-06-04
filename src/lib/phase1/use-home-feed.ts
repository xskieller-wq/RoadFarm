"use client";

import { useEffect, useState } from "react";
import type { HomeFeedItem } from "@routefarm/shared";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

export function useHomeFeed() {
  const [items, setItems] = useState<HomeFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"mock" | "supabase" | null>(null);

  useEffect(() => {
    if (!isPhase1SupabaseEnabled()) return;

    const controller = new AbortController();
    setLoading(true);

    fetch("/api/phase1/feed", { signal: controller.signal })
      .then((res) => res.json())
      .then((body: { items?: HomeFeedItem[]; source?: string }) => {
        setItems(body.items ?? []);
        setSource(body.source === "supabase" ? "supabase" : "mock");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setItems([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { items, loading, enabled: isPhase1SupabaseEnabled(), source };
}
