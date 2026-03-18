"use client"

import { useTranslations } from "next-intl"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  productId: string
  onAddToCart: (productId: string) => void
  variant?: "compact" | "full"
  disabled?: boolean
}

export function AddToCartButton({ productId, onAddToCart, variant = "compact", disabled }: Props) {
  const t = useTranslations("product")

  if (variant === "full") {
    return (
      <Button
        size="lg"
        className="w-full gap-2 cursor-pointer"
        disabled={disabled}
        onClick={() => onAddToCart(productId)}
      >
        <ShoppingCart className="size-5" />
        {t("addToCart")}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      className="rounded-xl px-4 h-10 gap-2 shrink-0 cursor-pointer"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onAddToCart(productId)
      }}
    >
      <ShoppingCart className="size-4" />
      <span className="hidden sm:inline-block">{t("addToCart")}</span>
    </Button>
  )
}
