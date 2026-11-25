-- Ejecuta este archivo en Supabase > SQL Editor.
create table if not exists public.attendance_months (
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_key text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, storage_key)
);

-- Permite jornadas, gastos y tarifas guardados por el cliente.
alter table public.attendance_months
  drop constraint if exists attendance_months_storage_key_check;
alter table public.attendance_months
  add constraint attendance_months_storage_key_check
  check (
    storage_key like 'nufri-jornada-v1-%'
    or storage_key like 'nufri-expenses-v1-%'
    or storage_key like 'nufri-settings-v1-%'
  );

alter table public.attendance_months enable row level security;
grant select, insert, update, delete on public.attendance_months to authenticated;

drop policy if exists "Users can read own attendance months" on public.attendance_months;
create policy "Users can read own attendance months" on public.attendance_months
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can insert own attendance months" on public.attendance_months;
create policy "Users can insert own attendance months" on public.attendance_months
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update own attendance months" on public.attendance_months;
create policy "Users can update own attendance months" on public.attendance_months
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own attendance months" on public.attendance_months;
create policy "Users can delete own attendance months" on public.attendance_months
  for delete to authenticated using (auth.uid() = user_id);
