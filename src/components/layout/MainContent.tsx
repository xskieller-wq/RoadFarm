"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  isFreshDropLaunchSurface,
  normalizeBuyerPathname,
} from "@/lib/freshdrop/buyer-surfaces";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = normalizeBuyerPathname(usePathname());
  const isLaunch = isFreshDropLaunchSurface(pathname);

  return (
    <main className={cn("flex-1", !isLaunch && "pt-16", isLaunch && "bg-transparent")}>
      {children}
    </main>
  );
}
