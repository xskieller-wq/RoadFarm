import type { Seller, Product, ProductCategory } from "@/lib/types";

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
  "Beautiful garden — you can tell they care about what they grow.",
  "Pickup was easy and the quality is incredible. Will order again.",
  "Feels like a farmers market, but from someone on my block.",
  "The video tour sold me. Real people, real garden, real food.",
  "Best eggs/honey/flowers I've had in the area. Highly recommend.",
];

export function getSampleReview(sellerId: string): string {
  const index = sellerId.charCodeAt(1) % REVIEW_SNIPPETS.length;
  return REVIEW_SNIPPETS[index];
}

export function filterSellersByType(sellers: Seller[], types: Seller["sellerType"][]) {
  return sellers.filter((s) => types.includes(s.sellerType));
}
