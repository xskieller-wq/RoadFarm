"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, MapPin, ChevronRight } from "lucide-react";
import type { Seller, Product } from "@/lib/types";
import { SELLER_TYPE_LABELS } from "@/data/seller-media";
import { useMarketplace } from "@/context/MarketplaceContext";
import {
  getMainProductCategories,
  getSellerCardImage,
  getSellerHighlightProducts,
  formatProductFreshnessLine,
} from "@/lib/seller-utils";
import { getSellerAvailabilityLine } from "@/lib/seller-availability";
import { getBakerAvatarImage } from "@/data/images";
import StarRating from "@/components/ui/StarRating";

interface GrowerProfileCardProps {
  seller: Seller;
  /** @deprecated Use compact layout only — kept for API compatibility */
  size?: "large" | "standard";
}

function ProductHighlights({ products, sellerId }: { products: Product[]; sellerId: string }) {
  const highlights = getSellerHighlightProducts(products, sellerId, 2);
  if (highlights.length === 0) return null;

  return (
    <ul className="mt-1.5 space-y-0.5">
      {highlights.map((p) => (
        <li key={p.id} className="flex items-center justify-between gap-2 text-xs">
          <span className="truncate font-medium text-warm-800">{p.title}</span>
          <span className="shrink-0 text-[10px] font-semibold text-sage-700">
            {formatProductFreshnessLine(p)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Dense baker profile row for homepage and listings */
export default function GrowerProfileCard({ seller }: GrowerProfileCardProps) {
  const { products } = useMarketplace();
  const mainCategories = getMainProductCategories(products, seller.id, 3);
  const cardImage = getSellerCardImage(seller);
  const avatarSrc =
    seller.sellerType === "Baker"
      ? getBakerAvatarImage(seller.specialties, seller.id.charCodeAt(1) || 0)
      : seller.avatar;
  const availabilityLine = getSellerAvailabilityLine(seller);

  return (
    <Link
      href={`/sellers/${seller.id}`}
      className="group flex gap-3 overflow-hidden rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-warm-200/80 transition-all hover:shadow-md hover:ring-brand-200"
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-warm-100 sm:h-[4.5rem] sm:w-24">
        <Image
          src={cardImage}
          alt={seller.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="96px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <div className="relative hidden h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-warm-100 sm:block">
              <Image src={avatarSrc} alt="" fill className="object-cover" sizes="36px" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="truncate text-sm font-bold text-warm-900 group-hover:text-brand-700">
                  {seller.name}
                </h3>
                {seller.verified && <Shield className="h-3.5 w-3.5 shrink-0 text-lavender-500" />}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-warm-500">
                <span>{SELLER_TYPE_LABELS[seller.sellerType]}</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {seller.city}
                </span>
                <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" />
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-warm-400 group-hover:text-brand-600" />
        </div>

        {availabilityLine && (
          <p className="mt-0.5 text-[11px] font-semibold text-sunflower-800">{availabilityLine}</p>
        )}

        {mainCategories.length > 0 && (
          <p className="mt-0.5 truncate text-[11px] text-warm-600">{mainCategories.join(" · ")}</p>
        )}

        <ProductHighlights products={products} sellerId={seller.id} />
      </div>
    </Link>
  );
}
