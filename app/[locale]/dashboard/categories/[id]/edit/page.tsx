import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { CategoryForm } from "@/features/dashboard/components/categories/CategoryForm"
import { mockCategories } from "@/lib/mock/categories"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const category = mockCategories.find((c) => c.id === id)
  const t = await getTranslations("dashboard.categories")
  return { title: category ? `${t("editTitle")} — ${category.name}` : t("editTitle") }
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("dashboard.categories")
  const tc = await getTranslations("dashboard.nav")

  const category = mockCategories.find((c) => c.id === id)
  if (!category) notFound()

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("categories"), href: "/dashboard/categories" },
          { label: t("editTitle") },
        ]}
        title={t("editTitle")}
        subtitle={t("editSubtitle")}
        action={
          <Link href={`/dashboard/categories/${id}` as "/dashboard"} className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="size-4" />
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <CategoryForm mode="edit" defaultValues={category} />
      </div>
    </div>
  )
}
