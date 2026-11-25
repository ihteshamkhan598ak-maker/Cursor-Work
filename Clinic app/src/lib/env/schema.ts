import { z } from "zod";

const optionalSecret = z.string().trim().min(1).optional();

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().trim().min(1),
});

export const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SECRET_KEY: z.string().trim().min(1),
  WHATSAPP_TOKEN: optionalSecret,
  WHATSAPP_PHONE_NUMBER_ID: optionalSecret,
  WHATSAPP_TEST_MODE: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  RESEND_API_KEY: optionalSecret,
  RESEND_FROM_EMAIL: z.email().optional(),
  APP_URL: z.url(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
