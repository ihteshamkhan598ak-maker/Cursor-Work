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
const endpoint = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

async function query(sql) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!response.ok)
    throw new Error(
      `Supabase audit failed (${response.status}): ${await response.text()}`,
    );
  return response.json();
}

const tables = await query(`
  select c.relname as table_name, c.relrowsecurity as rls_enabled
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'
  order by c.relname;
`);

const policies = await query(`
  select tablename, policyname, roles, cmd, qual, with_check
  from pg_policies
  where schemaname = 'public'
  order by tablename, policyname;
`);

const grants = await query(`
  select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type) as privileges
  from information_schema.role_table_grants
  where table_schema = 'public' and grantee in ('anon', 'authenticated')
  group by table_name, grantee
  order by table_name, grantee;
`);

const counts = await query(`
  select
    (select count(*) from public.doctors where profile_status = 'directory_listing') as directory_doctors,
    (select count(*) from public.facilities) as facilities,
    (select count(*) from public.specialties) as specialties,
    (select count(*) from public.doctor_facilities) as affiliations;
`);

console.log(JSON.stringify({ tables, policies, grants, counts }, null, 2));
