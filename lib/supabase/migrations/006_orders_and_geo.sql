-- ============================================================
-- Mamy Style — Phase 6 — Orders
-- ============================================================


-- ══════════════════════════════════════════════════════════
-- PART 1 — Enums
-- ══════════════════════════════════════════════════════════

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE shipping_type AS ENUM ('local', 'national');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('online', 'cod');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ══════════════════════════════════════════════════════════
-- PART 2 — Orders
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS orders (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status          order_status NOT NULL DEFAULT 'pending_payment',

  -- address snapshot at time of order
  governorate     text        NOT NULL,
  city            text        NOT NULL,
  address_line    text        NOT NULL,
  phone           text        NOT NULL,

  -- pricing snapshot (all amounts in EGP)
  subtotal        integer     NOT NULL,
  discount        integer     NOT NULL DEFAULT 0,
  shipping_fee    integer     NOT NULL,  -- 20 (local) or 100 (national)
  total           integer     NOT NULL,
  shipping_type   shipping_type NOT NULL,
  coupon_code     text,

  -- payment
  payment_method  payment_method NOT NULL DEFAULT 'cod',
  paymob_order_id text,  -- null for COD orders

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ══════════════════════════════════════════════════════════
-- PART 3 — Order Items
-- Snapshot of each product at the time of purchase.
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS order_items (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  uuid    NOT NULL REFERENCES products(id) ON DELETE SET NULL,

  -- product snapshot
  name        text    NOT NULL,
  price       integer NOT NULL,  -- final price after discount, in EGP
  quantity    integer NOT NULL CHECK (quantity > 0),
  color       text,
  size        text,
  image_url   text
);


-- ══════════════════════════════════════════════════════════
-- PART 4 — Indexes
-- ══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS orders_user_id_idx       ON orders      (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx        ON orders      (status);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);


-- ══════════════════════════════════════════════════════════
-- PART 5 — Stock Decrement Trigger
-- Decrements product stock when an order item is inserted.
-- Stock is restored manually by admin if order is cancelled.
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION decrement_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(stock - NEW.quantity, 0)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_item_inserted ON order_items;
CREATE TRIGGER on_order_item_inserted
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION decrement_product_stock();


-- ══════════════════════════════════════════════════════════
-- PART 6 — RLS
-- ══════════════════════════════════════════════════════════

ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read and insert their own orders
CREATE POLICY "own orders readable"   ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own orders insertable" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own orders updatable"  ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Admins can read all orders
CREATE POLICY "admin orders readable" ON orders FOR SELECT USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
);

-- Admins can update order status
CREATE POLICY "admin orders updatable" ON orders FOR UPDATE USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
);

-- Order items: readable if user owns the parent order
CREATE POLICY "own order items readable" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "own order items insertable" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
  )
);

-- Admins can read all order items
CREATE POLICY "admin order items readable" ON order_items FOR SELECT USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super-admin')
);
