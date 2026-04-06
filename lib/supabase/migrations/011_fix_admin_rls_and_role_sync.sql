-- ══════════════════════════════════════════════════════════
-- Fix: restore sync_role_to_app_metadata trigger
-- All admin RLS policies use JWT app_metadata (Option B).
-- Rule: after any role change, the affected user must log
-- out and back in once for the new JWT to take effect.
-- ══════════════════════════════════════════════════════════

-- ── profiles ──────────────────────────────────────────────
DROP POLICY IF EXISTS "admins read all profiles" ON profiles;
CREATE POLICY "admins read all profiles" ON profiles
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "super-admin updates any profile" ON profiles;
CREATE POLICY "super-admin updates any profile" ON profiles
  FOR UPDATE USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super-admin'
  );

-- ── categories ────────────────────────────────────────────
DROP POLICY IF EXISTS "admins read all categories" ON categories;
CREATE POLICY "admins read all categories" ON categories
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "admins write categories" ON categories;
CREATE POLICY "admins write categories" ON categories
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── products ──────────────────────────────────────────────
DROP POLICY IF EXISTS "admins read all products" ON products;
CREATE POLICY "admins read all products" ON products
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "admins write products" ON products;
CREATE POLICY "admins write products" ON products
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── orders ────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin orders readable" ON orders;
CREATE POLICY "admin orders readable" ON orders
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "admin orders updatable" ON orders;
CREATE POLICY "admin orders updatable" ON orders
  FOR UPDATE USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── order_items ───────────────────────────────────────────
DROP POLICY IF EXISTS "admin order items readable" ON order_items;
CREATE POLICY "admin order items readable" ON order_items
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── coupons ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins manage coupons" ON coupons;
CREATE POLICY "Admins manage coupons" ON coupons
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── coupon_usages ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admins read all coupon usages" ON coupon_usages;
CREATE POLICY "Admins read all coupon usages" ON coupon_usages
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── storage.objects (products bucket) ────────────────────
DROP POLICY IF EXISTS "admins can upload product images" ON storage.objects;
CREATE POLICY "admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "admins can update product images" ON storage.objects;
CREATE POLICY "admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "admins can delete product images" ON storage.objects;
CREATE POLICY "admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ── storage.objects (categories bucket) ──────────────────
DROP POLICY IF EXISTS "admins can upload category images" ON storage.objects;
CREATE POLICY "admins can upload category images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'categories' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "admins can update category images" ON storage.objects;
CREATE POLICY "admins can update category images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'categories' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

DROP POLICY IF EXISTS "admins can delete category images" ON storage.objects;
CREATE POLICY "admins can delete category images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'categories' AND
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
  );

-- ══════════════════════════════════════════════════════════
-- Restore sync_role_to_app_metadata trigger
-- Fires on profiles.role INSERT/UPDATE → syncs to JWT metadata
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION sync_role_to_app_metadata()
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_profile_role_change ON profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_role_to_app_metadata();
