import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatPickupHours(
  hours: { day: string; open: string; close: string }[]
): string {
  if (hours.length === 0) return "Contact seller";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = hours.find((h) => h.day === today);
  if (todayHours) {
    return `Today ${todayHours.open}–${todayHours.close}`;
  }
  return `${hours[0].day} ${hours[0].open}–${hours[0].close}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCategoryColor(category: string): string {
  const bakeryCategories = [
    "Polish Paczki",
    "Donuts",
    "Bread",
    "Cakes",
    "Pastries",
    "Cookies",
  ];
  if (category === "Polish Paczki") return "bg-blossom-100 text-blossom-800";
  if (category === "Donuts") return "bg-sunflower-100 text-sunflower-800";
  if (bakeryCategories.includes(category)) return "bg-warm-100 text-warm-800";

  const flowerCategories = [
    "Fresh Flowers",
    "Roses",
    "Cut Flowers",
    "Seasonal Flowers",
  ];
  const bouquetCategories = ["Bouquets", "Handmade Bouquets"];
  const sunnyCategories = ["Sunflowers", "Honey", "Fruits"];
  const gardenCategories = ["Vegetables", "Herbs", "Eggs"];

  if (bouquetCategories.includes(category)) return "bg-blossom-100 text-blossom-700";
  if (category === "Roses") return "bg-blossom-100 text-blossom-800";
  if (flowerCategories.includes(category)) return "bg-lavender-100 text-lavender-700";
  if (category === "Sunflowers") return "bg-sunflower-100 text-sunflower-700";
  if (category === "Honey") return "bg-sunflower-100 text-sunflower-800";
  if (gardenCategories.includes(category)) return "bg-sage-100 text-sage-600";
  if (category === "Pickled Foods" || category === "Fermented Foods") {
    return "bg-tomato-100 text-tomato-700";
  }
  return "bg-warm-100 text-warm-700";
}

export function getFreshnessColor(label: string): string {
  if (
    label === "Fresh Batch Time" ||
    label === "Fresh Batch Alerts" ||
    label.includes("Batch") ||
    label.includes("6 AM") ||
    label.includes("7 AM") ||
    label.includes("12 PM")
  ) {
    return "bg-sunflower-100 text-sunflower-800";
  }
  if (label === "Made Today" || label === "Available Now") {
    return "bg-sage-100 text-sage-700";
  }
  if (label.includes("Picked") || label.includes("Collected") || label.includes("Cut Today")) {
    return "bg-sage-100 text-sage-700";
  }
  if (label.includes("Order") || label.includes("Before Pickup") || label.includes("Made To")) {
    return "bg-lavender-100 text-lavender-800";
  }
  if (label === "Growing Now") return "bg-sage-50 text-sage-600";
  return "bg-warm-100 text-warm-700";
}
