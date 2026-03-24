import { setRequestLocale, getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { CategoriesPage } from "@/features/categories/components/CategoriesPage"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "categories" })
  return { title: t("title") }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense>
      <CategoriesPage />
    </Suspense>
  )
}
