import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-black tracking-tight text-teal-800"
        >
          ClinicBook
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link
            href="/#product"
            className="hidden rounded-xl px-3 py-2 hover:bg-slate-100 sm:block"
          >
            Home
          </Link>
          <Link
            href="/directory"
            className="rounded-xl px-3 py-2 text-teal-800 hover:bg-teal-50"
          >
            Doctor directory
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 px-3 py-2 hover:border-teal-700"
          >
            Clinic login
          </Link>
        </nav>
      </div>
    </header>
  );
}
