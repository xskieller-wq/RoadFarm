"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { List, ArrowRight } from "lucide-react";
import MapView from "@/components/map/MapView";
import { useMarketplace } from "@/context/MarketplaceContext";
import { searchProductsAlongRoute, parseSearchParams } from "@/lib/route-search";
import { getBuyerVisibleProducts } from "@/lib/seller-availability";
import { useMemo } from "react";

function MapContent() {
  const { products, sellers, hydrated } = useMarketplace();
  const searchParams = useSearchParams();
  const params = parseSearchParams(searchParams);
  const visibleProducts = useMemo(
    () => (hydrated ? getBuyerVisibleProducts(products, sellers) : []),
    [products, sellers, hydrated]
  );
  const results = searchProductsAlongRoute(visibleProducts, params);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Map view</h1>
          <p className="mt-1 text-earth-600">
            <span className="font-medium">{params.start}</span>
            <ArrowRight className="mx-2 inline h-4 w-4" />
            <span className="font-medium">{params.destination}</span>
          </p>
        </div>
        <Link href={`/results?${searchParams.toString()}`} className="btn-secondary">
          <List className="h-4 w-4" />
          List view
        </Link>
      </div>

      <div className="mt-6">
        <MapView products={results} start={params.start} destination={params.destination} />
      </div>

      <p className="mt-4 text-center text-sm text-earth-500">
        Click numbered markers to view product details. Map shows approximate locations along your route.
      </p>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-earth-600">Loading map...</div>}>
      <MapContent />
    </Suspense>
  );
}
