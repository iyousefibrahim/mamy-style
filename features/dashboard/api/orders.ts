import { createClient } from "@/lib/supabase/client"
import type { OrderStatus } from "@/features/dashboard/types"

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
  if (error) throw error
}
