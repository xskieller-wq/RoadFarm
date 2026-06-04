import { cn } from "@/lib/utils";

export function bakeryMonogramInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  const one = parts[0] ?? "FD";
  return one.slice(0, 2).toUpperCase();
}

export default function BakeryMonogram({
  name,
  size = 36,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = bakeryMonogramInitials(name);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-warm-100 to-warm-200 font-bold tracking-tight text-warm-800 ring-2 ring-white/80 shadow-sm",
        className
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.34)) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
