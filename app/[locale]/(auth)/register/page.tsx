import { setRequestLocale, getTranslations } from "next-intl/server"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth" })
  return { title: t("register") }
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <RegisterForm />
}
