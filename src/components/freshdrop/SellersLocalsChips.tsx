"use client";

import Link from "next/link";
import type { Seller } from "@/lib/types";
import BakeryAvatar from "@/components/freshdrop/BakeryAvatar";

export default function SellersLocalsChips({
  sellers,
  embedded = false,
}: {
  sellers: Seller[];
  embedded?: boolean;
}) {
  if (sellers.length === 0) return null;

  const chips = sellers.slice(0, 8);

  const list = (
    <ul className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {chips.map((seller) => (
            <li key={seller.id} className="shrink-0">
              <Link
                href={`/sellers/${seller.slug}`}
                className="flex items-center gap-2 rounded-full border border-warm-200/80 bg-white/85 py-1 pl-1 pr-3 shadow-sm ring-1 ring-warm-100/80 transition hover:border-warm-300/80 hover:ring-warm-200/50"
              >
                <BakeryAvatar
                  name={seller.name}
                  seller={seller}
                  seed={seller.id.charCodeAt(1) || 0}
                  size={32}
                  className="!ring-1 !ring-warm-200"
                />
                <span className="max-w-[120px] truncate text-xs font-semibold text-warm-900">
                  {seller.name}
                </span>
              </Link>
            </li>
        ))}
    </ul>
  );

  if (embedded) return list;

  return (
    <section aria-labelledby="sellers-locals-heading" className="border-t border-white/25 pt-5">
      <div className="flex items-end justify-between gap-3">
        <h2
          id="sellers-locals-heading"
          className="text-sm font-semibold tracking-tight text-warm-900"
        >
          Sellers locals love
        </h2>
        <Link
          href="/sellers#type-Baker"
          className="shrink-0 text-xs font-semibold text-warm-700 hover:text-brand-800"
        >
          See all
        </Link>
      </div>
      <div className="mt-3">{list}</div>
    </section>
  );
}
