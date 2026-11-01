"use client";
import { useState } from "react";
import { Avatar, PageHeader } from "@/components/doctor-portal/ui";
import { patients } from "@/lib/doctor-portal-data";

export default function PatientsPage() {
  const [selected, setSelected] = useState(patients[0]);
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Patient records"
        title="Patients"
        description="Your patient list and visit history remain with your doctor account across clinics."
      />
      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <section className="portal-card p-0">
          <div className="border-b border-slate-100 p-4">
            <label className="sr-only" htmlFor="patient-search">
              Search patients
            </label>
            <input
              id="patient-search"
              className="portal-input"
              placeholder="Search by patient name or phone"
            />
          </div>
          <div className="divide-y divide-slate-100">
            {patients.map((p) => (
              <button
                onClick={() => setSelected(p)}
                key={p.name}
                className={`flex min-h-20 w-full items-center gap-3 p-4 text-left hover:bg-slate-50 ${selected.name === p.name ? "bg-teal-50/70" : ""}`}
              >
                <Avatar initials={p.initials} />
                <span className="min-w-0 flex-1">
                  <b className="block truncate">{p.name}</b>
                  <small className="block truncate text-slate-500">
                    {p.condition} · {p.visits} visits
                  </small>
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {p.last}
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="portal-card">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <Avatar initials={selected.initials} large />
            <div>
              <h2 className="text-xl font-black">{selected.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selected.age} years · {selected.phone}
              </p>
              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                {selected.condition}
              </span>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black">Visit history</h3>
              <button className="portal-button-secondary">Add note</button>
            </div>
            <ol className="mt-4 space-y-4">
              {selected.history.map((h) => (
                <li
                  key={h}
                  className="relative pl-6 text-sm text-slate-700 before:absolute before:top-1 before:left-0 before:size-3 before:rounded-full before:border-2 before:border-teal-700 after:absolute after:top-4 after:left-[5px] after:h-[calc(100%+4px)] after:w-px after:bg-slate-200 last:after:hidden"
                >
                  <b>{h}</b>
                  <p className="mt-1 text-slate-500">
                    Consultation record saved to your private patient history.
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
