"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product, FreshnessLabel, SellerAvailabilityStatus } from "@/lib/types";
import { useMarketplace } from "@/context/MarketplaceContext";
import { formatPrice } from "@/lib/utils";
import { getProductFreshnessLabel } from "@/lib/freshness";
import FreshnessLabelSelect from "@/components/forms/FreshnessLabelSelect";
import SellerAvailabilitySelect from "@/components/forms/SellerAvailabilitySelect";
import ProductMediaEditor from "@/components/products/ProductMediaEditor";

interface ProductEditFormProps {
  product: Product;
  onClose: () => void;
}

export default function ProductEditForm({ product, onClose }: ProductEditFormProps) {
  const { updateProduct, updateSeller, getSellerForProduct } = useMarketplace();
  const seller = getSellerForProduct(product);
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(String(product.price));
  const [freshnessLabel, setFreshnessLabel] = useState<FreshnessLabel>(
    product.freshnessLabel ?? getProductFreshnessLabel(product)
  );
  const [photos, setPhotos] = useState(product.photos);
  const [videos, setVideos] = useState(product.videos ?? []);
  const [availability, setAvailability] = useState<SellerAvailabilityStatus>(
    seller?.availabilityStatus ?? "available_today"
  );

  const save = () => {
    updateProduct(product.id, {
      title,
      price: parseFloat(price) || product.price,
      freshnessLabel,
      photos,
      videos,
    });
    if (seller) {
      updateSeller(seller.id, { availabilityStatus: availability });
    }
    onClose();
  };

  const photo = photos[0]?.url;

  return (
    <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/30 p-4">
      <div className="flex gap-4">
        {photo && (
          <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:block">
            <Image src={photo} alt="" fill className="object-cover" sizes="80px" />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label className="text-xs font-medium text-warm-600">Product name</label>
            <input className="input-field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-warm-600">Price</label>
              <input
                type="number"
                step="0.01"
                className="input-field mt-1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-warm-600">Freshness label</label>
              <div className="mt-1">
                <FreshnessLabelSelect value={freshnessLabel} onChange={setFreshnessLabel} />
              </div>
            </div>
          </div>
          <ProductMediaEditor
            photos={photos}
            videos={videos}
            onPhotosChange={setPhotos}
            onVideosChange={setVideos}
          />
          {seller && (
            <div>
              <label className="text-xs font-medium text-warm-600">
                Seller availability ({seller.name})
              </label>
              <p className="text-[11px] text-warm-500">Not freshness — controls map visibility and pickup</p>
              <div className="mt-2">
                <SellerAvailabilitySelect
                  value={availability}
                  onChange={setAvailability}
                  compact
                />
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button type="button" onClick={save} className="btn-primary text-sm">
              Save changes
            </button>
            <button type="button" onClick={onClose} className="btn-ghost text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-warm-500">
        Syncs everywhere: homepage, explore map, sellers, product detail, and dashboard.
        Was {formatPrice(product.price)}.
      </p>
    </div>
  );
}
