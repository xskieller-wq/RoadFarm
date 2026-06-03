import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Seller } from "@/lib/types";
import { VIDEO_TYPE_LABELS } from "@/data/seller-media";

interface VideoPreviewRowProps {
  sellers: Seller[];
}

export default function VideoPreviewRow({ sellers }: VideoPreviewRowProps) {
  const withVideos = sellers.filter((s) => s.videos.length > 0).slice(0, 6);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {withVideos.map((seller) => {
        const video = seller.videos[0];
        return (
          <Link
            key={seller.id}
            href={`/sellers/${seller.id}`}
            className="group relative w-[220px] shrink-0 sm:w-[260px]"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-warm-900 shadow-md">
              <Image
                src={video.thumbnail}
                alt={video.caption}
                fill
                className="object-cover opacity-90 transition-transform group-hover:scale-105"
                sizes="260px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg">
                  <Play className="ml-0.5 h-5 w-5 fill-brand-600 text-brand-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sunflower-300">
                  {VIDEO_TYPE_LABELS[video.type]}
                </p>
                <p className="text-sm font-medium text-white line-clamp-1">{seller.name}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
