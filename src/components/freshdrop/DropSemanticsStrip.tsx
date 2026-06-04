import type { SemanticBlock } from "@/lib/freshdrop/drop-semantics";
import { cn } from "@/lib/utils";

const STYLES: Record<
  SemanticBlock["category"],
  { wrap: string; label: string; headline: string }
> = {
  Freshness: {
    wrap: "bg-amber-50/90 border-amber-200/70",
    label: "text-amber-800",
    headline: "text-amber-950",
  },
  Availability: {
    wrap: "bg-emerald-50/90 border-emerald-200/70",
    label: "text-emerald-800",
    headline: "text-emerald-950",
  },
  Pickup: {
    wrap: "bg-sky-50/90 border-sky-200/70",
    label: "text-sky-800",
    headline: "text-sky-950",
  },
};

function Block({ block }: { block: SemanticBlock }) {
  const s = STYLES[block.category];
  return (
    <div className={cn("rounded-lg border px-2.5 py-2", s.wrap)}>
      <p className={cn("text-[10px] font-bold uppercase tracking-wider", s.label)}>
        {block.category}
      </p>
      <p className={cn("mt-0.5 text-sm font-semibold leading-snug", s.headline)}>
        {block.headline}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-warm-600">{block.detail}</p>
    </div>
  );
}

export default function DropSemanticsStrip({
  freshness,
  availability,
  pickup,
  compact,
}: {
  freshness: SemanticBlock;
  availability: SemanticBlock;
  pickup: SemanticBlock;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="space-y-1.5">
        <Block block={freshness} />
        <Block block={availability} />
        <Block block={pickup} />
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Block block={freshness} />
      <Block block={availability} />
      <Block block={pickup} />
    </div>
  );
}
