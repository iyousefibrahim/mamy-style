-- Enable pg_trgm for fast ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Indexes for text search (ILIKE queries)
CREATE INDEX IF NOT EXISTS idx_categories_name_trgm ON categories USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons (code);

-- Index for coupon active status (used in validate route)
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons (is_active) WHERE is_active = true;
