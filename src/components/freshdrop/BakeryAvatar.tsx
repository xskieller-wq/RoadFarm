"use client";

import Image from "next/image";
import type { Seller } from "@/lib/types";
import { getBakerAvatarImage, isBlockedPexelsUrl } from "@/data/images";
import BakeryMonogram from "@/components/freshdrop/BakeryMonogram";

function resolveBakeryAvatarSrc(seller: Seller | null | undefined, seed: number): string | null {
  if (seller?.sellerType === "Baker") {
    const avatar = seller.avatar?.trim();
    if (avatar && !isBlockedPexelsUrl(avatar)) return avatar;
    return getBakerAvatarImage(seller.specialties, seed);
  }
  if (seller?.avatar && !isBlockedPexelsUrl(seller.avatar)) return seller.avatar;
  return getBakerAvatarImage([], seed);
}

export default function BakeryAvatar({
  name,
  seller,
  seed = 0,
  size = 36,
  className,
}: {
  name: string;
  seller?: Seller | null;
  seed?: number;
  size?: number;
  className?: string;
}) {
  const displayName = seller?.name ?? name;
  const src = resolveBakeryAvatarSrc(seller, seed);

  if (!src) {
    return <BakeryMonogram name={displayName} size={size} className={className} />;
  }

  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full ring-2 ring-white/80 shadow-sm ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt="" fill className="object-cover" sizes={`${size}px`} />
    </span>
  );
}
