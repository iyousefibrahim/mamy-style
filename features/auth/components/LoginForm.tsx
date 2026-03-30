"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useLogin } from "../hooks/useAuth"
import { getLoginSchema, type LoginFormValues } from "../types"

export function LoginForm() {
  const t = useTranslations("auth")
  const tc = useTranslations("common")
  const tv = useTranslations("validation")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginSchema(tv)),
    defaultValues: { email: "", password: "" },
  })

  const loginMutation = useLogin()

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("loginSuccess"))
        router.push("/")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("login")}</CardTitle>
        <CardDescription>{t("loginDescription")}</CardDescription>
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("password")}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pe-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-muted-foreground absolute inset-e-3 top-1/2 -translate-y-1/2"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? tc("loading") : t("signIn")}
            </Button>

            {/* Google sign-in — temporarily disabled
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">{t("orContinueWith")}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={googleSignIn.isPending}
              onClick={() =>
                googleSignIn.mutate(locale, {
                  onError: (e) => toast.error(e.message),
                })
              }
            >
              <FcGoogle className="size-4" />
              {t("googleSignIn")}
            </Button>
            */}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
