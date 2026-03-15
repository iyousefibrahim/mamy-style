import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { mockProducts } from "@/lib/mock/products"

const LOW_STOCK_THRESHOLD = 10

export async function LowStockAlert() {
  const t = await getTranslations("dashboard.overview")

  const lowStock = mockProducts
    .filter((p) => p.stock < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-amber-600 dark:text-amber-500">
          <AlertTriangle className="size-4" />
          {t("lowStockAlert")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowStock.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium leading-none">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("stockRemaining")}</p>
            </div>
            <Badge variant="destructive" className="shrink-0">
              {p.stock} units
            </Badge>
          </div>
        ))}
        <Link
          href="/dashboard/products"
          className="block pt-1 text-xs text-primary hover:underline"
        >
          {t("viewAllProducts")}
        </Link>
      </CardContent>
    </Card>
  )
}
