"use client"

import { useTranslations } from "next-intl"
import { ChevronRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { CategoryCard } from "./CategoryCard"
import type { Category } from "../types"

type Props = {
  categories: Category[]
  isLoading: boolean
}

function CategorySkeleton() {
  return (
    <div className="rounded-3xl border border-border/50 overflow-hidden animate-pulse">
      <div className="h-56 bg-muted" />
    </div>
  )
}

export function FeaturedCategories({ categories, isLoading }: Props) {
  const t = useTranslations("home")

  return (
    <section className="py-24 bg-linear-to-b from-background to-muted/30">
      <div className="wrapper">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-start">
            <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">
              {t("categories.subtitle")}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">{t("categories.title")}</h2>
          </div>
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-1 text-primary hover:text-primary/80 group p-0 h-auto font-semibold cursor-pointer"
          >
            {t("categories.viewAll")}
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)
          }
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 h-12 border-2 font-medium cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 text-sm"
          >
            {t("categories.viewAll")}
            <ChevronRight className="size-5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  )
}
