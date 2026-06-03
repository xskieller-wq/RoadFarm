"use client";

import type { SellerBadgeId } from "@/lib/types";
import { SELLER_BADGES } from "@/data/badges";
import { cn } from "@/lib/utils";

interface SellerBadgesProps {
  badges: SellerBadgeId[];
  limit?: number;
  size?: "sm" | "md";
  className?: string;
}

export default function SellerBadges({ badges, limit = 4, size = "sm", className }: SellerBadgesProps) {
  if (!badges.length) return null;
  const shown = badges.slice(0, limit);

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((id) => {
        const badge = SELLER_BADGES[id];
        if (!badge) return null;
        return (
          <span
            key={id}
            title={badge.description}
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-warm-100 font-medium text-warm-800 ring-1 ring-warm-200/80",
              size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
            )}
          >
            <span>{badge.emoji}</span>
            <span>{badge.label}</span>
          </span>
        );
      })}
    </div>
  );
}
