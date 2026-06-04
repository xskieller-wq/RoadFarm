import type { BuyerNotificationSettings, AlertHistoryItem } from "@/lib/buyer/buyer-types";

const FOLLOWS_KEY = "freshdrop-follows-v1";
const SAVED_KEY = "freshdrop-saved-products-v1";
const SETTINGS_KEY = "freshdrop-notification-settings-v1";
const HISTORY_KEY = "freshdrop-alert-history-v1";

export const DEFAULT_NOTIFICATION_SETTINGS: BuyerNotificationSettings = {
  morningDrops: true,
  batchAlerts: true,
  reservationReminders: true,
  followedBakerOnly: true,
  email: "",
};

export const DEMO_FOLLOW_IDS = ["s1", "s3", "s5"];

export function loadFollowedSellerIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FOLLOWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistFollowedSellerIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function loadSavedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedProductIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function loadNotificationSettings(): BuyerNotificationSettings {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...(JSON.parse(raw) as BuyerNotificationSettings) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function persistNotificationSettings(settings: BuyerNotificationSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

export function loadAlertHistory(): AlertHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AlertHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistAlertHistory(items: AlertHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 30)));
  } catch {
    /* ignore */
  }
}
