import { describe, expect, it } from "vitest";
import { authSchema, clinicProfileSchema } from "@/lib/validations/auth";

describe("auth validation", () => {
  it("normalizes a valid email", () => {
    expect(
      authSchema.parse({
        email: " OWNER@EXAMPLE.COM ",
        password: "safe-pass-123",
      }).email,
    ).toBe("owner@example.com");
  });
  it("rejects short passwords", () => {
    expect(
      authSchema.safeParse({ email: "owner@example.com", password: "short" })
        .success,
    ).toBe(false);
  });
  it("validates clinic profile fields", () => {
    expect(
      clinicProfileSchema.safeParse({
        name: "City Clinic",
        address: "Main Road",
        phone: "0300-1234567",
      }).success,
    ).toBe(true);
  });
});
