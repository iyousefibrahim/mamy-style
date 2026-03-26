import { setRequestLocale, getTranslations } from "next-intl/server"
import { OrdersPage } from "@/features/orders/components/OrdersPage"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "orders" })
  return { title: t("title") }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <OrdersPage />
}
