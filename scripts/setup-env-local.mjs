/**
 * Writes .env.local from `npx supabase status -o env` (requires Docker + supabase start).
 */
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { resolve } from "path";

function parseEnvBlock(text) {
  const map = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) map[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return map;
}

try {
  const out = execSync("npx supabase status -o env", {
    encoding: "utf8",
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  const raw = parseEnvBlock(out.trim());
  const apiUrl = raw.API_URL || raw.REST_URL?.replace(/\/rest\/v1\/?$/, "") || "http://127.0.0.1:54321";
  const anonKey = raw.ANON_KEY || raw.PUBLISHABLE_KEY || "";
  const serviceKey = raw.SERVICE_ROLE_KEY || raw.SECRET_KEY || "";

  if (!anonKey) {
    throw new Error("No ANON_KEY or PUBLISHABLE_KEY in supabase status output");
  }

  const lines = [
    "NEXT_PUBLIC_USE_SUPABASE=true",
    `NEXT_PUBLIC_SUPABASE_URL=${apiUrl}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`,
    serviceKey ? `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}` : "",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const target = resolve(process.cwd(), ".env.local");
  writeFileSync(target, lines);
  console.log(`Wrote ${target}`);
  console.log("Run: npm run test:supabase");
} catch (e) {
  console.error("Could not read supabase status. Start Docker Desktop, then:");
  console.error("  npx supabase start");
  console.error("  npm run db:reset");
  console.error("  npm run setup:env");
  console.error(e.message ?? e);
  process.exit(1);
}
