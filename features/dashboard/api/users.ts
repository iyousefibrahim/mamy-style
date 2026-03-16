import { createClient } from "@/lib/supabase/client"
import type { UserProfile } from "../types"

const PAGE_SIZE = 10

export type UserFilters = {
  search?: string
  role?: "all" | "super-admin" | "admin" | "customer"
  status?: "all" | "active" | "inactive" | "banned"
  page?: number
}

export type PaginatedResult<T> = {
  data: T[]
  total: number
}

export async function fetchUsers(filters: UserFilters = {}): Promise<PaginatedResult<UserProfile>> {
  const supabase = createClient()
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase.from("profiles").select("*", { count: "exact" })

  if (filters.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,username.ilike.%${filters.search}%`
    )
  }
  if (filters.role && filters.role !== "all") {
    query = query.eq("role", filters.role)
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  query = query.order("created_at", { ascending: false }).range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as UserProfile[], total: count ?? 0 }
}

export async function updateUserRole(
  id: string,
  role: UserProfile["role"]
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id)
  if (error) throw error
}

export async function updateUserStatus(
  id: string,
  status: UserProfile["status"]
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("profiles").update({ status }).eq("id", id)
  if (error) throw error
}
