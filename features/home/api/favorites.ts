import { createClient } from "@/lib/supabase/client"

async function getCurrentUserId(): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return user.id
}

export async function fetchFavoriteIds(): Promise<string[]> {
  const supabase = createClient()
  const userId = await getCurrentUserId()
  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId)
  if (error) throw error
  return (data ?? []).map((row) => row.product_id as string)
}

export async function toggleFavorite(productId: string): Promise<void> {
  const supabase = createClient()
  const userId = await getCurrentUserId()

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, product_id: productId })
    if (error) throw error
  }
}
