import type { ProductCategory } from "@/lib/types";
import { BAKERY_CATEGORIES, type BakeryCategory } from "@/lib/categories";
import { sized, IMG, getBakeryCategoryTileImage, bakeryZoneBackdrop } from "@/data/images";

/** Soft bakery atmosphere — sourdough closeup, heavily softened behind UI */
export const HERO_IMAGE = bakeryZoneBackdrop("top");

export type HomeBgZone = "bakery-top" | "bakery-mid" | "freshness";

/** Food-only backdrops; never buildings, streets, or window exteriors */
export const BAKERY_ZONE_BLUR =
  "object-cover scale-[1.12] blur-[20px] saturate-[0.82] brightness-[0.88] contrast-[1.02]";

/** Browse — extra crop + blur so hero bread reads softer than homepage */
export const BROWSE_ZONE_BLUR =
  "object-cover scale-[1.18] blur-[32px] saturate-[0.76] brightness-[0.84] contrast-[1.02]";

export const HOME_BG_ZONES: Record<
  HomeBgZone,
  { image: string; alt: string; blur: string; overlay: string }
> = {
  "bakery-top": {
    image: HERO_IMAGE,
    alt: "Soft sourdough bread texture",
    blur: BAKERY_ZONE_BLUR,
    overlay: "from-warm-950/70 via-warm-900/55 to-warm-950/75",
  },
  "bakery-mid": {
    image: bakeryZoneBackdrop("mid"),
    alt: "Soft rye bread texture",
    blur: BAKERY_ZONE_BLUR,
    overlay: "from-warm-950/72 via-amber-950/50 to-warm-950/78",
  },
  freshness: {
    image: sized(IMG.vegetables, 2400, 1600),
    alt: "Fresh local vegetables",
    blur: "blur-[12px] scale-105 object-cover saturate-[0.8] brightness-[0.9]",
    overlay: "from-warm-950/60 via-warm-950/62 to-warm-950/70",
  },
};

export const BAKERY_BACKDROP_TILES = [
  { src: sized(IMG.sourdough, 1600, 1200), className: "col-span-2 row-span-2" },
  { src: sized(IMG.bread, 900, 700), className: "col-span-1 row-span-1" },
  { src: sized(IMG.rye, 900, 700), className: "col-span-1 row-span-1" },
  { src: sized(IMG.croissant, 900, 700), className: "col-span-1 row-span-1" },
  { src: sized(IMG.cookies, 900, 700), className: "col-span-1 row-span-1" },
  { src: sized(IMG.paczki, 900, 700), className: "col-span-2 row-span-1" },
] as const;

export const FRESHNESS_BACKDROP_TILES = [
  { src: sized(IMG.produce, 1200, 900), className: "col-span-2 row-span-2" },
  { src: sized(IMG.vegetables, 800, 600), className: "col-span-1 row-span-1" },
  { src: sized(IMG.honey, 800, 600), className: "col-span-1 row-span-1" },
  { src: sized(IMG.eggs, 800, 600), className: "col-span-1 row-span-1" },
  { src: sized(IMG.herbs, 800, 600), className: "col-span-1 row-span-1" },
  { src: sized(IMG.preserves, 800, 600), className: "col-span-2 row-span-1" },
  { src: sized(IMG.tomatoes, 800, 600), className: "col-span-1 row-span-1" },
  { src: sized(IMG.apples, 800, 600), className: "col-span-1 row-span-1" },
] as const;

export const PEOPLE_AT_WORK = [
  { image: sized(IMG.sourdough, 400, 300), caption: "Sourdough loaves" },
  { image: sized(IMG.rye, 400, 300), caption: "Rye bread" },
  { image: sized(IMG.croissant, 400, 300), caption: "Morning croissants" },
  { image: sized(IMG.bread, 400, 300), caption: "Artisan loaves" },
  { image: sized(IMG.cookies, 400, 300), caption: "Cookie trays" },
  { image: sized(IMG.paczki, 400, 300), caption: "Paczki batch" },
] as const;

const TILE_META: Record<
  BakeryCategory,
  { label: string; tagline: string; accent: "blossom" | "lavender" | "sunflower" | "tomato" | "sage" }
> = {
  "Polish Paczki": {
    label: "Polish Paczki",
    tagline: "Traditional filled — separate from donuts",
    accent: "sage",
  },
  Donuts: { label: "Donuts", tagline: "Ring donuts & glazed batches", accent: "sage" },
  Bread: { label: "Bread", tagline: "Loaves pulled fresh today", accent: "sage" },
  Cakes: { label: "Cakes", tagline: "Made to order celebrations", accent: "sage" },
  Pastries: { label: "Pastries", tagline: "Croissants & morning trays", accent: "sage" },
  Cookies: { label: "Cookies", tagline: "Baked today, ready now", accent: "sage" },
};

export const CATEGORY_TILES: {
  label: string;
  category: ProductCategory;
  image: string;
  tagline: string;
  accent: "blossom" | "lavender" | "sunflower" | "tomato" | "sage";
}[] = BAKERY_CATEGORIES.map((category) => ({
  category,
  image: getBakeryCategoryTileImage(category),
  ...TILE_META[category],
}));

export const VISUAL_SECTIONS = {
  freshness: {
    image: sized(IMG.sourdough, 800, 500),
    title: "Freshness is the product",
    subtitle:
      "Fresh Batch Time, Made Today, Made To Order, Available Now, and Fresh Batch Alerts.",
  },
};

export const FUTURE_CATEGORY_ROADMAP = [
  { emoji: "🍄", label: "Mushrooms" },
  { emoji: "🍯", label: "Honey" },
  { emoji: "🥚", label: "Eggs" },
  { emoji: "🌸", label: "Flowers" },
  { emoji: "🥒", label: "Pickled Foods" },
  { emoji: "🍓", label: "Preserves" },
] as const;

export function categoryResultsHref(category: ProductCategory): string {
  const params = new URLSearchParams({
    start: "Norridge, IL",
    destination: "Des Plaines, IL",
    maxDetour: "10",
    category,
  });
  return `/results?${params.toString()}`;
}
