import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Egyptian phone: 010/011/012/015 + 8 digits, optional +20 prefix
const egyptianPhonePattern = /^(\+?20|0)1[0125]\d{8}$/

const egyptianPhone = z.string().superRefine((val, ctx) => {
  if (!egyptianPhonePattern.test(val)) {
    ctx.addIssue({
      code: "custom",
      message: "Must be a valid Egyptian number (e.g. 01012345678)",
    })
  }
})

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z
    .string()
    .min(3)
    .max(20)
    .superRefine((val, ctx) => {
      if (!/^[a-zA-Z0-9_]+$/.test(val)) {
        ctx.addIssue({
          code: "custom",
          message: "Only letters, numbers, and underscores allowed",
        })
      }
    }),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.union([egyptianPhone, z.literal("")]).optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
