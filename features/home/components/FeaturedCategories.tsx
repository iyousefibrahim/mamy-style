"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
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
          <Button
            variant="link"
            className="hidden md:flex gap-1 text-primary hover:text-primary/80 group p-0 h-auto font-semibold cursor-pointer"
          >
            {t("categories.viewAll")}
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)
          }
        </div>

        <div className="text-center mt-10 md:hidden">
          <Button variant="outline" className="rounded-full gap-2 w-full border-2 h-12 cursor-pointer">
            {t("categories.viewAll")}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
