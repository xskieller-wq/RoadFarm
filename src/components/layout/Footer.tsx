import Link from "next/link";
import { Sprout } from "lucide-react";
import { ROUTEFARM_AREAS } from "@/data/routefarm-structure";

export default function Footer() {
  const buy = ROUTEFARM_AREAS.buyers;
  const sell = ROUTEFARM_AREAS.sellers;
  const grow = ROUTEFARM_AREAS.growMore;

  return (
    <footer className="border-t border-sage-200 bg-sage-50/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-market-gradient">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-warm-900">
                Route<span className="text-brand-600">Farm</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-warm-600">
              Google Maps + Etsy + Airbnb + freshness — discover local people, fresh products,
              and convenient pickup near you.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-900">{buy.label}</h3>
            <ul className="mt-3 space-y-2 text-sm text-warm-600">
              <li><Link href={buy.href} className="font-medium hover:text-brand-600">{buy.cta}</Link></li>
              <li><Link href="/explore" className="hover:text-brand-600">Explore map</Link></li>
              <li><Link href="/search" className="hover:text-brand-600">Along my route</Link></li>
              <li><Link href="/sellers" className="hover:text-brand-600">Seller profiles</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-900">{sell.label}</h3>
            <ul className="mt-3 space-y-2 text-sm text-warm-600">
              <li><Link href={sell.href} className="font-medium hover:text-brand-600">{sell.cta}</Link></li>
              <li><Link href="/signup" className="hover:text-brand-600">Sign up</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600">Grower dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-900">More</h3>
            <ul className="mt-3 space-y-2 text-sm text-warm-600">
              <li>
                <Link href={grow.href} className="hover:text-sage-700">
                  {grow.label}
                  <span className="ml-1 text-xs text-warm-400">(coming)</span>
                </Link>
              </li>
              <li><Link href="/login" className="hover:text-brand-600">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-sage-200 pt-8 text-center text-sm text-warm-500">
          &copy; {new Date().getFullYear()} RouteFarm. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
