import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendOrderWhatsApp } from "@/lib/whatsapp"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const { orderId } = await req.json()
  if (!orderId) return NextResponse.json({ ok: false }, { status: 400 })

  // Verify order belongs to this user
  const { data: order } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", orderId)
    .single()

  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ ok: false }, { status: 403 })
  }

  await sendOrderWhatsApp(orderId)
  return NextResponse.json({ ok: true })
}
