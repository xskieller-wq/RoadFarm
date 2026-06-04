"use client";

import Link from "next/link";
import Image from "next/image";
import type { HomeFeedItem } from "@routefarm/shared";
import { dropLaunchCardImage, foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { unitsLeft } from "@/lib/freshdrop/feed-utils";
import { freshnessChip } from "@/lib/freshdrop/launch-drop-display";
import { formatPrice } from "@/lib/utils";

const GRID_MAX = 8;
const GRID_MIN = 4;

export default function LaunchProductGrid({
  items,
  loading,
  limit = GRID_MAX,
}: {
  items: HomeFeedItem[];
  loading?: boolean;
  /** Omit cap on browse — pass a large number or items.length */
  limit?: number;
}) {
  const visible = limit ? items.slice(0, limit) : items;
  const skeletonCount = GRID_MIN;

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-warm-200/80" />
        ))}
      </div>
    );
  }

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {visible.map((item) => {
        const left = unitsLeft(item);
        const chip = freshnessChip(item.freshness_label);

        return (
          <article
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white/90 shadow-md shadow-warm-950/8 ring-1 ring-warm-200/80 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-warm-300/50"
          >
            <Link
              href={`/products/${item.product_id}`}
              className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-warm-100"
            >
              <Image
                src={dropLaunchCardImage(item)}
                alt={item.title}
                fill
                className={`${foodPhotoClassName} transition-transform duration-500 group-hover:scale-[1.04]`}
                sizes="(max-width: 768px) 50vw, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-950/45 via-warm-950/5 to-transparent" />
              <div className="absolute left-2 right-2 top-2 flex flex-wrap gap-1">
                {chip && (
                  <span className="rounded-full border border-white/40 bg-white/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warm-900 backdrop-blur-md">
                    {chip}
                  </span>
                )}
                {left !== null && (
                  <span className="rounded-full bg-warm-950/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    {left} left
                  </span>
                )}
              </div>
            </Link>
            <div className="flex min-h-[7.25rem] flex-1 flex-col px-3 pb-3 pt-2.5">
              <Link href={`/products/${item.product_id}`}>
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-warm-900 group-hover:text-brand-700">
                  {item.title}
                </h3>
              </Link>
              <p className="mt-0.5 truncate text-xs text-warm-600">{item.seller_name}</p>
              <p className="mt-1.5 text-lg font-bold text-brand-700">
                {formatPrice(item.price_cents / 100)}
              </p>
              <Link
                href={`/products/${item.product_id}`}
                className="btn-reserve mt-2 w-full py-2.5 text-center text-xs"
              >
                Reserve
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
