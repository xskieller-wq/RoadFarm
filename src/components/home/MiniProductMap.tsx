"use client";

import { useMemo } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { filterProductsForMap } from "@/lib/seller-availability";
import ProductDiscoveryMap from "@/components/map/ProductDiscoveryMap";

export default function MiniProductMap() {
  const { products, approvedSellers } = useMarketplace();
  const mapProducts = useMemo(
    () => filterProductsForMap(products, approvedSellers),
    [products, approvedSellers]
  );

  return (
    <ProductDiscoveryMap
      products={mapProducts}
      sellers={approvedSellers}
      compact
      embedded
      initialCategories={["all"]}
      ctaHref="/explore"
      ctaLabel="Explore fresh bakery near you"
    />
  );
}
