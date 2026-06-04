"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@routefarm/supabase/browser";
import { BAKERY_CATEGORIES, DEFAULT_MAP_CENTER } from "@routefarm/shared";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [city, setCity] = useState("Norridge");
  const [address, setAddress] = useState("");
  const [templateCategory, setTemplateCategory] = useState<string>(BAKERY_CATEGORIES[0]);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templatePrice, setTemplatePrice] = useState("10");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!isPhase1SupabaseEnabled()) {
      router.push("/dashboard");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: existing } = await supabase
        .from("sellers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setStep(2);
        return;
      }

      const slug = `${slugify(name)}-${user.id.slice(0, 6)}`;
      const { data: seller, error: sellerErr } = await supabase
        .from("sellers")
        .insert({
          user_id: user.id,
          slug,
          name: name.trim(),
          tagline: tagline.trim() || null,
          seller_type: "Baker",
          city,
          address: address.trim() || null,
          lat: DEFAULT_MAP_CENTER.lat,
          lng: DEFAULT_MAP_CENTER.lng,
          specialties: ["Bread", "Pastries"],
        })
        .select("id")
        .single();

      if (sellerErr) throw sellerErr;
      await supabase.from("seller_onboarding_steps").insert({ seller_id: seller.id });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create seller profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateTitle.trim()) {
      setError("Add a template title (e.g. Country Sourdough Loaf).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: seller } = await supabase
        .from("sellers")
        .select("id")
        .eq("user_id", user.id)
        .single();
      if (!seller) throw new Error("Seller profile missing");

      const priceCents = Math.round(parseFloat(templatePrice) * 100) || 1000;
      const { data: template, error: tErr } = await supabase
        .from("product_templates")
        .insert({
          seller_id: seller.id,
          category: templateCategory,
          title: templateTitle.trim(),
          default_price_cents: priceCents,
          default_freshness_label: "Made Today",
          default_quantity: 12,
        })
        .select("id")
        .single();
      if (tErr) throw tErr;

      await supabase.from("products").insert({
        seller_id: seller.id,
        template_id: template.id,
        title: templateTitle.trim(),
        category: templateCategory,
        price_cents: priceCents,
        quantity_available: 12,
        freshness_label: "Made Today",
      });

      await supabase
        .from("seller_onboarding_steps")
        .update({ first_template: true, business_info: true, location_set: true })
        .eq("seller_id", seller.id);

      await supabase
        .from("profiles")
        .update({ seller_onboarding_completed_at: new Date().toISOString() })
        .eq("id", user.id);

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <p className="section-label text-brand-600">Seller onboarding</p>
      <h1 className="mt-2 text-2xl font-bold text-warm-900">
        {step === 1 ? "Set up your bakery profile" : "Create your first product template"}
      </h1>

      {step === 1 ? (
        <form onSubmit={handleProfile} className="card mt-8 space-y-4 p-6">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Bakery name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Tagline</label>
            <input
              className="input-field"
              placeholder="Polish paczki & morning bread"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">City</label>
            <input className="input-field" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Pickup address</label>
            <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleTemplate} className="card mt-8 space-y-4 p-6">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Category</label>
            <select
              className="input-field"
              value={templateCategory}
              onChange={(e) => setTemplateCategory(e.target.value)}
            >
              {BAKERY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Template title</label>
            <input
              className="input-field"
              placeholder="Country Sourdough Loaf"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Default price ($)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              className="input-field"
              value={templatePrice}
              onChange={(e) => setTemplatePrice(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating…" : "Finish & go to dashboard"}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-warm-500">
        <Link href="/dashboard" className="text-brand-600 hover:underline">
          Skip to dashboard (demo mode)
        </Link>
      </p>
    </div>
  );
}
