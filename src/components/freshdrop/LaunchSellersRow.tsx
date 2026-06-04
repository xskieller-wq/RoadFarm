import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Seller } from "@/lib/types";
import GrowerProfileCard from "@/components/sellers/GrowerProfileCard";

export default function LaunchSellersRow({ sellers }: { sellers: Seller[] }) {
  if (sellers.length === 0) return null;

  return (
    <section aria-labelledby="launch-sellers-heading">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="launch-sellers-heading" className="text-lg font-bold text-warm-950 sm:text-xl">
            Bakers dropping near you
          </h2>
          <p className="mt-0.5 text-sm text-warm-600">Compare pickup windows and follow for alerts.</p>
        </div>
        <Link
          href="/sellers#type-Baker"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller) => (
          <GrowerProfileCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  );
}
