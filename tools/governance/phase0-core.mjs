// Phase 0 Reconciliation — pure core (normalize, pre-pass, union, match, issues).
// Read-only by design: operates on SourceRecords only; never touches app sources.

export const ALWAYS_PROTECTED = ["SCR_AGENCY_SETUP", "UX-009"];
export const SCREEN_DEFINING = new Set(["SRC-01", "SRC-02", "SRC-03", "SRC-04", "SRC-08", "SRC-09", "SRC-11"]);

export function aliasKind(id) {
  if (!id) return null;
  const v = String(id).trim().toUpperCase();
  if (/^UX-\d{3}$/.test(v)) return "UX";
  if (/^SCR-M08-\d{3}$/.test(v)) return "M08";
  if (/^SCR-M0[0-7]-\d{3}$/.test(v)) return "SCR_MODULE";
  if (/^SCR_[A-Z0-9_]+$/.test(v)) return "SCR_LEGACY";
  if (/^CURRENT:ROUTE:/.test(v)) return "FIGMA_KEY";
  return "UNKNOWN_ID";
}

export function normId(id) {
  if (id == null || String(id).trim() === "") return null;
  return String(id).trim().toUpperCase();
}

export function normRoute(raw) {
  if (raw == null) return { route: null, state: null };
  let r = String(raw).trim();
  if (r === "" || /^tbd$/i.test(r)) return { route: null, state: null };
  let state = null;
  const h = r.indexOf("#");
  if (h >= 0) { state = r.slice(h + 1).toLowerCase() || null; r = r.slice(0, h); }
  r = r.split("?")[0].toLowerCase();
  r = r.replace(/\{[^}]+\}|\$[a-z0-9_]+|:[a-z0-9_]+/gi, ":param");
  r = r.split("/").filter((s) => s && !s.startsWith("_") && s !== "index" && !/^\(.*\)$/.test(s)).join("/");
  return { route: "/" + r, state };
}

const STOP = new Set(["screen", "page", "view", "the", "and", "a", "of"]);
export function normName(n) {
  if (!n) return null;
  return String(n).normalize("NFKC").toLowerCase().replace(/[^a-z0-9]+/g, " ")
    .split(" ").filter((t) => t && !STOP.has(t)).join(" ") || null;
}

export function normalize(rec) {
  const { route, state } = normRoute(rec.raw_route);
  const norm_id = normId(rec.raw_id);
  return { ...rec, norm_id, alias_kind: aliasKind(norm_id), norm_route: route, norm_state: state,
    norm_name: normName(rec.raw_name), screen_defining: SCREEN_DEFINING.has(rec.source_id) };
}

const routeKey = (r) => (r.norm_route ? r.norm_route + (r.norm_state ? "#" + r.norm_state : "") : null);

// Step 2–3: conflict pre-pass. Returns protected id set + protected route set + findings.
export function prePass(records) {
  const idRoutes = new Map(), routeIds = new Map(), idNames = new Map();
  for (const r of records) {
    if (!r.screen_defining) continue;
    const rk = routeKey(r);
    if (r.norm_id && rk) (idRoutes.get(r.norm_id) ?? idRoutes.set(r.norm_id, new Set()).get(r.norm_id)).add(rk);
    if (r.norm_id && r.norm_name) (idNames.get(r.norm_id) ?? idNames.set(r.norm_id, new Set()).get(r.norm_id)).add(r.norm_name);
    if (rk && r.norm_id) {
      const m = routeIds.get(rk) ?? routeIds.set(rk, new Map()).get(rk);
      (m.get(r.alias_kind) ?? m.set(r.alias_kind, new Set()).get(r.alias_kind)).add(r.norm_id);
    }
  }
  const protectedIds = new Set(ALWAYS_PROTECTED);
  const protectedRoutes = new Set();
  const findings = [];
  for (const [id, rs] of idRoutes) if (rs.size > 1) { protectedIds.add(id); findings.push({ type: "SHARED_ALIAS", id, routes: [...rs].sort() }); }
  for (const [id, ns] of idNames) if (ns.size > 1) { protectedIds.add(id); findings.push({ type: "CONFLICTING_METADATA", id, names: [...ns].sort() }); }
  for (const [rk, kinds] of routeIds) for (const [kind, ids] of kinds) if (ids.size > 1) {
    protectedRoutes.add(rk); findings.push({ type: "ROUTE_CONFLICT", route: rk, kind, ids: [...ids].sort() });
  }
  return { protectedIds, protectedRoutes, findings };
}

