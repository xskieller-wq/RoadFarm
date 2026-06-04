"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin } from "lucide-react";
import type { Product as DbProduct, Seller as DbSeller } from "@routefarm/shared";
import { getProductImage } from "@/data/images";
import { foodPhotoClassName } from "@/lib/freshdrop/drop-image";
import { formatPrice } from "@/lib/utils";
import type { ProductCategory } from "@/lib/types";

function productImage(product: DbProduct) {
  return getProductImage(product.category as ProductCategory, product.title);
}

export default function Phase1ProductDetail({
  product,
  seller,
}: {
  product: DbProduct;
  seller: DbSeller;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="btn-ghost mb-6 inline-flex">
        <ChevronLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="card overflow-hidden">
        <div className="relative aspect-[16/10] bg-warm-100">
          <Image
            src={productImage(product)}
            alt={product.title}
            fill
            className={foodPhotoClassName}
            sizes="100vw"
            priority
          />
        </div>
        <div className="p-6">
          <p className="text-sm font-medium text-brand-600">{product.category}</p>
          <h1 className="mt-1 text-2xl font-bold text-warm-900">{product.title}</h1>
          <p className="mt-2 text-xl font-bold text-brand-700">{formatPrice(product.price_cents / 100)}</p>
          {product.freshness_label && (
            <p className="mt-2 inline-block rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-800">
              {product.freshness_label}
            </p>
          )}
          {product.description && (
            <p className="mt-4 leading-relaxed text-warm-700">{product.description}</p>
          )}
          <div className="mt-6 flex items-center gap-2 text-sm text-warm-600">
            <MapPin className="h-4 w-4" />
            <Link href={`/sellers/${seller.slug}`} className="font-semibold text-brand-700 hover:underline">
              {seller.name}
            </Link>
            <span>· {seller.city}, IL</span>
          </div>
          <p className="mt-4 text-sm text-warm-500">
            {product.quantity_available} available · Reserve flow uses demo mode until payments ship.
          </p>
        </div>
      </div>
    </div>
  );
}
