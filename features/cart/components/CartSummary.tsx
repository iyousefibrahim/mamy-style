"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Tag, Truck } from "lucide-react"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/geo/egypt";

type ValidatedCoupon = {
  id: string
  code: string
  discount_percent: number
  free_shipping: boolean
}

type Props = {
  subtotal: number;
  hasOutOfStock: boolean;
};

export function CartSummary({ subtotal, hasOutOfStock }: Props) {
  const t = useTranslations("cart");
  const tv = useTranslations("validation");
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return

    setIsValidating(true)
    setCouponError(null)

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setAppliedCoupon(null)
        setCouponError(tv(data.error))
        return
      }

      setAppliedCoupon(data as ValidatedCoupon)
    } catch {
      setCouponError(tv("couponNotFound"))
    } finally {
      setIsValidating(false)
    }
  }

  const discountAmount = appliedCoupon?.discount_percent
    ? Math.round((subtotal * appliedCoupon.discount_percent) / 100)
    : 0

  const couponFreeShipping = appliedCoupon?.free_shipping ?? false
  const total = subtotal - discountAmount
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

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
            onChange={(e) => {
              setCouponInput(e.target.value.toUpperCase());
              setCouponError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
            placeholder={t("couponPlaceholder")}
            disabled={!!appliedCoupon}
            className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 font-mono"
          />
          {appliedCoupon ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setAppliedCoupon(null); setCouponInput("") }}
              className="rounded-xl cursor-pointer"
            >
              {t("removeCoupon")}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={isValidating || !couponInput.trim()}
              className="rounded-xl cursor-pointer"
            >
              {isValidating ? "..." : t("applyCoupon")}
            </Button>
          )}
        </div>
        {appliedCoupon && (
          <div className="mt-1.5 space-y-0.5">
            {appliedCoupon.discount_percent > 0 && (
              <p className="text-xs text-green-600 font-medium">
                {appliedCoupon.discount_percent}% {t("couponApplied")}
              </p>
            )}
            {appliedCoupon.free_shipping && (
              <p className="text-xs text-green-600 font-medium">
                {t("couponFreeShipping")}
              </p>
            )}
          </div>
        )}
        {couponError && (
          <p className="text-xs text-destructive mt-1.5">{couponError}</p>
        )}
      </div>

      {/* Free shipping progress — only show if no free-shipping coupon applied */}
      {!couponFreeShipping && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <Truck className="size-3.5 shrink-0 text-muted-foreground" />
            {remainingForFreeShipping === 0
              ? <span className="text-green-600 font-medium">{t("freeShipping")}</span>
              : <span className="text-muted-foreground">{t("freeShippingProgress", { amount: remainingForFreeShipping.toLocaleString() })}</span>
            }
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {couponFreeShipping && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <Truck className="size-3.5 shrink-0" />
          {t("freeShipping")}
        </div>
      )}

      <div className="border-t pt-4 flex flex-col gap-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>{subtotal.toLocaleString()} EGP</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t("discount")} ({appliedCoupon?.code})</span>
            <span>-{discountAmount.toLocaleString()} EGP</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg border-t pt-2.5 mt-1">
          <span>{t("total")}</span>
          <span>{total.toLocaleString()} EGP</span>
        </div>
      </div>

      {hasOutOfStock && (
        <p className="text-xs text-destructive text-center">
          {t("outOfStockWarning")}
        </p>
      )}
      <Button
        className="w-full rounded-xl h-11 cursor-pointer"
        disabled={hasOutOfStock}
        onClick={() => {
          const params = new URLSearchParams();
          if (appliedCoupon) {
            params.set("couponId", appliedCoupon.id);
            params.set("couponCode", appliedCoupon.code);
            if (discountAmount > 0) params.set("discount", String(discountAmount));
            if (appliedCoupon.free_shipping) params.set("freeShipping", "1");
          }
          router.push(`/checkout?${params.toString()}`);
        }}
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
  );
}
