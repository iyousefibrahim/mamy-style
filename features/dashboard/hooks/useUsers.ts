"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchUsers,
  updateUserRole,
  updateUserStatus,
  type UserFilters,
} from "../api/users"
import type { UserProfile } from "../types"

export const USERS_KEY = ["dashboard", "users"] as const

export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: [...USERS_KEY, filters],
    queryFn: () => fetchUsers(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserProfile["role"] }) =>
      updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserProfile["status"] }) =>
      updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}
