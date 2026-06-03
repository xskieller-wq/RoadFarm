import type { ProductCategory } from "@/lib/types";
import { sized, IMG } from "@/data/images";

export const HERO_IMAGE = sized(IMG.hero, 2400, 1400);

export const PEOPLE_AT_WORK = [
  { image: sized(IMG.personHarvest, 600, 800), caption: "Harvesting vegetables" },
  { image: sized(IMG.vegetables, 600, 800), caption: "Garden vegetables" },
  { image: sized(IMG.fruitTree, 600, 800), caption: "Fruit trees in season" },
  { image: sized(IMG.personGarden, 600, 800), caption: "Working in the garden" },
  { image: sized(IMG.personEggs, 600, 800), caption: "Collecting fresh eggs" },
  { image: sized(IMG.beekeeper, 600, 800), caption: "Local beekeepers" },
  { image: sized(IMG.baker, 600, 800), caption: "Fresh baked goods" },
  { image: sized(IMG.bouquetMaking, 600, 800), caption: "Making bouquets" },
  { image: sized(IMG.personFlorist, 600, 800), caption: "Cutting fresh flowers" },
] as const;

export const CATEGORY_TILES: {
  label: string;
  category: ProductCategory;
  image: string;
  tagline: string;
  accent: "blossom" | "lavender" | "sunflower" | "tomato" | "sage";
}[] = [
  { label: "Garden Vegetables", category: "Vegetables", image: sized(IMG.tomatoes, 800, 1000), tagline: "Tomatoes, greens & seasonal picks", accent: "sage" },
  { label: "Farm Eggs", category: "Eggs", image: sized(IMG.eggs, 800, 1000), tagline: "Collected this morning", accent: "sunflower" },
  { label: "Orchard Fruit", category: "Fruits", image: sized(IMG.orchard, 800, 1000), tagline: "Apples, berries & stone fruit", accent: "tomato" },
  { label: "Local Honey", category: "Honey", image: sized(IMG.honey, 800, 1000), tagline: "Raw & neighborhood-made", accent: "sunflower" },
  { label: "Garden Herbs", category: "Herbs", image: sized(IMG.herbs, 800, 1000), tagline: "Fragrant & fresh-cut", accent: "sage" },
  { label: "Fresh Flowers", category: "Fresh Flowers", image: sized(IMG.flowers, 800, 1000), tagline: "Cut today, on your way", accent: "lavender" },
  { label: "Handmade Bouquets", category: "Bouquets", image: sized(IMG.bouquet, 800, 1000), tagline: "Made to order by neighbors", accent: "blossom" },
  { label: "Pickled & Fermented", category: "Pickled Foods", image: sized(IMG.pickles, 800, 1000), tagline: "Small-batch pantry goods", accent: "tomato" },
];

export const VISUAL_SECTIONS = {
  garden: {
    image: sized(IMG.personHarvest, 1200, 1600),
    title: "Vegetables growing in neighborhood gardens",
    subtitle: "Tomatoes on the vine, salad greens, herbs, and cucumbers — from people who grow where they live.",
  },
  orchard: {
    image: sized(IMG.orchard, 1200, 1600),
    title: "Fruit trees & seasonal harvests",
    subtitle: "Apples, berries, and orchard fruit picked at peak ripeness along your route.",
  },
  flowers: {
    image: sized(IMG.personFlorist, 1200, 1600),
    title: "Flowers & bouquets — part of the mix",
    subtitle: "Fresh-cut stems and handcrafted bouquets from local growers and florists.",
  },
  community: {
    image: sized(IMG.personGarden, 2400, 1200),
    title: "Real people. Real gardens. Real freshness.",
    subtitle: "Growers, beekeepers, bakers, and makers — pickup windows that fit life around a day job.",
  },
};

export function categoryResultsHref(category: ProductCategory): string {
  const params = new URLSearchParams({
    start: "Norridge, IL",
    destination: "Des Plaines, IL",
    maxDetour: "10",
    category,
  });
  return `/results?${params.toString()}`;
}
