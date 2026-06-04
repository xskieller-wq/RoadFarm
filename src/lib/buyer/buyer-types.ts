import type { ProductCategory } from "@/lib/types";

export type BuyerNotificationSettings = {
  morningDrops: boolean;
  batchAlerts: boolean;
  reservationReminders: boolean;
  followedBakerOnly: boolean;
  email: string;
};

export type AlertHistoryItem = {
  id: string;
  at: string;
  bakerName: string;
  message: string;
  type: "batch" | "reminder" | "reserved";
};

export type UpcomingBatchAlert = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerSlug: string;
  productId: string;
  productTitle: string;
  category: ProductCategory;
  batchTime: string;
  pickupWindow: string;
  imageUrl: string;
};

export type ScheduledBakerBatch = {
  sellerId: string;
  nextBatchLabel: string;
  nextProductTitle: string;
  pickupWindow: string;
};

export type PickupHistoryEntry = {
  id: string;
  productTitle: string;
  sellerName: string;
  pickedUpAt: string;
  status: "picked_up" | "confirmed";
};
