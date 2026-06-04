import type { ReactNode } from "react";
import { Sunrise } from "lucide-react";
import FreshDropPageShell, { FreshDropPanel } from "@/components/layout/FreshDropPageShell";
import { freshDropEyebrow } from "@/lib/freshdrop/buyer-page-styles";
import { cn } from "@/lib/utils";

export function FreshDropAuthBrand({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
        <Sunrise className="h-6 w-6 text-white" aria-hidden />
      </div>
      <p className={cn(freshDropEyebrow, "mt-5")}>FreshDrop</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-warm-950">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-warm-600">{description}</p>
    </div>
  );
}

export default function FreshDropAuthLayout({
  children,
  footer,
  title,
  description,
}: {
  children: ReactNode;
  footer?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <FreshDropPageShell width="narrow">
      <FreshDropAuthBrand title={title} description={description} />
      <FreshDropPanel className="mt-6">
        <div className="space-y-4">{children}</div>
      </FreshDropPanel>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </FreshDropPageShell>
  );
}
