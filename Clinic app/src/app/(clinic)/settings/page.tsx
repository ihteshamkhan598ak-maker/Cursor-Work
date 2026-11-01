import { requireClinic } from "@/lib/clinic/auth";
import { DashboardNav } from "@/components/dashboard-nav";
import { updateClinic } from "../actions";

export const instant = false;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const feedback = await searchParams;
  const { clinic } = await requireClinic();
  return (
    <>
      <DashboardNav clinicName={clinic.name} />
      <main className="dashboard-shell">
        <div>
          <p className="eyebrow">Clinic information</p>
          <h1 className="page-title">Clinic setting</h1>
        </div>
        <section className="card mt-8 max-w-2xl">
          {(feedback.error || feedback.message) && (
            <p
              className={`mb-5 rounded-xl p-3 ${feedback.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
            >
              {feedback.error ?? feedback.message}
            </p>
          )}
          <form action={updateClinic} className="space-y-5">
            <label className="form-label">
              Clinic name
              <input
                className="field"
                name="name"
                defaultValue={clinic.name}
                required
              />
            </label>
            <label className="form-label">
              Clinic address
              <input
                className="field"
                name="address"
                defaultValue={clinic.address}
                required
              />
            </label>
            <label className="form-label">
              Phone number
              <input
                className="field"
                name="phone"
                defaultValue={clinic.phone}
                required
              />
            </label>
            <button className="button-primary" type="submit">
              Save changes
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
