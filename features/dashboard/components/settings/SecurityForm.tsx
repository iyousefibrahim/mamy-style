"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updatePasswordSchema, type UpdatePasswordFormValues } from "../../types"
import { createClient } from "@/lib/supabase/client"

export function SecurityForm() {
  const t = useTranslations("dashboard.settings")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  async function onSubmit(values: UpdatePasswordFormValues) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: values.newPassword })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(t("passwordUpdated"))
      form.reset()
    }
  }

  function PasswordInput({
    show,
    toggle,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    show: boolean
    toggle: () => void
  }) {
    return (
      <div className="relative">
        <Input type={show ? "text" : "password"} className="pr-10" {...props} />
        <button
          type="button"
          onClick={toggle}
          tabIndex={-1}
          className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h3 className="font-semibold">{t("securityTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("securitySubtitle")}</p>
        </div>

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("currentPassword")}</FormLabel>
              <FormControl>
                <PasswordInput
                  show={showCurrent}
                  toggle={() => setShowCurrent((v) => !v)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newPassword")}</FormLabel>
              <FormControl>
                <PasswordInput
                  show={showNew}
                  toggle={() => setShowNew((v) => !v)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <PasswordInput
                  show={showConfirm}
                  toggle={() => setShowConfirm((v) => !v)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit">{t("updatePassword")}</Button>
        </div>
      </form>
    </Form>
  )
}
