import type { Reservation } from "@/lib/types";

const STORAGE_KEY = "routefarm-reservations-v1";

export function loadPersistedReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistReservations(reservations: Reservation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  } catch {
    /* storage full or private mode */
  }
}
