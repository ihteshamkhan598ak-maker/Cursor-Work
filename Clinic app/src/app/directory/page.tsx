import Link from "next/link";
import { Icon } from "@/components/doctor-portal/icons";
import { directory, doctorAffiliations } from "@/lib/doctor-directory";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; specialty?: string }>;
}) {
  const filters = await searchParams;
  const q = filters.q?.trim().toLowerCase() ?? "";
  const doctors = directory.doctors.filter((doctor) => {
    const clinics = doctorAffiliations(doctor.id)
      .map((item) => item.facility.name)
      .join(" ");
    return (
      (!q ||
        `${doctor.fullName} ${doctor.qualifications ?? ""} ${clinics}`
          .toLowerCase()
          .includes(q)) &&
      (!filters.city || doctor.city === filters.city) &&
      (!filters.specialty || doctor.specialty === filters.specialty)
    );
  });
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="max-w-3xl">
        <p className="portal-eyebrow">Verified research directory</p>
        <h1 className="portal-title">Find a doctor by specialty and city</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Browse 158 public directory profiles from Charsadda and Peshawar.
          These doctors are not available for booking until they claim and
          confirm their profiles.
        </p>
      </div>
      <form className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_280px_auto]">
        <label className="portal-field">
          Doctor or clinic
          <input
            className="portal-input"
            name="q"
            defaultValue={filters.q}
            placeholder="Search name or clinic"
          />
        </label>
        <label className="portal-field">
          City
          <select
            className="portal-input"
            name="city"
            defaultValue={filters.city ?? ""}
          >
            <option value="">Both cities</option>
            <option>Peshawar</option>
            <option>Charsadda</option>
          </select>
        </label>
        <label className="portal-field">
          Specialty
          <select
            className="portal-input"
            name="specialty"
            defaultValue={filters.specialty ?? ""}
          >
            <option value="">All 43 specialties</option>
            {directory.specialties.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
        <button className="portal-button-primary self-end" type="submit">
          Search
        </button>
      </form>
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          <b className="text-slate-950">{doctors.length}</b> directory{" "}
          {doctors.length === 1 ? "profile" : "profiles"}
        </p>
        {(filters.q || filters.city || filters.specialty) && (
          <Link className="text-sm font-bold text-teal-700" href="/directory">
            Clear filters
          </Link>
        )}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => {
          const affiliations = doctorAffiliations(doctor.id);
          return (
            <article className="portal-card flex flex-col" key={doctor.id}>
              <div className="flex items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-100 font-black text-teal-800">
                  {doctor.fullName
                    .replace(
                      /^(Prof\.|Asst\.|Assist\.|Assoc\.|Asso\.|Dr\.)\s*/g,
                      "",
                    )
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <h2 className="text-lg leading-6 font-black">
                    {doctor.fullName}
                  </h2>
                  <p className="mt-1 font-bold text-teal-700">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
              <p className="mt-4 min-h-5 text-sm text-slate-600">
                {doctor.qualifications ?? "Qualifications: To confirm"}
              </p>
              <div className="mt-4 space-y-2">
                {affiliations.slice(0, 2).map((a) => (
                  <Link
                    key={a.id}
                    href={`/directory/facilities/${a.facility.id}`}
                    className="flex items-start gap-2 text-sm text-slate-600 hover:text-teal-800"
                  >
                    <Icon name="clinics" className="mt-0.5 size-4 shrink-0" />
                    <span>{a.facility.name}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">
                  Not yet joined
                </span>
                <Link
                  className="font-bold text-teal-700"
                  href={`/directory/doctors/${doctor.id}`}
                >
                  View profile →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {!doctors.length && (
        <div className="portal-card mt-5 py-12 text-center">
          <h2 className="text-lg font-black">No matching doctors</h2>
          <p className="mt-2 text-slate-500">
            Try another city, specialty, or spelling.
          </p>
        </div>
      )}
    </main>
  );
}
