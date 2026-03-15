import { type ReactNode } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

type BreadcrumbSegment = {
  label: string
  href?: string
}

type Props = {
  segments: BreadcrumbSegment[]
  title: string
  subtitle?: string
  action?: ReactNode
}

export async function DashboardHeader({ segments, title, subtitle, action }: Props) {
  const t = await getTranslations("dashboard.nav")

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Top bar: trigger + breadcrumb */}
      <div className="flex items-center gap-2 pt-4 px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard" />}>
                {t("dashboard")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.map((seg, i) => (
              <span key={i} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {seg.href ? (
                    <BreadcrumbLink render={<Link href={seg.href as "/dashboard"} />}>
                      {seg.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page title row */}
      <div className="flex items-start justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
