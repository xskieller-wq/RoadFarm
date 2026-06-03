"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Package, MapPin, CheckCircle2 } from "lucide-react";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import { formatPrice, getFreshnessColor } from "@/lib/utils";
import { getProductFreshnessLabel } from "@/lib/freshness";
import {
  getAvailabilityLabel,
  isSellerAvailableNow,
  isSellerVisibleOnMap,
} from "@/lib/seller-availability";
import AvailableNowToggle from "@/components/dashboard/AvailableNowToggle";

export default function SellerDashboardOverviewPage() {
  const { seller, products, updateSeller } = useSellerDashboard();

  if (!seller) {
    return <p className="text-warm-600">Seller profile not found. Try logging in with seller@routefarm.com</p>;
  }

  return (
    <div className="space-y-8">
      <AvailableNowToggle
        seller={seller}
        onSave={(status) => updateSeller(seller.id, { availabilityStatus: status })}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-brand-600" />
            <div>
              <p className="text-2xl font-bold text-warm-900">{products.length}</p>
              <p className="text-sm text-warm-600">Active products</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-sunflower-600" />
            <div>
              <p className="text-lg font-bold text-warm-900">
                {isSellerVisibleOnMap(seller) ? "On map" : "Hidden"}
              </p>
              <p className="text-sm text-warm-600">{getAvailabilityLabel(seller.availabilityStatus)}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2
              className={`h-8 w-8 ${isSellerAvailableNow(seller) ? "text-sunflower-600" : "text-sage-500"}`}
            />
            <div>
              <p className="text-lg font-bold text-warm-900">
                {isSellerAvailableNow(seller) ? "Live now" : "Not live"}
              </p>
              <p className="text-sm text-warm-600">Available Now toggle</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/dashboard/profile", title: "Edit profile", desc: "Bio, photos, videos" },
          { href: "/dashboard/availability", title: "Availability", desc: "Hours & status" },
          { href: "/dashboard/products", title: "Manage products", desc: "Listings & freshness" },
          { href: "/dashboard/products/new", title: "Add product", desc: "New listing" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card p-4 transition-shadow hover:shadow-md"
          >
            <p className="font-semibold text-warm-900">{item.title}</p>
            <p className="mt-1 text-sm text-warm-600">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-warm-200 px-6 py-4">
          <h2 className="font-semibold text-warm-900">Recent products</h2>
          <Link href="/dashboard/products/new" className="btn-primary text-sm">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="p-6 text-sm text-warm-600">No products yet.</p>
        ) : (
          <ul className="divide-y divide-warm-100">
            {products.slice(0, 5).map((product) => {
              const freshness = getProductFreshnessLabel(product);
              return (
                <li key={product.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-warm-100">
                    {product.photos[0] && (
                      <Image src={product.photos[0].url} alt="" fill className="object-cover" sizes="48px" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-warm-900">{product.title}</p>
                    <p className="text-sm text-warm-600">
                      {formatPrice(product.price)} ·{" "}
                      <span className={`badge ${getFreshnessColor(freshness)}`}>{freshness}</span>
                    </p>
                  </div>
                  <Link href={`/dashboard/products/${product.id}`} className="text-sm font-medium text-brand-700">
                    Edit
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
