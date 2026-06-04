"use client";

import Link from "next/link";
import Image from "next/image";
import { UserPlus, Check } from "lucide-react";
import type { Seller } from "@/lib/types";
import { getBakerAvatarImage } from "@/data/images";
import { getSellerCardImage } from "@/lib/seller-utils";
import { useFollow } from "@/components/freshdrop/FollowContext";
import { cn } from "@/lib/utils";

export default function FollowBakersRow({
  bakers,
  onDark = false,
}: {
  bakers: Seller[];
  onDark?: boolean;
}) {
  const { isFollowing, toggleFollow } = useFollow();

  if (bakers.length === 0) return null;

  const labelClass = onDark ? "text-amber-200/90" : "text-brand-600";
  const titleClass = onDark ? "text-white" : "text-warm-950";
  const bodyClass = onDark ? "text-white/75" : "text-warm-600";
  const linkClass = onDark
    ? "text-amber-200 hover:text-white"
    : "text-brand-700 hover:text-brand-800";

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={cn("text-xs font-bold uppercase tracking-widest", labelClass)}>Your circle</p>
          <h2 className={cn("mt-1 text-xl font-bold sm:text-2xl", titleClass)}>Follow local bakers</h2>
          <p className={cn("mt-1 max-w-lg text-sm", bodyClass)}>
            Subscribe to drops from makers you trust — they surface first each morning.
          </p>
        </div>
        <Link href="/sellers#type-Baker" className={cn("shrink-0 text-sm font-semibold", linkClass)}>
          See all
        </Link>
      </div>

      <ul className="mt-5 flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        {bakers.map((seller) => {
          const following = isFollowing(seller.id);
          const avatar =
            seller.sellerType === "Baker"
              ? getBakerAvatarImage(seller.specialties, seller.id.charCodeAt(1) || 0)
              : getSellerCardImage(seller);

          return (
            <li
              key={seller.id}
              className="flex w-[140px] shrink-0 flex-col items-center rounded-2xl border border-warm-200/90 bg-white p-4 text-center shadow-md ring-1 ring-amber-100/80"
            >
              <Link
                href={`/sellers/${seller.slug}`}
                className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-amber-200"
              >
                <Image src={avatar} alt="" fill className="object-cover" sizes="64px" />
              </Link>
              <Link
                href={`/sellers/${seller.slug}`}
                className="mt-3 line-clamp-2 text-sm font-bold text-warm-900 hover:text-brand-700"
              >
                {seller.name}
              </Link>
              <p className="mt-0.5 text-[11px] text-warm-500">{seller.neighborhood || seller.city}</p>
              <button
                type="button"
                onClick={() => toggleFollow(seller.id)}
                className={`mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  following
                    ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200"
                    : "bg-warm-900 text-white hover:bg-warm-800"
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
