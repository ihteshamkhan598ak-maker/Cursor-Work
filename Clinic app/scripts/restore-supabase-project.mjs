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

const projectRef = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/restore`, {
  method: "POST",
  headers: { Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}` },
});

if (!response.ok) {
  const body = await response.text();
  console.error(`PROJECT_RESTORE_FAILED status=${response.status} ${body}`);
  process.exit(1);
}

console.log("PROJECT_RESTORE_STARTED");
