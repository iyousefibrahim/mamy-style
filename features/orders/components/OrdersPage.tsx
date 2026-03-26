"use client"

import { Suspense, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Lock, PackageOpen } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderCard } from "./OrderCard"
import { useOrders } from "../hooks/useOrders"

function PaymentFailedToast() {
  const searchParams = useSearchParams()
  const t = useTranslations("orders")
  const shown = useRef(false)

  useEffect(() => {
    if (!shown.current && searchParams.get("payment") === "failed") {
      shown.current = true
      toast.error(t("paymentFailed"))
    }
  }, [searchParams, t])

  return null
}

export function OrdersPage() {
  const t = useTranslations("orders")
  const { user, orders, isLoading } = useOrders()

  if (!user) {
    return (
      <div className="wrapper py-24 flex flex-col items-center gap-4 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <Lock className="size-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">{t("loginTitle")}</h2>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full px-8 h-10 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
        >
          {t("loginBtn")}
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="wrapper py-8 max-w-2xl">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="wrapper py-24 flex flex-col items-center gap-4 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <PackageOpen className="size-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">{t("empty")}</h2>
        <p className="text-muted-foreground text-sm">{t("emptyDesc")}</p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full px-8 h-10 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
        >
          {t("shopNow")}
        </Link>
      </div>
    )
  }

  return (
    <div className="wrapper py-8 max-w-2xl">
      <Suspense fallback={null}>
        <PaymentFailedToast />
      </Suspense>
      <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
