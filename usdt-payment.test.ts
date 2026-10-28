Deno.env.set("USDT_PAYMENT_NO_SERVE", "1");
Deno.env.set("USDT_RECEIVE_ADDRESS", "0x38b6527df24a91b00acad48dfb303ad257d9125d");
function assert(cond: unknown, msg = "assertion échouée"): asserts cond {
  if (!cond) throw new Error(msg);
}
function assertEquals(a: unknown, b: unknown) {
  const x = typeof a === "bigint" ? a.toString() + "n" : JSON.stringify(a);
  const y = typeof b === "bigint" ? b.toString() + "n" : JSON.stringify(b);
  if (x !== y) throw new Error(`attendu ${y}, obtenu ${x}`);
}
import * as m from "../supabase/functions/usdt-payment/index.ts";

const OWNER = "0x38b6527df24a91b00acad48dfb303ad257d9125d";
const SENDER = "0x1111111111111111111111111111111111111111";
const pad = (a: string) => "0x" + "0".repeat(24) + a.toLowerCase().replace(/^0x/, "");
const hex = (n: bigint) => "0x" + n.toString(16);
const usdt = (units4: bigint) => units4 * 10n ** 14n;
const mkLog = (value: bigint, o: Partial<{ contract: string; to: string; topic0: string }> = {}) => ({
  address: o.contract ?? m.USDT_CONTRACT,
  topics: [o.topic0 ?? m.TRANSFER_TOPIC, pad(SENDER), pad(o.to ?? OWNER)],
  data: hex(value),
});
const NOW = Date.now();
const base = (over: Partial<m.VerifyInputs> = {}): m.VerifyInputs => ({
  receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(41723n))] },
  latestBlock: 1100n,
  blockTimestampSec: Math.floor(NOW / 1000),
  payToAddress: OWNER,
  expectedUnits4: 41723n,
  paymentCreatedAtMs: NOW - 60_000,
  ...over,
});

Deno.test("montants : conversions exactes", () => {
  assertEquals(m.parseUnits4("4.1723"), 41723n);
  assertEquals(m.parseUnits4("4.17"), 41700n);
  assertEquals(m.parseUnits4("4"), 40000n);
  assertEquals(m.parseUnits4("4.17231"), null); // 5 décimales non nulles refusées
  assertEquals(m.parseUnits4("abc"), null);
  assertEquals(m.formatUnits4(41723n), "4.1723");
  assertEquals(m.formatUnits4(3400n), "0.3400");
  assertEquals(m.baseUnits4(2500, 600), 41700n); // 4.17
  assertEquals(m.baseUnits4(200, 600), 3400n); // 0.34
  assertEquals(m.units4ToTokenUnits(41723n), 4172300000000000000n);
});

Deno.test("vérification : paiement correct accepté", () => {
  const r = m.evaluateTransaction(base());
  assert(r.ok);
  if (r.ok) assertEquals(r.confirmations, 101);
});

Deno.test("vérification : faux jeton refusé", () => {
  const r = m.evaluateTransaction(base({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(41723n), { contract: "0x2222222222222222222222222222222222222222" })] } }));
  assert(!r.ok && r.reason === "no_transfer");
});

Deno.test("vérification : mauvais destinataire refusé", () => {
  const r = m.evaluateTransaction(base({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(41723n), { to: "0x3333333333333333333333333333333333333333" })] } }));
  assert(!r.ok && r.reason === "no_transfer");
});

Deno.test("vérification : autre événement (Approval) refusé", () => {
  const approval = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";
  const r = m.evaluateTransaction(base({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(41723n), { topic0: approval })] } }));
  assert(!r.ok && r.reason === "no_transfer");
});

Deno.test("vérification : montant différent refusé (trop bas ou trop haut)", () => {
  for (const v of [41700n, 41722n, 41724n, 50000n]) {
    const r = m.evaluateTransaction(base({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(v))] } }));
    assert(!r.ok && r.reason === "amount_mismatch", `montant ${v}`);
  }
});

Deno.test("vérification : plusieurs transferts, un seul correct => accepté", () => {
  const logs = [mkLog(usdt(1000n)), mkLog(usdt(41723n)), mkLog(usdt(999n), { to: "0x3333333333333333333333333333333333333333" })];
  assert(m.evaluateTransaction(base({ receipt: { status: "0x1", blockNumber: hex(1000n), logs } })).ok);
});

