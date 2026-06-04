"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Clock, UserPlus } from "lucide-react";
import type { Product, Seller } from "@/lib/types";
import type { ScheduledBakerBatch } from "@/lib/buyer/buyer-types";
import { useFollow } from "@/components/freshdrop/FollowContext";
import BakeryAvatar from "@/components/freshdrop/BakeryAvatar";
import { getProductImage } from "@/data/images";
import { foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { freshDropPagePanel } from "@/lib/freshdrop/buyer-page-styles";
import { formatPrice } from "@/lib/utils";

export default function FollowedBakerCard({
  seller,
  schedule,
  recentDrops,
}: {
  seller: Seller;
  schedule: ScheduledBakerBatch | undefined;
  recentDrops: Product[];
}) {
  const { isFollowing, toggleFollow } = useFollow();
  const following = isFollowing(seller.id);

  return (
    <article className={freshDropPagePanel}>
      <div className="flex gap-4">
        <BakeryAvatar name={seller.name} seller={seller} seed={seller.id.charCodeAt(1) || 0} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link href={`/sellers/${seller.slug}`} className="text-base font-bold text-warm-950 hover:text-brand-800">
                {seller.name}
              </Link>
              <p className="text-xs text-warm-600">{seller.neighborhood || seller.city}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleFollow(seller.id)}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                following
                  ? "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
                  : "bg-warm-100 text-warm-800 ring-1 ring-warm-200 hover:bg-warm-200"
              }`}
            >
              {following ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" aria-hidden />
                  Follow
                </>
              )}
            </button>
          </div>
          {schedule && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50/80 px-3 py-2 ring-1 ring-amber-100/80">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-amber-900">{schedule.nextBatchLabel}</p>
                <p className="text-sm font-medium text-warm-900">{schedule.nextProductTitle}</p>
                <p className="text-[11px] text-warm-600">{schedule.pickupWindow}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {recentDrops.length > 0 && (
        <div className="mt-4 border-t border-warm-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-warm-500">Recent drops</p>
          <ul className="mt-2 space-y-2">
            {recentDrops.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-warm-50"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-warm-100">
                    <Image
                      src={p.photos[0]?.url ?? getProductImage(p.category, p.title)}
                      alt=""
                      fill
                      className={foodPhotoClassName}
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-warm-900">{p.title}</p>
                    <p className="text-xs text-warm-500">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
