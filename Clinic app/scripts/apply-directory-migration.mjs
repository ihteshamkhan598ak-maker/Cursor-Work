import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => {
      const index = line.indexOf("=");
      return [
        line.slice(0, index),
        line.slice(index + 1).replace(/^"|"$/g, ""),
      ];
    }),
);
const projectRef = readFileSync("supabase/.temp/project-ref", "utf8").trim();
const query = readFileSync(
  "supabase/migrations/202610280003_doctor_directory_seed.sql",
  "utf8",
);
const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  },
);
if (!response.ok)
  throw new Error(
    `Supabase migration failed (${response.status}): ${await response.text()}`,
  );
const verify = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query:
        "select (select count(*) from public.doctors where profile_status = 'directory_listing') as doctors, (select count(*) from public.facilities) as facilities, (select count(*) from public.specialties) as specialties, (select count(*) from public.doctor_facilities) as affiliations",
    }),
  },
);
if (!verify.ok)
  throw new Error(
    `Supabase verification failed (${verify.status}): ${await verify.text()}`,
  );
console.log("Directory migration applied successfully:", await verify.json());
