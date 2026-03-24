"use client"

import { useQuery } from "@tanstack/react-query"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { useFavorites } from "@/hooks/useFavorites"
import { fetchCartProducts } from "@/features/cart/api/cart"

export function useFavoritesPage() {
  const { data: user } = useCurrentUser()
  const { favoriteIds, isFavorited, toggleFavorite, isLoading: idsLoading } = useFavorites()

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["favorites", "products", favoriteIds],
    queryFn: () => fetchCartProducts(favoriteIds),
    enabled: favoriteIds.length > 0,
    staleTime: 5 * 60_000,
  })

  return {
    user,
    products: products ?? [],
    isLoading: idsLoading || (favoriteIds.length > 0 && productsLoading),
    isFavorited,
    toggleFavorite,
  }
}
