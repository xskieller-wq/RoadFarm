"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Seller } from "@/lib/types";
import MapSellerPin, { MAP_FILTERS, filterSellersForMap, type MapFilter } from "./MapSellerPin";

interface DiscoveryMapProps {
  sellers: Seller[];
  showRoute?: boolean;
  routeStart?: string;
  routeDestination?: string;
  compact?: boolean;
  showFilters?: boolean;
  filter?: MapFilter;
  onFilterChange?: (filter: MapFilter) => void;
  initialFilter?: MapFilter;
}

function pinPosition(index: number, total: number) {
  const cols = Math.ceil(Math.sqrt(total));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const left = 8 + (col / Math.max(cols - 1, 1)) * 78;
  const top = 12 + (row / Math.max(Math.ceil(total / cols) - 1, 1)) * 68;
  return { left: `${left}%`, top: `${top}%` };
}

export default function DiscoveryMap({
  sellers,
  showRoute = false,
  routeStart,
  routeDestination,
  compact = false,
  showFilters = true,
  filter: controlledFilter,
  onFilterChange,
  initialFilter = "all",
}: DiscoveryMapProps) {
  const [internalFilter, setInternalFilter] = useState<MapFilter>(initialFilter);
  const filter = controlledFilter ?? internalFilter;

  const setFilter = (next: MapFilter) => {
    onFilterChange?.(next);
    if (controlledFilter === undefined) setInternalFilter(next);
  };
  const filtered = filterSellersForMap(sellers, filter);

  return (
    <div>
      {showFilters && (
        <div className="mb-3 flex flex-wrap gap-2">
          {MAP_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                filter === f.id
                  ? "bg-warm-900 text-white"
                  : "bg-warm-100 text-warm-700 hover:bg-warm-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className={`relative bg-gradient-to-br from-sage-50 via-sunflower-50/80 to-lavender-50 ${compact ? "aspect-[16/11]" : "aspect-[16/10] sm:aspect-[16/8]"}`}>
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 800 500" fill="none">
              {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#A67C5B" strokeWidth="0.8" />
              ))}
              {[100, 200, 300, 400].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#A67C5B" strokeWidth="0.8" />
              ))}
            </svg>
          </div>

          {showRoute && (
            <div className="absolute left-[12%] top-[42%] h-0.5 w-[76%] rounded-full bg-gradient-to-r from-sunflower-400 via-blossom-400 to-brand-400 opacity-50" />
          )}

          {filtered.map((seller, i) => (
            <MapSellerPin
              key={seller.id}
              seller={seller}
              style={pinPosition(i, filtered.length)}
              zIndex={10 + i}
            />
          ))}

          <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold text-warm-900">
              {filtered.length} local {filtered.length === 1 ? "grower" : "growers"} nearby
            </p>
            <p className="text-xs text-warm-500">Tap a photo to meet them</p>
          </div>

          {!compact && (
            <Link
              href="/explore"
              className="absolute bottom-4 right-4 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-700"
            >
              Open full map
            </Link>
          )}

          {showRoute && routeStart && routeDestination && (
            <div className="absolute right-4 top-4 rounded-xl bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur">
              <MapPin className="mb-0.5 inline h-3 w-3 text-brand-600" />
              <span className="font-medium text-warm-900">{routeStart.split(",")[0]}</span>
              <span className="text-warm-400"> → </span>
              <span className="font-medium text-warm-900">{routeDestination.split(",")[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
