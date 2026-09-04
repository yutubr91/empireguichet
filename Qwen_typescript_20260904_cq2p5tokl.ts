import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import bcrypt from "npm:bcryptjs@3.0.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Méthode non autorisée." }, 405);
  }
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ error: "Non authentifié." }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return json({ error: "Session invalide." }, 401);

    const userId = userData.user.id;
    const body = await req.json().catch(() => ({}));
    const pin = typeof body?.pin === "string" ? body.pin : "";

    if (!/^\d{4}$/.test(pin)) return json({ error: "Code PIN invalide." }, 400);

    const { data: agentRow, error: agentErr } = await admin
      .from("agents")
      .select("pin_hash")
      .eq("id", userId)
      .single();

    if (agentErr || !agentRow) return json({ error: "Compte introuvable." }, 404);

    const storedHash = agentRow.pin_hash as string | null;
    const isBcrypt = typeof storedHash === "string" && /^\$2[aby]\$/.test(storedHash);

    if (!isBcrypt) {
      return json({ valid: pin === "1234" });
    }

    const valid = bcrypt.compareSync(pin, storedHash as string);
    return json({ valid });
  } catch (_e) {
    return json({ error: "Erreur serveur." }, 500);
  }
});