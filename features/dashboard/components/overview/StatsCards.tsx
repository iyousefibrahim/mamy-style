import { Package, LayoutGrid, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import { mockProducts } from "@/lib/mock/products"
import { mockCategories } from "@/lib/mock/categories"
import { mockUsers } from "@/lib/mock/users"

export async function StatsCards() {
  const t = await getTranslations("dashboard.overview")

  const stats = [
    {
      label: t("totalProducts"),
      value: mockProducts.length,
      desc: t("totalProductsDesc"),
      icon: Package,
    },
    {
      label: t("totalCategories"),
      value: mockCategories.length,
      desc: t("totalCategoriesDesc"),
      icon: LayoutGrid,
    },
    {
      label: t("totalUsers"),
      value: mockUsers.length,
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
