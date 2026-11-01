import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="eyebrow">Privacy notice</p>
        <h1 className="page-title">How ClinicBook uses your information</h1>
        <div className="card mt-8 space-y-6 leading-7 text-slate-700">
          <section>
            <h2 className="text-lg font-black text-slate-950">
              Information we collect
            </h2>
            <p className="mt-2">
              When you request an appointment, we collect your name, mobile
              number, chosen doctor, date, time, and any note you provide.
              Clinic owners also provide their email address and clinic details
              when creating an account.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-black text-slate-950">Why we use it</h2>
            <p className="mt-2">
              We use this information to send your request to the clinic, manage
              the appointment, and send appointment updates.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-black text-slate-950">
              Who can see it
            </h2>
            <p className="mt-2">
              Only the clinic responsible for your appointment can view your
              patient details. Public visitors can only see clinic, doctor, fee,
              and schedule information.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-black text-slate-950">Your choices</h2>
            <p className="mt-2">
              Do not include sensitive medical information in the optional note.
              Contact the clinic directly to ask about correcting or deleting
              your appointment information.
            </p>
          </section>
          <p className="text-sm text-slate-500">
            Last updated: 28 October 2026
          </p>
        </div>
        <Link className="button-secondary mt-6" href="/find-doctor">
          Back to doctors
        </Link>
      </main>
    </>
  );
}
