import { z } from "zod"

// ─── Product ────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  category_id: z.string().min(1),
  brand: z.string().optional(),
  publish_status: z.enum(["draft", "published", "archived"]),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  discount_percentage: z.coerce.number().min(0).max(100),
  discount_valid_until: z.string().optional(),
})

export type CreateProductFormValues = z.infer<typeof createProductSchema>

// ─── Category ───────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  is_active: z.boolean(),
})

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>

// ─── Profile ────────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .superRefine((val, ctx) => {
      if (!/^[a-zA-Z0-9_]+$/.test(val)) {
        ctx.addIssue({ code: "custom", message: "Only letters, numbers, and underscores allowed" })
      }
    }),
  phone: z.union([
    z.string().superRefine((val, ctx) => {
      if (!/^(\+?20|0)1[0125]\d{8}$/.test(val)) {
        ctx.addIssue({ code: "custom", message: "Must be a valid Egyptian number" })
      }
    }),
    z.literal(""),
  ]).optional(),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

// ─── Password ───────────────────────────────────────────────────────────────

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>

// ─── DB row types (returned from Supabase) ───────────────────────────────────

export type Product = {
  id: string
  name: string
  description: string | null
  status: "active" | "inactive"
  stock: number
  price: number
  category_id: string | null
  category_name: string | null
  brand: string | null
  publish_status: "draft" | "published" | "archived"
  discount_percentage: number
  discount_valid_until: string | null
  image_url: string | null
  gallery_urls: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  is_featured: boolean
  views: number
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  description: string | null
  status: "active" | "inactive"
  products_count: number
  views: number
  tags: string[]
  image_url: string | null
  gallery_urls: string[]
  created_at: string
  updated_at: string
}

export type UserProfile = {
  id: string
  full_name: string
  email: string
  username: string | null
  phone: string | null
  avatar_url: string | null
  role: "super-admin" | "admin" | "customer"
  status: "active" | "inactive" | "banned"
  created_at: string
}

export type PaginatedResult<T> = {
  data: T[]
  total: number
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type ShippingType = 'local' | 'national'
export type PaymentMethod = 'online' | 'cod'

export type Order = {
  id: string
  user_id: string
  status: OrderStatus
  governorate: string
  city: string
  address_line: string
  phone: string
  subtotal: number
  discount: number
  shipping_fee: number
  total: number
  shipping_type: ShippingType
  payment_method: PaymentMethod
  coupon_code: string | null
  paymob_order_id: string | null
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  name: string
  price: number
  quantity: number
  color: string | null
  size: string | null
  image_url: string | null
}

export type OrderWithItems = Order & { order_items: OrderItem[] }

// ─── Coupons ─────────────────────────────────────────────────────────────────

export const createCouponSchema = z.object({
  code: z.string().min(1).max(30),
  discount_percent: z.number().min(0).max(100),
  free_shipping: z.boolean(),
  max_uses: z.number().int().min(1),
  is_active: z.boolean(),
  expires_at: z.string().optional(),
})

export type CreateCouponFormValues = z.infer<typeof createCouponSchema>

export type Coupon = {
  id: string
  code: string
  discount_percent: number
  free_shipping: boolean
  max_uses: number
  used_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
}
