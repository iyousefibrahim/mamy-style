"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchCurrentProfile, updateProfile } from "../api/profile"

export const PROFILE_KEY = ["dashboard", "profile"] as const

export function useCurrentProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: fetchCurrentProfile,
    staleTime: 60_000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateProfile>[0]) => updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  })
}
