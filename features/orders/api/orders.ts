import { createClient } from "@/lib/supabase/client"
import type { OrderWithItems } from "@/features/dashboard/types"

export async function fetchMyOrders(): Promise<OrderWithItems[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return (data ?? []) as OrderWithItems[]
}
