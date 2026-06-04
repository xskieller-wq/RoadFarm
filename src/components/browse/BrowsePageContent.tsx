"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeScrollBackground from "@/components/home/HomeScrollBackground";
import LaunchFeaturedDrop from "@/components/freshdrop/LaunchFeaturedDrop";
import LaunchCompactRow from "@/components/freshdrop/LaunchCompactRow";
import LaunchProductGrid from "@/components/freshdrop/LaunchProductGrid";
import SellersLocalsChips from "@/components/freshdrop/SellersLocalsChips";
import { productsToMockDrops } from "@/components/freshdrop/mock-drops";
import { useMarketplace } from "@/context/MarketplaceContext";
import { filterSellersByType } from "@/lib/seller-utils";
import {
  filterLaunchBakeryFeed,
  filterLaunchBakeryProducts,
} from "@/lib/freshdrop/homepage-bakery";
import { bakeryBrowseDrops } from "@/lib/freshdrop/bakery-feed";
import { launchShellPanel } from "@/lib/freshdrop/launch-card-styles";
import { useHomeFeed } from "@/lib/phase1/use-home-feed";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

export default function BrowsePageContent() {
  const { approvedSellers, products, featuredSellers, hydrated } = useMarketplace();
  const phase1Feed = useHomeFeed();

  const showLiveFeed =
    isPhase1SupabaseEnabled() &&
    phase1Feed.source === "supabase" &&
    phase1Feed.items.length > 0;

  const bakeryProducts = filterLaunchBakeryProducts(products);
  const rawDrops = showLiveFeed
    ? filterLaunchBakeryFeed(phase1Feed.items)
    : productsToMockDrops(bakeryProducts, approvedSellers);
  const launchDrops = bakeryBrowseDrops(rawDrops);

  const featuredDrop = launchDrops[0] ?? null;
  const compactDrops = launchDrops.slice(1, 5);
  const loading = !hydrated || (showLiveFeed && phase1Feed.loading);

  const allBakers = filterSellersByType(approvedSellers, ["Baker"]).sort((a, b) => b.rating - a.rating);
  const chipSellers = (
    featuredSellers.length > 0
      ? [...featuredSellers.filter((s) => s.sellerType === "Baker"), ...allBakers]
      : allBakers
  )
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i)
    .slice(0, 8);

  return (
    <div className="relative min-h-screen bg-transparent">
      <HomeScrollBackground variant="browse" />

      <div className="relative z-10">
        <div data-home-bg="bakery-top" className="relative">
          <section className="px-4 pt-24 pb-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-100/90">
                FreshDrop
              </p>
              <h1 className="mt-1 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Browse today&apos;s drops
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
                Every live bakery batch near you — reserve pickup before trays sell out.
              </p>
            </div>
          </section>

          <section
            id="fresh-drops"
            className="scroll-mt-20 px-4 pb-12 sm:px-6 lg:px-8"
            aria-label="Today's fresh bakery drops"
          >
            <div className={`mx-auto max-w-7xl space-y-5 ${launchShellPanel}`}>
              {featuredDrop && !loading && <LaunchFeaturedDrop item={featuredDrop} />}

              {loading && (
                <div className="h-[280px] animate-pulse rounded-2xl bg-warm-200/80" aria-hidden />
              )}

              {(compactDrops.length > 0 || loading) && (
                <div>
                  <p className="mb-3 text-sm font-medium text-warm-800/95">More fresh bakery nearby</p>
                  <LaunchCompactRow items={compactDrops} loading={loading} />
                </div>
              )}

              {!loading && launchDrops.length === 0 && (
                <p className="text-center text-sm text-warm-700">
                  No live drops yet — check back this morning or follow a baker below.
                </p>
              )}

              {!loading && launchDrops.length > 0 && (
                <div className="border-t border-white/20 pt-5">
                  <div className="mb-3 flex items-end justify-between gap-2">
                    <p className="text-sm font-medium text-warm-800/95">All drops today</p>
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-warm-700 hover:text-brand-800"
                    >
                      Map view
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                  <LaunchProductGrid items={launchDrops} limit={launchDrops.length} />
                </div>
              )}

              {!loading && <SellersLocalsChips sellers={chipSellers} />}
            </div>
          </section>
        </div>

        <div data-home-bg="bakery-mid" className="relative border-t border-warm-200/20">
          <section
            className="bg-cream-50/95 px-4 py-10 sm:px-6 lg:px-8"
            aria-label="More ways to discover drops"
          >
            <div className="mx-auto max-w-7xl text-center">
              <p className="text-sm text-warm-600">
                Want drops along your commute?{" "}
                <Link href="/explore" className="font-semibold text-brand-800 hover:text-brand-900">
                  Open the map
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
