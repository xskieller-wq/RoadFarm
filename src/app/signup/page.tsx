"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flower2 } from "lucide-react";
import { useAuth } from "@/context/AppContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(name, email, password, role);
    if (role === "seller") {
      router.push("/dashboard");
    } else {
      router.push("/search");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-market-gradient shadow-md">
          <Flower2 className="h-6 w-6 text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-earth-900">Join RouteFarm</h1>
        <p className="mt-1 text-earth-600">Find or sell local products along daily routes</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-earth-700">Full name</label>
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
          <label className="mb-1.5 block text-sm font-medium text-earth-700">Email</label>
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
          <label className="mb-1.5 block text-sm font-medium text-earth-700">Password</label>
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
          <label className="mb-2 block text-sm font-medium text-earth-700">I want to</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                role === "buyer"
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-earth-200 text-earth-600 hover:border-earth-300"
              }`}
            >
              Find products
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                role === "seller"
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-earth-200 text-earth-600 hover:border-earth-300"
              }`}
            >
              Sell products
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">Create account</button>
      </form>

      <p className="mt-4 text-center text-sm text-earth-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
