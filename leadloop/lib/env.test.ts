import { describe, expect, it } from "vitest";

import { parsePublicEnvironment, parseServerEnvironment } from "./env";

const validEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "server-only-service-role-key",
  RESEND_API_KEY: "server-only-resend-key",
  CRON_SECRET: "a-secure-secret-that-is-at-least-32-characters",
  APP_URL: "http://localhost:3000",
};

describe("environment validation", () => {
  it("accepts a complete public environment", () => {
    expect(parsePublicEnvironment(validEnvironment)).toMatchObject({
      NEXT_PUBLIC_SUPABASE_URL: validEnvironment.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        validEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  });

  it("rejects a malformed Supabase URL", () => {
    expect(() =>
      parsePublicEnvironment({
        ...validEnvironment,
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      }),
    ).toThrow();
  });

  it("rejects missing server secrets", () => {
    expect(() =>
      parseServerEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: validEnvironment.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          validEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }),
    ).toThrow();
  });

  it("rejects a weak cron secret", () => {
    expect(() =>
      parseServerEnvironment({ ...validEnvironment, CRON_SECRET: "too-short" }),
    ).toThrow();
  });
});
