// Edge Function : set-pin
//
// Crée ou change le PIN (4 chiffres) de l'agent connecté. Le hachage bcrypt
// se fait ici, côté serveur — jamais dans le navigateur — et le nouveau
// hash est écrit directement en base avec la clé service_role.
//
// - Si l'agent a déjà un PIN sécurisé (hash bcrypt en base), `currentPin`
//   est obligatoire et vérifié ici avant d'accepter le nouveau PIN
//   (cas : changement de PIN depuis Paramètres).
// - Sinon (inscription, ou ancien PIN en clair pré-migration), aucun
//   currentPin n'est requis — l'appelant est déjà authentifié via son
//   propre token Supabase (cas : inscription, réinitialisation forcée).
//
// Appel côté client :
//   await supabase.functions.invoke("set-pin", {
//     body: { newPin: "1234", currentPin: "0000" }, // currentPin optionnel
//   });
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
      .select("pin_hash, pin_reset_required")
      .eq("id", userId)
      .single();
    if (agentErr || !agentRow) return json({ error: "Compte introuvable." }, 404);

    const storedHash = agentRow.pin_hash as string | null;
    const isBcrypt = typeof storedHash === "string" && /^\$2[aby]\$/.test(storedHash);
    // Un compte marqué "pin_reset_required" (ancien compte forcé à recréer
    // son PIN après le renforcement de sécurité) n'a pas besoin de fournir
    // l'ancien PIN — exactement comme un ancien PIN en clair pré-migration.
    const requiresCurrentPin = isBcrypt && !agentRow.pin_reset_required;

    if (requiresCurrentPin) {
      // Vrai changement de PIN : le PIN actuel doit être fourni et correct.
      if (!/^\d{4}$/.test(currentPin)) {
        return json({ error: "Code PIN actuel requis." }, 400);
      }
      if (!bcrypt.compareSync(currentPin, storedHash as string)) {
        return json({ error: "Code PIN actuel incorrect." }, 401);
      }
    }
    // Sinon : création initiale (inscription) ou réinitialisation forcée
    // d'un ancien PIN en clair — déjà protégées par l'authentification de
    // la requête elle-même, pas de currentPin exigé ici.

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
