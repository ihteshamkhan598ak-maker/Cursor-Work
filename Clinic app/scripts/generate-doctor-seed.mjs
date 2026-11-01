import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync("data/seed-data.md", "utf8");
const lines = source.split(/\r?\n/);

function tableBetween(start, end) {
  let active = false;
  const rows = [];
  for (const line of lines) {
    if (line.startsWith(start)) {
      active = true;
      continue;
    }
    if (line.startsWith(end)) active = false;
    if (active && line.startsWith("| ")) {
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());
      if (
        cells[0] !== "Doctor name" &&
        cells[0] !== "Hospital/Complex name" &&
        !cells[0].startsWith("---")
      )
        rows.push(cells);
    }
  }
  return rows;
}

const doctorRows = tableBetween("## Table 1", "### Multiple affiliations");
const facilityRows = tableBetween("## Table 2", "## Specialties found");
const specialtyLine = lines.find((line) =>
  line.startsWith("Anesthesia & Pain Management;"),
);
const specialties = specialtyLine
  .split(";")
  .map((name) => name.replace(/\.$/, "").trim());

const aliases = new Map([
  ["Hayatabad Medical Complex", "Hayatabad Medical Complex (HMC)"],
  ["Peshawar General Hospital", "Peshawar General Hospital (PGH)"],
  [
    "Peshawar Institute of Cardiology",
    "Peshawar Institute of Cardiology (PIC-MTI)",
  ],
  ["Rehman Medical Institute", "Rehman Medical Institute (RMI)"],
  [
    "Northwest General Hospital",
    "Northwest General Hospital & Research Centre (NWGH)",
  ],
  ["DHQ Hospital", "DHQ Hospital (District Headquarters Hospital), Charsadda"],
  ["Al Khidmat Hospital", "Al Khidmat Hospital (Charsadda)"],
  ["Khyber Medical Centre", "Khyber Medical Centre (Shabqadar)"],
  ["Ayan Medical Center", "Ayan Medical Center — CLINIC, not a hospital"],
  [
    "Abdul Haleem Medical Center",
    "Abdul Haleem Medical Center — CLINIC, not a hospital",
  ],
  [
    "Nawaz Medical Hall Hospital",
    "Nawaz Medical Hall Hospital — CLINIC in practice (directory calls it a hospital)",
  ],
]);

