"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Shield, ChevronLeft } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useSellerProfile } from "@/lib/phase1/use-seller-profile";
import Phase1SellerProfile from "./Phase1SellerProfile";
import { SELLER_TYPE_LABELS } from "@/data/seller-media";
import type { PickupHours } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import StarRating from "@/components/ui/StarRating";
import SellerBadges from "@/components/sellers/SellerBadges";
import SellerAvailability from "@/components/sellers/SellerAvailability";
import { SellerPhotoGallery, SellerVideoGallery } from "@/components/sellers/SellerMediaGallery";

export default function SellerProfileContent({ id }: { id: string }) {
  const phase1 = useSellerProfile(id);
  const { getSellerById, getProductsBySellerId } = useMarketplace();

  if (phase1.enabled) {
    if (phase1.loading) {
      return <p className="p-8 text-center text-warm-600">Loading seller…</p>;
    }
    if (phase1.seller) {
      return <Phase1SellerProfile seller={phase1.seller} products={phase1.products} />;
    }
  }

  const seller = getSellerById(id);

  if (!seller) {
    return <p className="p-8 text-center text-warm-600">Seller not found.</p>;
  }

  const sellerProducts = getProductsBySellerId(seller.id);

  return (
    <div>
      <div className="relative h-56 bg-warm-200 sm:h-72">
        <Image src={seller.coverPhoto} alt={seller.name} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950/70 via-warm-900/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/sellers" className="btn-ghost -mt-12 relative z-10 mb-4 inline-flex text-white hover:bg-white/20">
          <ChevronLeft className="h-4 w-4" />
          All sellers
        </Link>

        <div className="relative -mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-white bg-warm-100 shadow-xl">
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="128px" />
          </div>
          <div className="flex-1 pb-2">
            <span className="badge bg-lavender-100 text-lavender-700">{SELLER_TYPE_LABELS[seller.sellerType]}</span>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-warm-900 sm:text-3xl">{seller.name}</h1>
              {seller.verified && (
                <span className="flex items-center gap-1 rounded-full bg-lavender-100 px-2.5 py-0.5 text-xs font-medium text-lavender-800">
                  <Shield className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-lg text-warm-600">{seller.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="lg" />
              <span className="flex items-center gap-1 text-warm-600">
                <MapPin className="h-4 w-4" />
                {seller.city}, IL
              </span>
            </div>
            <SellerBadges badges={seller.badges} className="mt-3" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-warm-900">About</h2>
            <p className="mt-2 leading-relaxed text-warm-700">{seller.bio}</p>

            {seller.gardenPhotos.length > 0 && (
              <div className="mt-8">
                <SellerPhotoGallery seller={seller} />
              </div>
            )}
            {seller.videos.length > 0 && (
              <div className="mt-8">
                <SellerVideoGallery seller={seller} />
              </div>
            )}
          </div>

          <div>
            <div className="card p-5">
              <h3 className="font-bold text-warm-900">Pickup &amp; availability</h3>
              <div className="mt-3">
                <SellerAvailability seller={seller} />
              </div>
              <p className="mt-3 text-sm text-warm-600">{seller.pickupLocation}</p>
              <ul className="mt-3 space-y-1 text-sm text-warm-700">
                {seller.pickupHours.map((h: PickupHours) => (
                  <li key={h.day}>{h.day}: {h.open} – {h.close}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-12 pb-12">
          <h2 className="text-xl font-bold text-warm-900">What they share</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellerProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
