"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import {
  BAKERY_CATEGORIES,
  FUTURE_CATEGORIES,
  COMPLIANCE_CATEGORIES,
  isBakeryCategory,
  type ProductCategory,
  type FreshnessLabel,
  type ProductPhoto,
  type ProductVideo,
} from "@/lib/types";
import { BAKERY_FRESHNESS_LABEL_OPTIONS, getFreshnessOptionsForCategory } from "@/lib/freshness";
import { getProductImage } from "@/data/images";
import ProductMediaEditor from "@/components/products/ProductMediaEditor";

export default function AddProductPage() {
  const router = useRouter();
  const { seller, addProduct } = useSellerDashboard();

  const [category, setCategory] = useState<ProductCategory | "">("");
  const [freshnessLabel, setFreshnessLabel] = useState<FreshnessLabel>("Made Today");
  const [photos, setPhotos] = useState<ProductPhoto[]>([]);
  const [videos, setVideos] = useState<ProductVideo[]>([]);

  if (!seller) return null;

  const needsCompliance =
    category && COMPLIANCE_CATEGORIES.includes(category as (typeof COMPLIANCE_CATEGORIES)[number]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;
    if (needsCompliance) {
      router.push("/dashboard/compliance");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const imageUrl = photos[0]?.url || getProductImage(category, title);

    addProduct({
      sellerId: seller.id,
      title,
      category,
      description: fd.get("description") as string,
      quantityAvailable: parseInt(fd.get("quantity") as string, 10) || 1,
      price: parseFloat(fd.get("price") as string) || 0,
      pickupLocation: seller.pickupLocation,
      pickupHours: seller.pickupHours,
      photos: [{ url: imageUrl, type: "product" }, ...photos.slice(1).filter((p) => p.url)],
      videos,
      freshnessStatus: "Ready For Pickup",
      freshnessLabel,
      estimatedDetourMinutes: 3,
      sold: false,
    });
    router.push("/dashboard/products");
  };

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/products" className="btn-ghost mb-6 inline-flex text-sm">
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      <h2 className="text-xl font-bold text-warm-900">Add a product</h2>
      <p className="mt-1 text-sm text-warm-600">Appears on the neighborhood map when your availability allows.</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">Product name</label>
          <input name="title" type="text" className="input-field" required />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">Category</label>
          <select
            className="input-field"
            value={category}
            onChange={(e) => {
              const next = e.target.value as ProductCategory;
              setCategory(next);
              const options = getFreshnessOptionsForCategory(next);
              if (!options.includes(freshnessLabel)) {
                setFreshnessLabel(options[0]);
              }
            }}
            required
          >
            <option value="">Select category</option>
            <optgroup label="Bakery (MVP)">
              {BAKERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </optgroup>
            <optgroup label="Coming later">
              {FUTURE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">Description</label>
          <textarea name="description" className="input-field min-h-[100px]" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Price ($)</label>
            <input name="price" type="number" step="0.01" min="0" className="input-field" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Quantity</label>
            <input name="quantity" type="number" min="1" className="input-field" defaultValue={10} required />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">Freshness label</label>
          <select
            className="input-field"
            value={freshnessLabel}
            onChange={(e) => setFreshnessLabel(e.target.value as FreshnessLabel)}
          >
            {(category && isBakeryCategory(category)
              ? BAKERY_FRESHNESS_LABEL_OPTIONS
              : getFreshnessOptionsForCategory(category || "Bread")
            ).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <ProductMediaEditor
          photos={photos}
          videos={videos}
          onPhotosChange={setPhotos}
          onVideosChange={setVideos}
        />

        <button type="submit" className="btn-primary w-full">
          {needsCompliance ? "Continue to compliance" : "Add product"}
        </button>
      </form>
    </div>
  );
}
