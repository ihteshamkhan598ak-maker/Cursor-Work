"use server";

import { bookingSchema } from "@/lib/validations/booking";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAppointmentNotice } from "@/lib/whatsapp/send";

export type BookingState = { ok: boolean; message: string };

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export async function bookAppointment(
  _previous: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const parsed = bookingSchema.safeParse({
    doctorId: formData.get("doctorId"),
    patientName: formData.get("patientName"),
    patientPhone: formData.get("patientPhone"),
    appointmentDate: formData.get("appointmentDate"),
    startTime: formData.get("startTime"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ??
        "Please check the information you entered.",
    };
  }

  const admin = createAdminClient();
  const { data: doctor } = await admin
    .from("doctors")
    .select("id, name, clinic_id, active")
    .eq("id", parsed.data.doctorId)
    .eq("active", true)
    .maybeSingle();
  if (!doctor)
    return { ok: false, message: "This doctor is not currently available." };

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const [{ count: phoneRequestCount }, { count: doctorRequestCount }] =
    await Promise.all([
      admin
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("patient_phone", parsed.data.patientPhone)
        .gte("created_at", oneHourAgo),
      admin
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("doctor_id", doctor.id)
        .gte("created_at", oneHourAgo),
    ]);
  if ((phoneRequestCount ?? 0) >= 5 || (doctorRequestCount ?? 0) >= 60) {
    return {
      ok: false,
      message:
        "Too many appointment requests have been submitted. Please try again later or call the clinic.",
    };
  }

  const date = new Date(`${parsed.data.appointmentDate}T12:00:00+05:00`);
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
  }).format(new Date());
  if (parsed.data.appointmentDate < today)
    return { ok: false, message: "Please choose today or a future date." };

  const { data: schedule } = await admin
    .from("doctor_schedules")
    .select("start_time, end_time, slot_minutes")
    .eq("doctor_id", doctor.id)
    .eq("weekday", date.getDay())
    .maybeSingle();
  if (!schedule)
    return { ok: false, message: "The doctor has no schedule on this day." };
  const endTime = addMinutes(parsed.data.startTime, schedule.slot_minutes);
  const [selectedHour, selectedMinute] = parsed.data.startTime
    .split(":")
    .map(Number);
  const [scheduleHour, scheduleMinute] = schedule.start_time
    .slice(0, 5)
    .split(":")
    .map(Number);
  const offsetMinutes =
    selectedHour * 60 + selectedMinute - (scheduleHour * 60 + scheduleMinute);
  if (
    parsed.data.startTime < schedule.start_time.slice(0, 5) ||
    endTime > schedule.end_time.slice(0, 5) ||
    offsetMinutes % schedule.slot_minutes !== 0
  ) {
    return {
      ok: false,
      message: "Please choose a time from the doctor's schedule.",
    };
  }

  const { data: appointment, error } = await admin
    .from("appointments")
    .insert({
      doctor_id: doctor.id,
      clinic_id: doctor.clinic_id,
      patient_name: parsed.data.patientName,
      patient_phone: parsed.data.patientPhone,
      appointment_date: parsed.data.appointmentDate,
      start_time: parsed.data.startTime,
      end_time: endTime,
      note: parsed.data.note || null,
    })
    .select("id")
    .single();
  if (error || !appointment) {
    return {
      ok: false,
      message:
        error?.code === "23505"
          ? "This time has just been booked. Please choose another time."
          : "The appointment could not be saved. Please try again.",
    };
  }

  await sendAppointmentNotice({
    appointmentId: appointment.id,
    clinicId: doctor.clinic_id,
    phone: parsed.data.patientPhone,
    template: "booking_received",
    patientName: parsed.data.patientName,
    doctorName: doctor.name,
    date: parsed.data.appointmentDate,
    time: parsed.data.startTime,
  });
  return {
    ok: true,
    message:
      "The clinic has received your request and will confirm it shortly.",
  };
}
