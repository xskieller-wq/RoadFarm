"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Map, Users, MapPin, Sprout, User, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout, isSeller, isAdmin } = useAuth();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink = (href: string, label: string, icon: React.ReactNode) => (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        transparent ? "text-white/90 hover:bg-white/10 hover:text-white" : "btn-ghost",
        pathname === href && !transparent && "bg-warm-100 text-warm-900"
      )}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "border-transparent bg-transparent"
          : "border-b border-warm-200/80 bg-warm-50/95 shadow-sm backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-market-gradient shadow-md", transparent && "shadow-black/20")}>
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className={cn("text-xl font-bold", transparent ? "text-white" : "text-warm-900")}>
            Route<span className={transparent ? "text-blossom-300" : "text-brand-600"}>Farm</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLink("/buy", "Buy", <ShoppingBag className="h-4 w-4" />)}
          {navLink("/sell", "Sell", <Sprout className="h-4 w-4" />)}
          {navLink("/explore", "Map", <Map className="h-4 w-4" />)}
          {navLink("/search", "My Route", <MapPin className="h-4 w-4" />)}
          {isSeller && navLink("/dashboard", "Dashboard", <User className="h-4 w-4" />)}
          {isAdmin && navLink("/admin", "Admin", <User className="h-4 w-4" />)}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className={cn("text-sm", transparent ? "text-white/80" : "text-warm-600")}>
                Hi, {user.name.split(" ")[0]}
              </span>
              <button onClick={logout} className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors", transparent ? "text-white/90 hover:bg-white/10" : "btn-ghost")}>
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors", transparent ? "text-white/90 hover:bg-white/10 hover:text-white" : "btn-ghost")}>
                Log in
              </Link>
              <Link href="/signup" className={cn("inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all", transparent ? "bg-white text-brand-700 shadow-lg hover:bg-blossom-50" : "btn-primary")}>
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className={cn("rounded-lg p-2 md:hidden", transparent ? "text-white hover:bg-white/10" : "text-warm-700 hover:bg-warm-100")} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-warm-200 bg-warm-50 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link href="/buy" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}><ShoppingBag className="h-4 w-4" />I want to buy</Link>
            <Link href="/sell" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}><Sprout className="h-4 w-4" />I want to sell</Link>
            <Link href="/explore" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}><Map className="h-4 w-4" />Explore map</Link>
            <Link href="/search" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}><MapPin className="h-4 w-4" />Along my route</Link>
            {isSeller && <Link href="/dashboard" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
            {isAdmin && <Link href="/admin" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>Admin</Link>}
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-ghost justify-start"><LogOut className="h-4 w-4" />Log out</button>
            ) : (
              <>
                <Link href="/login" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>Log in</Link>
                <Link href="/signup" className="btn-primary" onClick={() => setMobileOpen(false)}>Sign up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
