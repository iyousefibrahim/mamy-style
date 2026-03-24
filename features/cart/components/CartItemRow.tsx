"use client"

import Image from "next/image"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { CartItemWithProduct } from "../hooks/useCartPage"

type Props = {
  item: CartItemWithProduct
  onUpdateQty: (cartItemId: string, quantity: number) => void
  onRemove: (cartItemId: string) => void
}

export function CartItemRow({ item, onUpdateQty, onRemove }: Props) {
  const t = useTranslations("cart")
  const product = item.product

  const price = product
    ? Math.round(product.price * (1 - product.discount_percentage / 100))
    : 0

  return (
    <div className="flex gap-4 py-5 border-b last:border-0">
      {/* Image */}
      <div className="relative size-20 rounded-xl overflow-hidden bg-muted shrink-0">
        {product?.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center">
            <ShoppingBag className="size-7 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="font-semibold text-sm leading-tight line-clamp-2">
          {product?.name ?? "—"}
        </p>
        {(item.color || item.size) && (
          <div className="flex gap-1.5 flex-wrap">
            {item.color && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {item.color}
              </span>
            )}
            {item.size && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {item.size}
              </span>
            )}
          </div>
        )}
        <p className="font-bold text-base mt-auto">
          {(price * item.quantity).toLocaleString()} EGP
        </p>
      </div>

      {/* Quantity + Remove */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
          onClick={() => onRemove(item.id)}
          aria-label={t("remove")}
        >
          <X className="size-4" />
        </Button>

        <div className="flex items-center gap-2 border rounded-full px-1 py-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 rounded-full cursor-pointer"
            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="size-3" />
          </Button>
          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 rounded-full cursor-pointer"
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            disabled={!!product && item.quantity >= product.stock}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
