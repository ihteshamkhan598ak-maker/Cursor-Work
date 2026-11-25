import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter(
      (line) => line && !line.trimStart().startsWith("#") && line.includes("="),
    )
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const projectRef = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const sql = fs.readFileSync(
  new URL(
    "../supabase/migrations/202611250001_add_patient_email.sql",
    import.meta.url,
  ),
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
    body: JSON.stringify({ query: sql }),
  },
);

if (!response.ok) {
  console.error(`PATIENT_EMAIL_MIGRATION_FAILED status=${response.status}`);
  process.exit(1);
}

console.log("PATIENT_EMAIL_MIGRATION_APPLIED");
