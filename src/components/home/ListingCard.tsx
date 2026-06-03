"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useMarketplace } from "@/context/MarketplaceContext";
import { getProductFreshnessLabel } from "@/lib/freshness";
import { formatPrice } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";

interface ListingCardProps {
  product: Product;
  priority?: boolean;
}

export default function ListingCard({ product, priority = false }: ListingCardProps) {
  const { getSellerForProduct } = useMarketplace();
  const seller = getSellerForProduct(product);
  const freshnessLabel = getProductFreshnessLabel(product);
  const photo = product.photos[0]?.url;

  return (
    <div className="group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-warm-100 shadow-sm">
          {photo && (
            <Image
              src={photo}
              alt={product.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {seller && (
            <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-warm-800 backdrop-blur-sm">
                by {seller.name}
              </span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-warm-900 line-clamp-1 group-hover:underline">
              {product.title}
            </h3>
            <span className="shrink-0 font-semibold text-brand-700">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-warm-500">{product.category}</p>
          <p className="text-xs font-medium text-sage-700">{freshnessLabel}</p>
        </div>
      </Link>
      {seller && (
        <Link href={`/sellers/${seller.id}`} className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm text-warm-600 hover:text-brand-700 hover:underline">{seller.name}</span>
          <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" showCount={false} />
        </Link>
      )}
    </div>
  );
}
