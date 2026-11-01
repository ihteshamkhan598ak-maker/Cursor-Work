import Link from "next/link";

export default function DirectoryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/directory" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-teal-700 font-black text-white">
              D
            </span>
            <span>
              <b className="block leading-none">Doctor Directory</b>
              <small className="hidden text-xs text-slate-500 sm:block">
                Charsadda & Peshawar
              </small>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-bold">
            <Link
              className="rounded-xl px-3 py-2 hover:bg-slate-100"
              href="/directory"
            >
              Find doctors
            </Link>
            <Link
              className="rounded-xl border border-slate-300 px-3 py-2 hover:border-teal-700"
              href="/portal"
            >
              Doctor portal
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
