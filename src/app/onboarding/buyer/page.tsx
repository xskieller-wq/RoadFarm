"use client";



import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@routefarm/supabase/browser";

import { BAKERY_CATEGORIES } from "@routefarm/shared";

import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

import FreshDropPageShell, {

  FreshDropPageHeader,

  FreshDropPanel,

} from "@/components/layout/FreshDropPageShell";



export default function BuyerOnboardingPage() {

  const router = useRouter();

  const [neighborhood, setNeighborhood] = useState("");

  const [categories, setCategories] = useState<string[]>([...BAKERY_CATEGORIES]);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  const toggleCategory = (cat: string) => {

    setCategories((prev) =>

      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]

    );

  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!neighborhood.trim()) {

      setError("Enter your neighborhood so we can show nearby bakery.");

      return;

    }



    if (!isPhase1SupabaseEnabled()) {

      router.push("/buy");

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



      await supabase.from("buyer_profiles").upsert({

        user_id: user.id,

        neighborhood: neighborhood.trim(),

        preferred_categories: categories,

      });



      await supabase

        .from("profiles")

        .update({ buyer_onboarding_completed_at: new Date().toISOString() })

        .eq("id", user.id);



      router.push("/buy");

    } catch (err) {

      setError(err instanceof Error ? err.message : "Could not save onboarding.");

    } finally {

      setLoading(false);

    }

  };



  return (

    <FreshDropPageShell width="narrow">

      <FreshDropPageHeader

        eyebrow="Buyer setup"

        title="Where should we find bakery for you?"

        description="FreshDrop is a local bakery marketplace. Tell us your area and what you want to discover first."

      />



      <form onSubmit={handleSubmit}>

        <FreshDropPanel className="space-y-6">

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}



          <div>

            <label className="mb-1.5 block text-sm font-medium text-warm-700">Neighborhood</label>

            <input

              className="input-field"

              placeholder="e.g. Norridge"

              value={neighborhood}

              onChange={(e) => setNeighborhood(e.target.value)}

              required

            />

          </div>



          <div>

            <p className="mb-2 text-sm font-medium text-warm-700">Bakery you care about</p>

            <div className="flex flex-wrap gap-2">

              {BAKERY_CATEGORIES.map((cat) => (

                <button

                  key={cat}

                  type="button"

                  onClick={() => toggleCategory(cat)}

                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${

                    categories.includes(cat)

                      ? "bg-warm-900 text-amber-50 ring-warm-900"

                      : "bg-white text-warm-700 ring-warm-200 hover:ring-warm-300"

                  }`}

                >

                  {cat}

                </button>

              ))}

            </div>

          </div>



          <button type="submit" className="btn-reserve w-full" disabled={loading}>

            {loading ? "Saving…" : "Start exploring"}

          </button>

        </FreshDropPanel>

      </form>

    </FreshDropPageShell>

  );

}


