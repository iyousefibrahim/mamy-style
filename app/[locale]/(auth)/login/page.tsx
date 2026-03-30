import { setRequestLocale, getTranslations } from "next-intl/server"
import { LoginForm } from "@/features/auth/components/LoginForm"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth" })
  return { title: t("login") }
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <LoginForm />
}
