"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useFollow } from "@/components/freshdrop/FollowContext";
import BuyerHubNav from "@/components/buyer/BuyerHubNav";
import FollowedBakerCard from "@/components/buyer/FollowedBakerCard";
import {
  FreshDropPageHeader,
  FreshDropPanel,
} from "@/components/layout/FreshDropPageShell";
import { freshDropSectionTitle, freshDropEyebrow, freshDropPagePanel } from "@/lib/freshdrop/buyer-page-styles";
import {
  buildScheduledBatches,
  recentDropsForSeller,
} from "@/lib/buyer/buyer-account-data";
import { filterSellersByType } from "@/lib/seller-utils";
import BakeryAvatar from "@/components/freshdrop/BakeryAvatar";
import { cn } from "@/lib/utils";

export default function FollowingPageContent() {
  const { products, approvedSellers } = useMarketplace();
  const { following, toggleFollow, isFollowing, followCount } = useFollow();

  const allBakers = filterSellersByType(approvedSellers, ["Baker"]).sort(
    (a, b) => b.rating - a.rating
  );

  const followed = useMemo(
    () => allBakers.filter((s) => following.has(s.id)),
    [allBakers, following]
  );

  const schedules = useMemo(
    () => buildScheduledBatches(products, approvedSellers, following),
    [products, approvedSellers, following]
  );

  const suggested = allBakers.filter((s) => !following.has(s.id)).slice(0, 4);

  return (
    <>
      <FreshDropPageHeader
        eyebrow="Follow sellers"
        title="Bakers you follow"
        description="See next scheduled batches, recent drops, and follow status for neighborhood bakeries."
      />
      <BuyerHubNav />

      <p className="mt-6 text-sm text-warm-600">
        Following <span className="font-semibold text-warm-900">{followCount}</span> of{" "}
        {allBakers.length} local bakers
      </p>

      <section className="mt-8 space-y-4">
        {followed.length === 0 ? (
          <FreshDropPanel>
            <p className="text-sm text-warm-700">
              You are not following anyone yet. Suggested bakers below post fresh batches every
              morning.
            </p>
            <Link href="/browse" className="btn-reserve mt-4 inline-flex">
              Browse today&apos;s drops
            </Link>
          </FreshDropPanel>
        ) : (
          followed.map((seller) => (
            <FollowedBakerCard
              key={seller.id}
              seller={seller}
              schedule={schedules.find((s) => s.sellerId === seller.id)}
              recentDrops={recentDropsForSeller(products, seller.id)}
            />
          ))
        )}
      </section>

      {suggested.length > 0 && (
        <section className="mt-10">
          <p className={freshDropEyebrow}>Discover</p>
          <h2 className={cn("mt-1", freshDropSectionTitle)}>Suggested bakers</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {suggested.map((seller) => (
              <div key={seller.id} className={freshDropPagePanel}>
                <div className="flex items-center gap-3">
                  <BakeryAvatar
                    name={seller.name}
                    seller={seller}
                    seed={seller.id.charCodeAt(1) || 0}
                    size={44}
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/sellers/${seller.slug}`}
                      className="font-bold text-warm-950 hover:text-brand-800"
                    >
                      {seller.name}
                    </Link>
                    <p className="text-xs text-warm-600">{seller.tagline}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollow(seller.id)}
                  className={`mt-3 w-full rounded-xl py-2 text-xs font-bold ${
                    isFollowing(seller.id)
                      ? "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
                      : "btn-reserve"
                  }`}
                >
                  {isFollowing(seller.id) ? "Following" : "Follow baker"}
                </button>
              </div>
            ))}
          </div>
          <Link
            href="/sellers#type-Baker"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-800"
          >
            Browse all seller profiles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <section className="mt-10 pb-6">
        <FreshDropPanel>
          <p className="text-sm font-semibold text-warm-900">Batch alerts</p>
          <p className="mt-1 text-sm text-warm-600">
            Following a baker unlocks morning batch notifications on the Alerts tab.
          </p>
          <Link href="/buy/alerts" className="btn-secondary mt-4 inline-flex text-sm">
            Open alerts
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </FreshDropPanel>
      </section>
    </>
  );
}
