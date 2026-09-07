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
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Message unique, volontairement identique que le numéro existe ou non, ou
// que le mot de passe soit faux — pour ne jamais laisser deviner à un
// attaquant si un numéro est associé à un compte.
const GENERIC_ERROR = "Numéro ou mot de passe incorrect.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return new Response(JSON.stringify({ error: "Numéro et mot de passe requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    // Résout l'e-mail depuis le téléphone avec la clé service_role — cette
    // requête contourne la RLS mais reste entièrement côté serveur, jamais
    // exposée au client.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: agentRow } = await adminClient
      .from("agents")
      .select("email")
      .eq("phone", phone)
      .maybeSingle();

    if (!agentRow?.email) {
      // Même message que pour un mauvais mot de passe : aucune fuite
      // d'information sur l'existence du numéro.
      return new Response(JSON.stringify({ error: GENERIC_ERROR }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      return new Response(JSON.stringify({ error: GENERIC_ERROR }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user_id: data.user.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Erreur serveur, réessaie." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
