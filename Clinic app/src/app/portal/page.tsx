import Link from "next/link";
import {
  Avatar,
  PageHeader,
  Stars,
  Status,
  VerifiedBadge,
} from "@/components/doctor-portal/ui";
import { appointments, doctor } from "@/lib/doctor-portal-data";

export default function DoctorProfilePage() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Doctor profile"
        title="Your practice at a glance"
        description="This profile belongs to you and stays with you when you join or leave a clinic."
        action={
          <Link className="portal-button-secondary" href="/portal/settings">
            Edit profile
          </Link>
        }
      />
      <section className="portal-card overflow-hidden p-0">
        <div className="h-24 bg-teal-800 sm:h-32" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="rounded-full border-4 border-white">
                <Avatar initials={doctor.initials} large />
              </span>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                    {doctor.name}
                  </h2>
                  <VerifiedBadge />
                </div>
                <p className="mt-1 font-semibold text-teal-800">
                  {doctor.specialty}
                </p>
              </div>
            </div>
            <button className="portal-button-primary">
              View public profile
            </button>
          </div>
          <div className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="portal-label">Qualifications</span>
              <b className="mt-1 block">{doctor.qualifications}</b>
            </div>
            <div>
              <span className="portal-label">Experience</span>
              <b className="mt-1 block">{doctor.experience}</b>
            </div>
            <div>
              <span className="portal-label">Consultation fee</span>
              <b className="mt-1 block">{doctor.fee}</b>
            </div>
            <div>
              <span className="portal-label">Patient rating</span>
              <div className="mt-1 flex items-center gap-2">
                <b>{doctor.rating}</b>
                <Stars />
                <span className="text-sm text-slate-500">
                  ({doctor.reviewCount})
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <section className="portal-card">
          <div className="portal-section-head">
            <div>
              <h2>Today’s appointments</h2>
              <p>Wednesday, 28 October</p>
            </div>
            <Link href="/portal/appointments">View all</Link>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {appointments.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-4">
                <Avatar initials={a.initials} />
                <div className="min-w-0 flex-1">
                  <b className="block truncate">{a.patient}</b>
                  <p className="truncate text-sm text-slate-500">
                    {a.time} · {a.clinic}
                  </p>
                </div>
                <Status>{a.status}</Status>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-5">
          <section className="portal-card">
            <p className="portal-label">Next session</p>
            <h2 className="mt-2 text-lg font-black">Northwest Heart Centre</h2>
            <p className="mt-1 text-sm text-slate-600">
              Today · 10:00 AM–1:00 PM
            </p>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-50 p-3 text-sm">
              <b className="text-amber-900">2 slots left</b>
              <span className="text-amber-800">12 patients</span>
            </div>
          </section>
          <section className="portal-card">
            <p className="portal-label">Your profile</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl font-black">92%</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[92%] rounded-full bg-teal-700" />
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Add your PMDC registration document to complete your profile.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
