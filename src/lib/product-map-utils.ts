import type { Product, Seller } from "@/lib/types";
import { isBakeryCategory } from "@/lib/categories";

export type MiniMapCategory =
  | "all"
  | "paczki"
  | "donuts"
  | "bread"
  | "cakes"
  | "pastries"
  | "cookies"
  | "eggs"
  | "honey"
  | "flowers"
  | "produce"
  | "pickled";

export const MINI_MAP_CATEGORIES: {
  id: MiniMapCategory;
  label: string;
  emoji: string;
}[] = [
  { id: "all", label: "All Bakery", emoji: "🥐" },
  { id: "paczki", label: "Polish Paczki", emoji: "🥮" },
  { id: "donuts", label: "Donuts", emoji: "🍩" },
  { id: "bread", label: "Bread", emoji: "🍞" },
  { id: "cakes", label: "Cakes", emoji: "🎂" },
  { id: "pastries", label: "Pastries", emoji: "🥐" },
  { id: "cookies", label: "Cookies", emoji: "🍪" },
  { id: "eggs", label: "Eggs", emoji: "🥚" },
  { id: "honey", label: "Honey", emoji: "🍯" },
  { id: "flowers", label: "Flowers", emoji: "💐" },
  { id: "produce", label: "Produce", emoji: "🥬" },
  { id: "pickled", label: "Pickled", emoji: "🥒" },
];

const FLOWER_CATEGORIES = new Set([
  "Fresh Flowers",
  "Sunflowers",
  "Cut Flowers",
  "Seasonal Flowers",
  "Roses",
  "Bouquets",
  "Handmade Bouquets",
]);

const PRODUCE_CATEGORIES = new Set(["Vegetables", "Fruits", "Herbs", "Mushrooms"]);

export function getProductMiniMapCategory(product: Product): MiniMapCategory | null {
  if (product.category === "Polish Paczki") return "paczki";
  if (product.category === "Donuts") return "donuts";
  if (product.category === "Bread") return "bread";
  if (product.category === "Cakes") return "cakes";
  if (product.category === "Pastries") return "pastries";
  if (product.category === "Cookies") return "cookies";

  if (isBakeryCategory(product.category)) return null;

  if (product.category === "Eggs") return "eggs";
  if (product.category === "Honey") return "honey";
  if (FLOWER_CATEGORIES.has(product.category)) return "flowers";
  if (PRODUCE_CATEGORIES.has(product.category)) return "produce";
  if (
    product.category === "Pickled Foods" ||
    product.category === "Fermented Foods" ||
    product.category === "Preserves"
  ) {
    return "pickled";
  }

  return null;
}

export function filterProductsByMiniMapCategories(
  products: Product[],
  activeCategories: Set<MiniMapCategory>
): Product[] {
  const available = products.filter((p) => !p.sold);
  if (activeCategories.has("all") || activeCategories.size === 0) {
    return available.filter((p) => isBakeryCategory(p.category) || getProductMiniMapCategory(p) !== null);
  }
  return available.filter((p) => {
    const cat = getProductMiniMapCategory(p);
    return cat !== null && activeCategories.has(cat);
  });
}

export function getCategoryEmoji(category: MiniMapCategory): string {
  return MINI_MAP_CATEGORIES.find((c) => c.id === category)?.emoji ?? "📍";
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function getMapBounds(sellers: Seller[]): MapBounds {
  if (sellers.length === 0) {
    return { minLat: 41.92, maxLat: 42.05, minLng: -87.9, maxLng: -87.8 };
  }
  const lats = sellers.map((s) => s.lat);
  const lngs = sellers.map((s) => s.lng);
  const pad = 0.008;
  return {
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
    minLng: Math.min(...lngs) - pad,
    maxLng: Math.max(...lngs) + pad,
  };
}

export function productToMapPosition(
  seller: Seller,
  bounds: MapBounds,
  offsetIndex: number
): { left: string; top: string } {
  const lngRange = bounds.maxLng - bounds.minLng || 1;
  const latRange = bounds.maxLat - bounds.minLat || 1;
  const baseLeft = 8 + ((seller.lng - bounds.minLng) / lngRange) * 82;
  const baseTop = 10 + ((bounds.maxLat - seller.lat) / latRange) * 72;
  const angle = offsetIndex * 1.4;
  const radius = 1.8 + offsetIndex * 0.6;
  return {
    left: `${baseLeft + Math.cos(angle) * radius}%`,
    top: `${baseTop + Math.sin(angle) * radius}%`,
  };
}

export function formatProductDistance(estimatedDetourMinutes: number): string {
  if (estimatedDetourMinutes <= 1) return "< 1 min away";
  return `~${estimatedDetourMinutes} min away`;
}

export function getPriceRange(products: Product[]): { min: number; max: number } | null {
  if (products.length === 0) return null;
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
