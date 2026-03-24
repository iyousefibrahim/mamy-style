"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useCart } from "@/hooks/useCart"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { fetchCartProducts } from "../api/cart"
import type { CartItem } from "@/features/home/types"
import type { Product } from "@/features/dashboard/types"

export type CartItemWithProduct = CartItem & { product: Product | null }

export function useCartPage() {
  const { data: user } = useCurrentUser()
  const { items, isLoading: cartLoading, updateQuantity, clearCart, totalCount } = useCart()

  const productIds = useMemo(
    () => [...new Set(items.map((i) => i.product_id))],
    [items]
  )

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["cart", "products", productIds],
    queryFn: () => fetchCartProducts(productIds),
    enabled: productIds.length > 0,
    staleTime: 5 * 60_000,
  })

  const enrichedItems = useMemo<CartItemWithProduct[]>(
    () =>
      items.map((item) => ({
        ...item,
        product: products?.find((p) => p.id === item.product_id) ?? null,
      })),
    [items, products]
  )

  return {
    user,
    items: enrichedItems,
    isLoading: cartLoading || (productIds.length > 0 && productsLoading),
    totalCount,
    updateQuantity,
    clearCart,
  }
}
