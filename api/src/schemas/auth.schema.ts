import { Account_status } from "@prisma/client";
import { z } from "zod";

const adminRegistrationSchema = z.object({
  name: z.string().min(3).max(18),
  email: z.string().email(),
  password: z.string().min(6).max(200),
  role_id: z.string().optional(),
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

const accessTokenSchema = z.object({
  accessToken: z.string(),
});

const emailVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(5),
});

const verificationCodeEmailSchema = z.object({
  admin_id: z.string(),
  email: z.string().email(),
  sender: z.string().email().optional(),
  subject: z.string().max(2500),
  source: z.string(),
});

const updateAdminRoleSchema = z.object({
  role_id: z.string(),
});

const changeAdminStatusSchema = z.object({
  status: z.nativeEnum(Account_status),
});

const resetPasswordSchema = z.object({
  newPassword: z.string(),
  oldPassword: z.string(),
});

export {
  adminRegistrationSchema,
  adminLoginSchema,
  accessTokenSchema,
  emailVerifySchema,
  verificationCodeEmailSchema,
  updateAdminRoleSchema,
  changeAdminStatusSchema,
  resetPasswordSchema,
};
export type AdminRegistration = z.TypeOf<typeof adminRegistrationSchema>;
export type AdminLogin = z.TypeOf<typeof adminLoginSchema>;
export type AccessToken = z.TypeOf<typeof accessTokenSchema>;
export type EmailVerification = z.TypeOf<typeof emailVerifySchema>;
export type VerificationCodeEmail = z.TypeOf<
  typeof verificationCodeEmailSchema
>;
export type UpdateAdminRole = z.TypeOf<typeof updateAdminRoleSchema>;
export type ChangeAdminStatus = z.TypeOf<typeof changeAdminStatusSchema>;
export type ResetPassword = z.TypeOf<typeof resetPasswordSchema>;
