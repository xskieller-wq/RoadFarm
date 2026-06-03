import type { RouteSearchParams, Product, FreshnessLabel } from "@/lib/types";
import { getProductFreshnessLabel } from "@/lib/freshness";

export function searchProductsAlongRoute(
  products: Product[],
  params: RouteSearchParams
): Product[] {
  const { maxDetour, category, maxPrice, freshnessStatus } = params;

  let results = products.filter(
    (p) => !p.sold && p.estimatedDetourMinutes <= maxDetour
  );

  if (category && category !== "all") {
    results = results.filter((p) => p.category === category);
  }

  if (maxPrice !== undefined && maxPrice > 0) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  if (freshnessStatus && freshnessStatus !== "all") {
    results = results.filter(
      (p) => getProductFreshnessLabel(p) === (freshnessStatus as FreshnessLabel)
    );
  }

  return results.sort(
    (a, b) => a.estimatedDetourMinutes - b.estimatedDetourMinutes
  );
}

export function buildSearchQueryString(params: RouteSearchParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("start", params.start);
  searchParams.set("destination", params.destination);
  searchParams.set("maxDetour", String(params.maxDetour));
  if (params.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }
  if (params.maxPrice) {
    searchParams.set("maxPrice", String(params.maxPrice));
  }
  if (params.freshnessStatus && params.freshnessStatus !== "all") {
    searchParams.set("freshness", params.freshnessStatus);
  }
  return searchParams.toString();
}

export function parseSearchParams(
  searchParams: URLSearchParams
): RouteSearchParams {
  return {
    start: searchParams.get("start") || "Norridge, IL",
    destination: searchParams.get("destination") || "Des Plaines, IL",
    maxDetour: Number(searchParams.get("maxDetour") || "5"),
    category: (searchParams.get("category") as RouteSearchParams["category"]) || "all",
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    freshnessStatus:
      (searchParams.get("freshness") as RouteSearchParams["freshnessStatus"]) ||
      "all",
  };
}

export const POPULAR_ROUTES = [
  { start: "Norridge, IL", destination: "Des Plaines, IL", label: "Norridge → Des Plaines" },
  { start: "Park Ridge, IL", destination: "O'Hare Airport", label: "Park Ridge → O'Hare" },
  { start: "Harwood Heights, IL", destination: "Park Ridge, IL", label: "Harwood Heights → Park Ridge" },
  { start: "Elmwood Park, IL", destination: "Schiller Park, IL", label: "Elmwood Park → Schiller Park" },
  { start: "Des Plaines, IL", destination: "Norridge, IL", label: "Des Plaines → Norridge (commute home)" },
];
