import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()

  // Must be authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "couponNotFound" }, { status: 401 })
  }

  const { code } = await req.json()
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "couponNotFound" }, { status: 400 })
  }

  // Fetch coupon
  const { data: coupon } = await supabase
    .from("coupons")
    .select("id, code, discount_percent, free_shipping, max_uses, used_count, is_active, expires_at")
    .eq("code", code.trim().toUpperCase())
    .single()

  if (!coupon) {
    return NextResponse.json({ error: "couponNotFound" }, { status: 404 })
  }

  if (!coupon.is_active) {
    return NextResponse.json({ error: "couponInactive" }, { status: 400 })
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "couponExpired" }, { status: 400 })
  }

  if (coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: "couponMaxUsed" }, { status: 400 })
  }

  // Check if this user already used this coupon
  const { data: existingUsage } = await supabase
    .from("coupon_usages")
    .select("id")
    .eq("coupon_id", coupon.id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingUsage) {
    return NextResponse.json({ error: "couponAlreadyUsed" }, { status: 400 })
  }

  return NextResponse.json({
    id: coupon.id,
    code: coupon.code,
    discount_percent: coupon.discount_percent,
    free_shipping: coupon.free_shipping,
  })
}
