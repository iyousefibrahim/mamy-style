import { createClient } from "@/lib/supabase/server"
import type { Product } from "../types"

export async function fetchProductServer(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products_with_category")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as Product
}
