import { createClient } from "@/lib/supabase/client"

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
