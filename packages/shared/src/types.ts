/** Phase 1 domain types — aligned with Supabase schema */

export type UserRole = "buyer" | "seller" | "admin";

export type SellerType =
  | "Baker"
  | "Gardener"
  | "Flower Grower"
  | "Beekeeper"
  | "Small Producer"
  | "Orchard Grower"
  | "Florist";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type AvailabilityStatus =
  | "available_now"
  | "available_today"
  | "pickup_by_appointment"
  | "temporarily_unavailable"
  | "vacation";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  buyer_onboarding_completed_at: string | null;
  seller_onboarding_completed_at: string | null;
}

export interface BuyerProfile {
  user_id: string;
  neighborhood: string | null;
  city: string;
  state: string;
  preferred_categories: string[];
  map_radius_miles: number;
}

export interface Seller {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  bio: string | null;
  seller_type: SellerType;
  city: string;
  neighborhood: string | null;
  address: string | null;
  lat: number;
  lng: number;
  avatar_url: string | null;
  cover_photo_url: string | null;
  specialties: string[];
  approval_status: ApprovalStatus;
  availability_status: AvailabilityStatus;
  verified: boolean;
  featured: boolean;
  rating: number;
  review_count: number;
}

export interface ProductTemplate {
  id: string;
  seller_id: string;
  category: string;
  title: string;
  description: string | null;
  default_price_cents: number;
  default_freshness_label: string | null;
  default_quantity: number;
  image_url: string | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  seller_id: string;
  template_id: string | null;
  title: string;
  description: string | null;
  category: string;
  price_cents: number;
  quantity_available: number;
  freshness_label: string | null;
  image_url: string | null;
  sold: boolean;
}

export interface HomeFeedItem {
  id: string;
  product_id: string;
  seller_id: string;
  title: string;
  category: string;
  price_cents: number;
  freshness_label: string | null;
  image_url: string | null;
  seller_name: string;
  seller_slug: string;
  seller_city: string | null;
  published_at: string;
}
