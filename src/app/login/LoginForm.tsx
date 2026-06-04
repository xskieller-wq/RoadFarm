"use client";



import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";

import { useAuth } from "@/context/AppContext";

import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";

import { signInWithEmail } from "@/lib/phase1/auth-actions";

import FreshDropAuthLayout from "@/components/auth/FreshDropAuthLayout";

import { freshDropPagePanel } from "@/lib/freshdrop/buyer-page-styles";



export default function LoginForm() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next");

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!email || !password) {

      setError("Please enter email and password.");

      return;

    }

    if (isPhase1SupabaseEnabled()) {

      const result = await signInWithEmail(email, password);

      if (result.error) {

        setError(result.error);

        return;

      }

      const safeNext =

        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : null;

      router.push(result.redirect ?? safeNext ?? "/");

      return;

    }

    login(email, password);

    const safeNext =

      nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : null;

    if (safeNext) {

      router.push(safeNext);

    } else if (email.includes("admin")) {

      router.push("/admin");

    } else if (email.includes("seller")) {

      router.push("/dashboard");

    } else {

      router.push("/buy");

    }

  };



  return (

    <FreshDropAuthLayout

      title="Welcome back"

      description="Log in to reserve bakery drops and manage your morning ritual."

      footer={

        <>

          <p className="text-center text-sm text-warm-600">

            Don&apos;t have an account?{" "}

            <Link href="/signup" className="font-semibold text-brand-800 hover:text-brand-900">

              Sign up

            </Link>

          </p>

          <div className={`mt-4 ${freshDropPagePanel} p-4 text-center text-xs text-warm-600`}>

            <p className="font-semibold text-warm-800">Demo accounts (any password)</p>

            <p className="mt-1">Buyer: you@example.com</p>

            <p>

              Seller: <strong className="text-warm-800">seller@routefarm.com</strong>

            </p>

            <p>Admin: admin@routefarm.com</p>

          </div>

        </>

      }

    >

      <form onSubmit={handleSubmit} className="space-y-4">

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div>

          <label className="mb-1.5 block text-sm font-medium text-warm-700">Email</label>

          <input

            type="email"

            className="input-field"

            placeholder="you@example.com"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

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

          />

        </div>

        <button type="submit" className="btn-reserve w-full">

          Log in

        </button>

      </form>

    </FreshDropAuthLayout>

  );

}


