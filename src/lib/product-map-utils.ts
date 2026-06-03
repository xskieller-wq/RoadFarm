import type { Product, Seller } from "@/lib/types";

export type MiniMapCategory =
  | "all"
  | "tomatoes"
  | "cucumbers"
  | "peppers"
  | "lettuce"
  | "potatoes"
  | "carrots"
  | "garlic"
  | "onions"
  | "herbs"
  | "strawberries"
  | "blueberries"
  | "apples"
  | "eggs"
  | "honey"
  | "flowers"
  | "bouquets"
  | "seedlings"
  | "baked_goods"
  | "pickled"
  | "preserves"
  | "fruit";

export const MINI_MAP_CATEGORIES: {
  id: MiniMapCategory;
  label: string;
  emoji: string;
}[] = [
  { id: "all", label: "All Products", emoji: "📦" },
  { id: "tomatoes", label: "Tomatoes", emoji: "🍅" },
  { id: "cucumbers", label: "Cucumbers", emoji: "🥒" },
  { id: "peppers", label: "Peppers", emoji: "🌶️" },
  { id: "lettuce", label: "Lettuce", emoji: "🥬" },
  { id: "potatoes", label: "Potatoes", emoji: "🥔" },
  { id: "carrots", label: "Carrots", emoji: "🥕" },
  { id: "garlic", label: "Garlic", emoji: "🧄" },
  { id: "onions", label: "Onions", emoji: "🧅" },
  { id: "herbs", label: "Herbs", emoji: "🌿" },
  { id: "strawberries", label: "Strawberries", emoji: "🍓" },
  { id: "blueberries", label: "Blueberries", emoji: "🫐" },
  { id: "apples", label: "Apples", emoji: "🍎" },
  { id: "eggs", label: "Eggs", emoji: "🥚" },
  { id: "honey", label: "Honey", emoji: "🍯" },
  { id: "flowers", label: "Flowers", emoji: "🌻" },
  { id: "bouquets", label: "Bouquets", emoji: "💐" },
  { id: "seedlings", label: "Seedlings", emoji: "🌱" },
  { id: "baked_goods", label: "Baked Goods", emoji: "🥖" },
  { id: "pickled", label: "Pickled Foods", emoji: "🥒" },
  { id: "preserves", label: "Preserves", emoji: "🍯" },
];

const FLOWER_CATEGORIES = new Set([
  "Fresh Flowers",
  "Sunflowers",
  "Cut Flowers",
  "Seasonal Flowers",
  "Roses",
]);

const BOUQUET_CATEGORIES = new Set(["Bouquets", "Handmade Bouquets"]);

function matches(title: string, ...words: string[]): boolean {
  return words.some((w) => title.includes(w));
}

export function getProductMiniMapCategory(product: Product): MiniMapCategory | null {
  const title = product.title.toLowerCase();

  if (product.category === "Eggs" || matches(title, "egg")) return "eggs";
  if (product.category === "Honey" || matches(title, "honey")) return "honey";
  if (BOUQUET_CATEGORIES.has(product.category) || matches(title, "bouquet")) return "bouquets";
  if (FLOWER_CATEGORIES.has(product.category) || matches(title, "flower", "rose", "sunflower", "zinnia", "dahlia", "lily")) {
    return "flowers";
  }
  if (product.category === "Pickled Foods" || matches(title, "pickle", "kimchi", "sauerkraut", "jalapeño")) {
    return "pickled";
  }
  if (product.category === "Fermented Foods") return "pickled";
  if (matches(title, "jam", "jelly", "preserve", "marmalade")) return "preserves";
  if (matches(title, "bread", "loaf", "roll", "bun", "donut", "muffin", "scone", "pastry")) return "baked_goods";
  if (matches(title, "seedling", "plant") && product.category === "Herbs") return "seedlings";

  if (matches(title, "tomato")) return "tomatoes";
  if (matches(title, "cucumber")) return "cucumbers";
  if (matches(title, "pepper", "jalapeño", "eggplant", "zucchini")) return "peppers";
  if (matches(title, "lettuce", "salad", "greens", "kale", "spinach", "chard", "arugula", "microgreen")) {
    return "lettuce";
  }
  if (matches(title, "potato")) return "potatoes";
  if (matches(title, "carrot")) return "carrots";
  if (matches(title, "garlic")) return "garlic";
  if (matches(title, "onion", "shallot")) return "onions";
  if (product.category === "Herbs" || matches(title, "basil", "mint", "thyme", "oregano", "rosemary")) {
    return "herbs";
  }
  if (matches(title, "strawberry")) return "strawberries";
  if (matches(title, "blueberry")) return "blueberries";
  if (matches(title, "apple", "honeycrisp")) return "apples";
  if (product.category === "Fruits" || matches(title, "peach", "berry", "fruit")) return "fruit";
  if (product.category === "Vegetables") return "tomatoes";

  return null;
}

export function filterProductsByMiniMapCategories(
  products: Product[],
  activeCategories: Set<MiniMapCategory>
): Product[] {
  const available = products.filter((p) => !p.sold);
  if (activeCategories.has("all") || activeCategories.size === 0) {
    return available;
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
