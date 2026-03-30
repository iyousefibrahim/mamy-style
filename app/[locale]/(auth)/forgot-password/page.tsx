import { setRequestLocale, getTranslations } from "next-intl/server"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth" })
  return { title: t("forgotPassword") }
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ForgotPasswordForm />
}
