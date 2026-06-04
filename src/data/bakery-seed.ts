import type { Product, ProductCategory, FreshnessLabel, FreshnessStatus } from "@/lib/types";
import { bakeryLaunchPhotoForItem } from "@/lib/freshdrop/bakery-launch-photos";

type BakeryProductSeed = Omit<Product, "id" | "createdAt" | "pickupLocation" | "pickupHours">;

function photo(url: string) {
  return { url, type: "product" as const };
}

function seed(
  sellerId: string,
  title: string,
  category: BakeryProductSeed["category"],
  description: string,
  price: number,
  opts: {
    quantityAvailable?: number;
    freshnessLabel: FreshnessLabel;
    freshnessBatchTime?: string;
    freshBatchAlerts?: boolean;
    freshnessStatus?: FreshnessStatus;
    detour?: number;
  }
): BakeryProductSeed {
  return {
    sellerId,
    title,
    category,
    description,
    quantityAvailable: opts.quantityAvailable ?? 12,
    price,
    photos: [
      photo(bakeryLaunchPhotoForItem(category, title, 600, 400)),
    ],
    videos: [],
    freshnessStatus: opts.freshnessStatus ?? "Fresh Today",
    freshnessLabel: opts.freshnessLabel,
    freshnessBatchTime: opts.freshnessBatchTime,
    freshBatchAlerts: opts.freshBatchAlerts,
    estimatedDetourMinutes: opts.detour ?? 3,
    sold: false,
  };
}

/** Bakery-first launch catalog — local counter menu only (no future verticals). */
export const BAKERY_PRODUCT_SEEDS: BakeryProductSeed[] = [
  seed("s1", "Traditional Rose Paczki – 6 pack", "Polish Paczki", "Classic Polish paczki with rose jam and glaze. Baked this morning.", 14, {
    freshnessLabel: "Made Today",
    freshnessBatchTime: "6:30 AM",
    detour: 2,
  }),
  seed("s1", "Custard-Filled Paczki – 4 pack", "Polish Paczki", "Rich custard paczki — separate from our ring donuts.", 12, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "7:00 AM",
    freshBatchAlerts: true,
    detour: 2,
  }),
  seed("s1", "Raspberry Danish Pastries – 4 pack", "Pastries", "Buttery danishes from the same oven line.", 10, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "8:00 AM",
    detour: 2,
  }),

  seed("s2", "Glazed Ring Donuts – 6 pack", "Donuts", "Classic glazed rings — not paczki.", 9, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "6:00 AM",
    freshBatchAlerts: true,
    detour: 3,
  }),
  seed("s2", "Chocolate Frosted Donuts – 4 pack", "Donuts", "Cocoa glaze, raised yeast donuts.", 8, {
    freshnessLabel: "Made Today",
    detour: 3,
  }),

  seed("s3", "Country Sourdough Loaf", "Bread", "Long-ferment sourdough, baked before dawn.", 9, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "5:30 AM",
    freshBatchAlerts: true,
    detour: 2,
  }),
  seed("s3", "Polish Rye Bread", "Bread", "Dense rye loaf — morning bake.", 7, {
    freshnessLabel: "Made Today",
    detour: 2,
  }),
  seed("s3", "Soft Dinner Rolls – 6 pack", "Bread", "Pull-apart rolls for family dinners.", 6, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "4:00 PM",
    detour: 2,
  }),

  seed("s4", "Vanilla Birthday Cake – 8 inch", "Cakes", "Classic vanilla buttercream — made to order.", 32, {
    quantityAvailable: 4,
    freshnessLabel: "Made To Order",
    detour: 4,
  }),
  seed("s4", "Chocolate Layer Cake – slice", "Cakes", "Rich cocoa layers, sold by the slice today.", 6, {
    freshnessLabel: "Made Today",
    detour: 4,
  }),
  seed("s4", "Lemon Raspberry Cupcakes – 6 pack", "Cakes", "Spring citrus cupcakes from this morning's batch.", 14, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "9:00 AM",
    detour: 4,
  }),

  seed("s5", "Butter Croissants – 4 pack", "Pastries", "Flaky croissants, out by 8 AM.", 11, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "8:00 AM",
    freshBatchAlerts: true,
    detour: 3,
  }),
  seed("s5", "Cinnamon Rolls – 4 pack", "Pastries", "Soft rolls with cream cheese glaze.", 10, {
    freshnessLabel: "Made Today",
    detour: 3,
  }),
  seed("s5", "Blueberry Muffins – 6 pack", "Pastries", "Breakfast muffins, baked at dawn.", 9, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "7:00 AM",
    detour: 3,
  }),
  seed("s5", "Chocolate Chip Cookies – dozen", "Cookies", "Soft bakery cookies, restocked at lunch.", 10, {
    freshnessLabel: "Fresh Batch Time",
    freshnessBatchTime: "12:00 PM",
    freshBatchAlerts: true,
    detour: 3,
  }),
  seed("s5", "Snickerdoodle Cookies – 12 pack", "Cookies", "Cinnamon-sugar classic.", 9, {
    freshnessLabel: "Made Today",
    detour: 3,
  }),
];

type FutureProductSeed = Omit<Product, "id" | "createdAt" | "pickupLocation" | "pickupHours">;

function futureSeed(
  sellerId: string,
  title: string,
  category: ProductCategory,
  description: string,
  price: number,
  freshnessLabel: FreshnessLabel,
  detour = 4
): FutureProductSeed {
  return {
    sellerId,
    title,
    category,
    description,
    quantityAvailable: 10,
    price,
    photos: [photo(bakeryLaunchPhotoForItem("Bread", "Country Sourdough Loaf", 600, 400))],
    videos: [],
    freshnessStatus: "Fresh Today",
    freshnessLabel,
    estimatedDetourMinutes: detour,
    sold: false,
  };
}

/** Future verticals — other routes only; blocked from bakery-first homepage. */
export const FUTURE_SAMPLE_SEEDS: FutureProductSeed[] = [
  futureSeed("s8", "Farm Fresh Dozen Eggs", "Eggs", "Pasture eggs — future category alongside bakery.", 6.5, "Collected Today", 2),
  futureSeed("s14", "Raw Wildflower Honey – 8oz", "Honey", "Backyard honey for when buyers expand beyond bakery.", 12, "Made Today", 4),
  futureSeed("s7", "Seasonal Wildflower Mix", "Fresh Flowers", "Cut flowers — architecture ready for florists.", 22, "Cut Today", 3),
  futureSeed("s6", "Garlic Dill Pickles – pint", "Pickled Foods", "Pantry pickles — compliance path still supported.", 7, "Ready For Pickup", 5),
  futureSeed("s10", "Strawberry Preserves – 8oz", "Preserves", "Homemade jam — preserves category reserved.", 8, "Made Today", 3),
  futureSeed("s15", "Shiitake Mushroom Grow Kit", "Mushrooms", "Mushrooms category placeholder for later.", 18, "Growing Now", 4),
];
