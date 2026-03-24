"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPublicProducts, type PublicProductFilters } from "../api/products"
import { fetchCategoryOptions } from "../api/categories"

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
