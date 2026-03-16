"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchCategories,
  fetchCategoryOptions,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryFilters,
} from "../api/categories"

export const CATEGORIES_KEY = ["dashboard", "categories"] as const

export function useCategories(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, filters],
    queryFn: () => fetchCategories(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}

// Lightweight hook for select dropdowns — fetches all active categories, no pagination
export function useCategoryOptions() {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, "options"],
    queryFn: fetchCategoryOptions,
    staleTime: 60_000,
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, id],
    queryFn: () => fetchCategory(id),
    staleTime: 30_000,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof createCategory>[0]) => createCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateCategory>[1] }) =>
      updateCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  })
}
