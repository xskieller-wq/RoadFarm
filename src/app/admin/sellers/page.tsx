"use client";

import Link from "next/link";
import Image from "next/image";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Check, X, Star, Shield } from "lucide-react";
import SellerBadges from "@/components/sellers/SellerBadges";

export default function AdminSellersPage() {
  const { sellers, approveSeller, rejectSeller, toggleFeatured, toggleVerified } = useMarketplace();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Sellers</h1>
          <p className="text-sm text-warm-600">Approve, verify, feature, and manage grower profiles</p>
        </div>
        <Link href="/admin/sellers/new" className="btn-primary">Add seller</Link>
      </div>

      <div className="mt-6 space-y-4">
        {sellers.map((seller) => (
          <div key={seller.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
              <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/sellers/${seller.id}`} className="font-semibold text-warm-900 hover:underline">
                  {seller.name}
                </Link>
                {seller.verified && <Shield className="h-4 w-4 text-lavender-500" />}
                {seller.featured && (
                  <span className="badge bg-sunflower-100 text-sunflower-800">Featured</span>
                )}
                <span className={`badge ${
                  seller.approvalStatus === "approved" ? "bg-sage-100 text-sage-800" :
                  seller.approvalStatus === "pending" ? "bg-sunflower-100 text-sunflower-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {seller.approvalStatus}
                </span>
              </div>
              <p className="text-sm text-warm-600">{seller.city} · {seller.rating}★ ({seller.reviewCount} reviews)</p>
              <SellerBadges badges={seller.badges} limit={4} className="mt-1" />
            </div>
            <div className="flex flex-wrap gap-2">
              {seller.approvalStatus === "pending" && (
                <>
                  <button onClick={() => approveSeller(seller.id)} className="btn-primary text-xs">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={() => rejectSeller(seller.id)} className="btn-secondary text-xs">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              )}
              <button onClick={() => toggleFeatured(seller.id)} className="btn-secondary text-xs">
                <Star className="h-3.5 w-3.5" /> {seller.featured ? "Unfeature" : "Feature"}
              </button>
              <button onClick={() => toggleVerified(seller.id)} className="btn-secondary text-xs">
                <Shield className="h-3.5 w-3.5" /> {seller.verified ? "Unverify" : "Verify"}
              </button>
              <Link href={`/admin/sellers/${seller.id}`} className="btn-ghost text-xs">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
