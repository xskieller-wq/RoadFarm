"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Map, List, ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import FilterBar from "@/components/search/FilterBar";
import RouteSearchForm from "@/components/search/RouteSearchForm";
import { useMarketplace } from "@/context/MarketplaceContext";
import { searchProductsAlongRoute, parseSearchParams } from "@/lib/route-search";
import { getBuyerVisibleProducts } from "@/lib/seller-availability";
import { useMemo } from "react";

function ResultsContent() {
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
      {/* Route summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Products along your route</h1>
          <p className="mt-1 text-earth-600">
            <span className="font-medium">{params.start}</span>
            <ArrowRight className="mx-2 inline h-4 w-4" />
            <span className="font-medium">{params.destination}</span>
            <span className="ml-2 text-earth-500">
              · Max {params.maxDetour} min detour
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/map?${searchParams.toString()}`}
            className="btn-secondary"
          >
            <Map className="h-4 w-4" />
            Map view
          </Link>
          <Link href="/search" className="btn-ghost">
            New search
          </Link>
        </div>
      </div>

      {/* Compact search */}
      <details className="card mt-6">
        <summary className="cursor-pointer p-4 text-sm font-medium text-earth-700">
          Modify route search
        </summary>
        <div className="border-t border-earth-200 p-4">
          <RouteSearchForm
            defaultStart={params.start}
            defaultDestination={params.destination}
            defaultMaxDetour={params.maxDetour}
            compact
          />
        </div>
      </details>

      <div className="mt-6">
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </div>

      {/* Results count */}
      <div className="mt-6 flex items-center gap-2">
        <List className="h-5 w-5 text-earth-400" />
        <p className="text-sm text-earth-600">
          <span className="font-semibold text-earth-900">{results.length}</span> products found along your route
        </p>
      </div>

      {results.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <p className="text-lg font-medium text-earth-900">No products found</p>
          <p className="mt-2 text-earth-600">
            Try increasing your maximum detour time or adjusting your filters.
          </p>
          <Link href="/search" className="btn-primary mt-4">
            Adjust search
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-earth-600">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
