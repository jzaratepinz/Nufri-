# Control de jornada Nufri 2027

App estática para registrar las jornadas del año 2027.

## Funciones

- Calendario mensual con todos los días de cada mes.
- Registro de entrada, salida y pausa de almuerzo.
- Cálculo de horas solo cuando se introducen entrada y salida.
- Domingos resaltados como días no laborables y separadores semanales.
- Resumen mensual y exportación CSV.
- Cotización EUR/COP de referencia consultada desde Frankfurter.
- Referencias orientativas al Estatuto de los Trabajadores español.
- Guardado local y sincronización entre dispositivos con cuenta Supabase.

## Configuración de Supabase

1. En el proyecto de Supabase, abre **SQL Editor** y ejecuta el contenido de [supabase/schema.sql](supabase/schema.sql).
2. En **Authentication > Providers > Email**, deja activo el acceso por correo. Si la confirmación de correo está habilitada, confirma la dirección al crear la cuenta.
3. Publica el sitio desde GitHub Pages. La clave publishable está en el código del cliente y es segura para este uso; la tabla tiene RLS y cada usuario solo puede leer y modificar sus propios meses. No pongas nunca una clave secreta en el sitio.

La primera vez que inicies sesión, los meses que existan en el navegador se copian a tu cuenta. Los meses existentes en Supabase se descargan en el navegador. Mantén una copia CSV de los datos importantes.

La tasa de cambio es una referencia pública y puede llevar retraso; no es una cotización bancaria en tiempo real. La sección laboral es orientativa y no sustituye la revisión del convenio, contrato o sistema de registro de la empresa.
