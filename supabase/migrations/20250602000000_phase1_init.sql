-- RouteFarm Phase 1: Auth profiles, onboarding, sellers, templates, feed
-- Requires: Supabase project with Postgres 15+

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ---------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'admin');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'buyer',
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  buyer_onboarding_completed_at TIMESTAMPTZ,
  seller_onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.buyer_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  neighborhood TEXT,
  city TEXT DEFAULT 'Norridge',
  state TEXT DEFAULT 'IL',
  preferred_categories TEXT[] DEFAULT '{}',
  map_radius_miles INT DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Sellers
-- ---------------------------------------------------------------------------
CREATE TYPE public.seller_type AS ENUM (
  'Baker', 'Gardener', 'Flower Grower', 'Beekeeper',
  'Small Producer', 'Orchard Grower', 'Florist'
);

CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE public.availability_status AS ENUM (
  'available_now', 'available_today', 'pickup_by_appointment',
  'temporarily_unavailable', 'vacation'
);

CREATE TABLE public.sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  seller_type public.seller_type NOT NULL DEFAULT 'Baker',
  city TEXT NOT NULL,
  neighborhood TEXT,
  address TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  avatar_url TEXT,
  cover_photo_url TEXT,
  specialties TEXT[] DEFAULT '{}',
  approval_status public.approval_status NOT NULL DEFAULT 'pending',
  availability_status public.availability_status NOT NULL DEFAULT 'available_today',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  requires_compliance BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX sellers_location_idx ON public.sellers USING GIST (location);
CREATE INDEX sellers_approval_idx ON public.sellers (approval_status);

CREATE TABLE public.seller_onboarding_steps (
  seller_id UUID PRIMARY KEY REFERENCES public.sellers(id) ON DELETE CASCADE,
  business_info BOOLEAN NOT NULL DEFAULT FALSE,
  location_set BOOLEAN NOT NULL DEFAULT FALSE,
  pickup_hours BOOLEAN NOT NULL DEFAULT FALSE,
  first_template BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Product templates & products
-- ---------------------------------------------------------------------------
CREATE TABLE public.product_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  default_price_cents INT NOT NULL DEFAULT 0,
  default_freshness_label TEXT,
  default_quantity INT DEFAULT 12,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.product_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_cents INT NOT NULL,
  quantity_available INT NOT NULL DEFAULT 0,
  freshness_label TEXT,
  freshness_batch_time TEXT,
  image_url TEXT,
  sold BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX products_seller_idx ON public.products (seller_id);
CREATE INDEX products_category_idx ON public.products (category);

-- ---------------------------------------------------------------------------
-- Home feed (denormalized for fast reads)
-- ---------------------------------------------------------------------------
CREATE TABLE public.home_feed_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price_cents INT NOT NULL,
  freshness_label TEXT,
  image_url TEXT,
  seller_name TEXT NOT NULL,
  seller_slug TEXT NOT NULL,
  seller_city TEXT,
  sort_score NUMERIC NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id)
);

CREATE INDEX home_feed_sort_idx ON public.home_feed_items (sort_score DESC, published_at DESC);

-- ---------------------------------------------------------------------------
-- Triggers: profile on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(
      CASE NEW.raw_user_meta_data->>'role'
        WHEN 'seller' THEN 'seller'::public.user_role
        WHEN 'admin' THEN 'admin'::public.user_role
        ELSE 'buyer'::public.user_role
      END,
      'buyer'::public.user_role
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.sellers_set_location()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER sellers_location_before_ins_upd
  BEFORE INSERT OR UPDATE OF lat, lng ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION public.sellers_set_location();

-- Feed sync when product published
CREATE OR REPLACE FUNCTION public.sync_home_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  s public.sellers%ROWTYPE;
BEGIN
  SELECT * INTO s FROM public.sellers WHERE id = NEW.seller_id;
  IF NEW.sold OR s.approval_status <> 'approved' THEN
    DELETE FROM public.home_feed_items WHERE product_id = NEW.id;
    RETURN NEW;
  END IF;
  INSERT INTO public.home_feed_items (
    product_id, seller_id, title, category, price_cents,
    freshness_label, image_url, seller_name, seller_slug, seller_city, sort_score
  ) VALUES (
    NEW.id, NEW.seller_id, NEW.title, NEW.category, NEW.price_cents,
    NEW.freshness_label, NEW.image_url, s.name, s.slug, s.city,
    COALESCE(s.rating, 0) * 10 + CASE WHEN s.featured THEN 50 ELSE 0 END
  )
  ON CONFLICT (product_id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    price_cents = EXCLUDED.price_cents,
    freshness_label = EXCLUDED.freshness_label,
    image_url = EXCLUDED.image_url,
    seller_name = EXCLUDED.seller_name,
    seller_slug = EXCLUDED.seller_slug,
    sort_score = EXCLUDED.sort_score;
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_feed_sync
  AFTER INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.sync_home_feed_item();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_feed_items ENABLE ROW LEVEL SECURITY;

-- Profiles: own row
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Buyer profiles
CREATE POLICY buyer_profiles_own ON public.buyer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Sellers: public read approved; owners full access
CREATE POLICY sellers_public_read ON public.sellers
  FOR SELECT USING (approval_status = 'approved' OR auth.uid() = user_id);
CREATE POLICY sellers_owner_write ON public.sellers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY seller_onboarding_owner ON public.seller_onboarding_steps
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.sellers s WHERE s.id = seller_id AND s.user_id = auth.uid())
  );

CREATE POLICY templates_owner ON public.product_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.sellers s WHERE s.id = seller_id AND s.user_id = auth.uid())
  );

CREATE POLICY products_public_read ON public.products
  FOR SELECT USING (
    NOT sold AND EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.approval_status = 'approved'
    )
  );
CREATE POLICY products_owner ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.sellers s WHERE s.id = seller_id AND s.user_id = auth.uid())
  );

CREATE POLICY home_feed_public ON public.home_feed_items FOR SELECT USING (true);
