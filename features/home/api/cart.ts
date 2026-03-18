import { createClient } from "@/lib/supabase/client"
import type { CartItem } from "../types"

async function getCurrentUserId(): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  return user.id
}

export async function fetchCartItems(): Promise<CartItem[]> {
  const supabase = createClient()
  const userId = await getCurrentUserId()
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as CartItem[]
}

export async function addToCart(
  productId: string,
  quantity = 1,
  color: string | null = null,
  size: string | null = null
): Promise<void> {
  const supabase = createClient()
  const userId = await getCurrentUserId()

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("product_id", productId)
    .eq("color", color ?? "")
    .eq("size", size ?? "")
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: productId, quantity, color, size })
    if (error) throw error
  }
}

export async function removeFromCart(productId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("product_id", productId)

  if (error) throw error
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
