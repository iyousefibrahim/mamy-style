"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { ChevronDown, ShoppingBag, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import type { OrderWithItems, OrderStatus } from "@/features/dashboard/types"
import { formatDateShort } from "@/utils/formatDate"
import { redirectToPaymob } from "@/lib/paymob/initiate"

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  confirmed:       "bg-blue-100 text-blue-700",
  processing:      "bg-purple-100 text-purple-700",
  shipped:         "bg-orange-100 text-orange-700",
  delivered:       "bg-green-100 text-green-700",
  cancelled:       "bg-red-100 text-red-700",
}

type Props = { order: OrderWithItems }

export function OrderCard({ order }: Props) {
  const t = useTranslations("orders")
  const locale = useLocale()
  const { data: user } = useCurrentUser()
  const [open, setOpen] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  const date = formatDateShort(order.created_at)

  const canRetryPayment =
    order.status === "pending_payment" && order.payment_method === "online"

  async function handleRetryPayment() {
    setIsPaying(true)
    try {
      const fullName = user?.user_metadata?.full_name ?? ""
      await redirectToPaymob({
        orderId: order.id,
        amountPiasters: order.total * 100,
        locale,
        billing: {
          first_name: fullName.split(" ")[0] || "Customer",
          last_name: fullName.split(" ").slice(1).join(" ") || ".",
          email: user?.email ?? "",
          phone_number: order.phone,
          apartment: "NA",
          floor: "NA",
          street: order.address_line,
          building: "NA",
          city: order.city,
          country: "EG",
          state: order.governorate,
          postal_code: "NA",
        },
        items: order.order_items.map((item) => ({
          name: item.name,
          amount_cents: item.price * 100,
          description: item.name,
          quantity: item.quantity,
        })),
      })
    } catch {
      toast.error(t("retryFailed"))
      setIsPaying(false)
    }
  }

  return (
    <div className="border rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors cursor-pointer text-start"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
            {t(`status.${order.status}`)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold">{order.total.toLocaleString("en-EG")} EGP</p>
          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Retry payment banner */}
      {canRetryPayment && (
        <div className="border-t px-4 py-3 bg-yellow-50 flex items-center justify-between gap-3">
          <p className="text-xs text-yellow-700">{t("pendingPaymentNote")}</p>
          <Button
            size="sm"
            className="shrink-0 gap-1.5 cursor-pointer"
            disabled={isPaying}
            onClick={handleRetryPayment}
          >
            <CreditCard className="size-3.5" />
            {isPaying ? t("redirecting") : t("payNow")}
          </Button>
        </div>
      )}

      {/* Items (expandable) */}
      {open && (
        <div className="border-t px-4 py-3 space-y-3 bg-muted/20">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative size-12 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <ShoppingBag className="size-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {(item.color || item.size) && (
                  <p className="text-xs text-muted-foreground">
                    {[item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm">×{item.quantity}</p>
                <p className="text-xs text-muted-foreground">{(item.price * item.quantity).toLocaleString("en-EG")} EGP</p>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="border-t pt-3 space-y-1 text-xs text-muted-foreground">
            <p>{t("address")}: {order.address_line}, {order.city}, {order.governorate}</p>
            <p>{t("phone")}: {order.phone}</p>
            {order.payment_method === "cod" && (
              <p className="text-amber-600 font-medium">{t("codNote")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
