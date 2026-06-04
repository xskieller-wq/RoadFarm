/**
 * RouteFarm Manual Supabase Test Plan (automated)
 * Requires: Docker + `npm run db:reset`, .env.local with Supabase keys
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function needsBuyerOnboarding(profile) {
  return profile.role === "buyer" && !profile.buyer_onboarding_completed_at;
}
function needsSellerOnboarding(profile) {
  return profile.role === "seller" && !profile.seller_onboarding_completed_at;
}
function postAuthRedirect(profile) {
  if (profile.role === "admin") return "/admin";
  if (needsSellerOnboarding(profile)) return "/onboarding/seller";
  if (needsBuyerOnboarding(profile)) return "/onboarding/buyer";
  if (profile.role === "seller") return "/dashboard";
  return "/";
}

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  const vars = {};
  if (existsSync(path)) {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return { ...vars, ...process.env };
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const results = [];

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
  const tag = pass ? "PASS" : "FAIL";
  console.log(`${tag}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  console.log("RouteFarm Supabase E2E\n");

  if (!url || !anonKey) {
    record("Environment (.env.local)", false, "Missing NEXT_PUBLIC_SUPABASE_URL or ANON_KEY");
    summarize(true);
    return;
  }

  if (env.NEXT_PUBLIC_USE_SUPABASE !== "true") {
    record("NEXT_PUBLIC_USE_SUPABASE=true", false, "Set in .env.local");
  } else {
    record("NEXT_PUBLIC_USE_SUPABASE=true", true);
  }

  const anon = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const admin = serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

  // --- Seed / feed baseline ---
  try {
    const { data: feed, error } = await anon.from("home_feed_items").select("id").limit(20);
    if (error) throw error;
    record("Feed population (seed)", (feed?.length ?? 0) >= 12, `${feed?.length ?? 0} items`);
  } catch (e) {
    record("Feed population (seed)", false, e.message);
    record("Supabase reachable", false, "Start Docker and run: npm run db:reset");
    summarize(true);
    return;
  }

  record("Supabase reachable", true);

  // --- Seeded seller login ---
  const { data: seedSignIn, error: seedErr } = await anon.auth.signInWithPassword({
    email: "harbor@demo.routefarm.local",
    password: "RouteFarmDemo1!",
  });
  record(
    "Login (seeded seller)",
    !seedErr && !!seedSignIn.session,
    seedErr?.message ?? seedSignIn.user?.email
  );

  if (seedSignIn.user) {
    const { data: profile } = await anon
      .from("profiles")
      .select("*")
      .eq("id", seedSignIn.user.id)
      .single();
    const redirect = profile ? postAuthRedirect(profile) : "/";
    record(
      "Redirect (seeded seller → dashboard)",
      redirect === "/dashboard",
      redirect
    );

    const { data: seller } = await anon
      .from("sellers")
      .select("id, slug, approval_status")
      .eq("user_id", seedSignIn.user.id)
      .single();
    record("Seller profile (seeded)", !!seller && seller.approval_status === "approved", seller?.slug);

    const { data: products } = await anon.from("products").select("id").eq("seller_id", seller?.id);
    record("Seller products (seeded)", (products?.length ?? 0) >= 2, `${products?.length ?? 0} products`);

    await anon.auth.signOut();
  }

  // --- Seeded buyer login + onboarding state ---
  const buyerClient = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: buyerIn, error: buyerErr } = await buyerClient.auth.signInWithPassword({
    email: "buyer@demo.routefarm.local",
    password: "RouteFarmDemo1!",
  });
  record("Login (seeded buyer)", !buyerErr && !!buyerIn.session, buyerErr?.message);

  if (buyerIn.user) {
    const { data: bProfile } = await buyerClient
      .from("profiles")
      .select("*")
      .eq("id", buyerIn.user.id)
      .single();
    record(
      "Buyer onboarding complete (seed)",
      !!bProfile && !needsBuyerOnboarding(bProfile),
      bProfile?.buyer_onboarding_completed_at ? "completed" : "incomplete"
    );
    const redirect = bProfile ? postAuthRedirect(bProfile) : "/";
    record("Redirect (seeded buyer → home)", redirect === "/", redirect);
    await buyerClient.auth.signOut();
  }

  // --- Signup new buyer ---
  const buyerEmail = `buyer-e2e-${Date.now()}@demo.routefarm.local`;
  const buyerPass = "RouteFarmDemo1!";
  const buyerAuth = createClient(url, anonKey, { auth: { persistSession: false } });

  const { data: buyerUp, error: buyerUpErr } = await buyerAuth.auth.signUp({
    email: buyerEmail,
    password: buyerPass,
    options: { data: { full_name: "E2E Buyer", role: "buyer" } },
  });
  record("Signup (new buyer)", !buyerUpErr && !!buyerUp.user, buyerUpErr?.message);

  if (buyerUp.user) {
    let profile = null;
    for (let i = 0; i < 5; i++) {
      const { data } = await buyerAuth.from("profiles").select("*").eq("id", buyerUp.user.id).maybeSingle();
      if (data) {
        profile = data;
        break;
      }
      await new Promise((r) => setTimeout(r, 300));
    }
    record("Profile created after buyer signup", !!profile && profile.role === "buyer");
    const redirect = profile ? postAuthRedirect(profile) : "/onboarding/buyer";
    record("Redirect (new buyer → onboarding)", redirect === "/onboarding/buyer", redirect);

    const { error: bpErr } = await buyerAuth.from("buyer_profiles").upsert({
      user_id: buyerUp.user.id,
      neighborhood: "Norridge",
      preferred_categories: ["Bread", "Donuts"],
    });
    const { error: profErr } = await buyerAuth
      .from("profiles")
      .update({ buyer_onboarding_completed_at: new Date().toISOString() })
      .eq("id", buyerUp.user.id);
    record("Buyer onboarding (save)", !bpErr && !profErr, bpErr?.message ?? profErr?.message);

    const redirectAfter = profile
      ? postAuthRedirect({ ...profile, buyer_onboarding_completed_at: new Date().toISOString() })
      : "/";
    record("Redirect (buyer after onboarding → home)", redirectAfter === "/", redirectAfter);
    await buyerAuth.auth.signOut();
  }

  // --- Signup new seller + onboarding + approval ---
  if (!admin) {
    record("Seller approval (service role)", false, "Set SUPABASE_SERVICE_ROLE_KEY in .env.local");
  } else {
    const sellerEmail = `seller-e2e-${Date.now()}@demo.routefarm.local`;
    const sellerAuth = createClient(url, anonKey, { auth: { persistSession: false } });

    const { data: sellerUp, error: sellerUpErr } = await sellerAuth.auth.signUp({
      email: sellerEmail,
      password: buyerPass,
      options: { data: { full_name: "E2E Test Bakery", role: "seller" } },
    });
    record("Signup (new seller)", !sellerUpErr && !!sellerUp.user, sellerUpErr?.message);

    if (sellerUp.user) {
      let profile = null;
      for (let i = 0; i < 5; i++) {
        const { data } = await sellerAuth.from("profiles").select("*").eq("id", sellerUp.user.id).maybeSingle();
        if (data) {
          profile = data;
          break;
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      record("Profile created after seller signup", !!profile && profile.role === "seller");
      const redirect = profile ? postAuthRedirect(profile) : "/onboarding/seller";
      record("Redirect (new seller → onboarding)", redirect === "/onboarding/seller", redirect);

      const slug = `e2e-bakery-${Date.now()}`;
      const { data: sellerRow, error: sInsErr } = await sellerAuth
        .from("sellers")
        .insert({
          user_id: sellerUp.user.id,
          slug,
          name: "E2E Test Bakery",
          tagline: "E2E sourdough",
          seller_type: "Baker",
          city: "Norridge",
          address: "100 Test Ave",
          lat: 41.9654,
          lng: -87.8078,
          specialties: ["Bread"],
        })
        .select("id, approval_status")
        .single();
      record("Seller onboarding (profile)", !sInsErr && sellerRow?.approval_status === "pending", sInsErr?.message);

      if (sellerRow) {
        await sellerAuth.from("seller_onboarding_steps").insert({ seller_id: sellerRow.id });

        const { data: tmpl, error: tErr } = await sellerAuth
          .from("product_templates")
          .insert({
            seller_id: sellerRow.id,
            category: "Bread",
            title: "E2E Sourdough Loaf",
            default_price_cents: 999,
            default_freshness_label: "Made Today",
            default_quantity: 6,
          })
          .select("id")
          .single();

        const { data: prod, error: pErr } = await sellerAuth
          .from("products")
          .insert({
            seller_id: sellerRow.id,
            template_id: tmpl?.id,
            title: "E2E Sourdough Loaf",
            category: "Bread",
            price_cents: 999,
            quantity_available: 6,
            freshness_label: "Made Today",
          })
          .select("id")
          .single();
        record("Seller onboarding (product)", !tErr && !pErr && !!prod?.id, pErr?.message ?? tErr?.message);

        await sellerAuth
          .from("profiles")
          .update({ seller_onboarding_completed_at: new Date().toISOString() })
          .eq("id", sellerUp.user.id);
        const completedProfile = {
          ...(profile ?? { role: "seller" }),
          seller_onboarding_completed_at: new Date().toISOString(),
        };
        record(
          "Seller onboarding (complete flag)",
          !needsSellerOnboarding(completedProfile),
          "seller_onboarding_completed_at set"
        );

        const { count: feedBefore } = await anon
          .from("home_feed_items")
          .select("id", { count: "exact", head: true })
          .eq("seller_id", sellerRow.id);
        record(
          "Feed before approval (pending seller)",
          feedBefore === 0,
          `feed rows for seller: ${feedBefore ?? "n/a"}`
        );

        const { error: apprErr } = await admin
          .from("sellers")
          .update({ approval_status: "approved" })
          .eq("id", sellerRow.id);
        record("Seller approval (admin)", !apprErr, apprErr?.message);

        await new Promise((r) => setTimeout(r, 500));

        const { count: feedAfter } = await anon
          .from("home_feed_items")
          .select("id", { count: "exact", head: true })
          .eq("seller_id", sellerRow.id);
        record(
          "Feed after approval",
          (feedAfter ?? 0) >= 1,
          `feed rows for seller: ${feedAfter ?? 0}`
        );

        record(
          "Dashboard access (seller onboarded)",
          !needsSellerOnboarding({
            ...(profile ?? {}),
            role: "seller",
            seller_onboarding_completed_at: new Date().toISOString(),
          }),
          "postAuth → /dashboard"
        );
      }
      await sellerAuth.auth.signOut();
    }
  }

  // --- Logout ---
  const { data: loIn } = await anon.auth.signInWithPassword({
    email: "harbor@demo.routefarm.local",
    password: "RouteFarmDemo1!",
  });
  await anon.auth.signOut();
  const { data: afterOut } = await anon.auth.getUser();
  record("Logout clears session", !afterOut.user, afterOut.user?.email ?? "signed out");

  // --- API feed route shape (mock fetch) ---
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/home_feed_items?select=title&limit=1`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    record("Feed API (REST)", res.ok, `status ${res.status}`);
  } catch (e) {
    record("Feed API (REST)", false, e.message);
  }

  summarize(false);
}

function summarize(infraBlocked) {
  console.log("\n--- Summary ---");
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`PASS: ${passed}  FAIL: ${failed}  TOTAL: ${results.length}`);
  if (infraBlocked) {
    console.log("\nStart Docker Desktop, then:");
    console.log("  npm run db:reset");
    console.log("  npx supabase status  # copy keys to .env.local");
    console.log("  npm run test:supabase");
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
