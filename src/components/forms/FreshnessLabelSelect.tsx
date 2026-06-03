"use client";

import type { FreshnessLabel } from "@/lib/types";
import { FRESHNESS_LABEL_OPTIONS } from "@/lib/freshness";

interface FreshnessLabelSelectProps {
  value: FreshnessLabel;
  onChange: (value: FreshnessLabel) => void;
}

export default function FreshnessLabelSelect({ value, onChange }: FreshnessLabelSelectProps) {
  return (
    <select
      className="input-field"
      value={value}
      onChange={(e) => onChange(e.target.value as FreshnessLabel)}
    >
      {FRESHNESS_LABEL_OPTIONS.map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  );
}
