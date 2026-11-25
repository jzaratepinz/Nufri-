import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "GET" && request.method !== "POST") return respond({ error: "Método no permitido" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}")?.default;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}")?.default;
  if (!url || !serviceKey || !anonKey) return respond({ error: "Falta configurar Supabase" }, 500);

  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.trim().toLowerCase().startsWith("bearer ") ? authorization.trim().slice(7).trim() : authorization.trim();
  if (!token) return respond({ error: "Inicia sesión" }, 401);

  const authClient = createClient(url, anonKey, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: { user: caller }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !caller) return respond({ error: "Sesión no válida" }, 401);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: role, error: roleError } = await authClient.from("app_admins").select("user_id").eq("user_id", caller.id).maybeSingle();
  if (roleError) return respond({ error: "No se pudo comprobar el perfil de administrador" }, 500);
  if (!role) return respond({ error: "Acceso reservado al administrador" }, 403);

  if (request.method === "GET") {
    const users = [];
    for (let page = 1; page <= 100; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) return respond({ error: "No se pudieron consultar las cuentas" }, 500);
      users.push(...data.users.map((user) => ({
        id: user.id,
        email: user.email || "",
        created_at: user.created_at,
        display_name: String(user.user_metadata?.display_name || user.user_metadata?.full_name || ""),
      })));
      if (data.users.length < 1000) break;
    }
    return respond(users);
  }

  let body: { action?: string; userId?: string; password?: string };
  try { body = await request.json(); } catch { return respond({ error: "Solicitud no válida" }, 400); }
  if (body.action !== "set-password" || !body.userId || !/^[0-9a-f-]{36}$/i.test(body.userId)) return respond({ error: "Datos no válidos" }, 400);
  if (body.userId === caller.id) return respond({ error: "Cambia tu propia contraseña desde Mi perfil" }, 400);
  if (typeof body.password !== "string" || body.password.length < 8) return respond({ error: "La contraseña debe tener al menos 8 caracteres" }, 400);

  const { error } = await admin.auth.admin.updateUserById(body.userId, { password: body.password });
  if (error) return respond({ error: "No se pudo actualizar la contraseña" }, 400);
  return respond({ success: true });
});

