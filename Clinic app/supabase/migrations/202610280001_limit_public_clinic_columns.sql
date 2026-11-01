-- Keep public clinic details available while hiding internal ownership IDs.
revoke select on table public.clinics from anon;

grant select (id, city_id, name, address, phone, created_at)
  on table public.clinics to anon;

create index if not exists appointments_phone_created_idx
  on public.appointments(patient_phone, created_at desc);

create index if not exists appointments_doctor_created_idx
  on public.appointments(doctor_id, created_at desc);
