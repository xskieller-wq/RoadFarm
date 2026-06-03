"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className={cn("flex-1", pathname !== "/" && "pt-16")}>
      {children}
    </main>
  );
}
