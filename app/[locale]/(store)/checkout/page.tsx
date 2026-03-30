import { setRequestLocale, getTranslations } from "next-intl/server"
import { CheckoutPage } from "@/features/checkout/components/CheckoutPage"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ couponId?: string; couponCode?: string; discount?: string; freeShipping?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "checkout" })
  return { title: t("title") }
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params
  const { couponId, couponCode, discount, freeShipping } = await searchParams
  setRequestLocale(locale)
  return (
    <CheckoutPage
      couponId={couponId ?? null}
      couponCode={couponCode ?? null}
      discountAmount={Number(discount ?? 0)}
      couponFreeShipping={freeShipping === "1"}
    />
  )
}
