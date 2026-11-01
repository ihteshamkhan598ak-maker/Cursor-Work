import { Icon } from "./icons";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="portal-eyebrow">{eyebrow}</p>
        <h1 className="portal-title">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function Avatar({
  initials,
  large = false,
}: {
  initials: string;
  large?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-teal-100 font-black text-teal-800 ${large ? "size-24 text-2xl" : "size-11 text-sm"}`}
    >
      {initials}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800">
      <Icon name="check" className="size-3.5" />
      Verified doctor
    </span>
  );
}

export function Stars({ value = 5 }: { value?: number }) {
  return (
    <span
      className="inline-flex text-amber-500"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          className={`size-4 ${i < value ? "fill-current" : "text-slate-200"}`}
        />
      ))}
    </span>
  );
}

export function Status({ children }: { children: string }) {
  const styles: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700",
    Waiting: "bg-amber-50 text-amber-800",
    Pending: "bg-blue-50 text-blue-700",
    Completed: "bg-slate-100 text-slate-700",
    Cancelled: "bg-red-50 text-red-700",
    Current: "bg-emerald-50 text-emerald-700",
    Past: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[children] ?? styles.Past}`}
    >
      {children}
    </span>
  );
}
