-- Public visitors only need active doctors. Keep the owner check separate so
-- anonymous requests never need permission to read clinics.owner_id.
drop policy if exists "active doctors are public" on public.doctors;

create policy "active doctors are public"
  on public.doctors for select
  using (active);

create policy "owners read their doctors"
  on public.doctors for select to authenticated
  using (
    exists (
      select 1
      from public.clinics c
      where c.id = clinic_id
        and c.owner_id = (select auth.uid())
    )
  );
