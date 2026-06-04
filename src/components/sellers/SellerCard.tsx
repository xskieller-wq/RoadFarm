import Link from "next/link";
import Image from "next/image";
import { Shield, Play } from "lucide-react";
import type { Seller } from "@/lib/types";
import { SELLER_TYPE_LABELS } from "@/data/seller-media";
import SellerBadges from "@/components/sellers/SellerBadges";
import StarRating from "@/components/ui/StarRating";

interface SellerCardProps {
  seller: Seller;
  variant?: "default" | "compact" | "featured";
}

export default function SellerCard({ seller, variant = "default" }: SellerCardProps) {
  const previewPhoto =
    seller.flowerPhotos[0]?.url ||
    seller.gardenPhotos[0]?.url ||
    seller.coverPhoto;

  if (variant === "compact") {
    return (
      <Link
        href={`/sellers/${seller.id}`}
        className="group flex items-center gap-3 rounded-2xl border border-warm-200/55 bg-white/92 p-3 shadow-sm ring-1 ring-warm-100/70 transition-shadow hover:shadow-md hover:ring-warm-300/50"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-warm-100">
          <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-semibold text-warm-900 group-hover:underline">{seller.name}</h3>
            {seller.verified && <Shield className="h-3.5 w-3.5 shrink-0 text-lavender-500" />}
          </div>
          <p className="truncate text-xs text-warm-500">{SELLER_TYPE_LABELS[seller.sellerType]}</p>
          <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/sellers/${seller.id}`}
      className="group block overflow-hidden rounded-2xl border border-warm-200/55 bg-white/92 shadow-md shadow-warm-950/5 ring-1 ring-warm-100/70 transition-all hover:shadow-lg hover:ring-warm-300/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-warm-100">
        <Image
          src={seller.coverPhoto}
          alt={seller.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {seller.videos[0] && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
            <Play className="h-3 w-3 fill-white" />
            Video tour
          </div>
        )}
      </div>
      <div className="relative px-4 pb-4">
        <div className="relative -mt-8 mb-3 inline-block">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow-md">
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="64px" />
          </div>
        </div>
        <span className="badge bg-lavender-100 text-lavender-700">{SELLER_TYPE_LABELS[seller.sellerType]}</span>
        <div className="mt-2 flex items-center gap-1.5">
          <h3 className="font-semibold text-warm-900 group-hover:underline">{seller.name}</h3>
          {seller.verified && <Shield className="h-4 w-4 text-lavender-500" />}
        </div>
        <p className="mt-0.5 text-sm text-warm-600 line-clamp-2">{seller.tagline}</p>
        <SellerBadges badges={seller.badges} limit={3} className="mt-2" />
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="md" />
          <span className="text-warm-400">·</span>
          <span className="text-warm-600">{seller.city}</span>
        </div>
        {variant === "featured" && previewPhoto && (
          <div className="mt-3 flex gap-2">
            {[previewPhoto, seller.gardenPhotos[1]?.url, seller.greenhousePhotos[0]?.url]
              .filter(Boolean)
              .slice(0, 3)
              .map((url, i) => (
                <div key={i} className="relative h-12 w-12 overflow-hidden rounded-lg ring-1 ring-warm-200">
                  <Image src={url!} alt="" fill className="object-cover" sizes="48px" />
                </div>
              ))}
          </div>
        )}
      </div>
    </Link>
  );
}
