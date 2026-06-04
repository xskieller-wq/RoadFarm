"use client";

import Link from "next/link";
import Image from "next/image";
import type { HomeFeedItem } from "@routefarm/shared";
import { formatPrice } from "@/lib/utils";
import { getBakeryProductImage } from "@/data/images";

function feedImage(item: HomeFeedItem) {
  return getBakeryProductImage(item.category as never, item.title);
}

export default function Phase1FeedGrid({
  items,
  loading,
}: {
  items: HomeFeedItem[];
  loading?: boolean;
}) {
  if (loading) {
    return <p className="text-sm text-warm-600">Loading today&apos;s drops…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-white/70">
        No drops yet today. Check back this morning.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/products/${item.product_id}`}
          className="card group overflow-hidden transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-warm-100">
            <Image
              src={feedImage(item)}
              alt={item.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="p-3">
            <p className="text-xs font-medium text-warm-500">{item.category}</p>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-warm-900">{item.title}</h3>
            <p className="mt-1 text-sm font-bold text-brand-700">
              {formatPrice(item.price_cents / 100)}
            </p>
            <p className="mt-1 text-xs text-warm-600">
              {item.seller_name}
              {item.seller_city ? ` · ${item.seller_city}` : null}
            </p>
            {item.freshness_label && (
              <span className="mt-2 inline-block rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-sage-800">
                {item.freshness_label}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
