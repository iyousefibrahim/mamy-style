import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { ProductForm } from "@/features/dashboard/components/products/ProductForm"
import { fetchProductServer } from "@/features/dashboard/api/products.server"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await fetchProductServer(id)
  const t = await getTranslations("dashboard.products")
  return { title: product ? `${t("editTitle")} — ${product.name}` : t("editTitle") }
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("dashboard.products")
  const tc = await getTranslations("dashboard.nav")

  const product = await fetchProductServer(id)

  if (!product) notFound()

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("products"), href: "/dashboard/products" },
          { label: t("editTitle") },
        ]}
        title={t("editTitle")}
        subtitle={t("editSubtitle")}
        action={
          <Link href={`/dashboard/products/${id}` as "/dashboard"} className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="size-4" />
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <ProductForm mode="edit" defaultValues={product} />
      </div>
    </div>
  )
}
