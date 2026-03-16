import { createClient } from "@/lib/supabase/client"
import type { UserProfile } from "../types"

export async function fetchCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) return null
  return data as UserProfile
}

export async function updateProfile(payload: {
  full_name: string
  username: string
  phone?: string | null
  avatar_url?: string | null
}): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)

  if (error) throw error
}
