"use client"

import { useTranslations } from "next-intl"
import { Award, Truck, Heart } from "lucide-react"

export function WhyUs() {
  const t = useTranslations("home")

  return (
    <section className="py-20 bg-muted/20">
      <div className="wrapper">
        <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tight">
          {t("whyUs.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Award className="size-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{t("whyUs.q1Title")}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {t("whyUs.q1Desc")}
            </p>
          </div>

          <div className="text-center">
            <div className="size-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Truck className="size-8 text-foreground/70" />
            </div>
            <h3 className="font-bold text-lg mb-2">{t("whyUs.q2Title")}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {t("whyUs.q2Desc")}
            </p>
          </div>

          <div className="text-center">
            <div className="size-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Heart className="size-8 text-rose-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">{t("whyUs.q3Title")}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              {t("whyUs.q3Desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
