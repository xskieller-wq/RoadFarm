"use client";

import Link from "next/link";
import Image from "next/image";
import { UserPlus, Check, Bell } from "lucide-react";
import type { Seller } from "@/lib/types";
import { getBakerAvatarImage } from "@/data/images";
import { getSellerCardImage } from "@/lib/seller-utils";
import { useFollow } from "@/components/freshdrop/FollowContext";

export default function FollowFirstPanel({ bakers }: { bakers: Seller[] }) {
  const { isFollowing, toggleFollow, followCount } = useFollow();

  if (bakers.length === 0) return null;

  const suggested = bakers.slice(0, 3);

  return (
    <section
      id="follow"
      className="scroll-mt-20 border-b border-amber-200/50 bg-gradient-to-b from-amber-100/80 to-warm-50 py-6 sm:py-8"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-amber-900/80">
          The best way to use FreshDrop
        </p>
        <h2 className="mt-2 text-center text-xl font-bold text-warm-950 sm:text-2xl">
          Follow bakers you don&apos;t want to miss
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-warm-700">
          You&apos;re not browsing a store directory. You&apos;re subscribing to people&apos;s drops —
          so you hear the moment sourdough or paczki go live.
        </p>

        <ul className="mt-6 space-y-3">
          {suggested.map((seller) => {
            const following = isFollowing(seller.id);
            const avatar =
              seller.sellerType === "Baker"
                ? getBakerAvatarImage(seller.specialties, seller.id.charCodeAt(1) || 0)
                : getSellerCardImage(seller);

            return (
              <li
                key={seller.id}
                className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white p-3 shadow-sm"
              >
                <Link
                  href={`/sellers/${seller.slug}`}
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-amber-200"
                >
                  <Image src={avatar} alt="" fill className="object-cover" sizes="56px" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/sellers/${seller.slug}`}
                    className="font-bold text-warm-950 hover:text-amber-900"
                  >
                    {seller.name}
                  </Link>
                  <p className="text-xs text-warm-600">
                    {seller.neighborhood || seller.city} · neighborhood baker
                  </p>
                  {following && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                      <Bell className="h-3 w-3" aria-hidden />
                      Batch alerts on
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollow(seller.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                    following
                      ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200"
                      : "bg-warm-900 text-white hover:bg-warm-800"
                  }`}
                >
                  {following ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-4 w-4" aria-hidden />
                      Following
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <UserPlus className="h-4 w-4" aria-hidden />
                      Follow
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-center text-sm text-warm-600">
          {followCount > 0 ? (
            <>
              <span className="font-semibold text-amber-900">{followCount} followed</span>
              {" — "}
              their drops show up first on your board.
            </>
          ) : (
            <>Follow at least one to build your morning habit.</>
          )}
        </p>

        <p className="mt-3 text-center">
          <Link href="/sellers#type-Baker" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Find more neighborhood bakers
          </Link>
        </p>
      </div>
    </section>
  );
}
