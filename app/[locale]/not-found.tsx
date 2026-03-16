"use client"

import { useTranslations } from "next-intl"
import { buttonVariants } from "@/components/ui/button-variants"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/navigation"

export default function NotFoundPage() {
  const t = useTranslations("common")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-8xl font-bold text-muted-foreground/30">404</p>
      <h1 className="text-2xl font-bold">{t("notFoundTitle")}</h1>
      <p className="text-muted-foreground max-w-sm">{t("notFoundDesc")}</p>
      <Link href="/" className={buttonVariants()}>
        <ArrowLeft className="size-4" />
        {t("backToHome")}
      </Link>
    </div>
  )
}
