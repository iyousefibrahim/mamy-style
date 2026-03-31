import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Params = { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, status, payment_method, user_id")
    .eq("id", id)
    .single()

  if (error || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  if (order.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  if (order.status !== "pending_payment" && order.status !== "confirmed") {
    return NextResponse.json({ error: "cannotCancel" }, { status: 400 })
  }

  // Determine new status
  const newStatus =
    order.status === "confirmed" && order.payment_method === "online"
      ? "cancellation_requested"
      : "cancelled"

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", id)

  if (updateError) return NextResponse.json({ error: "cancelError" }, { status: 500 })

  // Free the coupon usage if going directly to cancelled
  if (newStatus === "cancelled") {
    await supabase.from("coupon_usages").delete().eq("order_id", id)
  }

  return NextResponse.json({ status: newStatus })
}
