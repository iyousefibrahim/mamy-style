import { getTranslations } from "next-intl/server"
import dynamic from "next/dynamic"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCards } from "@/features/dashboard/components/overview/StatsCards"
import { LowStockAlert } from "@/features/dashboard/components/overview/LowStockAlert"
import { FastActions } from "@/features/dashboard/components/overview/FastActions"
import { fetchOverviewData } from "@/features/dashboard/api/overview.server"

// Lazy-load recharts-heavy chart components — reduces initial JS bundle for admin
const ProductsByCategoryChart = dynamic(
  () => import("@/features/dashboard/components/overview/ProductsByCategoryChart").then((m) => m.ProductsByCategoryChart),
  { loading: () => <Skeleton className="h-75 w-full rounded-xl" /> }
)
const StockByCategoryChart = dynamic(
  () => import("@/features/dashboard/components/overview/StockByCategoryChart").then((m) => m.StockByCategoryChart),
  { loading: () => <Skeleton className="h-75 w-full rounded-xl" /> }
)
const NewProductsChart = dynamic(
  () => import("@/features/dashboard/components/overview/NewProductsChart").then((m) => m.NewProductsChart),
  { loading: () => <Skeleton className="h-75 w-full rounded-xl" /> }
)

function getGreeting(t: (key: string) => string) {
  const hour = new Date().getHours()
  if (hour < 12) return t("greetingMorning")
  if (hour < 17) return t("greetingAfternoon")
  return t("greetingEvening")
}

export async function generateMetadata() {
  const t = await getTranslations("dashboard.overview")
  return { title: t("title") }
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard.overview")

  const { firstName, productsByCategoryData, stockByCategoryData, newProductsData } =
    await fetchOverviewData()

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-4 pb-6">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {getGreeting(t)}, {firstName}
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {/* Stats */}
        <StatsCards />

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ProductsByCategoryChart data={productsByCategoryData} />
          <StockByCategoryChart data={stockByCategoryData} />
          <LowStockAlert />
        </div>

        {/* Area chart full width */}
        <NewProductsChart data={newProductsData} />

        {/* Fast actions */}
        <FastActions />
      </div>
    </div>
  )
}
