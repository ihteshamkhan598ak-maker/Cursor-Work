import { Icon } from "@/components/doctor-portal/icons";
import { PageHeader, Status } from "@/components/doctor-portal/ui";
import { clinics } from "@/lib/doctor-portal-data";

export default function ClinicsPage() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Affiliations"
        title="My clinics"
        description="Work at more than one clinic while your profile, patients, and history remain yours."
        action={
          <button className="portal-button-primary">
            <Icon name="plus" />
            Join a clinic
          </button>
        }
      />
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        <b>Your data moves with you.</b> Leaving a clinic removes you from its
        active list, but your past appointments keep that clinic’s name.
      </div>
      <div className="mt-5 space-y-4">
        {clinics.map((c) => (
          <article className="portal-card" key={c.name}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-800">
                <Icon name="clinics" className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black">{c.name}</h2>
                  <Status>{c.state}</Status>
                  {c.primary && (
                    <span className="rounded-full bg-teal-700 px-2.5 py-1 text-xs font-bold text-white">
                      Primary clinic
                    </span>
                  )}
                </div>
                <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                  <Icon name="pin" className="mt-0.5 size-4 shrink-0" />
                  {c.address}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="clock" className="size-4" />
                  {c.schedule}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {c.state === "Current" && (
                  <>
                    {!c.primary && (
                      <button className="portal-button-secondary">
                        Make primary
                      </button>
                    )}
                    <button className="portal-button-quiet">
                      Leave clinic
                    </button>
                  </>
                )}{" "}
                {c.state === "Past" && (
                  <button className="portal-button-secondary">
                    View history
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
