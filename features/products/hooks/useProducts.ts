"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPublicProducts, fetchSimilarProducts, type PublicProductFilters } from "../api/products"
import { fetchCategoryOptions } from "../api/categories"
import { fetchFeaturedProducts } from "@/features/home/api/products"
import type { Product } from "@/features/dashboard/types"

export function usePublicProducts(filters: PublicProductFilters) {
  return useQuery({
    queryKey: ["products", "list", filters],
    queryFn: () => fetchPublicProducts(filters),
    staleTime: 2 * 60_000,
    placeholderData: (prev) => prev,
  })
}

export function useCategoryOptions() {
  return useQuery({
    queryKey: ["products", "categoryOptions"],
    queryFn: fetchCategoryOptions,
    staleTime: 5 * 60_000,
  })
}

export function useSimilarProducts(productId: string, categoryName: string | null) {
  const primary = useQuery({
    queryKey: ["products", "similar", productId, categoryName],
    queryFn: () =>
      categoryName
        ? fetchSimilarProducts(productId, categoryName)
        : Promise.resolve([] as Product[]),
    staleTime: 5 * 60_000,
  })

  const needsFallback = primary.isSuccess && primary.data.length === 0

  const fallback = useQuery({
    queryKey: ["home", "featured"],
    queryFn: fetchFeaturedProducts,
    enabled: needsFallback,
    staleTime: 5 * 60_000,
  })

  return {
    products: needsFallback
      ? (fallback.data ?? []).filter((p) => p.id !== productId)
      : (primary.data ?? []),
    isLoading: primary.isLoading || (needsFallback && fallback.isLoading),
  }
}
