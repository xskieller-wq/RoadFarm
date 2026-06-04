import type { ProductCategory } from "@/lib/types";

/** MVP focus — bakery */
export const BAKERY_CATEGORIES = [
  "Polish Paczki",
  "Donuts",
  "Bread",
  "Cakes",
  "Pastries",
  "Cookies",
] as const;

export type BakeryCategory = (typeof BAKERY_CATEGORIES)[number];

/** Kept for future marketplace expansion (not primary in MVP UI) */
export const FUTURE_CATEGORIES = [
  "Eggs",
  "Fruits",
  "Vegetables",
  "Honey",
  "Herbs",
  "Mushrooms",
  "Pickled Foods",
  "Fermented Foods",
  "Preserves",
  "Homemade Drinks",
  "Fresh Flowers",
  "Roses",
  "Sunflowers",
  "Seasonal Flowers",
  "Cut Flowers",
  "Bouquets",
  "Handmade Bouquets",
] as const satisfies readonly ProductCategory[];

export type FutureCategory = (typeof FUTURE_CATEGORIES)[number];

export const ALL_CATEGORIES: ProductCategory[] = [
  ...BAKERY_CATEGORIES,
  ...FUTURE_CATEGORIES,
];

export const COMPLIANCE_CATEGORIES: ProductCategory[] = [
  "Pickled Foods",
  "Fermented Foods",
];

export function isBakeryCategory(category: ProductCategory): category is BakeryCategory {
  return (BAKERY_CATEGORIES as readonly string[]).includes(category);
}

export function isFutureCategory(category: ProductCategory): category is FutureCategory {
  return (FUTURE_CATEGORIES as readonly string[]).includes(category);
}
