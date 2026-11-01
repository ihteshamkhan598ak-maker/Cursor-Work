import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/doctor-portal/icons";
import { directory, facilityDoctors } from "@/lib/doctor-directory";

export function generateStaticParams() {
  return directory.facilities.map((facility) => ({ id: facility.id }));
}
export default async function FacilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const facility = directory.facilities.find((item) => item.id === id);
  if (!facility) notFound();
  const doctors = facilityDoctors(facility.id);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/directory" className="text-sm font-bold text-teal-700">
        ← Back to doctor search
      </Link>
      <section className="portal-card mt-5">
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-800">
            <Icon name="clinics" className="size-7" />
          </span>
          <div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 capitalize">
              {facility.typeLabel}
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              {facility.name}
            </h1>
            <p className="mt-2 flex items-start gap-2 text-slate-600">
              <Icon name="pin" className="mt-0.5 size-5 shrink-0" />
              {facility.address ?? "Address not published"}
            </p>
            <a
              className="mt-3 inline-flex text-xs font-bold text-teal-700 underline"
              href={facility.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              View facility source
            </a>
          </div>
        </div>
      </section>
      <div className="mt-7 flex items-end justify-between">
        <div>
          <p className="portal-eyebrow">Public directory records</p>
          <h2 className="text-2xl font-black">
            Doctors listed at this facility
          </h2>
        </div>
        <span className="text-sm font-bold text-slate-500">
          {doctors.length} {doctors.length === 1 ? "doctor" : "doctors"}
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {doctors.map(({ doctor, status }) => (
          <article className="portal-card" key={doctor.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">{doctor.fullName}</h3>
                <p className="mt-1 font-bold text-teal-700">
                  {doctor.specialty}
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900">
                Not joined
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {doctor.qualifications ?? "Qualifications: To confirm"}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-500 capitalize">
                {status} affiliation
              </span>
              <Link
                className="font-bold text-teal-700"
                href={`/directory/doctors/${doctor.id}`}
              >
                View profile →
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!doctors.length && (
        <div className="portal-card mt-4 text-center text-slate-500">
          No named doctors were published for this facility in the source file.
        </div>
      )}
    </main>
  );
}
