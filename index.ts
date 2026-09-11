// Edge Function : login-by-phone
//
// Remplace l'ancien flux "get_email_by_phone (RPC accessible à anon) puis
// signInWithPassword côté client". Problème de l'ancien flux : n'importe qui
// pouvait appeler get_email_by_phone directement (sans authentification) et
// récupérer l'e-mail réel associé à un numéro de téléphone — un attaquant
// pouvait ainsi constituer une base d'e-mails valides en essayant des
// numéros au hasard, sans jamais se connecter.
//
// Ici, la correspondance téléphone → e-mail se fait ENTIÈREMENT côté
// serveur, avec la clé service_role, et l'e-mail n'est JAMAIS renvoyé au
// client — ni en cas de succès, ni en cas d'échec. Le message d'erreur est
// volontairement identique que le numéro existe ou non ("Numéro ou mot de
// passe incorrect."), pour ne rien laisser deviner à un attaquant.
//
// Anti-bruteforce : après MAX_ATTEMPTS mots de passe incorrects consécutifs
// sur un même compte, celui-ci est verrouillé LOCKOUT_MINUTES minutes —
// même principe que verify-pin/set-pin, mais avec son propre compteur
// (login_failed_attempts/login_locked_until) : se connecter au compte et
// confirmer une transaction sont deux frontières de sécurité différentes,
// elles ne doivent pas partager le même verrou.
//
// Appel côté client :
//   const { data } = await supabase.functions.invoke("login-by-phone", {
//     body: { phone: "+225 0102030405", password: "..." },
//   });
//   // en cas de succès : { access_token, refresh_token, user_id }
//   // en cas d'échec   : { error: "Numéro ou mot de passe incorrect." }
//
// ⚠️ À déployer avec la vérification JWT désactivée (aucune session
// n'existe encore avant la connexion) :
//   supabase functions deploy login-by-phone --no-verify-jwt
//
// ⚠️ Nécessite la migration supabase_migration_securite_login_phone.sql
// (colonnes login_failed_attempts / login_locked_until sur agents).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// Message unique, volontairement identique que le numéro existe ou non, ou
// que le mot de passe soit faux — pour ne jamais laisser deviner à un
// attaquant si un numéro est associé à un compte.
const GENERIC_ERROR = "Numéro ou mot de passe incorrect.";

// Même message que ci-dessus, mais avec le temps d'attente — communiqué
// seulement une fois qu'on sait déjà que le compte existe et est verrouillé,
// donc ça ne révèle rien de plus qu'un attaquant ne saurait déjà.
function lockedMessage(lockedUntil: Date) {
  const minutesLeft = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000));
  return `Trop de tentatives. Réessaie dans ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.`;
}

// Toujours répondre en HTTP 200 : la bibliothèque cliente Supabase
// n'expose le contenu JSON dans "data" que pour les statuts 2xx — un
// statut d'erreur (401, 429...) ferait disparaître notre message précis
// derrière une erreur générique. Le vrai résultat est donc uniquement
// porté par le contenu (error / access_token...), jamais par le code HTTP.
function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return json({ error: "Numéro et mot de passe requis." });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    // Résout l'e-mail depuis le téléphone avec la clé service_role — cette
    // requête contourne la RLS mais reste entièrement côté serveur, jamais
    // exposée au client. On récupère aussi l'id et l'état du verrou pour
    // gérer l'anti-bruteforce.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: agentRow } = await adminClient
      .from("agents")
      .select("id, email, login_failed_attempts, login_locked_until")
      .eq("phone", phone)
      .maybeSingle();

    if (!agentRow?.email) {
      // Même message que pour un mauvais mot de passe : aucune fuite
      // d'information sur l'existence du numéro. Pas de compteur à
      // incrémenter non plus : il n'y a personne à verrouiller.
      return json({ error: GENERIC_ERROR });
    }

    // Compte déjà verrouillé suite à trop d'échecs récents ?
    const lockedUntil = agentRow.login_locked_until ? new Date(agentRow.login_locked_until as string) : null;
    if (lockedUntil && lockedUntil.getTime() > Date.now()) {
      return json({ error: lockedMessage(lockedUntil) });
    }

    // Vérifie le mot de passe via l'API Auth standard (clé anon, comme le
    // ferait le navigateur) — l'e-mail utilisé ici ne quitte jamais cette
    // fonction.
    const authClient = createClient(supabaseUrl, anonKey);
    const { data, error } = await authClient.auth.signInWithPassword({
      email: agentRow.email,
      password,
    });

    if (error || !data?.session) {
      const newAttempts = (agentRow.login_failed_attempts ?? 0) + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString();
        await adminClient
          .from("agents")
          .update({ login_failed_attempts: 0, login_locked_until: lockUntil })
          .eq("id", agentRow.id);
      } else {
        await adminClient
          .from("agents")
          .update({ login_failed_attempts: newAttempts })
          .eq("id", agentRow.id);
      }
      return json({ error: GENERIC_ERROR });
    }

    // Connexion réussie : réinitialise le compteur d'échecs.
    if ((agentRow.login_failed_attempts ?? 0) > 0 || agentRow.login_locked_until) {
      await adminClient
        .from("agents")
        .update({ login_failed_attempts: 0, login_locked_until: null })
        .eq("id", agentRow.id);
    }

    return json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user_id: data.user.id,
    });
  } catch (_e) {
    return json({ error: "Erreur serveur, réessaie." });
  }
});
