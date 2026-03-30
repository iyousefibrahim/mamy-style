import { Lock } from "lucide-react"
import { Link } from "@/i18n/navigation"

type Props = {
  title: string
  description?: string
  loginLabel: string
}

export function AuthGate({ title, description, loginLabel }: Props) {
  return (
    <div className="wrapper py-24 flex flex-col items-center gap-4 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center">
        <Lock className="size-7 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-full px-8 h-10 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors mt-2"
      >
        {loginLabel}
      </Link>
    </div>
  )
}
