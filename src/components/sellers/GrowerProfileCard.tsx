"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, Play, MapPin } from "lucide-react";
import type { Seller } from "@/lib/types";
import { SELLER_TYPE_LABELS, VIDEO_TYPE_LABELS } from "@/data/seller-media";
import { useMarketplace } from "@/context/MarketplaceContext";
import { getMainProductCategories, getSampleReview } from "@/lib/seller-utils";
import StarRating from "@/components/ui/StarRating";
import SellerBadges from "@/components/sellers/SellerBadges";
import SellerAvailability from "@/components/sellers/SellerAvailability";

interface GrowerProfileCardProps {
  seller: Seller;
  size?: "large" | "standard";
}

export default function GrowerProfileCard({ seller, size = "standard" }: GrowerProfileCardProps) {
  const { products } = useMarketplace();
  const mainProducts = getMainProductCategories(products, seller.id);
  const reviewSnippet = getSampleReview(seller.id);
  const galleryPhotos = [
    seller.gardenPhotos[0],
    seller.flowerPhotos[0],
    seller.greenhousePhotos[0],
    seller.gardenPhotos[1],
  ].filter(Boolean);

  if (size === "large") {
    return (
      <Link
        href={`/sellers/${seller.id}`}
        className="group grid overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-warm-200/80 transition-all hover:shadow-xl hover:ring-lavender-200 lg:grid-cols-5"
      >
        {/* Photo collage — gardens & flowers */}
        <div className="relative min-h-[240px] lg:col-span-2 lg:min-h-[320px]">
          <Image
            src={seller.gardenPhotos[0]?.url || seller.coverPhoto}
            alt={`${seller.name} garden`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            {galleryPhotos.slice(0, 3).map((photo, i) => (
              <div key={i} className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white/80 shadow-md">
                <Image src={photo!.url} alt="" fill className="object-cover" sizes="56px" />
              </div>
            ))}
          </div>
          {seller.videos[0] && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Play className="h-3.5 w-3.5 fill-white" />
              {VIDEO_TYPE_LABELS[seller.videos[0].type]}
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="flex flex-col justify-center p-6 lg:col-span-3 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-warm-100 shadow-lg">
              <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="80px" />
            </div>
            <div>
              <span className="badge bg-lavender-100 text-lavender-700">{SELLER_TYPE_LABELS[seller.sellerType]}</span>
              <div className="mt-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-warm-900 group-hover:text-brand-700">{seller.name}</h3>
                {seller.verified && <Shield className="h-5 w-5 text-lavender-500" />}
              </div>
              <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="lg" className="mt-1" />
              <SellerBadges badges={seller.badges} limit={3} className="mt-2" />
              <p className="mt-1 flex items-center gap-1 text-sm text-warm-500">
                <MapPin className="h-3.5 w-3.5" />
                {seller.city}, IL
              </p>
            </div>
          </div>

          <div className="mt-4">
            <SellerAvailability seller={seller} />
          </div>

          <p className="mt-4 text-warm-700 leading-relaxed line-clamp-2">{seller.bio}</p>

          <blockquote className="mt-4 border-l-4 border-sunflower-300 pl-4 text-sm italic text-warm-600">
            &ldquo;{reviewSnippet}&rdquo;
            <span className="mt-1 block text-xs not-italic text-warm-400">— Verified buyer</span>
          </blockquote>

          {mainProducts.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">What they offer</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {mainProducts.map((cat) => (
                  <span key={cat} className="badge bg-warm-100 text-warm-700">{cat}</span>
                ))}
              </div>
            </div>
          )}

          <span className="mt-5 text-sm font-semibold text-brand-700 group-hover:underline">
            View full profile &amp; garden →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/sellers/${seller.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-warm-200/80 transition-all hover:shadow-lg hover:ring-lavender-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
        <Image
          src={seller.gardenPhotos[0]?.url || seller.greenhousePhotos[0]?.url || seller.flowerPhotos[0]?.url || seller.coverPhoto}
          alt={`${seller.name}'s garden`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {seller.videos[0] && (
          <div className="absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur-sm">
            <Play className="h-4 w-4 fill-white text-white" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-end gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-[3px] border-white shadow-lg">
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="56px" />
          </div>
          <div>
            <p className="font-bold text-white drop-shadow">{seller.name}</p>
            <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" className="text-white [&_span]:text-white/90" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="badge w-fit bg-lavender-100 text-lavender-700">{SELLER_TYPE_LABELS[seller.sellerType]}</span>
        <SellerBadges badges={seller.badges} limit={2} className="mt-2" />
        <p className="mt-2 text-sm text-warm-600 line-clamp-2">{seller.tagline}</p>
        <div className="mt-2">
          <SellerAvailability seller={seller} compact />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {mainProducts.map((cat) => (
            <span key={cat} className="rounded-full bg-warm-50 px-2 py-0.5 text-xs text-warm-600">{cat}</span>
          ))}
        </div>
        <div className="mt-3 flex gap-1.5">
          {[seller.gardenPhotos[0], seller.flowerPhotos[0], seller.greenhousePhotos[0]].filter(Boolean).map((p, i) => (
            <div key={i} className="relative h-10 w-10 overflow-hidden rounded-lg ring-1 ring-warm-200">
              <Image src={p!.url} alt="" fill className="object-cover" sizes="40px" />
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
