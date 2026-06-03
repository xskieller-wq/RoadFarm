import Link from "next/link";
import Image from "next/image";
import type { Seller } from "@/lib/types";

interface CommunityGardenMosaicProps {
  sellers: Seller[];
}

export default function CommunityGardenMosaic({ sellers }: CommunityGardenMosaicProps) {
  const photos = sellers.flatMap((s) => [
    ...s.gardenPhotos.map((p) => ({ ...p, seller: s })),
    ...s.flowerPhotos.map((p) => ({ ...p, seller: s })),
    ...s.greenhousePhotos.map((p) => ({ ...p, seller: s })),
  ]).slice(0, 12);

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {photos.map((photo, i) => (
        <Link
          key={i}
          href={`/sellers/${photo.seller.id}`}
          className={`group relative overflow-hidden rounded-2xl bg-warm-100 ${
            i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
          }`}
        >
          <Image
            src={photo.url}
            alt={photo.caption || photo.seller.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 33vw, 16vw"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-2 transition-transform group-hover:translate-y-0">
            <p className="text-xs font-medium text-white">{photo.seller.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
