import assert from "node:assert/strict";
import { normalize, prePass, formCandidates, normRoute, aliasKind, parseNav, m00Structural, parseChangeLog, classifyRouteFile,
  routeStatus, registerRoutesNotLive, candidateDisposition, signalsFull, identityConflict, classifyFull, levenshteinNorm } from "./phase0-core.mjs";

const rec = (source_id, loc, f) => normalize({ source_record_id: `${source_id}:${loc}`, source_id, source_path: "x", record_locator: loc,
  raw_id: f.id ?? null, raw_name: f.name ?? null, raw_route: f.route ?? null, raw_module: f.module ?? null, raw_payload: {} });

// normalization
assert.deepEqual(normRoute("/Plans#filters"), { route: "/plans", state: "filters" });
assert.deepEqual(normRoute("/people/{personId}/x/"), { route: "/people/:param/x", state: null });
assert.equal(aliasKind("SCR-M06-014"), "SCR_MODULE");
assert.equal(aliasKind("SCR-M08-001"), "M08");
assert.equal(aliasKind("SCR_AGENCY_SETUP"), "SCR_LEGACY");

// SCR_AGENCY_SETUP / UX-009 always protected, never merged by id
{
  const rs = [rec("SRC-08", "a", { id: "SCR_AGENCY_SETUP", name: "Agency", route: "/app/agency" }),
    rec("SRC-02", "b", { id: "SCR_AGENCY_SETUP", name: "Agency", route: "/app/agency/entities" }),
    rec("SRC-08", "c", { id: "UX-009", name: "Plans" }), rec("SRC-03", "d", { id: "UX-009", name: "Plans" })];
  const pre = prePass(rs);
  assert.ok(pre.protectedIds.has("SCR_AGENCY_SETUP") && pre.protectedIds.has("UX-009"));
  assert.equal(formCandidates(rs, pre).candidates.length, 4);
}
// same id unprotected → merge
{
  const rs = [rec("SRC-04", "1", { id: "SCR-M06-001", name: "Roster", route: "/roster" }), rec("SRC-08", "x", { id: "SCR-M06-001", name: "Roster", route: "/roster" })];
  assert.equal(formCandidates(rs, prePass(rs)).candidates.length, 1);
}
// route alone with conflicting ids of same kind → refused, not merged
{
  const rs = [rec("SRC-04", "1", { id: "SCR-M06-001", name: "Roster", route: "/r" }), rec("SRC-04", "2", { id: "SCR-M06-002", name: "Roster", route: "/r" })];
  const pre = prePass(rs);
  assert.ok(pre.protectedRoutes.has("/r"));
  assert.equal(formCandidates(rs, pre).candidates.length, 2);
}
// route with conflicting name → not merged
{
  const rs = [rec("SRC-11", "f", { route: "/a" }), rec("SRC-02", "1", { id: "SCR-M04-001", name: "Billing Center", route: "/a" }), rec("SRC-09", "z", { id: "SCR-M08-001", name: "Selling Setup", route: "/a" })];
  const out = formCandidates(rs, prePass(rs));
  assert.ok(out.candidates.length >= 2);
}
// determinism
{
  const rs = [rec("SRC-04", "2", { id: "SCR-M06-002", route: "/b" }), rec("SRC-04", "1", { id: "SCR-M06-001", route: "/a" })];
  const a = JSON.stringify(formCandidates(rs, prePass(rs)).candidates), b = JSON.stringify(formCandidates([...rs].reverse(), prePass(rs)).candidates);
  assert.equal(a, b);
}
// ── F1: route evidence separate; ROUTE_RECONCILED never assigned
{
  const r = rec("SRC-01", "1", { id: "SCR_X", name: "X" });
  assert.deepEqual(routeStatus(r, []), { source_route_fact: "SOURCE_MISSING_ROUTE", route_status: "SOURCE_MISSING_ROUTE" });
  const st = routeStatus(r, [{ source_id: "SRC-10", route: "/x" }]);
  assert.equal(st.source_route_fact, "SOURCE_MISSING_ROUTE"); assert.equal(st.route_status, "ROUTE_EVIDENCE_AVAILABLE");
  assert.equal(r.norm_route, null, "evidence never writes the source route");
  assert.equal(routeStatus(rec("SRC-02", "2", { id: "SCR-M04-001", route: "/a" }), []).source_route_fact, "SOURCE_ROUTE_PRESENT");
}
// ── F2: all ten signals, fuzzy name detection, no merge
const feat = (o) => ({ ids: new Set(), routes: new Set(), names: [], modules: new Set(), reqs: new Set(), purposes: [], actions: new Set(), components: new Set(), figmaKeys: new Set(), structSigs: new Set(), ...o });
{
  assert.ok(levenshteinNorm("agency setup", "agency setupp") <= 0.15);
  const a = { recs: [rec("SRC-02", "1", { id: "SCR-M04-001" })], feat: feat({ names: ["billing centre"], reqs: new Set(["REQ-M04-001"]), purposes: ["manage billing invoices"], actions: new Set(["view", "pay"]), components: new Set(["C1"]), figmaKeys: new Set(["k"]), structSigs: new Set(["s"]) }) };
  const b = { recs: [rec("SRC-08", "2", { id: "UX-100" })], feat: feat({ names: ["billing center"], reqs: new Set(["REQ-M04-001"]), purposes: ["manage billing invoices"], actions: new Set(["view"]), components: new Set(["C1"]), figmaKeys: new Set(["k"]), structSigs: new Set(["s"]) }) };
  const s = signalsFull(a, b);
  assert.deepEqual(Object.keys(s), ["SIG-01","SIG-02","SIG-03","SIG-04","SIG-05","SIG-06","SIG-07","SIG-08","SIG-09","SIG-10"]);
  for (const k of ["SIG-03","SIG-04","SIG-06","SIG-07","SIG-08","SIG-09","SIG-10"]) assert.equal(s[k], true, k);
  assert.equal(classifyFull(s, identityConflict(a, b, new Set())), "STRONG");
  const c = { recs: [rec("SRC-02", "3", { id: "SCR-M04-002" })], feat: feat({ routes: new Set(["/r"]) }) }, d = { recs: [rec("SRC-02", "4", { id: "SCR-M04-003" })], feat: feat({ routes: new Set(["/r"]) }) };
  assert.equal(classifyFull(signalsFull(c, d), identityConflict(c, d, new Set())), "CONFLICT");
  const e = { recs: [rec("SRC-02", "5", {})], feat: feat({ names: ["roster"], modules: new Set(["M06"]) }) }, g = { recs: [rec("SRC-08", "6", {})], feat: feat({ names: ["rosters"], modules: new Set(["M06"]) }) };
  assert.equal(classifyFull(signalsFull(e, g), identityConflict(e, g, new Set())), "POSSIBLE");
  // fuzzy similarity never merges candidates
  const rs = [rec("SRC-02", "1", { id: "SCR-M04-001", name: "Billing Centre" }), rec("SRC-08", "x", { id: "UX-100", name: "Billing Center" })];
  assert.equal(formCandidates(rs, prePass(rs)).candidates.length, 2);
}
// ── F3: register routes not live → evidence only
{
  const rs = [rec("SRC-04", "1", { id: "SCR-M06-001", route: "/agency/home" }), rec("SRC-09", "2", { id: "SCR-M08-001", route: "/m08/x" }), rec("SRC-04", "3", { id: "SCR-M06-002", route: "/live" })];
  const d = registerRoutesNotLive(rs, new Set(["/live"]));
  assert.deepEqual(d.map((x) => [x.source_id, x.sem_ref]), [["SRC-04", "SEM-03"], ["SRC-09", "SEM-07"]]);
  assert.equal(rs[0].norm_route, "/agency/home", "no auto-link");
}
// ── F4: layout-only / design-reference classification
{
  const inv = new Map([["src/routes/admin.tsx", { category: "layout-only" }], ["src/routes/design-guide.tsx", { category: "design-reference" }]]);
  assert.equal(classifyRouteFile("src/routes/admin.tsx", inv), "layout-only");
  assert.equal(classifyRouteFile("src/routes/design-guide.tsx", inv), "design-reference");
  assert.equal(classifyRouteFile("src/routes/app.route.tsx", new Map()), "layout-only");
  assert.equal(classifyRouteFile("src/routes/plans.tsx", new Map()), "content");
}
// ── F5: every nav entry, including those without scrId
{
  const nav = parseNav(`[{ label: "A", to: "/a", icon: X, scrId: "UX-001" }, { label: "B", to: "/b", icon: Y }, {\n label: "C",\n to: "/c"\n}]`);
  assert.deepEqual(nav.map((n) => [n.to, n.scrId]), [["/a", "UX-001"], ["/b", null], ["/c", null]]);
}
// ── F6: change-log extraction (ranges expanded)
{
  const cl = parseChangeLog("| CCL-M06-005 | 2026-08-31 | Conflict | **CONF-M06-002** — rows `SCR-M06-001..003` have empty `route`. | OPEN |");
  assert.equal(cl[0].conf, "CONF-M06-002"); assert.deepEqual(cl[0].screen_ids, ["SCR-M06-001", "SCR-M06-002", "SCR-M06-003"]);
}
// ── F7: structural M00 count
{
  const m = m00Structural(`counts: { a: 1, screens: 52 },\n  screens: [\n { id: "SCR_A", x: { y: 1 } },\n { id: "SCR_B" },\n ] satisfies X[],`);
  assert.deepEqual(m, { structural: 2, stated: 52 });
}
// ── F9: technical disposition independent of human status; protected blocks
{
  const prot = new Set(["UX-009"]);
  assert.equal(candidateDisposition({ recs: [rec("SRC-08", "a", { id: "UX-009" })] }, prot), "BLOCKED_PROTECTED_ALIAS");
  assert.equal(candidateDisposition({ recs: [rec("SRC-11", "f", { route: "/x" })] }, prot), "ORPHAN_ROUTE_ONLY");
  assert.equal(candidateDisposition({ recs: [rec("SRC-02", "1", { id: "SCR-M04-001" })] }, prot), "SINGLE_SOURCE");
}
console.log("phase0-core tests passed (incl. F1–F9)");
