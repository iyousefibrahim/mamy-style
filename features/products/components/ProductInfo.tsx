"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/AddToCartButton"
import { FavoriteButton } from "@/components/FavoriteButton"
import type { Product } from "@/features/dashboard/types"

type Props = {
  product: Product
  onAddToCart: (productId: string, color: string | null, size: string | null, quantity: number) => void
  onToggleFavorite: (productId: string) => void
  isFavorited: boolean
}

function StockStatus({ stock }: { stock: number }) {
  const t = useTranslations("product")
  if (stock === 0) return <span className="text-sm font-medium text-destructive">{t("outOfStock")}</span>
  if (stock <= 10) return <span className="text-sm font-medium text-amber-600">{t("lowStock", { count: stock })}</span>
  return <span className="text-sm font-medium text-green-600">{t("inStock")}</span>
}

export function ProductInfo({ product, onAddToCart, onToggleFavorite, isFavorited }: Props) {
  const t = useTranslations("product")

  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0]?.name ?? null)
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] ?? null)
  const [quantity, setQuantity] = useState(1)

  const hasDiscount = product.discount_percentage > 0
  const currentPrice = hasDiscount
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price

  const isOutOfStock = product.stock === 0
  const cannotAddToCart =
    isOutOfStock ||
    (product.colors.length > 0 && !selectedColor) ||
    (product.sizes.length > 0 && !selectedSize)

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>

      {/* Price */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-3xl font-extrabold">
          {Math.round(currentPrice).toLocaleString("en-US")} EGP
        </span>
        {hasDiscount && (
          <span className="text-lg text-muted-foreground line-through">
            {product.price.toLocaleString("en-US")} EGP
          </span>
        )}
        {hasDiscount && (
          <Badge className="bg-red-500 text-white">
            -{Math.round(product.discount_percentage)}% {t("off")}
          </Badge>
        )}
      </div>

      {/* Stock */}
      <StockStatus stock={product.stock} />

      {/* Description */}
      {product.description && (
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      )}

      {/* Brand */}
      {product.brand && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("brand")}:</span>
          <span className="font-medium">{product.brand}</span>
        </div>
      )}

      {/* Category */}
      {product.category_name && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("category")}:</span>
          <span className="font-medium">{product.category_name}</span>
        </div>
      )}

      {/* Colors */}
      {product.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            {t("colors")}{selectedColor ? `: ${selectedColor}` : ""}
          </span>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.name}
                title={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`size-8 rounded-full border-2 transition-all cursor-pointer ${
                  selectedColor === color.name
                    ? "border-primary scale-110 shadow-md"
                    : "border-border hover:border-primary/50"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{t("sizes")}</span>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                  selectedSize === size
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      {!isOutOfStock && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{t("quantity")}</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full cursor-pointer"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full cursor-pointer"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <AddToCartButton
          productId={product.id}
          onAddToCart={(id) => onAddToCart(id, selectedColor, selectedSize, quantity)}
          variant="full"
          disabled={cannotAddToCart}
        />
        <FavoriteButton
          productId={product.id}
          isFavorited={isFavorited}
          onToggleFavorite={onToggleFavorite}
          variant="inline"
          className="w-full"
        />
      </div>
    </div>
  )
}
