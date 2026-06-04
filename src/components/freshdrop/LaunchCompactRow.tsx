"use client";

import type { HomeFeedItem } from "@routefarm/shared";
import LaunchCompactCard from "@/components/freshdrop/LaunchCompactCard";

const COMPACT_COUNT = 4;

export default function LaunchCompactRow({
  items,
  loading,
}: {
  items: HomeFeedItem[];
  loading?: boolean;
}) {
  const visible = items.slice(0, COMPACT_COUNT);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: COMPACT_COUNT }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-warm-200/70" />
        ))}
      </div>
    );
  }

  if (visible.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {visible.map((item) => (
        <LaunchCompactCard key={item.id} item={item} />
      ))}
    </div>
  );
}