Deno.test("vérification : transaction échouée, introuvable, ancienne, pas assez confirmée", () => {
  let r = m.evaluateTransaction(base({ receipt: { status: "0x0", blockNumber: hex(1000n), logs: [mkLog(usdt(41723n))] } }));
  assert(!r.ok && r.reason === "failed");
  r = m.evaluateTransaction(base({ receipt: null }));
  assert(!r.ok && r.reason === "not_found");
  r = m.evaluateTransaction(base({ blockTimestampSec: Math.floor(NOW / 1000) - 3600 }));
  assert(!r.ok && r.reason === "too_old");
  r = m.evaluateTransaction(base({ blockTimestampSec: null }));
  assert(!r.ok && r.reason === "too_old");
  r = m.evaluateTransaction(base({ latestBlock: 1005n }));
  assert(!r.ok && r.reason === "confirmations");
  r = m.evaluateTransaction(base({ latestBlock: 1014n })); // 15 confirmations exactement
  assert(r.ok);
});

Deno.test("bimestre UTC", () => {
  assertEquals(m.bimonthStartUtc(new Date("2026-10-26T10:00:00Z")), "2026-09-01");
  assertEquals(m.bimonthStartUtc(new Date("2026-01-05T10:00:00Z")), "2026-01-01");
  assertEquals(m.bimonthStartUtc(new Date("2026-12-31T23:00:00Z")), "2026-11-01");
});

// ===== Faux client Supabase en mémoire pour tester create / verify de bout en bout =====
type Row = Record<string, any>;
function makeDb(rows: Row[], rpcCalls: string[], opts: { failRpc?: boolean } = {}) {
  let idSeq = 1;
  const uniqueViolation = (cand: Row, ignoreId?: string) => {
    if (cand.tx_hash && rows.some((r) => r.id !== ignoreId && r.tx_hash && String(r.tx_hash).toLowerCase() === String(cand.tx_hash).toLowerCase())) return true;
    if (cand.status === "pending" && cand.payment_method === "usdt_bep20" &&
      rows.some((r) => r.id !== ignoreId && r.status === "pending" && r.payment_method === "usdt_bep20" && r.pay_to_address === cand.pay_to_address && r.usdt_expected === cand.usdt_expected)) return true;
    return false;
  };
  const agents: Row[] = [{ id: "user-1", role: "agent" }, { id: "user-2", role: "agent" }];
  const tableRows = (t: string) => (t === "agents" ? agents : rows);
  class Q {
    filters: ((r: Row) => boolean)[] = []; mode = "select"; patch: Row = {}; ins: Row = {}; lim = Infinity; maybe = false;
    constructor(public t: string) {}
    select() { return this; }
    eq(c: string, v: unknown) { this.filters.push((r) => r[c] === v); return this; }
    neq(c: string, v: unknown) { this.filters.push((r) => r[c] !== v); return this; }
    is(c: string, v: null) { this.filters.push((r) => (r[c] ?? null) === v); return this; }
    lt(c: string, v: string) { this.filters.push((r) => String(r[c]) < v); return this; }
    order() { return this; }
    limit(n: number) { this.lim = n; return this; }
    update(p: Row) { this.mode = "update"; this.patch = p; return this; }
    insert(r: Row) { this.mode = "insert"; this.ins = r; return this; }
    maybeSingle() { this.maybe = true; return this; }
    single() { this.maybe = true; return this; }
    // deno-lint-ignore no-explicit-any
    then(res: any, rej: any) { return Promise.resolve(this.run()).then(res, rej); }
    run(): { data: any; error: any } {
      const all = tableRows(this.t);
      if (this.mode === "insert") {
        const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), tx_hash: null, ...this.ins };
        if (uniqueViolation(row)) return { data: null, error: { code: "23505", message: "duplicate" } };
        rows.push(row);
        return { data: row, error: null };
      }
      const hit = all.filter((r) => this.filters.every((f) => f(r))).slice(0, this.lim);
      if (this.mode === "update") {
        for (const r of hit) {
          const cand = { ...r, ...this.patch };
          if (uniqueViolation(cand, r.id)) return { data: null, error: { code: "23505", message: "duplicate" } };
          Object.assign(r, this.patch);
        }
        return { data: hit, error: null };
      }
      return { data: this.maybe ? (hit[0] ?? null) : hit, error: null };
    }
  }
  return {
    from: (t: string) => new Q(t),
    rpc: (name: string, args: Row) => {
      rpcCalls.push(name);
      if (opts.failRpc) return Promise.resolve({ error: { message: "boom" } });
      const p = rows.find((r) => r.id === args.p_payment_id);
      if (p) p.status = "validated";
      return Promise.resolve({ error: null });
    },
  };
}
const J = (b: unknown) => new Response(JSON.stringify(b));
// deno-lint-ignore no-explicit-any
const body = async (r: Response): Promise<any> => await r.json();

