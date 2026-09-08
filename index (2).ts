// Edge Function : verify-pin
//
// Vérifie le PIN de transaction (4 chiffres) saisi par l'agent connecté,
// SANS jamais renvoyer ni exposer le hash bcrypt stocké en base au client.
// La comparaison bcrypt se fait ici, côté serveur, avec la clé
// service_role — cette clé n'existe que dans l'environnement de la
// fonction et n'est jamais envoyée au navigateur.
//
// Aucune valeur fixe n'est jamais acceptée, quel que soit l'état du compte :
// - PIN bcrypt (cas normal) : comparaison bcrypt.
// - Ancien PIN en clair (compte pas encore migré) : comparé à sa VRAIE
//   valeur stockée, jamais à une constante — et de toute façon l'app
//   bloque déjà ces comptes sur un écran de recréation de PIN avant de les
//   laisser faire quoi que ce soit (pinNeedsReset).
// - Pas de PIN du tout (pin_hash null) : toujours refusé.
//
// Anti-bruteforce : après MAX_ATTEMPTS échecs consécutifs, le compte est
// verrouillé LOCKOUT_MINUTES minutes (compteur partagé avec set-pin, qui
// vérifie aussi un PIN — sinon on pourrait contourner cette limite en
// devinant le PIN via set-pin à la place).
//
// Appel côté client :
//   const { data } = await supabase.functions.invoke("verify-pin", {
//     body: { pin: "1234" },
//   });
//   // data.valid === true | false
//   // si false : data.error (verrouillé) ou data.attemptsRemaining
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import bcrypt from "npm:bcryptjs@3.0.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

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
    return json({ error: "Méthode non autorisée." });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ error: "Non authentifié." });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Vérifie le JWT et récupère l'utilisateur authentifié — on ne fait
    // jamais confiance à un userId envoyé par le client.
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return json({ error: "Session invalide." });
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const pin = typeof body?.pin === "string" ? body.pin : "";
    if (!/^\d{4}$/.test(pin)) return json({ error: "Code PIN invalide." });

    const { data: agentRow, error: agentErr } = await admin
      .from("agents")
      .select("pin_hash, pin_failed_attempts, pin_locked_until")
      .eq("id", userId)
      .single();
    if (agentErr || !agentRow) return json({ error: "Compte introuvable." });

    // Compte déjà verrouillé suite à trop d'échecs récents ?
    const lockedUntil = agentRow.pin_locked_until ? new Date(agentRow.pin_locked_until as string) : null;
    if (lockedUntil && lockedUntil.getTime() > Date.now()) {
      const minutesLeft = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000));
      return json(
        { valid: false, error: `Trop de tentatives. Réessaie dans ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.` });
    }

    const storedHash = agentRow.pin_hash as string | null;
    if (!storedHash) {
      // Aucun PIN configuré du tout : ne compte pas comme une tentative
      // ratée (ce n'est pas de la devinette, il n'y a rien à deviner) —
      // message clair invitant à en créer un.
      return json({ valid: false, error: "Aucun code PIN configuré. Crée-en un dans Paramètres avant de continuer." });
    }

    const isBcrypt = typeof storedHash === "string" && /^\$2[aby]\$/.test(storedHash);
    // Ancien PIN stocké en clair (compte pas encore migré) : comparé à sa
    // vraie valeur, jamais à une constante devinable.
    const valid = isBcrypt ? bcrypt.compareSync(pin, storedHash) : pin === storedHash;

    if (valid) {
      // Réinitialise le compteur d'échecs en cas de succès.
      if ((agentRow.pin_failed_attempts ?? 0) > 0 || agentRow.pin_locked_until) {
        await admin.from("agents").update({ pin_failed_attempts: 0, pin_locked_until: null }).eq("id", userId);
      }
      return json({ valid: true });
    }

    const newAttempts = (agentRow.pin_failed_attempts ?? 0) + 1;
    if (newAttempts >= MAX_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString();
      await admin.from("agents").update({ pin_failed_attempts: 0, pin_locked_until: lockUntil }).eq("id", userId);
      return json(
        { valid: false, error: `Trop de tentatives incorrectes. Compte bloqué ${LOCKOUT_MINUTES} minutes pour ta sécurité.` });
    }
    await admin.from("agents").update({ pin_failed_attempts: newAttempts }).eq("id", userId);
    return json({ valid: false, attemptsRemaining: MAX_ATTEMPTS - newAttempts });
  } catch (_e) {
    return json({ error: "Erreur serveur." });
  }
});
