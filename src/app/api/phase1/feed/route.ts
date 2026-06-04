import { NextResponse } from "next/server";
import { createClient } from "@routefarm/supabase/server";
import { isPhase1SupabaseEnabled } from "@/lib/phase1/config";
import { getHomeFeed } from "@routefarm/database";

export async function GET() {
  if (!isPhase1SupabaseEnabled()) {
    return NextResponse.json({ items: [], source: "mock" });
  }

  try {
    const supabase = await createClient();
    const items = await getHomeFeed(supabase, 32);
    return NextResponse.json({ items, source: "supabase" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Feed error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