function mockChain(opts: { receipt: unknown; latest?: bigint; ts?: number }) {
  const original = globalThis.fetch;
  globalThis.fetch = (async (_u: string, init: RequestInit) => {
    const { method } = JSON.parse(String(init.body));
    const result = method === "eth_getTransactionReceipt" ? opts.receipt
      : method === "eth_blockNumber" ? hex(opts.latest ?? 1100n)
      : { timestamp: hex(BigInt(opts.ts ?? Math.floor(Date.now() / 1000))) };
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result }));
  }) as typeof fetch;
  return () => { globalThis.fetch = original; };
}

const HASH = "0x" + "ab".repeat(32);

Deno.test("create : montant unique, réutilisation, prix serveur", async () => {
  const rows: Row[] = []; const calls: string[] = [];
  const db = makeDb(rows, calls);
  const r1 = await body(await m.createPayment(db, "user-1", "abonnement", OWNER, J));
  assert(r1.ok);
  const amt = m.parseUnits4(r1.payment.amount_usdt)!;
  assert(amt >= 41701n && amt <= 42200n, "montant dans 4.1701–4.2200 : " + r1.payment.amount_usdt);
  assertEquals(rows[0].amount, 2500);
  assertEquals(rows[0].status, "pending");
  assertEquals(rows[0].pay_to_address, OWNER);
  const r2 = await body(await m.createPayment(db, "user-1", "abonnement", OWNER, J));
  assertEquals(r2.payment.id, r1.payment.id); // réutilisée, pas de doublon
  assertEquals(rows.length, 1);
  const r3 = await body(await m.createPayment(db, "user-2", "abonnement", OWNER, J));
  assert(r3.ok && r3.payment.amount_usdt !== r1.payment.amount_usdt, "montants distincts entre utilisateurs");
  const h = await body(await m.createPayment(db, "user-1", "historique", OWNER, J));
  const hu = m.parseUnits4(h.payment.amount_usdt)!;
  assert(hu >= 3401n && hu <= 3900n);
  const bad = await body(await m.createPayment(db, "user-1", "gratuit", OWNER, J));
  assert(!bad.ok);
});

Deno.test("verify : paiement correct => hash enregistré + activation appelée une seule fois", async () => {
  const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls);
  const c = await body(await m.createPayment(db, "user-1", "abonnement", OWNER, J));
  const expected = m.parseUnits4(c.payment.amount_usdt)!;
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(expected))] } });
  try {
    const v = await body(await m.verifyPayment(db, "user-1", c.payment.id, HASH.toUpperCase().replace("0X", "0x"), J));
    assert(v.ok, JSON.stringify(v));
    assertEquals(rows[0].tx_hash, HASH);
    assertEquals(rows[0].status, "validated");
    assertEquals(calls, ["auto_validate_subscription_payment"]);
    const again = await body(await m.verifyPayment(db, "user-1", c.payment.id, HASH, J));
    assert(again.ok);
    assertEquals(calls.length, 1); // pas de double activation
  } finally { restore(); }
});

Deno.test("verify : un autre utilisateur ne peut pas réclamer ce paiement", async () => {
  const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls);
  const c = await body(await m.createPayment(db, "user-1", "abonnement", OWNER, J));
  const expected = m.parseUnits4(c.payment.amount_usdt)!;
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(expected))] } });
  try {
    const v = await body(await m.verifyPayment(db, "user-2", c.payment.id, HASH, J));
    assert(!v.ok);
    assertEquals(calls.length, 0);
    assertEquals(rows[0].status, "pending");
  } finally { restore(); }
});

Deno.test("verify : numéro de transaction déjà utilisé refusé", async () => {
  const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls);
  const a = await body(await m.createPayment(db, "user-1", "abonnement", OWNER, J));
  const b = await body(await m.createPayment(db, "user-2", "abonnement", OWNER, J));
  rows.find((r) => r.id === a.payment.id)!.tx_hash = HASH;
  const expected = m.parseUnits4(b.payment.amount_usdt)!;
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(expected))] } });
  try {
    const v = await body(await m.verifyPayment(db, "user-2", b.payment.id, HASH, J));
    assert(!v.ok && v.reason === "used");
    assertEquals(calls.length, 0);
  } finally { restore(); }
});

