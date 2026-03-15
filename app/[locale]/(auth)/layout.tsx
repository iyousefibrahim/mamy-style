import { getTranslations } from "next-intl/server"
import Image from "next/image"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations("common")

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 text-primary-foreground">
        <img src={'/mamy-style.png'} alt="Mamy Style Logo" width={500} height={100}/>
        <h1 className="text-4xl font-bold tracking-tight">{t("appName")}</h1>
        <p className="mt-3 text-lg text-primary-foreground/70 text-center max-w-xs">
          {t("tagline")}
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6">
        {/* Logo shown on mobile only */}
        <div className="mb-8 text-center lg:hidden">
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            {t("appName")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
