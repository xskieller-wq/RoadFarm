"use client";

import Link from "next/link";
import { useMarketplace } from "@/context/MarketplaceContext";
import { filterSellersByType } from "@/lib/seller-utils";
import { isBakeryCategory } from "@/lib/categories";
import { useHomeFeed } from "@/lib/phase1/use-home-feed";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";
import { FollowProvider } from "@/components/freshdrop/FollowContext";
import VisualHero from "@/components/freshdrop/VisualHero";
import MoodTextureStrip from "@/components/freshdrop/MoodTextureStrip";
import CreatorRing from "@/components/freshdrop/CreatorRing";
import VisualDropGallery from "@/components/freshdrop/VisualDropGallery";
import MinimalHabitBar from "@/components/freshdrop/MinimalHabitBar";
import AlertsSheet from "@/components/freshdrop/AlertsSheet";
import { productsToMockDrops } from "@/components/freshdrop/mock-drops";

const MAX_DROPS = 4;

export default function FreshDropHomeContent() {
  const { approvedSellers, products, featuredSellers } = useMarketplace();
  const phase1Feed = useHomeFeed();

  const liveDrops =
    isPhase1SupabaseEnabled() && phase1Feed.source === "supabase" && phase1Feed.items.length > 0;

  const bakeryProducts = products.filter((p) => !p.sold && isBakeryCategory(p.category));
  const allItems = liveDrops
    ? phase1Feed.items
    : productsToMockDrops(bakeryProducts, approvedSellers);

  const dropItems = allItems.slice(0, MAX_DROPS);
  const leadDrop = dropItems[0] ?? null;
  const loading = liveDrops && phase1Feed.loading;

  const allBakers = filterSellersByType(approvedSellers, ["Baker"]).sort((a, b) => b.rating - a.rating);
  const creators = (
    featuredSellers.length > 0
      ? [...featuredSellers.filter((s) => s.sellerType === "Baker"), ...allBakers]
      : allBakers
  )
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i)
    .slice(0, 6);

  return (
    <FollowProvider>
      <div className="min-h-screen bg-warm-950">
        <VisualHero leadDrop={leadDrop} liveCount={allItems.length} />
        <MoodTextureStrip />
        <CreatorRing creators={creators} />
        <VisualDropGallery items={dropItems} loading={loading} />
        <MinimalHabitBar />
        <AlertsSheet />

        <footer className="py-8 text-center">
          <Link
            href="/sell"
            className="text-sm font-bold text-white/50 transition hover:text-amber-400"
          >
            Baker? Drop something fresh →
          </Link>
        </footer>
      </div>
    </FollowProvider>
  );
}
