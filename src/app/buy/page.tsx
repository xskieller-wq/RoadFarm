import Link from "next/link";
import { Map, MapPin, Users, Clock, ShoppingBag, ArrowRight } from "lucide-react";
import { ROUTEFARM_AREAS } from "@/data/routefarm-structure";

const icons = [Map, Users, MapPin, Clock, ShoppingBag];

export default function BuyPage() {
  const area = ROUTEFARM_AREAS.buyers;

  return (
    <div className="bg-sage-50/50">
      <div className="border-b border-sage-200/60 bg-garden-gradient">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="section-label text-sage-700">For buyers</p>
          <h1 className="mt-2 text-3xl font-bold text-warm-900 sm:text-4xl">{area.cta}</h1>
          <p className="mt-4 text-lg text-warm-600">{area.description}</p>
          <Link href="/explore" className="btn-primary mt-8 inline-flex">
            Open neighborhood map
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-warm-900">What you can find</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {area.productTypes.map((t) => (
            <span key={t} className="badge bg-sage-100 text-sage-700">
              {t}
            </span>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-bold text-warm-900">Buyer features</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {area.features.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={feature} className="card flex gap-3 p-4">
                <Icon className="h-5 w-5 shrink-0 text-brand-600" />
                <span className="text-sm font-medium text-warm-800">{feature}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/explore" className="btn-primary">Explore map</Link>
          <Link href="/search" className="btn-secondary">Along my route</Link>
          <Link href="/sellers" className="btn-secondary">Meet sellers</Link>
        </div>
      </div>
    </div>
  );
}
