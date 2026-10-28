// Edge Function : usdt-payment
//
// Paiement automatique de l'abonnement (et du déblocage de l'historique) en USDT sur BNB Chain (BEP20).
// L'argent va directement sur le portefeuille du propriétaire : aucune clé privée n'est jamais stockée ici.
//
// Deux actions (POST, JSON, utilisateur connecté) :
//   { action: "create", type: "abonnement" | "historique" }
//       -> crée une demande de paiement avec un MONTANT UNIQUE (ex. 4.1723 USDT) et renvoie l'adresse du moment.
//   { action: "verify", payment_id: "<uuid>", tx_hash: "0x…" }
//       -> vérifie la transaction sur la blockchain (vrai jeton USDT, bon destinataire, montant exact,
//          confirmations suffisantes, transaction postérieure à la demande, numéro jamais utilisé)
//          puis active l'abonnement via la fonction SQL interne auto_validate_subscription_payment.
//
// Secrets à définir dans Supabase (Edge Functions → Secrets) :
//   USDT_RECEIVE_ADDRESS   (obligatoire) adresse 0x… de réception — modifiable à tout moment
//   USDT_RECEIVE_ADDRESS_PREVIOUS (facultatif) anciennes adresses (séparées par des virgules) : les paiements
//                          demandés avant un changement d'adresse restent vérifiables sur leur ancienne adresse
//   XOF_PER_USDT           (facultatif, défaut 600)   taux FCFA par USDT utilisé pour calculer le montant
//   PRICE_AGENT_FCFA / PRICE_MANAGER_FCFA / PRICE_HISTORIQUE_FCFA   (facultatifs, défauts 2500 / 2500 / 200)
//   BSC_RPC_URLS           (facultatif) liste d'URL de nœuds BNB Chain séparées par des virgules
//
// Les prix viennent UNIQUEMENT de ce serveur : jamais d'une valeur envoyée ou enregistrée par le client.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// ===== Constantes blockchain =====
// Binance-Peg BSC-USD (« USDT BEP20 ») — 18 décimales.
export const USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955";
// keccak256("Transfer(address,address,uint256)")
export const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
export const MIN_CONFIRMATIONS = 15;
const DEFAULT_RPC_URLS = [
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed.bnbchain.org",
  "https://bsc-rpc.publicnode.com",
];

const ALLOWED_ORIGINS = new Set([
  "https://empireguichet.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
]);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://empireguichet.vercel.app";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// ===== Fonctions pures (testées séparément) =====

/** Convertit un montant décimal texte (« 4.1723 ») en entier à 4 décimales (41723), sans passer par les flottants. */
export function parseUnits4(value: string): bigint | null {
  const m = /^(\d{1,10})(?:\.(\d{1,18}))?$/.exec(String(value).trim());
  if (!m) return null;
  const frac = (m[2] || "").padEnd(4, "0");
  // Au-delà de 4 décimales, tout doit être nul (nos montants n'en ont que 4).
  if (/[1-9]/.test(frac.slice(4))) return null;
  return BigInt(m[1]) * 10000n + BigInt(frac.slice(0, 4));
}

/** Entier à 4 décimales -> texte « 4.1723 ». */
export function formatUnits4(units: bigint): string {
  const whole = units / 10000n;
  const frac = (units % 10000n).toString().padStart(4, "0");
  return `${whole}.${frac}`;
}

/** Montant USDT de base arrondi au centième supérieur (en unités de 0,0001) : 2500 FCFA à 600 -> 4.17. */
export function baseUnits4(fcfa: number, xofPerUsdt: number): bigint {
  const cents = Math.ceil((fcfa * 100) / xofPerUsdt - 1e-9);
  return BigInt(cents) * 100n;
}

/** Montant exact attendu en plus petite unité du jeton (18 décimales). */
export function units4ToTokenUnits(units4: bigint): bigint {
  return units4 * 10n ** 14n;
}

export type RpcLog = { address: string; topics: string[]; data: string };

