"use client";

import Image from "next/image";
import type { SellerPhoto, SellerPhotoType } from "@/lib/types";

interface SellerPhotoEditorProps {
  label: string;
  photos: SellerPhoto[];
  onChange: (photos: SellerPhoto[]) => void;
  defaultType?: SellerPhotoType;
}

export default function SellerPhotoEditor({
  label,
  photos,
  onChange,
  defaultType = "garden",
}: SellerPhotoEditorProps) {
  const addPhoto = () => {
    onChange([...photos, { url: "", type: defaultType, caption: "" }]);
  };

  const updatePhoto = (index: number, patch: Partial<SellerPhoto>) => {
    onChange(photos.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-warm-900">{label}</p>
        <button type="button" onClick={addPhoto} className="text-xs font-medium text-brand-700 hover:underline">
          + Add photo
        </button>
      </div>
      <p className="mt-1 text-xs text-warm-500">Paste image URLs (Pexels, your hosting, etc.)</p>
      <div className="mt-3 space-y-3">
        {photos.map((photo, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-warm-200 bg-warm-50/50 p-3">
            {photo.url && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-warm-100">
                <Image src={photo.url} alt="" fill className="object-cover" sizes="64px" />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <input
                className="input-field"
                placeholder="Image URL"
                value={photo.url}
                onChange={(e) => updatePhoto(i, { url: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Caption (optional)"
                value={photo.caption ?? ""}
                onChange={(e) => updatePhoto(i, { caption: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        {photos.length === 0 && (
          <p className="text-sm text-warm-500">No photos yet. Add your first garden or workspace photo.</p>
        )}
      </div>
    </div>
  );
}
