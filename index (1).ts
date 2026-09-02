// Edge Function : verify-pin
//
// Vérifie le PIN de transaction (4 chiffres) saisi par l'agent connecté,
// SANS jamais renvoyer ni exposer le hash bcrypt stocké en base au client.
// La comparaison bcrypt se fait ici, côté serveur, avec la clé
// service_role — cette clé n'existe que dans l'environnement de la
// fonction et n'est jamais envoyée au navigateur.
//
// Appel côté client :
//   const { data } = await supabase.functions.invoke("verify-pin", {
//     body: { pin: "1234" },
//   });
//   // data.valid === true | false
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import bcrypt from "npm:bcryptjs@3.0.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Doit rester identique au DEMO_PIN défini côté client (App.jsx), pour les
// comptes de démo qui n'ont pas encore de PIN sécurisé.
const DEMO_PIN = "1234";

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

    // Vérifie le JWT et récupère l'utilisateur authentifié — on ne fait
    // jamais confiance à un userId envoyé par le client.
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
      // Pas encore de PIN sécurisé (compte de démo, ou ancien PIN en clair
      // pré-migration) : on retombe sur le PIN de démo pour ne rien casser.
      return json({ valid: pin === DEMO_PIN });
    }

    const valid = bcrypt.compareSync(pin, storedHash as string);
    return json({ valid });
  } catch (_e) {
    return json({ error: "Erreur serveur." }, 500);
  }
});
