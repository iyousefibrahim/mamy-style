import { setRequestLocale, getTranslations } from "next-intl/server"
import { HomePage } from "@/features/home/HomePage"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "common" })
  return {
    title: t("appName"),
    description: t("tagline"),
    openGraph: { title: t("appName"), description: t("tagline") },
  }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomePage />
}