// Step 4: deterministic union with stop rule. Union-find over screen-defining records.
export function formCandidates(records, pre) {
  const sd = records.filter((r) => r.screen_defining);
  const parent = new Map(sd.map((r) => [r.source_record_id, r.source_record_id]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const byRec = new Map(sd.map((r) => [r.source_record_id, r]));
  const members = (root) => sd.filter((r) => find(r.source_record_id) === root);
  const refused = [];
  const tryUnion = (a, b, reason) => {
    const ra = find(a.source_record_id), rb = find(b.source_record_id);
    if (ra === rb) return;
    const ids = new Map();
    for (const m of [...members(ra), ...members(rb)]) if (m.norm_id) {
      const s = ids.get(m.alias_kind) ?? ids.set(m.alias_kind, new Set()).get(m.alias_kind); s.add(m.norm_id);
      if (s.size > 1) { refused.push({ a: a.source_record_id, b: b.source_record_id, reason, kind: m.alias_kind }); return; }
    }
    parent.set(rb, ra);
  };
  // (a) hard identity evidence
  const byId = new Map();
  for (const r of sd) if (r.norm_id && !pre.protectedIds.has(r.norm_id)) (byId.get(r.norm_id) ?? byId.set(r.norm_id, []).get(r.norm_id)).push(r);
  for (const [, rs] of [...byId].sort()) for (let i = 1; i < rs.length; i++) tryUnion(rs[0], rs[i], "SAME_ID");
  // (b) route evidence with no conflicts
  const byRoute = new Map();
  for (const r of sd) { const rk = routeKey(r); if (rk && !pre.protectedRoutes.has(rk)) (byRoute.get(rk) ?? byRoute.set(rk, []).get(rk)).push(r); }
  for (const [, rs] of [...byRoute].sort()) for (let i = 1; i < rs.length; i++) {
    const a = rs[0], b = rs[i];
    if ([a, b].some((x) => x.norm_id && pre.protectedIds.has(x.norm_id))) { refused.push({ a: a.source_record_id, b: b.source_record_id, reason: "PROTECTED_ALIAS" }); continue; }
    const cluster = members(find(a.source_record_id));
    const clash = cluster.find((m) => m.norm_name && b.norm_name && m.norm_name !== b.norm_name && jaccard(m.norm_name, b.norm_name) < 0.5);
    if (clash) { refused.push({ a: clash.source_record_id, b: b.source_record_id, reason: "CONFLICTING_NAME" }); continue; }
    const modClash = cluster.find((m) => m.raw_module && b.raw_module && m.alias_kind === b.alias_kind && m.raw_module !== b.raw_module);
    if (modClash) { refused.push({ a: modClash.source_record_id, b: b.source_record_id, reason: "CONFLICTING_MODULE" }); continue; }
    tryUnion(a, b, "SAME_ROUTE");
  }
  const groups = new Map();
  for (const r of sd) { const root = find(r.source_record_id); (groups.get(root) ?? groups.set(root, []).get(root)).push(r); }
  const ordered = [...groups.values()].map((g) => g.sort(cmpRec)).sort((x, y) => cmpRec(x[0], y[0]));
  const candidates = ordered.map((g, i) => ({ cand_id: "CAND-" + String(i + 1).padStart(6, "0"), members: g.map((r) => r.source_record_id) }));
  return { candidates, refused, byRec };
}

export function cmpRec(a, b) {
  return a.source_id.localeCompare(b.source_id) || a.record_locator.localeCompare(b.record_locator, "en", { numeric: true });
}

export function jaccard(a, b) {
  const A = new Set(String(a).split(" ")), B = new Set(String(b).split(" "));
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / (A.size + B.size - inter || 1);
}

// Attach evidence-only records (nav, Figma, samples) to candidates by id/route; never merge.
export function attachEvidence(records, cands) {
  const idx = new Map();
  for (const c of cands) for (const m of c.recs) {
    if (m.norm_id) (idx.get("id:" + m.norm_id) ?? idx.set("id:" + m.norm_id, new Set()).get("id:" + m.norm_id)).add(c.cand_id);
    const rk = routeKey(m); if (rk) (idx.get("r:" + rk) ?? idx.set("r:" + rk, new Set()).get("r:" + rk)).add(c.cand_id);
  }
  const out = [];
  for (const r of records) if (!r.screen_defining) {
    const hits = new Set([...(idx.get("id:" + r.norm_id) ?? []), ...(idx.get("r:" + routeKey(r)) ?? [])]);
    out.push({ record: r.source_record_id, source_id: r.source_id, cands: [...hits].sort() });
  }
  return out;
}

export function signals(a, b) {
  const ids = (c) => new Set(c.recs.map((r) => r.norm_id).filter(Boolean));
  const rts = (c) => new Set(c.recs.map(routeKey).filter(Boolean));
  const names = (c) => c.recs.map((r) => r.norm_name).filter(Boolean);
  const mods = (c) => new Set(c.recs.map((r) => r.raw_module).filter(Boolean));
  const inter = (x, y) => [...x].some((v) => y.has(v));
  const nameSim = Math.max(0, ...names(a).flatMap((x) => names(b).map((y) => jaccard(x, y))));
  return {
    "SIG-01": inter(ids(a), ids(b)), "SIG-02": inter(rts(a), rts(b)), "SIG-03": false,
    "SIG-04": nameSim >= 0.8, "SIG-05": inter(mods(a), mods(b)),
  };
}

export function classify(s, conflict) {
  if (conflict) return "CONFLICT";
  if (s["SIG-01"] && (s["SIG-02"] || s["SIG-03"] || s["SIG-05"])) return "EXACT";
  if (s["SIG-01"] || ((s["SIG-02"] || s["SIG-03"]) && s["SIG-04"])) return "STRONG";
  const weak = ["SIG-04", "SIG-05"].filter((k) => s[k]).length;
  if (weak >= 2 || s["SIG-02"]) return "POSSIBLE";
  return "NONE";
}
