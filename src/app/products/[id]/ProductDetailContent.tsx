"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Star,
  Shield,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import {
  formatPrice,
  formatPickupHours,
  getCategoryColor,
  getFreshnessColor,
} from "@/lib/utils";
import { getProductFreshnessLabel } from "@/lib/freshness";
import { getSellerAvailabilityLine } from "@/lib/seller-availability";
import SellerAvailability from "@/components/sellers/SellerAvailability";
import ProductVideoGallery from "@/components/products/ProductVideoGallery";
import ReserveButton from "@/components/products/ReserveButton";
import { COMPLIANCE_CATEGORIES, BUYER_DISCLAIMER } from "@/lib/types";
import { getProductDisplayImage } from "@/data/images";
import { foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { usePhase1Product } from "@/lib/phase1/use-phase1-product";
import Phase1ProductDetail from "./Phase1ProductDetail";

export default function ProductDetailContent({ id }: { id: string }) {
  const phase1 = usePhase1Product(id);
  const { getProductById, getSellerForProduct, hydrated } = useMarketplace();
  const product = getProductById(id);

  if (phase1.enabled) {
    if (phase1.loading) {
      return <div className="p-8 text-center text-warm-600">Loading product…</div>;
    }
    if (phase1.product && phase1.seller) {
      return <Phase1ProductDetail product={phase1.product} seller={phase1.seller} />;
    }
  }

  if (!hydrated) {
    return <div className="p-8 text-center text-warm-600">Loading product…</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-warm-600">Product not found.</p>
        <Link href="/explore" className="btn-primary mt-4">
          Explore map
        </Link>
      </div>
    );
  }

  const seller = getSellerForProduct(product);
  const needsDisclaimer = COMPLIANCE_CATEGORIES.includes(product.category);
  const mainPhoto = getProductDisplayImage(product);
  const freshnessLabel = getProductFreshnessLabel(product);
  const availabilityLine = seller ? getSellerAvailabilityLine(seller) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/results" className="btn-ghost mb-6 inline-flex">
        <ChevronLeft className="h-4 w-4" />
        Back to results
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-earth-100">
            {mainPhoto && (
              <Image
                src={mainPhoto}
                alt={product.title}
                fill
                className={foodPhotoClassName}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          {product.photos.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.photos.slice(1, 5).map((photo, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-earth-100">
                  <Image src={photo.url} alt={photo.caption || ""} fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          )}
          <ProductVideoGallery videos={product.videos} />
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${getCategoryColor(product.category)}`}>{product.category}</span>
            <span className={`badge ${getFreshnessColor(freshnessLabel)}`}>{freshnessLabel}</span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-earth-900">{product.title}</h1>
          {availabilityLine && (
            <p className="mt-2 text-sm font-semibold text-sunflower-800">{availabilityLine}</p>
          )}
          <p className="mt-2 text-2xl font-bold text-brand-700">{formatPrice(product.price)}</p>
          <p className="mt-4 text-earth-600">{product.description}</p>

          {needsDisclaimer && (
            <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">{BUYER_DISCLAIMER}</p>
            </div>
          )}

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-earth-600">
              <Clock className="h-4 w-4 text-earth-400" />
              +{product.estimatedDetourMinutes} min detour from your route
            </div>
            <div className="flex items-center gap-2 text-earth-600">
              <MapPin className="h-4 w-4 text-earth-400" />
              Pickup: {product.pickupLocation}
            </div>
            <div className="flex items-center gap-2 text-earth-600">
              <Clock className="h-4 w-4 text-earth-400" />
              {formatPickupHours(product.pickupHours)}
            </div>
          </div>

          <p className="mt-4 text-sm text-earth-500">{product.quantityAvailable} available</p>

          {seller && (
            <ReserveButton product={product} sellerName={seller.name} sellerId={seller.id} />
          )}

          {seller && (
            <div className="mt-6">
              <SellerAvailability seller={seller} />
            </div>
          )}

          {seller && (
            <Link
              href={`/sellers/${seller.id}`}
              className="card mt-8 flex items-center gap-4 p-4 transition-shadow hover:shadow-md"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-earth-100">
                <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-earth-900">{seller.name}</p>
                  {seller.verified && <Shield className="h-4 w-4 text-lavender-500" />}
                </div>
                <p className="text-sm text-earth-600">{seller.tagline}</p>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{seller.rating}</span>
                  <span className="text-earth-500">({seller.reviewCount} reviews)</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
