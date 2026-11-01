create extension if not exists pgcrypto;

create type public.specialty as enum (
  'general', 'children', 'women', 'skin', 'heart', 'bones',
  'eyes', 'dental', 'ent', 'mental', 'other'
);
create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  country text not null default 'Pakistan',
  timezone text not null default 'Asia/Karachi',
  active boolean not null default true
);

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  city_id uuid not null references public.cities(id),
  name text not null check (char_length(trim(name)) between 1 and 120),
  address text not null check (char_length(trim(address)) between 1 and 300),
  phone text not null check (phone ~ '^03[0-9]{2}-?[0-9]{7}$'),
  created_at timestamptz not null default now(),
  unique(owner_id)
);

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  specialty public.specialty not null,
  qualifications text check (qualifications is null or char_length(qualifications) <= 300),
  fee_pkr integer check (fee_pkr is null or fee_pkr >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.doctors add constraint doctors_id_clinic_unique unique (id, clinic_id);
create index doctors_clinic_idx on public.doctors(clinic_id) where active;

create table public.doctor_schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes smallint not null default 30 check (slot_minutes in (15, 30, 60)),
  check (end_time > start_time),
  unique(doctor_id, weekday)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  clinic_id uuid not null references public.clinics(id) on delete restrict,
  patient_name text not null check (char_length(trim(patient_name)) between 1 and 120),
  patient_phone text not null check (patient_phone ~ '^03[0-9]{2}-?[0-9]{7}$'),
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status public.appointment_status not null default 'pending',
  note text check (note is null or char_length(note) <= 500),
  cancel_reason text check (cancel_reason is null or char_length(cancel_reason) <= 300),
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);
alter table public.appointments add constraint appointments_doctor_clinic_fk
  foreign key (doctor_id, clinic_id) references public.doctors(id, clinic_id);
create unique index appointments_no_double_book
  on public.appointments(doctor_id, appointment_date, start_time)
  where status in ('pending', 'confirmed');
create index appointments_clinic_day_idx
  on public.appointments(clinic_id, appointment_date, start_time);
create index appointments_doctor_date_idx
  on public.appointments(doctor_id, appointment_date, start_time);

create table public.message_log (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  template text not null check (template in ('booking_received', 'confirmed', 'cancelled')),
  recipient_phone text not null,
  status text not null check (status in ('sent', 'failed', 'not_configured')),
  error_text text,
  created_at timestamptz not null default now()
);
create index message_log_appt_idx on public.message_log(appointment_id, created_at desc);
create index message_log_clinic_created_idx on public.message_log(clinic_id, created_at desc);

alter table public.cities enable row level security;
alter table public.clinics enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.appointments enable row level security;
alter table public.message_log enable row level security;

create policy "active cities are public" on public.cities for select using (active);
create policy "clinics are public" on public.clinics for select using (true);
create policy "owners insert their clinic" on public.clinics for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "owners update their clinic" on public.clinics for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy "active doctors are public" on public.doctors for select using (
  active or exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid()))
);
create policy "owners insert doctors" on public.doctors for insert to authenticated with check (
  exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid()))
);
create policy "owners update doctors" on public.doctors for update to authenticated using (
  exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid()))
) with check (exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid())));
create policy "owners delete doctors without appointments" on public.doctors for delete to authenticated using (
  exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid()))
  and not exists (select 1 from public.appointments a where a.doctor_id = id)
);

create policy "schedules are public" on public.doctor_schedules for select using (true);
create policy "owners insert schedules" on public.doctor_schedules for insert to authenticated with check (
  exists (select 1 from public.doctors d join public.clinics c on c.id = d.clinic_id where d.id = doctor_id and c.owner_id = (select auth.uid()))
);
create policy "owners update schedules" on public.doctor_schedules for update to authenticated using (
  exists (select 1 from public.doctors d join public.clinics c on c.id = d.clinic_id where d.id = doctor_id and c.owner_id = (select auth.uid()))
) with check (exists (select 1 from public.doctors d join public.clinics c on c.id = d.clinic_id where d.id = doctor_id and c.owner_id = (select auth.uid())));
create policy "owners delete schedules" on public.doctor_schedules for delete to authenticated using (
  exists (select 1 from public.doctors d join public.clinics c on c.id = d.clinic_id where d.id = doctor_id and c.owner_id = (select auth.uid()))
);

create policy "owners read appointments" on public.appointments for select to authenticated using (
  exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid()))
);
create policy "owners update appointments" on public.appointments for update to authenticated using (
  exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid()))
) with check (exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid())));

create policy "owners read message log" on public.message_log for select to authenticated using (
  exists (select 1 from public.clinics c where c.id = clinic_id and c.owner_id = (select auth.uid()))
);

revoke insert, update, delete on public.cities from anon, authenticated;
revoke insert, update, delete on public.appointments from anon;
revoke all on public.message_log from anon;
