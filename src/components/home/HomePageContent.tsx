"use client";



import Link from "next/link";

import { ArrowRight, Bell, Map, MapPin } from "lucide-react";

import RouteSearchForm from "@/components/search/RouteSearchForm";

import MiniProductMap from "@/components/home/MiniProductMap";

import HomeScrollBackground from "@/components/home/HomeScrollBackground";

import { useMarketplace } from "@/context/MarketplaceContext";

import { filterSellersByType } from "@/lib/seller-utils";

import {
  filterLaunchBakeryFeed,
  filterLaunchBakeryProducts,
} from "@/lib/freshdrop/homepage-bakery";

import { useHomeFeed } from "@/lib/phase1/use-home-feed";

import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";


import LaunchFeaturedDrop from "@/components/freshdrop/LaunchFeaturedDrop";

import LaunchCompactRow from "@/components/freshdrop/LaunchCompactRow";

import LaunchProductGrid from "@/components/freshdrop/LaunchProductGrid";

import SellersLocalsChips from "@/components/freshdrop/SellersLocalsChips";

import { productsToMockDrops } from "@/components/freshdrop/mock-drops";

import { bakeryLaunchDrops } from "@/lib/freshdrop/bakery-feed";

import { launchShellPanel } from "@/lib/freshdrop/launch-card-styles";



export default function HomePageContent() {

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

  const launchDrops = bakeryLaunchDrops(rawDrops);



  const featuredDrop = launchDrops[0] ?? null;

  const compactDrops = launchDrops.slice(1, 5);

  const moreDrops = launchDrops.slice(5, 9);

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

        <HomeScrollBackground />



        <div className="relative z-10">

          <div data-home-bg="bakery-top" className="relative">

            <section className="px-4 pt-24 pb-4 sm:px-6 lg:px-8">

              <div className="mx-auto max-w-7xl">

                <p className="text-xs font-semibold uppercase tracking-widest text-amber-100/90">

                  FreshDrop

                </p>

                <h1 className="mt-1 max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">

                  Today&apos;s Fresh Drops

                </h1>

                <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">

                  Fresh bakery drops near you today.

                </p>

              </div>

            </section>



            <section

              id="fresh-drops"

              className="scroll-mt-20 px-4 pb-10 sm:px-6 lg:px-8"

              aria-label="Today's fresh bakery drops"

            >

              <div className={`mx-auto max-w-7xl space-y-5 ${launchShellPanel}`}>

                {featuredDrop && !loading && <LaunchFeaturedDrop item={featuredDrop} />}



                {loading && (

                  <div className="h-[280px] animate-pulse rounded-2xl bg-warm-200/80" aria-hidden />

                )}



                {(compactDrops.length > 0 || loading) && (

                  <div>

                    <p className="mb-3 text-sm font-medium text-warm-800/95">

                      More fresh bakery nearby

                    </p>

                    <LaunchCompactRow items={compactDrops} loading={loading} />

                  </div>

                )}



                {!loading && launchDrops.length === 0 && (

                  <p className="text-center text-sm text-warm-700">

                    No live drops yet — check back this morning or follow a baker below.

                  </p>

                )}



                {!loading && moreDrops.length > 0 && (

                  <div className="border-t border-white/20 pt-5">

                    <div className="mb-3 flex items-end justify-between gap-2">

                      <p className="text-sm font-medium text-warm-800/95">Still available today</p>

                      <Link

                        href="/browse"

                        className="text-xs font-semibold text-warm-700 hover:text-brand-800"

                      >

                        Browse all

                        <ArrowRight className="ml-0.5 inline h-3.5 w-3.5" />

                      </Link>

                    </div>

                    <LaunchProductGrid items={moreDrops} />

                  </div>

                )}



                {!loading && <SellersLocalsChips sellers={chipSellers} />}

              </div>

            </section>

          </div>



          <div data-home-bg="bakery-mid" className="relative border-t border-warm-200/20">

            <section

              className="bg-cream-50/95 px-4 py-10 sm:px-6 lg:px-8"

              aria-label="Map and pickup on your route"

            >

              <div className="mx-auto max-w-7xl">

                <p className="text-xs font-semibold uppercase tracking-widest text-warm-500">

                  Discover

                </p>

                <h2 className="mt-1 text-lg font-bold text-warm-950">Map &amp; pickup on your way</h2>

                <p className="mt-1 max-w-xl text-sm text-warm-600">

                  Optional tools to find drops along your commute — browse and reserve above first.

                </p>



                <div className="mt-4 flex flex-wrap gap-3">

                  <Link

                    href="/explore"

                    className="inline-flex items-center gap-2 rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-semibold text-warm-800 shadow-sm hover:border-amber-200"

                  >

                    <Map className="h-4 w-4 text-brand-700" aria-hidden />

                    Open map

                  </Link>

                  <Link

                    href="/search"

                    className="inline-flex items-center gap-2 rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-semibold text-warm-800 shadow-sm hover:border-amber-200"

                  >

                    <MapPin className="h-4 w-4 text-brand-700" aria-hidden />

                    On your route

                  </Link>

                  <Link

                    href="/browse"

                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-brand-800 hover:text-brand-900"

                  >

                    Browse all drops

                    <ArrowRight className="h-4 w-4" />

                  </Link>

                </div>



                <div className="mt-6 overflow-hidden rounded-2xl border border-warm-200/80 bg-white shadow-sm">

                  <MiniProductMap />

                </div>



                <div className="mt-6 rounded-2xl border border-warm-200/80 bg-white p-4 shadow-sm">

                  <p className="text-sm font-semibold text-warm-900">Pickup on your way home</p>

                  <p className="mt-0.5 text-xs text-warm-600">See bakery stops that fit your commute.</p>

                  <div className="mt-3">

                    <RouteSearchForm compact />

                  </div>

                </div>

              </div>

            </section>



            <section

              id="batch-alerts"

              className="scroll-mt-24 border-t border-amber-200/40 bg-gradient-to-r from-amber-50/95 via-cream-50 to-amber-50/90 py-8"

            >

              <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600/90 text-white shadow-sm">

                    <Bell className="h-5 w-5" aria-hidden />

                  </div>

                  <div>

                    <h2 className="text-base font-bold text-warm-950">Batch alerts</h2>

                    <p className="text-sm text-warm-600">Know when bakers you follow drop.</p>

                  </div>

                </div>

                <Link href="/buy/alerts" className="btn-reserve shrink-0">

                  Get alerts

                </Link>

              </div>

            </section>

          </div>

        </div>

      </div>

  );

}

