"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Navigation, Clock } from "lucide-react";
import type { RouteSearchParams } from "@/lib/types";
import { DETOUR_OPTIONS } from "@/lib/types";
import { buildSearchQueryString } from "@/lib/route-search";

interface RouteSearchFormProps {
  defaultStart?: string;
  defaultDestination?: string;
  defaultMaxDetour?: number;
  compact?: boolean;
  variant?: "default" | "hero";
  /** When set, submit updates the explore map instead of navigating away */
  onRouteSearch?: (params: RouteSearchParams) => void;
  submitLabel?: string;
}

export default function RouteSearchForm({
  defaultStart = "",
  defaultDestination = "",
  defaultMaxDetour = 5,
  compact = false,
  variant = "default",
  onRouteSearch,
  submitLabel = "Find products along my route",
}: RouteSearchFormProps) {
  const router = useRouter();
  const [start, setStart] = useState(defaultStart);
  const [destination, setDestination] = useState(defaultDestination);
  const [maxDetour, setMaxDetour] = useState(defaultMaxDetour);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: RouteSearchParams = {
      start: start || "Norridge, IL",
      destination: destination || "Des Plaines, IL",
      maxDetour,
    };
    if (onRouteSearch) {
      onRouteSearch(params);
      return;
    }
    router.push(`/results?${buildSearchQueryString(params)}`);
  };

  const isHero = variant === "hero";
  const labelClass = isHero ? "text-white/90" : "text-warm-700";
  const inputClass = isHero
    ? "w-full rounded-xl border-0 bg-white/95 px-4 py-3 pl-10 text-sm text-warm-900 shadow-lg placeholder:text-warm-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sunflower-300"
    : "input-field pl-10";
  const detourActive = isHero
    ? "bg-sunflower-400 text-warm-900 shadow-md"
    : "bg-brand-600 text-white";
  const detourInactive = isHero
    ? "bg-white/20 text-white hover:bg-white/30"
    : "bg-warm-100 text-warm-700 hover:bg-warm-200";
  const submitClass = isHero
    ? "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:bg-brand-700 sm:w-auto"
    : "btn-primary w-full sm:w-auto";

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label htmlFor="start" className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
            Start location
          </label>
          <div className="relative">
            <MapPin className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isHero ? "text-earth-500" : "text-earth-400"}`} />
            <input
              id="start"
              type="text"
              className={inputClass}
              placeholder="e.g. Norridge, IL"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="destination" className={`mb-1.5 block text-sm font-medium ${labelClass}`}>
            Destination
          </label>
          <div className="relative">
            <Navigation className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isHero ? "text-earth-500" : "text-earth-400"}`} />
            <input
              id="destination"
              type="text"
              className={inputClass}
              placeholder="e.g. Des Plaines, IL"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={`mb-2 block text-sm font-medium ${labelClass}`}>
          <Clock className="mr-1 inline h-4 w-4" />
          Maximum detour
        </label>
        <div className="flex flex-wrap gap-2">
          {DETOUR_OPTIONS.map((minutes) => (
            <button
              key={minutes}
              type="button"
              onClick={() => setMaxDetour(minutes)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                maxDetour === minutes ? detourActive : detourInactive
              }`}
            >
              {minutes === 0 ? "0 min (on route)" : `${minutes} min`}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className={submitClass}>
        <MapPin className="h-4 w-4" />
        {submitLabel}
      </button>
    </form>
  );
}
