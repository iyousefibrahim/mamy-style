"use client"

import { useFeaturedProducts } from "./hooks/useFeaturedProducts"
import { useFeaturedCategories } from "./hooks/useFeaturedCategories"
import { useFavorites } from "@/hooks/useFavorites"
import { HeroCarousel } from "./components/HeroCarousel"
import { FeaturedProducts } from "./components/FeaturedProducts"
import { FeaturedCategories } from "./components/FeaturedCategories"
import { WhyUs } from "./components/WhyUs"
import { ContactSection } from "./components/ContactSection"
import { GoToTop } from "./components/GoToTop"

export function HomePage() {
  const { data: products = [], isLoading: productsLoading } = useFeaturedProducts()
  const { data: categories = [], isLoading: categoriesLoading } = useFeaturedCategories()
  const { isFavorited, toggleFavorite } = useFavorites()

  return (
    <div>
      <HeroCarousel />

      <FeaturedProducts
        products={products}
        isLoading={productsLoading}
        onToggleFavorite={toggleFavorite}
        isFavorited={isFavorited}
      />

      <FeaturedCategories
        categories={categories}
        isLoading={categoriesLoading}
      />

      <WhyUs />
      <ContactSection />
      <GoToTop />
    </div>
  )
}