Deno.test("verify : montant différent => refus + note pour validation manuelle", async () => {
  const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls);
  const c = await body(await m.createPayment(db, "user-1", "abonnement", OWNER, J));
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(41700n))] } });
  try {
    const v = await body(await m.verifyPayment(db, "user-1", c.payment.id, HASH, J));
    assert(!v.ok && v.reason === "amount_mismatch");
    assertEquals(rows[0].status, "pending");
    assertEquals(rows[0].tx_hash, null);
    assert(String(rows[0].payment_reference).includes("montant différent"));
    assertEquals(calls.length, 0);
  } finally { restore(); }
});

Deno.test("verify : demande falsifiée (montant minuscule) refusée même si le transfert correspond", async () => {
  const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls);
  const fakeId = crypto.randomUUID();
  rows.push({ id: fakeId, agent_id: "user-1", type: "abonnement", status: "pending", payment_method: "usdt_bep20", usdt_expected: "0.0001", pay_to_address: OWNER, created_at: new Date().toISOString(), tx_hash: null });
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(1n))] } });
  try {
    const v = await body(await m.verifyPayment(db, "user-1", fakeId, HASH, J));
    assert(!v.ok && String(v.error).includes("invalide"), JSON.stringify(v));
    assertEquals(rows[0].status, "pending");
    const v2 = await body(await m.verifyPayment(db, "user-1", "00000000-0000-0000-0000-000000000000", HASH, J));
    assert(!v2.ok);
    assertEquals(calls.length, 0);
  } finally { restore(); }
});

Deno.test("verify : activation en échec => hash gardé, nouvel essai possible", async () => {
  const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls, { failRpc: true });
  const c = await body(await m.createPayment(db, "user-1", "abonnement", OWNER, J));
  const expected = m.parseUnits4(c.payment.amount_usdt)!;
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(expected))] } });
  try {
    const v = await body(await m.verifyPayment(db, "user-1", c.payment.id, HASH, J));
    assert(!v.ok);
    assertEquals(rows[0].tx_hash, HASH);
    assertEquals(rows[0].status, "pending");
    const other = "0x" + "cd".repeat(32);
    const v2 = await body(await m.verifyPayment(db, "user-1", c.payment.id, other, J));
    assert(!v2.ok); // une autre transaction ne peut pas remplacer celle déjà vérifiée
  } finally { restore(); }
});

Deno.test("verify : demande avec une adresse de réception inconnue refusée (ligne falsifiée)", async () => {
  const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls);
  const evil = "0x4444444444444444444444444444444444444444";
  const id = crypto.randomUUID();
  rows.push({ id, agent_id: "user-1", type: "abonnement", status: "pending", payment_method: "usdt_bep20", usdt_expected: "4.1723", pay_to_address: evil, created_at: new Date().toISOString(), tx_hash: null });
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(41723n), { to: evil })] } });
  try {
    const v = await body(await m.verifyPayment(db, "user-1", id, HASH, J));
    assert(!v.ok && String(v.error).includes("invalide"), JSON.stringify(v));
    assertEquals(calls.length, 0);
  } finally { restore(); }
});

Deno.test("verify : ancienne adresse acceptée seulement si listée dans USDT_RECEIVE_ADDRESS_PREVIOUS", async () => {
  const old = "0x5555555555555555555555555555555555555555";
  const mk = () => {
    const rows: Row[] = []; const calls: string[] = []; const db = makeDb(rows, calls);
    const id = crypto.randomUUID();
    rows.push({ id, agent_id: "user-1", type: "abonnement", status: "pending", payment_method: "usdt_bep20", usdt_expected: "4.1723", pay_to_address: old, created_at: new Date().toISOString(), tx_hash: null });
    return { rows, calls, db, id };
  };
  const restore = mockChain({ receipt: { status: "0x1", blockNumber: hex(1000n), logs: [mkLog(usdt(41723n), { to: old })] } });
  try {
    let t = mk();
    let v = await body(await m.verifyPayment(t.db, "user-1", t.id, HASH, J));
    assert(!v.ok); // adresse non listée
    Deno.env.set("USDT_RECEIVE_ADDRESS_PREVIOUS", old);
    t = mk();
    v = await body(await m.verifyPayment(t.db, "user-1", t.id, HASH, J));
    assert(v.ok, JSON.stringify(v));
    assertEquals(t.calls.length, 1);
  } finally { restore(); Deno.env.delete("USDT_RECEIVE_ADDRESS_PREVIOUS"); }
});
