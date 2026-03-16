"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { fetchFavoriteIds, toggleFavorite } from "../api/cart"

const FAVORITES_KEY = (userId: string) => ["home", "favorites", userId] as const

export function useFavorites() {
  const { data: user } = useCurrentUser()
  const userId = user?.id ?? "guest"
  const isLoggedIn = Boolean(user)
  const queryClient = useQueryClient()
  const t = useTranslations("home.products")
  const router = useRouter()

  const query = useQuery({
    queryKey: FAVORITES_KEY(userId),
    queryFn: fetchFavoriteIds,
    enabled: isLoggedIn,
    staleTime: 2 * 60_000,
  })

  const favoriteIds = (query.data ?? []) as string[]

  const toggleMutation = useMutation({
    mutationFn: (productId: string) => toggleFavorite(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_KEY(userId) }),
  })

  const toggle = (productId: string) => {
    if (!isLoggedIn) {
      toast(t("loginToFav"), {
        action: { label: t("loginAction"), onClick: () => router.push("/login") },
      })
      return
    }
    toggleMutation.mutate(productId)
  }

  return {
    favoriteIds,
    isFavorited: (productId: string) => favoriteIds.includes(productId),
    toggleFavorite: toggle,
    count: favoriteIds.length,
  }
}
