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
    const newPin = typeof body?.newPin === "string" ? body.newPin : "";
    const currentPin = typeof body?.currentPin === "string" ? body.currentPin : "";

    if (!/^\d{4}$/.test(newPin)) {
      return json({ error: "Le nouveau code PIN doit contenir exactement 4 chiffres." }, 400);
    }

    const { data: agentRow, error: agentErr } = await admin
      .from("agents")
      .select("pin_hash")
      .eq("id", userId)
      .single();

    if (agentErr || !agentRow) return json({ error: "Compte introuvable." }, 404);

    const storedHash = agentRow.pin_hash as string | null;
    const isBcrypt = typeof storedHash === "string" && /^\$2[aby]\$/.test(storedHash);

    if (isBcrypt) {
      if (!/^\d{4}$/.test(currentPin)) {
        return json({ error: "Code PIN actuel requis." }, 400);
      }
      if (!bcrypt.compareSync(currentPin, storedHash as string)) {
        return json({ error: "Code PIN actuel incorrect." }, 401);
      }
    }

    const newHash = bcrypt.hashSync(newPin, 10);
    const { error: updateErr } = await admin
      .from("agents")
      .update({ pin_hash: newHash, pin_reset_required: false })
      .eq("id", userId);

    if (updateErr) {
      return json({ error: "Erreur lors de l'enregistrement : " + updateErr.message }, 500);
    }

    return json({ success: true });
  } catch (_e) {
    return json({ error: "Erreur serveur." }, 500);
  }
});