import { createClient } from "@/lib/supabase/server"
import type { OrderWithItems } from "@/features/dashboard/types"

export type DashboardOrder = OrderWithItems & {
  profiles: { full_name: string | null } | null
}

const PAGE_SIZE = 10

export async function fetchAllOrders(
  page: number = 1
): Promise<{ orders: DashboardOrder[]; total: number; totalPages: number }> {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from("orders")
    .select("*, order_items(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  // Fetch profile names separately (no FK between orders and profiles)
  const userIds = [...new Set((data ?? []).map((o) => o.user_id as string))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds)

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p.full_name])
  )

  const orders = (data ?? []).map((o) => ({
    ...o,
    profiles: { full_name: profileMap[o.user_id as string] ?? null },
  })) as DashboardOrder[]

  const total = count ?? 0
  return {
    orders,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}
