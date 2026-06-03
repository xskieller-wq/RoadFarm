"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import { getProductFreshnessLabel } from "@/lib/freshness";
import type { FreshnessLabel } from "@/lib/types";
import FreshnessLabelSelect from "@/components/forms/FreshnessLabelSelect";
import ProductMediaEditor from "@/components/products/ProductMediaEditor";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { sellerId, seller, getProductById, updateProduct } = useSellerDashboard();
  const product = getProductById(id);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [freshnessLabel, setFreshnessLabel] = useState<FreshnessLabel>("Picked Today");
  const [photos, setPhotos] = useState(product?.photos ?? []);
  const [videos, setVideos] = useState(product?.videos ?? []);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!product) return;
    setTitle(product.title);
    setPrice(String(product.price));
    setDescription(product.description);
    setQuantity(String(product.quantityAvailable));
    setFreshnessLabel(product.freshnessLabel ?? getProductFreshnessLabel(product));
    setPhotos(product.photos);
    setVideos(product.videos ?? []);
  }, [product]);

  if (!product) {
    return (
      <p className="text-center text-warm-600">
        Product not found.{" "}
        <Link href="/dashboard/products" className="text-brand-700 underline">
          Back to products
        </Link>
      </p>
    );
  }

  if (product.sellerId !== sellerId) {
    return <p className="text-center text-warm-600">You can only edit your own products.</p>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProduct(product.id, {
      title,
      price: parseFloat(price) || product.price,
      description,
      quantityAvailable: parseInt(quantity, 10) || product.quantityAvailable,
      freshnessLabel,
      photos: photos.filter((p) => p.url.trim()),
      videos,
      pickupLocation: seller?.pickupLocation ?? product.pickupLocation,
      pickupHours: seller?.pickupHours ?? product.pickupHours,
    });
    setSaved(true);
    setTimeout(() => router.push("/dashboard/products"), 800);
  };

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/products" className="btn-ghost mb-6 inline-flex text-sm">
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      <h2 className="text-xl font-bold text-warm-900">Edit product</h2>
      <p className="mt-1 text-sm text-warm-600">{product.category}</p>

      {saved && (
        <p className="mt-4 text-sm font-medium text-sage-700">Saved — updating map and listings…</p>
      )}

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">Product name</label>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">Description</label>
          <textarea
            className="input-field min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Price ($)</label>
            <input
              type="number"
              step="0.01"
              className="input-field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Quantity</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Freshness label</label>
            <FreshnessLabelSelect value={freshnessLabel} onChange={setFreshnessLabel} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-warm-700">Photos & videos</label>
          <p className="mb-2 text-xs text-warm-500">Paste image and video URLs</p>
          <ProductMediaEditor
            photos={photos}
            videos={videos}
            onPhotosChange={setPhotos}
            onVideosChange={setVideos}
          />
        </div>

        <p className="text-xs text-warm-500">
          Pickup availability is set under{" "}
          <Link href="/dashboard/availability" className="font-medium text-brand-700 underline">
            Availability
          </Link>
          .
        </p>

        <button type="submit" className="btn-primary w-full">
          Save product
        </button>
      </form>
    </div>
  );
}
