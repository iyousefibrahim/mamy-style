"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export function useCancelOrder(orderId: string) {
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)

  async function cancel() {
    setIsPending(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await queryClient.invalidateQueries({ queryKey: ["orders", "my"] })
    } finally {
      setIsPending(false)
    }
  }

  return { cancel, isPending }
}
