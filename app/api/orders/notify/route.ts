import { NextRequest, NextResponse } from "next/server"
import { sendOrderWhatsApp } from "@/lib/whatsapp"

export async function POST(req: NextRequest) {
  const { orderId } = await req.json()
  if (!orderId) return NextResponse.json({ ok: false }, { status: 400 })
  await sendOrderWhatsApp(orderId)
  return NextResponse.json({ ok: true })
}
