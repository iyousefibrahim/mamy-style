import { getTranslations } from "next-intl/server"
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader"
import { UsersTable } from "@/features/dashboard/components/users/UsersTable"

export default async function UsersPage() {
  const t = await getTranslations("dashboard.users")

  return (
    <div>
      <DashboardHeader
        segments={[{ label: t("title") }]}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="px-6 pb-8">
        <UsersTable />
      </div>
    </div>
  )
}
