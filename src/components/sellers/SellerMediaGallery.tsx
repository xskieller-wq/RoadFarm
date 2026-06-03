import Image from "next/image";
import { Play } from "lucide-react";
import type { Seller } from "@/lib/types";
import { VIDEO_TYPE_LABELS } from "@/data/seller-media";

interface SellerMediaGalleryProps {
  seller: Seller;
}

export function SellerPhotoGallery({ seller }: SellerMediaGalleryProps) {
  const allPhotos = [
    ...seller.gardenPhotos.map((p) => ({ ...p, label: "Garden" })),
    ...seller.flowerPhotos.map((p) => ({ ...p, label: "Flowers" })),
    ...seller.greenhousePhotos.map((p) => ({ ...p, label: "Greenhouse" })),
  ];

  if (allPhotos.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-warm-900">Their garden &amp; workspace</h2>
      <p className="mt-1 text-sm text-warm-600">See where your food and flowers come from</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {allPhotos.map((photo, i) => (
          <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-warm-100">
            <Image src={photo.url} alt={photo.caption || photo.label} fill className="object-cover transition-transform group-hover:scale-105" sizes="200px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{photo.label}</span>
              {photo.caption && (
                <p className="text-xs font-medium text-white line-clamp-2">{photo.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SellerVideoGallery({ seller }: SellerMediaGalleryProps) {
  if (seller.videos.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-warm-900">Video tours</h2>
      <p className="mt-1 text-sm text-warm-600">Short clips from their garden — no narration, just real footage</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {seller.videos.map((vid, i) => (
          <div key={i} className="group relative aspect-video overflow-hidden rounded-2xl bg-warm-900">
            <Image src={vid.thumbnail} alt={vid.caption} fill className="object-cover opacity-90 transition-transform group-hover:scale-105" sizes="400px" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg">
                <Play className="ml-1 h-6 w-6 fill-brand-600 text-brand-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sunflower-300">
                {VIDEO_TYPE_LABELS[vid.type]}
              </span>
              <p className="text-sm font-medium text-white">{vid.caption}</p>
              {vid.duration && <p className="text-xs text-white/60">{vid.duration}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
