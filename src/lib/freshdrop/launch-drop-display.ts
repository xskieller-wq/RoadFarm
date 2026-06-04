/** Shared copy for launch product cards */
export function freshnessChip(label: string | null): string | null {
  if (!label) return null;
  if (label === "Fresh Batch Time") return "Just dropped";
  if (label === "Made Today") return "Baked today";
  if (label === "Available Now") return "Ready now";
  return label;
}
