"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { ArrowLeft, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  title?: string
  description?: string
}

export function NotFoundCard({ title, description }: Props) {
  const t = useTranslations("common")
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <SearchX className="size-12 text-muted-foreground/50" />
      <div>
        <h2 className="text-lg font-semibold">{title ?? t("notFoundItemTitle")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description ?? t("notFoundItemDesc")}</p>
      </div>
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="size-4" />
        {t("goBack")}
      </Button>
    </div>
  )
}
