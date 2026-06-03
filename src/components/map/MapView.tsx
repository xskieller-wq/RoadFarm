"use client";

import { MapPin } from "lucide-react";
import type { Product } from "@/lib/types";

interface MapViewProps {
  products: Product[];
  start: string;
  destination: string;
}

const markerColors = [
  "bg-blossom-500",
  "bg-sunflower-500",
  "bg-lavender-500",
  "bg-brand-500",
  "bg-tomato-500",
];

export default function MapView({ products, start, destination }: MapViewProps) {
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-blossom-50 via-sunflower-50 to-lavender-50 sm:aspect-[16/7]">
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 800 500" fill="none">
            <path d="M0 250 Q200 200 400 250 T800 250" stroke="#E84840" strokeWidth="3" strokeDasharray="8 4" />
            <path d="M100 100 L700 400" stroke="#C9A07A" strokeWidth="2" opacity="0.3" />
            <path d="M50 400 L750 100" stroke="#C9A07A" strokeWidth="2" opacity="0.3" />
            <circle cx="120" cy="280" r="8" fill="#F5A623" />
            <circle cx="680" cy="220" r="8" fill="#E84840" />
          </svg>
        </div>

        <div className="absolute left-[10%] top-[45%] h-1 w-[80%] rounded-full bg-gradient-to-r from-sunflower-400 via-blossom-400 to-brand-400 opacity-70" />

        <div className="absolute left-[8%] top-[38%] flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sunflower-500 text-warm-900 shadow-lg">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="mt-1 max-w-[100px] truncate rounded bg-white/90 px-2 py-0.5 text-xs font-medium shadow">
            {start.split(",")[0]}
          </span>
        </div>

        <div className="absolute right-[8%] top-[38%] flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="mt-1 max-w-[100px] truncate rounded bg-white/90 px-2 py-0.5 text-xs font-medium shadow">
            {destination.split(",")[0]}
          </span>
        </div>

        {products.slice(0, 12).map((product, i) => {
          const left = 15 + (i * 6.5);
          const top = 35 + (Math.sin(i * 1.2) * 12);
          const color = markerColors[i % markerColors.length];
          return (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="absolute group"
              style={{ left: `${left}%`, top: `${top}%` }}
              title={product.title}
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${color} shadow-md transition-transform group-hover:scale-125`}>
                <span className="text-[10px] font-bold text-white">{i + 1}</span>
              </div>
              <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-warm-900 px-2 py-1 text-xs text-white group-hover:block">
                {product.title} — +{product.estimatedDetourMinutes}min
              </div>
            </a>
          );
        })}

        <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-3 py-2 text-sm shadow-md backdrop-blur">
          <span className="font-medium text-warm-900">{products.length} products</span>
          <span className="text-warm-500"> along your route</span>
        </div>
      </div>
    </div>
  );
}
