"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Navigation, Zap } from "lucide-react";
import type { Product, Seller } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  formatProductDistance,
  getCategoryEmoji,
  getProductMiniMapCategory,
} from "@/lib/product-map-utils";
import StarRating from "@/components/ui/StarRating";
import { getProductDisplayImage } from "@/data/images";
import { getProductFreshnessLabel } from "@/lib/freshness";
import {
  getSellerAvailabilityLine,
  isSellerAvailableNow,
} from "@/lib/seller-availability";

interface ProductMapPinProps {
  product: Product;
  seller: Seller;
  style: { left: string; top: string };
  compact?: boolean;
  selected?: boolean;
  onSelect: () => void;
}

export default function ProductMapPin({
  product,
  seller,
  style,
  compact = false,
  selected = false,
  onSelect,
}: ProductMapPinProps) {
  const category = getProductMiniMapCategory(product);
  const emoji = category && category !== "all" ? getCategoryEmoji(category) : "🛒";
  const productPhoto = getProductDisplayImage(product);
  const distance = formatProductDistance(product.estimatedDetourMinutes);
  const freshnessLabel = getProductFreshnessLabel(product);
  const availabilityLine = getSellerAvailabilityLine(seller);
  const availableNow = isSellerAvailableNow(seller);
  const pinSize = compact ? "text-xl" : "text-2xl";

  return (
    <div className={`absolute ${availableNow ? "z-20" : "z-10"}`} style={style}>
      <div className="relative">
        {availableNow && (
          <span className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-sunflower-400 shadow-md ring-2 ring-white">
            <Zap className="h-3 w-3 text-sunflower-950" aria-hidden />
          </span>
        )}
        <button
          type="button"
          onClick={onSelect}
          className={`group flex flex-col items-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
            selected ? "scale-110" : ""
          }`}
          aria-label={`${product.title}, ${formatPrice(product.price)}`}
        >
          <div
            className={`flex items-center justify-center rounded-2xl border-[3px] border-white bg-white shadow-lg transition-shadow group-hover:shadow-xl ${
              availableNow
                ? "ring-2 ring-sunflower-400 shadow-sunflower-200/80"
                : "ring-1 ring-warm-200/80"
            } ${selected ? "ring-2 ring-brand-400 shadow-xl" : ""} ${compact ? "h-11 w-11" : "h-12 w-12 sm:h-14 sm:w-14"} ${pinSize}`}
          >
            {emoji}
          </div>
          <span
            className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md sm:text-xs ${
              availableNow ? "bg-sunflower-600" : "bg-brand-600"
            }`}
          >
            {formatPrice(product.price)}
          </span>
        </button>

        {selected && (
          <div className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-warm-200/80">
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-warm-100">
                <Image src={productPhoto} alt={product.title} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-warm-900 line-clamp-2">{product.title}</p>
                <p className="mt-0.5 text-base font-bold text-brand-700">{formatPrice(product.price)}</p>
                <p className="mt-1 text-[11px] font-medium text-sage-700">{freshnessLabel}</p>
                {availabilityLine && (
                  <p className="mt-0.5 text-[11px] font-semibold text-sunflower-800">{availabilityLine}</p>
                )}
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-warm-500">
                  <Navigation className="h-3 w-3" />
                  {distance}
                </p>
              </div>
            </div>

            <div className="mt-3 border-t border-warm-100 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-400">
                From a local seller
              </p>
              <p className="mt-1 text-sm font-semibold text-warm-900">{seller.name}</p>
              <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" />
              <p className="mt-0.5 flex items-center gap-0.5 text-xs text-warm-500">
                <MapPin className="h-3 w-3" />
                {seller.city}, IL
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <Link
                href={`/products/${product.id}`}
                className="flex-1 rounded-lg bg-brand-600 py-2 text-center text-xs font-semibold text-white hover:bg-brand-700"
              >
                View product
              </Link>
              <Link
                href={`/sellers/${seller.id}`}
                className="flex-1 rounded-lg bg-warm-100 py-2 text-center text-xs font-semibold text-warm-800 hover:bg-warm-200"
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
