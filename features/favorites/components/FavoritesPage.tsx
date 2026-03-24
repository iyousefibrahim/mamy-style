"use client"

import { useTranslations } from "next-intl"
import { Heart, Lock, ShoppingBag } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/features/home/components/ProductCard"
import { useFavoritesPage } from "../hooks/useFavoritesPage"

function FavoritesGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-3xl" />
      ))}
    </div>
  )
}

export function FavoritesPage() {
  const t = useTranslations("favorites")
  const { user, products, isLoading, isFavorited, toggleFavorite } = useFavoritesPage()

  if (!user) {
    return (
      <div className="wrapper py-24 flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="size-24 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
            <Lock className="size-10 text-rose-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{t("loginTitle")}</h2>
          <p className="text-muted-foreground text-sm max-w-xs">{t("loginDesc")}</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full px-8 h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
        >
          {t("loginBtn")}
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="wrapper py-8">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <FavoritesGridSkeleton />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="wrapper py-24 flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="size-24 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
            <Heart className="size-10 text-rose-300" />
          </div>
          <div className="absolute -bottom-1 -inset-e-1 size-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
            <ShoppingBag className="size-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{t("empty")}</h2>
          <p className="text-muted-foreground text-sm max-w-xs">{t("emptyDesc")}</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full px-8 h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
        >
          {t("shopNow")}
        </Link>
      </div>
    )
  }

  return (
    <div className="wrapper py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          {products.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorited={isFavorited(product.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}
