"use client";

import Link from "next/link";
import Image from "next/image";
import { useMarketplace } from "@/context/MarketplaceContext";
import { isBakeryCategory } from "@/lib/categories";
import { getProductDisplayImage } from "@/data/images";

/** Product photos from local bakers — avoids repeated garden/flower placeholders */
export default function BakeryShowcaseMosaic() {
  const { products, approvedSellers } = useMarketplace();
  const bakerIds = new Set(
    approvedSellers.filter((s) => s.sellerType === "Baker").map((s) => s.id)
  );

  const tiles = products
    .filter((p) => !p.sold && bakerIds.has(p.sellerId) && isBakeryCategory(p.category))
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      url: getProductDisplayImage(p),
      title: p.title,
      sellerId: p.sellerId,
    }))
    .filter((t) => t.url);

  if (tiles.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {tiles.map((tile, i) => (
        <Link
          key={tile.id}
          href={`/products/${tile.id}`}
          className={`group relative overflow-hidden rounded-2xl bg-warm-100 ring-1 ring-sage-200/60 ${
            i === 0 ? "col-span-2 aspect-[2/1] sm:aspect-[16/9]" : "aspect-square"
          }`}
        >
          <Image
            src={tile.url!}
            alt={tile.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-950/70 via-transparent to-transparent opacity-80" />
          <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white line-clamp-2">
            {tile.title}
          </p>
        </Link>
      ))}
    </div>
  );
}
