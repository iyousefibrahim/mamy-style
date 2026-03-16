import { getTranslations } from "next-intl/server";
import { DashboardHeader } from "@/features/dashboard/components/layout/DashboardHeader";
import { UsersTable } from "@/features/dashboard/components/users/UsersTable";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("dashboard.users");
  return { title: t("title") };
}

export default async function UsersPage() {
  const t = await getTranslations("dashboard.users");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata?.role ?? "") as string;
  const isSuperAdmin = role === "super-admin";

  return (
    isSuperAdmin && (
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
  );
}
