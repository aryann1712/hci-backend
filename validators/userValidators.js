// validators/userValidators.js
import { z } from "zod";

export const signUpSchema = z.object({
  phone: z.string().min(10),   // e.g. 10-digit minimum for phone
  email: z.string().email().optional(),
  password: z.string().min(6),  // at least 6 chars
  gstNumber: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
});


export const signInSchema = z.object({
  phone: z.string()
    .min(10, "Phone must be at least 10 digits"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
});


export const updateUserProfileSchema = z.object({
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  gstNumber: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  // If you allow updating password, you can include that too:
  password: z.string().min(6).optional(),
});

export const changePasswordSchema = z.object({
  phone: z.string().min(10),
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["admin", "user"]),
});
