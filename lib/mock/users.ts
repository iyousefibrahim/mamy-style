export type MockUser = {
  id: string
  full_name: string
  email: string
  username: string
  role: "super-admin" | "admin" | "customer"
  status: "active" | "inactive" | "banned"
  avatar_url: string | null
  created_at: string
}

export const mockCurrentUser: MockUser = {
  id: "user-1",
  full_name: "سارة أحمد",
  email: "sara@mamystyle.com",
  username: "sara_admin",
  role: "super-admin",
  status: "active",
  avatar_url: null,
  created_at: "2025-11-24T10:00:00Z",
}

export const mockUsers: MockUser[] = [
  mockCurrentUser,
  {
    id: "user-2",
    full_name: "نور محمد",
    email: "nour@mamystyle.com",
    username: "nour_admin",
    role: "admin",
    status: "active",
    avatar_url: null,
    created_at: "2025-11-24T11:00:00Z",
  },
  {
    id: "user-3",
    full_name: "ريم خالد",
    email: "reem@example.com",
    username: "reem_k",
    role: "customer",
    status: "active",
    avatar_url: null,
    created_at: "2025-11-25T09:00:00Z",
  },
  {
    id: "user-4",
    full_name: "دينا علي",
    email: "dina@example.com",
    username: "dina_ali",
    role: "customer",
    status: "inactive",
    avatar_url: null,
    created_at: "2025-12-01T14:00:00Z",
  },
  {
    id: "user-5",
    full_name: "منى حسن",
    email: "mona@example.com",
    username: "mona_h",
    role: "customer",
    status: "banned",
    avatar_url: null,
    created_at: "2025-12-05T16:00:00Z",
  },
]
