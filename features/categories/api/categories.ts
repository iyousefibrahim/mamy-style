import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/features/home/types"

export async function fetchPublicCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("categories_with_counts")
    .select("*")
    .eq("status", "active")
    .order("name")
  if (error) throw error
  return (data ?? []) as Category[]
}
