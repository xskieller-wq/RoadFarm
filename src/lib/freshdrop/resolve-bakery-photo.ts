import type { ProductCategory } from "@/lib/types";
import { isBakeryCategory } from "@/lib/categories";
import { IMG } from "@/data/pexels-img";

/**
 * Title-first bakery photo mapping for homepage launch.
 * Order matters — first match wins. Food-only Pexels IDs.
 */
export function resolveBakeryPhoto(category: ProductCategory, title = ""): string {
  const t = title.toLowerCase();

  if (t.includes("paczki") || t.includes("paczek")) return IMG.paczki;
  if ((t.includes("donut") || t.includes("doughnut")) && !t.includes("paczki")) {
    return IMG.donuts;
  }
  if (t.includes("croissant")) return IMG.croissant;
  if (t.includes("danish") || (t.includes("raspberry") && t.includes("pastr"))) {
    return IMG.danish;
  }
  if (t.includes("bear claw") || t.includes("palmier")) return IMG.pastries;
  if (t.includes("sourdough")) return IMG.sourdough;
  if (t.includes("rye") || t.includes("pullman")) return IMG.rye;
  if (t.includes("dinner roll") || t.includes("soft roll") || (t.includes("roll") && !t.includes("barrel"))) {
    return IMG.breadRolls;
  }
  if (t.includes("bagel")) return IMG.breadRolls;
  if (
    t.includes("cookie") ||
    t.includes("snickerdoodle") ||
    t.includes("linzer")
  ) {
    return IMG.cookies;
  }
  if (t.includes("cupcake") || t.includes("carrot cake") || t.includes("layer cake")) {
    return IMG.cake;
  }
  if (t.includes("cake") && !t.includes("donut")) return IMG.cake;
  if (t.includes("loaf") || t.includes("bread")) {
    if (t.includes("rye")) return IMG.rye;
    if (t.includes("sourdough")) return IMG.sourdough;
    return IMG.bread;
  }

  if (isBakeryCategory(category)) {
    switch (category) {
      case "Polish Paczki":
        return IMG.paczki;
      case "Donuts":
        return IMG.donuts;
      case "Bread":
        return IMG.bread;
      case "Pastries":
        return IMG.pastries;
      case "Cookies":
        return IMG.cookies;
      case "Cakes":
        return IMG.cake;
      default:
        return IMG.bread;
    }
  }

  return IMG.bread;
}
