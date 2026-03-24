import { setRequestLocale, getTranslations } from "next-intl/server"
import { ProductDetailPage } from "@/features/products/components/ProductDetailPage"
import { fetchProductServer } from "@/features/products/api/products.server"

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params
  const [product, t] = await Promise.all([
    fetchProductServer(id),
    getTranslations({ locale, namespace: "product" }),
  ])
  return { title: product?.name ?? t("notFound") }
}

export default async function Page({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)

  return <ProductDetailPage productId={id} />
}
