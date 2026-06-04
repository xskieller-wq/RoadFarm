import type { Seller, Product, ProductCategory } from "@/lib/types";
import { formatFreshnessDisplay } from "@/lib/freshness";
import { getBakerCoverImage } from "@/data/images";

export function getMainProductsForSeller(
  products: Product[],
  sellerId: string,
  limit = 3
): string[] {
  return products
    .filter((p) => p.sellerId === sellerId && !p.sold)
    .slice(0, limit)
    .map((p) => p.title);
}

export function getMainProductCategories(
  products: Product[],
  sellerId: string,
  limit = 4
): ProductCategory[] {
  const cats = [...new Set(products.filter((p) => p.sellerId === sellerId && !p.sold).map((p) => p.category))];
  return cats.slice(0, limit);
}

const REVIEW_SNIPPETS = [
  "Always fresh and exactly as described. Love supporting a neighbor!",
  "The paczki were still warm — batch time on the listing was spot on.",
  "Pickup was easy and the quality is incredible. Will order again.",
  "Feels like a neighborhood bakery run, not a grocery shelf.",
  "Fresh batch alert saved me a trip — donuts were right out of the glaze.",
  "Best local bread and cookies I've had in the area. Highly recommend.",
];

export function getSellerCardImage(seller: Seller): string {
  if (seller.sellerType === "Baker") {
    return getBakerCoverImage(seller.specialties);
  }
  return (
    seller.flowerPhotos[0]?.url ||
    seller.gardenPhotos[0]?.url ||
    seller.greenhousePhotos[0]?.url ||
    seller.coverPhoto
  );
}

export function getSellerHighlightProducts(
  products: Product[],
  sellerId: string,
  limit = 3
): Product[] {
  return products.filter((p) => p.sellerId === sellerId && !p.sold).slice(0, limit);
}

export function formatProductFreshnessLine(product: Product): string {
  return formatFreshnessDisplay(product);
}

export function getSampleReview(sellerId: string): string {
  const index = sellerId.charCodeAt(1) % REVIEW_SNIPPETS.length;
  return REVIEW_SNIPPETS[index];
}

export function filterSellersByType(sellers: Seller[], types: Seller["sellerType"][]) {
  return sellers.filter((s) => types.includes(s.sellerType));
}
