import type { HomeFeedItem } from "@routefarm/shared";
import type { Product, ProductCategory } from "@/lib/types";
import { isBakeryCategory } from "@/lib/categories";

/** Titles that indicate future / non-bakery verticals — never on bakery-first home. */
const NON_BAKERY_TITLE =
  /\b(honey|wildflower honey|eggs?|flower|bouquet|pickle|mushroom|preserve|jam jar|kombucha|drink|coffee|merch|gift card|grow kit|vegetable|produce|orchard|farm fresh dozen|fruit stand|apples? for sale|raw honey)\b/i;

const CONVENIENCE_TITLE =
  /\b(meal kit|frozen dinner|pizza slice|sandwich platter|grocery|supermarket|charcuterie)\b/i;

export function isLaunchBakeryTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return false;
  if (NON_BAKERY_TITLE.test(t)) return false;
  if (CONVENIENCE_TITLE.test(t)) return false;
  return true;
}

/** Bakery-first homepage: allowed MVP categories only. */
export function isLaunchBakeryCategory(category: ProductCategory): boolean {
  return isBakeryCategory(category);
}

export function isLaunchBakeryProduct(product: Product): boolean {
  if (product.sold) return false;
  if (!isLaunchBakeryCategory(product.category)) return false;
  return isLaunchBakeryTitle(product.title);
}

export function isLaunchBakeryFeedItem(item: HomeFeedItem): boolean {
  if (!isLaunchBakeryCategory(item.category as ProductCategory)) return false;
  if (!isLaunchBakeryTitle(item.title)) return false;
  if (/^e2e\b/i.test(item.title) || /e2e test/i.test(item.seller_name ?? "")) {
    return false;
  }
  return true;
}

export function filterLaunchBakeryFeed(items: HomeFeedItem[]): HomeFeedItem[] {
  return items.filter(isLaunchBakeryFeedItem);
}

export function filterLaunchBakeryProducts(products: Product[]): Product[] {
  return products.filter(isLaunchBakeryProduct);
}
