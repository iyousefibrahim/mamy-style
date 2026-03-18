import { setRequestLocale, getTranslations } from "next-intl/server"
import { HomeNavbar } from "@/features/home/components/HomeNavbar"
import { HomeFooter } from "@/features/home/components/HomeFooter"
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

  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <main>
        <ProductDetailPage productId={id} />
      </main>
      <HomeFooter />
    </div>
  )
}
