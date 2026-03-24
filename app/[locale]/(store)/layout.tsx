import { useTranslations } from "next-intl"
import { HomeNavbar } from "@/features/home/components/HomeNavbar"
import { HomeFooter } from "@/features/home/components/HomeFooter"

function AnnouncementBar() {
  const t = useTranslations("home")
  return (
    <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
      {t("announcementBar")}
    </div>
  )
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <HomeNavbar />
      <main>{children}</main>
      <HomeFooter />
    </div>
  )
}
