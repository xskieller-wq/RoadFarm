"use client";

import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AppContext";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import { usePhase1Session } from "@/lib/phase1/use-phase1-session";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";
import { logoutAll } from "@/lib/phase1/logout";
import DashboardNav from "./DashboardNav";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const phase1 = usePhase1Session();
  const { seller, hydrated } = useSellerDashboard();
  const supabaseMode = isPhase1SupabaseEnabled();

  const handleLogout = async () => {
    await logoutAll(logout);
    router.push("/");
  };

  if (supabaseMode) {
    if (phase1.loading) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-warm-600">
          Loading your dashboard…
        </div>
      );
    }

    if (!phase1.isAuthenticated) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-warm-900">Seller Dashboard</h1>
          <p className="mt-2 text-warm-600">Log in with your seller account to manage templates and listings.</p>
          <Link href="/login" className="btn-primary mt-6">
            Log in
          </Link>
        </div>
      );
    }

    if (!phase1.isSeller) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-warm-900">Seller access only</h1>
          <p className="mt-2 text-warm-600">This area is for bakery sellers. Switch accounts or sign up as a seller.</p>
          <Link href="/signup" className="btn-primary mt-6">
            Sign up as seller
          </Link>
        </div>
      );
    }

    if (!phase1.session?.seller) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-warm-900">Complete seller setup</h1>
          <p className="mt-2 text-warm-600">Finish onboarding to link your bakery profile.</p>
          <Link href="/onboarding/seller" className="btn-primary mt-6">
            Continue onboarding
          </Link>
        </div>
      );
    }

    const dbSeller = phase1.session.seller;

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sage-700">Grower dashboard</p>
            <h1 className="text-2xl font-bold text-warm-900">{dbSeller.name}</h1>
            <p className="text-sm text-warm-600">
              Live profile &amp; templates sync with Supabase. Product editing still uses demo dashboard until Phase 2.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/sellers/${dbSeller.slug}`} className="btn-secondary text-sm">
              <ExternalLink className="h-4 w-4" />
              View public profile
            </Link>
            <Link href="/explore" className="btn-ghost text-sm">
              Explore map
            </Link>
            <button type="button" onClick={handleLogout} className="btn-ghost text-sm">
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
        <DashboardNav supabaseMode />
        <div className="mt-8">{children}</div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-warm-600">
        Loading your dashboard…
      </div>
    );
  }

  if (!user || user.role !== "seller") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-warm-900">Seller Dashboard</h1>
        <p className="mt-2 text-warm-600">
          Log in as a seller to manage your profile, products, and availability.
        </p>
        <p className="mt-2 text-sm text-warm-500">
          Demo: log in with <strong>seller@routefarm.com</strong> (any password)
        </p>
        <Link href="/login" className="btn-primary mt-6">
          {user ? "Use a seller account" : "Log in"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sage-700">
            Grower dashboard
          </p>
          <h1 className="text-2xl font-bold text-warm-900">{seller?.name ?? user.name}</h1>
          <p className="text-sm text-warm-600">
            Changes save to the marketplace and update the map instantly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {seller && (
            <Link href={`/sellers/${seller.id}`} className="btn-secondary text-sm">
              <ExternalLink className="h-4 w-4" />
              View public profile
            </Link>
          )}
          <Link href="/explore" className="btn-ghost text-sm">
            View map
          </Link>
          <button type="button" onClick={handleLogout} className="btn-ghost text-sm">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>

      <div className="mt-6">
        <DashboardNav />
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
