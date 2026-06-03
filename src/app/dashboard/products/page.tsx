"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import { formatPrice, getCategoryColor, getFreshnessColor } from "@/lib/utils";
import { getProductFreshnessLabel } from "@/lib/freshness";

export default function SellerProductsPage() {
  const { seller, products, deleteProduct, updateProduct } = useSellerDashboard();

  if (!seller) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-warm-900">Your products</h2>
          <p className="mt-1 text-sm text-warm-600">
            Each product has its own freshness label. Changes appear on the map and search immediately.
          </p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-warm-600">No active products. Add your first listing.</p>
          <Link href="/dashboard/products/new" className="btn-primary mt-4">
            Add product
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const freshness = getProductFreshnessLabel(product);
            return (
              <div key={product.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-warm-100">
                  {product.photos[0] && (
                    <Image src={product.photos[0].url} alt="" fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-warm-900">{product.title}</p>
                  <p className="text-sm text-warm-600">
                    {formatPrice(product.price)} · Qty {product.quantityAvailable}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`badge ${getCategoryColor(product.category)}`}>{product.category}</span>
                    <span className={`badge ${getFreshnessColor(freshness)}`}>{freshness}</span>
                    {product.videos.length > 0 && (
                      <span className="badge bg-lavender-100 text-lavender-800">Video</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="btn-secondary text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => updateProduct(product.id, { sold: true })}
                    className="btn-ghost text-sm"
                  >
                    Mark sold
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="btn-ghost text-sm text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
