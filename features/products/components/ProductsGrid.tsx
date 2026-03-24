"use client"

import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/features/home/components/ProductCard"
import type { Product } from "@/features/dashboard/types"
import { PRODUCTS_PAGE_SIZE } from "../api/products"

type Props = {
  products: Product[]
  isLoading: boolean
  onToggleFavorite: (productId: string) => void
  isFavorited: (productId: string) => boolean
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border/40 overflow-hidden flex flex-col">
      <Skeleton className="h-60 w-full" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3 mt-2" />
      </div>
    </div>
  )
}

export function ProductsGrid({ products, isLoading, onToggleFavorite, isFavorited }: Props) {
  const t = useTranslations("products")

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: PRODUCTS_PAGE_SIZE }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-2">
        <p className="text-lg font-semibold">{t("noResults")}</p>
        <p className="text-muted-foreground text-sm">{t("noResultsDesc")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onToggleFavorite={onToggleFavorite}
          isFavorited={isFavorited(product.id)}
        />
      ))}
    </div>
  )
}
