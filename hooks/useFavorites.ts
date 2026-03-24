"use client"

import { useCallback, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { fetchFavoriteIds, toggleFavorite } from "@/features/home/api/favorites"

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

  const favoriteIds = useMemo(() => (query.data ?? []) as string[], [query.data])

  const toggleMutation = useMutation({
    mutationFn: ({ productId }: { productId: string; wasAdding: boolean }) =>
      toggleFavorite(productId),
    onSuccess: (_, { wasAdding }) => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY(userId) })
      toast.success(wasAdding ? t("addedToFav") : t("removedFromFav"))
    },
    onError: () => toast.error(t("favError")),
  })

  const toggle = useCallback((productId: string) => {
    if (!isLoggedIn) {
      toast(t("loginToFav"), {
        action: { label: t("loginAction"), onClick: () => router.push("/login") },
      })
      return
    }
    const wasAdding = !favoriteIds.includes(productId)
    toggleMutation.mutate({ productId, wasAdding })
  }, [isLoggedIn, favoriteIds, toggleMutation, t, router])

  return {
    favoriteIds,
    isFavorited: (productId: string) => favoriteIds.includes(productId),
    toggleFavorite: toggle,
    count: favoriteIds.length,
  }
}
