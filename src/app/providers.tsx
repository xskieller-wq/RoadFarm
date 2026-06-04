"use client";

import type { ReactNode } from "react";
import { AuthProvider, ReservationProvider } from "@/context/AppContext";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { FollowProvider } from "@/components/freshdrop/FollowContext";

/** Single client boundary for root layout providers (avoids fragmented layout chunks). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <ReservationProvider>
          <FollowProvider>{children}</FollowProvider>
        </ReservationProvider>
      </MarketplaceProvider>
    </AuthProvider>
  );
}
