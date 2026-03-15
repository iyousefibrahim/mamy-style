import { Package, LayoutGrid, Users, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export async function FastActions() {
  const t = await getTranslations("dashboard.overview")

  const actions = [
    { label: t("createProduct"), href: "/dashboard/products/create", icon: Package },
    { label: t("createCategory"), href: "/dashboard/categories/create", icon: LayoutGrid },
    { label: t("viewUsers"), href: "/dashboard/users", icon: Users },
    { label: t("viewProducts"), href: "/dashboard/products", icon: ShoppingBag },
  ]

  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">+ {t("fastActions")}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((a) => (
          <Link key={a.href} href={a.href as "/dashboard"}>
            <Card className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-6">
                <a.icon className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium text-center">{a.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
