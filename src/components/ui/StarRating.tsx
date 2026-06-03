import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
  className,
}: StarRatingProps) {
  const iconSize = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  const textSize = size === "lg" ? "text-base" : size === "md" ? "text-sm" : "text-xs";

  return (
    <span className={cn("inline-flex items-center gap-1", textSize, className)}>
      <Star className={cn(iconSize, "fill-sunflower-400 text-sunflower-400")} />
      <span className="font-semibold text-warm-900">{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-warm-500">({reviewCount})</span>
      )}
    </span>
  );
}
