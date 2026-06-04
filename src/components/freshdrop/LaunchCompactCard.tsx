"use client";

import Link from "next/link";
import Image from "next/image";
import type { HomeFeedItem } from "@routefarm/shared";
import { useMarketplace } from "@/context/MarketplaceContext";
import { dropLaunchCardImage, foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { dropMeta } from "@/lib/freshdrop/launch-drop-meta";
import { unitsLeft } from "@/lib/freshdrop/feed-utils";
import { formatPrice } from "@/lib/utils";

export default function LaunchCompactCard({ item }: { item: HomeFeedItem }) {
  const { products } = useMarketplace();
  const product = products.find((p) => p.id === item.product_id);
  const { pickup, distance, chip } = dropMeta(item, product);
  const left = unitsLeft(item);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white/92 shadow-md shadow-warm-950/6 ring-1 ring-warm-200/70 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-warm-300/45">
      <Link
        href={`/products/${item.product_id}`}
        className="relative block aspect-[5/4] shrink-0 overflow-hidden bg-warm-100"
      >
        <Image
          src={dropLaunchCardImage(item)}
          alt={item.title}
          fill
          className={`${foodPhotoClassName} transition-transform duration-500 group-hover:scale-[1.03]`}
          sizes="(max-width: 768px) 50vw, 240px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950/40 via-transparent to-transparent" />
        <div className="absolute left-2 right-2 top-2 flex flex-wrap gap-1">
          {chip && (
            <span className="rounded-full border border-white/50 bg-white/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warm-900 backdrop-blur-md">
              {chip}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <Link href={`/products/${item.product_id}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-warm-900 group-hover:text-brand-800">
            {item.title}
          </h3>
        </Link>
        <p className="mt-0.5 truncate text-xs text-warm-600">{item.seller_name}</p>
        <p className="mt-1 line-clamp-1 text-[11px] text-warm-500">{pickup}</p>
        <p className="text-[11px] text-warm-500">
          {distance}
          {left !== null ? ` · ${left} left` : null}
        </p>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <p className="text-base font-bold text-warm-900">{formatPrice(item.price_cents / 100)}</p>
        </div>
        <Link
          href={`/products/${item.product_id}`}
          className="btn-reserve mt-2 w-full py-2 text-center text-xs"
        >
          Reserve
        </Link>
      </div>
    </article>
  );
}
