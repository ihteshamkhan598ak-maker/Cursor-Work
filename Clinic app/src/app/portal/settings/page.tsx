import { PageHeader } from "@/components/doctor-portal/ui";
import { doctor } from "@/lib/doctor-portal-data";

const Toggle = ({
  label,
  help,
  on = true,
}: {
  label: string;
  help: string;
  on?: boolean;
}) => (
  <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
    <span>
      <b className="block text-sm">{label}</b>
      <small className="mt-1 block text-slate-500">{help}</small>
    </span>
    <input
      type="checkbox"
      defaultChecked={on}
      className="size-5 accent-teal-700"
    />
  </label>
);
export default function SettingsPage() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Account preferences"
        title="Settings"
        description="Keep your public details accurate and choose how you receive appointment updates."
        action={<button className="portal-button-primary">Save changes</button>}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="portal-card">
          <h2 className="text-lg font-black">Profile information</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="portal-field">
              Full name
              <input className="portal-input" defaultValue={doctor.name} />
            </label>
            <label className="portal-field">
              Specialty
              <input className="portal-input" defaultValue={doctor.specialty} />
            </label>
            <label className="portal-field sm:col-span-2">
              Qualifications
              <input
                className="portal-input"
                defaultValue={doctor.qualifications}
              />
            </label>
            <label className="portal-field">
              Consultation fee (PKR)
              <input
                className="portal-input"
                type="number"
                defaultValue="2500"
              />
            </label>
            <label className="portal-field">
              Years of experience
              <input className="portal-input" type="number" defaultValue="12" />
            </label>
            <label className="portal-field sm:col-span-2">
              About you
              <textarea
                className="portal-input min-h-28"
                defaultValue={doctor.bio}
              />
            </label>
          </div>
        </section>
        <div className="space-y-5">
          <section className="portal-card">
            <h2 className="text-lg font-black">Languages</h2>
            <p className="mt-1 text-sm text-slate-500">
              Patients can filter doctors by spoken language.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.languages.map((l) => (
                <button
                  key={l}
                  className="rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800"
                >
                  {l} ×
                </button>
              ))}
              <button className="rounded-full border border-dashed border-slate-300 px-3 py-2 text-sm font-bold text-slate-600">
                + Add language
              </button>
            </div>
          </section>
          <section className="portal-card">
            <h2 className="text-lg font-black">Notifications</h2>
            <div className="mt-2">
              <Toggle
                label="New appointment"
                help="Alert me when a patient books."
              />
              <Toggle
                label="Cancellation"
                help="Alert me when an appointment is cancelled."
              />
              <Toggle
                label="Daily schedule reminder"
                help="Send my schedule every morning at 8:00 AM."
              />
              <Toggle
                label="Review received"
                help="Alert me when a patient leaves a review."
                on={false}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
