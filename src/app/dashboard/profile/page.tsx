"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSellerDashboard } from "@/lib/use-seller-dashboard";
import SellerPhotoEditor from "@/components/dashboard/SellerPhotoEditor";
import SellerVideoEditor from "@/components/dashboard/SellerVideoEditor";

export default function SellerProfilePage() {
  const { seller, updateSeller, syncProductPickupFromSeller } = useSellerDashboard();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [gardenPhotos, setGardenPhotos] = useState(seller?.gardenPhotos ?? []);
  const [flowerPhotos, setFlowerPhotos] = useState(seller?.flowerPhotos ?? []);
  const [greenhousePhotos, setGreenhousePhotos] = useState(seller?.greenhousePhotos ?? []);
  const [videos, setVideos] = useState(seller?.videos ?? []);

  useEffect(() => {
    if (!seller) return;
    setName(seller.name);
    setTagline(seller.tagline);
    setBio(seller.bio);
    setCity(seller.city);
    setAddress(seller.address);
    setAvatar(seller.avatar);
    setCoverPhoto(seller.coverPhoto);
    setGardenPhotos(seller.gardenPhotos);
    setFlowerPhotos(seller.flowerPhotos);
    setGreenhousePhotos(seller.greenhousePhotos);
    setVideos(seller.videos);
  }, [seller]);

  if (!seller) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeller(seller.id, {
      name,
      tagline,
      bio,
      city,
      address,
      avatar,
      coverPhoto,
      pickupLocation: address,
      gardenPhotos: gardenPhotos.filter((p) => p.url.trim()),
      flowerPhotos: flowerPhotos.filter((p) => p.url.trim()),
      greenhousePhotos: greenhousePhotos.filter((p) => p.url.trim()),
      videos: videos.filter((v) => v.thumbnail.trim()),
    });
    syncProductPickupFromSeller({ pickupLocation: address, pickupHours: seller.pickupHours });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-warm-900">Profile</h2>
        <p className="mt-1 text-sm text-warm-600">
          Your public seller page, map listings, and buyer trust all use this information.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl bg-sage-100 px-4 py-3 text-sm font-medium text-sage-800">
          Profile saved — visible on your seller page and across the marketplace.
        </div>
      )}

      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-warm-900">Basics</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-warm-700">Business / your name</label>
            <input className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-warm-700">City</label>
            <input className="input-field mt-1" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Tagline</label>
          <input className="input-field mt-1" value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Bio</label>
          <textarea className="input-field mt-1 min-h-[120px]" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Pickup address</label>
          <input className="input-field mt-1" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-warm-900">Profile images</h3>
        <div className="flex flex-wrap gap-6">
          {avatar && (
            <div>
              <p className="text-xs text-warm-500 mb-1">Avatar preview</p>
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-white shadow">
                <Image src={avatar} alt="" fill className="object-cover" sizes="80px" />
              </div>
            </div>
          )}
          {coverPhoto && (
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs text-warm-500 mb-1">Cover preview</p>
              <div className="relative h-20 w-full max-w-md overflow-hidden rounded-xl bg-warm-100">
                <Image src={coverPhoto} alt="" fill className="object-cover" sizes="400px" />
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Avatar URL</label>
          <input className="input-field mt-1" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-warm-700">Cover photo URL</label>
          <input className="input-field mt-1" value={coverPhoto} onChange={(e) => setCoverPhoto(e.target.value)} />
        </div>
      </div>

      <div className="card p-6 space-y-8">
        <h3 className="font-semibold text-warm-900">Garden & workspace photos</h3>
        <SellerPhotoEditor label="Garden photos" photos={gardenPhotos} onChange={setGardenPhotos} defaultType="garden" />
        <SellerPhotoEditor label="Flower photos" photos={flowerPhotos} onChange={setFlowerPhotos} defaultType="flower" />
        <SellerPhotoEditor
          label="Greenhouse / farm photos"
          photos={greenhousePhotos}
          onChange={setGreenhousePhotos}
          defaultType="greenhouse"
        />
      </div>

      <div className="card p-6">
        <SellerVideoEditor videos={videos} onChange={setVideos} defaultThumbnail={coverPhoto || avatar} />
      </div>

      <button type="submit" className="btn-primary">
        Save profile
      </button>
    </form>
  );
}
