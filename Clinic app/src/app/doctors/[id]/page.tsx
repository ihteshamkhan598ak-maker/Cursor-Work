import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public-server";
import { BookingForm } from "@/components/booking-form";
import { SiteHeader } from "@/components/site-header";

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

export const instant = false;

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createPublicClient();
  const [{ data: doctor }, { data: schedules }] = await Promise.all([
    supabase
      .from("doctors")
      .select(
        "id, name, specialty, qualifications, fee_pkr, clinics(name, address, phone)",
      )
      .eq("id", id)
      .eq("active", true)
      .maybeSingle(),
    supabase
      .from("doctor_schedules")
      .select("weekday, start_time, end_time, slot_minutes")
      .eq("doctor_id", id)
      .order("weekday"),
  ]);
  if (!doctor) notFound();
  const clinic = Array.isArray(doctor.clinics)
    ? doctor.clinics[0]
    : doctor.clinics;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_420px]">
        <section>
          <Link
            href="/find-doctor"
            className="text-sm font-semibold text-teal-700"
          >
            &larr; Back to doctors
          </Link>
          <div className="mt-5 rounded-3xl bg-teal-950 p-8 text-white">
            <p className="text-sm font-bold tracking-wider text-teal-200 uppercase">
              {specialtyLabels[doctor.specialty] ?? doctor.specialty}
            </p>
            <h1 className="mt-2 text-4xl font-black">Dr. {doctor.name}</h1>
            <p className="mt-3 text-teal-50">
              {doctor.qualifications || "Experienced doctor"}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-6">
              <div>
                <p className="text-xs text-teal-200">Consultation fee</p>
                <p className="mt-1 text-xl font-black">
                  Rs. {doctor.fee_pkr?.toLocaleString() ?? "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs text-teal-200">Clinic</p>
                <p className="mt-1 font-bold">{clinic?.name}</p>
              </div>
            </div>
          </div>
          <div className="card mt-6">
            <h2 className="text-xl font-black">Weekly schedule</h2>
            <div className="mt-4 divide-y">
              {schedules?.map((s) => (
                <div className="flex justify-between py-3" key={s.weekday}>
                  <span className="font-semibold">{days[s.weekday]}</span>
                  <span className="text-slate-600">
                    {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)} ·{" "}
                    {s.slot_minutes} minute
                  </span>
                </div>
              ))}
              {!schedules?.length && (
                <p className="py-4 text-slate-500">
                  This doctor&apos;s schedule has not been added yet.
                </p>
              )}
            </div>
          </div>
          <div className="card mt-6">
            <h2 className="text-lg font-black">Clinic address</h2>
            <p className="mt-2 text-slate-600">{clinic?.address}</p>
            <p className="mt-1 text-slate-600">{clinic?.phone}</p>
          </div>
        </section>
        <aside>
          <div className="sticky top-6">
            <h2 className="mb-4 text-2xl font-black">Request an appointment</h2>
            <BookingForm doctorId={doctor.id} schedules={schedules ?? []} />
          </div>
        </aside>
      </main>
    </>
  );
}
