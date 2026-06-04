"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Shield, ChevronLeft } from "lucide-react";
import type { Product as DbProduct, Seller as DbSeller } from "@routefarm/shared";
import { SELLER_TYPE_LABELS } from "@/data/seller-media";
import { getBakerAvatarImage, getProductImage } from "@/data/images";
import { foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import type { ProductCategory } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";

function sellerCover(seller: DbSeller) {
  if (seller.cover_photo_url) return seller.cover_photo_url;
  return getProductImage("Bread", seller.slug);
}

function sellerAvatar(seller: DbSeller) {
  if (seller.avatar_url) return seller.avatar_url;
  if (seller.seller_type === "Baker") {
    return getBakerAvatarImage(seller.specialties as never[], seller.id.charCodeAt(1) || 0);
  }
  return sellerCover(seller);
}

function productImage(product: DbProduct) {
  return getProductImage(product.category as ProductCategory, product.title);
}

export default function Phase1SellerProfile({
  seller,
  products,
}: {
  seller: DbSeller;
  products: DbProduct[];
}) {
  const typeLabel = SELLER_TYPE_LABELS[seller.seller_type as keyof typeof SELLER_TYPE_LABELS] ?? seller.seller_type;

  return (
    <div>
      <div className="relative h-56 bg-warm-200 sm:h-72">
        <Image src={sellerCover(seller)} alt={seller.name} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950/70 via-warm-900/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/sellers" className="btn-ghost -mt-12 relative z-10 mb-4 inline-flex text-white hover:bg-white/20">
          <ChevronLeft className="h-4 w-4" />
          All sellers
        </Link>

        <div className="relative -mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-white bg-warm-100 shadow-xl">
            <Image src={sellerAvatar(seller)} alt={seller.name} fill className="object-cover" sizes="128px" />
          </div>
          <div className="flex-1 pb-2">
            <span className="badge bg-lavender-100 text-lavender-700">{typeLabel}</span>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-warm-900 sm:text-3xl">{seller.name}</h1>
              {seller.verified && (
                <span className="flex items-center gap-1 rounded-full bg-lavender-100 px-2.5 py-0.5 text-xs font-medium text-lavender-800">
                  <Shield className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            {seller.tagline && <p className="mt-1 text-lg text-warm-600">{seller.tagline}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <StarRating rating={seller.rating} reviewCount={seller.review_count} size="lg" />
              <span className="flex items-center gap-1 text-warm-600">
                <MapPin className="h-4 w-4" />
                {seller.city}, IL
              </span>
            </div>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-warm-500">
              Status: {seller.approval_status}
            </p>
          </div>
        </div>

        {seller.bio && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-warm-900">About</h2>
            <p className="mt-2 leading-relaxed text-warm-700">{seller.bio}</p>
          </div>
        )}

        <section className="mt-12 pb-12">
          <h2 className="text-xl font-bold text-warm-900">Products</h2>
          {products.length === 0 ? (
            <p className="mt-4 text-warm-600">No active listings yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="card overflow-hidden hover:shadow-md">
                  <div className="relative aspect-[4/3] bg-warm-100">
                    <Image
                      src={productImage(p)}
                      alt={p.title}
                      fill
                      className={foodPhotoClassName}
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-warm-900">{p.title}</h3>
                    <p className="mt-1 text-sm font-bold text-brand-700">{formatPrice(p.price_cents / 100)}</p>
                    {p.freshness_label && (
                      <p className="mt-1 text-xs text-sage-700">{p.freshness_label}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
