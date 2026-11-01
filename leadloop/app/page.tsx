"use client";

import { FormEvent, useEffect, useState } from "react";
import { Icon } from "@/components/icon";

type Stage =
  "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Won" | "Lost";
type View = "dashboard" | "leads" | "reminders" | "settings";
type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stage: Stage;
  value: number;
  followUp: string;
  notes: string;
  archived: boolean;
  createdAt: string;
};

const stages: Stage[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];
const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Ayesha Malik",
    company: "Bloom Studio",
    email: "ayesha@bloom.pk",
    phone: "+92 300 1234567",
    source: "Referral",
    stage: "Qualified",
    value: 180000,
    followUp: "2026-10-20",
    notes: "Interested in a three-month social media retainer.",
    archived: false,
    createdAt: "2026-10-20",
  },
  {
    id: "2",
    name: "Hamza Ali",
    company: "Northstar Foods",
    email: "hamza@northstar.pk",
    phone: "+92 321 8877441",
    source: "Website",
    stage: "Proposal Sent",
    value: 275000,
    followUp: "2026-10-21",
    notes: "Proposal sent for brand launch campaign.",
    archived: false,
    createdAt: "2026-10-19",
  },
  {
    id: "3",
    name: "Sara Ahmed",
    company: "Sage Interiors",
    email: "sara@sage.pk",
    phone: "+92 333 4488110",
    source: "WhatsApp",
    stage: "Contacted",
    value: 95000,
    followUp: "2026-10-23",
    notes: "Follow up after internal budget discussion.",
    archived: false,
    createdAt: "2026-10-18",
  },
  {
    id: "4",
    name: "Usman Raza",
    company: "Raza Dental",
    email: "usman@razadental.pk",
    phone: "+92 301 5544332",
    source: "Facebook",
    stage: "New",
    value: 65000,
    followUp: "",
    notes: "Asked about local SEO services.",
    archived: false,
    createdAt: "2026-10-21",
  },
  {
    id: "5",
    name: "Mariam Khan",
    company: "Little Loom",
    email: "mariam@littleloom.pk",
    phone: "+92 312 9900112",
    source: "Referral",
    stage: "Won",
    value: 220000,
    followUp: "",
    notes: "Signed six-month content package.",
    archived: false,
    createdAt: "2026-10-16",
  },
  {
    id: "6",
    name: "Bilal Qureshi",
    company: "Velocity Auto",
    email: "bilal@velocity.pk",
    phone: "+92 345 6677889",
    source: "Other",
    stage: "Lost",
    value: 120000,
    followUp: "",
    notes: "Chose another agency.",
    archived: false,
    createdAt: "2026-10-14",
  },
];

const stageStyle: Record<Stage, string> = {
  New: "bg-slate-100 text-slate-700",
  Contacted: "bg-blue-50 text-blue-700",
  Qualified: "bg-indigo-50 text-indigo-700",
  "Proposal Sent": "bg-purple-50 text-purple-700",
  Won: "bg-green-50 text-green-700",
  Lost: "bg-slate-100 text-slate-500",
};
const today = "2026-10-21";

