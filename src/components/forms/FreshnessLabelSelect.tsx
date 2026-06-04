"use client";

import type { FreshnessLabel, ProductCategory } from "@/lib/types";
import { getFreshnessOptionsForCategory } from "@/lib/freshness";

interface FreshnessLabelSelectProps {
  value: FreshnessLabel;
  onChange: (value: FreshnessLabel) => void;
  category?: ProductCategory;
}

export default function FreshnessLabelSelect({ value, onChange, category }: FreshnessLabelSelectProps) {
  const options = category ? getFreshnessOptionsForCategory(category) : getFreshnessOptionsForCategory("Bread");

  return (
    <select
      className="input-field"
      value={value}
      onChange={(e) => onChange(e.target.value as FreshnessLabel)}
    >
      {options.map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  );
}
