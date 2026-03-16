import { createClient } from "@/lib/supabase/client"
import type { Product, Category } from "../types"

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products_with_category")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "active")
    .eq("publish_status", "published")
    .order("created_at", { ascending: false })
    .limit(8)

  if (error) throw error
  return (data ?? []) as Product[]
}

export async function fetchHomeCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories_with_counts")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4)

  if (error) throw error
  return (data ?? []) as Category[]
}
