import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft, Pencil } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { ProductDetails } from "@/features/dashboard/components/products/ProductDetails"
import { fetchProductServer } from "@/features/dashboard/api/products.server"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await fetchProductServer(id)
  const t = await getTranslations("dashboard.products")
  return { title: product?.name ?? t("productInfo") }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("dashboard.products")
  const tc = await getTranslations("dashboard")

  const product = await fetchProductServer(id)

  if (!product) notFound()

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("nav.products"), href: "/dashboard/products" },
          { label: product.name },
        ]}
        title={product.name}
        subtitle={product.description ?? undefined}
        action={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/products" className={buttonVariants({ variant: "outline", size: "icon" })}>
              <ArrowLeft className="size-4" />
            </Link>
            <Badge variant={product.status === "active" ? "default" : "secondary"}>
              {product.status === "active" ? tc("common.active") : tc("common.inactive")}
            </Badge>
            <Badge variant="outline">{product.publish_status}</Badge>
            <Link href={`/dashboard/products/${id}/edit` as "/dashboard"} className={buttonVariants()}>
              <Pencil className="size-4" />
              {t("editProduct")}
            </Link>
          </div>
        }
      />
      <div className="px-6 pb-8">
        <ProductDetails product={product} />
      </div>
    </div>
  )
}
