"use client"

import { memo } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ShoppingBag } from "lucide-react"
import { FavoriteButton } from "@/components/FavoriteButton"
import type { Product } from "../types"

type Props = {
  product: Product
  onToggleFavorite: (productId: string) => void
  isFavorited: boolean
}

export const ProductCard = memo(function ProductCard({ product, onToggleFavorite, isFavorited }: Props) {
  const t = useTranslations("home")

  const hasDiscount = product.discount_percentage > 0
  const currentPrice = hasDiscount
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price

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
          <FavoriteButton
            productId={product.id}
            isFavorited={isFavorited}
            onToggleFavorite={onToggleFavorite}
            variant="overlay"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="font-semibold text-base mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </p>
        <div className="mt-auto pt-2">
          <span className="font-extrabold text-foreground text-xl">
            {Math.round(currentPrice).toLocaleString("en-US")} EGP
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through font-medium mt-0.5 ms-2">
              {product.price.toLocaleString("en-US")}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
})
