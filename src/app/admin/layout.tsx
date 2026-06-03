"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AppContext";
import {
  LayoutDashboard,
  Users,
  Package,
  MessageSquare,
  Flag,
  Flower2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/sellers", label: "Sellers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/reports", label: "Reports", icon: Flag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-warm-900">Admin access required</h1>
        <p className="mt-2 text-warm-600">
          Log in with an admin email (e.g. <code className="text-sm">admin@routefarm.com</code>) to access the dashboard.
        </p>
        <Link href="/login" className="btn-primary mt-6 inline-flex">Log in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="mb-6 flex items-center gap-2">
            <Flower2 className="h-5 w-5 text-brand-600" />
            <span className="font-bold text-warm-900">Admin</span>
          </div>
          <nav className="space-y-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === href || (href !== "/admin" && pathname.startsWith(href))
                    ? "bg-brand-50 text-brand-800"
                    : "text-warm-600 hover:bg-warm-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
