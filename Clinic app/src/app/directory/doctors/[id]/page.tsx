import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/doctor-portal/icons";
import {
  directory,
  displayFee,
  doctorAffiliations,
} from "@/lib/doctor-directory";

export function generateStaticParams() {
  return directory.doctors.map((doctor) => ({ id: doctor.id }));
}
export default async function DirectoryDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = directory.doctors.find((item) => item.id === id);
  if (!doctor) notFound();
  const affiliations = doctorAffiliations(doctor.id);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/directory" className="text-sm font-bold text-teal-700">
        ← Back to doctor search
      </Link>
      <section className="portal-card mt-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-teal-100 text-2xl font-black text-teal-800">
            {doctor.fullName
              .replace(/^(Prof\.|Asst\.|Assist\.|Assoc\.|Asso\.|Dr\.)\s*/g, "")
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">
              Directory listing — not yet joined
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              {doctor.fullName}
            </h1>
            <p className="mt-1 text-lg font-bold text-teal-700">
              {doctor.specialty}
            </p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="portal-label">Qualifications</dt>
                <dd className="mt-1 font-semibold">
                  {doctor.qualifications ?? "To confirm"}
                </dd>
              </div>
              <div>
                <dt className="portal-label">City</dt>
                <dd className="mt-1 font-semibold">{doctor.city}</dd>
              </div>
            </dl>
          </div>
          <Link
            href={`/portal/settings?claim=${doctor.id}`}
            className="portal-button-primary shrink-0"
          >
            Claim this profile
          </Link>
        </div>
      </section>
      <div className="mt-5">
        <h2 className="text-xl font-black">Published clinic affiliations</h2>
        <p className="mt-1 text-sm text-slate-600">
          Details below come only from the cited public source and still require
          confirmation by the doctor.
        </p>
        <div className="mt-4 space-y-4">
          {affiliations.map((a) => {
            const fee = displayFee(a);
            return (
              <article className="portal-card" key={a.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon name="clinics" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/directory/facilities/${a.facility.id}`}
                        className="text-lg font-black hover:text-teal-700"
                      >
                        {a.facility.name}
                      </Link>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 capitalize">
                        {a.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {a.facility.city} · {a.facility.typeLabel}
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <span className="portal-label">Published timings</span>
                        <p className="mt-1 font-semibold">
                          {a.timings ?? "To confirm"}
                        </p>
                      </div>
                      <div>
                        <span className="portal-label">Published fee</span>
                        <p className="mt-1 font-semibold">
                          {fee.text}
                          {fee.unverified && (
                            <span className="ml-2 rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
                              Unverified conflict
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <a
                      className="mt-4 inline-flex text-xs font-bold text-teal-700 underline"
                      href={a.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View public source
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
        <b>Booking is not open for this profile.</b> The doctor must claim the
        profile and confirm clinics, fees, and timings before patients can book.
      </aside>
    </main>
  );
}
