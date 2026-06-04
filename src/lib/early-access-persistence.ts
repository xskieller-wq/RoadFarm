const STORAGE_KEY = "routefarm-early-access-v1";

export function saveEarlyAccessEmail(email: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadEarlyAccessEmails();
    const normalized = email.trim().toLowerCase();
    if (!normalized || existing.includes(normalized)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, normalized]));
  } catch {
    /* private mode / quota */
  }
}

export function loadEarlyAccessEmails(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
