"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, ShoppingBag } from "lucide-react"
import type { Product } from "../types"

type Props = {
  product: Product
  onAddToCart: (productId: string) => void
  onToggleFavorite: (productId: string) => void
  isFavorited: boolean
}

export function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorited }: Props) {
  const t = useTranslations("home")

  const hasDiscount = product.discount_percentage > 0
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discount_percentage / 100)
    : null

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-card rounded-3xl border border-border/40 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="size-full flex items-center justify-center">
            <ShoppingBag className="size-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

        {hasDiscount && (
          <span className="absolute top-4 inset-s-4 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            -{Math.round(product.discount_percentage)}% {t("products.off")}
          </span>
        )}

        {/* Favorite button */}
        <div className="absolute bottom-4 inset-e-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="icon"
            className="rounded-full shadow-lg bg-white/90 text-primary hover:bg-primary hover:text-white backdrop-blur-sm border-0 size-10 cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite(product.id)
            }}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`size-5 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="font-semibold text-base mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </p>
        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-extrabold text-foreground text-xl">
              {product.price.toLocaleString("en-US")} EGP
            </span>
            {originalPrice !== null && (
              <span className="text-xs text-muted-foreground line-through font-medium mt-0.5">
                {Math.round(originalPrice).toLocaleString("en-US")}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="rounded-xl px-4 h-10 gap-2 shrink-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAddToCart(product.id)
            }}
          >
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline-block">{t("products.addToCart")}</span>
          </Button>
        </div>
      </div>
    </Link>
  )
}
