import "server-only";

import { Resend } from "resend";
import { getServerEnv } from "@/lib/env/server";

type AppointmentEmail = {
  appointmentId: string;
  template: "booking_received" | "confirmed" | "cancelled";
  patientName: string;
  patientEmail?: string | null;
  clinicEmail?: string | null;
  clinicName: string;
  doctorName: string;
  date: string;
  time: string;
};

const subjects = {
  booking_received: "Appointment request received",
  confirmed: "Appointment confirmed",
  cancelled: "Appointment cancelled",
} as const;

function patientMessage(notice: AppointmentEmail) {
  if (notice.template === "confirmed") {
    return `Your appointment with Dr. ${notice.doctorName} at ${notice.clinicName} on ${notice.date} at ${notice.time} has been confirmed.`;
  }
  if (notice.template === "cancelled") {
    return `Your appointment with Dr. ${notice.doctorName} at ${notice.clinicName} on ${notice.date} at ${notice.time} has been cancelled. Please contact the clinic if you need another time.`;
  }
  return `${notice.clinicName} received your appointment request with Dr. ${notice.doctorName} for ${notice.date} at ${notice.time}. The clinic will confirm it shortly.`;
}

export async function sendAppointmentEmails(notice: AppointmentEmail) {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) return;

  const resend = new Resend(env.RESEND_API_KEY);
  const requests: ReturnType<typeof resend.emails.send>[] = [];

  if (notice.patientEmail) {
    requests.push(
      resend.emails.send(
        {
          from: `ClinicBook <${env.RESEND_FROM_EMAIL}>`,
          to: notice.patientEmail,
          subject: subjects[notice.template],
          text: `Hello ${notice.patientName},\n\n${patientMessage(notice)}\n\nAppointment reference: ${notice.appointmentId}\n\nClinicBook`,
        },
        {
          idempotencyKey: `${notice.appointmentId}/${notice.template}/patient`,
        },
      ),
    );
  }

  if (notice.template === "booking_received" && notice.clinicEmail) {
    requests.push(
      resend.emails.send(
        {
          from: `ClinicBook <${env.RESEND_FROM_EMAIL}>`,
          to: notice.clinicEmail,
          subject: `New appointment request: ${notice.patientName}`,
          text: `${notice.patientName} requested an appointment with Dr. ${notice.doctorName} on ${notice.date} at ${notice.time}.\n\nOpen ClinicBook to confirm or cancel it.\nAppointment reference: ${notice.appointmentId}`,
        },
        { idempotencyKey: `${notice.appointmentId}/booking_received/clinic` },
      ),
    );
  }

  await Promise.allSettled(requests);
}
