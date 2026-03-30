"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useCategoryOptions } from "../hooks/useProducts"

type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc"

type Props = {
  categoryName: string
  sort: SortOption
  minPrice: number | undefined
  maxPrice: number | undefined
  onCategoryChange: (name: string) => void
  onSortChange: (sort: SortOption) => void
  onPriceChange: (min: number | undefined, max: number | undefined) => void
  onClearAll: () => void
  hasActiveFilters: boolean
}

const PRICE_MIN = 0
const PRICE_MAX = 5000

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-primary/10 last:border-b-0 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between cursor-pointer"
      >
        <span className="font-semibold text-sm">{title}</span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export function ProductsSidebar({
  categoryName,
  sort,
  minPrice,
  maxPrice,
  onCategoryChange,
  onSortChange,
  onPriceChange,
  onClearAll,
  hasActiveFilters,
}: Props) {
  const t = useTranslations("products")
  const { data: categories = [] } = useCategoryOptions()

  // Local price state for smooth slider dragging
  const [localPrice, setLocalPrice] = useState([minPrice ?? PRICE_MIN, maxPrice ?? PRICE_MAX])

  // Sync during render when URL params change externally (e.g. Clear All)
  const [prevMin, setPrevMin] = useState(minPrice)
  const [prevMax, setPrevMax] = useState(maxPrice)
  if (prevMin !== minPrice || prevMax !== maxPrice) {
    setPrevMin(minPrice)
    setPrevMax(maxPrice)
    setLocalPrice([minPrice ?? PRICE_MIN, maxPrice ?? PRICE_MAX])
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Clear All */}
      {hasActiveFilters && (
        <div className="pb-3 mb-1 border-b">
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-primary h-auto p-0 cursor-pointer hover:bg-transparent hover:text-primary/80">
            {t("clearAll")}
          </Button>
        </div>
      )}

      {/* Categories */}
      <FilterSection title={t("categories")}>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(categoryName === cat.name ? "" : cat.name)}
              className={`text-start text-sm px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                categoryName === cat.name
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-primary/10 text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title={t("sortBy")}>
        <div className="flex flex-col gap-1">
          {([
            { value: "newest", label: t("sortNewest") },
            { value: "price_asc", label: t("sortPriceAsc") },
            { value: "price_desc", label: t("sortPriceDesc") },
            { value: "name_asc", label: t("sortName") },
          ] as { value: SortOption; label: string }[]).map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`text-start text-sm px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
                sort === option.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-primary/10 text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title={t("priceRange")}>
        <div className="flex flex-col gap-4 px-1">
          <Slider
            value={localPrice}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            onValueChange={(val) => setLocalPrice(val as number[])}
            onValueCommitted={(val) => {
              const [min, max] = val as number[]
              onPriceChange(min > PRICE_MIN ? min : undefined, max < PRICE_MAX ? max : undefined)
            }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span dir="ltr">{localPrice[0]} {t("egp")}</span>
            <span dir="ltr">{localPrice[1]} {t("egp")}</span>
          </div>
        </div>
      </FilterSection>
    </div>
  )
}
