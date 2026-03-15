import { getTranslations } from "next-intl/server"
import { ShieldCheck } from "lucide-react"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileForm } from "@/features/dashboard/components/settings/ProfileForm"
import { SecurityForm } from "@/features/dashboard/components/settings/SecurityForm"
import { mockCurrentUser } from "@/lib/mock/users"

export default async function ProfileSettingsPage() {
  const t = await getTranslations("dashboard.settings")
  const tc = await getTranslations("dashboard.nav")

  const isAdmin =
    mockCurrentUser.role === "admin" || mockCurrentUser.role === "super-admin"

  return (
    <div>
      <DashboardHeader
        segments={[{ label: tc("settings") }]}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="px-6 pb-8 max-w-2xl mx-auto space-y-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">{t("tabGeneral")}</TabsTrigger>
            <TabsTrigger value="security">{t("tabSecurity")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            {/* Admin banner */}
            {isAdmin && (
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-4 dark:bg-amber-950/30 dark:border-amber-800">
                <ShieldCheck className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-amber-800 dark:text-amber-400">
                    {t("adminBannerTitle")}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-500">
                    {t("adminBannerDesc")}
                  </p>
                </div>
              </div>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h2 className="font-semibold">{t("generalTitle")}</h2>
                  <p className="text-sm text-muted-foreground">{t("generalSubtitle")}</p>
                </div>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <SecurityForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
