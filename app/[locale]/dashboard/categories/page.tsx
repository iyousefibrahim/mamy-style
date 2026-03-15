import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { CategoriesTable } from "@/features/dashboard/components/categories/CategoriesTable"

export async function generateMetadata() {
  const t = await getTranslations("dashboard.categories")
  return { title: t("title") }
}

export default async function CategoriesPage() {
  const t = await getTranslations("dashboard.categories")

  return (
    <div>
      <DashboardHeader
        segments={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Link href="/dashboard/categories/create" className={buttonVariants()}>
            <Plus className="size-4" />
            {t("addCategory")}
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <CategoriesTable />
      </div>
    </div>
  )
}