function id(namespace, value) {
  const hex = createHash("md5").update(`${namespace}:${value}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function doctorKey(name) {
  const simple = name
    .toLowerCase()
    .replace(/\b(prof|asst|assist|assoc|asso|dr)\b\.?/g, "")
    .replace(/[^a-z0-9]/g, "");
  if (simple === "niazali") return "niaz-ali";
  if (simple === "shahidayub") return "shahid-ayub";
  return simple;
}

function normalizedSpecialty(raw) {
  const s = raw.toLowerCase();
  const tests = [
    [/anesthesia/, "Anesthesia & Pain Management"],
    [/breast|oncoplastic/, "Breast & Oncoplastic Surgery"],
    [/interventional cardiology/, "Interventional Cardiology"],
    [/paediatric cardiology|pediatric cardiology/, "Paediatric Cardiology"],
    [/cardiothoracic/, "Cardiothoracic Surgery"],
    [/cardiac surgery/, "Cardiac Surgery"],
    [/cardiolog/, "Cardiology"],
    [/clinical.*radiation oncology/, "Clinical & Radiation Oncology"],
    [/radiation oncology/, "Radiation Oncology"],
    [/medical oncology/, "Medical Oncology"],
    [/oncological surgery|oncology/, "Oncology"],
    [/dental.*maxillofacial/, "Dental & Maxillofacial"],
    [/dentistry|orthodont/, "Dentistry / Orthodontics"],
    [/dermat/, "Dermatology"],
    [/diabet|endocrin/, "Endocrinology / Diabetes (including Diabetology)"],
    [/ent|head.*neck/, "ENT / Head & Neck Surgery"],
    [/family medicine/, "Family Medicine"],
    [/gastro|hepatology/, "Gastroenterology / Hepatology"],
    [/general physician/, "General Physician"],
    [/general surg|laparoscopic/, "General Surgery / Laparoscopic Surgery"],
    [/gyn|obstetric/, "Gynecology & Obstetrics"],
    [/hematology/, "Hematology"],
    [/internal medicine/, "Internal Medicine"],
    [/interventional radiology/, "Interventional Radiology"],
    [/kidney transplant/, "Kidney Transplant"],
    [/nephrology/, "Nephrology"],
    [/neurolog/, "Neurology"],
    [/neurosurg/, "Neurosurgery"],
    [/nuclear medicine/, "Nuclear Medicine"],
    [/nursery|neonat/, "Nursery / Neonatology"],
    [/ophthalm/, "Ophthalmology"],
    [/orthopedic/, "Orthopedics (including Orthopedic Surgery)"],
    [
      /paediatric surgery|pediatric surg/,
      "Paediatric Surgery (including Pediatric Surgery)",
    ],
    [/paediatric|pediatric/, "Paediatrics (including Pediatrics)"],
    [/physical therapy.*rehab/, "Physical Therapy & Rehabilitation"],
    [/physiotherapy/, "Physiotherapy"],
    [/plastic|cosmetic|burns/, "Plastic, Cosmetic & Burns Surgery"],
    [/psychiatry/, "Psychiatry"],
    [/pulmon|lung/, "Pulmonology"],
    [/rheumatology/, "Rheumatology"],
    [/spine/, "Spine Surgery"],
    [/tb|hepatitis/, "TB / Hepatitis"],
    [/urology.*renal|renal transplant/, "Urology / Renal Transplant"],
    [/urology/, "Urology / Renal Transplant"],
  ];
  return tests.find(([pattern]) => pattern.test(s))?.[1] ?? raw;
}

const facilities = facilityRows.map(
  ([name, type, city, address, departments, sourceUrl]) => ({
    id: id("facility", name),
    name,
    type: /^govt/i.test(type) ? "govt" : "private",
    typeLabel: type,
    city,
    address: address || null,
    departments: departments
      ? departments
          .split(/,|;/)
          .map((v) => v.trim())
          .filter(Boolean)
      : [],
    sourceUrl,
  }),
);
const facilityByName = new Map(facilities.map((f) => [f.name, f]));

const doctorsByKey = new Map();
const affiliations = [];
for (const [
  fullName,
  rawSpecialty,
  qualifications,
  rawFacility,
  ,
  city,
  timings,
  fee,
  sourceUrl,
] of doctorRows) {
  const key = doctorKey(fullName);
  const specialty = normalizedSpecialty(rawSpecialty);
  let doctor = doctorsByKey.get(key);
  if (!doctor) {
    doctor = {
      id: id("doctor", key),
      fullName,
      specialty,
      rawSpecialty,
      qualifications: qualifications || null,
      city: city.includes("Peshawar") ? "Peshawar" : "Charsadda",
      profileStatus: "directory_listing",
      sourceUrl,
    };
    doctorsByKey.set(key, doctor);
  } else if (!doctor.qualifications && qualifications)
    doctor.qualifications = qualifications;
  const facilityName = aliases.get(rawFacility) ?? rawFacility;
  const facility = facilityByName.get(facilityName);
  if (!facility) throw new Error(`No facility match for: ${rawFacility}`);
  const numericFee = fee
    ? Number((fee.match(/[\d,]+/)?.[0] ?? "").replaceAll(",", "")) || null
    : null;
  affiliations.push({
    id: id("affiliation", `${key}:${facility.id}`),
    doctorId: doctor.id,
    facilityId: facility.id,
    isPrimary: false,
    status: fullName.includes("Ashfaq Utmanzay") ? "past" : "current",
    timings: timings || null,
    feePkr: numericFee,
    feeDisplay: fee || null,
    feeStatus: fullName.includes("Samia Zahid Aman")
      ? "unverified"
      : numericFee
        ? "published_unconfirmed"
        : "unknown",
    sourceUrl,
  });
}

const doctors = [...doctorsByKey.values()];
const specialtyRows = specialties.map((name) => ({
  id: id("specialty", name),
  name,
  sourceUrl:
    doctors.find((d) => d.specialty === name)?.sourceUrl ?? doctorRows[0][8],
}));
const counts = {
  facilities: facilities.length,
  doctors: doctors.length,
  affiliations: affiliations.length,
  specialties: specialtyRows.length,
};
if (
  JSON.stringify(counts) !==
  JSON.stringify({
    facilities: 31,
    doctors: 158,
    affiliations: 160,
    specialties: 43,
  })
)
  throw new Error(`Unexpected counts: ${JSON.stringify(counts)}`);
const unknown = [
  ...new Set(
    doctors.map((d) => d.specialty).filter((s) => !specialties.includes(s)),
  ),
];
if (unknown.length)
  throw new Error(`Unnormalized specialties: ${unknown.join(", ")}`);

const dataset = {
  generatedFrom: "data/seed-data.md",
  counts,
  specialties: specialtyRows,
  facilities,
  doctors,
  affiliations,
};
writeFileSync(
  "src/lib/doctor-directory-data.json",
  JSON.stringify(dataset, null, 2) + "\n",
);

const q = (value) =>
  value === null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const json = (value) => `${q(JSON.stringify(value))}::jsonb`;
let sql = `-- Generated only from data/seed-data.md. Do not edit seed rows manually.\n`;
sql += `create extension if not exists pgcrypto;\n\n`;
sql += `create table if not exists public.specialties (id uuid primary key, name text not null unique, source_url text not null, created_at timestamptz not null default now());\n`;
sql += `alter table public.doctors alter column clinic_id drop not null;\n`;
sql += `alter table public.doctors alter column specialty type text using specialty::text;\n`;
sql += `alter table public.doctors add column if not exists full_name text;\n`;
sql += `alter table public.doctors add column if not exists specialty_id uuid references public.specialties(id);\n`;
sql += `alter table public.doctors add column if not exists city text;\n`;
sql += `alter table public.doctors add column if not exists profile_status text not null default 'claimed' check (profile_status in ('directory_listing','claimed','verified'));\n`;
sql += `alter table public.doctors add column if not exists source_url text;\n`;
sql += `alter table public.doctors add column if not exists claimed_by uuid references auth.users(id);\n`;
sql += `create table if not exists public.facilities (id uuid primary key, name text not null unique, type text not null check (type in ('govt','private')), type_label text not null, city text not null, address text, departments jsonb not null default '[]', source_url text not null, created_at timestamptz not null default now());\n`;
sql += `create table if not exists public.doctor_facilities (id uuid primary key, doctor_id uuid not null references public.doctors(id) on delete restrict, facility_id uuid not null references public.facilities(id) on delete restrict, is_primary boolean not null default false, status text not null check (status in ('current','past')), timings text, fee_pkr integer, fee_display text, fee_status text not null check (fee_status in ('unknown','published_unconfirmed','unverified','verified')), source_url text not null, created_at timestamptz not null default now(), unique(doctor_id,facility_id));\n`;
sql += `create unique index if not exists one_primary_facility_per_doctor on public.doctor_facilities(doctor_id) where is_primary;\n`;
sql += `create index if not exists doctors_city_specialty_idx on public.doctors(city,specialty_id);\ncreate index if not exists doctor_facilities_facility_idx on public.doctor_facilities(facility_id,status);\n\n`;
sql += `alter table public.specialties enable row level security; alter table public.doctors enable row level security; alter table public.facilities enable row level security; alter table public.doctor_facilities enable row level security;\n`;
for (const table of ["specialties", "facilities", "doctor_facilities"])
  sql += `drop policy if exists "Public can read ${table}" on public.${table}; create policy "Public can read ${table}" on public.${table} for select using (true);\n`;
sql += `drop policy if exists "Public can read directory doctors" on public.doctors; create policy "Public can read directory doctors" on public.doctors for select using (profile_status = 'directory_listing');\n`;
sql += `\ninsert into public.specialties (id,name,source_url) values\n${specialtyRows.map((s) => `(${q(s.id)},${q(s.name)},${q(s.sourceUrl)})`).join(",\n")} on conflict (id) do update set name=excluded.name,source_url=excluded.source_url;\n`;
sql += `\ninsert into public.facilities (id,name,type,type_label,city,address,departments,source_url) values\n${facilities.map((f) => `(${q(f.id)},${q(f.name)},${q(f.type)},${q(f.typeLabel)},${q(f.city)},${q(f.address)},${json(f.departments)},${q(f.sourceUrl)})`).join(",\n")} on conflict (id) do update set name=excluded.name,type=excluded.type,type_label=excluded.type_label,city=excluded.city,address=excluded.address,departments=excluded.departments,source_url=excluded.source_url;\n`;
sql += `\ninsert into public.doctors (id,clinic_id,name,full_name,specialty,specialty_id,qualifications,fee_pkr,active,city,profile_status,source_url) values\n${doctors.map((d) => `(${q(d.id)},null,${q(d.fullName)},${q(d.fullName)},${q(d.specialty)},${q(id("specialty", d.specialty))},${q(d.qualifications)},null,false,${q(d.city)},'directory_listing',${q(d.sourceUrl)})`).join(",\n")} on conflict (id) do update set name=excluded.name,full_name=excluded.full_name,specialty=excluded.specialty,specialty_id=excluded.specialty_id,qualifications=excluded.qualifications,city=excluded.city,profile_status='directory_listing',source_url=excluded.source_url,active=false;\n`;
sql += `\ninsert into public.doctor_facilities (id,doctor_id,facility_id,is_primary,status,timings,fee_pkr,fee_display,fee_status,source_url) values\n${affiliations.map((a) => `(${q(a.id)},${q(a.doctorId)},${q(a.facilityId)},false,${q(a.status)},${q(a.timings)},${a.feePkr ?? "null"},${q(a.feeDisplay)},${q(a.feeStatus)},${q(a.sourceUrl)})`).join(",\n")} on conflict (id) do update set status=excluded.status,timings=excluded.timings,fee_pkr=excluded.fee_pkr,fee_display=excluded.fee_display,fee_status=excluded.fee_status,source_url=excluded.source_url;\n`;
writeFileSync(
  "supabase/migrations/202610280003_doctor_directory_seed.sql",
  sql,
);
console.log(counts);
