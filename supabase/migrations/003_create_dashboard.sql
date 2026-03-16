-- ============================================================
-- Mamy Style — Phase 3 — Full Schema Migration
-- Run this once in the Supabase SQL Editor
-- ============================================================


-- ══════════════════════════════════════════════════════════
-- PART 1 — Enums
-- ══════════════════════════════════════════════════════════

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super-admin', 'admin', 'customer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE item_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE publish_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════
-- PART 2 — Alter profiles (table already exists from 001)
-- ══════════════════════════════════════════════════════════

-- Add email column if missing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text NOT NULL DEFAULT '';

-- Add status column (replaces is_active / is_deleted logic)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status user_status NOT NULL DEFAULT 'active';

-- Drop the old text CHECK constraint so we can change the column type
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Drop the text default first — Postgres cannot auto-cast a text literal
-- to an enum type while changing the column (error 42804)
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- Convert role from TEXT to user_role enum
-- Legacy 'guest' values are safely downgraded to 'customer'
ALTER TABLE profiles
  ALTER COLUMN role TYPE user_role
  USING CASE
    WHEN role = 'super-admin' THEN 'super-admin'::user_role
    WHEN role = 'admin'       THEN 'admin'::user_role
    ELSE                           'customer'::user_role
  END;

-- Restore default using the enum literal
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer'::user_role;

-- Add unique constraint on username if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;


-- ══════════════════════════════════════════════════════════
-- PART 3 — Triggers on profiles
-- ══════════════════════════════════════════════════════════

-- Replace handle_new_user to sync username, role, status on registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, username, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', NULL),
    'customer',
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email     = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Sync role into JWT app_metadata so the middleware can read it
-- without an extra DB call on every request
CREATE OR REPLACE FUNCTION sync_role_to_app_metadata()
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_role_change ON profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_role_to_app_metadata();


-- ══════════════════════════════════════════════════════════
-- PART 4 — categories table
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS categories (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  description  text,
  status       item_status NOT NULL DEFAULT 'active',
  views        integer     NOT NULL DEFAULT 0,
  tags         text[]      NOT NULL DEFAULT '{}',
  image_url    text,
  gallery_urls text[]      NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);


-- ══════════════════════════════════════════════════════════
-- PART 5 — products table
-- discount_value is omitted — compute as price * discount_percentage / 100 in UI
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS products (
  id                   uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text           NOT NULL,
  description          text,
  status               item_status    NOT NULL DEFAULT 'active',
  stock                integer        NOT NULL DEFAULT 0,
  price                numeric(10,2)  NOT NULL,
  category_id          uuid           REFERENCES categories(id) ON DELETE SET NULL,
  brand                text,
  publish_status       publish_status NOT NULL DEFAULT 'draft',
  discount_percentage  numeric(5,2)   NOT NULL DEFAULT 0,
  discount_valid_until timestamptz,
  image_url            text,
  gallery_urls         text[]         NOT NULL DEFAULT '{}',
  colors               jsonb          NOT NULL DEFAULT '[]',
  sizes                text[]         NOT NULL DEFAULT '{}',
  is_featured          boolean        NOT NULL DEFAULT false,
  views                integer        NOT NULL DEFAULT 0,
  created_at           timestamptz    NOT NULL DEFAULT now(),
  updated_at           timestamptz    NOT NULL DEFAULT now()
);


-- ══════════════════════════════════════════════════════════
-- PART 6 — updated_at auto-trigger for categories & products
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ══════════════════════════════════════════════════════════
-- PART 7 — Views
-- ══════════════════════════════════════════════════════════

-- Products joined with their category name
CREATE OR REPLACE VIEW products_with_category AS
SELECT
  p.*,
  c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Categories with live product count
CREATE OR REPLACE VIEW categories_with_counts AS
SELECT
  c.*,
  COUNT(p.id)::integer AS products_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id;


-- ══════════════════════════════════════════════════════════
-- PART 8 — Row Level Security
-- ══════════════════════════════════════════════════════════

-- ── profiles ──────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies from migration 001 before recreating
DROP POLICY IF EXISTS "Users can view own profile"   ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "own profile readable" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Role read from JWT app_metadata — avoids recursive RLS query
CREATE POLICY "admins read all profiles" ON profiles
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

CREATE POLICY "own profile updatable" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "super-admin updates any profile" ON profiles
  FOR UPDATE USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super-admin'
  );

-- ── categories ────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads active categories" ON categories
  FOR SELECT USING (status = 'active');

CREATE POLICY "admins read all categories" ON categories
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

CREATE POLICY "admins write categories" ON categories
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── products ──────────────────────────────────────────────

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads published products" ON products
  FOR SELECT USING (status = 'active' AND publish_status = 'published');

CREATE POLICY "admins read all products" ON products
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

CREATE POLICY "admins write products" ON products
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );


-- ══════════════════════════════════════════════════════════
-- PART 9 — Storage RLS (products & categories buckets)
--
-- Before running: create both buckets in Supabase Dashboard → Storage
--   • "products"   (public: true)
--   • "categories" (public: true)
-- ══════════════════════════════════════════════════════════

-- ── products bucket ───────────────────────────────────────

CREATE POLICY "product images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

CREATE POLICY "admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

CREATE POLICY "admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── categories bucket ─────────────────────────────────────

CREATE POLICY "category images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'categories');

CREATE POLICY "admins can upload category images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'categories' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

CREATE POLICY "admins can update category images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'categories' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

CREATE POLICY "admins can delete category images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'categories' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );
