import { createClient } from "@/lib/supabase/client"
import type { Product, PaginatedResult } from "../types"
import { paginationRange } from "@/utils/pagination"

export type ProductFilters = {
  search?: string
  status?: "all" | "active" | "inactive"
  page?: number
}


export async function fetchProducts(filters: ProductFilters = {}): Promise<PaginatedResult<Product>> {
  const supabase = createClient()
  const { from, to } = paginationRange(filters.page)

  let query = supabase.from("products_with_category").select("*", { count: "exact" })

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  query = query.order("created_at", { ascending: false }).range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Product[], total: count ?? 0 }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products_with_category")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as Product
}

export async function createProduct(
  payload: Omit<Product, "id" | "category_name" | "views" | "created_at" | "updated_at">
): Promise<Product> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export async function updateProduct(
  id: string,
  payload: Partial<Omit<Product, "id" | "category_name" | "views" | "created_at" | "updated_at">>
): Promise<Product> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}
