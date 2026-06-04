import type { Profile } from "./types";
import { ONBOARDING_ROUTES } from "./constants";

export function needsBuyerOnboarding(profile: Pick<Profile, "role" | "buyer_onboarding_completed_at">): boolean {
  return profile.role === "buyer" && !profile.buyer_onboarding_completed_at;
}

export function needsSellerOnboarding(profile: Pick<Profile, "role" | "seller_onboarding_completed_at">): boolean {
  return profile.role === "seller" && !profile.seller_onboarding_completed_at;
}

export function postAuthRedirect(profile: Profile): string {
  if (profile.role === "admin") return "/admin";
  if (needsSellerOnboarding(profile)) return ONBOARDING_ROUTES.seller;
  if (needsBuyerOnboarding(profile)) return ONBOARDING_ROUTES.buyer;
  if (profile.role === "seller") return ONBOARDING_ROUTES.sellerDashboard;
  return ONBOARDING_ROUTES.feed;
}