function daysBetween(date: string) {
  return Math.round(
    (new Date(today).getTime() - new Date(date).getTime()) / 86400000,
  );
}

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window === "undefined") return initialLeads;
    const saved = window.localStorage.getItem("leadloop-demo");
    if (!saved) return initialLeads;
    try {
      return JSON.parse(saved) as Lead[];
    } catch {
      return initialLeads;
    }
  });
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    localStorage.setItem("leadloop-demo", JSON.stringify(leads));
  }, [leads]);
  const active = leads.filter((l) => !l.archived);
  const overdue = active.filter((l) => l.followUp && l.followUp < today);
  const due = active.filter((l) => l.followUp === today);
  const filtered = active.filter(
    (lead) =>
      (stage === "All" || lead.stage === stage) &&
      `${lead.name} ${lead.company} ${lead.email} ${lead.phone}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lead: Lead = {
      id: crypto.randomUUID(),
      name: String(data.get("name")),
      company: String(data.get("company")),
      email: String(data.get("email")),
      phone: String(data.get("phone")),
      source: String(data.get("source")),
      stage: "New",
      value: Number(data.get("value")) || 0,
      followUp: String(data.get("followUp")),
      notes: String(data.get("notes")),
      archived: false,
      createdAt: today,
    };
    setLeads((x) => [lead, ...x]);
    setModal(false);
    setView("leads");
  }
  function updateLead(patch: Partial<Lead>) {
    if (!selected) return;
    const next = { ...selected, ...patch };
    setSelected(next);
    setLeads((x) => x.map((l) => (l.id === next.id ? next : l)));
  }
  const nav = (
    target: View,
    label: string,
    icon: "dashboard" | "leads" | "bell" | "settings",
    badge?: number,
  ) => (
    <button
      onClick={() => {
        setView(target);
        setSelected(null);
        setMenu(false);
      }}
      className={`icon-action group flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-medium transition ${view === target && !selected ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
    >
      <span className="flex items-center gap-3">
        <Icon name={icon} />
        {label}
      </span>
      {badge ? (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
          {badge}
        </span>
      ) : null}
    </button>
  );
  if (!signedIn)
    return <AuthScreen onAuthenticated={() => setSignedIn(true)} />;
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button
          aria-label="Open menu"
          onClick={() => setMenu(!menu)}
          className="icon-action group rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm"
        >
          <Icon name="menu" />
        </button>
      </header>
      <aside
        className={`${menu ? "flex" : "hidden"} fixed inset-y-0 left-0 z-20 w-64 flex-col bg-[#111827] p-4 pt-20 shadow-2xl lg:flex lg:pt-6`}
      >
        <div className="mb-10 hidden px-2 lg:block">
          <Logo inverse />
        </div>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Workspace
        </p>
        <nav className="space-y-1">
          {nav("dashboard", "Dashboard", "dashboard")}
          {nav("leads", "Leads", "leads")}
          {nav("reminders", "Reminders", "bell", overdue.length)}
          {nav("settings", "Settings", "settings")}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="px-3 text-sm font-semibold text-white">Orbit Digital</p>
          <p className="px-3 text-xs text-slate-500">Agency workspace</p>
          <button
            onClick={() => setSignedIn(false)}
            className="icon-action group mt-3 min-h-11 w-full rounded-xl px-3 text-left text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <Icon name="logout" />
              Log out
            </span>
          </button>
        </div>
      </aside>
      <main className="mx-auto max-w-[1220px] px-4 py-8 sm:py-10 lg:ml-64 lg:px-10">
        {selected ? (
          <LeadDetail
            lead={selected}
            onBack={() => setSelected(null)}
            onUpdate={updateLead}
          />
        ) : view === "dashboard" ? (
          <Dashboard
            leads={active}
            overdue={overdue}
            due={due}
            open={setSelected}
            add={() => setModal(true)}
          />
        ) : view === "leads" ? (
          <Leads
            leads={filtered}
            query={query}
            setQuery={setQuery}
            stage={stage}
            setStage={setStage}
            open={setSelected}
            add={() => setModal(true)}
          />
        ) : view === "reminders" ? (
          <Reminders
            leads={active}
            open={setSelected}
            update={(id, date) =>
              setLeads((x) =>
                x.map((l) => (l.id === id ? { ...l, followUp: date } : l)),
              )
            }
          />
        ) : (
          <Settings leads={leads} setLeads={setLeads} />
        )}
      </main>
      {modal ? <AddLead close={() => setModal(false)} save={saveLead} /> : null}
    </div>
  );
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-indigo-600 text-sm font-black text-white shadow-[0_6px_18px_rgba(79,70,229,.3)]">
        L
      </span>
      <span
        className={`text-lg font-bold tracking-[-0.03em] ${inverse ? "text-white" : "text-slate-900"}`}
      >
        LeadLoop
      </span>
    </div>
  );
}

type LocalAccount = { email: string; salt: string; passwordHash: string };

