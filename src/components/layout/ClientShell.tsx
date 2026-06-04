"use client";

import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainContent from "@/components/layout/MainContent";

/** Header + main + footer in one client boundary (keeps root layout server-only). */
export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}
