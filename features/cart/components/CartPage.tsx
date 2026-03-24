"use client"

import { useTranslations } from "next-intl"
import { ShoppingCart, Lock } from "lucide-react"
import { Link } from "@/i18n/navigation"

import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CartItemRow } from "./CartItemRow"
import { CartSummary } from "./CartSummary"
import { useCartPage } from "../hooks/useCartPage"

const FREE_SHIPPING_THRESHOLD = 500

function CartSkeleton() {
  return (
    <div className="flex gap-4 py-5 border-b">
      <Skeleton className="size-20 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </div>
    </div>
  )
}

export function CartPage() {
  const t = useTranslations("cart")
  const tCommon = useTranslations("dashboard.common")
  const { user, items, isLoading, totalCount, updateQuantity, clearCart } = useCartPage()

  // Not logged in
  if (!user) {
    return (
      <div className="wrapper py-24 flex flex-col items-center gap-4 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <Lock className="size-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">{t("loginTitle")}</h2>
        <p className="text-muted-foreground text-sm">{t("loginDesc")}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full px-8 h-10 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors mt-2"
        >
          {t("loginBtn")}
        </Link>
      </div>
    )
  }

  // Loading
  if (isLoading) {
    return (
      <div className="wrapper py-8">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => <CartSkeleton key={i} />)}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    )
  }

  // Empty
  if (items.length === 0) {
    return (
      <div className="wrapper py-24 flex flex-col items-center gap-4 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="size-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">{t("empty")}</h2>
        <p className="text-muted-foreground text-sm">{t("emptyDesc")}</p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full px-8 h-10 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors mt-2"
        >
          {t("shopNow")}
        </Link>
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => {
    const price = item.product
      ? Math.round(item.product.price * (1 - item.product.discount_percentage / 100))
      : 0
    return sum + price * item.quantity
  }, 0)

  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  return (
    <div className="wrapper py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          {t("title")} — {t("items", { count: totalCount })}
        </h1>
        <AlertDialog>
          <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md px-3 h-8 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
            {t("clearCart")}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("clearCartConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>{t("clearCartConfirmDesc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">{tCommon("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 cursor-pointer"
                onClick={clearCart}
              >
                {t("clearCart")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQty={updateQuantity}
              onRemove={(id) => updateQuantity(id, 0)}
            />
          ))}

          {/* Free shipping bar */}
          <div className="mt-6 p-4 bg-muted/40 rounded-2xl">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <p className="text-sm font-medium text-green-600">{t("freeShipping")}</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-2">
                {t("freeShippingProgress", { amount: remaining.toLocaleString() })}
              </p>
            )}
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  )
}
