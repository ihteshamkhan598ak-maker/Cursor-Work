export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12" aria-live="polite">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="h-48 animate-pulse rounded-3xl bg-white" key={item} />
        ))}
      </div>
      <span className="sr-only">Loading page</span>
    </main>
  );
}
