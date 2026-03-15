import { DollarSign, Package, Tag, LayoutGrid, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTranslations } from "next-intl/server"
import type { MockProduct } from "@/lib/mock/products"

type Props = {
  product: MockProduct
}

export async function ProductDetails({ product: p }: Props) {
  const t = await getTranslations("dashboard.products")
  const tc = await getTranslations("dashboard.common")

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Left — main image */}
      <Card>
        <CardContent className="p-4 flex items-center justify-center min-h-[300px] bg-muted/30">
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

      {/* Right — info */}
      <Card>
        <CardContent className="p-0 divide-y">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-green-500" />
              <span className="font-semibold">{p.price.toLocaleString()} EGP</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Stock</p>
            <div className="flex items-center gap-2">
              <Package className="size-4 text-blue-500" />
              <span className="font-semibold">{p.stock}</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Brand</p>
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-purple-500" />
              <span>{p.brand || "—"}</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Category</p>
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4 text-orange-500" />
              <span>{p.category_name}</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Created At</p>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(p.created_at)}</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Updated At</p>
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
