"use client";

import { useMemo } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { filterProductsForMap } from "@/lib/seller-availability";
import ProductDiscoveryMap from "@/components/map/ProductDiscoveryMap";

export default function ExploreMapClient() {
  const { products, approvedSellers } = useMarketplace();
  const mapProducts = useMemo(
    () => filterProductsForMap(products, approvedSellers),
    [products, approvedSellers]
  );

  return (
    <ProductDiscoveryMap
      products={mapProducts}
      sellers={approvedSellers}
      showRoutePanel
      showProductList
      initialCategories={["all"]}
    />
  );
}
