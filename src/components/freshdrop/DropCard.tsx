"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Flame } from "lucide-react";
import type { HomeFeedItem } from "@routefarm/shared";
import { formatPrice } from "@/lib/utils";
import { getBakeryProductImage } from "@/data/images";
import { pickupWindow, unitsLeft } from "@/lib/freshdrop/feed-utils";
import { cn } from "@/lib/utils";

function dropImage(item: HomeFeedItem) {
  return getBakeryProductImage(item.category as never, item.title);
}

type Variant = "featured" | "compact" | "reserve";

export default function DropCard({
  item,
  variant = "compact",
}: {
  item: HomeFeedItem;
  variant?: Variant;
}) {
  const left = unitsLeft(item);
  const urgent = left !== null && left <= 3;

  return (
    <Link
      href={`/products/${item.product_id}`}
      className={cn(
        "group relative flex shrink-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        variant === "featured" && "w-[min(82vw,300px)]",
        variant === "compact" && "w-[min(72vw,220px)]",
        variant === "reserve" && "w-full",
        urgent ? "border-amber-300/80 ring-1 ring-amber-200" : "border-warm-200/90"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-warm-100",
          variant === "reserve" ? "aspect-[16/9]" : "aspect-[4/5]"
        )}
      >
        <Image
          src={dropImage(item)}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={variant === "featured" ? "300px" : "220px"}
        />
        {left !== null && (
          <span
            className={cn(
              "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow",
              urgent ? "bg-amber-600" : "bg-warm-800/90"
            )}
          >
            {urgent ? <Flame className="h-3 w-3" aria-hidden /> : null}
            {left} left
          </span>
        )}
        {item.freshness_label && (
          <span className="absolute bottom-2 left-2 max-w-[90%] truncate rounded-full bg-warm-950/75 px-2 py-0.5 text-[10px] font-semibold text-amber-100 backdrop-blur-sm">
            {item.freshness_label}
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-3", variant === "reserve" && "sm:flex-row sm:items-center sm:gap-4 sm:p-4")}>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            {item.seller_name}
          </p>
          <h3
            className={cn(
              "mt-0.5 font-bold text-warm-900",
              variant === "featured" ? "text-base leading-snug" : "text-sm leading-snug line-clamp-2"
            )}
          >
            {item.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-warm-600">
            <Clock className="h-3 w-3 shrink-0 text-amber-600" aria-hidden />
            <span className="truncate">{pickupWindow(item)}</span>
          </p>
        </div>
        <div className={cn("mt-2 flex items-center justify-between gap-2", variant === "reserve" && "mt-0 sm:flex-col sm:items-end")}>
          <p className="text-lg font-bold text-warm-900">{formatPrice(item.price_cents / 100)}</p>
          <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white group-hover:bg-brand-700">
            {left !== null ? "Reserve" : "Pick up"}
          </span>
        </div>
      </div>
    </Link>
  );
}
