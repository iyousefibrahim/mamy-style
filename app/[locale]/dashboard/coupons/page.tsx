import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { CouponsTable } from "@/features/dashboard/components/coupons/CouponsTable"

export async function generateMetadata() {
  const t = await getTranslations("dashboard.coupons")
  return { title: t("title") }
}

export default async function CouponsPage() {
  const t = await getTranslations("dashboard.coupons")

  return (
    <div>
      <DashboardHeader
        segments={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Link href="/dashboard/coupons/create" className={buttonVariants()}>
            <Plus className="size-4" />
            {t("addCoupon")}
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <CouponsTable />
      </div>
    </div>
  )
}
