import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getServerEnv } from "@/lib/env/server";

type Notice = {
  appointmentId: string;
  clinicId: string;
  phone: string;
  template: "booking_received" | "confirmed" | "cancelled";
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
};

const messages = {
  booking_received: (n: Notice) =>
    `ClinicBook: ${n.patientName}, your appointment request with Dr. ${n.doctorName} for ${n.date} at ${n.time} has been received.`,
  confirmed: (n: Notice) =>
    `ClinicBook: Your appointment with Dr. ${n.doctorName} on ${n.date} at ${n.time} has been confirmed.`,
  cancelled: (n: Notice) =>
    `ClinicBook: Your appointment with Dr. ${n.doctorName} on ${n.date} at ${n.time} has been cancelled.`,
};

function normalizePhone(phone: string) {
  return `92${phone.replace(/\D/g, "").replace(/^0/, "")}`;
}

export async function sendAppointmentNotice(notice: Notice) {
  const env = getServerEnv();
  let status: "sent" | "failed" | "not_configured" = "not_configured";
  let errorText: string | null = null;

  if (
    !env.WHATSAPP_TEST_MODE &&
    env.WHATSAPP_TOKEN &&
    env.WHATSAPP_PHONE_NUMBER_ID
  ) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          signal: AbortSignal.timeout(8000),
          headers: {
            Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: normalizePhone(notice.phone),
            type: "text",
            text: { body: messages[notice.template](notice) },
          }),
        },
      );
      status = response.ok ? "sent" : "failed";
      if (!response.ok) errorText = `WhatsApp returned ${response.status}`;
    } catch (error) {
      status = "failed";
      errorText =
        error instanceof Error
          ? error.message.slice(0, 500)
          : "Unknown WhatsApp error";
    }
  }

  const admin = createAdminClient();
  await admin.from("message_log").insert({
    appointment_id: notice.appointmentId,
    clinic_id: notice.clinicId,
    template: notice.template,
    recipient_phone: notice.phone,
    status,
    error_text: errorText,
  });
}
