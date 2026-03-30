"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchCoupons,
  fetchCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
  type CouponFilters,
} from "../api/coupons"

export const COUPONS_KEY = ["dashboard", "coupons"] as const

export function useCoupons(filters: CouponFilters = {}) {
  return useQuery({
    queryKey: [...COUPONS_KEY, filters],
    queryFn: () => fetchCoupons(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: [...COUPONS_KEY, id],
    queryFn: () => fetchCoupon(id),
    staleTime: 30_000,
  })
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof createCoupon>[0]) => createCoupon(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }),
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateCoupon>[1] }) =>
      updateCoupon(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }),
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }),
  })
}

export function useToggleCoupon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      toggleCouponActive(id, is_active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COUPONS_KEY }),
  })
}
