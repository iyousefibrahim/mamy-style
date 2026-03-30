"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ChevronRight } from "lucide-react"

const heroSlides = [
  {
    titleKey: "hero.slide1Title",
    subtitleKey: "hero.slide1Subtitle",
    image: "/hero/slide-1.webp",
    imageMobile: "/hero/slide-1-mobile.webp",
  },
  {
    titleKey: "hero.slide2Title",
    subtitleKey: "hero.slide2Subtitle",
    image: "/hero/slide-2.webp",
    imageMobile: "/hero/slide-2-mobile.webp",
  },
  {
    titleKey: "hero.slide3Title",
    subtitleKey: "hero.slide3Subtitle",
    image: "/hero/slide-3.webp",
    imageMobile: "/hero/slide-3-mobile.webp",
  },
]

export function HeroCarousel() {
  const t = useTranslations("home")
  const locale = useLocale()
  const router = useRouter()
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrentSlide(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    onSelect()
    api.on("select", onSelect)
    return () => { api.off("select", onSelect) }
  }, [api, onSelect])

  return (
    <section className="relative">
      <Carousel
        opts={{ loop: true, direction: locale === "ar" ? "rtl" : "ltr" }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {heroSlides.map((slide, i) => (
            <CarouselItem key={i} className="pl-0 relative">
              <div className="relative h-125 md:h-150 w-full">
                {/* Desktop image */}
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 1px, 100vw"
                  className="object-cover hidden md:block"
                  priority={i === 0}
                />
                {/* Mobile image */}
                <Image
                  src={slide.imageMobile}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 1px"
                  className="object-cover md:hidden"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="wrapper text-center">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight max-w-3xl mx-auto drop-shadow-lg">
                      {t(slide.titleKey)}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-8 drop-shadow">
                      {t(slide.subtitleKey)}
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <Button size="lg" className="gap-2 rounded-full px-8 h-14 text-base shadow-lg cursor-pointer" onClick={() => router.push("/products")}>
                        {t("hero.cta1")}
                        <ChevronRight className="size-5" />
                      </Button>
                      <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm cursor-pointer" onClick={() => router.push("/categories")}>
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
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
