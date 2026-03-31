"use client"

import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations, useLocale } from "next-intl"
import { Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { governorates, useGeo } from "../hooks/useGeo"
import type { AddressValues } from "../hooks/useCheckout"

type TFn = (key: string) => string

function getAddressSchema(t: TFn) {
  return z.object({
    governorateId: z.coerce.number().min(1, t("selectGovernorateError")),
    cityId: z.coerce.number().min(1, t("selectCityError")),
    address_line: z.string().min(5, t("addressMin")),
    phone: z.string().superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({ code: "custom", message: t("phoneRequired") })
        return
      }
      if (!/^(\+?20|0)1[0125]\d{8}$/.test(val)) {
        ctx.addIssue({ code: "custom", message: t("phoneInvalid") })
      }
    }),
  })
}

type Props = {
  defaultValues?: AddressValues | null
  isFreeShipping: boolean
  onSubmit: (values: AddressValues) => void
}

export function AddressForm({ defaultValues, isFreeShipping, onSubmit }: Props) {
  const t = useTranslations("checkout")
  const locale = useLocale()
  const isAr = locale === "ar"

  const schema = getAddressSchema(t)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as Resolver<z.infer<typeof schema>>,
    defaultValues: {
      governorateId: defaultValues?.governorateId ?? 0,
      cityId: defaultValues?.cityId ?? 0,
      address_line: defaultValues?.address_line ?? "",
      phone: defaultValues?.phone ?? "",
    },
  })

  // HTML <select> always returns strings — coerce to number for comparison
  const governorateId = Number(form.watch("governorateId")) || null
  const cityId = Number(form.watch("cityId")) || null
  const { availableCities, shippingFee, isLocalDelivery } = useGeo(governorateId, cityId)

  // Reset city when governorate changes
  useEffect(() => {
    form.setValue("cityId", 0)
  }, [governorateId, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Governorate */}
        <FormField
          control={form.control}
          name="governorateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("governorate")}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={0}>{t("selectGovernorate")}</option>
                  {governorates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {isAr ? g.name_ar : g.name_en}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="cityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("city")}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  disabled={!governorateId}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  <option value={0}>{t("selectCity")}</option>
                  {availableCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {isAr ? c.name_ar : c.name_en}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address line */}
        <FormField
          control={form.control}
          name="address_line"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("addressLine")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("addressPlaceholder")} className="rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phone")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="01012345678" className="rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Shipping preview */}
        {shippingFee !== null && (
          <div className={`flex items-start gap-3 p-3 rounded-xl text-sm ${
            isFreeShipping || isLocalDelivery
              ? "bg-green-50 text-green-700"
              : "bg-muted/60 text-muted-foreground"
          }`}>
            <Truck className="size-4 mt-0.5 shrink-0" />
            <p>
              {isFreeShipping
                ? t("shippingFree")
                : isLocalDelivery
                  ? t("shippingLocal", { fee: shippingFee })
                  : t("shippingNational", { fee: shippingFee })}
            </p>
          </div>
        )}

        <Button type="submit" className="w-full rounded-xl h-11 cursor-pointer">
          {t("continueToPayment")}
        </Button>
      </form>
    </Form>
  )
}
