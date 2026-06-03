import Link from "next/link";
import { MapPin, Map } from "lucide-react";
import RouteSearchForm from "@/components/search/RouteSearchForm";
import { POPULAR_ROUTES } from "@/lib/route-search";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <MapPin className="mx-auto h-10 w-10 text-lavender-500" />
        <p className="section-label mt-4 text-warm-500">Optional convenience</p>
        <h1 className="mt-2 text-3xl font-bold text-warm-900">Find pickups along your route</h1>
        <p className="mt-2 text-warm-600">
          Already know where you&apos;re driving? See which local sellers and products
          are a quick stop along the way.
        </p>
        <Link href="/explore" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
          <Map className="h-4 w-4" />
          Or explore the neighborhood map first
        </Link>
      </div>

      <div className="card mt-8 p-6 shadow-md">
        <RouteSearchForm />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-warm-700">Popular commutes</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {POPULAR_ROUTES.map((route) => (
            <a
              key={route.label}
              href={`/results?start=${encodeURIComponent(route.start)}&destination=${encodeURIComponent(route.destination)}&maxDetour=5`}
              className="card p-4 transition-shadow hover:shadow-md"
            >
              <p className="font-medium text-warm-900">{route.label}</p>
              <p className="mt-1 text-sm text-warm-500">
                {route.start} → {route.destination}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
