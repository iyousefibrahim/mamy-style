"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Lock } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressForm } from "./AddressForm"
import { OrderReview } from "./OrderReview"
import { useCheckout } from "../hooks/useCheckout"

type Props = {
  couponCode: string | null
  discountAmount: number
}

type Step = "address" | "review"

export function CheckoutPage({ couponCode, discountAmount }: Props) {
  const t = useTranslations("checkout")
  const [step, setStep] = useState<Step>("address")

  const {
    user, items, isLoading,
    address, setAddress,
    paymentMethod, setPaymentMethod,
    subtotal, shippingFee, isFreeShipping, isLocalDelivery,
    total, placeOrder, isPlacing,
  } = useCheckout(couponCode, discountAmount)

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
      <div className="wrapper py-8 max-w-lg">
        <Skeleton className="h-8 w-40 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="wrapper py-24 flex flex-col items-center gap-4 text-center">
        <h2 className="text-xl font-bold">{t("emptyCart")}</h2>
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
    <div className="wrapper py-8 max-w-lg">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === "address" ? "text-primary" : "text-muted-foreground"}`}>
          <span className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "address" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>1</span>
          {t("stepAddress")}
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step === "review" ? "text-primary" : "text-muted-foreground"}`}>
          <span className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "review" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>2</span>
          {t("stepReview")}
        </div>
      </div>

      {step === "address" && (
        <AddressForm
          defaultValues={address}
          isFreeShipping={isFreeShipping}
          onSubmit={(values) => {
            setAddress(values)
            setStep("review")
          }}
        />
      )}

      {step === "review" && address && (
        <OrderReview
          items={items}
          subtotal={subtotal}
          discount={discountAmount}
          shippingFee={shippingFee}
          isFreeShipping={isFreeShipping}
          total={total}
          isLocalDelivery={isLocalDelivery}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onBack={() => setStep("address")}
          onPlace={placeOrder}
          isPlacing={isPlacing}
        />
      )}
    </div>
  )
}
