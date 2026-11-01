import Link from "next/link";

const steps = [
  {
    number: "1",
    who: "Patient",
    title: "Choose a doctor and time",
    text: "The patient opens the clinic link, chooses a doctor, date, and available time, then submits a request.",
  },
  {
    number: "2",
    who: "Clinic",
    title: "The request appears on the dashboard",
    text: "Reception can see the patient's name, phone number, doctor, and appointment time in one place.",
  },
  {
    number: "3",
    who: "System",
    title: "The patient receives an update",
    text: "The clinic confirms or cancels the request, and the patient receives a WhatsApp update.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4">
          <strong className="text-xl font-black text-teal-800">
            ClinicBook
          </strong>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-xl px-4 py-2 text-sm font-bold text-teal-800 sm:block"
              href="/portal"
            >
              Doctor app
            </Link>
            <Link
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold"
              href="/login"
            >
              Clinic login
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:min-h-[650px] lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <span className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-sm font-black text-teal-800">
            Clinic appointment system
          </span>
          <h1 className="mt-6 text-5xl leading-[1.02] font-black tracking-[-.045em] sm:text-7xl">
            Stop managing appointments through calls and WhatsApp chats.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            <strong className="text-slate-950">
              Patients request appointments online.
            </strong>{" "}
            Your clinic confirms them from one simple dashboard.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary px-7" href="/directory">
              Search doctor directory
            </Link>
            <Link className="button-secondary px-7" href="/signup">
              Register your clinic
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
          <p className="text-xs font-black tracking-[.2em] text-teal-300 uppercase">
            Today&apos;s clinic dashboard
          </p>
          <div className="mt-5 flex items-end justify-between border-b border-white/10 pb-5">
            <div>
              <strong className="text-5xl">12</strong>
              <p className="mt-1 text-slate-400">kul appointments</p>
            </div>
            <div className="rounded-2xl bg-amber-400/15 px-4 py-3 text-right">
              <strong className="text-2xl text-amber-300">4</strong>
              <p className="text-xs text-amber-100">awaiting confirmation</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["09:00", "Amina Khan", "Confirm"],
              ["09:30", "Usman Ali", "Confirm now"],
              ["10:00", "Hira Noor", "Confirm"],
            ].map(([time, name, status]) => (
              <div
                className="flex items-center gap-4 rounded-2xl bg-white/7 p-4"
                key={time}
              >
                <strong className="text-teal-300">{time}</strong>
                <span className="flex-1 font-bold">{name}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${status === "Confirm" ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400 text-slate-950"}`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">How does it work?</p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Just three simple steps
            </h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                className="rounded-3xl border border-slate-200 p-7"
                key={step.number}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full bg-teal-800 text-lg font-black text-white">
                    {step.number}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black tracking-wider text-slate-600 uppercase">
                    {step.who}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-black">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-[2rem] bg-teal-900 px-6 py-12 text-center text-white sm:px-12">
          <p className="text-sm font-bold text-teal-200">
            Want to see how it works first?
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black">
            Choose a doctor and submit an appointment request online.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-teal-50/75">
            No patient account required. Just enter your name, number, and
            preferred time.
          </p>
          <Link
            className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-white px-7 font-black text-teal-950"
            href="/find-doctor"
          >
            View doctors and available times
          </Link>
        </div>
      </section>

      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">
        ClinicBook - patient booking and clinic management in one place. ·{" "}
        <Link className="font-semibold underline" href="/privacy">
          Privacy
        </Link>
      </footer>
    </main>
  );
}
