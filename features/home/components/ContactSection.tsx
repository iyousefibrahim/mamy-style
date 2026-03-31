"use client"

import { useTranslations } from "next-intl"
import { Phone, ChevronRight } from "lucide-react"
import { FaWhatsapp, FaFacebookF } from "react-icons/fa"
import Link from "next/link"

export function ContactSection() {
  const t = useTranslations("home")

  return (
    <section id="contact" className="py-20">
      <div className="wrapper">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">{t("contact.title")}</h2>
          <p className="text-muted-foreground mt-3">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Contact cards */}
          <div className="flex flex-col gap-4 order-2 md:order-1">
            <Link
              href="https://wa.me/201032229365"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border hover:border-green-300 hover:bg-green-50/50 transition-all group cursor-pointer"
            >
              <div className="size-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-green-200 transition-shadow">
                <FaWhatsapp className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{t("contact.whatsapp")}</p>
                <p className="text-sm text-muted-foreground">01032229365</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground shrink-0" />
            </Link>

            <Link
              href="tel:+201032229365"
              className="flex items-center gap-4 p-5 rounded-2xl border hover:border-blue-300 hover:bg-blue-50/50  transition-all group cursor-pointer"
            >
              <div className="size-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-blue-200 transition-shadow">
                <Phone className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{t("contact.phone")}</p>
                <p className="text-sm text-muted-foreground">01032229365</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground shrink-0" />
            </Link>

            <Link
              href="https://www.facebook.com/mamyystyle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border hover:border-blue-400 hover:bg-blue-50/50  transition-all group cursor-pointer"
            >
              <div className="size-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-blue-200 transition-shadow">
                <FaFacebookF className="size-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{t("contact.facebook")}</p>
                <p className="text-sm text-muted-foreground">Mamy Style</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground shrink-0" />
            </Link>
          </div>

          {/* Map */}
          <div className="order-1 md:order-2">
            <p className="font-semibold text-sm text-muted-foreground mb-3">
              {t("contact.mapTitle")}
            </p>
            <div className="rounded-2xl overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.330441574173!2d31.094285599999996!3d31.5546411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f73de92d23142b%3A0x30e3dd6a6ebc61b5!2sMamy%20Style!5e1!3m2!1sar!2seg!4v1773661099029!5m2!1sar!2seg"
                className="w-full h-48 sm:h-64 md:h-85"
                loading="lazy"
                allowFullScreen
                title="Store location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
