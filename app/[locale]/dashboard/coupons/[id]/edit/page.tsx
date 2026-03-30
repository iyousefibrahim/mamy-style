import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { buttonVariants } from "@/components/ui/button-variants"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { CouponForm } from "@/features/dashboard/components/coupons/CouponForm"
import { fetchCouponServer } from "@/features/dashboard/api/coupons.server"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata() {
  const t = await getTranslations("dashboard.coupons")
  return { title: t("editTitle") }
}

export default async function EditCouponPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("dashboard.coupons")
  const tc = await getTranslations("dashboard.nav")

  const coupon = await fetchCouponServer(id)
  if (!coupon) notFound()

  return (
    <div>
      <DashboardHeader
        segments={[
          { label: tc("coupons"), href: "/dashboard/coupons" },
          { label: t("editTitle") },
        ]}
        title={t("editTitle")}
        action={
          <Link href="/dashboard/coupons" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="size-4" />
          </Link>
        }
      />
      <div className="px-6 pb-8">
        <CouponForm mode="edit" coupon={coupon} />
      </div>
    </div>
  )
}
