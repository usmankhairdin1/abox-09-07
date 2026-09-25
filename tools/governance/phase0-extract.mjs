#!/usr/bin/env node
// Phase 0 Reconciliation runner — READ-ONLY against every ABox source.
// Writes only to tools/governance/out/ (isolated Phase 0 infrastructure).
// Includes approved corrections F1–F9. Never issues GSIDs, never records decisions.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { execSync } from "node:child_process";
import {
  normalize, prePass, formCandidates, attachEvidence, cmpRec, splitList, SCREEN_ID_RE, HUMAN_STATUS_INITIAL,
  parseNav, m00Structural, parseChangeLog, classifyRouteFile, routeStatus, registerRoutesNotLive,
  candidateDisposition, signalsFull, identityConflict, classifyFull, normId,
} from "./phase0-core.mjs";

const ROOT = new URL("../..", import.meta.url).pathname;
const OUT = join(ROOT, "tools/governance/out");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const manifest = [];
const read = (p) => { const t = readFileSync(join(ROOT, p), "utf8"); manifest.push({ path: p, sha256: sha(t) }); return t; };
const loadVar = (p, v) => new Function(read(p) + `; return ${v};`)();
const records = [];
const push = (source_id, source_path, record_locator, f, extra = {}) => records.push({ ...normalize({
  source_record_id: `${source_id}:${record_locator}`, source_id, source_path, record_locator,
  raw_id: f.id ?? null, raw_name: f.name ?? null, raw_route: f.route ?? null, raw_module: f.module ?? null, raw_payload: f.payload ?? f,
}), ...extra });

// SRC-01..04 screen registers; SRC-06 support-table references (evidence only)
const SRC06_TABLE = /^(Traceability_Register|Requirement_Register|Role_Permission_Matrix|User_Flow_Register|Capability_Register|Prior_Module_Impact_Register|M0\d_Impact_Register|Proposed_.*Delta.*)$/;
for (const [sid, mod] of [["SRC-01", "M00"], ["SRC-02", "M04"], ["SRC-03", "M05"], ["SRC-04", "M06"]]) {
  const p = `public/registers/${mod.toLowerCase()}.json`;
  const regs = JSON.parse(read(p)).registers;
  const rowsOf = (v) => (Array.isArray(v) ? v : v?.rows ?? []);
  rowsOf(regs.Screen_Register).forEach((r, i) => push(sid, p, `row${i}`, { id: r.screen_id, name: r.name, route: r.route ?? null,
    module: r.owning_module || r.ownership || mod, payload: r }));
  for (const table of Object.keys(regs).filter((t) => SRC06_TABLE.test(t)).sort()) rowsOf(regs[table]).forEach((row, i) => {
    const text = JSON.stringify(row);
    const ids = [...new Set([...text.matchAll(SCREEN_ID_RE)].map((m) => m[0]))].sort();
    const reqs = [...new Set(text.match(/REQ-M\d{2}-\d{3}/g) ?? [])].sort();
    ids.forEach((id) => push("SRC-06", p, `${mod}:${table}:row${i}:${id}`, { id, module: mod, payload: { table, row: i, requirement_ids: reqs } }));
  });
}
// SRC-05 governed packet indexes (document control + declared screens; evidence only)
const packets = [];
for (const mod of ["m00", "m04", "m05", "m06"]) {
  const p = `src/lib/governed/${mod}.index.ts`; const t = read(p);
  const json = JSON.parse(t.slice(t.indexOf("{", t.indexOf("_INDEX")), t.lastIndexOf("}") + 1));
  const dc = json.meta?.document_control ?? {};
  packets.push({ module: json.module, package_id: dc.package_id ?? null, version: dc.version ?? json.version ?? null, status: dc.status ?? null, sha256: sha(t) });
  (json.screens ?? []).forEach((s) => push("SRC-05", p, s.id, { id: s.id, name: s.name, route: s.route || null, module: s.module,
    payload: { requirements: s.requirements ?? [], actions: s.actions ?? [], purpose: s.purpose ?? null, status: s.status ?? null, packet_status: dc.status ?? null } }));
}
// SRC-07 change-log conflict claims (evidence only)
const changeLog = parseChangeLog(read("docs/m06/CHANGE_CONTROL_LOG.md"));
changeLog.forEach((e) => push("SRC-07", "docs/m06/CHANGE_CONTROL_LOG.md", e.entry, { module: "M06", payload: e }));
// SRC-08 screens.ts
{
  const p = "src/lib/screens.ts"; const t = read(p);
  for (const m of t.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*workspace:\s*"([^"]+)"([^}]*)/g)) {
    const purpose = m[4].match(/purpose:\s*"([^"]+)"/)?.[1] ?? null;
    push("SRC-08", p, m[1], { id: m[1], name: m[2], module: m[3], payload: { id: m[1], name: m[2], workspace: m[3], purpose } });
  }
}
// SRC-09 m08 registry
{
  const p = "src/lib/m08/registry.ts"; const t = read(p);
  for (const m of t.matchAll(/id:\s*"(SCR-M08-\d+)",\s*key:\s*"([^"]+)",[\s\S]*?route:\s*"([^"]+)"/g))
    push("SRC-09", p, m[1], { id: m[1], name: m[2], route: m[3], module: "M08", payload: { id: m[1], key: m[2], route: m[3] } });
}
// SRC-10 nav-config — F5: every entry, with or without scrId (evidence only)
parseNav(read("src/lib/nav-config.ts")).forEach((e, n) => push("SRC-10", "src/lib/nav-config.ts", `nav${n}`, { id: e.scrId, name: e.label, route: e.to, payload: e }));
// SRC-12 Figma Phase 59 (evidence only) + route inventory used by F4
const p59 = loadVar("tools/figma-plugin/tokens-current-app.js", "ABOX_CURRENT_APP");
const inventoryByFile = new Map((p59.routeInventory ?? []).map((r) => [r.sourceFile, r]));
(p59.screens ?? []).forEach((s) => push("SRC-12", "tools/figma-plugin/tokens-current-app.js", s.key, { id: s.screenId ?? null,
  name: s.title ?? s.name ?? null, route: s.route ?? null,
  payload: { key: s.key, b9Key: s.b9Key ?? null, route: s.route, components: s.components ?? [], structureSignature: s.structureSignature ?? null } }));
