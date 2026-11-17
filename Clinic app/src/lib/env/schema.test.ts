import { describe, expect, it } from "vitest";

import { publicEnvSchema, serverEnvSchema } from "@/lib/env/schema";

const validPublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
};

describe("environment schemas", () => {
  it("accepts valid public configuration", () => {
    expect(publicEnvSchema.parse(validPublicEnv)).toEqual(validPublicEnv);
  });

  it("rejects an invalid Supabase URL", () => {
    expect(() =>
      publicEnvSchema.parse({
        ...validPublicEnv,
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      }),
    ).toThrow();
  });

  it("parses server flags and allows absent WhatsApp credentials", () => {
    const result = serverEnvSchema.parse({
      ...validPublicEnv,
      SUPABASE_SECRET_KEY: "sb_secret_example",
      WHATSAPP_TEST_MODE: "true",
      APP_URL: "http://localhost:3000",
    });

    expect(result.WHATSAPP_TEST_MODE).toBe(true);
    expect(result.WHATSAPP_TOKEN).toBeUndefined();
  });

  it("rejects a missing server secret key", () => {
    expect(() =>
      serverEnvSchema.parse({
        ...validPublicEnv,
        APP_URL: "http://localhost:3000",
      }),
    ).toThrow();
  });
});