async function hashPassword(password: string, salt: string) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email")).trim().toLowerCase();
    const password = String(data.get("password"));
    const accounts = JSON.parse(
      localStorage.getItem("leadloop-accounts") ?? "[]",
    ) as LocalAccount[];

    try {
      if (mode === "signup") {
        if (password.length < 8) {
          setError("Use at least 8 characters for your password.");
          return;
        }
        if (accounts.some((account) => account.email === email)) {
          setError("An account with this email already exists.");
          return;
        }
        const salt = crypto.randomUUID();
        const passwordHash = await hashPassword(password, salt);
        localStorage.setItem(
          "leadloop-accounts",
          JSON.stringify([...accounts, { email, salt, passwordHash }]),
        );
        onAuthenticated();
        return;
      }

      const account = accounts.find((item) => item.email === email);
      const suppliedHash = account
        ? await hashPassword(password, account.salt)
        : "";
      if (!account || suppliedHash !== account.passwordHash) {
        setError("Invalid email or password.");
        return;
      }
      onAuthenticated();
    } finally {
      setBusy(false);
    }
  }

  function switchMode(nextMode: "signin" | "signup") {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.08fr_.92fr]">
      <section className="auth-panel relative hidden overflow-hidden bg-[#111827] p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo inverse />
        <div className="max-w-lg">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
            A calmer sales pipeline
          </p>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-[-0.04em]">
            Good leads deserve better than a forgotten spreadsheet.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Keep conversations organized, know what needs attention, and stop
            warm leads from slipping through the cracks.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Designed for small, ambitious agencies.
        </p>
      </section>
      <section className="flex items-center justify-center bg-[#fafafa] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Logo />
          </div>
          <div className="rounded-[18px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,.08)] sm:p-9">
            <h2 className="text-3xl font-bold tracking-[-0.03em]">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "signin"
                ? "Sign in to manage your leads and follow-ups."
                : "Start organizing your agency pipeline today."}
            </p>
            <form onSubmit={submit} className="mt-7 space-y-5">
              <label className="block text-sm font-semibold">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@agency.com"
                  className="mt-2 min-h-12 w-full rounded-[15px] border border-slate-300 px-4 font-normal"
                />
              </label>
              <label className="block text-sm font-semibold">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  minLength={mode === "signup" ? 8 : undefined}
                  required
                  placeholder="At least 8 characters"
                  className="mt-2 min-h-12 w-full rounded-[15px] border border-slate-300 px-4 font-normal"
                />
              </label>
              {error ? (
                <p
                  role="alert"
                  className="rounded-[15px] bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              ) : null}
              <button
                disabled={busy}
                className="min-h-12 w-full rounded-[15px] bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {busy
                  ? "Please wait…"
                  : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              {mode === "signin"
                ? "New to LeadLoop?"
                : "Already have an account?"}{" "}
              <button
                onClick={() =>
                  switchMode(mode === "signin" ? "signup" : "signin")
                }
                className="min-h-11 font-semibold text-indigo-600"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Local demo: your account and leads stay in this browser only.
          </p>
        </div>
      </section>
    </main>
  );
}

