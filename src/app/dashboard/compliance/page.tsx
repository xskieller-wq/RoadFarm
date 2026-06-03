"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Shield, Upload, CheckCircle } from "lucide-react";
import { COMPLIANCE_CHECKBOX, ILLINOIS_COUNTIES } from "@/lib/types";

export default function CompliancePage() {
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-brand-600" />
        <h1 className="mt-4 text-2xl font-bold text-earth-900">Compliance complete</h1>
        <p className="mt-2 text-earth-600">
          You can now list pickled and fermented food products on RouteFarm.
        </p>
        <Link href="/dashboard/products/new" className="btn-primary mt-6">Add product</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="btn-ghost mb-6 inline-flex">
        <ChevronLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-earth-900">Seller compliance onboarding</h1>
          <p className="text-earth-600">Required for pickled and fermented food products</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-earth-700">ZIP code</label>
          <input type="text" className="input-field" placeholder="e.g. 60706" required pattern="[0-9]{5}" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-earth-700">County</label>
          <select className="input-field" required>
            <option value="">Select county</option>
            {ILLINOIS_COUNTIES.map((county) => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-earth-200 bg-earth-50 p-4">
          <h3 className="font-semibold text-earth-900">Local health department information</h3>
          <p className="mt-2 text-sm text-earth-600">
            Cook County Department of Public Health — Cottage Food Operations
          </p>
          <p className="mt-2 text-sm text-earth-600">
            Illinois Cottage Food Law allows certain non-potentially hazardous foods to be
            prepared in home kitchens and sold directly to consumers. Pickled and fermented
            products must comply with specific requirements.
          </p>
          <a href="#" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
            View Illinois Cottage Food requirements →
          </a>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-earth-700">Upload compliance documents</label>
          <button
            type="button"
            className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-earth-300 text-sm text-earth-500 hover:border-brand-400 hover:text-brand-600"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload food handler certificate or cottage food registration
          </button>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-earth-200 p-4">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-earth-300 text-brand-600 focus:ring-brand-500"
            required
          />
          <span className="text-sm text-earth-700">{COMPLIANCE_CHECKBOX}</span>
        </label>

        <button type="submit" disabled={!confirmed} className="btn-primary w-full">
          Complete compliance onboarding
        </button>
      </form>
    </div>
  );
}
