"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Link, useRouter, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import {
  ShoppingCart,
  Globe,
  Phone,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronUp,
  Truck,
  Award,
  Heart,
} from "lucide-react"
import { FaWhatsapp, FaFacebookF, FaCcVisa, FaCcMastercard } from "react-icons/fa"

type Category = { id: number; nameKey: string; image: string }
type Product = {
  id: number
  nameKey: string
  price: number
  originalPrice: number | null
  image: string
}
type HeroSlide = {
  titleKey: string
  subtitleKey: string
  image: string
}

export function HomePage() {
  const t = useTranslations("home")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  const toggleLocale = () =>
    router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" })

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const onSelect = useCallback(() => {
    if (!carouselApi) return
    setCurrentSlide(carouselApi.selectedScrollSnap())
  }, [carouselApi])

  useEffect(() => {
    if (!carouselApi) return
    onSelect()
    carouselApi.on("select", onSelect)
    return () => { carouselApi.off("select", onSelect) }
  }, [carouselApi, onSelect])

  const navLinks = [
    { labelKey: "nav.home", href: "/" },
    { labelKey: "nav.products", href: "/products" },
    { labelKey: "nav.categories", href: "/categories" },
    { labelKey: "nav.contact", href: "#contact" },
  ]

  const heroSlides: HeroSlide[] = [
    { titleKey: "hero.slide1Title", subtitleKey: "hero.slide1Subtitle", image: "https://picsum.photos/seed/hero-fashion1/1920/800" },
    { titleKey: "hero.slide2Title", subtitleKey: "hero.slide2Subtitle", image: "https://picsum.photos/seed/hero-fashion2/1920/800" },
    { titleKey: "hero.slide3Title", subtitleKey: "hero.slide3Subtitle", image: "https://picsum.photos/seed/hero-fashion3/1920/800" },
  ]

  const categories: Category[] = [
    { id: 1, nameKey: "cat1", image: "https://picsum.photos/seed/evening-wear/400/500" },
    { id: 2, nameKey: "cat2", image: "https://picsum.photos/seed/casual-wear/400/500" },
    { id: 3, nameKey: "cat3", image: "https://picsum.photos/seed/abaya-dress/400/500" },
    { id: 4, nameKey: "cat4", image: "https://picsum.photos/seed/accessories-gold/400/500" },
  ]

  const products: Product[] = [
    { id: 1, nameKey: "prod1", price: 349, originalPrice: 450, image: "https://picsum.photos/seed/dress-elegant/400/500" },
    { id: 2, nameKey: "prod2", price: 529, originalPrice: null, image: "https://picsum.photos/seed/summer-set/400/500" },
    { id: 3, nameKey: "prod3", price: 289, originalPrice: 380, image: "https://picsum.photos/seed/classic-abaya/400/500" },
    { id: 4, nameKey: "prod4", price: 699, originalPrice: null, image: "https://picsum.photos/seed/gold-set/400/500" },
    { id: 5, nameKey: "prod5", price: 399, originalPrice: 520, image: "https://picsum.photos/seed/floral-maxi/400/500" },
    { id: 6, nameKey: "prod6", price: 459, originalPrice: null, image: "https://picsum.photos/seed/linen-blazer/400/500" },
    { id: 7, nameKey: "prod7", price: 329, originalPrice: 420, image: "https://picsum.photos/seed/kaftan-emb/400/500" },
    { id: 8, nameKey: "prod8", price: 489, originalPrice: null, image: "https://picsum.photos/seed/jumpsuit-mod/400/500" },
  ]

  return (
    <div className="min-h-screen">

      {/* ── Announcement Bar ── */}
      <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
        {t("announcementBar")}
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="wrapper flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/mamy-style.png"
              alt="Mamy Style"
              width={110}
              height={38}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Search bar — desktop only */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                className="w-full rounded-full border bg-muted/50 ps-10 pe-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-sm"
              onClick={toggleLocale}
            >
              <Globe className="size-4" />
              {locale === "ar" ? "EN" : "عربي"}
            </Button>

            {/* Auth buttons — desktop */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("nav.register")}
              </Link>
            </div>

            <Button variant="ghost" size="icon" className="relative size-10" aria-label="Cart">
              <ShoppingCart className="size-5" />
              <span className="absolute -top-1 -end-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full size-5 flex items-center justify-center leading-none ring-2 ring-background">
                0
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t bg-background">
            <div className="wrapper py-4 flex flex-col gap-1">
              {/* Mobile search */}
              <div className="relative mb-3">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full rounded-full border bg-muted/50 ps-10 pe-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-muted transition-colors block"
                  onClick={() => setMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </a>
              ))}
              {/* Mobile auth buttons */}
              <div className="flex gap-2 mt-2 pt-2 border-t">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2.5 text-sm font-medium rounded-lg border hover:bg-muted transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.register")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Carousel ── */}
      <section className="relative">
        <Carousel
          opts={{ loop: true, direction: locale === "ar" ? "rtl" : "ltr" }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          setApi={setCarouselApi}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {heroSlides.map((slide, i) => (
              <CarouselItem key={i} className="pl-0 relative">
                <div className="relative h-[500px] md:h-[600px] w-full">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="wrapper text-center">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight max-w-3xl mx-auto drop-shadow-lg">
                        {t(slide.titleKey)}
                      </h1>
                      <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-8 drop-shadow">
                        {t(slide.subtitleKey)}
                      </p>
                      <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Button size="lg" className="gap-2 rounded-full px-8 h-14 text-base shadow-lg">
                          {t("hero.cta1")}
                          <ChevronRight className="size-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                          {t("hero.cta2")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => carouselApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </section>

      {/* ── Featured Categories ── */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="wrapper">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="text-start">
              <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">
                {t("categories.subtitle")}
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight">{t("categories.title")}</h2>
            </div>
            <Button variant="link" className="hidden md:flex gap-1 text-primary hover:text-primary/80 group p-0 h-auto font-semibold">
              {t("categories.viewAll")}
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href="#"
                className="group relative block rounded-3xl overflow-hidden border border-border/50 bg-background shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-56">
                  <Image
                    src={cat.image}
                    alt={t(cat.nameKey)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 start-0 p-6">
                  <span className="font-bold text-white text-xl drop-shadow-lg">
                    {t(cat.nameKey)}
                  </span>
                  <div className="h-1 w-8 bg-white/80 rounded-full mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Button variant="outline" className="rounded-full gap-2 w-full border-2 h-12">
              {t("categories.viewAll")}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="wrapper">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">
              {t("products.subtitle")}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">{t("products.title")}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="group bg-card rounded-3xl border border-border/40 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={prod.image}
                    alt={t(prod.nameKey)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

                  {prod.originalPrice !== null && (
                    <span className="absolute top-4 start-4 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      -{Math.round((1 - prod.price / prod.originalPrice) * 100)}%{" "}
                      {t("products.off")}
                    </span>
                  )}

                  <div className="absolute bottom-4 end-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button size="icon" className="rounded-full shadow-lg bg-white/90 text-primary hover:bg-primary hover:text-white backdrop-blur-sm border-0 size-10">
                      <Heart className="size-5" />
                    </Button>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="font-semibold text-base mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {t(prod.nameKey)}
                  </p>
                  <div className="mt-auto pt-2 flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-foreground text-xl">
                        {prod.price.toLocaleString("en-US")} EGP
                      </span>
                      {prod.originalPrice !== null && (
                        <span className="text-xs text-muted-foreground line-through font-medium mt-0.5">
                          {prod.originalPrice.toLocaleString("en-US")}
                        </span>
                      )}
                    </div>
                    <Button size="sm" className="rounded-xl px-4 h-10 gap-2 shrink-0">
                      <ShoppingCart className="size-4" />
                      <span className="hidden sm:inline-block">{t("products.addToCart")}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="rounded-full gap-2 px-8 h-12 hover:bg-primary hover:text-white transition-all duration-300 border-2 font-medium">
              {t("products.viewAll")}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-20 bg-muted/20">
        <div className="wrapper">
          <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tight">{t("whyUs.title")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Award className="size-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("whyUs.q1Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{t("whyUs.q1Desc")}</p>
            </div>

            <div className="text-center">
              <div className="size-16 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Truck className="size-8 text-foreground/70" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("whyUs.q2Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{t("whyUs.q2Desc")}</p>
            </div>

            <div className="text-center">
              <div className="size-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Heart className="size-8 text-rose-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("whyUs.q3Title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{t("whyUs.q3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-20">
        <div className="wrapper">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight">{t("contact.title")}</h2>
            <p className="text-muted-foreground mt-3">{t("contact.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Contact cards */}
            <div className="flex flex-col gap-4 order-2 md:order-1">
              {/* WhatsApp */}
              <a
                href="https://wa.me/201032229365"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all group"
              >
                <div className="size-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-green-200 transition-shadow">
                  <FaWhatsapp className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{t("contact.whatsapp")}</p>
                  <p className="text-sm text-muted-foreground">01032229365</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground shrink-0" />
              </a>

              {/* Phone */}
              <a
                href="tel:+201032229365"
                className="flex items-center gap-4 p-5 rounded-2xl border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
              >
                <div className="size-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-blue-200 transition-shadow">
                  <Phone className="size-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{t("contact.phone")}</p>
                  <p className="text-sm text-muted-foreground">01032229365</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground shrink-0" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/mamyystyle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl border hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
              >
                <div className="size-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:shadow-blue-200 transition-shadow">
                  <FaFacebookF className="size-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{t("contact.facebook")}</p>
                  <p className="text-sm text-muted-foreground">Mamy Style</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground shrink-0" />
              </a>
            </div>

            {/* Map */}
            <div className="order-1 md:order-2">
              <p className="font-semibold text-sm text-muted-foreground mb-3">
                {t("contact.mapTitle")}
              </p>
              {/* Replace src with your real Google Maps embed URL */}
              <div className="rounded-2xl overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.330441574173!2d31.094285599999996!3d31.5546411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f73de92d23142b%3A0x30e3dd6a6ebc61b5!2sMamy%20Style!5e1!3m2!1sar!2seg!4v1773661099029!5m2!1sar!2seg"
                  className="w-full h-[340px]"
                  loading="lazy"
                  allowFullScreen
                  title="Store location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
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
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/mamyystyle/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-lg bg-muted flex items-center justify-center hover:bg-blue-500 hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="size-4" />
                </a>
                <a
                  href="https://wa.me/201032229365"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-lg bg-muted flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="size-4" />
                </a>
              </div>
              {/* Phone */}
              <a href="tel:+201032229365" className="text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="size-3.5" />
                01032229365
              </a>
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <h3 className="font-bold text-sm mb-4">{t("footer.quickLinks")}</h3>
              <div className="flex flex-col gap-2.5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.labelKey)}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 3 — Customer Service */}
            <div>
              <h3 className="font-bold text-sm mb-4">{t("footer.customerService")}</h3>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.shipping")}
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.returns")}
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.faq")}
                </a>
              </div>
            </div>

            {/* Col 4 — Payment Methods */}
            <div>
              <h3 className="font-bold text-sm mb-4">{t("footer.paymentMethods")}</h3>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2">
                  <FaCcVisa className="size-7 text-blue-700" />
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2">
                  <FaCcMastercard className="size-7 text-red-500" />
                </div>
                <div className="rounded-lg border bg-background px-3 py-2 text-xs font-bold text-foreground">
                  Meeza
                </div>
                <div className="rounded-lg border bg-background px-3 py-2 text-xs font-bold text-green-600">
                  Fawry
                </div>
                <div className="rounded-lg border bg-background px-3 py-2 text-xs font-bold text-red-600">
                  Vodafone Cash
                </div>
                <div className="rounded-lg border bg-background px-3 py-2 text-xs font-bold text-purple-600">
                  ValU
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t">
          <div className="wrapper py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Mamy Style. {t("footer.rights")}
            </p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
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
            <a
              href="https://iyousefibrahim.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <div className="size-10rounded-md overflow-hidden bg-background flex items-center justify-center shrink-0">
                <Image src="/yousef-logo.png" alt="Yousef Ibrahim" width={28} height={28} className="size-full object-cover" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                Yousef Ibrahim
              </span>
            </a>
          </div>
        </div>
      </footer>

      {/* ── Go to top ── */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 end-6 z-40 size-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-xl"
          aria-label="Back to top"
        >
          <ChevronUp className="size-5" />
        </button>
      )}

    </div>
  )
}
