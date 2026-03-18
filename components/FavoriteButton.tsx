"use client"

import { useTranslations } from "next-intl"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  productId: string
  isFavorited: boolean
  onToggleFavorite: (productId: string) => void
  variant?: "overlay" | "inline"
  className?: string
}

export function FavoriteButton({ productId, isFavorited, onToggleFavorite, variant = "overlay", className }: Props) {
  const t = useTranslations("product")

  if (variant === "inline") {
    return (
      <Button
        variant="outline"
        size="lg"
        className={`gap-2 cursor-pointer ${className ?? ""}`}
        onClick={() => onToggleFavorite(productId)}
        aria-label={isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
      >
        <Heart className={`size-5 ${isFavorited ? "fill-primary text-primary" : ""}`} />
        {isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
      </Button>
    )
  }

  return (
    <Button
      size="icon"
      className="rounded-full shadow-lg bg-white/90 text-primary hover:bg-primary hover:text-white backdrop-blur-sm border-0 size-10 cursor-pointer"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggleFavorite(productId)
      }}
      aria-label={isFavorited ? t("removeFromFavorites") : t("addToFavorites")}
    >
      <Heart className={`size-5 ${isFavorited ? "fill-current" : ""}`} />
    </Button>
  )
}
