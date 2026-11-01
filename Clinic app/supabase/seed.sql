insert into public.cities (id, name, slug, country, timezone)
values ('10000000-0000-0000-0000-000000000001', 'Charsadda', 'charsadda', 'Pakistan', 'Asia/Karachi')
on conflict (slug) do nothing;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'city@example.test', crypt('ClinicBook123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'family@example.test', crypt('ClinicBook123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
on conflict (id) do nothing;

insert into auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select id, id::text, id, jsonb_build_object('sub', id::text, 'email', email), 'email', now(), now(), now()
from auth.users where id in ('20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002')
on conflict (provider_id, provider) do nothing;

insert into public.clinics (id, owner_id, city_id, name, address, phone) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'City Medical Clinic', 'Mardan Road, Charsadda', '0300-1234567'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Family Care Clinic', 'Peshawar Road, Charsadda', '0312-7654321')
on conflict (id) do nothing;

insert into public.doctors (id, clinic_id, name, specialty, qualifications, fee_pkr) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Ahmed Khan', 'general', 'MBBS, FCPS', 1500),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Sana Ali', 'children', 'MBBS, DCH', 1800),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'Ayesha Noor', 'women', 'MBBS, FCPS', 2000),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'Bilal Shah', 'skin', 'MBBS, MCPS', 1700)
on conflict (id) do nothing;

insert into public.doctor_schedules (doctor_id, weekday, start_time, end_time, slot_minutes)
select doctor_id, weekday, '09:00', '12:00', 30
from (values
  ('40000000-0000-0000-0000-000000000001'::uuid),
  ('40000000-0000-0000-0000-000000000002'::uuid),
  ('40000000-0000-0000-0000-000000000003'::uuid),
  ('40000000-0000-0000-0000-000000000004'::uuid)
) doctors(doctor_id)
cross join generate_series(1, 6) weekdays(weekday)
on conflict (doctor_id, weekday) do nothing;
