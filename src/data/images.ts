import type { ProductCategory } from "@/lib/types";

/** Verified Pexels photography — balanced across gardens, produce, people, flowers */
const p = (id: number, ext = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb`;

export const IMG = {
  tomatoes: p(533280),
  cherryTomatoes: p(1323737),
  cucumber: p(4198017),
  eggs: p(1622911),
  honey: p(42062, "jpg"),
  flowers: p(568027, "jpeg"),
  bouquet: p(931162),
  roses: p(568027, "jpeg"),
  sunflowers: p(33044, "jpg"),
  garden: p(2132227),
  greenhouse: p(2255935),
  farm: p(2255935),
  vegetables: p(1300975),
  herbs: p(143133),
  orchard: p(1132040),
  peaches: p(1458691),
  apples: p(102104),
  berries: p(89778),
  strawberries: p(46174),
  pickles: p(594988),
  peppers: p(1407346),
  salad: p(1128678),
  carrots: p(143133),
  harvest: p(2255935),
  kombucha: p(594988),
  /** Hero: vegetable garden / harvest — not flower-forward */
  hero: p(1300975),
  community: p(2132227),
  baker: p(1775043),
  beekeeper: p(42062, "jpg"),
  bouquetMaking: p(931162),
  personGarden: p(2256611),
  personHarvest: p(3200075),
  personFlorist: p(230325),
  personEggs: p(2137026),
  fruitTree: p(1132040),
  avatars: [p(774909), p(1222271), p(1181686), p(1181519), p(91227), p(1239291)],
  covers: {
    garden: p(2132227),
    flowers: p(568027, "jpeg"),
    honey: p(42062, "jpg"),
    orchard: p(1132040),
    eggs: p(1622911),
    farm: p(2255935),
    pickles: p(594988),
  },
} as const;

export function sized(url: string, w: number, h?: number): string {
  const sep = url.includes("?") ? "&" : "?";
  return h ? `${url}${sep}w=${w}&h=${h}&fit=crop` : `${url}${sep}w=${w}&fit=crop`;
}

export function sellerAvatar(index: number): string {
  return sized(IMG.avatars[index % IMG.avatars.length], 200, 200);
}

export function sellerCover(type: "garden" | "flowers" | "honey" | "orchard" | "eggs" | "farm" | "pickles"): string {
  return sized(IMG.covers[type], 1200, 400);
}

export function getProductImage(category: ProductCategory, title = ""): string {
  const t = title.toLowerCase();
  if (t.includes("tomato")) return sized(IMG.tomatoes, 600, 400);
  if (t.includes("cucumber")) return sized(IMG.cucumber, 600, 400);
  if (t.includes("sunflower")) return sized(IMG.sunflowers, 600, 400);
  if (t.includes("rose")) return sized(IMG.roses, 600, 400);
  if (t.includes("peach")) return sized(IMG.peaches, 600, 400);
  if (t.includes("apple")) return sized(IMG.apples, 600, 400);
  if (t.includes("berry") || t.includes("strawberry")) return sized(IMG.berries, 600, 400);
  if (t.includes("pickle") || t.includes("kimchi") || t.includes("sauerkraut")) return sized(IMG.pickles, 600, 400);
  if (t.includes("kombucha") || t.includes("ferment") || t.includes("kvass")) return sized(IMG.kombucha, 600, 400);
  if (t.includes("salad") || t.includes("microgreen") || t.includes("kale") || t.includes("spinach")) return sized(IMG.salad, 600, 400);
  if (t.includes("carrot")) return sized(IMG.carrots, 600, 400);
  if (t.includes("pepper") || t.includes("eggplant") || t.includes("zucchini") || t.includes("squash")) return sized(IMG.peppers, 600, 400);
  if (t.includes("bread") || t.includes("bun") || t.includes("loaf") || t.includes("donut")) return sized(IMG.baker, 600, 400);

  switch (category) {
    case "Eggs": return sized(IMG.eggs, 600, 400);
    case "Honey": return sized(IMG.honey, 600, 400);
    case "Vegetables": return sized(IMG.vegetables, 600, 400);
    case "Herbs": return sized(IMG.herbs, 600, 400);
    case "Fruits": return sized(IMG.apples, 600, 400);
    case "Fresh Flowers":
    case "Cut Flowers":
    case "Seasonal Flowers":
    case "Roses":
      return sized(IMG.flowers, 600, 400);
    case "Sunflowers":
      return sized(IMG.sunflowers, 600, 400);
    case "Bouquets":
    case "Handmade Bouquets":
      return sized(IMG.bouquet, 600, 400);
    case "Pickled Foods":
      return sized(IMG.pickles, 600, 400);
    case "Fermented Foods":
      return sized(IMG.kombucha, 600, 400);
    default:
      return sized(IMG.vegetables, 600, 400);
  }
}
