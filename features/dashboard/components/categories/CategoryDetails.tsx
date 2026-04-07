import { Eye, Calendar, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/features/dashboard/types"
import { getTranslations } from "next-intl/server"
import { formatDate } from "@/utils/formatDate"

type Props = { category: Category }

export async function CategoryDetails({ category: c }: Props) {
  const t = await getTranslations("dashboard.categories")

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] items-start">
      {/* Left — image */}
      <Card>
        <CardContent className="p-4 flex items-center justify-center min-h-75 bg-muted/30">
          {c.image_url ? (
            <img src={c.image_url} alt={c.name} className="max-h-80 object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Package className="size-16 opacity-30" />
              <p className="text-sm">{t("noImageSelected")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right — stats */}
      <Card>
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