/** Transferts du vrai jeton USDT vers `toAddress` présents dans les logs d'une transaction. */
export function extractUsdtTransfers(logs: RpcLog[], toAddress: string): { from: string; value: bigint }[] {
  const to = toAddress.toLowerCase().replace(/^0x/, "");
  const out: { from: string; value: bigint }[] = [];
  for (const log of logs || []) {
    if (String(log.address).toLowerCase() !== USDT_CONTRACT) continue; // refuse tout faux jeton
    if (!Array.isArray(log.topics) || log.topics.length !== 3) continue;
    if (String(log.topics[0]).toLowerCase() !== TRANSFER_TOPIC) continue;
    if (String(log.topics[2]).toLowerCase().slice(-40) !== to) continue;
    if (!/^0x[0-9a-fA-F]{1,64}$/.test(String(log.data))) continue;
    out.push({ from: "0x" + String(log.topics[1]).toLowerCase().slice(-40), value: BigInt(log.data) });
  }
  return out;
}

/** Début du bimestre courant en UTC (même règle que l'application : 1er janvier, mars, mai, juillet, septembre, novembre). */
export function bimonthStartUtc(d = new Date()): string {
  const m = Math.floor(d.getUTCMonth() / 2) * 2;
  return `${d.getUTCFullYear()}-${String(m + 1).padStart(2, "0")}-01`;
}

export type VerifyInputs = {
  receipt: { status: string; blockNumber: string; logs: RpcLog[] } | null;
  latestBlock: bigint;
  blockTimestampSec: number | null;
  payToAddress: string;
  expectedUnits4: bigint;
  paymentCreatedAtMs: number;
};
export type VerifyResult =
  | { ok: true; confirmations: number }
  | { ok: false; reason: string; message: string; extra?: Record<string, unknown> };

/** Décision de vérification (aucun accès réseau) : toute la logique de sécurité est ici. */
export function evaluateTransaction(i: VerifyInputs): VerifyResult {
  if (!i.receipt) {
    return {
      ok: false,
      reason: "not_found",
      message: "Transaction introuvable pour le moment. Vérifie que le paiement est parti sur le réseau BNB Smart Chain (BEP20), puis réessaie dans une minute.",
    };
  }
  if (i.receipt.status !== "0x1") {
    return { ok: false, reason: "failed", message: "Cette transaction a échoué sur la blockchain : aucun montant n'a été reçu." };
  }
  const transfers = extractUsdtTransfers(i.receipt.logs, i.payToAddress);
  if (transfers.length === 0) {
    return {
      ok: false,
      reason: "no_transfer",
      message: "Aucun transfert d'USDT (réseau BEP20) vers l'adresse de paiement n'a été trouvé dans cette transaction. Vérifie le réseau, le jeton et l'adresse.",
    };
  }
  const expectedTokens = units4ToTokenUnits(i.expectedUnits4);
  if (!transfers.some((t) => t.value === expectedTokens)) {
    const best = transfers.reduce((a, b) => (b.value > a.value ? b : a));
    // Montant reçu ramené à 4 décimales pour l'affichage.
    const receivedUnits4 = best.value / 10n ** 14n;
    return {
      ok: false,
      reason: "amount_mismatch",
      message: `Le montant reçu (${formatUnits4(receivedUnits4)} USDT) est différent du montant demandé (${formatUnits4(i.expectedUnits4)} USDT). Le montant doit être exact, décimales comprises.`,
      extra: { received: formatUnits4(receivedUnits4), expected: formatUnits4(i.expectedUnits4) },
    };
  }
  // La transaction doit dater d'après la demande de paiement (évite de réutiliser un ancien paiement).
  if (i.blockTimestampSec === null || i.blockTimestampSec * 1000 < i.paymentCreatedAtMs - 5 * 60 * 1000) {
    return { ok: false, reason: "too_old", message: "Cette transaction date d'avant ta demande de paiement. Fais une nouvelle demande puis paie le montant affiché." };
  }
  const confirmations = Number(i.latestBlock - BigInt(i.receipt.blockNumber) + 1n);
  if (confirmations < MIN_CONFIRMATIONS) {
    return {
      ok: false,
      reason: "confirmations",
      message: `Transaction trouvée, mais pas encore assez confirmée (${Math.max(confirmations, 0)}/${MIN_CONFIRMATIONS}). Réessaie dans une minute.`,
      extra: { confirmations, needed: MIN_CONFIRMATIONS },
    };
  }
  return { ok: true, confirmations };
}

