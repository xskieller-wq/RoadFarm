import Link from "next/link";
import { Sprout, Camera, Video, Clock, Award, LayoutDashboard, ArrowRight } from "lucide-react";
import { ROUTEFARM_AREAS } from "@/data/routefarm-structure";

const icons = [Sprout, Camera, Video, Clock, Award, LayoutDashboard];

export default function SellPage() {
  const area = ROUTEFARM_AREAS.sellers;

  return (
    <div className="bg-cream-50">
      <div className="border-b border-warm-200 bg-warm-gradient">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="section-label text-sunflower-700">For growers &amp; makers</p>
          <h1 className="mt-2 text-3xl font-bold text-warm-900 sm:text-4xl">{area.cta}</h1>
          <p className="mt-4 text-lg text-warm-600">{area.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="btn-primary inline-flex">
              Start selling
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Grower dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-warm-900">Grower tools</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {area.features.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={feature} className="card flex gap-3 p-4">
                <Icon className="h-5 w-5 shrink-0 text-sunflower-700" />
                <span className="text-sm font-medium text-warm-800">{feature}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 card border-sage-200/60 bg-sage-50/80 p-6">
          <h3 className="font-bold text-warm-900">Pickup availability</h3>
          <p className="mt-2 text-sm text-warm-600">
            Set weekday and weekend windows, mark <strong>Available Today</strong>, or pause with{" "}
            <strong>Vacation Mode</strong> / <strong>Temporarily Unavailable</strong> when you have a day job.
          </p>
        </div>

        <p className="mt-8 text-sm text-warm-500">
          New sellers are reviewed by our team before appearing on the public map.
        </p>
      </div>
    </div>
  );
}
