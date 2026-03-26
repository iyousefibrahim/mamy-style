import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyPaymobHmac } from "@/lib/paymob/hmac"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { obj, type } = body

    // Only handle transaction processed events
    if (type !== "TRANSACTION") return NextResponse.json({ ok: true })

    const secret = process.env.PAYMOB_HMAC_SECRET
    if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 500 })

    // Flatten object for HMAC verification
    const flat: Record<string, string> = {
      ...Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, String(v)])
      ),
      "source_data.pan": String(obj.source_data?.pan ?? ""),
      "source_data.sub_type": String(obj.source_data?.sub_type ?? ""),
      "source_data.type": String(obj.source_data?.type ?? ""),
      "order": String(obj.order?.id ?? ""),
      hmac: body.hmac ?? obj.hmac,
    }

    if (!verifyPaymobHmac((k) => flat[k] ?? "", secret)) {
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 401 })
    }

    const merchantOrderId: string = obj.order?.merchant_order_id
    const success: boolean = obj.success === true || obj.success === "true"

    if (!merchantOrderId) return NextResponse.json({ ok: true })

    const supabase = await createClient()

    if (success) {
      // Update order status to confirmed and store Paymob order ID
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          paymob_order_id: String(obj.order?.id ?? ""),
        })
        .eq("id", merchantOrderId)

    } else {
      // Payment failed — cancel order (stock trigger already ran; admin restores manually)
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", merchantOrderId)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
