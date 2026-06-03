"use client";

import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "@/context/AppContext";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import DashboardNav from "./DashboardNav";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { seller, hydrated } = useSellerDashboard();

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

  if (!seller) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-warm-900">Seller profile not found</h1>
        <p className="mt-2 text-warm-600">
          Your account is not linked to a seller record. Sign up again as a seller, or use the demo
          bakery account.
        </p>
        <p className="mt-2 text-sm text-warm-500">
          Demo bakery: <strong>seller@routefarm.com</strong> (any password)
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/signup" className="btn-primary">
            Sign up as seller
          </Link>
          <Link href="/login" className="btn-secondary">
            Log in
          </Link>
        </div>
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
          <button type="button" onClick={logout} className="btn-ghost text-sm">
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
