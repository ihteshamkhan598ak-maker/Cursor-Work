begin;
select plan(6);

select ok((select relrowsecurity from pg_class where oid = 'public.appointments'::regclass), 'appointments RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.message_log'::regclass), 'message log RLS enabled');
select matches(pg_get_indexdef('public.appointments_doctor_date_idx'::regclass), 'ON public.appointments', 'doctor/date index targets appointments');

set local role anon;
select is((select count(*) from public.appointments), 0::bigint, 'anonymous users cannot read appointments');
select is((select count(*) from public.message_log), 0::bigint, 'anonymous users cannot read message logs');
select throws_ok(
  'select owner_id from public.clinics',
  '42501',
  'permission denied for table clinics',
  'anonymous users cannot read clinic owner IDs'
);

select * from finish();
rollback;
