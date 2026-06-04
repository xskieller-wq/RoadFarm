"use client";

import type { HomeFeedItem } from "@routefarm/shared";
import VisualDropCard from "@/components/freshdrop/VisualDropCard";

/** Few drops, huge imagery — emotional feed, not inventory list */
export default function VisualDropGallery({
  items,
  loading,
}: {
  items: HomeFeedItem[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <div className="aspect-[3/4] animate-pulse rounded-[1.75rem] bg-warm-800" />
      </div>
    );
  }

  const featured = items.slice(0, 4);

  if (featured.length === 0) {
    return null;
  }

  const [first, ...rest] = featured;

  return (
    <section id="drops" className="scroll-mt-16 bg-warm-950 pb-6 pt-2">
      <div className="mx-auto max-w-lg space-y-5 px-3 sm:px-4">
        {first && <VisualDropCard item={first} size="hero" />}
        {rest.map((item) => (
          <VisualDropCard key={item.id} item={item} size="large" />
        ))}
      </div>
    </section>
  );
}
