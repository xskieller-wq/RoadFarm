"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { SellerVideo, SellerVideoType } from "@/lib/types";
import { VIDEO_TYPE_LABELS } from "@/data/seller-media";

const VIDEO_TYPES = Object.keys(VIDEO_TYPE_LABELS) as SellerVideoType[];

interface SellerVideoEditorProps {
  videos: SellerVideo[];
  onChange: (videos: SellerVideo[]) => void;
  defaultThumbnail?: string;
}

export default function SellerVideoEditor({
  videos,
  onChange,
  defaultThumbnail = "",
}: SellerVideoEditorProps) {
  const addVideo = () => {
    onChange([
      ...videos,
      {
        url: "",
        type: "garden_walkthrough",
        caption: "",
        thumbnail: defaultThumbnail,
        duration: "0:45",
      },
    ]);
  };

  const updateVideo = (index: number, patch: Partial<SellerVideo>) => {
    onChange(videos.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const removeVideo = (index: number) => {
    onChange(videos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-warm-900">Short videos</p>
        <button type="button" onClick={addVideo} className="btn-secondary text-xs py-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add video
        </button>
      </div>
      <p className="mt-1 text-xs text-warm-500">
        Garden tours, harvest clips, bouquet making — paste video and thumbnail URLs
      </p>
      <div className="mt-3 space-y-4">
        {videos.map((vid, i) => (
          <div key={i} className="rounded-xl border border-warm-200 bg-white p-4 space-y-3">
            {vid.thumbnail && (
              <div className="relative aspect-video max-w-xs overflow-hidden rounded-lg bg-warm-900">
                <Image src={vid.thumbnail} alt="" fill className="object-cover opacity-90" sizes="320px" />
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-warm-600">Type</label>
                <select
                  className="input-field mt-1"
                  value={vid.type}
                  onChange={(e) => updateVideo(i, { type: e.target.value as SellerVideoType })}
                >
                  {VIDEO_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {VIDEO_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-warm-600">Duration</label>
                <input
                  className="input-field mt-1"
                  value={vid.duration ?? ""}
                  onChange={(e) => updateVideo(i, { duration: e.target.value })}
                  placeholder="0:45"
                />
              </div>
            </div>
            <input
              className="input-field"
              placeholder="Video URL (MP4 or hosted link)"
              value={vid.url === "#" ? "" : vid.url}
              onChange={(e) => updateVideo(i, { url: e.target.value || "#" })}
            />
            <input
              className="input-field"
              placeholder="Thumbnail image URL"
              value={vid.thumbnail}
              onChange={(e) => updateVideo(i, { thumbnail: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Caption"
              value={vid.caption}
              onChange={(e) => updateVideo(i, { caption: e.target.value })}
            />
            <button type="button" onClick={() => removeVideo(i)} className="text-xs text-red-600 hover:underline">
              Remove video
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
