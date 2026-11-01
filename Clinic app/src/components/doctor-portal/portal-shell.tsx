"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { doctor } from "@/lib/doctor-portal-data";
import { Icon } from "./icons";

const nav = [
  ["/portal", "Profile", "profile"],
  ["/portal/clinics", "My clinics", "clinics"],
  ["/portal/availability", "Availability", "calendar"],
  ["/portal/appointments", "Appointments", "clock"],
  ["/portal/patients", "Patients", "patients"],
  ["/portal/reviews", "Reviews", "star"],
  ["/portal/settings", "Settings", "settings"],
] as const;

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="doctor-portal min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <Link
          href="/portal"
          className="flex h-20 items-center gap-3 border-b border-slate-100 px-6"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-teal-700 font-black text-white">
            D
          </span>
          <span>
            <b className="block text-lg leading-none">DoctorOne</b>
            <small className="mt-1 block text-xs font-semibold text-slate-500">
              Your practice, wherever you work
            </small>
          </span>
        </Link>
        <div className="m-4 rounded-2xl bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-teal-100 text-sm font-black text-teal-800">
              {doctor.initials}
            </span>
            <span className="min-w-0">
              <b className="block truncate text-sm">{doctor.name}</b>
              <small className="block truncate text-slate-500">
                {doctor.specialty}
              </small>
            </span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Doctor portal">
          {nav.map(([href, label, icon]) => {
            const active =
              href === "/portal"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold ${active ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
              >
                <Icon name={icon} />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="m-3 flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          <Icon name="logout" />
          ClinicBook home
        </Link>
      </aside>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:ml-64 lg:px-8">
        <Link href="/portal" className="flex items-center gap-2 lg:hidden">
          <span className="grid size-9 place-items-center rounded-xl bg-teal-700 font-black text-white">
            D
          </span>
          <b>DoctorOne</b>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button className="portal-icon-button" aria-label="Notifications">
            <Icon name="bell" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500" />
          </button>
          <Link
            href="/portal/settings"
            className="hidden min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 sm:flex"
          >
            <span className="grid size-7 place-items-center rounded-full bg-teal-100 text-[10px] font-black text-teal-800">
              {doctor.initials}
            </span>
            <span className="text-sm font-bold">{doctor.name}</span>
          </Link>
        </div>
      </header>
      <main className="pb-24 lg:ml-64 lg:pb-8">{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white px-1 pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Mobile navigation"
      >
        {nav.slice(0, 5).map(([href, label, icon]) => {
          const active =
            href === "/portal" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold ${active ? "text-teal-700" : "text-slate-500"}`}
            >
              <Icon name={icon} className="size-5" />
              {label === "Availability" ? "Schedule" : label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
