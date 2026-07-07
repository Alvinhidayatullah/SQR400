import { z } from "zod";

// User Registration & Login Schema
export const authSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters long")
    .max(50, "Username must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),
});

// Update Identity Schema
export const updateIdentitySchema = z.object({
  currentUsername: z.string().min(1),
  currentPassword: z.string().min(1, "Current password is required"),
  newUsername: z
    .string()
    .min(4, "New username must be at least 4 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "New username must be alphanumeric"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100)
    .optional()
    .nullable()
    .or(z.literal('')),
});

// Transaction Log Schema
export const transactionSchema = z.object({
  username: z.string().min(1),
  bank: z.string().min(1),
  amount: z.string().or(z.number()),
  currency: z.string().min(1).max(10),
  senderRef: z.string().max(255).optional(),
});
