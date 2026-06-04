"use client";

import type { HomeFeedItem } from "@routefarm/shared";
import DropBoardItem from "@/components/freshdrop/DropBoardItem";
import { isMorningDrop } from "@/lib/freshdrop/feed-utils";

export default function TodaysDropBoard({
  items,
  loading,
}: {
  items: HomeFeedItem[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        <p className="mt-4 text-sm text-warm-600">Checking what dropped this morning…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg font-semibold text-warm-900">Nothing live yet today</p>
        <p className="mt-2 text-sm text-warm-600">
          Follow a few bakers — you&apos;ll get a ping when their next batch drops.
        </p>
      </div>
    );
  }

  const [hero, ...rest] = items;
  const morningRest = rest.filter(isMorningDrop);
  const otherRest = rest.filter((item) => !isMorningDrop(item));

  return (
    <section id="board" className="scroll-mt-20 pb-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <DropBoardItem item={hero} index={0} featured />

        {morningRest.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-amber-200/80" />
              <p className="shrink-0 text-xs font-bold uppercase tracking-widest text-amber-800">
                This morning
              </p>
              <div className="h-px flex-1 bg-amber-200/80" />
            </div>
            <ul className="space-y-4">
              {morningRest.map((item, i) => (
                <li key={item.id}>
                  <DropBoardItem item={item} index={i + 1} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {otherRest.length > 0 && (
          <div className="mt-8">
            {morningRest.length > 0 && (
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-warm-500">
                Later today
              </p>
            )}
            <ul className="space-y-4">
              {otherRest.map((item, i) => (
                <li key={item.id}>
                  <DropBoardItem
                    item={item}
                    index={morningRest.length + i + 1}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {morningRest.length === 0 && rest.length > 0 && (
          <ul className="mt-4 space-y-4">
            {rest.map((item, i) => (
              <li key={item.id}>
                <DropBoardItem item={item} index={i + 1} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
