-- ============================================================
-- Mamy Style — Phase 4 — Cart & Favorites
-- ============================================================

-- ══════════════════════════════════════════════════════════
-- cart_items
-- One row per (user, product). quantity tracks how many were added.
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS cart_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  uuid        NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  quantity    integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

DROP TRIGGER IF EXISTS cart_items_updated_at ON cart_items;
CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- set_updated_at() already exists from migration 003

-- ══════════════════════════════════════════════════════════
-- favorites
-- One row per (user, product). No quantity needed.
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS favorites (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  uuid        NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- ══════════════════════════════════════════════════════════
-- Indexes — avoid full-table scans on per-user reads
-- ══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS cart_items_user_id_idx    ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS cart_items_product_id_idx ON cart_items (product_id);
CREATE INDEX IF NOT EXISTS favorites_user_id_idx     ON favorites  (user_id);
CREATE INDEX IF NOT EXISTS favorites_product_id_idx  ON favorites  (product_id);

-- ══════════════════════════════════════════════════════════
-- RLS — each user sees and manages only their own rows
-- ══════════════════════════════════════════════════════════

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites  ENABLE ROW LEVEL SECURITY;

-- cart_items
CREATE POLICY "own cart readable"   ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own cart insertable" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own cart updatable"  ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own cart deletable"  ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- favorites
CREATE POLICY "own favorites readable"   ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own favorites insertable" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own favorites deletable"  ON favorites FOR DELETE USING (auth.uid() = user_id);
