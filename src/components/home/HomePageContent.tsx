"use client";



import Link from "next/link";

import Image from "next/image";

import { ArrowRight } from "lucide-react";

import RouteSearchForm from "@/components/search/RouteSearchForm";

import GrowerProfileCard from "@/components/sellers/GrowerProfileCard";

import MiniProductMap from "@/components/home/MiniProductMap";
import AudiencePathCards from "@/components/home/AudiencePathCards";
import PeopleAtWorkGallery from "@/components/home/PeopleAtWorkGallery";

import CommunityGardenMosaic from "@/components/home/CommunityGardenMosaic";

import VideoPreviewRow from "@/components/home/VideoPreviewRow";

import { HERO_IMAGE, VISUAL_SECTIONS } from "@/components/home/home-data";

import { sized, IMG } from "@/data/images";

import { useMarketplace } from "@/context/MarketplaceContext";

import { filterSellersByType } from "@/lib/seller-utils";

import { formatPrice } from "@/lib/utils";

import { getProductFreshnessLabel } from "@/lib/freshness";
import { getSellerAvailabilityLine } from "@/lib/seller-availability";

import StarRating from "@/components/ui/StarRating";



export default function HomePageContent() {

  const { approvedSellers, products, featuredSellers, getSellerForProduct } = useMarketplace();



  const featuredGrowers = (featuredSellers.length > 0 ? featuredSellers : approvedSellers)

    .slice()

    .sort((a, b) => b.reviewCount - a.reviewCount)

    .slice(0, 3);



  const topGardeners = filterSellersByType(approvedSellers, ["Gardener", "Small Producer", "Orchard Grower"])

    .sort((a, b) => b.rating - a.rating)

    .slice(0, 3);



  const beekeepers = filterSellersByType(approvedSellers, ["Beekeeper"]).slice(0, 2);

  const flowerMakers = filterSellersByType(approvedSellers, ["Flower Grower", "Florist"])

    .sort((a, b) => b.rating - a.rating)

    .slice(0, 2);



  const supportingProducts = products.filter((p) => !p.sold).slice(0, 4);



  return (

    <>

      <section className="relative">

        <div className="relative min-h-[52vh] sm:min-h-[58vh]">

          <Image

            src={HERO_IMAGE}

            alt="Tomatoes and vegetables growing in a neighborhood garden"

            fill

            priority

            className="object-cover"

            sizes="100vw"

          />

          <div className="absolute inset-0 bg-hero-warm" />

          <div className="absolute inset-0 bg-gradient-to-b from-warm-950/40 via-sage-900/15 to-sage-50" />

          <div className="relative mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-center px-4 pt-28 pb-8 sm:min-h-[58vh] sm:px-6 sm:pb-10 lg:px-8">

            <div className="max-w-3xl">

              <p className="text-sm font-semibold uppercase tracking-widest text-sage-200">

                Local freshness marketplace

              </p>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">

                Fresh food, flowers &amp; honey from neighbors near you

              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">

                Discover vegetables, fruit, eggs, honey, bouquets, and baked goods from local growers,

                gardeners, beekeepers, and makers — not a grocery aisle.

              </p>

              <AudiencePathCards onDark />

            </div>

          </div>

        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">

          <div className="-mt-16 sm:-mt-20">

            <MiniProductMap />

          </div>

        </div>

      </section>



      <section className="bg-sage-50/90 py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg ring-1 ring-sage-200/80">

              <Image src={VISUAL_SECTIONS.garden.image} alt="Gardener harvesting vegetables" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />

            </div>

            <div>

              <p className="section-label text-sage-700">Growing naturally</p>

              <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">{VISUAL_SECTIONS.garden.title}</h2>

              <p className="mt-3 text-warm-600">{VISUAL_SECTIONS.garden.subtitle}</p>

            </div>

          </div>

        </div>

      </section>

      <section className="border-y border-sage-200/60 bg-cream-100 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="section-label text-sage-700">Local people at work</p>
          <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">
            Harvesting, baking, beekeeping &amp; arranging — in your neighborhood
          </h2>
          <p className="mt-2 max-w-2xl text-warm-600">
            RouteFarm is built around real growers and makers, not anonymous listings.
          </p>
          <div className="mt-8">
            <PeopleAtWorkGallery />
          </div>
        </div>
      </section>

      <section className="bg-warm-gradient py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between">

            <div>

              <p className="section-label text-sage-700">Featured growers</p>

              <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">Meet the people behind the food</h2>

              <p className="mt-2 max-w-lg text-warm-600">

                Real neighbors with gardens, hives, and kitchens — pickup windows that work around day jobs.

              </p>

            </div>

            <Link href="/sellers" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">

              All community members

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>

          <div className="mt-8 space-y-6">

            {featuredGrowers.map((seller) => (

              <GrowerProfileCard key={seller.id} seller={seller} size="large" />

            ))}

          </div>

        </div>

      </section>



      <section className="bg-cream-100 py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between">

            <div>

              <p className="section-label text-sage-700">Trusted by neighbors</p>

              <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">Top rated gardeners &amp; growers</h2>

            </div>

            <Link href="/sellers#type-Gardener" className="hidden items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">

              All gardeners

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {topGardeners.map((seller) => (

              <GrowerProfileCard key={seller.id} seller={seller} />

            ))}

          </div>

        </div>

      </section>



      <section className="bg-sage-50/70 py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="section-label text-sunflower-700">Orchards &amp; apiaries</p>

              <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">{VISUAL_SECTIONS.orchard.title}</h2>

              <p className="mt-3 text-warm-600">{VISUAL_SECTIONS.orchard.subtitle}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {beekeepers.map((seller) => (

                  <GrowerProfileCard key={seller.id} seller={seller} />

                ))}

              </div>

            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg ring-1 ring-warm-200/80">

              <Image src={VISUAL_SECTIONS.orchard.image} alt="Fruit trees at a local orchard" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />

            </div>

          </div>

        </div>

      </section>



      <section className="bg-warm-100/80 py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg ring-1 ring-lavender-200/50 lg:order-1">

              <Image src={VISUAL_SECTIONS.flowers.image} alt="Neighbor cutting fresh flowers" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />

            </div>

            <div className="lg:order-2">

              <p className="section-label text-lavender-700">Also nearby</p>

              <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">{VISUAL_SECTIONS.flowers.title}</h2>

              <p className="mt-3 text-warm-600">{VISUAL_SECTIONS.flowers.subtitle}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {flowerMakers.map((seller) => (

                  <GrowerProfileCard key={seller.id} seller={seller} />

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>



      <section className="bg-sage-50/50 py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <p className="section-label text-sage-700">From their gardens</p>

          <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">Gardens, greenhouses &amp; harvests</h2>

          <div className="mt-8">

            <CommunityGardenMosaic sellers={approvedSellers} />

          </div>

        </div>

      </section>



      <section className="bg-cream-50 py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <p className="section-label text-sunflower-700">Video tours</p>

          <h2 className="mt-1 text-2xl font-bold text-warm-900 sm:text-3xl">Walk through their gardens before you visit</h2>

          <div className="mt-8">

            <VideoPreviewRow sellers={approvedSellers} />

          </div>

        </div>

      </section>



      <section className="border-t border-sage-200/60 bg-sage-50/40 py-12 sm:py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <p className="section-label text-warm-500">Freshness first</p>

          <h2 className="mt-1 text-xl font-bold text-warm-900 sm:text-2xl">What&apos;s ready near you this week</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {supportingProducts.map((product) => {

              const seller = getSellerForProduct(product);

              const photo = product.photos[0]?.url;

              return (

                <div key={product.id} className="rounded-2xl bg-cream-50 p-3 shadow-sm ring-1 ring-sage-200/50">

                  <Link href={`/products/${product.id}`} className="group block">

                    <div className="relative aspect-square overflow-hidden rounded-xl bg-sage-100">

                      {photo && (

                        <Image src={photo} alt={product.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="200px" />

                      )}

                    </div>

                    <p className="mt-2 text-sm font-medium text-warm-900 line-clamp-1">{product.title}</p>

                    <p className="text-sm font-semibold text-brand-700">{formatPrice(product.price)}</p>

                    <p className="mt-1 text-xs font-medium text-sage-700">
                      {getProductFreshnessLabel(product)}
                    </p>
                    {seller && getSellerAvailabilityLine(seller) && (
                      <p className="text-[11px] font-medium text-sunflower-800">
                        {getSellerAvailabilityLine(seller)}
                      </p>
                    )}

                  </Link>

                  {seller && (

                    <Link href={`/sellers/${seller.id}`} className="mt-2 flex items-center gap-2 border-t border-sage-100 pt-2">

                      <div className="relative h-8 w-8 overflow-hidden rounded-full">

                        <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="32px" />

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-xs font-semibold text-warm-800">{seller.name}</p>

                        <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" />

                      </div>

                    </Link>

                  )}

                </div>

              );

            })}

          </div>

        </div>

      </section>



      <section className="border-t border-warm-200 bg-warm-100/90 py-12 sm:py-14">

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="section-label text-warm-500">Optional convenience</p>

            <h2 className="mt-2 text-2xl font-bold text-warm-900">Planning a drive?</h2>

            <p className="mt-2 text-warm-600">Find pickups along your route — after you&apos;ve met the growers you trust.</p>

          </div>

          <div className="card mt-6 border-sage-200/60 bg-cream-50 p-6 shadow-md">

            <RouteSearchForm compact />

          </div>

        </div>

      </section>



      <section className="relative min-h-[280px] overflow-hidden">

        <Image

          src={sized(IMG.personHarvest, 2400, 800)}

          alt="Local gardener harvesting fresh vegetables"

          fill

          className="object-cover"

          sizes="100vw"

        />

        <div className="absolute inset-0 bg-gradient-to-r from-warm-950/85 via-sage-950/60 to-transparent" />

        <div className="relative mx-auto flex min-h-[280px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          <div className="max-w-lg">

            <p className="section-label text-sage-300">Join the community</p>

            <h2 className="mt-2 text-3xl font-bold text-white">Do you grow, garden, bake, or make locally?</h2>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sell" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-sage-50">
                I want to sell
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/buy" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20">
                I want to buy
              </Link>
            </div>

          </div>

        </div>

      </section>

    </>

  );

}

