import { Icon } from "@/components/doctor-portal/icons";
import { PageHeader } from "@/components/doctor-portal/ui";
import { week } from "@/lib/doctor-portal-data";

export default function AvailabilityPage() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Working hours"
        title="Availability & schedule"
        description="Set different hours for each clinic and block leave days before patients book."
        action={<button className="portal-button-primary">Save changes</button>}
      />
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="portal-card">
          <div className="portal-section-head">
            <div>
              <h2>Weekly schedule</h2>
              <p>30-minute appointments · Asia/Karachi</p>
            </div>
            <button className="portal-button-secondary">Edit hours</button>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {week.map((d) => (
              <div
                key={d.day}
                className="grid gap-2 py-4 sm:grid-cols-[110px_1fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-2 rounded-full ${d.active ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                  <b>{d.day}</b>
                </div>
                <div>
                  <p
                    className={`font-semibold ${d.active ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {d.clinic}
                  </p>
                  <p className="text-sm text-slate-500">{d.time}</p>
                </div>
                <span
                  className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${d.active ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-500"}`}
                >
                  {d.slots}
                </span>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-5">
          <section className="portal-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Leave days</h2>
              <button className="portal-icon-button" aria-label="Add leave day">
                <Icon name="plus" />
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <b className="block">9–11 November 2026</b>
              <p className="mt-1 text-sm text-slate-500">
                Family event · All clinics
              </p>
            </div>
            <button className="portal-button-secondary mt-4 w-full">
              <Icon name="plus" />
              Add leave
            </button>
          </section>
          <section className="portal-card">
            <h2 className="text-lg font-black">Booking rules</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Appointment length</dt>
                <dd className="font-bold">30 minutes</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Book ahead</dt>
                <dd className="font-bold">30 days</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Notice required</dt>
                <dd className="font-bold">2 hours</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
