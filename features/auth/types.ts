import { z } from "zod"

type TFn = (key: string) => string

export const getLoginSchema = (t: TFn) =>
  z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")).min(8, t("passwordMin")),
  })

export const getRegisterSchema = (t: TFn) =>
  z.object({
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    username: z
      .string()
      .min(3, t("usernameMin"))
      .max(20, t("usernameMax"))
      .superRefine((val, ctx) => {
        if (!/^[a-zA-Z0-9_]+$/.test(val)) {
          ctx.addIssue({ code: "custom", message: t("usernameInvalid") })
        }
      }),
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")).min(8, t("passwordMin")),
  })

export const getForgotPasswordSchema = (t: TFn) =>
  z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
  })

export const getResetPasswordSchema = (t: TFn) =>
  z
    .object({
      password: z.string().min(1, t("passwordRequired")).min(8, t("passwordMin")),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    })

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>
export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>
export type ForgotPasswordFormValues = z.infer<ReturnType<typeof getForgotPasswordSchema>>
export type ResetPasswordFormValues = z.infer<ReturnType<typeof getResetPasswordSchema>>
