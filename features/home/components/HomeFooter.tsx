"use client"

import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Phone, Globe } from "lucide-react"
import { FaWhatsapp, FaFacebookF, FaCcVisa, FaCcMastercard } from "react-icons/fa"
import Link from "next/link"

const navLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.products", href: "/products" },
  { labelKey: "nav.categories", href: "/categories" },
  { labelKey: "nav.contact", href: "/home#contact" },
]

export function HomeFooter() {
  const t = useTranslations("home")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () =>
    router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" })

  return (
    <footer className="border-t bg-muted/30">
      <div className="wrapper py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div className="space-y-4">
            <Image
              src="/mamy-style.png"
              alt="Mamy Style"
              width={100}
              height={34}
              className="h-9 w-auto"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.facebook.com/mamyystyle/"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-muted flex items-center justify-center hover:bg-blue-500 hover:text-primary-foreground transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <FaFacebookF className="size-4" />
              </Link>
              <Link
                href="https://wa.me/201032229365"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-muted flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="size-4" />
              </Link>
            </div>
            <a
              href="tel:+201032229365"
              className="text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
            >
              <Phone className="size-3.5" />
              01032229365
            </a>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-4">{t("footer.quickLinks")}</h3>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Customer Service */}
          <div>
            <h3 className="font-bold text-sm mb-4">{t("footer.customerService")}</h3>
            <div className="flex flex-col gap-2.5">
              <Link href={`/${locale}/shipping`} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {t("footer.shipping")}
              </Link>
              <Link href={`/${locale}/returns`} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {t("footer.returns")}
              </Link>
              <Link href={`/${locale}/faq`} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {t("footer.faq")}
              </Link>
            </div>
          </div>

          {/* Col 4 — Payment Methods */}
          <div>
            <h3 className="font-bold text-sm mb-4">{t("footer.paymentMethods")}</h3>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-lg border bg-background px-3 py-2">
                <FaCcVisa className="size-7 text-blue-700" />
              </div>
              <div className="rounded-lg border bg-background px-3 py-2">
                <FaCcMastercard className="size-7 text-red-500" />
              </div>
              <div className="rounded-lg border bg-background px-3 py-2">
                <Image src="/brands/meeza.svg" alt="Meeza" width={48} height={20} className="h-5" style={{ width: "auto" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="wrapper py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            © {new Date().getFullYear()} Mamy Style. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs cursor-pointer"
              onClick={toggleLocale}
            >
              <Globe className="size-3.5" />
              {locale === "ar" ? "English" : "عربي"}
            </Button>
          </div>
        </div>
      </div>

      {/* Developer credit */}
      <div className="border-t bg-muted/20">
        <div className="wrapper py-4 flex items-center justify-center gap-3">
          <span className="text-xs text-muted-foreground">{t("footer.builtBy")}</span>
          <Link
            href="https://iyousefibrahim.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="size-7 overflow-hidden bg-background flex items-center justify-center shrink-0">
              <Image
                src="/yousef-logo.png"
                alt="Yousef Ibrahim"
                width={28}
                height={28}
                className="size-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Yousef Ibrahim
            </span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
