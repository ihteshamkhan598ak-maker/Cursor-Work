import fs from "node:fs";

function readEnv() {
  return Object.fromEntries(
    fs
      .readFileSync(new URL("../.env.local", import.meta.url), "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.trimStart().startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
      }),
  );
}

const env = readEnv();
const projectRef = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const sql = fs.readFileSync(
  new URL("../supabase/migrations/202611120001_harden_database_grants.sql", import.meta.url),
  "utf8",
);

let response;
let lastError;

for (let attempt = 1; attempt <= 4; attempt += 1) {
  try {
    response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
    break;
  } catch (error) {
    lastError = error;
    if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
  }
}

if (!response) {
  console.error(`HARDENING_CONNECTION_FAILED ${lastError?.cause?.code ?? "unknown"}`);
  process.exit(1);
}

if (!response.ok) {
  console.error(`HARDENING_FAILED status=${response.status} ${await response.text()}`);
  process.exit(1);
}

console.log("HARDENING_APPLIED");
