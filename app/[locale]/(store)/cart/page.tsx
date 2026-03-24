import { setRequestLocale, getTranslations } from "next-intl/server"
import { CartPage } from "@/features/cart/components/CartPage"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "cart" })
  return { title: t("title") }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CartPage />
}
