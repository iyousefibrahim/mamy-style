"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { ProductCard } from "./ProductCard"
import type { Product } from "../types"

type Props = {
  products: Product[]
  isLoading: boolean
  onToggleFavorite: (productId: string) => void
  isFavorited: (productId: string) => boolean
}

function ProductSkeleton() {
  return (
    <div className="rounded-3xl border border-border/40 overflow-hidden animate-pulse">
      <div className="h-60 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-10 bg-muted rounded-xl mt-4" />
      </div>
    </div>
  )
}

export function FeaturedProducts({ products, isLoading, onToggleFavorite, isFavorited }: Props) {
  const t = useTranslations("home")

  return (
    <section className="py-24 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="wrapper">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">
            {t("products.subtitle")}
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight">{t("products.title")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.length === 0
            ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                {t("products.noResults")}
              </div>
            )
            : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFavorite={onToggleFavorite}
                isFavorited={isFavorited(product.id)}
              />
            ))
          }
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="rounded-full gap-2 px-8 h-12 hover:bg-primary hover:text-white transition-all duration-300 border-2 font-medium cursor-pointer"
          >
            {t("products.viewAll")}
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
