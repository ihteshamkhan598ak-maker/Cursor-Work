# LeadLoop

LeadLoop is a focused lead follow-up SaaS for small digital marketing agencies.
This repository currently contains **Phase 0** of the MVP: the production-ready
Next.js foundation, validated environment configuration, Supabase SSR client
factories, and the quality toolchain.

## Prerequisites

- Node.js 20.9 or newer
- npm 10 or newer
- A Supabase project (required beginning in Phase 1)

## Local setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and fill in local credentials. Never
   commit `.env.local` or send its values in chat.

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open <http://localhost:3000>.

## Environment variables

| Variable                        | Exposure     | Purpose                                                                                     |
| ------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Browser-safe | Supabase project URL                                                                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe | Supabase anonymous key; RLS remains the authorization boundary                              |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only  | Privileged cron access; never import into client code                                       |
| `RESEND_API_KEY`                | Server only  | Transactional digest email delivery                                                         |
| `CRON_SECRET`                   | Server only  | Authenticates cron requests and signs unsubscribe tokens; use at least 32 random characters |
| `APP_URL`                       | Server only  | Canonical application URL used in email links                                               |

Environment values are validated at their point of use. Missing or malformed
values fail with a clear configuration error instead of creating a partially
configured client.

## Quality checks

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

## Code organization

- `app/` — Next.js App Router pages, layouts, and global styles
- `lib/env.ts` — shared environment schemas and validation
- `lib/supabase/` — browser and server Supabase client factories
- `public/` — static assets

Future phases add authentication, database migrations, lead workflows,
reminders, and the digest strictly in the order defined by the product plan.

## Security baseline

- Secrets live only in ignored environment files or the hosting provider.
- Only the Supabase URL and anonymous key may be exposed to the browser.
- The server client uses request cookies and is isolated from client modules.
- Authorization will be enforced with PostgreSQL Row Level Security in Phase 1.
- All application inputs will be validated with shared Zod schemas.
