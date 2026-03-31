import { setRequestLocale, getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { ProductsPage } from "@/features/products/components/ProductsPage"
import { Skeleton } from "@/components/ui/skeleton"

function ProductsPageSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-border/40 overflow-hidden flex flex-col">
          <Skeleton className="h-60 w-full" />
          <div className="p-5 flex flex-col gap-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  return { title: t("title") }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={<div className="wrapper py-8"><ProductsPageSkeleton /></div>}>
      <ProductsPage />
    </Suspense>
  )
}
