"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { fetchCartItems, addToCart, removeFromCart } from "@/features/home/api/cart"

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
    mutationFn: ({ productId, color, size, quantity }: { productId: string; color: string | null; size: string | null; quantity: number }) =>
      addToCart(productId, quantity, color, size),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY(userId) })
      toast.success(t("addedToCart"))
    },
    onError: () => toast.error(t("cartError")),
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY(userId) }),
    onError: () => toast.error(t("cartError")),
  })

  const addItem = (productId: string, color: string | null = null, size: string | null = null, quantity = 1) => {
    if (!isLoggedIn) {
      toast(t("loginToAdd"), {
        action: { label: t("loginAction"), onClick: () => router.push("/login") },
      })
      return
    }
    addMutation.mutate({ productId, color, size, quantity })
  }

  const removeItem = (productId: string) => {
    if (isLoggedIn) removeMutation.mutate(productId)
  }

  return {
    items: query.data ?? [],
    totalCount,
    addItem, // addItem(productId, color?, size?)
    removeItem,
  }
}
