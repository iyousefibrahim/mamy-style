import { createClient } from "@/lib/supabase/server"
import type { Coupon } from "../types"

export async function fetchCouponServer(id: string): Promise<Coupon | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data as Coupon
}
