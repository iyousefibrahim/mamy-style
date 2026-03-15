import { getTranslations } from "next-intl/server"
import { Construction } from "lucide-react"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"

export async function generateMetadata() {
  const t = await getTranslations("dashboard")
  return { title: t("nav.orders") }
}

export default async function OrdersPage() {
  const t = await getTranslations("dashboard")

  return (
    <div>
      <DashboardHeader
        segments={[{ label: t("nav.orders") }]}
        title={t("nav.orders")}
      />
      <div className="px-6 pb-8 flex flex-col items-center justify-center min-h-[40vh] gap-4 text-muted-foreground">
        <Construction className="size-12 opacity-30" />
        <p className="text-lg font-medium">{t("common.comingSoonTitle")}</p>
        <p className="text-sm">{t("common.comingSoonDesc")}</p>
      </div>
    </div>
  )
}
