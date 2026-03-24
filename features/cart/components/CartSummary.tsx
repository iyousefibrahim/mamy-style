"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

const VALID_COUPONS: Record<string, { type: "percent" | "fixed"; value: number }> = {
  MAMY10: { type: "percent", value: 10 },
  MAMY50: { type: "fixed", value: 50 },
}

type Props = {
  subtotal: number
}

export function CartSummary({ subtotal }: Props) {
  const t = useTranslations("cart")
  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; type: "percent" | "fixed"; value: number }>(null)
  const [couponError, setCouponError] = useState(false)

  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase()
    const coupon = VALID_COUPONS[code]
    if (coupon) {
      setAppliedCoupon({ code, ...coupon })
      setCouponError(false)
    } else {
      setAppliedCoupon(null)
      setCouponError(true)
    }
  }

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(subtotal * appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, subtotal)
    : 0

  const total = subtotal - discountAmount

  return (
    <div className="bg-muted/40 rounded-2xl p-6 flex flex-col gap-4">
      {/* Coupon */}
      <div>
        <label className="text-sm font-medium mb-2 flex items-center gap-1.5">
          <Tag className="size-3.5" />
          {t("coupon")}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => { setCouponInput(e.target.value); setCouponError(false) }}
            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
            placeholder={t("couponPlaceholder")}
            disabled={!!appliedCoupon}
            className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={!!appliedCoupon || !couponInput.trim()}
            className="rounded-xl cursor-pointer"
          >
            {t("applyCoupon")}
          </Button>
        </div>
        {appliedCoupon && (
          <p className="text-xs text-green-600 mt-1.5 font-medium">{t("couponApplied")}</p>
        )}
        {couponError && (
          <p className="text-xs text-destructive mt-1.5">{t("couponInvalid")}</p>
        )}
      </div>

      <div className="border-t pt-4 flex flex-col gap-2.5">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>{subtotal.toLocaleString()} EGP</span>
        </div>

        {/* Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t("discount")} ({appliedCoupon?.code})</span>
            <span>-{discountAmount.toLocaleString()} EGP</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between font-bold text-lg border-t pt-2.5 mt-1">
          <span>{t("total")}</span>
          <span>{total.toLocaleString()} EGP</span>
        </div>
      </div>

      {/* Actions */}
      <Button
        disabled
        className="w-full rounded-xl h-11 cursor-not-allowed"
        title={t("checkoutComingSoon")}
      >
        {t("checkout")}
      </Button>

      <Link
        href="/products"
        className="text-center text-sm text-primary hover:underline cursor-pointer"
      >
        {t("continueShopping")}
      </Link>
    </div>
  )
}
