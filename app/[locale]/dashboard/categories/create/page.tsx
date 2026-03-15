import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { CategoryForm } from "@/features/dashboard/components/categories/CategoryForm"

export async function generateMetadata() {
  const t = await getTranslations("dashboard.categories")
  return { title: t("createTitle") }
}

export default async function CreateCategoryPage() {
  const t = await getTranslations("dashboard.categories")
  const tc = await getTranslations("dashboard.nav")

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("categories"), href: "/dashboard/categories" },
          { label: t("createTitle") },
        ]}
        title={t("createTitle")}
        subtitle={t("createSubtitle")}
        action={
          <Link href="/dashboard/categories" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="size-4" />
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <CategoryForm mode="create" />
      </div>
    </div>
  )
}
