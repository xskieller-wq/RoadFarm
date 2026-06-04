import type { HomeFeedItem } from "@routefarm/shared";

import type { ProductCategory } from "@/lib/types";

import { sized, IMG, resolveProductPhoto } from "@/data/images";

import { bakeryLaunchPhotoForItem } from "@/lib/freshdrop/bakery-launch-photos";

/** Warm bakery photography — natural color, not candy-saturated */

export const foodPhotoClassName =

  "object-cover object-[center_42%] brightness-[1.02] saturate-[0.9] contrast-[1.04] sepia-[0.04]";

/** Homepage launch zone — hardcoded bakery-food URLs only (no feed image_url, no legacy IDs). */

function launchBakeryPhoto(item: HomeFeedItem | null, w: number, h: number): string {

  if (!item) return bakeryLaunchPhotoForItem("Bread", "Country Sourdough Loaf", w, h);

  return bakeryLaunchPhotoForItem(

    item.category as ProductCategory,

    item.title,

    w,

    h

  );

}

function feedPhoto(item: HomeFeedItem | null, w: number, h: number): string {

  if (!item) return sized(IMG.sourdough, w, h);

  return sized(resolveProductPhoto(item.category as ProductCategory, item.title), w, h);

}

export function dropLaunchCardImage(item: HomeFeedItem): string {

  return launchBakeryPhoto(item, 1200, 1500);

}

export function dropHeroImage(item: HomeFeedItem | null): string {

  return launchBakeryPhoto(item, 1600, 2000);

}

export function dropCardImage(item: HomeFeedItem): string {

  return feedPhoto(item, 1200, 1500);

}

export const MOOD_TEXTURES = [

  { src: bakeryLaunchPhotoForItem("Bread", "sourdough", 800, 1000), alt: "Sourdough loaf" },

  { src: bakeryLaunchPhotoForItem("Bread", "rye", 800, 1000), alt: "Rye bread" },

  { src: bakeryLaunchPhotoForItem("Bread", "bread", 800, 1000), alt: "Artisan bread" },

  { src: bakeryLaunchPhotoForItem("Pastries", "croissant", 800, 1000), alt: "Butter croissants" },

  { src: bakeryLaunchPhotoForItem("Polish Paczki", "paczki", 800, 1000), alt: "Paczki batch" },

  { src: bakeryLaunchPhotoForItem("Cookies", "cookie", 800, 1000), alt: "Fresh-baked cookies" },

] as const;
