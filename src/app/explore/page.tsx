import ExploreMapClient from "./ExploreMapClient";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="section-label text-sage-700">Neighborhood map</p>
        <h1 className="text-3xl font-bold text-warm-900">Fresh local products near you</h1>
        <p className="mt-2 text-warm-600">
          Every pin is a product from a real neighbor — tomatoes, honey, eggs, flowers, and more.
          Filter by category, see freshness details, then meet the person behind it.
        </p>
      </div>
      <div className="mt-8">
        <ExploreMapClient />
      </div>
    </div>
  );
}
