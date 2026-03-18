"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
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
import { Link } from "@/i18n/navigation"
import { useRegister } from "../hooks/useAuth"
import { registerSchema, type RegisterFormValues } from "../types"

// const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2MB

// function InitialsAvatar({
//   firstName,
//   lastName,
// }: {
//   firstName: string
//   lastName: string
// }) {
//   const initials =
//     `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?"
//
//   return (
//     <div className="flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
//       {initials}
//     </div>
//   )
// }

export function RegisterForm() {
  const t = useTranslations("auth")
  const tc = useTranslations("common")
  const router = useRouter()
  // const fileInputRef = useRef<HTMLInputElement>(null)
  // const [avatarFile, setAvatarFile] = useState<File | null>(null)
  // const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phone: "",
    },
  })

  const registerMutation = useRegister()
  // const firstName = form.watch("firstName")
  // const lastName = form.watch("lastName")

  // function handleAvatarClick() {
  //   fileInputRef.current?.click()
  // }

  // function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0]
  //   if (!file) return
  //   if (file.size > MAX_AVATAR_SIZE) {
  //     toast.error(t("avatarSizeError"))
  //     return
  //   }
  //   setAvatarFile(file)
  //   setAvatarPreview(URL.createObjectURL(file))
  // }

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(
      { values, avatarFile: null },
      {
        onSuccess: () => {
          toast.success(t("registerSuccess"))
          router.push("/")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("register")}</CardTitle>
        <CardDescription>{t("registerDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar upload — commented out until ready
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="group relative cursor-pointer"
                aria-label={t("uploadAvatar")}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="size-20 rounded-full object-cover"
                  />
                ) : (
                  <InitialsAvatar firstName={firstName} lastName={lastName} />
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="size-6 text-white" />
                </div>
              </button>
              <span className="text-muted-foreground text-xs">
                {avatarFile ? t("changeAvatar") : t("uploadAvatar")}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            */}

            {/* First Name + Last Name side by side */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                  <FormControl>
                    <Input placeholder="e.g. nour_ahmed" {...field} />
                  </FormControl>
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
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
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

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneOptional")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={t("phonePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? tc("loading") : t("signUp")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
