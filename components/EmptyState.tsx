import type { LucideIcon } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type Props = {
  icon: LucideIcon
  iconClassName?: string
  iconBgClassName?: string
  badgeIcon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  iconClassName,
  iconBgClassName,
  badgeIcon: BadgeIcon,
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-6 text-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "size-24 rounded-full flex items-center justify-center",
            iconBgClassName ?? "bg-muted"
          )}
        >
          <Icon className={cn("size-10", iconClassName ?? "text-muted-foreground")} />
        </div>
        {BadgeIcon && (
          <div className="absolute -bottom-1 -inset-e-1 size-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
            <BadgeIcon className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">{description}</p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center rounded-full px-8 h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
