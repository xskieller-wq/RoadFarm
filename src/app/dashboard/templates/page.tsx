"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@routefarm/supabase/browser";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";
import { formatPrice } from "@/lib/utils";
import type { ProductTemplate } from "@routefarm/shared";

export default function ProductTemplatesPage() {
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPhase1SupabaseEnabled()) {
      setLoading(false);
      return;
    }
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: seller } = await supabase
        .from("sellers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!seller) return;
      const { data } = await supabase
        .from("product_templates")
        .select("*")
        .eq("seller_id", seller.id)
        .order("category");
      setTemplates((data ?? []) as ProductTemplate[]);
      setLoading(false);
    })();
  }, []);

  return (
    <DashboardShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-warm-900">Product templates</h1>
        <p className="mt-1 text-sm text-warm-600">
          Reusable listing blueprints — create products faster with consistent freshness defaults.
        </p>

        {!isPhase1SupabaseEnabled() && (
          <p className="mt-4 rounded-lg bg-sunflower-50 p-4 text-sm text-warm-700">
            Enable <code className="text-xs">NEXT_PUBLIC_USE_SUPABASE=true</code> to sync templates with
            Postgres.
          </p>
        )}

        {loading ? (
          <p className="mt-6 text-warm-500">Loading templates…</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {templates.map((t) => (
              <li key={t.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-warm-900">{t.title}</p>
                  <p className="text-sm text-warm-500">
                    {t.category} · {formatPrice(t.default_price_cents / 100)}
                  </p>
                </div>
                <span className="badge bg-sage-100 text-sage-700">{t.default_freshness_label}</span>
              </li>
            ))}
            {templates.length === 0 && (
              <li className="text-sm text-warm-500">No templates yet. Complete seller onboarding.</li>
            )}
          </ul>
        )}

        <Link href="/onboarding/seller" className="btn-secondary mt-6 inline-flex">
          Add template via onboarding
        </Link>
      </div>
    </DashboardShell>
  );
}
