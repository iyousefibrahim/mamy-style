"use client"

import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  Users,
  ShoppingCart,
  Ticket,
  Settings,
  MoreHorizontal,
  LogOut,
  Languages,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useRouter, Link } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import { useCurrentProfile } from "@/features/dashboard/hooks/useProfile"
import { useLogout } from "@/features/auth/hooks/useAuth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const t = useTranslations("dashboard.nav")
  const tc = useTranslations("auth")
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const { data: profile } = useCurrentProfile()
  const logout = useLogout()

  const navItems = [
    { label: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("products"), href: "/dashboard/products", icon: Package },
    { label: t("categories"), href: "/dashboard/categories", icon: LayoutGrid },
    { label: t("users"), href: "/dashboard/users", icon: Users },
    { label: t("orders"), href: "/dashboard/orders", icon: ShoppingCart },
    { label: t("coupons"), href: "/dashboard/coupons", icon: Ticket },
  ]

  const initials = (profile?.full_name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  function switchLocale() {
    const next = locale === "ar" ? "en" : "ar"
    router.replace(pathname.replace(`/${locale}`, ""), { locale: next })
  }

  return (
    <Sidebar collapsible="icon" side={locale === "ar" ? "right" : "left"} dir="ltr" className="border-e-0">
      {/* Logo */}
      <SidebarHeader className="bg-primary text-primary-foreground px-4 py-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <img src="/mamy-style.png" alt="Mamy Style Logo" />
          <span className="font-bold text-lg truncate group-data-[collapsible=icon]:hidden">
            مامي ستايل
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-primary text-primary-foreground">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname.endsWith("/dashboard")
                    : pathname.includes(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href as "/dashboard"} />}
                      isActive={isActive}
                      className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 data-[active=true]:bg-primary-foreground/20 data-[active=true]:text-primary-foreground"
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-primary text-primary-foreground">
        <SidebarSeparator className="bg-primary-foreground/20" />

        {/* Settings */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/dashboard/settings/profile" />}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Settings className="size-4" />
              <span>{t("settings")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Mode + Language toggles */}
        <div className="flex items-center gap-1 px-2 pb-1 group-data-[collapsible=icon]:flex-col">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center"
            onClick={switchLocale}
          >
            <Languages className="size-4" />
            <span className="ms-1 text-xs font-medium group-data-[collapsible=icon]:hidden">
              {locale === "ar" ? "EN" : "AR"}
            </span>
          </Button>
        </div>

        {/* User footer */}
        <SidebarSeparator className="bg-primary-foreground/20" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton className="h-12 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" />}>
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium truncate">
                    {profile?.full_name ?? ""}
                  </span>
                  <span className="text-xs text-primary-foreground/60 truncate">
                    {profile?.email ?? ""}
                  </span>
                </div>
                <MoreHorizontal className="ms-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-48">
                <DropdownMenuItem render={<Link href="/dashboard/settings/profile" />}>
                  <Settings className="size-4" />
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() =>
                    logout.mutate(undefined, {
                      onSuccess: () => router.push(`/home` as "/"),
                    })
                  }
                >
                  <LogOut className="size-4" />
                  {tc("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
