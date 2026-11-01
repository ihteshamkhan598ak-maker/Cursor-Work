import { describe, expect, it } from "vitest";
import {
  appointmentStatusSchema,
  bookingSchema,
  doctorSchema,
  scheduleSchema,
} from "@/lib/validations/booking";

describe("booking validation", () => {
  it("accepts a valid appointment request", () => {
    expect(
      bookingSchema.safeParse({
        doctorId: "40000000-0000-4000-8000-000000000001",
        patientName: "Amina Khan",
        patientPhone: "0300-1234567",
        appointmentDate: "2026-10-27",
        startTime: "09:30",
      }).success,
    ).toBe(true);
  });

  it("accepts PostgreSQL UUIDs used by seeded doctors", () => {
    expect(
      bookingSchema.safeParse({
        doctorId: "40000000-0000-0000-0000-000000000001",
        patientName: "Ihtesham Hussain",
        patientPhone: "03059551007",
        appointmentDate: "2026-10-27",
        startTime: "09:00",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid patient contact details", () => {
    expect(
      bookingSchema.safeParse({
        doctorId: "40000000-0000-4000-8000-000000000001",
        patientName: "A",
        patientPhone: "123",
        appointmentDate: "tomorrow",
        startTime: "9am",
      }).success,
    ).toBe(false);
  });

  it("validates doctor fees and schedule ordering", () => {
    expect(
      doctorSchema.safeParse({
        name: "Ahmed Khan",
        specialty: "general",
        feePkr: 1500,
      }).success,
    ).toBe(true);
    expect(
      scheduleSchema.safeParse({
        doctorId: "40000000-0000-4000-8000-000000000001",
        weekday: 1,
        startTime: "17:00",
        endTime: "09:00",
        slotMinutes: 30,
      }).success,
    ).toBe(false);
  });

  it("allows only supported appointment states", () => {
    expect(appointmentStatusSchema.safeParse("confirmed").success).toBe(true);
    expect(appointmentStatusSchema.safeParse("deleted").success).toBe(false);
  });
});
