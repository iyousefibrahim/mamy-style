import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { CouponForm } from "@/features/dashboard/components/coupons/CouponForm"

export async function generateMetadata() {
  const t = await getTranslations("dashboard.coupons")
  return { title: t("createTitle") }
}

export default async function CreateCouponPage() {
  const t = await getTranslations("dashboard.coupons")
  const tc = await getTranslations("dashboard.nav")

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("coupons"), href: "/dashboard/coupons" },
          { label: t("createTitle") },
        ]}
        title={t("createTitle")}
        action={
          <Link href="/dashboard/coupons" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="size-4" />
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <CouponForm mode="create" />
      </div>
    </div>
  )
}
