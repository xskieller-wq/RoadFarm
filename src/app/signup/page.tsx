"use client";



import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { useAuth } from "@/context/AppContext";

import { useMarketplace } from "@/context/MarketplaceContext";

import { buildSignupSeller } from "@/lib/signup-seller";

import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

import { signUpWithEmail } from "@/lib/phase1/auth-actions";

import FreshDropAuthLayout from "@/components/auth/FreshDropAuthLayout";



export default function SignupPage() {

  const router = useRouter();

  const { signup } = useAuth();

  const { addSeller, sellers, hydrated } = useMarketplace();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const [error, setError] = useState("");



  const sellerSignupReady = role !== "seller" || hydrated;



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");



    if (!sellerSignupReady) {

      setError("Marketplace data is still loading. Try again in a moment.");

      return;

    }



    if (isPhase1SupabaseEnabled()) {

      const result = await signUpWithEmail(email, password, name, role);

      if (result.error) {

        setError(result.error);

        return;

      }

      router.push(result.redirect ?? "/");

      return;

    }

    let sellerId: string | undefined;

    if (role === "seller") {

      sellerId = addSeller(buildSignupSeller(name.trim() || "My Bakery", sellers.length));

    }

    signup(name, email, password, role, sellerId);

    if (role === "seller") {

      router.push("/dashboard");

    } else {

      router.push("/buy");

    }

  };



  return (

    <FreshDropAuthLayout

      title="Join FreshDrop"

      description="Catch fresh bakery drops near you — or list your neighborhood bakery."

      footer={

        <p className="text-center text-sm text-warm-600">

          Already have an account?{" "}

          <Link href="/login" className="font-semibold text-brand-800 hover:text-brand-900">

            Log in

          </Link>

        </p>

      }

    >

      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (

          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>

        )}

        <div>

          <label className="mb-1.5 block text-sm font-medium text-warm-700">Full name</label>

          <input

            type="text"

            className="input-field"

            placeholder="Jane Smith"

            value={name}

            onChange={(e) => setName(e.target.value)}

            required

          />

        </div>

        <div>

          <label className="mb-1.5 block text-sm font-medium text-warm-700">Email</label>

          <input

            type="email"

            className="input-field"

            placeholder="you@example.com"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

            required

          />

        </div>

        <div>

          <label className="mb-1.5 block text-sm font-medium text-warm-700">Password</label>

          <input

            type="password"

            className="input-field"

            placeholder="••••••••"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            required

          />

        </div>



        <div>

          <label className="mb-2 block text-sm font-medium text-warm-700">I want to</label>

          <div className="grid grid-cols-2 gap-3">

            <button

              type="button"

              onClick={() => setRole("buyer")}

              className={`rounded-xl border-2 p-3 text-sm font-semibold transition-colors ${

                role === "buyer"

                  ? "border-warm-800 bg-warm-50 text-warm-900"

                  : "border-warm-200 bg-white text-warm-600 hover:border-warm-300"

              }`}

            >

              Buy bakery

            </button>

            <button

              type="button"

              onClick={() => setRole("seller")}

              className={`rounded-xl border-2 p-3 text-sm font-semibold transition-colors ${

                role === "seller"

                  ? "border-warm-800 bg-warm-50 text-warm-900"

                  : "border-warm-200 bg-white text-warm-600 hover:border-warm-300"

              }`}

            >

              Sell bakery

            </button>

          </div>

        </div>



        <button type="submit" className="btn-reserve w-full" disabled={!sellerSignupReady}>

          {sellerSignupReady ? "Create account" : "Loading marketplace…"}

        </button>

      </form>

    </FreshDropAuthLayout>

  );

}


