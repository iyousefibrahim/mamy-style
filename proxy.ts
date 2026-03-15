import createMiddleware from "next-intl/middleware"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"
import { updateSession } from "./lib/supabase/middleware"

const handleI18nRouting = createMiddleware(routing)

// Pages that authenticated users should not be able to visit
const AUTH_ONLY_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"]

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request)
  const sessionResponse = await updateSession(request, response)

  // Check auth status from refreshed JWT (no network call)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // Session already written by updateSession above
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const isAuthenticated = !!data?.claims

  if (isAuthenticated) {
    const pathname = request.nextUrl.pathname
    // Strip the locale prefix (e.g. /en/login → /login)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "") || "/"
    const isAuthPage = AUTH_ONLY_PATHS.some((p) => pathWithoutLocale.startsWith(p))

    if (isAuthPage) {
      const locale = pathname.split("/")[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
  }

  return sessionResponse
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
