"use client"

import { useState, useMemo } from "react"
import { useRouter } from "@/i18n/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations, useLocale } from "next-intl"
import { useCartPage } from "@/features/cart/hooks/useCartPage"
import { clearCartItems } from "@/features/cart/api/cart"
import { createOrder } from "../api/checkout"
import { useGeo, governorates } from "./useGeo"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/geo/egypt"
import { getDiscountedPrice } from "@/lib/pricing"
import { redirectToPaymob } from "@/lib/paymob/initiate"
import type { PaymentMethod } from "@/features/dashboard/types"

export type AddressValues = {
  governorateId: number
  cityId: number
  address_line: string
  phone: string
}

export type { PaymentMethod }

export function useCheckout(
  couponCode: string | null,
  discountAmount: number
) {
  const t = useTranslations("checkout")
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, items, isLoading } = useCartPage()

  const [address, setAddress] = useState<AddressValues | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online")

  const { shippingFee, isLocalDelivery, selectedCity } = useGeo(
    address?.governorateId ?? null,
    address?.cityId ?? null
  )

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item.product) return sum
        const price = getDiscountedPrice(item.product.price, item.product.discount_percentage)
        return sum + price * item.quantity
      }, 0),
    [items]
  )

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = shippingFee === null ? 0 : isFreeShipping ? 0 : shippingFee
  const total = subtotal - discountAmount + shipping

  const govName = governorates.find((g) => g.id === address?.governorateId)?.name_en ?? ""

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      if (!address || !selectedCity) throw new Error("Missing address")

      const order = await createOrder({
        governorate: govName,
        city: selectedCity.name_en,
        address_line: address.address_line,
        phone: address.phone,
        subtotal,
        discount: discountAmount,
        shipping_fee: shipping,
        total,
        shipping_type: isLocalDelivery ? "local" : "national",
        payment_method: paymentMethod,
        coupon_code: couponCode,
        items,
      })

      await clearCartItems()
      queryClient.invalidateQueries({ queryKey: ["cart"] })

      return order
    },
    onSuccess: (order) => {
      if (paymentMethod === "cod") {
        router.push(`/orders`)
        toast.success(t("orderPlaced"))
      } else {
        // Redirect to Paymob — handled separately via /api/checkout/initiate
        initiatePaymob(order.id, total, address!)
      }
    },
    onError: (err: Error) => toast.error(err.message),
  })

  async function initiatePaymob(orderId: string, totalEGP: number, addr: AddressValues) {
    try {
      const gov = governorates.find((g) => g.id === addr.governorateId)
      await redirectToPaymob({
        orderId,
        amountPiasters: totalEGP * 100,
        locale,
        billing: {
          first_name: user?.user_metadata?.full_name?.split(" ")[0] ?? "Customer",
          last_name: user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") || ".",
          email: user?.email ?? "",
          phone_number: addr.phone,
          apartment: "NA",
          floor: "NA",
          street: addr.address_line,
          building: "NA",
          city: selectedCity?.name_en ?? "",
          country: "EG",
          state: gov?.name_en ?? "",
          postal_code: "NA",
        },
        items: items
          .filter((i) => i.product)
          .map((i) => ({
            name: i.product!.name,
            amount_cents: getDiscountedPrice(i.product!.price, i.product!.discount_percentage) * 100,
            description: i.product!.name,
            quantity: i.quantity,
          })),
      })
    } catch {
      toast.error(t("paymentInitFailed"))
    }
  }

  return {
    user,
    items,
    isLoading,
    address,
    setAddress,
    paymentMethod,
    setPaymentMethod,
    subtotal,
    shippingFee: shipping,
    isFreeShipping,
    isLocalDelivery,
    discountAmount,
    total,
    placeOrder: placeOrderMutation.mutate,
    isPlacing: placeOrderMutation.isPending,
  }
}
