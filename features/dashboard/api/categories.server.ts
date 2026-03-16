import { createClient } from "@/lib/supabase/server"
import type { Category } from "../types"

export async function fetchCategoryServer(id: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories_with_counts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as Category
}
