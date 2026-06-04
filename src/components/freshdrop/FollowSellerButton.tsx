"use client";

import { UserPlus, Check } from "lucide-react";
import { useFollow } from "@/components/freshdrop/FollowContext";
import { cn } from "@/lib/utils";

export default function FollowSellerButton({
  sellerId,
  className,
  compact = false,
}: {
  sellerId: string;
  className?: string;
  compact?: boolean;
}) {
  const { isFollowing, toggleFollow } = useFollow();
  const following = isFollowing(sellerId);

  return (
    <button
      type="button"
      onClick={() => toggleFollow(sellerId)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl border font-semibold transition-colors",
        compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
        following
          ? "border-amber-200/80 bg-amber-50/90 text-amber-900 hover:bg-amber-100"
          : "border-white/60 bg-white/40 text-warm-800 backdrop-blur-sm hover:bg-white/60",
        className
      )}
    >
      {following ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-3.5 w-3.5" aria-hidden />
          Follow seller
        </>
      )}
    </button>
  );
}
