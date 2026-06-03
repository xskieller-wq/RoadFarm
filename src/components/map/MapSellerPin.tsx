"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";
import type { Seller } from "@/lib/types";
import { SELLER_TYPE_LABELS } from "@/data/seller-media";
import { useMarketplace } from "@/context/MarketplaceContext";
import { getMainProductCategories } from "@/lib/seller-utils";
import StarRating from "@/components/ui/StarRating";

interface MapSellerPinProps {
  seller: Seller;
  style: { left: string; top: string };
  zIndex?: number;
}

export default function MapSellerPin({ seller, style, zIndex = 10 }: MapSellerPinProps) {
  const { products } = useMarketplace();
  const mainProducts = getMainProductCategories(products, seller.id, 3);

  return (
    <Link
      href={`/sellers/${seller.id}`}
      className="absolute group"
      style={{ ...style, zIndex }}
    >
      {/* Profile photo pin */}
      <div className="relative h-11 w-11 overflow-hidden rounded-full border-[3px] border-white shadow-lg transition-transform group-hover:scale-110 group-hover:ring-4 group-hover:ring-lavender-300/50">
        <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="44px" />
        {seller.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-lavender-500 p-0.5">
            <Shield className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Airbnb-style host card popup */}
      <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-56 -translate-x-1/2 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-warm-200/80 group-hover:block">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-warm-900">{seller.name}</p>
            <p className="truncate text-xs text-warm-500">{SELLER_TYPE_LABELS[seller.sellerType]}</p>
          </div>
        </div>
        <div className="mt-2">
          <StarRating rating={seller.rating} reviewCount={seller.reviewCount} size="sm" />
        </div>
        {mainProducts.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-400">Offers</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {mainProducts.map((cat) => (
                <span key={cat} className="rounded-full bg-warm-100 px-2 py-0.5 text-[10px] font-medium text-warm-700">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
        <p className="mt-2 text-xs text-brand-700 font-medium">View profile →</p>
      </div>
    </Link>
  );
}

export type MapFilter =
  | "all"
  | "growers"
  | "gardeners"
  | "flowers"
  | "beekeepers"
  | "bouquets"
  | "vegetables"
  | "fruits";

export function filterSellersForMap(sellers: Seller[], filter: MapFilter): Seller[] {
  switch (filter) {
    case "growers":
      return sellers.filter((s) => ["Gardener", "Orchard Grower", "Small Producer"].includes(s.sellerType));
    case "gardeners":
      return sellers.filter((s) => s.sellerType === "Gardener");
    case "flowers":
      return sellers.filter((s) => ["Flower Grower", "Florist"].includes(s.sellerType));
    case "beekeepers":
      return sellers.filter((s) => s.sellerType === "Beekeeper");
    case "bouquets":
      return sellers.filter((s) => s.specialties.some((sp) => sp.includes("Bouquet")));
    case "vegetables":
      return sellers.filter((s) => s.specialties.includes("Vegetables") || s.specialties.includes("Herbs"));
    case "fruits":
      return sellers.filter((s) => s.specialties.includes("Fruits"));
    default:
      return sellers;
  }
}

export const MAP_FILTERS: { id: MapFilter; label: string }[] = [
  { id: "all", label: "Everyone" },
  { id: "growers", label: "Growers" },
  { id: "gardeners", label: "Gardeners" },
  { id: "flowers", label: "Flower growers" },
  { id: "beekeepers", label: "Beekeepers" },
  { id: "bouquets", label: "Bouquets" },
  { id: "vegetables", label: "Vegetables" },
  { id: "fruits", label: "Fruits" },
];
