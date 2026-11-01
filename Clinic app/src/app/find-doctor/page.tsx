import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public-server";

const labels: Record<string, string> = {
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

export default async function FindDoctorPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string }>;
}) {
  const { specialty } = await searchParams;
  const supabase = createPublicClient();
  let query = supabase
    .from("doctors")
    .select(
      "id, name, specialty, qualifications, fee_pkr, clinics(name, address)",
    )
    .eq("active", true)
    .order("name")
    .limit(60);
  if (specialty) query = query.eq("specialty", specialty);
  const { data: doctors, error } = await query;

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-black text-teal-800">
            ClinicBook
          </Link>
          <Link href="/login" className="button-secondary">
            Clinic login
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Clinics in Charsadda</p>
            <h1 className="page-title">Choose a doctor</h1>
            <p className="mt-2 text-slate-600">
              View the doctor&apos;s fee and clinic, then choose an appointment
              time.
            </p>
          </div>
          <form className="flex gap-2">
            <label className="sr-only" htmlFor="specialty-filter">
              Filter doctors by specialty
            </label>
            <select
              id="specialty-filter"
              className="field mt-0 min-w-52"
              name="specialty"
              defaultValue={specialty ?? ""}
            >
              <option value="">All specialties</option>
              {Object.entries(labels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
            <button className="button-secondary" type="submit">
              Search
            </button>
          </form>
        </div>
        {error && (
          <p className="mt-8 rounded-2xl bg-red-50 p-5 text-red-700">
            Doctors could not be loaded. Please refresh the page.
          </p>
        )}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {doctors?.map((doctor) => {
            const clinic = Array.isArray(doctor.clinics)
              ? doctor.clinics[0]
              : doctor.clinics;
            return (
              <article className="card flex flex-col" key={doctor.id}>
                <div className="grid size-14 place-items-center rounded-2xl bg-teal-100 font-black text-teal-800">
                  Dr
                </div>
                <h2 className="mt-5 text-xl font-black">Dr. {doctor.name}</h2>
                <p className="mt-1 font-bold text-teal-700">
                  {labels[doctor.specialty] ?? doctor.specialty}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  {doctor.qualifications}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {clinic?.name} · {clinic?.address}
                </p>
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <strong>Rs. {doctor.fee_pkr?.toLocaleString()}</strong>
                  <Link
                    className="button-primary"
                    href={`/doctors/${doctor.id}`}
                  >
                    View available times
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        {!error && !doctors?.length && (
          <p className="card mt-8 text-center text-slate-500">
            No doctors are currently available.
          </p>
        )}
      </section>
    </main>
  );
}
