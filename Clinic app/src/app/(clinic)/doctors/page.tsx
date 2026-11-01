import { requireClinic } from "@/lib/clinic/auth";
import { DashboardNav } from "@/components/dashboard-nav";
import { createDoctor, saveSchedule, toggleDoctor } from "../actions";

export const instant = false;
const specialties = [
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
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const specialtyLabels: Record<string, string> = {
  general: "General doctor",
  children: "Pediatrics",
  women: "Gynecology",
  skin: "Dermatology",
  heart: "Cardiology",
  bones: "Orthopedics",
  eyes: "Ophthalmology",
  dental: "Dentistry",
  ent: "ENT",
  mental: "Mental health",
  other: "Other",
};

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const feedback = await searchParams;
  const { supabase, clinic } = await requireClinic();
  const { data: doctors } = await supabase
    .from("doctors")
    .select(
      "id, name, specialty, qualifications, fee_pkr, active, doctor_schedules(weekday, start_time, end_time)",
    )
    .eq("clinic_id", clinic.id)
    .order("created_at");
  return (
    <>
      <DashboardNav clinicName={clinic.name} />
      <main className="dashboard-shell">
        <div>
          <p className="eyebrow">Clinic team</p>
          <h1 className="page-title">Doctors and schedules</h1>
        </div>
        {(feedback.error || feedback.message) && (
          <p
            className={`mt-5 rounded-xl p-3 ${feedback.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
          >
            {feedback.error ?? feedback.message}
          </p>
        )}
        <section className="card mt-8">
          <h2 className="text-xl font-black">Add a new doctor</h2>
          <form
            action={createDoctor}
            className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <label className="form-label">
              Doctor name
              <input className="field" name="name" required />
            </label>
            <label className="form-label">
              Specialty
              <select className="field" name="specialty">
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {specialtyLabels[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Qualifications
              <input
                className="field"
                name="qualifications"
                placeholder="MBBS, FCPS"
              />
            </label>
            <label className="form-label">
              Fee (Rupees)
              <input
                className="field"
                name="feePkr"
                type="number"
                min="0"
                required
              />
            </label>
            <button
              className="button-primary md:col-span-2 lg:col-span-4"
              type="submit"
            >
              Save doctor
            </button>
          </form>
        </section>
        <section className="mt-8 space-y-5">
          {doctors?.map((doctor) => (
            <article className="card" key={doctor.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black">Dr. {doctor.name}</h2>
                    <span
                      className={`status ${doctor.active ? "status-confirmed" : "status-cancelled"}`}
                    >
                      {doctor.active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-teal-700">
                    {specialtyLabels[doctor.specialty]} · Rs.{" "}
                    {doctor.fee_pkr?.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {doctor.qualifications}
                  </p>
                </div>
                <form
                  action={toggleDoctor.bind(null, doctor.id, !doctor.active)}
                >
                  <button className="button-secondary" type="submit">
                    {doctor.active ? "Hide from patients" : "Activate"}
                  </button>
                </form>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <h3 className="font-black">Weekly schedule</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doctor.doctor_schedules?.map((s) => (
                    <span
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold"
                      key={s.weekday}
                    >
                      {days[s.weekday]} {s.start_time.slice(0, 5)}–
                      {s.end_time.slice(0, 5)}
                    </span>
                  ))}
                  {!doctor.doctor_schedules?.length && (
                    <span className="text-sm text-slate-500">
                      No schedule has been added yet.
                    </span>
                  )}
                </div>
                <form
                  action={saveSchedule}
                  className="mt-4 grid gap-3 sm:grid-cols-5"
                >
                  <input type="hidden" name="doctorId" value={doctor.id} />
                  <label className="form-label">
                    Day
                    <select className="field" name="weekday">
                      {days.map((day, index) => (
                        <option key={day} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="form-label">
                    Start time
                    <input
                      className="field"
                      name="startTime"
                      type="time"
                      defaultValue="09:00"
                      required
                    />
                  </label>
                  <label className="form-label">
                    End time
                    <input
                      className="field"
                      name="endTime"
                      type="time"
                      defaultValue="17:00"
                      required
                    />
                  </label>
                  <label className="form-label">
                    Appointment length
                    <select className="field" name="slotMinutes">
                      <option value="15">15 minute</option>
                      <option value="30">30 minute</option>
                      <option value="60">60 minute</option>
                    </select>
                  </label>
                  <button className="button-secondary self-end" type="submit">
                    Save day
                  </button>
                </form>
              </div>
            </article>
          ))}
          {!doctors?.length && (
            <p className="card text-center text-slate-500">
              Add your first doctor to start accepting appointments.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
