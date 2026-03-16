"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { fetchCartItems, addToCart, removeFromCart } from "../api/cart"

const CART_KEY = (userId: string) => ["home", "cart", userId] as const

export function useCart() {
  const { data: user } = useCurrentUser()
  const userId = user?.id ?? "guest"
  const isLoggedIn = Boolean(user)
  const queryClient = useQueryClient()
  const t = useTranslations("home.products")
  const router = useRouter()

  const query = useQuery({
    queryKey: CART_KEY(userId),
    queryFn: fetchCartItems,
    enabled: isLoggedIn,
    staleTime: 2 * 60_000,
  })

  const totalCount = (query.data ?? []).reduce((sum, item) => sum + item.quantity, 0)

  const addMutation = useMutation({
    mutationFn: (productId: string) => addToCart(productId, 1),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY(userId) }),
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY(userId) }),
  })

  const addItem = (productId: string) => {
    if (!isLoggedIn) {
      toast(t("loginToAdd"), {
        action: { label: t("loginAction"), onClick: () => router.push("/login") },
      })
      return
    }
    addMutation.mutate(productId)
  }

  const removeItem = (productId: string) => {
    if (isLoggedIn) removeMutation.mutate(productId)
  }

  return {
    items: query.data ?? [],
    totalCount,
    addItem,
    removeItem,
  }
}
