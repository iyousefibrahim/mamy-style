import { createClient } from "@/lib/supabase/server"

export type ChartDataPoint = { name: string; value: number }
export type StockDataPoint = { name: string; stock: number }
export type NewProductsDataPoint = { month: string; count: number }

export type OverviewData = {
  firstName: string
  productsByCategoryData: ChartDataPoint[]
  stockByCategoryData: StockDataPoint[]
  newProductsData: NewProductsDataPoint[]
}

export async function fetchOverviewData(): Promise<OverviewData> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).single()
    : { data: null }
  const firstName = profile?.full_name?.split(" ")[0] ?? ""

  const now = new Date()

  const monthBuckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en", { month: "short", year: "numeric" }),
    }
  })
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

  const [
    { data: categoriesWithCounts },
    { data: productsWithCategory },
    { data: recentProducts },
  ] = await Promise.all([
    supabase.from("categories_with_counts").select("name, products_count").gt("products_count", 0),
    supabase.from("products").select("stock, categories(name)"),
    supabase.from("products").select("created_at").gte("created_at", sixMonthsAgo),
  ])

  const productsByCategoryData = (categoriesWithCounts ?? []).map((c) => ({
    name: c.name,
    value: c.products_count as number,
  }))

  const stockMap: Record<string, number> = {}
  ;(productsWithCategory ?? []).forEach((p) => {
    const catName = (p.categories as unknown as { name: string } | null)?.name
    if (!catName) return
    stockMap[catName] = (stockMap[catName] ?? 0) + p.stock
  })
  const stockByCategoryData = Object.entries(stockMap)
    .map(([name, stock]) => ({ name, stock }))
    .filter((d) => d.stock > 0)

  const countsByMonth: Record<string, number> = {}
  monthBuckets.forEach((m) => { countsByMonth[m.key] = 0 })
  ;(recentProducts ?? []).forEach((p) => {
    const d = new Date(p.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (key in countsByMonth) countsByMonth[key]++
  })
  const newProductsData = monthBuckets.map((m) => ({ month: m.label, count: countsByMonth[m.key] }))

  return { firstName, productsByCategoryData, stockByCategoryData, newProductsData }
}
