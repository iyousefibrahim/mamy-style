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
  discount_percentage: z.coerce.number().min(0).max(100),
  discount_value: z.coerce.number().min(0),
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
