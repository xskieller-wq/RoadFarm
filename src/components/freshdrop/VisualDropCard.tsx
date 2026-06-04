"use client";

import Link from "next/link";
import Image from "next/image";
import type { HomeFeedItem } from "@routefarm/shared";
import { dropCardImage } from "@/lib/freshdrop/drop-image";
import { unitsLeft } from "@/lib/freshdrop/feed-utils";
import { formatPrice } from "@/lib/utils";

function freshnessChip(label: string | null): string | null {
  if (!label) return null;
  if (label === "Fresh Batch Time") return "Just dropped";
  if (label === "Made Today") return "Made today";
  if (label === "Available Now") return "Ready now";
  if (label === "Made To Order") return "Made to order";
  return label;
}

export default function VisualDropCard({
  item,
  size = "large",
}: {
  item: HomeFeedItem;
  size?: "large" | "hero";
}) {
  const left = unitsLeft(item);
  const chip = freshnessChip(item.freshness_label);
  const tall = size === "hero";

  return (
    <Link
      href={`/products/${item.product_id}`}
      className={`group relative block w-full overflow-hidden rounded-[1.75rem] bg-warm-900 shadow-2xl shadow-warm-900/20 ${
        tall ? "aspect-[3/4] min-h-[70vh] sm:min-h-[78vh]" : "aspect-[4/5] min-h-[62vh] sm:aspect-[3/4] sm:min-h-0"
      }`}
    >
      <Image
        src={dropCardImage(item)}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 100vw, 560px"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/5"
        aria-hidden
      />

      <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
        {chip && (
          <span className="rounded-full bg-amber-500/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
            {chip}
          </span>
        )}
        {left !== null && (
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-warm-950 shadow">
            {left} left
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-sm font-semibold text-white/85">{item.seller_name}</p>
        <h2
          className={`mt-1 font-bold leading-tight text-white ${
            tall ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {item.title}
        </h2>
        <p className="mt-3 text-xl font-bold text-white">{formatPrice(item.price_cents / 100)}</p>
      </div>
    </Link>
  );
}
