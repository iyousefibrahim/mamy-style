import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/features/dashboard/types"

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
