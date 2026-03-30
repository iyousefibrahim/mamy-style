-- Coupons table
CREATE TABLE coupons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code             TEXT UNIQUE NOT NULL,          -- uppercase code, e.g. "MAMY20"
  discount_percent NUMERIC NOT NULL DEFAULT 0,   -- 0 = no percent discount
  free_shipping    BOOLEAN NOT NULL DEFAULT false,-- true = removes shipping fee
  max_uses         INTEGER NOT NULL DEFAULT 100,
  used_count       INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  expires_at       TIMESTAMPTZ NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Track per-user usage — one use per user per coupon
CREATE TABLE coupon_usages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id  UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

-- Auto-update updated_at
CREATE TRIGGER set_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;

-- Admins can do everything with coupons
CREATE POLICY "Admins manage coupons" ON coupons
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin'));

-- Authenticated users can read active coupons (needed for client-side display)
-- Real validation happens server-side in /api/coupons/validate
CREATE POLICY "Users read active coupons" ON coupons
  FOR SELECT TO authenticated USING (is_active = true);

-- Users can read and insert their own usages
CREATE POLICY "Users manage own coupon usages" ON coupon_usages
  FOR ALL USING (auth.uid() = user_id);

-- Admins can read all usages
CREATE POLICY "Admins read all coupon usages" ON coupon_usages
  FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin'));

-- Auto-increment used_count when a usage row is inserted
CREATE OR REPLACE FUNCTION increment_coupon_used_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_coupon_used
  AFTER INSERT ON coupon_usages
  FOR EACH ROW EXECUTE FUNCTION increment_coupon_used_count();
