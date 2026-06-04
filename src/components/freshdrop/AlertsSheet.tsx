"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export default function AlertsSheet() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="alerts" className="scroll-mt-16 bg-warm-950 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-lg text-center">
        <Bell className="mx-auto h-8 w-8 text-amber-400" aria-hidden />
        {done ? (
          <p className="mt-3 text-lg font-bold text-white">You&apos;re in.</p>
        ) : (
          <>
            <p className="mt-3 text-lg font-bold text-white">Ping me when they drop</p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
            >
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 rounded-full border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-warm-950"
              >
                Go
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
