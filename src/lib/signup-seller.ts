import type { Seller, PickupHours } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { sellerAvatar, sellerCover } from "@/data/images";

const defaultPickupHours: PickupHours[] = [
  { day: "Monday", open: "8:00 AM", close: "6:00 PM" },
  { day: "Tuesday", open: "8:00 AM", close: "6:00 PM" },
  { day: "Wednesday", open: "8:00 AM", close: "6:00 PM" },
  { day: "Thursday", open: "8:00 AM", close: "6:00 PM" },
  { day: "Friday", open: "8:00 AM", close: "7:00 PM" },
  { day: "Saturday", open: "9:00 AM", close: "5:00 PM" },
  { day: "Sunday", open: "10:00 AM", close: "2:00 PM" },
];

/** Minimal approved baker record for demo seller signup (no backend yet) */
export function buildSignupSeller(name: string, sellerIndex: number): Omit<Seller, "id"> {
  const pickupLocation = "Update your pickup address in the dashboard";
  return {
    name,
    slug: slugify(name) || `bakery-${sellerIndex}`,
    tagline: "Neighborhood bakery",
    bio: `${name} is on RouteFarm. Add bakery products, freshness labels, and pickup hours in your dashboard.`,
    sellerType: "Baker",
    avatar: sellerAvatar(sellerIndex),
    coverPhoto: sellerCover("bakery"),
    gardenPhotos: [],
    flowerPhotos: [],
    greenhousePhotos: [],
    videos: [],
    city: "Norridge",
    neighborhood: "Norridge",
    address: pickupLocation,
    lat: 41.9654 + (sellerIndex % 5) * 0.004,
    lng: -87.8078 - (sellerIndex % 5) * 0.004,
    rating: 5,
    reviewCount: 0,
    memberSince: new Date().toISOString().slice(0, 10),
    verified: false,
    badges: ["new_grower"],
    featured: false,
    approvalStatus: "approved",
    pickupLocation,
    pickupHours: defaultPickupHours,
    availabilityStatus: "available_today",
    weekdayPickup: { open: "5:00 PM", close: "8:00 PM" },
    weekendPickup: { open: "8:00 AM", close: "2:00 PM" },
    specialties: ["Bread"],
    requiresCompliance: false,
  };
}
