alter table public.appointments
  add column if not exists patient_email text;

alter table public.appointments
  drop constraint if exists appointments_patient_email_check;

alter table public.appointments
  add constraint appointments_patient_email_check
  check (
    patient_email is null
    or (
      char_length(patient_email) between 3 and 254
      and patient_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    )
  );

comment on column public.appointments.patient_email is
  'Patient email used only for transactional appointment updates.';
