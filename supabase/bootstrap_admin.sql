-- Ejecuta este bloque una sola vez después de reemplazar el correo.
-- Usa el correo exacto de la cuenta Nufri del propietario.
do $$
declare
  admin_id uuid;
begin
  select id into admin_id
  from auth.users
  where lower(email) = lower('REEMPLAZA_POR_TU_CORREO')
    and email_confirmed_at is not null;

  if admin_id is null then
    raise exception 'No existe una cuenta confirmada con ese correo';
  end if;

  insert into public.app_admins (user_id)
  values (admin_id)
  on conflict (user_id) do nothing;
end $$;

