import { createClient } from "@/lib/supabase/client"
import type { Category, PaginatedResult } from "../types"
import { paginationRange } from "@/utils/pagination"

export type CategoryFilters = {
  search?: string
  status?: "all" | "active" | "inactive"
  page?: number
}


export async function fetchCategories(filters: CategoryFilters = {}): Promise<PaginatedResult<Category>> {
  const supabase = createClient()
  const { from, to } = paginationRange(filters.page)

  let query = supabase.from("categories_with_counts").select("*", { count: "exact" })

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`)
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  query = query.order("created_at", { ascending: false }).range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Category[], total: count ?? 0 }
}

export async function fetchCategoryOptions(): Promise<{ id: string; name: string }[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("status", "active")
    .order("name")
  if (error) throw error
  return data ?? []
}

export async function fetchCategory(id: string): Promise<Category | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories_with_counts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as Category
}

export async function createCategory(
  payload: Omit<Category, "id" | "products_count" | "views" | "created_at" | "updated_at">
): Promise<Category> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function updateCategory(
  id: string,
  payload: Partial<Omit<Category, "id" | "products_count" | "views" | "created_at" | "updated_at">>
): Promise<Category> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw error
}
