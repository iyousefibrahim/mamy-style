"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Camera, AtSign, Phone, Mail, User } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updateProfileSchema, type UpdateProfileFormValues } from "../../types"
import { mockCurrentUser } from "@/lib/mock/users"

export function ProfileForm() {
  const t = useTranslations("dashboard.settings")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    mockCurrentUser.avatar_url
  )

  const [firstName, lastName] = mockCurrentUser.full_name.split(" ")

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      email: mockCurrentUser.email,
      username: mockCurrentUser.username,
      phone: "",
    },
  })

  const initials = `${(firstName?.[0] ?? "")}${(lastName?.[0] ?? "")}`.toUpperCase()

  function onSubmit(_values: UpdateProfileFormValues) {
    toast.success(t("profileUpdated"))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="size-20">
              {avatarPreview && <AvatarImage src={avatarPreview} />}
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 end-0 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Camera className="size-3" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setAvatarPreview(URL.createObjectURL(file))
              }}
            />
          </div>
          <div>
            <p className="font-medium text-sm">{t("profilePicture")}</p>
            <p className="text-xs text-muted-foreground">{t("profilePictureDesc")}</p>
          </div>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input className="ps-9" {...field} />
                  </div>
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
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input className="ps-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("username")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <AtSign className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input className="ps-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>{t("email")}</FormLabel>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="ps-9"
                value={mockCurrentUser.email}
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t("emailNote")}</p>
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="max-w">
              <FormLabel>{t("phone")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input className="ps-9" type="tel" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="outline">
            {t("updateProfile")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