// ===== Accès blockchain (nœuds publics, avec repli) =====
function rpcUrls(): string[] {
  const custom = (Deno.env.get("BSC_RPC_URLS") || "").split(",").map((s) => s.trim()).filter(Boolean);
  return custom.length ? custom : DEFAULT_RPC_URLS;
}

async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  let lastErr = "aucun nœud disponible";
  for (const url of rpcUrls()) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 7000);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) { lastErr = `HTTP ${res.status}`; continue; }
      const json = await res.json();
      if (json.error) { lastErr = String(json.error.message || json.error); continue; }
      return json.result;
    } catch (e) {
      lastErr = String(e);
    }
  }
  throw new Error("Nœuds BNB Chain injoignables : " + lastErr);
}

// ===== Prix (côté serveur uniquement) =====
function envNumber(name: string, fallback: number): number {
  const n = Number(Deno.env.get(name));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
function priceFcfa(type: string, role: string | null): number {
  if (type === "historique") return envNumber("PRICE_HISTORIQUE_FCFA", 200);
  return role === "manager" ? envNumber("PRICE_MANAGER_FCFA", 2500) : envNumber("PRICE_AGENT_FCFA", 2500);
}
function receiveAddress(): string | null {
  const a = (Deno.env.get("USDT_RECEIVE_ADDRESS") || "").trim();
  return /^0x[0-9a-fA-F]{40}$/.test(a) ? a.toLowerCase() : null;
}
/** Adresses acceptées pour VÉRIFIER un paiement : l'adresse actuelle + d'éventuelles anciennes (paiements demandés avant un changement d'adresse). */
export function allowedAddresses(): string[] {
  const previous = (Deno.env.get("USDT_RECEIVE_ADDRESS_PREVIOUS") || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter((x) => /^0x[0-9a-f]{40}$/.test(x));
  const current = receiveAddress();
  return current ? [current, ...previous] : previous;
}

// ===== Gestionnaire =====
export async function handler(req: Request): Promise<Response> {
  const cors = getCorsHeaders(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "Méthode non autorisée." });

  try {
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ ok: false, error: "Non authentifié." });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData?.user) return json({ ok: false, error: "Session invalide." });
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const address = receiveAddress();
    if (!address) {
      console.error("[usdt-payment] USDT_RECEIVE_ADDRESS absent ou invalide");
      return json({ ok: false, error: "Le paiement USDT n'est pas encore configuré. Contacte l'équipe EmpireGuichet." });
    }

    if (body?.action === "create") return await createPayment(admin, userId, String(body.type || ""), address, json);
    if (body?.action === "verify") {
      return await verifyPayment(admin, userId, String(body.payment_id || ""), String(body.tx_hash || ""), json);
    }
    return json({ ok: false, error: "Action inconnue." });
  } catch (e) {
    console.error("[usdt-payment] erreur inattendue :", e);
    return json({ ok: false, error: "Erreur du service de paiement. Réessaie dans un instant." });
  }
}

type JsonFn = (body: unknown, status?: number) => Response;

