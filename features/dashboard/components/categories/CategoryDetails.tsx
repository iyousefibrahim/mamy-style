import { Package, Eye, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { MockCategory } from "@/lib/mock/categories"
import { getTranslations } from "next-intl/server"

type Props = { category: MockCategory }

export async function CategoryDetails({ category: c }: Props) {
  const t = await getTranslations("dashboard.categories")

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex justify-end">
      <Card className="w-full max-w-xs">
        <CardContent className="p-0 divide-y">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2">{t("products")}</p>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Package className="size-4 text-muted-foreground" />
              </div>
              <span className="text-2xl font-bold">{c.products_count}</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2">{t("views")}</p>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Eye className="size-4 text-muted-foreground" />
              </div>
              <span className="text-2xl font-bold">{c.views}</span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Created</span>
            </div>
            <p className="text-sm font-medium">{formatDate(c.created_at)}</p>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Updated</span>
            </div>
            <p className="text-sm font-medium">{formatDate(c.updated_at)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2">{t("categoryId")}</p>
            <code className="block w-full rounded bg-muted px-3 py-2 text-xs break-all">
              {c.id}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
