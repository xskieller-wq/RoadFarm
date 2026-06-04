"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Product } from "@/lib/types";
import { useMarketplace } from "@/context/MarketplaceContext";
import { getBakerAvatarImage, getProductDisplayImage } from "@/data/images";
import { foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { formatPrice, getCategoryColor, getFreshnessColor } from "@/lib/utils";
import { formatFreshnessDisplay } from "@/lib/freshness";
import { getSellerAvailabilityLine } from "@/lib/seller-availability";
import StarRating from "@/components/ui/StarRating";
import SellerBadges from "@/components/sellers/SellerBadges";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { getSellerForProduct } = useMarketplace();
  const seller = getSellerForProduct(product);
  const mainPhoto = getProductDisplayImage(product);
  const sellerAvatarUrl =
    seller?.sellerType === "Baker"
      ? getBakerAvatarImage(seller.specialties, seller.id.charCodeAt(1) || 0)
      : seller?.avatar;
  const freshnessLabel = formatFreshnessDisplay(product);
  const availabilityLine = seller ? getSellerAvailabilityLine(seller) : null;

  return (
    <div
      className={cn(
        "card group overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50/30 to-white ring-1 ring-amber-100/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-amber-300/60",
        compact && "text-sm"
      )}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div
          className={cn(
            "relative overflow-hidden bg-warm-100",
            compact ? "aspect-[4/3]" : "aspect-[4/3]"
          )}
        >
          <Image
            src={mainPhoto}
            alt={product.title}
            fill
            className={`${foodPhotoClassName} transition-transform duration-500 group-hover:scale-[1.03]`}
            sizes={compact ? "280px" : "(max-width: 768px) 50vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-950/40 via-transparent to-transparent opacity-60" />
          <div className="absolute left-2 top-2 right-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
                getFreshnessColor(freshnessLabel),
                compact && "text-[10px]"
              )}
            >
              {freshnessLabel}
            </span>
          </div>
        </div>
        <div className={cn(compact ? "p-2.5 pb-1" : "p-4 pb-2")}>
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-semibold text-warm-900 group-hover:text-brand-700 line-clamp-1",
                compact ? "text-sm" : "line-clamp-2"
              )}
            >
              {product.title}
            </h3>
            <span className={cn("shrink-0 font-bold text-brand-700", compact ? "text-sm" : "text-lg")}>
              {formatPrice(product.price)}
            </span>
          </div>
          <span className={cn("badge mt-1", getCategoryColor(product.category), compact && "text-[10px]")}>
            {product.category}
          </span>
          {availabilityLine && (
            <p className={cn("font-medium text-sunflower-800", compact ? "mt-1 text-[10px]" : "mt-2 text-xs")}>
              {availabilityLine}
            </p>
          )}
        </div>
      </Link>
      {seller && !compact && (
        <Link
          href={`/sellers/${seller.id}`}
          className="mx-4 mb-4 block rounded-xl bg-warm-50 p-3 transition-colors hover:bg-warm-100"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
              <Image src={sellerAvatarUrl!} alt={seller.name} fill className="object-cover" sizes="40px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-warm-900">{seller.name}</p>
              <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" />
              <p className="flex items-center gap-0.5 text-xs text-warm-500">
                <MapPin className="h-3 w-3" />
                {seller.city}, IL
              </p>
            </div>
          </div>
          <SellerBadges badges={seller.badges} limit={2} className="mt-2" />
        </Link>
      )}
      {seller && compact && (
        <Link
          href={`/sellers/${seller.id}`}
          className="flex items-center gap-1.5 border-t border-warm-100 px-2.5 py-2 hover:bg-warm-50"
        >
          <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
            <Image src={sellerAvatarUrl!} alt="" fill className="object-cover" sizes="24px" />
          </div>
          <p className="truncate text-[11px] font-medium text-warm-700">{seller.name}</p>
        </Link>
      )}
    </div>
  );
}
