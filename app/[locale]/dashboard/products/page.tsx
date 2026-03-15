import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { ProductsTable } from "@/features/dashboard/components/products/ProductsTable"

export default async function ProductsPage() {
  const t = await getTranslations("dashboard.products")

  return (
    <div>
      <DashboardHeader
        segments={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Link href="/dashboard/products/create" className={buttonVariants()}>
            <Plus className="size-4" />
            {t("addProduct")}
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <ProductsTable />
      </div>
    </div>
  )
}
