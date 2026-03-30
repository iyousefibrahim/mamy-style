import { createClient } from "@/lib/supabase/client"
import type { Coupon, PaginatedResult } from "../types"
import { paginationRange } from "@/utils/pagination"

export type CouponFilters = {
  search?: string
  page?: number
}

export async function fetchCoupons(filters: CouponFilters = {}): Promise<PaginatedResult<Coupon>> {
  const supabase = createClient()
  const { from, to } = paginationRange(filters.page)

  let query = supabase.from("coupons").select("*", { count: "exact" })

  if (filters.search) {
    query = query.ilike("code", `%${filters.search}%`)
  }

  query = query.order("created_at", { ascending: false }).range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Coupon[], total: count ?? 0 }
}

export async function fetchCoupon(id: string): Promise<Coupon | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data as Coupon
}

export async function createCoupon(
  payload: Omit<Coupon, "id" | "used_count" | "created_at" | "updated_at">
): Promise<Coupon> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("coupons")
    .insert({ ...payload, code: payload.code.toUpperCase() })
    .select()
    .single()
  if (error) throw error
  return data as Coupon
}

export async function updateCoupon(
  id: string,
  payload: Partial<Omit<Coupon, "id" | "used_count" | "created_at" | "updated_at">>
): Promise<Coupon> {
  const supabase = createClient()
  const patch = payload.code ? { ...payload, code: payload.code.toUpperCase() } : payload
  const { data, error } = await supabase
    .from("coupons")
    .update(patch)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as Coupon
}

export async function deleteCoupon(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("coupons").delete().eq("id", id)
  if (error) throw error
}

export async function toggleCouponActive(id: string, is_active: boolean): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("coupons")
    .update({ is_active })
    .eq("id", id)
  if (error) throw error
}
