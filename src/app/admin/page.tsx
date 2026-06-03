"use client";

import Link from "next/link";
import { useMarketplace } from "@/context/MarketplaceContext";

export default function AdminOverviewPage() {
  const { sellers, products, reviews, reports } = useMarketplace();

  const pending = sellers.filter((s) => s.approvalStatus === "pending").length;
  const openReports = reports.filter((r) => r.status === "open").length;

  const stats = [
    { label: "Total sellers", value: sellers.length, href: "/admin/sellers" },
    { label: "Pending approval", value: pending, href: "/admin/sellers?status=pending" },
    { label: "Active products", value: products.filter((p) => !p.sold).length, href: "/admin/products" },
    { label: "Reviews", value: reviews.length, href: "/admin/reviews" },
    { label: "Open reports", value: openReports, href: "/admin/reports" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-warm-900">Admin overview</h1>
      <p className="mt-1 text-warm-600">
        Manage sellers, products, badges, featured profiles, reviews, and reports. Photos &amp; videos are edited per seller profile.
      </p>
      <p className="mt-2 text-xs text-warm-500">
        Admin URL: <code className="rounded bg-warm-100 px-1">/admin</code> · Log in with{" "}
        <code className="rounded bg-warm-100 px-1">admin@routefarm.com</code>
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition-shadow hover:shadow-md">
            <p className="text-sm text-warm-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-warm-900">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 card p-6">
        <h2 className="font-bold text-warm-900">Quick start</h2>
        <ul className="mt-3 space-y-2 text-sm text-warm-700">
          <li>1. Review and approve pending seller applications</li>
          <li>2. Assign badges and feature top growers on the homepage</li>
          <li>3. Upload photos and verify seller profiles manually</li>
          <li>4. Manage products and moderate reviews before public launch</li>
        </ul>
        <Link href="/admin/sellers/new" className="btn-primary mt-4 inline-flex">
          Add seller manually
        </Link>
      </div>
    </div>
  );
}
