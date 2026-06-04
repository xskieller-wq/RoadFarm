"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export default function FreshBatchAlerts() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="border-t border-amber-200/40 bg-amber-50/50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 className="text-lg font-bold text-warm-950">When should we nudge you?</h2>
        <p className="mt-1 text-sm text-warm-600">
          Good alert: &ldquo;Harbor Street just dropped paczki.&rdquo; Bad alert: &ldquo;New items
          available.&rdquo;
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Morning drops", "After work", "Saturday pastries"].map((label) => (
            <span
              key={label}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-warm-800 ring-1 ring-warm-200"
            >
              {label}
            </span>
          ))}
        </div>

        {submitted ? (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
            You&apos;re set. We&apos;ll only ping you when a followed baker drops.
          </p>
        ) : (
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSubmitted(true);
            }}
          >
            <label className="sr-only" htmlFor="alert-email">
              Email
            </label>
            <input
              id="alert-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field min-w-0 flex-1 bg-white"
            />
            <button type="submit" className="btn-primary inline-flex shrink-0 items-center justify-center gap-2">
              <Bell className="h-4 w-4" aria-hidden />
              Turn on alerts
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
