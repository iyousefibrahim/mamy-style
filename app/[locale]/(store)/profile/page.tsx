import { setRequestLocale, getTranslations } from "next-intl/server"
import { ProfilePage } from "@/features/profile/components/ProfilePage"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "profile" })
  return { title: t("title") }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ProfilePage />
}
