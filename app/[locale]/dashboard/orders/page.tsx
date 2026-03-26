import { getTranslations } from "next-intl/server"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { OrdersTable } from "@/features/dashboard/components/orders/OrdersTable"
import { fetchAllOrders } from "@/features/dashboard/api/orders.server"

export async function generateMetadata() {
  const t = await getTranslations("dashboard")
  return { title: t("nav.orders") }
}

type Props = { searchParams: Promise<{ page?: string }> }

export default async function OrdersPage({ searchParams }: Props) {
  const t = await getTranslations("dashboard")
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const { orders, total, totalPages } = await fetchAllOrders(page)

  return (
    <div>
      <DashboardHeader
        segments={[{ label: t("nav.orders") }]}
        title={t("nav.orders")}
        subtitle={`${total} ${t("orders.ordersTotal")}`}
      />
      <OrdersTable orders={orders} page={page} totalPages={totalPages} />
    </div>
  )
}
