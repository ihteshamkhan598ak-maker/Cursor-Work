# ClinicBook

ClinicBook is a mobile-first, bilingual clinic appointment application for Charsadda. Patients will browse doctors and book without creating an account; clinic owners will securely manage schedules and appointments.

This repository contains the complete ClinicBook MVP: public doctor discovery and appointment requests, clinic-owner authentication and onboarding, doctor schedules, appointment management, clinic settings, WhatsApp notifications, and a Supabase database protected by Row Level Security.

## Product flows

- Patients filter local doctors, review fees and schedules, and request a slot without creating an account.
- Clinic owners sign up, create their clinic profile, manage doctors and weekly schedules, and process appointment requests.
- Confirmed and cancelled appointments trigger WhatsApp notices when live credentials are enabled; test mode safely records the notification without contacting Meta.
- Database constraints prevent active double bookings and mismatched doctor/clinic appointments.

## Requirements

- Node.js 24 LTS (Node.js 20.9+ is supported by Next.js 16)
- npm 11+
- A Supabase project for authenticated and database-backed phases
- Optional Meta WhatsApp Cloud API test credentials

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in your own values. Never commit `.env.local`.
3. Start the application with `npm run dev`.
4. Open <http://localhost:3000>.

## Environment variables

| Variable                        | Exposure         | Purpose                                                                             |
| ------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Browser + server | Supabase project URL                                                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public anonymous key; RLS remains the authorization boundary                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only      | Privileged booking operations; never import the admin client into client components |
| `WHATSAPP_TOKEN`                | Server only      | WhatsApp Cloud API access token                                                     |
| `WHATSAPP_PHONE_NUMBER_ID`      | Server only      | WhatsApp sender number identifier                                                   |
| `WHATSAPP_TEST_MODE`            | Server only      | Uses the safe log driver when set to `true`                                         |
| `APP_URL`                       | Server only      | Canonical application URL                                                           |

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run format:check
npm run build
npm run check
npm run db:start
npm run db:test
```

The database commands require Docker Desktop or Podman. Run `npm run db:start`
before `npm run db:test`.

## Organization

```text
src/
  app/                 Next.js App Router pages and global styles
  lib/
    env/               shared Zod environment validation
    supabase/          browser, authenticated server, proxy, and server-only admin clients
    validations/       shared server-side input schemas
supabase/
  migrations/          database schema and Row Level Security policies
  tests/               pgTAP database and policy checks
```

Business logic remains in focused modules under `src/lib`; reusable UI lives under `src/components`; SQL migrations live under `supabase/migrations`.

## Security baseline

- Secrets are loaded from environment variables and `.env.local` is ignored by Git.
- Environment values are validated before use.
- The privileged Supabase client is guarded by `server-only` and disables session persistence.
- Authorization is enforced with Postgres Row Level Security, not client-side filtering.
- Inputs for each product flow will be validated server-side with shared Zod schemas.
