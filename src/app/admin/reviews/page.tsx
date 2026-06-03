"use client";

import { useMarketplace } from "@/context/MarketplaceContext";

export default function AdminReviewsPage() {
  const { reviews, getSellerById, toggleReviewVisibility } = useMarketplace();

  return (
    <div>
      <h1 className="text-2xl font-bold text-warm-900">Reviews</h1>
      <p className="text-sm text-warm-600">Moderate buyer reviews before they appear publicly</p>

      <div className="mt-6 space-y-3">
        {reviews.map((review) => {
          const seller = getSellerById(review.sellerId);
          return (
            <div key={review.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-warm-900">{review.authorName}</p>
                  <p className="text-xs text-warm-500">
                    {seller?.name} · {review.rating}★ · {review.createdAt.slice(0, 10)}
                  </p>
                  <p className="mt-2 text-sm text-warm-700">&ldquo;{review.text}&rdquo;</p>
                </div>
                <button
                  onClick={() => toggleReviewVisibility(review.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    review.visible ? "bg-sage-100 text-sage-800" : "bg-warm-200 text-warm-600"
                  }`}
                >
                  {review.visible ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
