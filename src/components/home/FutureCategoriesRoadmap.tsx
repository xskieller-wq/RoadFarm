"use client";

import { useState } from "react";
import { saveEarlyAccessEmail } from "@/lib/early-access-persistence";
import { FUTURE_CATEGORY_ROADMAP } from "./home-data";

export default function FutureCategoriesRoadmap() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    saveEarlyAccessEmail(email);
    setSubmitted(true);
  };

  return (
    <section className="relative py-6 sm:py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/15 bg-warm-950/50 px-4 py-8 text-center shadow-xl backdrop-blur-lg sm:px-6 sm:py-10">
          <p className="section-label text-sage-200/90">Expanding marketplace</p>
          <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Future categories</h2>
          <p className="mt-3 text-white/70">
            Bakery is live. Additional freshness categories are planned.
          </p>

          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {FUTURE_CATEGORY_ROADMAP.map((item) => (
              <li
                key={item.label}
                className="rounded-full bg-white/12 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/20"
              >
                <span className="mr-1.5">{item.emoji}</span>
                {item.label}
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-10 max-w-md rounded-xl border border-white/15 bg-warm-950/40 p-6 text-left backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white">Get notified when new categories launch</h3>
            <p className="mt-1 text-sm text-white/70">
              Mushrooms, honey, eggs, flowers, and more — join free early access for launch updates.
            </p>

            {submitted ? (
              <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-amber-100">
                You&apos;re on the list. We&apos;ll email you when new categories go live (demo — stored on this
                device only).
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="input-field flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email for early access"
                />
                <button type="submit" className="btn-primary shrink-0 whitespace-nowrap">
                  Join Free Early Access
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
