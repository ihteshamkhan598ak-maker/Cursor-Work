"use client";
import { useState } from "react";
import { Avatar, PageHeader, Status } from "@/components/doctor-portal/ui";
import { appointments } from "@/lib/doctor-portal-data";

const tabs = ["Today", "Upcoming", "Past"];
export default function AppointmentsPage() {
  const [tab, setTab] = useState("Today");
  const shown = appointments.filter((a) =>
    tab === "Today"
      ? a.day === "Today"
      : tab === "Upcoming"
        ? ["Tomorrow", "31 Oct"].includes(a.day)
        : a.day === "Past",
  );
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Consultations"
        title="Appointments"
        description="Every visit stays in your history with the clinic where it took place."
        action={
          <button className="portal-button-primary">Add appointment</button>
        }
      />
      <div className="portal-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={tab === t ? "active" : ""}
            key={t}
          >
            {t}
            {t === "Today" && <span>3</span>}
          </button>
        ))}
      </div>
      <section className="portal-card mt-5 p-0">
        <div className="divide-y divide-slate-100">
          {shown.length ? (
            shown.map((a) => (
              <article
                key={a.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar initials={a.initials} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-black">{a.patient}</h2>
                      <Status>{a.status}</Status>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-600">
                      {a.date} · {a.time} · {a.clinic}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{a.reason}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-xs font-bold text-slate-500">
                    {a.wait}
                  </span>
                  <button className="portal-button-secondary">
                    View details
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="p-10 text-center">
              <b>No appointments here</b>
              <p className="mt-1 text-sm text-slate-500">
                New bookings will appear automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
