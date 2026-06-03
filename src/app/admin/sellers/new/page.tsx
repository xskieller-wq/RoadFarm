"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMarketplace } from "@/context/MarketplaceContext";
import { sellerAvatar, sellerCover } from "@/data/images";
import type { SellerType } from "@/lib/types";

export default function AdminNewSellerPage() {
  const router = useRouter();
  const { addSeller, sellers } = useMarketplace();

  return (
    <div>
      <Link href="/admin/sellers" className="text-sm text-brand-700 hover:underline">← Back to sellers</Link>
      <h1 className="mt-4 text-2xl font-bold text-warm-900">Add seller manually</h1>
      <p className="text-sm text-warm-600">Onboard a local grower before public launch</p>

      <form
        className="mt-6 card space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const idx = sellers.length;
          addSeller({
            name: fd.get("name") as string,
            slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
            tagline: fd.get("tagline") as string,
            bio: fd.get("bio") as string,
            sellerType: (fd.get("sellerType") as SellerType) || "Gardener",
            avatar: sellerAvatar(idx),
            coverPhoto: sellerCover("garden"),
            gardenPhotos: [],
            flowerPhotos: [],
            greenhousePhotos: [],
            videos: [],
            city: fd.get("city") as string,
            neighborhood: fd.get("city") as string,
            address: fd.get("address") as string,
            lat: 41.96 + Math.random() * 0.06,
            lng: -87.87 + Math.random() * 0.06,
            rating: 5,
            reviewCount: 0,
            memberSince: new Date().toISOString().slice(0, 10),
            verified: false,
            badges: ["new_grower"],
            featured: false,
            approvalStatus: "pending",
            pickupLocation: fd.get("address") as string,
            pickupHours: [],
            availabilityStatus: "available_today",
            weekdayPickup: { open: "5:00 PM", close: "8:00 PM" },
            weekendPickup: { open: "8:00 AM", close: "2:00 PM" },
            specialties: ["Vegetables"],
            requiresCompliance: false,
          });
          router.push("/admin/sellers");
        }}
      >
        <input name="name" placeholder="Seller name" className="input-field" required />
        <input name="tagline" placeholder="Tagline" className="input-field" />
        <textarea name="bio" placeholder="Bio" className="input-field min-h-[80px]" />
        <input name="city" placeholder="City (e.g. Norridge)" className="input-field" required />
        <input name="address" placeholder="Pickup address" className="input-field" />
        <select name="sellerType" className="input-field">
          <option value="Gardener">Gardener</option>
          <option value="Flower Grower">Flower Grower</option>
          <option value="Florist">Florist</option>
          <option value="Beekeeper">Beekeeper</option>
          <option value="Orchard Grower">Orchard Grower</option>
          <option value="Small Producer">Small Producer</option>
        </select>
        <button type="submit" className="btn-primary">Create seller</button>
      </form>
    </div>
  );
}
