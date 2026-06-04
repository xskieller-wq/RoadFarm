"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/buy", label: "Account", icon: User, exact: true },
  { href: "/buy/following", label: "Following", icon: Users, exact: false },
  { href: "/buy/alerts", label: "Alerts", icon: Bell, exact: false },
] as const;

export default function BuyerHubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto rounded-2xl border border-warm-200/55 bg-white/90 p-1 shadow-sm ring-1 ring-warm-100/70 backdrop-blur-sm scrollbar-hide"
      aria-label="Buyer account"
    >
      {TABS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-warm-900 text-amber-50 shadow-sm"
                : "text-warm-700 hover:bg-warm-50 hover:text-warm-900"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
