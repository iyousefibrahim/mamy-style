"use client"

import { useTranslations } from "next-intl"
import { Heart, ShoppingBag } from "lucide-react"
import { AuthGate } from "@/components/AuthGate"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/features/home/components/ProductCard"
import { EmptyState } from "@/components/EmptyState"
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
      <AuthGate
        title={t("loginTitle")}
        description={t("loginDesc")}
        loginLabel={t("loginBtn")}
      />
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
      <div className="wrapper py-24">
        <EmptyState
          icon={Heart}
          iconClassName="text-rose-300"
          iconBgClassName="bg-rose-50"
          badgeIcon={ShoppingBag}
          title={t("empty")}
          description={t("emptyDesc")}
          action={{ label: t("shopNow"), href: "/products" }}
        />
      </div>
    )
  }

  return (
    <div className="wrapper py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <span className="inline-flex items-center justify-center h-6 px-2.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold">
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
