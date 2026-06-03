"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Product } from "@/lib/types";
import { useMarketplace } from "@/context/MarketplaceContext";
import { getProductImage } from "@/data/images";
import { formatPrice, getCategoryColor, getFreshnessColor } from "@/lib/utils";
import { getProductFreshnessLabel } from "@/lib/freshness";
import { getSellerAvailabilityLine } from "@/lib/seller-availability";
import StarRating from "@/components/ui/StarRating";
import SellerBadges from "@/components/sellers/SellerBadges";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { getSellerForProduct } = useMarketplace();
  const seller = getSellerForProduct(product);
  const mainPhoto = product.photos[0]?.url ?? getProductImage(product.category, product.title);
  const freshnessLabel = getProductFreshnessLabel(product);
  const availabilityLine = seller ? getSellerAvailabilityLine(seller) : null;

  return (
    <div className="card group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
          <Image
            src={mainPhoto}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 right-3 flex flex-col items-start gap-1">
            <span className={`badge ${getFreshnessColor(freshnessLabel)}`}>
              {freshnessLabel}
            </span>
          </div>
        </div>
        <div className="p-4 pb-2">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-warm-900 group-hover:text-brand-700 line-clamp-2">
              {product.title}
            </h3>
            <span className="shrink-0 text-lg font-bold text-brand-700">
              {formatPrice(product.price)}
            </span>
          </div>
          <span className={`badge ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
          {availabilityLine && (
            <p className="mt-2 text-xs font-medium text-sunflower-800">{availabilityLine}</p>
          )}
        </div>
      </Link>
      {seller && (
        <Link
          href={`/sellers/${seller.id}`}
          className="mx-4 mb-4 block rounded-xl bg-warm-50 p-3 transition-colors hover:bg-warm-100"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
              <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="40px" />
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
    </div>
  );
}
