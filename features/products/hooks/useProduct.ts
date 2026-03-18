"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchProduct } from "../api/products"

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  })
}
