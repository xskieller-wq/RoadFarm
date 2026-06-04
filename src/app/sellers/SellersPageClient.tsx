"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import SellerCard from "@/components/sellers/SellerCard";
import { SELLER_TYPE_LABELS } from "@/data/seller-media";
import type { SellerType } from "@/lib/types";
import FreshDropPageShell, {
  FreshDropPageHeader,
} from "@/components/layout/FreshDropPageShell";
import { freshDropSectionTitle, freshDropEyebrow } from "@/lib/freshdrop/buyer-page-styles";
import { FollowProvider } from "@/components/freshdrop/FollowContext";

const TYPE_ORDER: SellerType[] = [
  "Baker",
  "Gardener",
  "Flower Grower",
  "Florist",
  "Beekeeper",
  "Orchard Grower",
  "Small Producer",
];

export default function SellersPageClient() {
  const { approvedSellers } = useMarketplace();

  const bakers = approvedSellers.filter((s) => s.sellerType === "Baker");
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    sellers: approvedSellers.filter((s) => s.sellerType === type),
  })).filter((g) => g.sellers.length > 0);

  return (
    <FollowProvider>
      <FreshDropPageShell width="wide">
        <FreshDropPageHeader
          eyebrow="Follow sellers"
          title="Local bakers near you"
          description={
            bakers.length > 0
              ? `${bakers.length} neighborhood baker${bakers.length === 1 ? "y" : "ies"} with fresh batch times and pickup windows. Follow the ones you trust — they surface first each morning.`
              : "Neighborhood sellers with photos, badges, and reviews."
          }
        >
          <Link href="/buy/following" className="btn-secondary inline-flex items-center gap-2 text-sm">
            Your account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FreshDropPageHeader>

        {grouped.map(({ type, sellers: group }) => (
          <section key={type} id={`type-${type}`} className="mb-12 scroll-mt-24 last:mb-6">
            <p className={freshDropEyebrow}>{SELLER_TYPE_LABELS[type]}</p>
            <h2 className={freshDropSectionTitle}>{SELLER_TYPE_LABELS[type]}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((seller) => (
                <SellerCard key={seller.id} seller={seller} variant="featured" />
              ))}
            </div>
          </section>
        ))}
      </FreshDropPageShell>
    </FollowProvider>
  );
}
