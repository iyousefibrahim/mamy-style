import { createClient } from "@/lib/supabase/client"
import type { Product, PaginatedResult } from "@/features/dashboard/types"
import { paginationRange } from "@/utils/pagination"

// ─── Types ──────────────────────────────────────────────────────────────────

export type PublicProductFilters = {
  search?: string
  categoryName?: string
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc"
  minPrice?: number
  maxPrice?: number
  page?: number
}

export const PRODUCTS_PAGE_SIZE = 12

export async function fetchProduct(id: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products_with_category")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .eq("publish_status", "published")
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }
  return data as Product
}

// ─── Public Products List ───────────────────────────────────────────────────

export async function fetchPublicProducts(
  filters: PublicProductFilters = {}
): Promise<PaginatedResult<Product>> {
  const supabase = createClient()
  const { from, to } = paginationRange(filters.page, PRODUCTS_PAGE_SIZE)

  let query = supabase
    .from("products_with_category")
    .select("*", { count: "exact" })
    .eq("status", "active")
    .eq("publish_status", "published")

  if (filters.search) query = query.ilike("name", `%${filters.search}%`)
  if (filters.categoryName) query = query.eq("category_name", filters.categoryName)
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice)
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice)

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "name_asc":
      query = query.order("name", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Product[], total: count ?? 0 }
}
