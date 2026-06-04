import type { Product, FreshnessLabel, ProductCategory } from "@/lib/types";
import { isBakeryCategory } from "@/lib/categories";

export type { FreshnessLabel };

export const BAKERY_FRESHNESS_LABEL_OPTIONS: FreshnessLabel[] = [
  "Fresh Batch Time",
  "Made Today",
  "Made To Order",
  "Available Now",
  "Fresh Batch Alerts",
];

export const LEGACY_FRESHNESS_LABEL_OPTIONS: FreshnessLabel[] = [
  "Picked Today",
  "Picked After Order",
  "Cut Today",
  "Cut Before Pickup",
  "Collected Today",
  "Fresh Batch",
  "Fresh Batch At 6 AM",
  "Fresh Batch At 7 AM",
  "Fresh Batch At 12 PM",
  "Ready For Pickup",
  "Growing Now",
];

export const FRESHNESS_LABEL_OPTIONS: FreshnessLabel[] = [
  ...BAKERY_FRESHNESS_LABEL_OPTIONS,
  ...LEGACY_FRESHNESS_LABEL_OPTIONS,
];

export function getFreshnessOptionsForCategory(category: ProductCategory): FreshnessLabel[] {
  return isBakeryCategory(category) ? BAKERY_FRESHNESS_LABEL_OPTIONS : FRESHNESS_LABEL_OPTIONS;
}

export function formatFreshnessDisplay(product: Product): string {
  const label = getProductFreshnessLabel(product);
  if (label === "Fresh Batch Time" && product.freshnessBatchTime) {
    return `Fresh batch · ${product.freshnessBatchTime}`;
  }
  if (label === "Fresh Batch Alerts" || product.freshBatchAlerts) {
    return product.freshBatchAlerts ? "Fresh batch alerts on" : "Fresh Batch Alerts";
  }
  return label;
}

export function inferFreshnessLabel(
  product: Pick<Product, "title" | "category" | "freshnessStatus" | "freshnessLabel">
): FreshnessLabel {
  if (product.freshnessLabel) return product.freshnessLabel;

  if (isBakeryCategory(product.category)) {
    const t = product.title.toLowerCase();
    if (t.includes("paczki") || t.includes("fat tuesday") || t.includes("pre-order")) {
      return "Made To Order";
    }
    if (t.includes("wedding") || t.includes("custom") || t.includes("celebration cake")) {
      return "Made To Order";
    }
    if (product.freshnessStatus === "Available Now") return "Available Now";
    if (t.includes("donut") || t.includes("croissant") || t.includes("muffin")) {
      return "Fresh Batch Time";
    }
    if (t.includes("cookie") || t.includes("bread") || t.includes("loaf")) {
      return "Made Today";
    }
    return "Made Today";
  }

  const t = product.title.toLowerCase();

  if (t.includes("noon") || t.includes("lunch") || t.includes("midday")) {
    return "Fresh Batch At 12 PM";
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
