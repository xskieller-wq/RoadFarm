import Image from "next/image";
import { PEOPLE_AT_WORK } from "@/components/home/home-data";

/** Real people — harvest, gardens, honey, flowers, baking (balanced, not flower-only) */
export default function PeopleAtWorkGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
      {PEOPLE_AT_WORK.map((item) => (
        <div
          key={item.caption}
          className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-sage-100 shadow-sm ring-1 ring-sage-200/60"
        >
          <Image
            src={item.image}
            alt={item.caption}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 16vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-950/75 via-transparent to-transparent" />
          <p className="absolute bottom-2 left-2 right-2 text-[11px] font-semibold leading-tight text-white sm:text-xs">
            {item.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
