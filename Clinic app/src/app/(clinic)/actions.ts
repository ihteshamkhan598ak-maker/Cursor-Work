"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { requireClinic } from "@/lib/clinic/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  appointmentStatusSchema,
  doctorSchema,
  scheduleSchema,
} from "@/lib/validations/booking";
import { clinicProfileSchema } from "@/lib/validations/auth";
import { sendAppointmentNotice } from "@/lib/whatsapp/send";

export async function createDoctor(formData: FormData) {
  const values = doctorSchema.safeParse({
    name: formData.get("name"),
    specialty: formData.get("specialty"),
    qualifications: formData.get("qualifications") || undefined,
    feePkr: formData.get("feePkr"),
  });
  if (!values.success)
    redirect(
      `/doctors?error=${encodeURIComponent(values.error.issues[0]?.message ?? "The doctor information is invalid.")}`,
    );
  const { supabase, clinic } = await requireClinic();
  const { error } = await supabase.from("doctors").insert({
    clinic_id: clinic.id,
    name: values.data.name,
    specialty: values.data.specialty,
    qualifications: values.data.qualifications || null,
    fee_pkr: values.data.feePkr,
  });
  if (error) redirect("/doctors?error=Unable+to+add+the+doctor");
  revalidatePath("/doctors");
  revalidatePath("/");
  redirect("/doctors?message=Doctor+added+successfully");
}

export async function toggleDoctor(doctorId: string, active: boolean) {
  const { supabase, clinic } = await requireClinic();
  await supabase
    .from("doctors")
    .update({ active })
    .eq("id", doctorId)
    .eq("clinic_id", clinic.id);
  revalidatePath("/doctors");
  revalidatePath("/");
}

export async function saveSchedule(formData: FormData) {
  const values = scheduleSchema.safeParse({
    doctorId: formData.get("doctorId"),
    weekday: formData.get("weekday"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    slotMinutes: formData.get("slotMinutes"),
  });
  if (!values.success)
    redirect(
      `/doctors?error=${encodeURIComponent(values.error.issues[0]?.message ?? "The schedule is invalid.")}`,
    );
  const { supabase, clinic } = await requireClinic();
  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("id", values.data.doctorId)
    .eq("clinic_id", clinic.id)
    .maybeSingle();
  if (!doctor) redirect("/doctors?error=Doctor+not+found");
  const { error } = await supabase.from("doctor_schedules").upsert(
    {
      doctor_id: doctor.id,
      weekday: values.data.weekday,
      start_time: values.data.startTime,
      end_time: values.data.endTime,
      slot_minutes: values.data.slotMinutes,
    },
    { onConflict: "doctor_id,weekday" },
  );
  if (error) redirect("/doctors?error=Unable+to+save+the+schedule");
  revalidatePath("/doctors");
  revalidatePath(`/doctors/${doctor.id}`);
  redirect("/doctors?message=Schedule+saved+successfully");
}

export async function changeAppointmentStatus(
  appointmentId: string,
  rawStatus: string,
) {
  const status = appointmentStatusSchema.safeParse(rawStatus);
  if (!status.success)
    redirect("/appointments?error=Invalid+appointment+status");
  const { clinic } = await requireClinic();
  const admin = createAdminClient();
  const { data: appointment } = await admin
    .from("appointments")
    .select(
      "id, doctor_id, patient_name, patient_phone, appointment_date, start_time, status",
    )
    .eq("id", appointmentId)
    .eq("clinic_id", clinic.id)
    .maybeSingle();
  if (!appointment) redirect("/appointments?error=Appointment+not+found");
  const { data: doctor } = await admin
    .from("doctors")
    .select("name")
    .eq("id", appointment.doctor_id)
    .maybeSingle();
  const { error } = await admin
    .from("appointments")
    .update({ status: status.data })
    .eq("id", appointment.id)
    .eq("clinic_id", clinic.id);
  if (
    !error &&
    (status.data === "confirmed" || status.data === "cancelled") &&
    appointment.status !== status.data
  ) {
    const template = status.data;
    after(async () => {
      await sendAppointmentNotice({
        appointmentId: appointment.id,
        clinicId: clinic.id,
        phone: appointment.patient_phone,
        template,
        patientName: appointment.patient_name,
        doctorName: doctor?.name ?? "your doctor",
        date: appointment.appointment_date,
        time: appointment.start_time.slice(0, 5),
      });
    });
  }
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  if (error) redirect("/appointments?error=Unable+to+update+the+appointment");
  redirect(`/appointments?message=Appointment+marked+as+${status.data}`);
}

export async function updateClinic(formData: FormData) {
  const values = clinicProfileSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
  });
  if (!values.success)
    redirect(
      `/settings?error=${encodeURIComponent(values.error.issues[0]?.message ?? "The clinic information is invalid.")}`,
    );
  const { supabase, clinic } = await requireClinic();
  const { error } = await supabase
    .from("clinics")
    .update(values.data)
    .eq("id", clinic.id);
  if (error) redirect("/settings?error=Unable+to+update+the+clinic");
  revalidatePath("/", "layout");
  redirect("/settings?message=Clinic+updated+successfully");
}
