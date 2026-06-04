import Link from "next/link";
import { ShoppingBag, Store, Map, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    href: "/#fresh-drops",
    label: "Today",
    description: "Live drops to compare",
    icon: ShoppingBag,
    accent: "bg-sage-500/25 text-sage-100 ring-sage-400/40",
    accentLight: "bg-sage-100 text-sage-800 ring-sage-200",
  },
  {
    href: "/sell",
    label: "Post drop",
    description: "For neighborhood bakers",
    icon: Store,
    accent: "bg-sunflower-500/25 text-sunflower-100 ring-sunflower-400/40",
    accentLight: "bg-sunflower-100 text-sunflower-900 ring-sunflower-200",
  },
  {
    href: "/explore",
    label: "Explore Map",
    description: "Bakers near you",
    icon: Map,
    accent: "bg-brand-500/25 text-brand-100 ring-brand-400/40",
    accentLight: "bg-brand-50 text-brand-800 ring-brand-200",
  },
  {
    href: "/search",
    label: "On your way",
    description: "Pickup on your commute",
    icon: Route,
    accent: "bg-lavender-500/25 text-lavender-100 ring-lavender-400/40",
    accentLight: "bg-lavender-100 text-lavender-800 ring-lavender-200",
  },
] as const;

export default function CoreActionNav({ onDark = false }: { onDark?: boolean }) {
  return (
    <nav className="mt-5" aria-label="Main actions">
      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4",
          onDark &&
            "rounded-2xl border border-white/20 bg-warm-950/70 p-2.5 shadow-lg backdrop-blur-md sm:p-3"
        )}
      >
        {ACTIONS.map(({ href, label, description, icon: Icon, accent, accentLight }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-2.5 rounded-xl border p-2.5 shadow-sm transition-all hover:-translate-y-px hover:shadow-md sm:p-3",
              onDark
                ? "border-white/15 bg-warm-950/60 text-white hover:border-white/30 hover:bg-warm-950/75"
                : "border-warm-200/80 bg-white/95 text-warm-900 backdrop-blur-sm hover:border-brand-300"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
                onDark ? accent : accentLight
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">{label}</p>
              <p
                className={cn(
                  "mt-0.5 hidden truncate text-[11px] leading-snug sm:block",
                  onDark ? "text-white/80" : "text-warm-500"
                )}
              >
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
