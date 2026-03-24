"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Link, useRouter, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Globe, Menu, X, Heart } from "lucide-react"
import { useCurrentUser, useLogout } from "@/features/auth/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import { useFavorites } from "@/hooks/useFavorites"
import { SearchBar } from "./SearchBar"

const navLinks = [
  { labelKey: "nav.home", href: "/home" },
  { labelKey: "nav.products", href: "/products" },
  { labelKey: "nav.categories", href: "/categories" },
  { labelKey: "nav.contact", href: "/home#contact" },
]

export function HomeNavbar() {
  const t = useTranslations("home")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const { totalCount: cartCount } = useCart()
  const { count: favCount } = useFavorites()

  const toggleLocale = () =>
    router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" })

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="wrapper flex items-center justify-between h-16 gap-4">

        {/* Logo */}
        <Link href="/home" className="shrink-0">
          <Image
            src="/mamy-style.png"
            alt="Mamy Style"
            width={110}
            height={38}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Search bar — desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" className="gap-1.5 text-sm cursor-pointer" onClick={toggleLocale}>
            <Globe className="size-4" />
            {locale === "ar" ? "EN" : "عربي"}
          </Button>

          {/* Auth buttons or user name — desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {user ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium px-2 py-1.5 truncate max-w-30">
                  {user.user_metadata?.full_name?.split(" ")[0] ?? user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground cursor-pointer"
                  onClick={() => logout.mutate()}
                >
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>

          {/* Favorites */}
          <Link href="/favorites" className="relative inline-flex items-center justify-center size-10 rounded-md hover:bg-accent transition-colors" aria-label="Favorites">
            <Heart className="size-5" />
            {favCount > 0 && (
              <span className="absolute -top-1 -inset-e-1 bg-rose-500 text-white text-[10px] font-bold rounded-full size-5 flex items-center justify-center leading-none ring-2 ring-background">
                {favCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative inline-flex items-center justify-center size-10 rounded-md hover:bg-accent transition-colors" aria-label="Cart">
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -inset-e-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full size-5 flex items-center justify-center leading-none ring-2 ring-background">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden cursor-pointer"
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
            <div className="mb-3">
              <SearchBar
                onNavigate={() => setMenuOpen(false)}
                inputClassName="py-2.5"
              />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-muted transition-colors block cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Mobile auth */}
            {!user && (
              <div className="flex gap-2 mt-2 pt-2 border-t">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2.5 text-sm font-medium rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
