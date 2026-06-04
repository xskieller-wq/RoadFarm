/**
 * Verify home_feed_items after `npm run db:reset`.
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local if present.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return {};
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return vars;
}

const env = { ...loadEnvLocal(), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const feedUrl = `${url.replace(/\/$/, "")}/rest/v1/home_feed_items?select=title,seller_name,category&order=sort_score.desc`;
const res = await fetch(feedUrl, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
});

if (!res.ok) {
  console.error("Feed request failed:", res.status, await res.text());
  process.exit(1);
}

const items = await res.json();
console.log(`home_feed_items: ${items.length} rows`);
for (const row of items.slice(0, 5)) {
  console.log(`  - ${row.title} (${row.category}) · ${row.seller_name}`);
}

if (items.length < 12) {
  console.error(`Expected at least 12 feed items after seed, got ${items.length}`);
  process.exit(1);
}

console.log("Seed feed verification passed.");
