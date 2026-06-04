"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Seller } from "@/lib/types";
import { getBakerAvatarImage } from "@/data/images";
import { getSellerCardImage } from "@/lib/seller-utils";
import { useFollow } from "@/components/freshdrop/FollowContext";

export default function CreatorRing({ creators }: { creators: Seller[] }) {
  const { isFollowing, toggleFollow } = useFollow();

  if (creators.length === 0) return null;

  return (
    <section id="creators" className="scroll-mt-20 bg-warm-950 py-8 sm:py-10">
      <p className="px-4 text-center text-sm font-bold text-white/90 sm:px-6">
        Follow the ovens you crave
      </p>

      <ul className="mt-5 flex justify-start gap-5 overflow-x-auto px-4 pb-2 scrollbar-none sm:justify-center sm:px-6">
        {creators.slice(0, 6).map((seller) => {
          const following = isFollowing(seller.id);
          const avatar =
            seller.sellerType === "Baker"
              ? getBakerAvatarImage(seller.specialties, seller.id.charCodeAt(1) || 0)
              : getSellerCardImage(seller);

          return (
            <li key={seller.id} className="flex w-[88px] shrink-0 flex-col items-center">
              <button
                type="button"
                onClick={() => toggleFollow(seller.id)}
                className={`relative rounded-full p-[3px] transition ${
                  following
                    ? "bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500"
                    : "bg-gradient-to-tr from-white/50 to-white/20"
                }`}
                aria-label={following ? `Unfollow ${seller.name}` : `Follow ${seller.name}`}
              >
                <span className="relative block h-[76px] w-[76px] overflow-hidden rounded-full ring-2 ring-warm-950">
                  <Image src={avatar} alt="" fill className="object-cover" sizes="76px" />
                </span>
                {following && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-warm-950">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                )}
              </button>
              <Link
                href={`/sellers/${seller.slug}`}
                className="mt-2 line-clamp-2 text-center text-xs font-bold leading-tight text-white"
              >
                {seller.name.split(" ")[0]}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
