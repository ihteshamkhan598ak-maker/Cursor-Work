-- RLS controls which rows can be reached; grants control which operations can
-- be attempted. Keep both explicit so a future policy mistake is less harmful.
begin;

alter table public.cities enable row level security;
alter table public.clinics enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.appointments enable row level security;
alter table public.message_log enable row level security;
alter table public.specialties enable row level security;
alter table public.facilities enable row level security;
alter table public.doctor_facilities enable row level security;
alter table public.documents enable row level security;
alter table public.n8n_chat_histories enable row level security;

-- Preserve appointment history: a doctor may only be deleted when no
-- appointment references that doctor. The previous policy compared two
-- appointment columns to each other and did not check the doctor being deleted.
drop policy if exists "owners delete doctors without appointments" on public.doctors;
create policy "owners delete doctors without appointments"
  on public.doctors
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.clinics c
      where c.id = doctors.clinic_id
        and c.owner_id = (select auth.uid())
    )
    and not exists (
      select 1
      from public.appointments a
      where a.doctor_id = doctors.id
    )
  );

revoke all on table public.cities from anon, authenticated;
revoke all on table public.clinics from anon, authenticated;
revoke all on table public.doctors from anon, authenticated;
revoke all on table public.doctor_schedules from anon, authenticated;
revoke all on table public.appointments from anon, authenticated;
revoke all on table public.message_log from anon, authenticated;
revoke all on table public.specialties from anon, authenticated;
revoke all on table public.facilities from anon, authenticated;
revoke all on table public.doctor_facilities from anon, authenticated;
revoke all on table public.documents from anon, authenticated;
revoke all on table public.n8n_chat_histories from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on table public.cities to anon, authenticated;

grant select (id, city_id, name, address, phone, created_at)
  on table public.clinics to anon;
grant select, insert, update on table public.clinics to authenticated;

grant select (
  id, clinic_id, name, full_name, specialty, specialty_id,
  qualifications, fee_pkr, active, city, profile_status, source_url, created_at
) on table public.doctors to anon;
grant select, insert, update, delete on table public.doctors to authenticated;

grant select on table public.doctor_schedules to anon;
grant select, insert, update, delete on table public.doctor_schedules to authenticated;

grant select, update on table public.appointments to authenticated;
grant select on table public.message_log to authenticated;

grant select on table public.specialties to anon, authenticated;
grant select on table public.facilities to anon, authenticated;
grant select on table public.doctor_facilities to anon, authenticated;

-- These tables are not used by ClinicBook. Keep them inaccessible through
-- the public API unless a future migration adds narrowly scoped policies.
-- Backend database owners and service-role connections remain unaffected.

-- New public-schema tables start private until a migration grants the exact
-- operations required by the app.
alter default privileges in schema public
  revoke all on tables from anon, authenticated;

commit;
