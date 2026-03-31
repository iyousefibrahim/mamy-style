"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
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
import { useCurrentProfile, useUpdateProfile } from "@/features/dashboard/hooks/useProfile"
import { getUpdateProfileSchema, type UpdateProfileFormValues } from "@/features/dashboard/types"

export function ProfileInfoForm() {
  const t = useTranslations("profile")
  const tv = useTranslations("validation")
  const { data: profile } = useCurrentProfile()
  const updateProfile = useUpdateProfile()

  const schema = getUpdateProfileSchema(tv)

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", username: "", email: "", phone: "" },
  })

  useEffect(() => {
    if (!profile) return
    const [firstName = "", ...rest] = profile.full_name?.split(" ") ?? []
    form.reset({
      firstName,
      lastName: rest.join(" "),
      username: profile.username ?? "",
      email: profile.email,
      phone: profile.phone ?? "",
    })
  }, [profile, form])

  function onSubmit(values: UpdateProfileFormValues) {
    updateProfile.mutate(
      {
        full_name: `${values.firstName} ${values.lastName}`.trim(),
        username: values.username,
        phone: values.phone || null,
      },
      {
        onSuccess: () => toast.success(t("profileUpdated")),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username")}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl><Input {...field} disabled /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phone")}</FormLabel>
              <FormControl><Input {...field} placeholder="01012345678" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={updateProfile.isPending}>
            {t("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
