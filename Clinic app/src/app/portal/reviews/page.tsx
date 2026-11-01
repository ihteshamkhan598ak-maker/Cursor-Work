import { Icon } from "@/components/doctor-portal/icons";
import { PageHeader, Stars } from "@/components/doctor-portal/ui";
import { doctor, reviews } from "@/lib/doctor-portal-data";

export default function ReviewsPage() {
  return (
    <div className="portal-page">
      <PageHeader
        eyebrow="Patient feedback"
        title="Reviews"
        description="Verified reviews belong to your profile and remain visible when your clinic changes."
      />
      <div className="grid gap-5 xl:grid-cols-[.65fr_1.35fr]">
        <section className="portal-card h-fit text-center">
          <p className="text-5xl font-black">{doctor.rating}</p>
          <div className="mt-2 flex justify-center">
            <Stars />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Based on {doctor.reviewCount} verified reviews
          </p>
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((n, i) => (
              <div key={n} className="flex items-center gap-2 text-xs">
                <span className="w-3">{n}</span>
                <Icon
                  name="star"
                  className="size-3 fill-amber-500 text-amber-500"
                />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${[82, 13, 3, 1, 1][i]}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-500">
                  {[82, 13, 3, 1, 1][i]}%
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          {reviews.map((r) => (
            <article key={r.patient + r.date} className="portal-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <b>{r.patient}</b>
                  <div className="mt-1">
                    <Stars value={r.rating} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {r.date}
                </span>
              </div>
              <p className="mt-4 leading-7 text-slate-700">“{r.text}”</p>
              <p className="mt-4 text-xs font-semibold text-slate-500">
                Verified appointment · {r.clinic}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