// SRC-13 governed B8/B9 frames (evidence only)
{
  const b9 = loadVar("tools/figma-plugin/tokens-b9.js", "ABOX_B9");
  (b9.screens ?? []).forEach((s) => push("SRC-13", "tools/figma-plugin/tokens-b9.js", `b9:${s.key}`, { id: s.id ?? null, name: s.title ?? null, route: s.route ?? null,
    payload: { frame_key: s.key, reactions: (b9.interactions ?? []).filter((x) => x.sourceKey === s.key).map((x) => x.targetKey).sort() } }));
  const b8 = loadVar("tools/figma-plugin/tokens-b8.js", "ABOX_B8");
  (b8.experiences ?? []).forEach((x, i) => push("SRC-13", "tools/figma-plugin/tokens-b8.js", `b8:${x.key ?? i}`, { name: x.title ?? x.name ?? null, payload: { frame_key: x.key ?? null } }));
}
// SRC-11 route files — F4 classification; annotations kept as route evidence (F1), never as identity
const liveRoutes = new Set();
{
  const walk = (d) => readdirSync(d).flatMap((f) => { const x = join(d, f); return statSync(x).isDirectory() ? walk(x) : [x]; });
  const files = walk(join(ROOT, "src/routes")).filter((f) => f.endsWith(".tsx")).map((f) => relative(ROOT, f)).sort();
  for (const f of files) {
    const rel = f.replace(/^src\/routes\//, "").replace(/\.tsx$/, "");
    if (rel === "__root" || rel.startsWith("api/")) continue;
    const text = readFileSync(join(ROOT, f), "utf8"); manifest.push({ path: f, sha256: sha(text) });
    const route = "/" + rel.split(/[./]/).filter((s) => s !== "route").join("/");
    const route_class = classifyRouteFile(f, inventoryByFile);
    const annotated_ids = [...new Set([...text.matchAll(/scrId=\{?["']([^"']+)["']/g), ...text.matchAll(/SCREENS\[["']([^"']+)["']\]/g)].map((m) => m[1]))].sort();
    const notScreen = route_class !== "content";
    push("SRC-11", f, f, { route, payload: { file: f, route, route_class, annotated_ids } },
      notScreen ? { screen_defining: false, route_class, technical_disposition: "PROPOSED_NOT_A_SCREEN" } : { route_class });
  }
}
for (const r of records) if (r.source_id === "SRC-11" && r.norm_route) liveRoutes.add(r.norm_route);
// SRC-14 sample (evidence count only) — F7 structural
const m00 = m00Structural(read("src/lib/m00-foundation.ts"));

records.sort(cmpRec);
// F1 — route evidence by screen ID from nav, route-file annotations, Figma, packet indexes
const routeEvidenceById = new Map();
const addRE = (id, source_id, record, route) => { const k = normId(id); if (!k || !route) return; (routeEvidenceById.get(k) ?? routeEvidenceById.set(k, []).get(k)).push({ source_id, record, route }); };
for (const r of records) {
  if (["SRC-05", "SRC-10", "SRC-12", "SRC-13"].includes(r.source_id) && r.norm_id) addRE(r.norm_id, r.source_id, r.source_record_id, r.norm_route);
  if (r.source_id === "SRC-11") for (const id of r.raw_payload.annotated_ids) addRE(id, "SRC-11", r.source_record_id, r.norm_route);
}
for (const r of records) {
  r.technical_disposition ??= r.screen_defining ? "CANDIDATE_MEMBER" : "EVIDENCE_ONLY";
  r.human_reconciliation_status = HUMAN_STATUS_INITIAL;
  if (!r.screen_defining) continue;
  const ev = (routeEvidenceById.get(r.norm_id) ?? []).filter((e) => e.record !== r.source_record_id)
    .sort((a, b) => a.source_id.localeCompare(b.source_id) || a.record.localeCompare(b.record));
  const st = routeStatus(r, ev);
  r.source_route_fact = st.source_route_fact;
  if (st.route_status) { r.route_status = st.route_status; r.route_evidence = ev; }
}

const pre = prePass(records);
const { candidates, refused, byRec } = formCandidates(records, pre);
const cands = candidates.map((c) => ({ ...c, recs: c.members.map((id) => byRec.get(id)) }));
const evidence = attachEvidence(records, cands);
const recById = new Map(records.map((r) => [r.source_record_id, r]));

// Candidate features for SIG-01..10 (own members + attached evidence)
const evByCand = new Map();
for (const e of evidence) for (const c of e.cands) (evByCand.get(c) ?? evByCand.set(c, []).get(c)).push(recById.get(e.record));
for (const c of cands) {
  const all = [...c.recs, ...(evByCand.get(c.cand_id) ?? [])];
  const f = { ids: new Set(), routes: new Set(), names: [], modules: new Set(), reqs: new Set(), purposes: [], actions: new Set(), components: new Set(), figmaKeys: new Set(), structSigs: new Set() };
  for (const r of c.recs) { if (r.norm_id) f.ids.add(r.norm_id); if (r.norm_route) f.routes.add(r.norm_route + (r.norm_state ? "#" + r.norm_state : "")); if (r.norm_name) f.names.push(r.norm_name); if (r.raw_module) f.modules.add(r.raw_module); }
  for (const r of all) {
    const p = r.raw_payload ?? {};
    for (const q of [...splitList(p.requirement_ids), ...splitList(p.requirements)]) if (/^REQ-/.test(q)) f.reqs.add(q);
    if (p.purpose) f.purposes.push(p.purpose);
    for (const a of [...splitList(p.primary_actions), ...splitList(p.actions)]) f.actions.add(a.toLowerCase());
    if (r.source_id === "SRC-12") { (p.components ?? []).forEach((x) => f.components.add(x)); if (p.key) f.figmaKeys.add(p.key); if (p.b9Key) f.figmaKeys.add(p.b9Key); if (p.structureSignature) f.structSigs.add(p.structureSignature); }
    if (r.source_id === "SRC-13" && p.frame_key) f.figmaKeys.add(p.frame_key);
  }
  f.names.sort(); f.purposes.sort();
  c.feat = f;
  c.technical_disposition = candidateDisposition(c, pre.protectedIds);
  c.human_reconciliation_status = HUMAN_STATUS_INITIAL;
}

// F2 — all candidate pairs evaluated (fuzzy included); relationships reported, never merged.
const matches = [];
for (let i = 0; i < cands.length; i++) for (let j = i + 1; j < cands.length; j++) {
  const a = cands[i], b = cands[j]; const s = signalsFull(a, b); const cls = classifyFull(s, identityConflict(a, b, pre.protectedIds));
  if (cls !== "NONE") matches.push({ cand_a: a.cand_id, cand_b: b.cand_id, signals: s, class: cls, merged: false });
}

// Issues
const issues = []; let n = 0;
const issue = (type, severity, body) => issues.push({ issue_id: "ISS-" + String(++n).padStart(5, "0"), issue_type: type, severity, ...body,
  technical_disposition: "OPEN", human_reconciliation_status: HUMAN_STATUS_INITIAL });
const semFor = (id) => (id === "SCR_AGENCY_SETUP" ? "SEM-01" : id === "UX-009" ? "SEM-02" : "SEM-07");
for (const id of [...pre.protectedIds].sort()) issue("SHARED_ALIAS", "Blocking", { alias: id, sem_ref: semFor(id),
  cand_ids: cands.filter((c) => c.recs.some((r) => r.norm_id === id)).map((c) => c.cand_id) });
for (const f of pre.findings.filter((f) => f.type === "ROUTE_CONFLICT")) issue("ROUTE_CONFLICT", "Blocking", { evidence: f, sem_ref: "SEM-07" });
for (const f of pre.findings.filter((f) => f.type === "CONFLICTING_METADATA")) issue("CONFLICTING_METADATA", "Review", { evidence: f, sem_ref: "SEM-06" });
for (const r of refused) issue("BOUNDARY_DECISION", "Blocking", { evidence: r, sem_ref: "SEM-07" });
for (const m of matches) issue(m.class === "CONFLICT" ? "MATCH_CONFLICT" : "POSSIBLE_DUPLICATE", m.class === "CONFLICT" ? "Blocking" : "Review",
  { cand_ids: [m.cand_a, m.cand_b], match_class: m.class, evidence: m.signals, sem_ref: "SEM-05" });
for (const r of records.filter((r) => r.screen_defining && r.source_route_fact === "SOURCE_MISSING_ROUTE"))
  issue("MISSING_ROUTE", "Review", { record_ids: [r.source_record_id], route_status: r.route_status, route_evidence_count: r.route_evidence.length, sem_ref: r.source_id === "SRC-01" ? "SEM-04" : "SEM-07" });
for (const c of cands) if (c.technical_disposition === "ORPHAN_ROUTE_ONLY") issue("ORPHAN_ROUTE", "Review", { cand_ids: [c.cand_id], route: c.recs[0].norm_route, sem_ref: "SEM-07" });
for (const c of cands) { const rs = new Set(c.recs.filter((r) => r.source_id !== "SRC-11").map((r) => r.norm_route).filter(Boolean)); if (rs.size > 1) issue("ROUTE_DISCREPANCY", "Review", { cand_ids: [c.cand_id], routes: [...rs].sort(), sem_ref: c.recs.some((r) => r.source_id === "SRC-04") ? "SEM-03" : "SEM-07" }); }
// F3
for (const d of registerRoutesNotLive(records, liveRoutes)) issue("REGISTER_ROUTE_NOT_LIVE", "Review", { record_ids: [d.record_id], route: d.route, sem_ref: d.sem_ref });
for (const e of changeLog.filter((e) => /route/i.test(e.claim) && e.screen_ids.length)) {
  const populated = records.filter((r) => r.source_id === "SRC-04" && e.screen_ids.includes(r.norm_id) && r.norm_route).length;
  if (populated) issue("ROUTE_DISCREPANCY", "Review", { evidence: { change_log_entry: e.entry, conf: e.conf, claim: "register routes empty", register_rows_with_route: populated, affected: e.screen_ids.length }, sem_ref: "SEM-03" });
}
// F4
for (const r of records.filter((r) => r.technical_disposition === "PROPOSED_NOT_A_SCREEN")) issue("PROPOSED_NOT_A_SCREEN", "Review", { record_ids: [r.source_record_id], route: r.norm_route, route_class: r.route_class, sem_ref: "SEM-07" });
for (const r of records.filter((r) => r.alias_kind === "UNKNOWN_ID")) issue("UNKNOWN_ID", "Info", { record_ids: [r.source_record_id] });
for (const e of evidence.filter((e) => e.source_id === "SRC-12" && e.cands.length === 0)) issue("FIGMA_MISMATCH", "Review", { record_ids: [e.record] });
// F7
const m00Reg = records.filter((r) => r.source_id === "SRC-01").length;
if (m00.structural !== m00Reg || m00.stated !== m00Reg) issue("COUNT_DISCREPANCY", "Review", { sem_ref: "SEM-04", evidence: { m00_sample_structural_entries: m00.structural, m00_sample_stated_count: m00.stated, m00_register_rows: m00Reg } });

// Population proof (pre-decision state)
const perSource = {};
for (const r of records) { const s = (perSource[r.source_id] ??= { records_in: 0, attached_to_candidate: 0, evidence_only: 0, proposed_not_a_screen: 0 });
  s.records_in++; r.technical_disposition === "PROPOSED_NOT_A_SCREEN" ? s.proposed_not_a_screen++ : r.screen_defining ? s.attached_to_candidate++ : s.evidence_only++; }
for (const s of Object.values(perSource)) s.remainder = s.records_in - s.attached_to_candidate - s.evidence_only - s.proposed_not_a_screen;
const tally = (xs, k) => xs.reduce((a, i) => ((a[i[k]] = (a[i[k]] ?? 0) + 1), a), {});
const sigCoverage = {};
for (const k of Array.from({ length: 10 }, (_, i) => "SIG-" + String(i + 1).padStart(2, "0"))) sigCoverage[k] = matches.filter((m) => m.signals[k]).length;

if (records.some((r) => r.route_status === "ROUTE_RECONCILED")) throw new Error("ROUTE_RECONCILED is human-only");
let commit = null; try { commit = execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim(); } catch {}
const snapshot_hash = sha(JSON.stringify(manifest));
const run = {
  meta: { phase: "Phase 0 Reconciliation", corrections: "F1-F9", authoritative: false, gsids_issued: 0, decisions_recorded: 0, commit, snapshot_hash, sources: manifest.length },
  counts: { records: records.length, candidates: cands.length, matches: matches.length, matches_by_class: tally(matches, "class"), signal_coverage: sigCoverage,
    issues: issues.length, issues_by_type: tally(issues, "issue_type"), issues_by_severity: tally(issues, "severity"),
    candidates_by_disposition: tally(cands, "technical_disposition"), protected_aliases: [...pre.protectedIds].sort(),
    m00: { register_rows: m00Reg, sample_structural_entries: m00.structural, sample_stated_count: m00.stated } },
  packets,
  population_proof: { per_source: perSource, candidates_open: cands.length, candidates_terminal: 0, approved_screens: 0,
    cross_check: { figma_screens: perSource["SRC-12"]?.records_in ?? 0, route_files: perSource["SRC-11"]?.records_in ?? 0 },
    status: "AWAITING_HUMAN_RECONCILIATION" },
  records, candidates: cands.map(({ recs, feat, ...c }) => c), evidence, matches, issues,
};
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "phase0-run.json"), JSON.stringify(run, null, 2) + "\n");
writeFileSync(join(OUT, "phase0-summary.json"), JSON.stringify({ meta: run.meta, counts: run.counts, population_proof: run.population_proof }, null, 2) + "\n");
console.log(JSON.stringify({ meta: run.meta, counts: run.counts, per_source: perSource }, null, 2));
