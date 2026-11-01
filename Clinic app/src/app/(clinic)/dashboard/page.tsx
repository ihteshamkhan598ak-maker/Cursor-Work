import Link from "next/link";
import { requireClinic } from "@/lib/clinic/auth";
import { DashboardNav } from "@/components/dashboard-nav";

export const instant = false;
const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirm",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function DashboardPage() {
  const { supabase, clinic } = await requireClinic();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
  }).format(new Date());
  const [
    { count: doctorCount },
    { count: pendingCount },
    { data: todayAppointments },
  ] = await Promise.all([
    supabase
      .from("doctors")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinic.id)
      .eq("active", true),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinic.id)
      .eq("status", "pending"),
    supabase
      .from("appointments")
      .select("id, start_time, patient_name, status, doctors(name)")
      .eq("clinic_id", clinic.id)
      .eq("appointment_date", today)
      .order("start_time")
      .limit(6),
  ]);
  return (
    <>
      <DashboardNav clinicName={clinic.name} />
      <main className="dashboard-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Clinic overview</p>
            <h1 className="page-title">Good day, {clinic.name}</h1>
            <p className="mt-2 text-slate-600">
              Here is what needs your attention today.
            </p>
          </div>
          <Link className="button-primary" href="/appointments">
            Manage appointments
          </Link>
        </div>
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="metric">
            <p>Today&apos;s appointments</p>
            <strong>{todayAppointments?.length ?? 0}</strong>
          </div>
          <div className="metric">
            <p>Pending requests</p>
            <strong>{pendingCount ?? 0}</strong>
          </div>
          <div className="metric">
            <p>Active doctors</p>
            <strong>{doctorCount ?? 0}</strong>
          </div>
        </section>
        {(doctorCount ?? 0) === 0 && (
          <section className="mt-8 rounded-3xl border-2 border-dashed border-teal-300 bg-teal-50 p-7">
            <p className="eyebrow">Complete your clinic setup</p>
            <h2 className="text-2xl font-black text-slate-950">
              Add a doctor before accepting appointments
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add the doctor&apos;s name, fee, and weekly schedule. The doctor
              will then appear on the patient booking page, and requests will
              appear on this dashboard.
            </p>
            <Link className="button-primary mt-5" href="/doctors">
              Add your first doctor
            </Link>
          </section>
        )}
        <section className="card mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Today&apos;s schedule</h2>
            <span className="text-sm text-slate-500">{today}</span>
          </div>
          <div className="mt-4 divide-y">
            {todayAppointments?.map((appointment) => {
              const doctor = Array.isArray(appointment.doctors)
                ? appointment.doctors[0]
                : appointment.doctors;
              return (
                <div
                  className="flex items-center gap-4 py-4"
                  key={appointment.id}
                >
                  <time className="w-16 font-black text-teal-700">
                    {appointment.start_time.slice(0, 5)}
                  </time>
                  <div className="flex-1">
                    <p className="font-bold">{appointment.patient_name}</p>
                    <p className="text-sm text-slate-500">Dr. {doctor?.name}</p>
                  </div>
                  <span className={`status status-${appointment.status}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </div>
              );
            })}
            {!todayAppointments?.length && (
              <p className="py-8 text-center text-slate-500">
                There are no appointments today.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
