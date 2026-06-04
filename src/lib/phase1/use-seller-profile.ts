"use client";

import { useEffect, useState } from "react";
import { createClient } from "@routefarm/supabase/browser";
import { getSellerBySlugOrId, getProductsBySellerId } from "@routefarm/database";
import type { Product as DbProduct, Seller as DbSeller } from "@routefarm/shared";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

export function useSellerProfile(slugOrId: string) {
  const [seller, setSeller] = useState<DbSeller | null>(null);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPhase1SupabaseEnabled()) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const supabase = createClient();
        const row = await getSellerBySlugOrId(supabase, slugOrId);
        if (cancelled) return;
        if (!row) {
          setSeller(null);
          setProducts([]);
          return;
        }
        setSeller(row);
        const prods = await getProductsBySellerId(supabase, row.id);
        if (!cancelled) setProducts(prods);
      } catch {
        if (!cancelled) {
          setSeller(null);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slugOrId]);

  return {
    seller,
    products,
    loading,
    enabled: isPhase1SupabaseEnabled(),
  };
}
