"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form"
import { useCreateCoupon, useUpdateCoupon } from "@/features/dashboard/hooks/useCoupons"
import { createCouponSchema, type CreateCouponFormValues, type Coupon } from "@/features/dashboard/types"

type Props =
  | { mode: "create" }
  | { mode: "edit"; coupon: Coupon }

export function CouponForm(props: Props) {
  const t = useTranslations("dashboard.coupons")
  const tc = useTranslations("dashboard.common")
  const router = useRouter()

  const defaultValues: CreateCouponFormValues =
    props.mode === "edit"
      ? {
          code: props.coupon.code,
          discount_percent: props.coupon.discount_percent,
          free_shipping: props.coupon.free_shipping,
          max_uses: props.coupon.max_uses,
          is_active: props.coupon.is_active,
          expires_at: props.coupon.expires_at ?? undefined,
        }
      : {
          code: "",
          discount_percent: 0,
          free_shipping: false,
          max_uses: 100,
          is_active: true,
          expires_at: undefined,
        }

  const form = useForm<CreateCouponFormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues,
  })

  const createCoupon = useCreateCoupon()
  const updateCoupon = useUpdateCoupon()
  const isPending = createCoupon.isPending || updateCoupon.isPending

  function onSubmit(values: CreateCouponFormValues) {
    if (values.discount_percent === 0 && !values.free_shipping) {
      form.setError("discount_percent", { message: t("noBenefit") })
      return
    }

    const payload = {
      code: values.code.toUpperCase(),
      discount_percent: values.discount_percent,
      free_shipping: values.free_shipping,
      max_uses: values.max_uses,
      is_active: values.is_active,
      expires_at: values.expires_at || null,
    }

    if (props.mode === "create") {
      createCoupon.mutate(payload, {
        onSuccess: () => {
          toast.success(t("createSuccess"))
          router.push("/dashboard/coupons" as "/dashboard")
        },
        onError: (err) => toast.error(err.message),
      })
    } else {
      updateCoupon.mutate(
        { id: props.coupon.id, payload },
        {
          onSuccess: () => {
            toast.success(t("updateSuccess"))
            router.push("/dashboard/coupons" as "/dashboard")
          },
          onError: (err) => toast.error(err.message),
        }
      )
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{props.mode === "create" ? t("createTitle") : t("editTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("code")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. SUMMER20"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="font-mono uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount percent */}
            <FormField
              control={form.control}
              name="discount_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("discountPercent")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="pe-8"
                      />
                      <span className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                  </FormControl>
                  <FormDescription>{t("discountPercentDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Free shipping */}
            <FormField
              control={form.control}
              name="free_shipping"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-sm font-medium">{t("freeShipping")}</FormLabel>
                    <FormDescription className="text-xs">{t("freeShippingDesc")}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Max uses */}
            <FormField
              control={form.control}
              name="max_uses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("maxUses")}</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} placeholder="100" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expires at */}
            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("expiresAt")}</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>{t("expiresAtDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is active */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="text-sm font-medium">{t("isActive")}</FormLabel>
                    <FormDescription className="text-xs">{t("isActiveDesc")}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? tc("saving") : tc("save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/coupons" as "/dashboard")}
              >
                {tc("cancel")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
