"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getPageItems } from "@/utils/pagination"
import { useFavorites } from "@/hooks/useFavorites"
import { usePublicProducts } from "../hooks/useProducts"
import { PRODUCTS_PAGE_SIZE } from "../api/products"
import { ProductsGrid } from "./ProductsGrid"
import { ProductsSidebar } from "./ProductsSidebar"

export function ProductsPage() {
  const t = useTranslations("products")
  const tg = useTranslations("common")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Read filters from URL
  const urlSearch = searchParams.get("q") ?? ""
  const categoryName = searchParams.get("category") ?? ""
  const sort = (searchParams.get("sort") ?? "newest") as "newest" | "price_asc" | "price_desc" | "name_asc"
  const page = Number(searchParams.get("page")) || 1
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined

  function updateParams(updates: Record<string, string | null>, scrollTop = false) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key)
      else params.set(key, value)
    }
    if (updates.page) params.set("page", updates.page)
    router.replace(`${pathname}?${params.toString()}`, { scroll: scrollTop })
  }

  const hasActiveFilters = Boolean(categoryName || minPrice !== undefined || maxPrice !== undefined || sort !== "newest")
  const activeFilterCount = [categoryName, minPrice !== undefined, maxPrice !== undefined, sort !== "newest"].filter(Boolean).length

  const filters = { search: urlSearch, categoryName, sort, minPrice, maxPrice, page }
  const { data: result, isLoading, isError } = usePublicProducts(filters)
  const { isFavorited, toggleFavorite } = useFavorites()

  const products = result?.data ?? []
  const total = result?.total ?? 0
  const totalPages = Math.ceil(total / PRODUCTS_PAGE_SIZE)

  const sidebarProps = {
    categoryName,
    sort,
    minPrice,
    maxPrice,
    onCategoryChange: (name: string) => updateParams({ category: name || null }),
    onSortChange: (v: string) => updateParams({ sort: v }),
    onPriceChange: (min: number | undefined, max: number | undefined) =>
      updateParams({
        minPrice: min !== undefined ? String(min) : null,
        maxPrice: max !== undefined ? String(max) : null,
      }),
    onClearAll: () => updateParams({ category: null, minPrice: null, maxPrice: null, sort: null }),
    hasActiveFilters,
  }

  return (
    <div className="wrapper py-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        {!isLoading && total > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("showingResults", { count: total })}
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-muted/50 rounded-xl p-4">
            <ProductsSidebar {...sidebarProps} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Mobile filters trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" className="gap-2 cursor-pointer" />}>
                <SlidersHorizontal className="size-4" />
                {t("filters")}
                {activeFilterCount > 0 && (
                  <Badge className="size-5 p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader className="pb-2">
                  <SheetTitle>{t("filters")}</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <ProductsSidebar {...sidebarProps} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Error */}
          {isError && (
            <p className="text-center text-destructive py-12">{tg("error")}</p>
          )}

          {/* Grid */}
          {!isError && (
            <ProductsGrid
              products={products}
              isLoading={isLoading}
              onToggleFavorite={toggleFavorite}
              isFavorited={isFavorited}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text={t("previous")}
                    onClick={(e) => { e.preventDefault(); updateParams({ page: String(Math.max(1, page - 1)) }, true) }}
                    aria-disabled={page === 1}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {getPageItems(page, totalPages).map((item, i) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === page}
                        onClick={(e) => { e.preventDefault(); updateParams({ page: String(item) }, true) }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    text={t("next")}
                    onClick={(e) => { e.preventDefault(); updateParams({ page: String(Math.min(totalPages, page + 1)) }, true) }}
                    aria-disabled={page === totalPages}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}
