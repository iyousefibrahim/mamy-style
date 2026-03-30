"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { login, register, logout, getCurrentUser } from "../api/auth"
import type { LoginFormValues, RegisterFormValues } from "../types"

const USER_QUERY_KEY = ["auth", "user"]

export function useCurrentUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ values }: { values: RegisterFormValues }) => register(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