export async function createPayment(admin: any, userId: string, type: string, address: string, json: JsonFn) {
  if (type !== "abonnement" && type !== "historique") return json({ ok: false, error: "Type de paiement invalide." });

  const { data: agentRow } = await admin.from("agents").select("role").eq("id", userId).maybeSingle();
  if (!agentRow) return json({ ok: false, error: "Compte introuvable." });

  // Libère les montants réservés par d'anciennes demandes jamais payées (plus de 7 jours, sans numéro de transaction).
  await admin
    .from("subscription_payments")
    .update({ status: "rejected", rejected_reason: "Expiré : aucun paiement détecté" })
    .eq("payment_method", "usdt_bep20")
    .eq("status", "pending")
    .is("tx_hash", null)
    .lt("created_at", new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString());

  // Une demande en attente pour la même adresse : on la réutilise (même montant) au lieu d'en créer une autre.
  const { data: existing } = await admin
    .from("subscription_payments")
    .select("id, usdt_expected, pay_to_address, type, created_at")
    .eq("agent_id", userId)
    .eq("type", type)
    .eq("status", "pending")
    .eq("payment_method", "usdt_bep20")
    .is("tx_hash", null)
    .eq("pay_to_address", address)
    .order("created_at", { ascending: false })
    .limit(1);
  if (existing && existing[0]) {
    const p = existing[0];
    return json({ ok: true, payment: publicPayment(p.id, type, String(p.usdt_expected), address, p.created_at) });
  }

  const fcfa = priceFcfa(type, agentRow.role);
  const rate = envNumber("XOF_PER_USDT", 600);
  const base = baseUnits4(fcfa, rate);
  const bytes = new Uint32Array(1);

  for (let attempt = 0; attempt < 15; attempt++) {
    crypto.getRandomValues(bytes);
    const suffix = BigInt((bytes[0] % 500) + 1); // +0,0001 à +0,0500 USDT : rend le montant unique parmi les demandes en attente
    const expected = formatUnits4(base + suffix);
    const { data, error } = await admin
      .from("subscription_payments")
      .insert({
        agent_id: userId,
        type,
        amount: fcfa,
        period_month: bimonthStartUtc(),
        payment_reference: "USDT BEP20 — en attente du paiement",
        status: "pending",
        payment_method: "usdt_bep20",
        usdt_expected: expected,
        pay_to_address: address,
      })
      .select("id, created_at")
      .single();
    if (!error && data) return json({ ok: true, payment: publicPayment(data.id, type, expected, address, data.created_at) });
    if (error?.code !== "23505") {
      console.error("[usdt-payment] création impossible :", error?.message);
      return json({ ok: false, error: "Impossible de créer la demande de paiement. Vérifie que la migration SQL « USDT automatique » a bien été exécutée." });
    }
  }
  return json({ ok: false, error: "Trop de demandes en cours. Réessaie dans quelques minutes." });
}

function publicPayment(id: string, type: string, amountUsdt: string, address: string, createdAt: string) {
  return { id, type, amount_usdt: amountUsdt, address, network: "BNB Smart Chain (BEP20)", created_at: createdAt };
}

