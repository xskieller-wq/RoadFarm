-- RouteFarm demo bakery seed
-- Run: npx supabase db reset
-- Demo password for all seeded accounts: RouteFarmDemo1!
--
-- Populates approved sellers, templates, products, and home_feed_items (via products_feed_sync trigger).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Demo auth users (profiles created by on_auth_user_created trigger)
-- Plain INSERTs only — Supabase seed runner splits on ";" and breaks PL/pgSQL functions.
-- ---------------------------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_sent_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'a1000001-0001-4001-8001-000000000001',
    'authenticated', 'authenticated',
    'harbor@demo.routefarm.local',
    crypt('RouteFarmDemo1!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Harbor Street Bakery","role":"seller"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1000001-0001-4001-8001-000000000002',
    'authenticated', 'authenticated',
    'sunrise@demo.routefarm.local',
    crypt('RouteFarmDemo1!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Sunrise Ring Donuts","role":"seller"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1000001-0001-4001-8001-000000000003',
    'authenticated', 'authenticated',
    'loafhouse@demo.routefarm.local',
    crypt('RouteFarmDemo1!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Norridge Loaf House","role":"seller"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1000001-0001-4001-8001-000000000004',
    'authenticated', 'authenticated',
    'celebration@demo.routefarm.local',
    crypt('RouteFarmDemo1!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Celebration Crumb Cakes","role":"seller"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1000001-0001-4001-8001-000000000005',
    'authenticated', 'authenticated',
    'elm@demo.routefarm.local',
    crypt('RouteFarmDemo1!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Elm Park Pastry Kitchen","role":"seller"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a1000001-0001-4001-8001-000000000099',
    'authenticated', 'authenticated',
    'buyer@demo.routefarm.local',
    crypt('RouteFarmDemo1!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Demo Buyer","role":"buyer"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  ('e1000001-0001-4001-8001-000000000001', 'a1000001-0001-4001-8001-000000000001', 'harbor@demo.routefarm.local', '{"sub":"a1000001-0001-4001-8001-000000000001","email":"harbor@demo.routefarm.local"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  ('e1000001-0001-4001-8001-000000000002', 'a1000001-0001-4001-8001-000000000002', 'sunrise@demo.routefarm.local', '{"sub":"a1000001-0001-4001-8001-000000000002","email":"sunrise@demo.routefarm.local"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  ('e1000001-0001-4001-8001-000000000003', 'a1000001-0001-4001-8001-000000000003', 'loafhouse@demo.routefarm.local', '{"sub":"a1000001-0001-4001-8001-000000000003","email":"loafhouse@demo.routefarm.local"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  ('e1000001-0001-4001-8001-000000000004', 'a1000001-0001-4001-8001-000000000004', 'celebration@demo.routefarm.local', '{"sub":"a1000001-0001-4001-8001-000000000004","email":"celebration@demo.routefarm.local"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  ('e1000001-0001-4001-8001-000000000005', 'a1000001-0001-4001-8001-000000000005', 'elm@demo.routefarm.local', '{"sub":"a1000001-0001-4001-8001-000000000005","email":"elm@demo.routefarm.local"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  ('e1000001-0001-4001-8001-000000000099', 'a1000001-0001-4001-8001-000000000099', 'buyer@demo.routefarm.local', '{"sub":"a1000001-0001-4001-8001-000000000099","email":"buyer@demo.routefarm.local"}'::jsonb, 'email', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET
  full_name = 'Harbor Street Bakery',
  email = 'harbor@demo.routefarm.local',
  role = 'seller',
  seller_onboarding_completed_at = NOW()
WHERE id = 'a1000001-0001-4001-8001-000000000001';

UPDATE public.profiles SET
  full_name = 'Sunrise Ring Donuts',
  email = 'sunrise@demo.routefarm.local',
  role = 'seller',
  seller_onboarding_completed_at = NOW()
WHERE id = 'a1000001-0001-4001-8001-000000000002';

UPDATE public.profiles SET
  full_name = 'Norridge Loaf House',
  email = 'loafhouse@demo.routefarm.local',
  role = 'seller',
  seller_onboarding_completed_at = NOW()
WHERE id = 'a1000001-0001-4001-8001-000000000003';

UPDATE public.profiles SET
  full_name = 'Celebration Crumb Cakes',
  email = 'celebration@demo.routefarm.local',
  role = 'seller',
  seller_onboarding_completed_at = NOW()
WHERE id = 'a1000001-0001-4001-8001-000000000004';

UPDATE public.profiles SET
  full_name = 'Elm Park Pastry Kitchen',
  email = 'elm@demo.routefarm.local',
  role = 'seller',
  seller_onboarding_completed_at = NOW()
WHERE id = 'a1000001-0001-4001-8001-000000000005';

UPDATE public.profiles SET
  full_name = 'Demo Buyer',
  email = 'buyer@demo.routefarm.local',
  role = 'buyer',
  buyer_onboarding_completed_at = NOW()
WHERE id = 'a1000001-0001-4001-8001-000000000099';

INSERT INTO public.buyer_profiles (user_id, neighborhood, city, state, preferred_categories, map_radius_miles)
VALUES (
  'a1000001-0001-4001-8001-000000000099',
  'Norridge',
  'Norridge',
  'IL',
  ARRAY['Polish Paczki', 'Bread', 'Donuts', 'Pastries', 'Cookies'],
  12
)
ON CONFLICT (user_id) DO UPDATE SET
  neighborhood = EXCLUDED.neighborhood,
  preferred_categories = EXCLUDED.preferred_categories;

-- ---------------------------------------------------------------------------
-- Approved bakery sellers (pickup locations in Norridge / Park Ridge / Des Plaines)
-- ---------------------------------------------------------------------------
INSERT INTO public.sellers (
  id, user_id, slug, name, tagline, bio, seller_type, city, neighborhood, address,
  lat, lng, avatar_url, cover_photo_url, specialties,
  approval_status, availability_status, verified, featured, rating, review_count
) VALUES
  (
    'b1000001-0001-4001-8001-000000000001',
    'a1000001-0001-4001-8001-000000000001',
    'harbor-street-bakery',
    'Harbor Street Bakery',
    'Polish paczki & morning pastries',
    'Family bakery in Norridge known for traditional Polish paczki and butter pastries. Fresh batch times posted every morning.',
    'Baker',
    'Norridge',
    'Norridge',
    '4521 N Harlem Ave, Norridge, IL 60706',
    41.9654,
    -87.8078,
    'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ARRAY['Polish Paczki', 'Pastries'],
    'approved',
    'available_now',
    TRUE,
    TRUE,
    4.90,
    127
  ),
  (
    'b1000001-0001-4001-8001-000000000002',
    'a1000001-0001-4001-8001-000000000002',
    'sunrise-ring-donuts',
    'Sunrise Ring Donuts',
    'Glazed rings & cake donuts every morning',
    'Neighborhood donut shop in Park Ridge — warm glaze batches with pickup windows before commute hour.',
    'Baker',
    'Park Ridge',
    'South Park Ridge',
    '823 Devon Ave, Park Ridge, IL 60068',
    42.0112,
    -87.8401,
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ARRAY['Donuts'],
    'approved',
    'available_now',
    TRUE,
    TRUE,
    4.80,
    89
  ),
  (
    'b1000001-0001-4001-8001-000000000003',
    'a1000001-0001-4001-8001-000000000003',
    'norridge-loaf-house',
    'Norridge Loaf House',
    'Sourdough, rye & dinner rolls',
    'Small bread bakery with early-morning pulls, sourdough loaves, and soft dinner rolls for same-day pickup.',
    'Baker',
    'Des Plaines',
    'Downtown Des Plaines',
    '1200 Miner St, Des Plaines, IL 60016',
    42.0334,
    -87.8834,
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ARRAY['Bread'],
    'approved',
    'available_today',
    TRUE,
    FALSE,
    4.70,
    156
  ),
  (
    'b1000001-0001-4001-8001-000000000004',
    'a1000001-0001-4001-8001-000000000004',
    'celebration-crumb-cakes',
    'Celebration Crumb Cakes',
    'Custom cakes & celebration bakes',
    'Buttercream cakes, cupcakes, and cookie trays for celebrations — made-to-order with freshness labels.',
    'Baker',
    'Park Ridge',
    'Uptown Park Ridge',
    '15 Main St, Park Ridge, IL 60068',
    42.0118,
    -87.8334,
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ARRAY['Cakes', 'Cookies'],
    'approved',
    'available_today',
    TRUE,
    FALSE,
    5.00,
    203
  ),
  (
    'b1000001-0001-4001-8001-000000000005',
    'a1000001-0001-4001-8001-000000000005',
    'elm-park-pastry-kitchen',
    'Elm Park Pastry Kitchen',
    'Croissants, cookies & afternoon batches',
    'European-style pastries and cookie trays with lunch-hour fresh batch alerts in Harwood Heights.',
    'Baker',
    'Harwood Heights',
    'Harwood Heights',
    '7100 W Lawrence Ave, Harwood Heights, IL 60706',
    41.9689,
    -87.8056,
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ARRAY['Pastries', 'Cookies'],
    'approved',
    'available_now',
    TRUE,
    FALSE,
    4.60,
    74
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seller_onboarding_steps (
  seller_id, business_info, location_set, pickup_hours, first_template, completed_at
)
SELECT id, TRUE, TRUE, TRUE, TRUE, NOW()
FROM public.sellers
WHERE id IN (
  'b1000001-0001-4001-8001-000000000001',
  'b1000001-0001-4001-8001-000000000002',
  'b1000001-0001-4001-8001-000000000003',
  'b1000001-0001-4001-8001-000000000004',
  'b1000001-0001-4001-8001-000000000005'
)
ON CONFLICT (seller_id) DO UPDATE SET
  business_info = TRUE,
  location_set = TRUE,
  pickup_hours = TRUE,
  first_template = TRUE,
  completed_at = NOW();

-- ---------------------------------------------------------------------------
-- Product templates (freshness defaults per category)
-- ---------------------------------------------------------------------------
INSERT INTO public.product_templates (
  id, seller_id, category, title, description,
  default_price_cents, default_freshness_label, default_quantity, image_url, is_active
) VALUES
  ('f1000001-0001-4001-8001-000000000001', 'b1000001-0001-4001-8001-000000000001', 'Polish Paczki', 'Assorted Paczki Dozen', 'Traditional filled paczki — rose, raspberry, custard.', 2800, 'Fresh Batch Time', 12, 'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000002', 'b1000001-0001-4001-8001-000000000001', 'Pastries', 'Butter Croissant (4-pack)', 'Flaky morning croissants.', 1200, 'Made Today', 8, 'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000003', 'b1000001-0001-4001-8001-000000000002', 'Donuts', 'Glazed Ring Dozen', 'Classic ring donuts — not paczki.', 1800, 'Fresh Batch Time', 12, 'https://images.pexels.com/photos/537018/pexels-photo-537018.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000004', 'b1000001-0001-4001-8001-000000000003', 'Bread', 'Country Sourdough Loaf', 'Long-ferment sourdough, baked at dawn.', 950, 'Made Today', 6, 'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000005', 'b1000001-0001-4001-8001-000000000003', 'Bread', 'Soft Dinner Rolls (6)', 'Pull-apart rolls for tonight.', 700, 'Available Now', 10, 'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000006', 'b1000001-0001-4001-8001-000000000004', 'Cakes', 'Vanilla Celebration Slice', 'Single slice of vanilla butter cake.', 650, 'Made To Order', 4, 'https://images.pexels.com/photos/841107/pexels-photo-841107.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000007', 'b1000001-0001-4001-8001-000000000004', 'Cookies', 'Chocolate Chip Tray (12)', 'Bakery-style chocolate chip cookies.', 1400, 'Made Today', 12, 'https://images.pexels.com/photos/841107/pexels-photo-841107.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000008', 'b1000001-0001-4001-8001-000000000005', 'Pastries', 'Almond Croissant', 'Filled almond croissant.', 450, 'Available Now', 8, 'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE),
  ('f1000001-0001-4001-8001-000000000009', 'b1000001-0001-4001-8001-000000000005', 'Cookies', 'Lemon Sugar Cookies (8)', 'Soft lemon sugar cookies.', 900, 'Fresh Batch Time', 8, 'https://images.pexels.com/photos/841107/pexels-photo-841107.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Active products (triggers sync_home_feed_item → home_feed_items)
-- ---------------------------------------------------------------------------
INSERT INTO public.products (
  id, seller_id, template_id, title, description, category,
  price_cents, quantity_available, freshness_label, freshness_batch_time, image_url, sold
) VALUES
  ('c1000001-0001-4001-8001-000000000001', 'b1000001-0001-4001-8001-000000000001', 'f1000001-0001-4001-8001-000000000001', 'Assorted Paczki Dozen', 'Rose, raspberry & custard — this morning batch.', 'Polish Paczki', 2800, 8, 'Fresh Batch Time', 'Today 6:00 AM', 'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000002', 'b1000001-0001-4001-8001-000000000001', 'f1000001-0001-4001-8001-000000000001', 'Cherry Paczki (6)', 'Glazed cherry paczki for pickup.', 'Polish Paczki', 1600, 10, 'Made Today', NULL, 'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000003', 'b1000001-0001-4001-8001-000000000001', 'f1000001-0001-4001-8001-000000000002', 'Butter Croissant (4-pack)', 'Baked before 7 AM.', 'Pastries', 1200, 6, 'Available Now', NULL, 'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000004', 'b1000001-0001-4001-8001-000000000002', 'f1000001-0001-4001-8001-000000000003', 'Glazed Ring Dozen', 'Warm glaze — commute pickup friendly.', 'Donuts', 1800, 5, 'Fresh Batch Time', 'Today 5:45 AM', 'https://images.pexels.com/photos/537018/pexels-photo-537018.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000005', 'b1000001-0001-4001-8001-000000000002', 'f1000001-0001-4001-8001-000000000003', 'Chocolate Cake Donuts (6)', 'Cocoa cake rings with glaze.', 'Donuts', 1500, 7, 'Made Today', NULL, 'https://images.pexels.com/photos/537018/pexels-photo-537018.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000006', 'b1000001-0001-4001-8001-000000000003', 'f1000001-0001-4001-8001-000000000004', 'Country Sourdough Loaf', 'Crusty sourdough from morning pull.', 'Bread', 950, 4, 'Made Today', NULL, 'https://images.pexels.com/photos/33534834/pexels-photo-33534834.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000007', 'b1000001-0001-4001-8001-000000000003', 'f1000001-0001-4001-8001-000000000004', 'Rye Pullman Half Loaf', 'Deli-style rye, sliced.', 'Bread', 800, 6, 'Made To Order', NULL, 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000008', 'b1000001-0001-4001-8001-000000000003', 'f1000001-0001-4001-8001-000000000005', 'Soft Dinner Rolls (6)', 'Pull-apart rolls for tonight.', 'Bread', 700, 9, 'Available Now', NULL, 'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000009', 'b1000001-0001-4001-8001-000000000004', 'f1000001-0001-4001-8001-000000000006', 'Vanilla Celebration Slice', 'Single slice, ready for pickup.', 'Cakes', 650, 5, 'Made To Order', NULL, 'https://images.pexels.com/photos/841107/pexels-photo-841107.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000010', 'b1000001-0001-4001-8001-000000000004', 'f1000001-0001-4001-8001-000000000007', 'Chocolate Chip Tray (12)', 'Party tray, baked this morning.', 'Cookies', 1400, 3, 'Made Today', NULL, 'https://images.pexels.com/photos/841107/pexels-photo-841107.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000011', 'b1000001-0001-4001-8001-000000000005', 'f1000001-0001-4001-8001-000000000008', 'Almond Croissant', 'Afternoon pastry batch.', 'Pastries', 450, 8, 'Available Now', NULL, 'https://images.pexels.com/photos/4828314/pexels-photo-4828314.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE),
  ('c1000001-0001-4001-8001-000000000012', 'b1000001-0001-4001-8001-000000000005', 'f1000001-0001-4001-8001-000000000009', 'Lemon Sugar Cookies (8)', 'Lunch-hour fresh batch.', 'Cookies', 900, 6, 'Fresh Batch Time', 'Today 11:30 AM', 'https://images.pexels.com/photos/841107/pexels-photo-841107.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Validate feed populated
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  feed_count INT;
  seller_count INT;
  product_count INT;
BEGIN
  SELECT COUNT(*) INTO seller_count FROM public.sellers WHERE approval_status = 'approved';
  SELECT COUNT(*) INTO product_count FROM public.products WHERE sold = FALSE;
  SELECT COUNT(*) INTO feed_count FROM public.home_feed_items;

  IF seller_count < 5 THEN
    RAISE EXCEPTION 'RouteFarm seed: expected 5 approved sellers, got %', seller_count;
  END IF;
  IF product_count < 12 THEN
    RAISE EXCEPTION 'RouteFarm seed: expected 12 active products, got %', product_count;
  END IF;
  IF feed_count < 12 THEN
    RAISE EXCEPTION 'RouteFarm seed: expected 12 home_feed_items (check products_feed_sync), got %', feed_count;
  END IF;
END $$;
