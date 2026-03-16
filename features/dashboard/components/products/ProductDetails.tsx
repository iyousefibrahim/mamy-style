import { DollarSign, Package, Tag, LayoutGrid, Calendar, Percent } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTranslations } from "next-intl/server"
import type { Product } from "@/features/dashboard/types"
import { formatDate } from "@/utils/formatDate"

type Props = {
  product: Product
}

export async function ProductDetails({ product: p }: Props) {
  const t = await getTranslations("dashboard.products")

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Left — images */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-center min-h-75 bg-muted/30">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="max-h-80 object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Package className="size-16 opacity-30" />
                <p className="text-sm">{t("noImageSelected")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {p.gallery_urls.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-3">{t("galleryImages")}</p>
              <div className="flex flex-wrap gap-2">
                {p.gallery_urls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="size-20 rounded-md border object-cover"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right — info */}
      <Card>
        <CardContent className="p-0 divide-y">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("price")}</p>
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-green-500" />
              <span className="font-semibold">{p.price.toLocaleString("en-US")} EGP</span>
            </div>
          </div>

          {p.discount_percentage > 0 && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{t("discounts")}</p>
              <div className="flex items-center gap-2">
                <Percent className="size-4 text-orange-500" />
                <span className="font-medium text-orange-600">
                  -{p.discount_percentage}% ({Math.round(p.price * p.discount_percentage / 100).toLocaleString("en-US")} EGP off)
                </span>
              </div>
            </div>
          )}

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("stock")}</p>
            <div className="flex items-center gap-2">
              <Package className="size-4 text-blue-500" />
              <span className="font-semibold">{p.stock}</span>
              {p.stock < 10 && (
                <Badge variant="destructive" className="text-xs">{t("stockLow")}</Badge>
              )}
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("brand")}</p>
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-purple-500" />
              <span>{p.brand || "—"}</span>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("category")}</p>
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4 text-orange-500" />
              <span>{p.category_name}</span>
            </div>
          </div>

          {p.colors.length > 0 && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-2">{t("colors")}</p>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <span
                    key={c.name}
                    className="flex items-center gap-1.5 rounded-full border bg-muted px-2.5 py-0.5 text-xs"
                  >
                    <span
                      className="size-3 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {p.sizes.length > 0 && (
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-2">{t("sizes")}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.sizes.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s === "freeSize" ? t("freeSize") : s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("colCreatedAt")}</p>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(p.created_at)}</span>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("colUpdatedAt")}</p>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(p.updated_at)}</span>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2">{t("productId")}</p>
            <code className="block w-full rounded bg-muted px-3 py-2 text-xs break-all">
              {p.id}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
