"use client";

import Link from "next/link";
import Image from "next/image";
import type { HomeFeedItem } from "@routefarm/shared";
import { dropCardImage } from "@/lib/freshdrop/drop-image";
import { unitsLeft } from "@/lib/freshdrop/feed-utils";
import { formatPrice } from "@/lib/utils";
import { getBakerAvatarImage } from "@/data/images";

function freshnessOnImage(label: string | null): string | null {
  if (!label) return null;
  if (label === "Fresh Batch Time") return "Just dropped";
  if (label === "Made Today") return "Baked today";
  return label;
}

export default function MarketplaceDropGrid({
  items,
  loading,
}: {
  items: HomeFeedItem[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-warm-800/40" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-white/80">
        No live drops yet — check back this morning or follow a baker below.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const left = unitsLeft(item);
        const chip = freshnessOnImage(item.freshness_label);
        const avatar = getBakerAvatarImage(
          [item.category as never],
          item.seller_id.charCodeAt(0) || 0
        );

        return (
          <Link
            key={item.id}
            href={`/products/${item.product_id}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-warm-200/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-amber-200/80"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
              <Image
                src={dropCardImage(item)}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-950/50 via-transparent to-transparent opacity-80" />
              <div className="absolute left-2 right-2 top-2 flex flex-wrap gap-1.5">
                {chip && (
                  <span className="rounded-full bg-amber-500/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    {chip}
                  </span>
                )}
                {left !== null && (
                  <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-warm-900 shadow-sm">
                    {left} left
                  </span>
                )}
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2">
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-amber-100">
                  <Image src={avatar} alt="" fill className="object-cover" sizes="28px" />
                </div>
                <p className="min-w-0 truncate text-xs font-semibold text-warm-700">{item.seller_name}</p>
              </div>
              <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-warm-900 group-hover:text-brand-700">
                {item.title}
              </h3>
              <p className="mt-1 text-base font-bold text-brand-700">
                {formatPrice(item.price_cents / 100)}
              </p>
              {item.seller_city && (
                <p className="mt-0.5 text-[11px] text-warm-500">{item.seller_city}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
