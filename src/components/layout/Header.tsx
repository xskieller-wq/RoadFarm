"use client";



import Link from "next/link";

import { useState, useEffect } from "react";

import { usePathname } from "next/navigation";

import { Menu, X, Map, Bell, Sunrise, User, LogOut, ShoppingBag } from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AppContext";

import { usePhase1Session } from "@/lib/phase1/use-phase1-session";

import { logoutAll } from "@/lib/phase1/logout";

import { cn } from "@/lib/utils";
import {
  isFreshDropLaunchSurface,
  normalizeBuyerPathname,
} from "@/lib/freshdrop/buyer-surfaces";



export default function Header() {

  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const pathname = normalizeBuyerPathname(usePathname());

  const { user, logout, isAdmin: demoAdmin } = useAuth();
  const phase1 = usePhase1Session();

  const signedIn = phase1.enabled ? phase1.isAuthenticated : !!user;
  const isAdmin = phase1.enabled ? phase1.isAdmin : demoAdmin;



  const handleLogout = async () => {

    await logoutAll(logout);

    router.push("/");

    setMobileOpen(false);

  };

  const isLaunch = isFreshDropLaunchSurface(pathname);

  const onLaunch = isLaunch && !scrolled && !mobileOpen;

  const launchOverlay = onLaunch;



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

        launchOverlay

          ? "text-white/95 hover:bg-white/15"

          : isLaunch

            ? "text-white/90 hover:bg-white/10"

            : "btn-ghost",

        pathname === href && !isLaunch && "bg-warm-100 text-warm-900"

      )}

    >

      {icon}

      {label}

    </Link>

  );



  const accountHref = signedIn ? "/buy" : "/login";



  return (

    <header

      className={cn(

        "fixed inset-x-0 top-0 z-50 transition-all duration-300",

        launchOverlay

          ? "border-transparent bg-gradient-to-b from-black/50 to-transparent"

          : isLaunch

            ? "border-transparent bg-warm-950/90 backdrop-blur-md"

            : "border-b border-warm-200/80 bg-warm-50/95 shadow-sm backdrop-blur-md"

      )}

    >

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        <Link href="/" className="flex items-center gap-2">

          <div

            className={cn(

              "flex h-9 w-9 items-center justify-center rounded-xl shadow-md",

              "bg-gradient-to-br from-amber-500 to-orange-600"

            )}

          >

            <Sunrise className="h-5 w-5 text-white" />

          </div>

          <span

            className={cn(

              "text-xl font-bold",

              launchOverlay ? "text-white" : isLaunch ? "text-white" : "text-warm-900"

            )}

          >

            Fresh<span className={launchOverlay || isLaunch ? "text-amber-300" : "text-amber-600"}>Drop</span>

          </span>

        </Link>



        <nav className="hidden items-center gap-1 md:flex">

          {navLink("/browse", "Browse", <ShoppingBag className="h-4 w-4" />)}

          {navLink("/explore", "Map", <Map className="h-4 w-4" />)}

          {navLink("/buy/alerts", "Alerts", <Bell className="h-4 w-4" />)}

          {navLink(accountHref, "Account", <User className="h-4 w-4" />)}

          {isAdmin && navLink("/admin", "Admin", <User className="h-4 w-4" />)}

        </nav>



        <div className="hidden items-center gap-2 md:flex">

          {signedIn ? (

            <button

              onClick={handleLogout}

              className={cn(

                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",

                isLaunch ? "text-white/90 hover:bg-white/10" : "btn-ghost"

              )}

            >

              <LogOut className="h-4 w-4" />

              Log out

            </button>

          ) : (

            <>

              <Link

                href="/signup"

                className={cn(

                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",

                  isLaunch

                    ? "bg-white text-warm-950 hover:bg-amber-50"

                    : "btn-reserve"

                )}

              >

                Sign up

              </Link>

            </>

          )}

        </div>



        <button

          className={cn(

            "rounded-lg p-2 md:hidden",

            isLaunch ? "text-white hover:bg-white/10" : "text-warm-700 hover:bg-warm-100"

          )}

          onClick={() => setMobileOpen(!mobileOpen)}

          aria-label="Toggle menu"

        >

          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}

        </button>

      </div>



      {mobileOpen && (

        <div className="border-t border-warm-200 bg-warm-50 px-4 py-4 md:hidden">

          <nav className="flex flex-col gap-2">

            <Link href="/browse" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>

              <ShoppingBag className="h-4 w-4" />

              Browse

            </Link>

            <Link href="/explore" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>

              <Map className="h-4 w-4" />

              Map

            </Link>

            <Link href="/buy/alerts" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>

              <Bell className="h-4 w-4" />

              Alerts

            </Link>

            <Link href={accountHref} className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>

              <User className="h-4 w-4" />

              Account

            </Link>

            {isAdmin && (

              <Link href="/admin" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>

                Admin

              </Link>

            )}

            {signedIn ? (

              <button onClick={handleLogout} className="btn-ghost justify-start">

                <LogOut className="h-4 w-4" />

                Log out

              </button>

            ) : (

              <Link href="/signup" className="btn-reserve justify-center" onClick={() => setMobileOpen(false)}>

                Sign up

              </Link>

            )}

          </nav>

        </div>

      )}

    </header>

  );

}

