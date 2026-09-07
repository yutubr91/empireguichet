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
// Anti-bruteforce : la vérification de currentPin partage le même compteur
// d'échecs que verify-pin (pin_failed_attempts/pin_locked_until) — sinon on
// pourrait contourner la limite de verify-pin en devinant le PIN ici.
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

    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return json({ error: "Session invalide." });
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const newPin = typeof body?.newPin === "string" ? body.newPin : "";
    const currentPin = typeof body?.currentPin === "string" ? body.currentPin : "";
    if (!/^\d{4}$/.test(newPin)) {
      return json({ error: "Le nouveau code PIN doit contenir exactement 4 chiffres." });
    }

    const { data: agentRow, error: agentErr } = await admin
      .from("agents")
      .select("pin_hash, pin_reset_required, pin_failed_attempts, pin_locked_until")
      .eq("id", userId)
      .single();
    if (agentErr || !agentRow) return json({ error: "Compte introuvable." });

    const storedHash = agentRow.pin_hash as string | null;
    const isBcrypt = typeof storedHash === "string" && /^\$2[aby]\$/.test(storedHash);
    // Un compte marqué "pin_reset_required" (ancien compte forcé à recréer
    // son PIN après le renforcement de sécurité) n'a pas besoin de fournir
    // l'ancien PIN — exactement comme un ancien PIN en clair pré-migration.
    const requiresCurrentPin = isBcrypt && !agentRow.pin_reset_required;

    if (requiresCurrentPin) {
      // Compte déjà verrouillé suite à trop d'échecs récents (sur cette
      // fonction ou sur verify-pin, compteur partagé) ?
      const lockedUntil = agentRow.pin_locked_until ? new Date(agentRow.pin_locked_until as string) : null;
      if (lockedUntil && lockedUntil.getTime() > Date.now()) {
        const minutesLeft = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000));
        return json(
          { error: `Trop de tentatives. Réessaie dans ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.` });
      }

      // Vrai changement de PIN : le PIN actuel doit être fourni et correct.
      if (!/^\d{4}$/.test(currentPin)) {
        return json({ error: "Code PIN actuel requis." });
      }
      if (!bcrypt.compareSync(currentPin, storedHash as string)) {
        const newAttempts = (agentRow.pin_failed_attempts ?? 0) + 1;
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString();
          await admin.from("agents").update({ pin_failed_attempts: 0, pin_locked_until: lockUntil }).eq("id", userId);
          return json(
            { error: `Trop de tentatives incorrectes. Compte bloqué ${LOCKOUT_MINUTES} minutes pour ta sécurité.` });
        }
        await admin.from("agents").update({ pin_failed_attempts: newAttempts }).eq("id", userId);
        return json({ error: "Code PIN actuel incorrect.", attemptsRemaining: MAX_ATTEMPTS - newAttempts });
      }
      // PIN actuel correct : réinitialise le compteur d'échecs.
      if ((agentRow.pin_failed_attempts ?? 0) > 0 || agentRow.pin_locked_until) {
        await admin.from("agents").update({ pin_failed_attempts: 0, pin_locked_until: null }).eq("id", userId);
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
      return json({ error: "Erreur lors de l'enregistrement : " + updateErr.message });
    }

    return json({ success: true });
  } catch (_e) {
    return json({ error: "Erreur serveur." });
  }
});
