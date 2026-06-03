import type { Product, FreshnessLabel } from "@/lib/types";

export type { FreshnessLabel };

/** Buyer-facing freshness labels — separate from seller availability */
export const FRESHNESS_LABEL_OPTIONS: FreshnessLabel[] = [
  "Picked Today",
  "Picked After Order",
  "Cut Today",
  "Cut Before Pickup",
  "Made To Order",
  "Collected Today",
  "Fresh Batch",
  "Fresh Batch At 6 AM",
  "Fresh Batch At 7 AM",
  "Fresh Batch At 12 PM",
  "Ready For Pickup",
  "Growing Now",
];

export function inferFreshnessLabel(
  product: Pick<Product, "title" | "category" | "freshnessStatus" | "freshnessLabel">
): FreshnessLabel {
  if (product.freshnessLabel) return product.freshnessLabel;

  const t = product.title.toLowerCase();

  if (t.includes("noon") || t.includes("lunch") || t.includes("midday")) {
    return "Fresh Batch At 12 PM";
  }
  if (t.includes("donut") || t.includes("muffin") || t.includes("pastry")) {
    return "Fresh Batch At 7 AM";
  }
  if (
    t.includes("bread") ||
    t.includes("loaf") ||
    t.includes("roll") ||
    t.includes("bun") ||
    t.includes("scone") ||
    t.includes("bagel") ||
    t.includes("croissant")
  ) {
    return "Fresh Batch At 6 AM";
  }
  if (product.category === "Honey" || t.includes("honey")) return "Fresh Batch";
  if (
    t.includes("tomato") ||
    t.includes("cucumber") ||
    t.includes("pepper") ||
    t.includes("chard") ||
    t.includes("salad") ||
    t.includes("kale")
  ) {
    if (product.freshnessStatus === "Harvesting Today" || product.freshnessStatus === "Growing Now") {
      return "Picked After Order";
    }
    return "Picked Today";
  }
  if (product.category === "Eggs" || t.includes("egg")) return "Collected Today";
  if (product.category === "Bouquets" || product.category === "Handmade Bouquets" || t.includes("bouquet")) {
    return "Made To Order";
  }
  if (
    product.category === "Fresh Flowers" ||
    product.category === "Cut Flowers" ||
    product.category === "Roses" ||
    product.category === "Seasonal Flowers" ||
    product.category === "Sunflowers" ||
    t.includes("flower") ||
    t.includes("sunflower") ||
    t.includes("zinnia") ||
    t.includes("dahlia") ||
    t.includes("rose")
  ) {
    return product.freshnessStatus === "Ready For Pickup" ? "Cut Before Pickup" : "Cut Today";
  }
  if (product.freshnessStatus === "Growing Now") return "Growing Now";
  if (product.category === "Pickled Foods" || product.category === "Fermented Foods") {
    return "Ready For Pickup";
  }
  if (product.category === "Fruits" || product.category === "Vegetables" || product.category === "Herbs") {
    return product.freshnessStatus === "Harvesting Today" ? "Picked After Order" : "Picked Today";
  }
  return "Ready For Pickup";
}

export function getProductFreshnessLabel(product: Product): FreshnessLabel {
  return product.freshnessNote
    ? (product.freshnessNote as FreshnessLabel)
    : inferFreshnessLabel(product);
}
