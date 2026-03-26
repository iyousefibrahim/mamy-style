"use client"

import { useQuery } from "@tanstack/react-query"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { fetchMyOrders } from "../api/orders"

export function useOrders() {
  const { data: user } = useCurrentUser()

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: fetchMyOrders,
    enabled: !!user,
    staleTime: 60_000,
  })

  return { user, orders: orders ?? [], isLoading }
}
