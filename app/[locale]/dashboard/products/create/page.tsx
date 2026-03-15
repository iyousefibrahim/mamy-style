import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { ProductForm } from "@/features/dashboard/components/products/ProductForm"

export async function generateMetadata() {
  const t = await getTranslations("dashboard.products")
  return { title: t("createTitle") }
}

export default async function CreateProductPage() {
  const t = await getTranslations("dashboard.products")
  const tc = await getTranslations("dashboard.nav")

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("products"), href: "/dashboard/products" },
          { label: t("createTitle") },
        ]}
        title={t("createTitle")}
        subtitle={t("createSubtitle")}
        action={
          <Link href="/dashboard/products" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="size-4" />
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <ProductForm mode="create" />
      </div>
    </div>
  )
}
