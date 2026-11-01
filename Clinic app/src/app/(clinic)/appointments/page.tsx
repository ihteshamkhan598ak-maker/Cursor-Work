import { requireClinic } from "@/lib/clinic/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardNav } from "@/components/dashboard-nav";
import { connection } from "next/server";
import { changeAppointmentStatus } from "../actions";

export const instant = false;
const PAGE_SIZE = 25;

const statusLabels: Record<string, string> = {
  all: "All",
  pending: "Pending",
  confirmed: "Confirm",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    page?: string;
    message?: string;
    error?: string;
  }>;
}) {
  await connection();
  const {
    status,
    page: rawPage,
    message,
    error: actionError,
  } = await searchParams;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);
  const { clinic } = await requireClinic();
  const admin = createAdminClient();
  let query = admin
    .from("appointments")
    .select(
      "id, doctor_id, patient_name, patient_phone, appointment_date, start_time, status, note",
      { count: "exact" },
    )
    .eq("clinic_id", clinic.id)
    .order("appointment_date", { ascending: false })
    .order("start_time");
  if (["pending", "confirmed", "cancelled", "completed"].includes(status ?? ""))
    query = query.eq("status", status!);
  const {
    data: appointments,
    count,
    error: appointmentError,
  } = await query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  const doctorIds = [
    ...new Set(
      (appointments ?? []).map((appointment) => appointment.doctor_id),
    ),
  ];
  const { data: doctors, error: doctorError } = doctorIds.length
    ? await admin.from("doctors").select("id, name").in("id", doctorIds)
    : { data: [], error: null };
  const doctorNames = new Map(
    (doctors ?? []).map((doctor) => [doctor.id, doctor.name]),
  );
  const error = appointmentError ?? doctorError;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  return (
    <>
      <DashboardNav clinicName={clinic.name} />
      <main className="dashboard-shell">
        <div>
          <p className="eyebrow">Patient requests</p>
          <h1 className="page-title">Manage appointments</h1>
        </div>
        {(message || actionError) && (
          <p
            role="status"
            className={`mt-5 rounded-xl p-3 ${actionError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
          >
            {actionError ?? message}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (item) => (
              <a
                key={item}
                href={
                  item === "all"
                    ? "/appointments"
                    : `/appointments?status=${item}`
                }
                className={`rounded-full px-4 py-2 text-sm font-bold ${(!status && item === "all") || status === item ? "bg-teal-800 text-white" : "bg-white text-slate-600"}`}
              >
                {statusLabels[item]}
              </a>
            ),
          )}
        </div>
        <div className="mt-6 space-y-4">
          {error && (
            <p
              role="alert"
              className="card border-red-200 bg-red-50 text-red-700"
            >
              Appointments could not be loaded. Please refresh the page.
            </p>
          )}
          {appointments?.map((appointment) => {
            return (
              <article className="card" key={appointment.id}>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-black">
                        {appointment.patient_name}
                      </h2>
                      <span className={`status status-${appointment.status}`}>
                        {statusLabels[appointment.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {appointment.appointment_date} at{" "}
                      {appointment.start_time.slice(0, 5)} · Dr.{" "}
                      {doctorNames.get(appointment.doctor_id) ??
                        "Unknown doctor"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.patient_phone}
                      {appointment.note ? ` · ${appointment.note}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {appointment.status === "pending" && (
                      <form
                        action={changeAppointmentStatus.bind(
                          null,
                          appointment.id,
                          "confirmed",
                        )}
                      >
                        <button className="button-primary" type="submit">
                          Confirm
                        </button>
                      </form>
                    )}
                    {!["cancelled", "completed"].includes(
                      appointment.status,
                    ) && (
                      <form
                        action={changeAppointmentStatus.bind(
                          null,
                          appointment.id,
                          "cancelled",
                        )}
                      >
                        <button className="button-danger" type="submit">
                          Cancel
                        </button>
                      </form>
                    )}
                    {appointment.status === "confirmed" && (
                      <form
                        action={changeAppointmentStatus.bind(
                          null,
                          appointment.id,
                          "completed",
                        )}
                      >
                        <button className="button-secondary" type="submit">
                          Mark completed
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
          {!error && !appointments?.length && (
            <p className="card text-center text-slate-500">
              No appointments found.
            </p>
          )}
        </div>
        {totalPages > 1 && (
          <nav
            aria-label="Appointment pages"
            className="mt-6 flex items-center justify-between"
          >
            {page > 1 ? (
              <a
                className="button-secondary"
                href={`/appointments?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page - 1) })}`}
              >
                Previous
              </a>
            ) : (
              <span />
            )}
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <a
                className="button-secondary"
                href={`/appointments?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page + 1) })}`}
              >
                Next
              </a>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>
    </>
  );
}
