/** MVP bakery categories */
export type BakeryCategory =
  | "Polish Paczki"
  | "Donuts"
  | "Bread"
  | "Cakes"
  | "Pastries"
  | "Cookies";

export type FoodCategory =
  | "Eggs"
  | "Fruits"
  | "Vegetables"
  | "Honey"
  | "Herbs"
  | "Mushrooms"
  | "Pickled Foods"
  | "Fermented Foods"
  | "Preserves"
  | "Homemade Drinks";

export type FlowerCategory =
  | "Fresh Flowers"
  | "Roses"
  | "Sunflowers"
  | "Seasonal Flowers"
  | "Cut Flowers"
  | "Bouquets"
  | "Handmade Bouquets";

export type ProductCategory = BakeryCategory | FoodCategory | FlowerCategory;

export type FreshnessStatus =
  | "Growing Now"
  | "Harvesting Today"
  | "Fresh Today"
  | "Available Now"
  | "Ready For Pickup";

/** Bakery-first freshness (main MVP value prop) */
export type BakeryFreshnessLabel =
  | "Fresh Batch Time"
  | "Made Today"
  | "Made To Order"
  | "Available Now"
  | "Fresh Batch Alerts";

/** Legacy / future categories */
export type LegacyFreshnessLabel =
  | "Picked Today"
  | "Picked After Order"
  | "Cut Today"
  | "Cut Before Pickup"
  | "Collected Today"
  | "Fresh Batch"
  | "Fresh Batch At 6 AM"
  | "Fresh Batch At 7 AM"
  | "Fresh Batch At 12 PM"
  | "Ready For Pickup"
  | "Growing Now";

/** Product freshness — how/when the item is prepared (not seller hours) */
export type FreshnessLabel = BakeryFreshnessLabel | LegacyFreshnessLabel;

export type PhotoType =
  | "product"
  | "garden"
  | "farm"
  | "flower_garden"
  | "growing"
  | "harvest"
  | "ready_for_pickup"
  | "bouquet"
  | "previous_bouquet";

export interface ProductPhoto {
  url: string;
  type: PhotoType;
  caption?: string;
}

export interface ProductVideo {
  url: string;
  caption?: string;
  thumbnail: string;
}

export interface PickupHours {
  day: string;
  open: string;
  close: string;
}

export interface SellerCompliance {
  zipCode: string;
  county: string;
  healthDepartmentInfo: string;
  documentsUploaded: boolean;
  responsibilityConfirmed: boolean;
  completedAt?: string;
}

export type SellerType =
  | "Baker"
  | "Gardener"
  | "Flower Grower"
  | "Beekeeper"
  | "Small Producer"
  | "Orchard Grower"
  | "Florist";

export type SellerBadgeId =
  | "new_grower"
  | "top_rated"
  | "community_favorite"
  | "flower_specialist"
  | "tomato_expert"
  | "honey_producer"
  | "farm_fresh_eggs"
  | "organic_practices"
  | "great_garden_photos"
  | "video_verified"
  | "premium_quality"
  | "seasonal_champion"
  | "bouquet_artist"
  | "orchard_grower";

export type SellerAvailabilityStatus =
  | "available_now"
  | "available_today"
  | "pickup_by_appointment"
  | "temporarily_unavailable"
  | "vacation";

export interface SellerPickupWindow {
  open: string;
  close: string;
}

export type SellerApprovalStatus = "approved" | "pending" | "rejected";

export interface SellerReview {
  id: string;
  sellerId: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
  visible: boolean;
}

export interface UserReport {
  id: string;
  type: "seller" | "product" | "review";
  targetId: string;
  targetName: string;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
}

export type SellerPhotoType = "garden" | "flower" | "greenhouse" | "farm" | "harvest";

export interface SellerPhoto {
  url: string;
  type: SellerPhotoType;
  caption?: string;
}

export type SellerVideoType =
  | "garden_walkthrough"
  | "flowers_growing"
  | "vegetables_growing"
  | "greenhouse_tour"
  | "bouquet_showcase"
  | "harvest_footage";

export interface SellerVideo {
  url: string;
  type: SellerVideoType;
  caption: string;
  thumbnail: string;
  duration?: string;
}

export interface Seller {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  bio: string;
  sellerType: SellerType;
  avatar: string;
  coverPhoto: string;
  gardenPhotos: SellerPhoto[];
  flowerPhotos: SellerPhoto[];
  greenhousePhotos: SellerPhoto[];
  videos: SellerVideo[];
  city: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  memberSince: string;
  verified: boolean;
  badges: SellerBadgeId[];
  featured: boolean;
  approvalStatus: SellerApprovalStatus;
  pickupLocation: string;
  pickupHours: PickupHours[];
  availabilityStatus: SellerAvailabilityStatus;
  weekdayPickup?: SellerPickupWindow;
  weekendPickup?: SellerPickupWindow;
  specialties: ProductCategory[];
  requiresCompliance: boolean;
  compliance?: SellerCompliance;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  category: ProductCategory;
  description: string;
  quantityAvailable: number;
  price: number;
  pickupLocation: string;
  pickupHours: PickupHours[];
  photos: ProductPhoto[];
  videos: ProductVideo[];
  freshnessStatus: FreshnessStatus;
  /** How fresh the product is (displayed to buyers) */
  freshnessLabel?: FreshnessLabel;
  /** Shown with Fresh Batch Time (e.g. "6:00 AM") */
  freshnessBatchTime?: string;
  /** Buyer can opt into batch-ready alerts for this listing */
  freshBatchAlerts?: boolean;
  /** Optional display override */
  freshnessNote?: string;
  estimatedDetourMinutes: number;
  sold: boolean;
  bouquetType?: string;
  createdAt: string;
}

export interface RouteSearchParams {
  start: string;
  destination: string;
  maxDetour: number;
  category?: ProductCategory | "all";
  maxPrice?: number;
  freshnessStatus?: FreshnessStatus | "all";
}

export interface Reservation {
  id: string;
  productId: string;
  productTitle: string;
  sellerName: string;
  quantity: number;
  pickupLocation: string;
  pickupHours: string;
  reservedAt: string;
  status: "pending" | "confirmed" | "picked_up";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "buyer" | "seller" | "admin";
  sellerId?: string;
}

export {
  BAKERY_CATEGORIES,
  FUTURE_CATEGORIES,
  ALL_CATEGORIES,
  COMPLIANCE_CATEGORIES,
  isBakeryCategory,
  isFutureCategory,
} from "@/lib/categories";

export const FRESHNESS_STATUSES: FreshnessStatus[] = [
  "Growing Now",
  "Harvesting Today",
  "Fresh Today",
  "Available Now",
  "Ready For Pickup",
];

export const DETOUR_OPTIONS = [0, 2, 5, 10] as const;

export const BOUQUET_TYPES = [
  "birthday bouquets",
  "anniversary bouquets",
  "sympathy bouquets",
  "wedding bouquets",
  "seasonal bouquets",
];

export const BUYER_DISCLAIMER =
  "This product is sold by an independent local seller. Seller is responsible for compliance with applicable food regulations.";

export const COMPLIANCE_CHECKBOX =
  "I confirm that I am responsible for complying with all applicable Illinois Cottage Food requirements.";

export const ILLINOIS_COUNTIES = [
  "Cook County",
  "DuPage County",
  "Lake County",
  "Will County",
];

export const LOCAL_CITIES = [
  "Norridge",
  "Park Ridge",
  "Des Plaines",
  "Harwood Heights",
  "Schiller Park",
  "Elmwood Park",
] as const;
