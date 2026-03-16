import { createClient } from "@/lib/supabase/server"

export type DashboardStats = {
  productsCount: number
  categoriesCount: number
  usersCount: number
}

export type LowStockProduct = {
  id: string
  name: string
  stock: number
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ])

  return {
    productsCount: productsCount ?? 0,
    categoriesCount: categoriesCount ?? 0,
    usersCount: usersCount ?? 0,
  }
}

export async function fetchLowStockProducts(threshold = 10): Promise<LowStockProduct[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("products")
    .select("id, name, stock")
    .lt("stock", threshold)
    .order("stock", { ascending: true })
    .limit(5)

  return data ?? []
}
