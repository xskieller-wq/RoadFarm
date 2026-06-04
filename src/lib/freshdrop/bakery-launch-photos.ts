import type { ProductCategory } from "@/lib/types";
import { isBakeryCategory } from "@/lib/categories";

/** Verified bakery-food Pexels IDs only (manually checked — food close-ups). */
const FOOD = {
  paczki: 537018,
  donuts: 6150701,
  croissant: 4828314,
  pastry: 4828314,
  sourdough: 33534834,
  rye: 209206,
  bread: 1775043,
  cake: 29538432,
  cookies: 230325,
} as const;

export type BakeryFoodPhotoKind = keyof typeof FOOD;

const CACHE_VERSION = "fd-bakery-v2";

function pexelsFoodUrl(id: number, w: number, h: number): string {
  const base = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
  return `${base}?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop&${CACHE_VERSION}=1`;
}

export function bakeryFoodPhotoUrl(kind: BakeryFoodPhotoKind, w: number, h: number): string {
  return pexelsFoodUrl(FOOD[kind], w, h);
}

/** Homepage product cards — never use resolveBakeryPhoto or feed image_url. */
export function bakeryLaunchPhotoForItem(
  category: ProductCategory,
  title: string,
  w: number,
  h: number
): string {
  const t = title.toLowerCase();
  let kind: BakeryFoodPhotoKind = "bread";

  if (t.includes("paczki") || t.includes("paczek")) kind = "paczki";
  else if ((t.includes("donut") || t.includes("doughnut")) && !t.includes("paczki")) {
    kind = "donuts";
  } else if (t.includes("croissant")) kind = "croissant";
  else if (
    t.includes("danish") ||
    t.includes("bear claw") ||
    t.includes("palmier") ||
    t.includes("muffin") ||
    t.includes("cinnamon roll")
  ) {
    kind = "pastry";
  } else if (t.includes("cookie") || t.includes("snickerdoodle") || t.includes("linzer")) {
    kind = "cookies";
  } else if (t.includes("cupcake") || t.includes("cake")) kind = "cake";
  else if (t.includes("sourdough")) kind = "sourdough";
  else if (t.includes("rye")) kind = "rye";
  else if (isBakeryCategory(category)) {
    switch (category) {
      case "Polish Paczki":
        kind = "paczki";
        break;
      case "Donuts":
        kind = "donuts";
        break;
      case "Pastries":
        kind = "pastry";
        break;
      case "Cookies":
        kind = "cookies";
        break;
      case "Cakes":
        kind = "cake";
        break;
      case "Bread":
        kind = t.includes("sourdough") ? "sourdough" : t.includes("rye") ? "rye" : "bread";
        break;
      default:
        kind = "pastry";
    }
  }

  return bakeryFoodPhotoUrl(kind, w, h);
}
