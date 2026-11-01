import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(72);
export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const clinicProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(300),
  phone: z
    .string()
    .trim()
    .regex(/^03\d{2}-?\d{7}$/, "Enter a valid number like 03XX-XXXXXXX."),
});
