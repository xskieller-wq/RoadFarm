"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Clock, Package } from "lucide-react";

const demoLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profile", label: "Profile & media", icon: User },
  { href: "/dashboard/availability", label: "Availability", icon: Clock },
  { href: "/dashboard/products", label: "Products", icon: Package },
];

const supabaseLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/templates", label: "Templates", icon: Package },
];

export default function DashboardNav({ supabaseMode = false }: { supabaseMode?: boolean }) {
  const links = supabaseMode ? supabaseLinks : demoLinks;
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-warm-200 pb-4">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-brand-600 text-white shadow-md"
                : "bg-warm-100 text-warm-700 hover:bg-warm-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
