export type { Product, Category } from "@/features/dashboard/types"

// ─── Cart ────────────────────────────────────────────────────────────────────

export type CartItem = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
}

// ─── Favorites ───────────────────────────────────────────────────────────────

export type FavoriteItem = {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

