"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[60vh] w-full max-w-xl place-items-center px-4 py-12 text-center">
      <div className="card">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="page-title">We could not load this page</h1>
        <p className="mt-3 text-slate-600">
          Your information is safe. Please try again. If the problem continues,
          contact the clinic.
        </p>
        <button className="button-primary mt-6" onClick={reset} type="button">
          Try again
        </button>
      </div>
    </main>
  );
}
