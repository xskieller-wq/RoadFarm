import Image from "next/image";
import { MOOD_TEXTURES } from "@/lib/freshdrop/drop-image";

export default function MoodTextureStrip() {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 py-3 scrollbar-none bg-warm-950">
      {MOOD_TEXTURES.map(({ src, alt }) => (
        <div
          key={alt}
          className="relative h-28 w-[88px] shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-28"
        >
          <Image src={src} alt={alt} fill className="object-cover" sizes="120px" />
        </div>
      ))}
    </div>
  );
}
