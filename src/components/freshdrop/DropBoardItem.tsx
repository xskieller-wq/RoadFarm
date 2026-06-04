"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, UserPlus, Check } from "lucide-react";
import type { HomeFeedItem } from "@routefarm/shared";
import { formatPrice } from "@/lib/utils";
import { getBakeryProductImage } from "@/data/images";
import { dropSemantics, isJustDropped } from "@/lib/freshdrop/drop-semantics";
import { unitsLeft } from "@/lib/freshdrop/feed-utils";
import DropSemanticsStrip from "@/components/freshdrop/DropSemanticsStrip";
import { useFollow } from "@/components/freshdrop/FollowContext";
import { cn } from "@/lib/utils";

function dropImage(item: HomeFeedItem) {
  return getBakeryProductImage(item.category as never, item.title);
}

export default function DropBoardItem({
  item,
  index,
  featured = false,
}: {
  item: HomeFeedItem;
  index: number;
  featured?: boolean;
}) {
  const { isFollowing, toggleFollow } = useFollow();
  const semantics = dropSemantics(item);
  const left = unitsLeft(item);
  const following = isFollowing(item.seller_id);
  const justDropped = isJustDropped(item, index);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-md",
        featured ? "border-amber-300/80 shadow-md shadow-amber-100/50" : "border-warm-200/90",
        left !== null && left <= 3 && "ring-1 ring-amber-200"
      )}
    >
      {justDropped && (
        <div className="flex items-center gap-2 border-b border-amber-200/60 bg-gradient-to-r from-amber-100 to-orange-50 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600" />
          </span>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-900">
            Just dropped · {item.seller_name}
          </p>
        </div>
      )}

      <div className={cn("p-4", featured && "sm:p-5")}>
        <div className="flex gap-4">
          <Link
            href={`/products/${item.product_id}`}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-xl bg-warm-100",
              featured ? "h-28 w-28 sm:h-32 sm:w-32" : "h-20 w-20"
            )}
          >
            <Image
              src={dropImage(item)}
              alt=""
              fill
              className="object-cover"
              sizes={featured ? "128px" : "80px"}
            />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link
                  href={`/sellers/${item.seller_slug}`}
                  className="text-sm font-bold text-warm-800 hover:text-amber-800"
                >
                  {item.seller_name}
                  {item.seller_city ? ` · ${item.seller_city}` : ""}
                </Link>
                <Link href={`/products/${item.product_id}`}>
                  <h3
                    className={cn(
                      "mt-0.5 font-bold text-warm-950 hover:text-amber-900",
                      featured ? "text-lg leading-snug" : "text-base leading-snug"
                    )}
                  >
                    {item.title}
                  </h3>
                </Link>
              </div>
              <button
                type="button"
                onClick={() => toggleFollow(item.seller_id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition",
                  following
                    ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200"
                    : "bg-warm-900 text-white hover:bg-warm-800"
                )}
              >
                {following ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" aria-hidden />
                    Follow baker
                  </>
                )}
              </button>
            </div>

            {following && (
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-800">
                <Bell className="h-3 w-3" aria-hidden />
                You&apos;ll get alerts when they drop again
              </p>
            )}

            <div className="mt-3">
              <DropSemanticsStrip
                freshness={semantics.freshness}
                availability={semantics.availability}
                pickup={semantics.pickup}
                compact={!featured}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-warm-100 pt-4">
          <div className="flex items-baseline gap-2">
            <p className={cn("font-bold text-warm-950", featured ? "text-2xl" : "text-xl")}>
              {formatPrice(item.price_cents / 100)}
            </p>
            {left !== null && (
              <p className="text-sm font-semibold text-amber-800">
                {left} left in this batch
              </p>
            )}
          </div>
          <Link
            href={`/products/${item.product_id}`}
            className={cn(
              "inline-flex items-center justify-center rounded-full font-bold text-white transition",
              left !== null
                ? "bg-amber-600 px-6 py-2.5 text-sm hover:bg-amber-700"
                : "bg-warm-900 px-6 py-2.5 text-sm hover:bg-warm-800",
              featured && "px-8 py-3 text-base"
            )}
          >
            {left !== null ? "Reserve before sellout" : "Reserve pickup"}
          </Link>
        </div>
      </div>
    </article>
  );
}
