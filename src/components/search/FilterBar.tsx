"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ALL_CATEGORIES } from "@/lib/types";
import type { ProductCategory, FreshnessLabel } from "@/lib/types";
import { FRESHNESS_LABEL_OPTIONS } from "@/lib/freshness";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentFreshness = searchParams.get("freshness") || "all";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-semibold text-earth-900">Filters</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-earth-600">Category</label>
          <select
            className="input-field"
            value={currentCategory}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            <option value="all">All categories</option>
            <optgroup label="Food">
              {ALL_CATEGORIES.slice(0, 7).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </optgroup>
            <optgroup label="Flowers">
              {ALL_CATEGORIES.slice(7).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-earth-600">Max price</label>
          <select
            className="input-field"
            value={currentMaxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          >
            <option value="">Any price</option>
            <option value="5">Under $5</option>
            <option value="10">Under $10</option>
            <option value="25">Under $25</option>
            <option value="50">Under $50</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-earth-600">Freshness</label>
          <select
            className="input-field"
            value={currentFreshness}
            onChange={(e) => updateFilter("freshness", e.target.value)}
          >
            <option value="all">Any freshness</option>
            {FRESHNESS_LABEL_OPTIONS.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
