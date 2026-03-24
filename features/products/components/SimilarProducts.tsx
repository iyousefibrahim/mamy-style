"use client"

import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/features/home/components/ProductCard"
import { useFavorites } from "@/hooks/useFavorites"
import { useSimilarProducts } from "../hooks/useProducts"

type Props = {
  productId: string
  categoryName: string | null
}

function SimilarSkeleton() {
  return (
    <div className="rounded-3xl border border-border/40 overflow-hidden flex flex-col">
      <Skeleton className="h-60 w-full" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/3 mt-2" />
      </div>
    </div>
  )
}

export function SimilarProducts({ productId, categoryName }: Props) {
  const t = useTranslations("products")
  const { products, isLoading } = useSimilarProducts(productId, categoryName)
  const { isFavorited, toggleFavorite } = useFavorites()

  if (!isLoading && products.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">{t("similarProducts")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SimilarSkeleton key={i} />)
          : products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorited={isFavorited(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
      </div>
    </section>
  )
}
