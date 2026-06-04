"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import type { UpcomingBatchAlert } from "@/lib/buyer/buyer-types";
import { getProductImage } from "@/data/images";
import { foodPhotoClassName } from "@/lib/freshdrop/drop-image";

export default function DropAlertRow({ alert }: { alert: UpcomingBatchAlert }) {
  const photo =
    alert.imageUrl && !alert.imageUrl.includes("pexels-photo-1148820")
      ? alert.imageUrl
      : getProductImage(alert.category, alert.productTitle);

  return (
    <Link
      href={`/products/${alert.productId}`}
      className="flex gap-3 rounded-xl border border-warm-100 bg-warm-50/50 p-3 transition hover:border-warm-200 hover:bg-white"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-warm-100 ring-1 ring-warm-200/80">
        <Image src={photo} alt="" fill className={foodPhotoClassName} sizes="64px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-amber-800/90">
          {alert.batchTime}
        </p>
        <p className="mt-0.5 line-clamp-1 text-sm font-bold text-warm-950">{alert.productTitle}</p>
        <p className="text-xs text-warm-600">{alert.sellerName}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-warm-500">
          <Clock className="h-3 w-3 shrink-0" aria-hidden />
          {alert.pickupWindow}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 self-center text-warm-400" aria-hidden />
    </Link>
  );
}
