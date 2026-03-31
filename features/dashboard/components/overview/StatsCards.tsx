import { Package, LayoutGrid, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import { fetchDashboardStats } from "@/features/dashboard/api/stats.server"

export async function StatsCards() {
  const t = await getTranslations("dashboard.overview")
  const { productsCount, categoriesCount, usersCount } = await fetchDashboardStats()

  const stats = [
    {
      label: t("totalProducts"),
      value: productsCount,
      desc: t("totalProductsDesc"),
      icon: Package,
    },
    {
      label: t("totalCategories"),
      value: categoriesCount,
      desc: t("totalCategoriesDesc"),
      icon: LayoutGrid,
    },
    {
      label: t("totalUsers"),
      value: usersCount,
      desc: t("totalUsersDesc"),
      icon: Users,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
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
