"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { LogOut } from "lucide-react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityForm } from "@/features/dashboard/components/settings/SecurityForm"
import { useCurrentProfile } from "@/features/dashboard/hooks/useProfile"
import { useLogout } from "@/features/auth/hooks/useAuth"
import { ProfileInfoForm } from "./ProfileInfoForm"

export function ProfilePage() {
  const t = useTranslations("profile")
  const router = useRouter()
  const { data: profile, isLoading } = useCurrentProfile()
  const logout = useLogout()

  useEffect(() => {
    if (!isLoading && profile === null) {
      router.replace("/login")
    }
  }, [isLoading, profile, router])

  if (isLoading || !profile) {
    return (
      <div className="wrapper py-8 max-w-2xl">
        <Skeleton className="h-8 w-40 mb-8" />
        <Skeleton className="h-10 w-64 mb-6 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="wrapper py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{profile.email}</p>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">{t("tabInfo")}</TabsTrigger>
          <TabsTrigger value="security">{t("tabSecurity")}</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <ProfileInfoForm />
        </TabsContent>

        <TabsContent value="security">
          <SecurityForm />
        </TabsContent>
      </Tabs>

      <div className="mt-10 pt-6 border-t">
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer gap-2"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="size-4" />
          {t("logout")}
        </Button>
      </div>
    </div>
  )
}
