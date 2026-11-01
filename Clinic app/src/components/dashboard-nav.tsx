import Link from "next/link";
import { logout } from "@/app/(clinic)/auth-actions";

export function DashboardNav({ clinicName }: { clinicName: string }) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
        <Link href="/dashboard" className="mr-auto">
          <span className="block text-xs font-bold tracking-wider text-teal-700 uppercase">
            ClinicBook
          </span>
          <span className="font-black">{clinicName}</span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm font-semibold">
          <Link className="nav-link" href="/dashboard">
            Overview
          </Link>
          <Link className="nav-link" href="/appointments">
            Appointments
          </Link>
          <Link className="nav-link" href="/doctors">
            Doctors
          </Link>
          <Link className="nav-link" href="/settings">
            Settings
          </Link>
        </nav>
        <form action={logout}>
          <button
            className="ml-2 rounded-xl border px-3 py-2 text-sm font-semibold"
            type="submit"
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
