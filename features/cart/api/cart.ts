import { createClient } from "@/lib/supabase/client"
import type { CartItem } from "@/features/home/types"
import type { Product } from "@/features/dashboard/types"

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

export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
  if (error) throw error
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
  if (error) throw error
}

export async function clearCartItems(): Promise<void> {
  const supabase = createClient()
  const userId = await getCurrentUserId()
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
  if (error) throw error
}

export async function fetchCartProducts(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return []
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products_with_category")
    .select("id, name, price, image_url, discount_percentage, stock, colors, sizes, category_name")
    .in("id", ids)
  if (error) throw error
  return (data ?? []) as Product[]
}
