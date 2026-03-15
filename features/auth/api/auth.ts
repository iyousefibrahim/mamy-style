import { createClient } from "@/lib/supabase/client"
import type { LoginFormValues, RegisterFormValues } from "../types"

export async function login({ email, password }: LoginFormValues) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function register(
  values: RegisterFormValues,
  avatarFile: File | null
) {
  const supabase = createClient()
  const { firstName, lastName, username, email, password, phone } = values
  const fullName = `${firstName} ${lastName}`

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })
  if (error) throw error
  if (!data.user) throw new Error("Registration failed")

  const userId = data.user.id

  // Upload avatar if provided
  let avatarUrl: string | null = null
  if (avatarFile) {
    avatarUrl = await uploadAvatar(userId, avatarFile)
  }

  // Update profile with username, phone, avatar_url
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      username,
      phone: phone || null,
      avatar_url: avatarUrl,
    })
    .eq("id", userId)

  if (profileError) throw profileError

  return data
}

export async function uploadAvatar(userId: string, file: File) {
  const supabase = createClient()
  const ext = file.name.split(".").pop()
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from("avatars").getPublicUrl(path)
  return data.publicUrl
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function forgotPassword(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  })
  if (error) throw error
}

export async function resetPassword(password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}