export async function verifyPayment(admin: any, userId: string, paymentId: string, txHashRaw: string, json: JsonFn) {
  if (!/^[0-9a-fA-F-]{36}$/.test(paymentId)) return json({ ok: false, error: "Demande de paiement invalide." });
  const txHash = txHashRaw.trim().toLowerCase();
  if (!/^0x[0-9a-f]{64}$/.test(txHash)) {
    return json({ ok: false, reason: "bad_hash", error: "Numéro de transaction invalide : il doit commencer par 0x et faire 66 caractères." });
  }

  const { data: payment } = await admin
    .from("subscription_payments")
    .select("*")
    .eq("id", paymentId)
    .eq("agent_id", userId)
    .maybeSingle();
  if (!payment || payment.payment_method !== "usdt_bep20") return json({ ok: false, error: "Demande de paiement introuvable." });
  if (payment.status === "validated") return json({ ok: true, status: "validated" });
  if (payment.status !== "pending") return json({ ok: false, error: "Cette demande n'est plus active. Fais une nouvelle demande." });
  if (payment.tx_hash && String(payment.tx_hash).toLowerCase() !== txHash) {
    return json({ ok: false, error: "Cette demande est déjà associée à une autre transaction." });
  }

  // Garde-fou : le montant demandé ne peut pas être inférieur au prix réel calculé par le serveur.
  const { data: agentRow } = await admin.from("agents").select("role").eq("id", userId).maybeSingle();
  const rate = envNumber("XOF_PER_USDT", 600);
  const minUnits4 = (baseUnits4(priceFcfa(payment.type, agentRow?.role ?? null), rate) * 95n) / 100n;
  const expectedUnits4 = parseUnits4(String(payment.usdt_expected));
  const payTo = String(payment.pay_to_address || "").toLowerCase();
  if (expectedUnits4 === null || expectedUnits4 < minUnits4 || !allowedAddresses().includes(payTo)) {
    console.error("[usdt-payment] demande incohérente, vérification refusée :", paymentId);
    return json({ ok: false, error: "Cette demande de paiement est invalide. Fais-en une nouvelle." });
  }

  // Ce numéro de transaction ne doit servir qu'une seule fois, pour toute la plateforme.
  const { data: used } = await admin.from("subscription_payments").select("id").eq("tx_hash", txHash).neq("id", payment.id).limit(1);
  if (used && used.length > 0) return json({ ok: false, reason: "used", error: "Ce numéro de transaction a déjà été utilisé." });

  let evaluation: VerifyResult;
  try {
    const receipt = (await rpcCall("eth_getTransactionReceipt", [txHash])) as VerifyInputs["receipt"];
    let blockTimestampSec: number | null = null;
    let latestBlock = 0n;
    if (receipt) {
      const latestHex = (await rpcCall("eth_blockNumber", [])) as string;
      latestBlock = BigInt(latestHex);
      const block = (await rpcCall("eth_getBlockByNumber", [receipt.blockNumber, false])) as { timestamp?: string } | null;
      blockTimestampSec = block?.timestamp ? Number(BigInt(block.timestamp)) : null;
    }
    evaluation = evaluateTransaction({
      receipt,
      latestBlock,
      blockTimestampSec,
      payToAddress: payTo,
      expectedUnits4,
      paymentCreatedAtMs: new Date(payment.created_at).getTime(),
    });
  } catch (e) {
    console.error("[usdt-payment] blockchain injoignable :", e);
    return json({ ok: false, reason: "rpc", error: "La blockchain ne répond pas pour le moment. Réessaie dans une minute." });
  }

  if (!evaluation.ok) {
    if (evaluation.reason === "amount_mismatch") {
      // Garde une trace pour que le propriétaire puisse valider à la main s'il le juge utile.
      await admin
        .from("subscription_payments")
        .update({ payment_reference: `USDT BEP20 — montant différent (reçu ${evaluation.extra?.received}, attendu ${evaluation.extra?.expected}) — tx ${txHash}` })
        .eq("id", payment.id)
        .eq("status", "pending");
    }
    return json({ ok: false, reason: evaluation.reason, error: evaluation.message, ...(evaluation.extra || {}) });
  }

  // Paiement confirmé : on réserve le numéro de transaction (unique), puis on active.
  const { error: updErr } = await admin
    .from("subscription_payments")
    .update({ tx_hash: txHash, verified_at: new Date().toISOString(), payment_reference: `USDT BEP20 — tx ${txHash}` })
    .eq("id", payment.id)
    .eq("status", "pending");
  if (updErr) {
    if (updErr.code === "23505") return json({ ok: false, reason: "used", error: "Ce numéro de transaction a déjà été utilisé." });
    console.error("[usdt-payment] enregistrement du hash impossible :", updErr.message);
    return json({ ok: false, error: "Paiement vérifié, mais l'enregistrement a échoué. Réessaie dans un instant." });
  }
  const { error: rpcErr } = await admin.rpc("auto_validate_subscription_payment", { p_payment_id: payment.id });
  if (rpcErr) {
    console.error("[usdt-payment] activation impossible :", rpcErr.message);
    return json({ ok: false, error: "Paiement vérifié, mais l'activation a échoué. Réessaie dans un instant ; si le problème continue, contacte l'équipe." });
  }
  return json({ ok: true, status: "validated", confirmations: evaluation.confirmations });
}

// En production la fonction écoute les requêtes. Les tests définissent USDT_PAYMENT_NO_SERVE pour importer les fonctions pures.
if (!Deno.env.get("USDT_PAYMENT_NO_SERVE")) {
  Deno.serve(handler);
}
