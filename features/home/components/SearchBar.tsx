"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { Search, ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { fetchPublicProducts } from "@/features/products/api/products"
import { useDebounce } from "use-debounce"

type Props = {
  onNavigate?: () => void
  inputClassName?: string
}

export function SearchBar({ onNavigate, inputClassName }: Props) {
  const t = useTranslations("home")
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [debouncedQuery] = useDebounce(query, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["search", "dropdown", debouncedQuery],
    queryFn: () => fetchPublicProducts({ search: debouncedQuery, page: 1 }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })

  const results = useMemo(() => data?.data.slice(0, 5) ?? [], [data])
  const showDropdown = open && debouncedQuery.length >= 2

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function navigate(path: string) {
    router.push(path)
    setQuery("")
    setOpen(false)
    onNavigate?.()
  }

  function handleSubmit() {
    const q = query.trim()
    if (!q) return
    navigate(`/products?q=${encodeURIComponent(q)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit()
    if (e.key === "Escape") setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
        <input
          type="text"
          placeholder={t("nav.searchPlaceholder")}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          className={cn(
            "w-full rounded-full border bg-muted/50 ps-10 pe-20 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all",
            inputClassName
          )}
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          className="absolute inset-e-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-full text-xs cursor-pointer"
        >
          {t("nav.search")}
        </Button>
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-2xl shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="size-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">{t("nav.noResults")}</p>
          ) : (
            <>
              {results.map((product) => {
                const price = Math.round(
                  product.price * (1 - product.discount_percentage / 100)
                )
                return (
                  <button
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-start"
                  >
                    <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <ShoppingBag className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {price.toLocaleString()} EGP
                      </p>
                    </div>
                  </button>
                )
              })}
              <button
                onClick={handleSubmit}
                className="w-full p-3 text-sm text-primary font-medium hover:bg-muted transition-colors border-t text-center cursor-pointer"
              >
                {t("nav.seeAllResults")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
