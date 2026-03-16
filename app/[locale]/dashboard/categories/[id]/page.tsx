import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft, Pencil } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { CategoryDetails } from "@/features/dashboard/components/categories/CategoryDetails"
import { fetchCategoryServer } from "@/features/dashboard/api/categories.server"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const category = await fetchCategoryServer(id)
  const t = await getTranslations("dashboard.categories")
  return { title: category?.name ?? t("categoryInfo") }
}

export default async function CategoryDetailPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("dashboard.categories")
  const tc = await getTranslations("dashboard")

  const category = await fetchCategoryServer(id)

  if (!category) notFound()

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("nav.categories"), href: "/dashboard/categories" },
          { label: category.name },
        ]}
        title={category.name}
        subtitle={category.description ?? undefined}
        action={
          <div className="flex items-center gap-2">
            <Link href="/dashboard/categories" className={buttonVariants({ variant: "outline", size: "icon" })}>
              <ArrowLeft className="size-4" />
            </Link>
            <Badge variant={category.status === "active" ? "default" : "secondary"}>
              {category.status === "active" ? tc("common.active") : tc("common.inactive")}
            </Badge>
            <Link href={`/dashboard/categories/${id}/edit` as "/dashboard"} className={buttonVariants()}>
              <Pencil className="size-4" />
              {t("editCategory")}
            </Link>
          </div>
        }
      />
      <div className="px-6 pb-8">
        <CategoryDetails category={category} />
      </div>
    </div>
  )
}
