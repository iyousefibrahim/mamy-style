import { Package, LayoutGrid, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"

export async function StatsCards() {
  const t = await getTranslations("dashboard.overview")
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

  const stats = [
    {
      label: t("totalProducts"),
      value: productsCount ?? 0,
      desc: t("totalProductsDesc"),
      icon: Package,
    },
    {
      label: t("totalCategories"),
      value: categoriesCount ?? 0,
      desc: t("totalCategoriesDesc"),
      icon: LayoutGrid,
    },
    {
      label: t("totalUsers"),
      value: usersCount ?? 0,
      desc: t("totalUsersDesc"),
      icon: Users,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="flex items-start justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <s.icon className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
