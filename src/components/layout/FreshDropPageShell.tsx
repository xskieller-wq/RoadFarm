import type { ReactNode } from "react";
import Image from "next/image";
import { bakeryZoneBackdrop } from "@/data/images";
import { BAKERY_ZONE_BLUR } from "@/components/home/home-data";
import { freshDropEyebrow, freshDropPagePanel } from "@/lib/freshdrop/buyer-page-styles";
import { cn } from "@/lib/utils";

type PageWidth = "narrow" | "default" | "wide";

const WIDTH_CLASS: Record<PageWidth, string> = {
  narrow: "max-w-lg",
  default: "max-w-4xl",
  wide: "max-w-7xl",
};

export function FreshDropPageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 sm:mb-10", className)}>
      {eyebrow ? <p className={freshDropEyebrow}>{eyebrow}</p> : null}
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-warm-950 sm:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-warm-600 sm:text-base">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </header>
  );
}

export function FreshDropPanel({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn(freshDropPagePanel, "p-5 sm:p-6", className)}>
      {children}
    </div>
  );
}

export default function FreshDropPageShell({
  children,
  width = "default",
  className,
}: {
  children: ReactNode;
  width?: PageWidth;
  className?: string;
}) {
  return (
    <div className={cn("relative min-h-[calc(100dvh-5rem)]", className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src={bakeryZoneBackdrop("top")}
          alt=""
          fill
          className={BAKERY_ZONE_BLUR}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-50/90 via-cream-50/95 to-sage-50/85" />
      </div>
      <div
        className={cn(
          "relative z-10 mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8",
          WIDTH_CLASS[width]
        )}
      >
        {children}
      </div>
    </div>
  );
}
