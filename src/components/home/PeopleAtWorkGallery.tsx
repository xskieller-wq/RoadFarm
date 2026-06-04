import Image from "next/image";
import { PEOPLE_AT_WORK } from "@/components/home/home-data";

/** Compact bakery imagery strip */
export default function PeopleAtWorkGallery() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {PEOPLE_AT_WORK.map((item) => (
        <div
          key={item.caption}
          className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/25 sm:h-28 sm:w-44"
        >
          <Image
            src={item.image}
            alt={item.caption}
            fill
            className="object-cover"
            sizes="176px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-950/80 via-warm-950/10 to-transparent" />
          <p className="absolute bottom-1.5 left-2 right-2 text-[10px] font-semibold leading-tight text-white">
            {item.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
