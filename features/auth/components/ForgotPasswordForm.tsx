"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { forgotPassword } from "../api/auth"
import { getForgotPasswordSchema, type ForgotPasswordFormValues } from "../types"

export function ForgotPasswordForm() {
  const t = useTranslations("auth")
  const tc = useTranslations("common")
  const tv = useTranslations("validation")
  const [submitted, setSubmitted] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(getForgotPasswordSchema(tv)),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsPending(true)
    setError(null)
    try {
      await forgotPassword(values.email)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : tc("error"))
    } finally {
      setIsPending(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("resetPassword")}</CardTitle>
          <CardDescription>{t("resetEmailSent")}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link href="/login" className="text-primary text-sm font-medium hover:underline">
            {t("signIn")}
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("forgotPassword")}</CardTitle>
        <CardDescription>{t("forgotPasswordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? tc("loading") : t("sendResetLink")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/login" className="text-primary text-sm font-medium hover:underline">
          {t("signIn")}
        </Link>
      </CardFooter>
    </Card>
  )
}
