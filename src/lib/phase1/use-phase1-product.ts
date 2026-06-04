"use client";

import { useEffect, useState } from "react";
import { createClient } from "@routefarm/supabase/browser";
import { getProductById } from "@routefarm/database";
import type { Product as DbProduct, Seller as DbSeller } from "@routefarm/shared";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

export function usePhase1Product(productId: string) {
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [seller, setSeller] = useState<DbSeller | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPhase1SupabaseEnabled()) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const supabase = createClient();
        const row = await getProductById(supabase, productId);
        if (cancelled) return;
        if (row) {
          setProduct(row.product);
          setSeller(row.seller);
        } else {
          setProduct(null);
          setSeller(null);
        }
      } catch {
        if (!cancelled) {
          setProduct(null);
          setSeller(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return {
    product,
    seller,
    loading,
    enabled: isPhase1SupabaseEnabled(),
  };
}
