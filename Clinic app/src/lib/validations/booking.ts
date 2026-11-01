import { z } from "zod";

export const pakistanPhoneSchema = z
  .string()
  .trim()
  .regex(/^03\d{2}-?\d{7}$/, "Enter a valid number like 03XX-XXXXXXX.");

const postgresUuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Invalid doctor ID.",
  );

export const bookingSchema = z.object({
  doctorId: postgresUuidSchema,
  patientName: z.string().trim().min(2).max(120),
  patientPhone: pakistanPhoneSchema,
  appointmentDate: z.iso.date(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  note: z.string().trim().max(500).optional(),
});

export const doctorSchema = z.object({
  name: z.string().trim().min(2).max(120),
  specialty: z.enum([
    "general",
    "children",
    "women",
    "skin",
    "heart",
    "bones",
    "eyes",
    "dental",
    "ent",
    "mental",
    "other",
  ]),
  qualifications: z.string().trim().max(300).optional(),
  feePkr: z.coerce.number().int().min(0).max(100000),
});

export const scheduleSchema = z
  .object({
    doctorId: postgresUuidSchema,
    weekday: z.coerce.number().int().min(0).max(6),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    slotMinutes: z.coerce
      .number()
      .pipe(z.union([z.literal(15), z.literal(30), z.literal(60)])),
  })
  .refine((value) => value.endTime > value.startTime, {
    message: "The end time must be later than the start time.",
  });

export const appointmentStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);
