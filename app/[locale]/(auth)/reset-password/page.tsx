import { setRequestLocale, getTranslations } from "next-intl/server"
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth" })
  return { title: t("resetPassword") }
}

export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ResetPasswordForm />
}
