"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ShoppingBag, CreditCard, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItemWithProduct } from "@/features/cart/hooks/useCartPage"
import type { PaymentMethod } from "@/features/dashboard/types"
import { getDiscountedPrice } from "@/lib/pricing"

type Props = {
  items: CartItemWithProduct[]
  subtotal: number
  discount: number
  shippingFee: number
  isFreeShipping: boolean
  total: number
  isLocalDelivery: boolean
  paymentMethod: PaymentMethod
  setPaymentMethod: (m: PaymentMethod) => void
  onBack: () => void
  onPlace: () => void
  isPlacing: boolean
}

export function OrderReview({
  items, subtotal, discount, shippingFee, isFreeShipping, total,
  isLocalDelivery, paymentMethod, setPaymentMethod,
  onBack, onPlace, isPlacing,
}: Props) {
  const t = useTranslations("checkout")

  return (
    <div className="space-y-6">
      {/* Items list */}
      <div className="space-y-3">
        {items.map((item) => {
          if (!item.product) return null
          const price = getDiscountedPrice(item.product.price, item.product.discount_percentage)
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative size-14 rounded-xl overflow-hidden bg-muted shrink-0">
                {item.product.image_url ? (
                  <Image src={item.product.image_url} alt={item.product.name} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <ShoppingBag className="size-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                {(item.color || item.size) && (
                  <p className="text-xs text-muted-foreground">
                    {[item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">×{item.quantity}</p>
              </div>
              <p className="text-sm font-medium shrink-0">
                {(price * item.quantity).toLocaleString()} EGP
              </p>
            </div>
          )
        })}
      </div>

      {/* Payment method */}
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("paymentMethod")}</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("online")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors text-sm font-medium cursor-pointer ${
              paymentMethod === "online"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <CreditCard className="size-5" />
            {t("payOnline")}
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("cod")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors text-sm font-medium cursor-pointer ${
              paymentMethod === "cod"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <Banknote className="size-5" />
            {t("payOnDelivery")}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {paymentMethod === "online"
            ? t("payOnlineDesc")
            : isLocalDelivery
              ? t("payOnDeliveryLocalDesc")
              : t("payOnDeliveryNationalDesc")}
        </p>
      </div>

      {/* Totals */}
      <div className="bg-muted/40 rounded-2xl p-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>{subtotal.toLocaleString()} EGP</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t("discount")}</span>
            <span>-{discount.toLocaleString()} EGP</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("shippingFee")}</span>
          {isFreeShipping
            ? <span className="text-green-600 font-medium">{t("freeShipping")}</span>
            : <span>{shippingFee.toLocaleString()} EGP</span>
          }
        </div>
        <div className="flex justify-between font-bold border-t pt-2.5 mt-1">
          <span>{t("total")}</span>
          <span>{total.toLocaleString()} EGP</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl cursor-pointer">
          {t("back")}
        </Button>
        <Button
          onClick={onPlace}
          disabled={isPlacing}
          className="flex-1 rounded-xl h-11 cursor-pointer"
        >
          {isPlacing
            ? t("placing")
            : paymentMethod === "online"
              ? t("payWithPaymob")
              : t("placeOrder")}
        </Button>
      </div>
    </div>
  )
}
