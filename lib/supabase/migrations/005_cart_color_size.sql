-- Add color and size to cart_items so orders know what the customer selected
ALTER TABLE cart_items
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS size  text;

-- Update unique constraint: same product in different color/size = separate cart rows
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

ALTER TABLE cart_items
  ADD CONSTRAINT cart_items_user_id_product_color_size_key
  UNIQUE (user_id, product_id, color, size);
