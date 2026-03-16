"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchFeaturedProducts } from "../api/products"

export const FEATURED_PRODUCTS_KEY = ["home", "featured-products"] as const

export function useFeaturedProducts() {
  return useQuery({
    queryKey: FEATURED_PRODUCTS_KEY,
    queryFn: fetchFeaturedProducts,
    staleTime: 5 * 60_000,
  })
}
