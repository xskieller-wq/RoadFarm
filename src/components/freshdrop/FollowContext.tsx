"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  DEMO_FOLLOW_IDS,
  loadFollowedSellerIds,
  persistFollowedSellerIds,
} from "@/lib/buyer/buyer-preferences";

type FollowContextValue = {
  following: Set<string>;
  toggleFollow: (sellerId: string) => void;
  isFollowing: (sellerId: string) => boolean;
  followCount: number;
  hydrated: boolean;
};

const FollowContext = createContext<FollowContextValue | null>(null);

export function FollowProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFollowedSellerIds();
    const initial = stored.length > 0 ? stored : DEMO_FOLLOW_IDS;
    setFollowing(new Set(initial));
    if (stored.length === 0) persistFollowedSellerIds(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistFollowedSellerIds([...following]);
  }, [following, hydrated]);

  const toggleFollow = useCallback((sellerId: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(sellerId)) next.delete(sellerId);
      else next.add(sellerId);
      return next;
    });
  }, []);

  const isFollowing = useCallback((sellerId: string) => following.has(sellerId), [following]);

  return (
    <FollowContext.Provider
      value={{ following, toggleFollow, isFollowing, followCount: following.size, hydrated }}
    >
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error("useFollow must be used within FollowProvider");
  return ctx;
}
