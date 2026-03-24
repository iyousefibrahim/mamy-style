"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPublicCategories } from "../api/categories"

export function usePublicCategories() {
  return useQuery({
    queryKey: ["categories", "list"],
    queryFn: fetchPublicCategories,
    staleTime: 5 * 60_000,
  })
}
