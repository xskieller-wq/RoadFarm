"use client";

import type { ProductPhoto, ProductVideo } from "@/lib/types";

interface ProductMediaEditorProps {
  photos: ProductPhoto[];
  videos: ProductVideo[];
  onPhotosChange: (photos: ProductPhoto[]) => void;
  onVideosChange: (videos: ProductVideo[]) => void;
}

export default function ProductMediaEditor({
  photos,
  videos,
  onPhotosChange,
  onVideosChange,
}: ProductMediaEditorProps) {
  const mainPhoto = photos[0];
  const extraPhotos = photos.slice(1);

  const setMain = (url: string) => {
    onPhotosChange([{ url, type: "product", caption: mainPhoto?.caption }, ...extraPhotos]);
  };

  const addPhoto = () => {
    onPhotosChange([...(photos.length ? photos : [{ url: "", type: "product" as const }]), { url: "", type: "product" }]);
  };

  const updateExtra = (index: number, url: string) => {
    const next = [...extraPhotos];
    next[index] = { ...next[index], url, type: "product" };
    onPhotosChange([mainPhoto ?? { url: "", type: "product" }, ...next]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-warm-700">Main photo URL</label>
        <input
          className="input-field mt-1"
          value={mainPhoto?.url ?? ""}
          onChange={(e) => setMain(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-warm-700">Additional photos</label>
          <button type="button" onClick={addPhoto} className="text-xs font-medium text-brand-700 hover:underline">
            + Add photo
          </button>
        </div>
        {extraPhotos.map((photo, i) => (
          <input
            key={i}
            className="input-field mt-2"
            placeholder={`Extra photo ${i + 2} URL`}
            value={photo.url}
            onChange={(e) => updateExtra(i, e.target.value)}
          />
        ))}
      </div>
      <div>
        <label className="text-sm font-medium text-warm-700">Video URL (optional)</label>
        <input
          className="input-field mt-1"
          value={videos[0]?.url && videos[0].url !== "#" ? videos[0].url : ""}
          onChange={(e) => {
            const url = e.target.value;
            if (!url) {
              onVideosChange([]);
              return;
            }
            onVideosChange([
              {
                url,
                caption: videos[0]?.caption ?? "Product video",
                thumbnail: videos[0]?.thumbnail || mainPhoto?.url || "",
              },
            ]);
          }}
          placeholder="Link to short video"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-warm-700">Video thumbnail URL</label>
        <input
          className="input-field mt-1"
          value={videos[0]?.thumbnail ?? ""}
          onChange={(e) => {
            if (!videos[0]) return;
            onVideosChange([{ ...videos[0], thumbnail: e.target.value }]);
          }}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-warm-700">Video caption</label>
        <input
          className="input-field mt-1"
          value={videos[0]?.caption ?? ""}
          onChange={(e) => {
            if (!videos[0]) return;
            onVideosChange([{ ...videos[0], caption: e.target.value }]);
          }}
        />
      </div>
    </div>
  );
}
