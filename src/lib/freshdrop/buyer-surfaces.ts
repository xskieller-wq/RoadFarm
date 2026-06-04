/** Buyer-facing FreshDrop routes — homepage-style chrome and footer. */

/** Strip trailing slashes so `/browse/` matches `/browse`. */
export function normalizeBuyerPathname(pathname: string | null): string {
  if (!pathname) return "";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

const BUYER_EXACT = new Set([
  "/",
  "/browse",
  "/buy",
  "/alerts",
  "/account",
  "/following",
]);

export function isFreshDropBuyerSurface(pathname: string | null): boolean {
  const path = normalizeBuyerPathname(pathname);
  if (!path) return false;
  if (BUYER_EXACT.has(path)) return true;
  if (path.startsWith("/buy/")) return true;
  return false;
}

/** Parallax bakery backdrop + header overlay treatment (home + full browse). */
export function isFreshDropLaunchSurface(pathname: string | null): boolean {
  const path = normalizeBuyerPathname(pathname);
  return path === "/" || path === "/browse";
}
