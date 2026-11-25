# Control de jornada Nufri 2027

**© 2026 Jhon Zarate. Todos los derechos reservados.**  
Autor y titular del proyecto: Jhon Zarate.

App estática para registrar jornadas, gastos y tarifas por mes. La interfaz se publica en GitHub Pages y sincroniza los datos de cada cuenta con Supabase.

## Funciones

- Calendario mensual y vista de lista con Entrada, Salida, almuerzo y observaciones.
- Cálculo de horas solo cuando entrada y salida están completas; el total semanal aparece al final de cada semana.
- Importación de un Excel al año seleccionado, conservando mes y día de las fechas de origen.
- Resumen mensual de horas, valor en euros y COP, gastos y disponible estimado.
- Registro de gastos por categoría y tipo de cambio EUR/COP de referencia de Frankfurter.
- Registro y acceso independiente para cada usuario, con datos privados por cuenta.
- Perfil con nombre, avatar y cambio de contraseña. Área de administración para ver cuentas y establecer contraseñas temporales.
- Referencias informativas al marco laboral español.

## Supabase: tabla y roles

1. Abre **SQL Editor** en el proyecto Supabase y ejecuta el archivo [supabase/schema.sql](supabase/schema.sql). Además de la tabla de jornadas, crea la tabla de administradores con RLS: cada sesión solo puede consultar su propio rol.
2. Registra tu cuenta en Nufri y confirma el correo.
3. Abre [supabase/bootstrap_admin.sql](supabase/bootstrap_admin.sql), sustituye `REEMPLAZA_POR_TU_CORREO` por el correo exacto de tu cuenta confirmada y ejecuta el bloque en SQL Editor. No configures ese paso para otra dirección; las cuentas nuevas nunca pueden concederse el rol administrador desde la app.
4. Despliega la función privada desde la raíz del repositorio. Si aún no lo has hecho, inicia sesión en Supabase CLI con `supabase login`; luego ejecuta `supabase functions deploy admin-users --project-ref obifekwncoeuhvcnbckk`.
5. La función lee las variables integradas `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEYS` y `SUPABASE_SECRET_KEYS` (con compatibilidad con las variables legacy `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`). Supabase las proporciona al entorno Edge Functions. **Nunca copies una clave secret/service role a GitHub ni al HTML.**

La lista de cuentas y los cambios de contraseña solo se ofrecen después de verificar el rol en el servidor. Para otra persona, el cambio de contraseña funciona como restablecimiento administrativo; avísale que inicie sesión y la cambie en su perfil. El alta pública depende de que el proveedor Email esté habilitado en Supabase; se recomienda mantener activa la confirmación de correo.

### Aislamiento de datos en el dispositivo

Los datos locales conservan un propietario de cuenta. Si inicia sesión otra cuenta en el mismo navegador, la app separa la caché de la primera y carga los registros de la segunda; no copia automáticamente las jornadas locales de una persona a otra. Los datos remotos se guardan en `attendance_months` bajo RLS por `user_id`.

## Publicación

GitHub Pages publica `index.html`, `manifest.webmanifest` y los iconos desde `main`. Los cambios de la interfaz se publican al actualizar la rama principal. La Edge Function se despliega por separado en Supabase.

## Documentación técnica

- `index.html` contiene la interfaz responsive, estilos, navegación, calendario, formularios, cálculos, gastos e integración cliente Supabase.
- `supabase/schema.sql` define tablas y políticas RLS. `supabase/bootstrap_admin.sql` asigna el rol administrador a la cuenta confirmada que el propietario indique.
- `supabase/functions/admin-users/index.ts` comprueba el token y el rol del solicitante en el servidor; usa la clave service role solo en el entorno privado de Supabase para consultar cuentas y restablecer contraseñas.
- Los datos de jornadas, gastos, tasas y avatar se sincronizan por cuenta. No almacenar contraseñas en `localStorage`.
- `manifest.webmanifest` y `nufri-icon.svg` configuran instalación e icono.

## Notas

La tasa EUR/COP es una referencia pública y puede tener retraso; no es una cotización bancaria exacta ni en tiempo real. Las notas laborales son generales y no reemplazan contrato, convenio colectivo ni asesoramiento profesional.

## Autoría y derechos

El proyecto y su código se atribuyen a **Jhon Zarate**. El aviso de copyright identifica la autoría del trabajo; no concede permiso para reutilizar, modificar o redistribuir el código. Para usar una licencia de software específica, el titular debe añadir una licencia elegida por él.

