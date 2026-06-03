import type { Seller, SellerPhoto, SellerVideo, SellerType, ProductCategory } from "@/lib/types";
import { inferSellerBadges } from "@/data/badges";
import { IMG, sellerAvatar, sellerCover, sized } from "@/data/images";

function photo(url: string, type: SellerPhoto["type"], caption: string): SellerPhoto {
  return { url: sized(url, 800, 600), type, caption };
}

function video(
  type: SellerVideo["type"],
  caption: string,
  thumbnail: string,
  duration = "0:45"
): SellerVideo {
  return { url: "#", type, caption, thumbnail: sized(thumbnail, 800, 450), duration };
}

function inferSellerType(specialties: ProductCategory[]): SellerType {
  const flower = ["Fresh Flowers", "Roses", "Sunflowers", "Seasonal Flowers", "Cut Flowers", "Bouquets", "Handmade Bouquets"];
  if (specialties.some((s) => flower.includes(s))) {
    return specialties.includes("Bouquets") || specialties.includes("Handmade Bouquets")
      ? "Florist"
      : "Flower Grower";
  }
  if (specialties.includes("Honey")) return "Beekeeper";
  if (specialties.includes("Fruits")) return "Orchard Grower";
  if (specialties.includes("Eggs") || specialties.includes("Vegetables")) return "Gardener";
  return "Small Producer";
}

function pickCover(sellerType: SellerType, specialties: ProductCategory[]): string {
  switch (sellerType) {
    case "Florist":
    case "Flower Grower":
      return sellerCover("flowers");
    case "Beekeeper":
      return sellerCover("honey");
    case "Orchard Grower":
      return sellerCover("orchard");
    default:
      return specialties.includes("Eggs") ? sellerCover("eggs") : sellerCover("garden");
  }
}

/** Enrich sellers with garden media, badges, and trust signals */
export function enrichSellerMedia(
  seller: Omit<Seller, "sellerType" | "gardenPhotos" | "flowerPhotos" | "greenhousePhotos" | "videos" | "badges" | "featured" | "approvalStatus" | "availabilityStatus" | "weekdayPickup" | "weekendPickup"> &
    Partial<Pick<Seller, "sellerType" | "gardenPhotos" | "flowerPhotos" | "greenhousePhotos" | "videos" | "badges" | "featured" | "approvalStatus" | "availabilityStatus" | "weekdayPickup" | "weekendPickup">>,
  index = 0
): Seller {
  const sellerType = seller.sellerType ?? inferSellerType(seller.specialties);
  const isFlower = ["Florist", "Flower Grower"].includes(sellerType);
  const isGarden = ["Gardener", "Small Producer", "Orchard Grower"].includes(sellerType);
  const isBee = sellerType === "Beekeeper";

  const gardenPhotos: SellerPhoto[] = seller.gardenPhotos ?? [
    photo(IMG.garden, "garden", "Our backyard garden"),
    photo(IMG.vegetables, "garden", "Seasonal vegetable beds"),
    photo(IMG.harvest, "harvest", "Fresh from the garden"),
  ];

  const flowerPhotos: SellerPhoto[] = seller.flowerPhotos ?? (isFlower
    ? [
        photo(IMG.flowers, "flower", "Cut flowers ready today"),
        photo(IMG.bouquet, "flower", "Handcrafted bouquets"),
        photo(IMG.sunflowers, "flower", "Flower beds in bloom"),
      ]
    : isGarden
      ? [photo(IMG.flowers, "flower", "Companion flowers in the garden")]
      : []);

  const greenhousePhotos: SellerPhoto[] = seller.greenhousePhotos ?? [
    photo(IMG.greenhouse, "greenhouse", "Greenhouse growing space"),
    photo(isBee ? IMG.honey : IMG.garden, "greenhouse", isBee ? "Hive area" : "Seedling trays"),
  ];

  const videos: SellerVideo[] = seller.videos ?? [
    ...(isFlower
      ? [
          video("flowers_growing", "Flowers growing in our garden", IMG.flowers),
          video("bouquet_showcase", "Bouquet showcase", IMG.bouquet, "1:02"),
        ]
      : []),
    ...(isGarden || sellerType === "Orchard Grower"
      ? [
          video("garden_walkthrough", "Garden walk-through", IMG.garden, "1:15"),
          video("vegetables_growing", "Vegetables growing", IMG.vegetables, "0:52"),
          video("harvest_footage", "Harvest footage", IMG.harvest, "0:38"),
        ]
      : []),
    ...(isBee ? [video("garden_walkthrough", "Garden & hive tour", IMG.honey, "1:10")] : []),
    video("greenhouse_tour", "Greenhouse tour", IMG.greenhouse, "0:48"),
  ].slice(0, 4);

  const enriched: Seller = {
    ...seller,
    sellerType,
    avatar: sellerAvatar(index),
    coverPhoto: pickCover(sellerType, seller.specialties),
    gardenPhotos,
    flowerPhotos,
    greenhousePhotos,
    videos,
    badges: seller.badges ?? [],
    featured: seller.featured ?? index < 3,
    approvalStatus: seller.approvalStatus ?? "approved",
    availabilityStatus:
      seller.availabilityStatus ??
      (
        [
          "available_now",
          "available_today",
          "pickup_by_appointment",
          "temporarily_unavailable",
          "vacation",
        ] as const
      )[index % 5],
    weekdayPickup: seller.weekdayPickup ?? { open: "5:00 PM", close: "8:00 PM" },
    weekendPickup: seller.weekendPickup ?? { open: "8:00 AM", close: "2:00 PM" },
  };

  if (enriched.badges.length === 0) {
    enriched.badges = inferSellerBadges(enriched);
  }

  return enriched;
}

export const SELLER_TYPE_LABELS: Record<SellerType, string> = {
  Gardener: "Local Gardener",
  "Flower Grower": "Flower Grower",
  Beekeeper: "Beekeeper",
  "Small Producer": "Small Producer",
  "Orchard Grower": "Orchard Grower",
  Florist: "Florist & Bouquet Maker",
};

export const VIDEO_TYPE_LABELS: Record<SellerVideo["type"], string> = {
  garden_walkthrough: "Garden walk-through",
  flowers_growing: "Flowers growing",
  vegetables_growing: "Vegetables growing",
  greenhouse_tour: "Greenhouse tour",
  bouquet_showcase: "Bouquet showcase",
  harvest_footage: "Harvest footage",
};