function Header({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action?: () => void;
}) {
  return (
    <div className="mb-9 flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-[32px]">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{copy}</p>
      </div>
      {action ? (
        <button
          onClick={action}
          className="icon-action group min-h-11 shrink-0 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(79,70,229,.22)] transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          <span className="flex items-center gap-2">
            <Icon name="plus" />
            Add lead
          </span>
        </button>
      ) : null}
    </div>
  );
}
function Dashboard({
  leads,
  overdue,
  due,
  open,
  add,
}: {
  leads: Lead[];
  overdue: Lead[];
  due: Lead[];
  open: (l: Lead) => void;
  add: () => void;
}) {
  return (
    <>
      <Header
        title="Good morning, Ihtesham"
        copy="Here’s what needs your attention today."
        action={add}
      />
      <div className="grid grid-cols-2 overflow-hidden rounded-[15px] border border-slate-200 bg-white md:grid-cols-3 xl:grid-cols-6">
        {stages.map((s) => (
          <div
            key={s}
            className="border-b border-r border-slate-100 p-5 last:border-r-0 xl:border-b-0"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {s}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {leads.filter((l) => l.stage === s).length}
            </p>
          </div>
        ))}
      </div>
      <h2 className="mb-4 mt-10 text-lg font-bold tracking-tight">
        Needs attention
      </h2>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title={`Overdue · ${overdue.length}`}
          leads={overdue}
          open={open}
          warn
        />
        <Card title={`Due today · ${due.length}`} leads={due} open={open} />
      </div>
      <h2 className="mb-4 mt-10 text-lg font-bold tracking-tight">
        Recently added
      </h2>
      <div className="overflow-hidden rounded-[15px] border bg-white">
        {leads.slice(0, 5).map((l) => (
          <LeadRow key={l.id} lead={l} open={open} />
        ))}
      </div>
    </>
  );
}
function Card({
  title,
  leads,
  open,
  warn,
}: {
  title: string;
  leads: Lead[];
  open: (l: Lead) => void;
  warn?: boolean;
}) {
  return (
    <section
      className={`rounded-[15px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] ${warn ? "border-l-[3px] border-l-amber-500" : ""}`}
    >
      <h3 className="mb-3 font-bold">{title}</h3>
      {leads.length ? (
        leads.map((l) => <LeadRow key={l.id} lead={l} open={open} />)
      ) : (
        <p className="py-6 text-center text-sm text-slate-500">
          Nothing here. You’re all caught up.
        </p>
      )}
    </section>
  );
}
function LeadRow({ lead, open }: { lead: Lead; open: (l: Lead) => void }) {
  return (
    <button
      onClick={() => open(lead)}
      className="icon-action group flex min-h-[72px] w-full items-center gap-3 border-b border-slate-100 px-4 text-left transition last:border-0 hover:bg-[#fafafa]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-slate-100 text-xs font-bold text-slate-600 transition group-hover:bg-indigo-50 group-hover:text-indigo-700">
        {lead.name
          .split(" ")
          .map((x) => x[0])
          .join("")}
      </span>
      <span className="min-w-0 flex-1">
        <b className="block truncate">{lead.name}</b>
        <span className="block truncate text-sm text-slate-500">
          {lead.company}
        </span>
      </span>
      <span
        className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:block ${stageStyle[lead.stage]}`}
      >
        {lead.stage}
      </span>
      <Icon name="chevron-right" className="h-5 w-5 text-slate-400" />
    </button>
  );
}
function Leads({
  leads,
  query,
  setQuery,
  stage,
  setStage,
  open,
  add,
}: {
  leads: Lead[];
  query: string;
  setQuery: (x: string) => void;
  stage: string;
  setStage: (x: string) => void;
  open: (l: Lead) => void;
  add: () => void;
}) {
  return (
    <>
      <Header
        title="Leads"
        copy={`${leads.length} leads in your current view`}
        action={add}
      />
      <div className="mb-5 rounded-[15px] border bg-white p-4">
        <label className="relative block">
          <span className="sr-only">Search leads</span>
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, email or phone…"
            className="h-12 w-full rounded-[15px] border py-2 pl-12 pr-4"
          />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", ...stages].map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium ${stage === s ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-[15px] border bg-white">
        {leads.length ? (
          leads.map((l) => <LeadRow key={l.id} lead={l} open={open} />)
        ) : (
          <p className="p-12 text-center text-slate-500">
            No leads match those filters.
          </p>
        )}
      </div>
    </>
  );
}
function Reminders({
  leads,
  open,
  update,
}: {
  leads: Lead[];
  open: (l: Lead) => void;
  update: (id: string, date: string) => void;
}) {
  const groups = [
    ["Overdue", leads.filter((l) => l.followUp && l.followUp < today)],
    ["Due today", leads.filter((l) => l.followUp === today)],
    ["Upcoming", leads.filter((l) => l.followUp > today)],
    ["No follow-up scheduled", leads.filter((l) => !l.followUp)],
  ] as const;
  return (
    <>
      <Header title="Reminders" copy="Everything that needs a next step." />
      {groups.map(([title, list]) => (
        <section
          key={title}
          className="mb-6 overflow-hidden rounded-[15px] border bg-white"
        >
          <h2 className="border-b bg-slate-50 px-5 py-4 font-bold">
            {title} <span className="text-slate-400">· {list.length}</span>
          </h2>
          {list.map((l) => (
            <div
              key={l.id}
              className="flex flex-wrap items-center gap-3 border-b p-4 last:border-0"
            >
              <button
                onClick={() => open(l)}
                className="min-w-48 flex-1 text-left"
              >
                <b>{l.name}</b>
                <p className="text-sm text-slate-500">
                  {l.company}
                  {l.followUp && l.followUp < today
                    ? ` · ${daysBetween(l.followUp)} days overdue`
                    : ""}
                </p>
              </button>
              <input
                aria-label={`Reschedule ${l.name}`}
                type="date"
                value={l.followUp}
                onChange={(e) => update(l.id, e.target.value)}
                className="min-h-11 rounded-[15px] border px-3"
              />
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
function LeadDetail({
  lead,
  onBack,
  onUpdate,
}: {
  lead: Lead;
  onBack: () => void;
  onUpdate: (p: Partial<Lead>) => void;
}) {
  return (
    <>
      <button
        onClick={onBack}
        className="icon-action group mb-5 min-h-11 text-sm font-semibold text-indigo-600"
      >
        <span className="flex items-center gap-2">
          <Icon name="arrow-left" />
          Back to leads
        </span>
      </button>
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <p className="text-slate-500">
            {lead.company} · {lead.source}
          </p>
        </div>
        <select
          value={lead.stage}
          onChange={(e) => onUpdate({ stage: e.target.value as Stage })}
          className="min-h-11 rounded-[15px] border bg-white px-4 font-semibold"
        >
          {stages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[15px] border bg-white p-6">
          <h2 className="font-bold">Next follow-up</h2>
          <input
            type="date"
            value={lead.followUp}
            onChange={(e) => onUpdate({ followUp: e.target.value })}
            className="mt-4 min-h-11 w-full rounded-[15px] border px-4"
          />
          {lead.followUp && lead.followUp < today ? (
            <p className="mt-2 text-sm font-semibold text-amber-700">
              Overdue by {daysBetween(lead.followUp)} day(s)
            </p>
          ) : null}
        </section>
        <section className="rounded-[15px] border bg-white p-6">
          <h2 className="mb-4 font-bold">Details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd>
                <a className="text-indigo-600" href={`mailto:${lead.email}`}>
                  {lead.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Phone</dt>
              <dd>{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Deal value</dt>
              <dd>PKR {lead.value.toLocaleString()}</dd>
            </div>
          </dl>
        </section>
      </div>
      <section className="mt-5 rounded-[15px] border bg-white p-6">
        <h2 className="font-bold">Notes</h2>
        <textarea
          value={lead.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          className="mt-4 min-h-28 w-full rounded-[15px] border p-4"
        />
        <button
          onClick={() => onUpdate({ archived: true })}
          className="icon-action group mt-4 min-h-11 rounded-[15px] border border-red-200 px-4 text-sm font-semibold text-red-600"
        >
          <span className="flex items-center gap-2">
            <Icon name="archive" />
            Archive lead
          </span>
        </button>
      </section>
    </>
  );
}
function Settings({
  leads,
  setLeads,
}: {
  leads: Lead[];
  setLeads: (x: Lead[]) => void;
}) {
  return (
    <>
      <Header title="Settings" copy="Manage your workspace and reminders." />
      <section className="mb-6 rounded-[15px] border bg-white p-6">
        <h2 className="mb-5 font-bold">Workspace</h2>
        <label className="block text-sm font-medium">
          Workspace name
          <input
            defaultValue="Orbit Digital"
            className="mt-2 min-h-11 w-full rounded-[15px] border px-4"
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Digest time
            <input
              type="time"
              defaultValue="08:00"
              className="mt-2 min-h-11 w-full rounded-[15px] border px-4"
            />
          </label>
          <label className="text-sm font-medium">
            Timezone
            <select className="mt-2 min-h-11 w-full rounded-[15px] border px-4">
              <option>Asia/Karachi</option>
            </select>
          </label>
        </div>
        <button className="mt-5 min-h-11 rounded-[15px] bg-indigo-600 px-5 font-semibold text-white">
          Save settings
        </button>
      </section>
      <section className="rounded-[15px] border bg-white p-6">
        <h2 className="mb-4 font-bold">Archived leads</h2>
        {leads.filter((l) => l.archived).length ? (
          leads
            .filter((l) => l.archived)
            .map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between border-b py-3"
              >
                <span>{l.name}</span>
                <button
                  onClick={() =>
                    setLeads(
                      leads.map((x) =>
                        x.id === l.id ? { ...x, archived: false } : x,
                      ),
                    )
                  }
                  className="text-sm font-semibold text-indigo-600"
                >
                  Restore
                </button>
              </div>
            ))
        ) : (
          <p className="text-sm text-slate-500">No archived leads.</p>
        )}
      </section>
    </>
  );
}
function AddLead({
  close,
  save,
}: {
  close: () => void;
  save: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <form
        onSubmit={save}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[24px] bg-white p-6 sm:rounded-[15px]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add a new lead</h2>
          <button
            type="button"
            onClick={close}
            className="icon-action group h-11 w-11 rounded-full bg-slate-100"
          >
            <Icon name="x" className="mx-auto h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["name", "Name *", "text", true],
            ["company", "Company", "text", false],
            ["email", "Email", "email", false],
            ["phone", "Phone", "tel", false],
            ["value", "Deal value", "number", false],
            ["followUp", "Next follow-up", "date", false],
          ].map(([name, label, type, required]) => (
            <label key={String(name)} className="text-sm font-medium">
              {label}
              <input
                name={String(name)}
                type={String(type)}
                required={Boolean(required)}
                className="mt-2 min-h-11 w-full rounded-[15px] border px-4"
              />
            </label>
          ))}
          <label className="text-sm font-medium">
            Source
            <select
              name="source"
              className="mt-2 min-h-11 w-full rounded-[15px] border px-4"
            >
              <option>Website</option>
              <option>WhatsApp</option>
              <option>Facebook</option>
              <option>Referral</option>
              <option>Other</option>
            </select>
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Notes
            <textarea
              name="notes"
              className="mt-2 min-h-24 w-full rounded-[15px] border p-4"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            className="min-h-11 rounded-[15px] border px-5 font-semibold"
          >
            Cancel
          </button>
          <button className="min-h-11 rounded-[15px] bg-indigo-600 px-5 font-semibold text-white">
            Add lead
          </button>
        </div>
      </form>
    </div>
  );
}
