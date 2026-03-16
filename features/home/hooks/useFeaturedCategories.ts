"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchHomeCategories } from "../api/products"

export const FEATURED_CATEGORIES_KEY = ["home", "featured-categories"] as const

export function useFeaturedCategories() {
  return useQuery({
    queryKey: FEATURED_CATEGORIES_KEY,
    queryFn: fetchHomeCategories,
    staleTime: 10 * 60_000,
  })
}
