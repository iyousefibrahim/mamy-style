import { setRequestLocale, getTranslations } from "next-intl/server"
import { CheckoutPage } from "@/features/checkout/components/CheckoutPage"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ coupon?: string; discount?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "checkout" })
  return { title: t("title") }
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params
  const { coupon, discount } = await searchParams
  setRequestLocale(locale)
  return (
    <CheckoutPage
      couponCode={coupon ?? null}
      discountAmount={Number(discount ?? 0)}
    />
  )
}
