import type { ProductCategory } from "@/lib/types";
import { isBakeryCategory, type BakeryCategory } from "@/lib/categories";
import { resolveBakeryPhoto } from "@/lib/freshdrop/resolve-bakery-photo";
import {
  IMG,
  BLOCKED_PEXELS_IDS,
  BAKERY_PRODUCT_PEXELS_IDS,
} from "@/data/pexels-img";

export { IMG, BLOCKED_PEXELS_IDS, BAKERY_PRODUCT_PEXELS_IDS };

const BAKERY_AVATAR_POOL = [IMG.sourdough, IMG.rye, IMG.bread, IMG.cookies] as const;

const BAKERY_IMG: Record<BakeryCategory, string> = {
  "Polish Paczki": IMG.paczki,
  Donuts: IMG.donuts,
  Bread: IMG.bread,
  Cakes: IMG.cake,
  Pastries: IMG.pastries,
  Cookies: IMG.cookies,
};

export function sized(url: string, w: number, h?: number): string {
  const sep = url.includes("?") ? "&" : "?";
  return h ? `${url}${sep}w=${w}&h=${h}&fit=crop` : `${url}${sep}w=${w}&fit=crop`;
}

export function isBlockedPexelsUrl(url: string): boolean {
  return BLOCKED_PEXELS_IDS.some((id) => url.includes(`/photos/${id}/`));
}

export function isApprovedBakeryProductPexelsUrl(url: string): boolean {
  const match = url.match(/\/photos\/(\d+)\//);
  if (!match) return false;
  return BAKERY_PRODUCT_PEXELS_IDS.has(Number(match[1]));
}

export function bakerySellerAvatar(seed: number): string {
  return sized(BAKERY_AVATAR_POOL[Math.abs(seed) % BAKERY_AVATAR_POOL.length], 200, 200);
}

/** @deprecated Use bakerySellerAvatar or getBakerAvatarImage for bakers */
export function sellerAvatar(index: number): string {
  return bakerySellerAvatar(index);
}

export function sellerCover(
  type: "bakery" | "paczki" | "donuts" | "garden" | "flowers" | "honey" | "orchard" | "eggs" | "farm" | "pickles"
): string {
  return sized(IMG.covers[type], 1200, 400);
}

/** Title-aware photo — matches product type before generic category fallback */
export function resolveProductPhoto(category: ProductCategory, title = ""): string {
  const t = title.toLowerCase();

  if (isBakeryCategory(category)) {
    return resolveBakeryPhoto(category, title);
  }

  if (t.includes("tomato")) return IMG.tomatoes;
  if (t.includes("cucumber")) return IMG.cucumber;
  if (t.includes("sunflower")) return IMG.sunflowers;
  if (
    t.includes("rose") &&
    !t.includes("paczki") &&
    !t.includes("paczek") &&
    (category === "Roses" ||
      category === "Fresh Flowers" ||
      category === "Cut Flowers" ||
      category === "Seasonal Flowers")
  ) {
    return IMG.flowers;
  }
  if (t.includes("peach")) return IMG.peaches;
  if (t.includes("apple") && !t.includes("paczki")) return IMG.apples;
  if (t.includes("berry") || t.includes("strawberry")) return IMG.berries;
  if (t.includes("pickle") || t.includes("kimchi") || t.includes("sauerkraut")) return IMG.pickles;
  if (t.includes("mushroom")) return IMG.mushrooms;
  if (t.includes("honey")) return IMG.honey;
  if (t.includes("egg")) return IMG.eggs;
  if (t.includes("jam") || t.includes("preserve")) return IMG.preserves;
  if (t.includes("kombucha") || t.includes("drink") || t.includes("cider")) return IMG.drinks;

  switch (category) {
    case "Eggs":
      return IMG.eggs;
    case "Honey":
      return IMG.honey;
    case "Vegetables":
      return IMG.vegetables;
    case "Herbs":
      return IMG.herbs;
    case "Fruits":
      return IMG.apples;
    case "Mushrooms":
      return IMG.mushrooms;
    case "Preserves":
      return IMG.preserves;
    case "Homemade Drinks":
      return IMG.drinks;
    case "Fresh Flowers":
    case "Cut Flowers":
    case "Seasonal Flowers":
    case "Roses":
      return IMG.flowers;
    case "Sunflowers":
      return IMG.sunflowers;
    case "Bouquets":
    case "Handmade Bouquets":
      return IMG.bouquet;
    case "Pickled Foods":
      return IMG.pickles;
    case "Fermented Foods":
      return IMG.kombucha;
    default:
      return IMG.produce;
  }
}

export function getBakeryCategoryImage(category: ProductCategory): string {
  if (isBakeryCategory(category)) {
    return sized(BAKERY_IMG[category], 600, 400);
  }
  return sized(IMG.bread, 600, 400);
}

export function getBakeryProductImage(category: ProductCategory, title = ""): string {
  const raw = resolveBakeryPhoto(category, title);
  if (isBlockedPexelsUrl(raw) || !isApprovedBakeryProductPexelsUrl(raw)) {
    return sized(IMG.croissant, 600, 400);
  }
  return sized(raw, 600, 400);
}

/** Bakery seller avatar — product closeups only */
export function getBakerAvatarImage(specialties: ProductCategory[], index = 0): string {
  if (specialties.includes("Polish Paczki")) return sized(IMG.paczki, 200, 200);
  if (specialties.includes("Bread")) return sized(IMG.sourdough, 200, 200);
  if (specialties.includes("Pastries")) return sized(IMG.croissant, 200, 200);
  if (specialties.includes("Donuts")) return sized(IMG.donuts, 200, 200);
  if (specialties.includes("Cakes")) return sized(IMG.cake, 200, 200);
  if (specialties.includes("Cookies")) return sized(IMG.cookies, 200, 200);
  return bakerySellerAvatar(index);
}

export function getBakerCoverImage(specialties: ProductCategory[]): string {
  if (specialties.includes("Polish Paczki")) return sellerCover("paczki");
  if (specialties.includes("Donuts")) return sellerCover("donuts");
  return sellerCover("bakery");
}

export function getProductDisplayImage(product: {
  category: ProductCategory;
  title: string;
  photos?: { url: string }[];
}): string {
  return getProductImage(product.category, product.title);
}

export function getBakeryCategoryTileImage(category: BakeryCategory): string {
  return sized(BAKERY_IMG[category], 800, 1000);
}

export function getProductImage(category: ProductCategory, title = ""): string {
  return sized(resolveProductPhoto(category, title), 600, 400);
}

/** Blurred food-only backdrop for homepage zones */
export function bakeryZoneBackdrop(zone: "top" | "mid"): string {
  const src = zone === "mid" ? IMG.bakeryBackdropAlt : IMG.bakeryBackdrop;
  return sized(src, 900, 600);
}
