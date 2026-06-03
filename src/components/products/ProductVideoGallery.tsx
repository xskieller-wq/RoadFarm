"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import type { ProductVideo } from "@/lib/types";

interface ProductVideoGalleryProps {
  videos: ProductVideo[];
}

export default function ProductVideoGallery({ videos }: ProductVideoGalleryProps) {
  const playable = videos.filter((v) => v.thumbnail);
  if (playable.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-warm-900">Product videos</h2>
      <p className="mt-1 text-sm text-warm-600">Short clips from the grower or maker</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {playable.map((vid, i) => (
          <div key={i} className="group relative aspect-video overflow-hidden rounded-2xl bg-warm-900">
            <Image src={vid.thumbnail} alt={vid.caption || "Product video"} fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg">
                <Play className="ml-0.5 h-5 w-5 fill-brand-600 text-brand-600" />
              </div>
            </div>
            {vid.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-sm font-medium text-white">
                {vid.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
