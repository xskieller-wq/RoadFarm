"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import SellerCard from "@/components/sellers/SellerCard";
import { SELLER_TYPE_LABELS } from "@/data/seller-media";
import type { SellerType } from "@/lib/types";

export default function SellersPageClient() {
  const { approvedSellers } = useMarketplace();

  const typeOrder: SellerType[] = [
    "Gardener", "Flower Grower", "Florist", "Beekeeper", "Orchard Grower", "Small Producer",
  ];

  const grouped = typeOrder.map((type) => ({
    type,
    sellers: approvedSellers.filter((s) => s.sellerType === type),
  })).filter((g) => g.sellers.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label text-blossom-600">Meet your neighbors</p>
          <h1 className="text-3xl font-bold text-warm-900">Local growers near you</h1>
          <p className="mt-2 max-w-xl text-warm-600">
            {approvedSellers.length} growers, gardeners, beekeepers and flower makers — each with photos, badges, and reviews.
          </p>
        </div>
        <Link href="/explore" className="btn-primary shrink-0">
          Explore on map
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {grouped.map(({ type, sellers: group }) => (
        <section key={type} id={`type-${type}`} className="mt-10 scroll-mt-24">
          <h2 className="text-xl font-bold text-warm-900">{SELLER_TYPE_LABELS[type]}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((seller) => (
              <SellerCard key={seller.id} seller={seller} variant="featured" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
