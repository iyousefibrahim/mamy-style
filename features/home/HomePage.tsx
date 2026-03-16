"use client"

import { useTranslations } from "next-intl"
import { useFeaturedProducts } from "./hooks/useFeaturedProducts"
import { useFeaturedCategories } from "./hooks/useFeaturedCategories"
import { useCart } from "./hooks/useCart"
import { useFavorites } from "./hooks/useFavorites"
import { HomeNavbar } from "./components/HomeNavbar"
import { HeroCarousel } from "./components/HeroCarousel"
import { FeaturedProducts } from "./components/FeaturedProducts"
import { FeaturedCategories } from "./components/FeaturedCategories"
import { WhyUs } from "./components/WhyUs"
import { ContactSection } from "./components/ContactSection"
import { HomeFooter } from "./components/HomeFooter"
import { GoToTop } from "./components/GoToTop"

export function HomePage() {
  const t = useTranslations("home")

  const { data: products = [], isLoading: productsLoading } = useFeaturedProducts()
  const { data: categories = [], isLoading: categoriesLoading } = useFeaturedCategories()
  const { addItem } = useCart()
  const { isFavorited, toggleFavorite } = useFavorites()

  return (
    <div className="min-h-screen">
      <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
        {t("announcementBar")}
      </div>

      <HomeNavbar />
      <HeroCarousel />

      <FeaturedProducts
        products={products}
        isLoading={productsLoading}
        onAddToCart={addItem}
        onToggleFavorite={toggleFavorite}
        isFavorited={isFavorited}
      />

      <FeaturedCategories
        categories={categories}
        isLoading={categoriesLoading}
      />

      <WhyUs />
      <ContactSection />
      <HomeFooter />
      <GoToTop />
    </div>
  )
}
