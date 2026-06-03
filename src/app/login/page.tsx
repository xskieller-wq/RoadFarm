"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flower2 } from "lucide-react";
import { useAuth } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    login(email, password);
    if (email.includes("admin")) {
      router.push("/admin");
    } else if (email.includes("seller")) {
      router.push("/dashboard");
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-market-gradient shadow-md">
          <Flower2 className="h-6 w-6 text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-earth-900">Welcome back</h1>
        <p className="mt-1 text-earth-600">Log in to your RouteFarm account</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-earth-700">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-earth-700">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full">Log in</button>
      </form>

      <p className="mt-4 text-center text-sm text-earth-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
          Sign up
        </Link>
      </p>

      <div className="mt-6 rounded-lg bg-earth-50 p-4 text-center text-xs text-earth-500">
        <p className="font-medium text-earth-700">Demo accounts (any password)</p>
        <p className="mt-1">Buyer: you@example.com</p>
        <p>
          Seller dashboard: <strong className="text-earth-700">seller@routefarm.com</strong>
        </p>
        <p>Admin: admin@routefarm.com</p>
      </div>
    </div>
  );
}
