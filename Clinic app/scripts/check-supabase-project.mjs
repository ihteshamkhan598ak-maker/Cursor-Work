import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.trimStart().startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const token = env.SUPABASE_ACCESS_TOKEN;
const projectRef = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];

if (!token || !projectRef) throw new Error("Supabase access details are missing.");

const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
  headers: { Authorization: `Bearer ${token}` },
});

const body = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error(`PROJECT_CHECK_FAILED status=${response.status}`);
  process.exit(1);
}

console.log(`PROJECT_STATUS=${body.status ?? "unknown"}`);
console.log(`PROJECT_REGION=${body.region ?? "unknown"}`);
