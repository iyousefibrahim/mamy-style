import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PAYMOB_BASE = "https://accept.paymob.com/api"

export async function POST(req: NextRequest) {
  try {
    const { orderId, amountPiasters, billing, items, locale } = await req.json()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`

    const apiKey = process.env.PAYMOB_API_KEY
    const integrationId = process.env.PAYMOB_CARD_INTEGRATION_ID
    const iframeId = process.env.PAYMOB_IFRAME_ID

    if (!apiKey || !integrationId || !iframeId) {
      return NextResponse.json({ error: "Paymob not configured" }, { status: 500 })
    }

    // Validate: authenticated user, order belongs to them, status is pending, amount matches
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const { data: order } = await supabase
      .from("orders")
      .select("total, status, payment_method")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    if (order.status !== "pending_payment" || order.payment_method !== "online") {
      return NextResponse.json({ error: "Order is not payable" }, { status: 400 })
    }
    if (order.total * 100 !== amountPiasters) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 })
    }

    // Step 1 — Authentication token
    const authRes = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    })
    const authJson = await authRes.json()
    const authToken = authJson.token
    if (!authToken) {
      console.error("[initiate] step1 failed:", authJson)
      throw new Error("Failed to get Paymob auth token")
    }

    // Step 2 — Register order
    // First attempt: use merchant_order_id to link Paymob order to ours
    let paymobOrderId: number | null = null
    const orderRes = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountPiasters,
        currency: "EGP",
        merchant_order_id: orderId,
        items,
      }),
    })
    const paymobOrder = await orderRes.json()

    if (paymobOrder.id) {
      paymobOrderId = paymobOrder.id
    } else if (paymobOrder.message === "duplicate") {
      // Order already registered with Paymob (retry case) — create a fresh Paymob order
      // without merchant_order_id. Our orderId travels via the redirection_url instead.
      const retryRes = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: amountPiasters,
          currency: "EGP",
          items,
        }),
      })
      const retryOrder = await retryRes.json()
      if (!retryOrder.id) {
        console.error("[initiate] step2 retry failed:", retryOrder)
        throw new Error("Failed to register Paymob order")
      }
      paymobOrderId = retryOrder.id
    } else {
      console.error("[initiate] step2 failed:", paymobOrder)
      throw new Error("Failed to register Paymob order")
    }

    // Step 3 — Payment key
    const keyRes = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountPiasters,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: billing,
        currency: "EGP",
        integration_id: Number(integrationId),
        lock_order_when_paid: false,
        redirection_url: `${baseUrl}/api/checkout/callback?locale=${locale ?? "en"}&oid=${orderId}`,
      }),
    })
    const keyJson = await keyRes.json()
    const paymentToken = keyJson.token
    if (!paymentToken) {
      console.error("[initiate] step3 failed:", keyJson)
      throw new Error("Failed to get payment key")
    }

    return NextResponse.json({ paymentToken: paymentToken, iframeId })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
