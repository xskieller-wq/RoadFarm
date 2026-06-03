"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMarketplace } from "@/context/MarketplaceContext";
import { SELLER_BADGES, ALL_BADGE_IDS } from "@/data/badges";
import type { SellerAvailabilityStatus, SellerBadgeId } from "@/lib/types";
import SellerAvailabilitySelect from "@/components/forms/SellerAvailabilitySelect";
import { useState } from "react";

export default function AdminEditSellerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getSellerById, updateSeller, setBadges } = useMarketplace();
  const seller = getSellerById(id);
  const [availability, setAvailability] = useState<SellerAvailabilityStatus>(
    seller?.availabilityStatus ?? "available_today"
  );

  if (!seller) {
    return <p className="text-warm-600">Seller not found.</p>;
  }

  const toggleBadge = (badgeId: SellerBadgeId) => {
    const next = seller.badges.includes(badgeId)
      ? seller.badges.filter((b) => b !== badgeId)
      : [...seller.badges, badgeId];
    setBadges(seller.id, next);
  };

  return (
    <div>
      <Link href="/admin/sellers" className="text-sm text-brand-700 hover:underline">← Back to sellers</Link>
      <h1 className="mt-4 text-2xl font-bold text-warm-900">Edit {seller.name}</h1>

      <form
        className="mt-6 space-y-4 card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const videoCaption = (fd.get("videoCaption") as string) || "Garden tour";
          const videoThumb = (fd.get("videoThumbnail") as string) || seller.coverPhoto;
          const videoUrl = (fd.get("videoUrl") as string) || "#";
          updateSeller(seller.id, {
            name: fd.get("name") as string,
            tagline: fd.get("tagline") as string,
            bio: fd.get("bio") as string,
            city: fd.get("city") as string,
            avatar: fd.get("avatar") as string,
            coverPhoto: fd.get("coverPhoto") as string,
            availabilityStatus: availability,
            videos: videoThumb
              ? [
                  {
                    url: videoUrl,
                    type: "garden_walkthrough",
                    caption: videoCaption,
                    thumbnail: videoThumb,
                    duration: "0:45",
                  },
                  ...seller.videos.slice(1),
                ]
              : seller.videos,
          });
          router.push("/admin/sellers");
        }}
      >
        <div>
          <label className="text-sm font-medium text-warm-700">Name</label>
          <input name="name" defaultValue={seller.name} className="input-field mt-1" required />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Tagline</label>
          <input name="tagline" defaultValue={seller.tagline} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Bio</label>
          <textarea name="bio" defaultValue={seller.bio} className="input-field mt-1 min-h-[100px]" />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">City</label>
          <input name="city" defaultValue={seller.city} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Avatar URL</label>
          <input name="avatar" defaultValue={seller.avatar} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Cover photo URL</label>
          <input name="coverPhoto" defaultValue={seller.coverPhoto} className="input-field mt-1" />
        </div>

        <div>
          <p className="text-sm font-medium text-warm-700">Pickup availability</p>
          <p className="mt-1 text-xs text-warm-500">Controls map visibility — not product freshness</p>
          <div className="mt-3">
            <SellerAvailabilitySelect value={availability} onChange={setAvailability} compact />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-warm-700">Video URL</label>
            <input
              name="videoUrl"
              defaultValue={seller.videos[0]?.url !== "#" ? seller.videos[0]?.url : ""}
              className="input-field mt-1"
              placeholder="Short tour video link"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-warm-700">Video thumbnail URL</label>
            <input
              name="videoThumbnail"
              defaultValue={seller.videos[0]?.thumbnail ?? ""}
              className="input-field mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Video caption</label>
          <input name="videoCaption" defaultValue={seller.videos[0]?.caption ?? ""} className="input-field mt-1" />
        </div>

        <div>
          <p className="text-sm font-medium text-warm-700">Badges</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALL_BADGE_IDS.map((badgeId) => {
              const b = SELLER_BADGES[badgeId];
              const active = seller.badges.includes(badgeId);
              return (
                <button
                  key={badgeId}
                  type="button"
                  onClick={() => toggleBadge(badgeId)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${
                    active ? "bg-brand-50 text-brand-800 ring-brand-200" : "bg-warm-50 text-warm-600 ring-warm-200"
                  }`}
                >
                  {b.emoji} {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn-primary">Save changes</button>
      </form>
    </div>
  );
}
