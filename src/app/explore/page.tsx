import ExploreMapClient from "./ExploreMapClient";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="section-label text-sage-700">Bakery map</p>
        <h1 className="text-3xl font-bold text-warm-900">Fresh bakery near you</h1>
        <p className="mt-2 text-warm-600">
          Every pin is a bakery listing from a real neighbor — paczki, donuts, bread, cakes, pastries, and cookies.
          Filter by category, see batch times and freshness labels, then meet the baker behind it.
        </p>
      </div>
      <div className="mt-8">
        <ExploreMapClient />
      </div>
    </div>
  );
}
