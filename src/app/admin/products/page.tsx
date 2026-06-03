"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { formatPrice } from "@/lib/utils";
import { getProductFreshnessLabel } from "@/lib/freshness";
import ProductEditForm from "@/components/admin/ProductEditForm";

export default function AdminProductsPage() {
  const { products, getSellerForProduct, deleteProduct, updateProduct } = useMarketplace();
  const active = products.filter((p) => !p.sold);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-warm-900">Products</h1>
      <p className="text-sm text-warm-600">
        Single source of truth — edits appear on homepage, explore map, sellers, and product detail.
      </p>

      <div className="mt-6 space-y-3">
        {active.map((product) => {
          const seller = getSellerForProduct(product);
          const photo = product.photos[0]?.url;
          const freshness = getProductFreshnessLabel(product);
          const isEditing = editingId === product.id;

          return (
            <div key={product.id} className="card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-warm-100">
                  {photo && <Image src={photo} alt="" fill className="object-cover" sizes="64px" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-warm-900">{product.title}</p>
                  <p className="text-sm text-warm-600">
                    {formatPrice(product.price)} · {product.category} · {freshness}
                    {seller && ` · ${seller.name}`}
                  </p>
                  {product.videos.length > 0 && (
                    <p className="text-xs text-lavender-700">{product.videos.length} video(s)</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : product.id)}
                    className="btn-secondary text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => updateProduct(product.id, { sold: true })}
                    className="btn-secondary text-xs"
                  >
                    Mark sold
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="btn-ghost text-xs text-red-600">
                    Remove
                  </button>
                </div>
              </div>
              {isEditing && (
                <ProductEditForm product={product} onClose={() => setEditingId(null)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
