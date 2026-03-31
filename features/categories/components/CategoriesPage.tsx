"use client"

import { useTranslations } from "next-intl"
import { LayoutGrid, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryCard } from "@/features/home/components/CategoryCard"
import { EmptyState } from "@/components/EmptyState"
import { usePublicCategories } from "../hooks/useCategories"

function CategorySkeleton() {
  return (
    <div className="rounded-3xl border border-border/50 overflow-hidden">
      <Skeleton className="h-56 w-full" />
    </div>
  )
}

export function CategoriesPage() {
  const t = useTranslations("categories")
  const tg = useTranslations("common")
  const { data: categories, isLoading, isError } = usePublicCategories()

  return (
    <div className="wrapper py-8">
      <div className="mb-8">
        <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">
          {t("subtitle")}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">{t("title")}</h1>
      </div>

      {isError ? (
        <p className="text-destructive">{tg("error")}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories && categories.length > 0
              ? categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)
              : (
                <div className="col-span-full">
                  <EmptyState
                    icon={LayoutGrid}
                    badgeIcon={Package}
                    title={t("noResults")}
                    className="py-16"
                  />
                </div>
              )}
        </div>
      )}
    </div>
  )
}
