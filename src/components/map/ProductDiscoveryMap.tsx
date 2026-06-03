"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, ChevronUp, Package, Zap, ArrowRight, List } from "lucide-react";
import { isSellerAvailableNow } from "@/lib/seller-availability";
import type { Product, RouteSearchParams, Seller } from "@/lib/types";
import { searchProductsAlongRoute, buildSearchQueryString } from "@/lib/route-search";
import ProductMapPin from "./ProductMapPin";
import MapCanvasBackground from "./MapCanvasBackground";
import RouteSearchForm from "@/components/search/RouteSearchForm";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/utils";
import {
  MINI_MAP_CATEGORIES,
  type MiniMapCategory,
  filterProductsByMiniMapCategories,
  getMapBounds,
  productToMapPosition,
  getPriceRange,
} from "@/lib/product-map-utils";

interface ProductDiscoveryMapProps {
  products: Product[];
  sellers: Seller[];
  compact?: boolean;
  showRoutePanel?: boolean;
  showProductList?: boolean;
  initialCategories?: MiniMapCategory[];
  ctaHref?: string;
  ctaLabel?: string;
}

export default function ProductDiscoveryMap({
  products,
  sellers,
  compact = false,
  showRoutePanel = false,
  showProductList = false,
  initialCategories = ["all"],
  ctaHref,
  ctaLabel,
}: ProductDiscoveryMapProps) {
  const [activeCategories, setActiveCategories] = useState<Set<MiniMapCategory>>(
    new Set(initialCategories)
  );
  const [mapMode, setMapMode] = useState<"nearby" | "route">("nearby");
  const [routeOpen, setRouteOpen] = useState(false);
  const [routeParams, setRouteParams] = useState<RouteSearchParams | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const sellerMap = useMemo(() => new Map(sellers.map((s) => [s.id, s])), [sellers]);
  const bounds = useMemo(() => getMapBounds(sellers), [sellers]);

  const categoryFiltered = useMemo(
    () => filterProductsByMiniMapCategories(products, activeCategories),
    [products, activeCategories]
  );

  const visibleProducts = useMemo(() => {
    if (mapMode === "route" && routeParams) {
      return searchProductsAlongRoute(categoryFiltered, routeParams);
    }
    return categoryFiltered;
  }, [mapMode, routeParams, categoryFiltered]);

  const enterRouteMode = () => {
    setMapMode("route");
    setRouteOpen(true);
    setSelectedProductId(null);
  };

  const exitRouteMode = () => {
    setMapMode("nearby");
    setRouteParams(null);
    setRouteOpen(false);
    setSelectedProductId(null);
  };

  const priceRange = useMemo(() => getPriceRange(visibleProducts), [visibleProducts]);

  const sellerOffsets = useMemo(() => {
    const counts = new Map<string, number>();
    return visibleProducts.map((product) => {
      const count = counts.get(product.sellerId) ?? 0;
      counts.set(product.sellerId, count + 1);
      return count;
    });
  }, [visibleProducts]);

  const toggleCategory = (id: MiniMapCategory) => {
    setSelectedProductId(null);
    setActiveCategories((prev) => {
      if (id === "all") return new Set(["all"]);
      const next = new Set(prev);
      next.delete("all");
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) return new Set(["all"]);
      return next;
    });
  };

  // Close popup when clicking map background
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setSelectedProductId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const availableNowCount = useMemo(
    () =>
      new Set(
        visibleProducts
          .filter((p) => {
            const s = sellerMap.get(p.sellerId);
            return s && isSellerAvailableNow(s);
          })
          .map((p) => p.sellerId)
      ).size,
    [visibleProducts, sellerMap]
  );

  const activeLabels = MINI_MAP_CATEGORIES.filter(
    (c) => c.id !== "all" && activeCategories.has(c.id)
  )
    .map((c) => c.label.toLowerCase())
    .join(", ");

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-warm-200/80">
      <div className={`grid ${compact ? "" : "lg:grid-cols-[272px_1fr]"}`}>
        {/* Filters */}
        <div className={`border-warm-100 bg-sage-50/80 p-5 ${compact ? "border-b lg:border-b-0" : "lg:border-r"}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-700">
            Filter products
          </p>
          <div className={`mt-3 space-y-1 ${compact ? "max-h-48 overflow-y-auto pr-1" : "max-h-[min(520px,70vh)] overflow-y-auto pr-1"}`}>
            {MINI_MAP_CATEGORIES.map((cat) => {
              const checked = activeCategories.has(cat.id);
              return (
                <label
                  key={cat.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    checked ? "bg-white shadow-sm ring-1 ring-brand-200" : "hover:bg-white/70"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(cat.id)}
                    className="h-4 w-4 rounded border-warm-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span className={`text-sm font-medium ${checked ? "text-warm-900" : "text-warm-600"}`}>
                    {cat.label}
                  </span>
                </label>
              );
            })}
          </div>

          {showRoutePanel && !compact && (
            <div className="mt-6 border-t border-warm-200 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (mapMode === "route") {
                    setRouteOpen(!routeOpen);
                  } else {
                    enterRouteMode();
                  }
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  mapMode === "route"
                    ? "bg-brand-600 text-white shadow-md"
                    : "text-warm-800 hover:bg-white/80"
                }`}
              >
                Along My Route
                {routeOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {routeOpen && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-warm-500">
                    {mapMode === "route"
                      ? "Set your drive — the map updates with stops along the way"
                      : "Find pickups on your drive"}
                  </p>
                  <RouteSearchForm
                    compact
                    defaultStart={routeParams?.start}
                    defaultDestination={routeParams?.destination}
                    defaultMaxDetour={routeParams?.maxDetour ?? 5}
                    onRouteSearch={(params) => {
                      setRouteParams(params);
                      setMapMode("route");
                    }}
                    submitLabel="Update map for this route"
                  />
                  {mapMode === "route" && (
                    <button
                      type="button"
                      onClick={exitRouteMode}
                      className="mt-3 w-full text-left text-xs font-medium text-brand-700 hover:underline"
                    >
                      ← Back to neighborhood map
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map */}
        <div
          ref={mapRef}
          className={`relative ${compact ? "min-h-[320px] sm:min-h-[380px]" : "min-h-[420px] sm:min-h-[520px]"}`}
          onClick={() => setSelectedProductId(null)}
        >
          <MapCanvasBackground />

          {mapMode === "route" && routeParams && (
            <div className="absolute left-4 right-4 top-4 z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl bg-brand-600/95 px-4 py-3 text-sm text-white shadow-lg backdrop-blur">
                <p className="font-semibold">Along your route</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-white/90">
                  <span>{routeParams.start}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  <span>{routeParams.destination}</span>
                  <span className="text-white/70">· max {routeParams.maxDetour} min detour</span>
                </p>
              </div>
              <Link
                href={`/results?${buildSearchQueryString(routeParams)}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-brand-700 shadow-md hover:bg-white"
              >
                <List className="h-4 w-4" />
                List view
              </Link>
            </div>
          )}

          {visibleProducts.map((product, i) => {
            const seller = sellerMap.get(product.sellerId);
            if (!seller) return null;
            const pos = productToMapPosition(seller, bounds, sellerOffsets[i]);
            return (
              <div key={product.id} onClick={(e) => e.stopPropagation()}>
                <ProductMapPin
                  product={product}
                  seller={seller}
                  style={pos}
                  compact={compact}
                  selected={selectedProductId === product.id}
                  onSelect={() =>
                    setSelectedProductId((prev) => (prev === product.id ? null : product.id))
                  }
                />
              </div>
            );
          })}

          {visibleProducts.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="rounded-2xl bg-white/95 px-5 py-3 text-center text-sm text-warm-600 shadow-md backdrop-blur">
                {mapMode === "route" && routeParams
                  ? "No products along this route with your filters. Try more detour time or another category."
                  : "No products match your filters. Try another category."}
              </p>
            </div>
          )}

          {/* Product count + price range */}
          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-warm-900">
              <Package className="h-3.5 w-3.5 text-brand-600" />
              {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}{" "}
              {mapMode === "route" && routeParams ? "on your route" : "nearby"}
            </p>
            {availableNowCount > 0 && (
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-sunflower-800">
                <Zap className="h-3 w-3" />
                {availableNowCount} {availableNowCount === 1 ? "seller" : "sellers"} available now
              </p>
            )}
            {priceRange && (
              <p className="text-xs font-medium text-brand-700">
                {formatPrice(priceRange.min)}
                {priceRange.max !== priceRange.min && ` – ${formatPrice(priceRange.max)}`}
              </p>
            )}
            {activeLabels && (
              <p className="mt-0.5 text-xs capitalize text-warm-500">{activeLabels}</p>
            )}
          </div>

          <div className="absolute bottom-4 right-4 hidden rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-medium text-warm-500 shadow sm:block">
            <MapPin className="mb-0.5 inline h-3 w-3" />
            NW Chicago suburbs
          </div>
        </div>
      </div>

      {ctaHref && ctaLabel && (
        <div className="border-t border-warm-100 bg-white px-6 py-5 text-center">
          <Link
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-brand-700 sm:w-auto sm:min-w-[320px]"
          >
            {ctaLabel}
          </Link>
          <p className="mt-2 text-xs text-warm-500">Tap a product pin to see who grows it</p>
        </div>
      )}

      {showProductList && visibleProducts.length > 0 && (
        <div className="border-t border-warm-100 bg-warm-50/50 p-6">
          <h3 className="text-lg font-bold text-warm-900">
            {mapMode === "route" && routeParams
              ? "Products along your route"
              : "Products from neighbors nearby"}
          </h3>
          <p className="mt-1 text-sm text-warm-600">Each listing shows the grower behind it</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.slice(0, 9).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
