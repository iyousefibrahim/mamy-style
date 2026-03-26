import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyPaymobHmac } from "@/lib/paymob/hmac"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const locale = searchParams.get("locale") ?? "en"
  const ordersUrl = `/${locale}/orders`

  try {
    const success = searchParams.get("success") === "true"
    const merchantOrderId = searchParams.get("merchant_order_id") || searchParams.get("oid")

    // Failures don't need HMAC — redirect immediately
    if (!success) {
      return NextResponse.redirect(new URL(`${ordersUrl}?payment=failed`, req.url))
    }

    // Only verify HMAC for successful payments (guards against faked successes)
    const secret = process.env.PAYMOB_HMAC_SECRET
    if (secret && !verifyPaymobHmac((k) => searchParams.get(k) ?? "", secret)) {
      console.error("[callback] HMAC verification failed")
      return NextResponse.redirect(new URL(`${ordersUrl}?payment=failed`, req.url))
    }

    if (merchantOrderId) {
      const supabase = await createClient()
      const { error } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          paymob_order_id: searchParams.get("order") ?? null,
        })
        .eq("id", merchantOrderId)

      if (error) console.error("[callback] Supabase update error:", error)
    }
  } catch (err) {
    console.error("[callback] Unexpected error:", err)
  }

  return NextResponse.redirect(new URL(ordersUrl, req.url))
}
