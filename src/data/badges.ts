import type { Seller, SellerBadgeId } from "@/lib/types";

export interface BadgeDefinition {
  id: SellerBadgeId;
  label: string;
  emoji: string;
  description: string;
}

export const SELLER_BADGES: Record<SellerBadgeId, BadgeDefinition> = {
  new_grower: { id: "new_grower", label: "Founding Grower", emoji: "🌱", description: "Early member of the RouteFarm community" },
  top_rated: { id: "top_rated", label: "Top Rated", emoji: "⭐", description: "Consistently excellent reviews" },
  community_favorite: { id: "community_favorite", label: "Community Favorite", emoji: "🏆", description: "Beloved by neighbors" },
  flower_specialist: { id: "flower_specialist", label: "Flower Specialist", emoji: "🌻", description: "Expert flower grower or florist" },
  tomato_expert: { id: "tomato_expert", label: "Tomato Expert", emoji: "🍅", description: "Known for exceptional tomatoes" },
  honey_producer: { id: "honey_producer", label: "Honey Specialist", emoji: "🍯", description: "Local honey & bee products" },
  farm_fresh_eggs: { id: "farm_fresh_eggs", label: "Farm Fresh Eggs", emoji: "🥚", description: "Fresh eggs from happy hens" },
  organic_practices: { id: "organic_practices", label: "Organic Practices", emoji: "🌿", description: "Sustainable growing methods" },
  great_garden_photos: { id: "great_garden_photos", label: "Great Garden Photos", emoji: "📸", description: "Beautiful garden photography" },
  video_verified: { id: "video_verified", label: "Video Verified", emoji: "🎥", description: "Garden video tour on profile" },
  premium_quality: { id: "premium_quality", label: "Premium Quality", emoji: "💎", description: "Exceptional product quality" },
  seasonal_champion: { id: "seasonal_champion", label: "Seasonal Champion", emoji: "🏅", description: "Best seasonal offerings" },
  bouquet_artist: { id: "bouquet_artist", label: "Bouquet Artist", emoji: "💐", description: "Handcrafted floral arrangements" },
  orchard_grower: { id: "orchard_grower", label: "Orchard Grower", emoji: "🌳", description: "Fruit orchard specialist" },
};

export const ALL_BADGE_IDS = Object.keys(SELLER_BADGES) as SellerBadgeId[];

/** Auto-assign badges for mock/demo sellers */
export function inferSellerBadges(seller: Pick<Seller, "sellerType" | "rating" | "reviewCount" | "specialties" | "videos" | "gardenPhotos" | "verified">): SellerBadgeId[] {
  const badges: SellerBadgeId[] = [];

  if (seller.reviewCount < 25) badges.push("new_grower");
  if (seller.rating >= 4.85 && seller.reviewCount >= 40) badges.push("top_rated");
  if (seller.reviewCount >= 100) badges.push("community_favorite");
  if (seller.rating >= 4.75) badges.push("premium_quality");
  if (["Flower Grower", "Florist"].includes(seller.sellerType)) badges.push("flower_specialist");
  if (seller.sellerType === "Florist") badges.push("bouquet_artist");
  if (seller.sellerType === "Beekeeper" || seller.specialties.includes("Honey")) badges.push("honey_producer");
  if (seller.specialties.includes("Eggs")) badges.push("farm_fresh_eggs");
  if (seller.specialties.includes("Vegetables")) badges.push("tomato_expert");
  if (seller.sellerType === "Orchard Grower" || seller.specialties.includes("Fruits")) badges.push("orchard_grower");
  if (seller.videos.length > 0) badges.push("video_verified");
  if (seller.gardenPhotos.length >= 3) badges.push("great_garden_photos");
  if (seller.specialties.includes("Herbs") || seller.specialties.includes("Vegetables")) badges.push("organic_practices");
  if (seller.specialties.some((s) => ["Seasonal Flowers", "Sunflowers", "Fruits"].includes(s))) badges.push("seasonal_champion");

  return [...new Set(badges)].slice(0, 6);
}
