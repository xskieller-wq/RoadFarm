import Link from "next/link";
import { ExternalLink, Sprout } from "lucide-react";
import { GROW_MORE_TOPICS, ROUTEFARM_AREAS } from "@/data/routefarm-structure";

export default function GrowMorePage() {
  const area = ROUTEFARM_AREAS.growMore;

  return (
    <div className="bg-earth-50">
      <div className="border-b border-earth-200 bg-gradient-to-b from-sage-100 to-cream-100">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-200 text-sage-800">
            <Sprout className="h-7 w-7" />
          </div>
          <p className="mt-4 section-label text-sage-700">Future section · separate from marketplace</p>
          <h1 className="mt-2 text-3xl font-bold text-warm-900 sm:text-4xl">{area.label}</h1>
          <p className="mt-4 text-lg text-warm-600">{area.description}</p>
          <Link href="/buy" className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:underline">
            ← Back to buying local products
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-warm-500">
          Placeholder affiliate recommendations — links will be added when this section launches.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GROW_MORE_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="card flex flex-col p-5 opacity-95"
            >
              <span className="text-3xl">{topic.emoji}</span>
              <h2 className="mt-3 text-lg font-bold text-warm-900">{topic.title}</h2>
              <p className="mt-2 flex-1 text-sm text-warm-600">{topic.blurb}</p>
              <button
                type="button"
                disabled
                className="mt-4 inline-flex items-center gap-1 rounded-full bg-warm-100 px-4 py-2 text-xs font-semibold text-warm-500"
              >
                Affiliate link soon
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
