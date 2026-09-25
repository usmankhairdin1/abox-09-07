#!/usr/bin/env node
// Phase 0 Reconciliation runner — READ-ONLY against every ABox source.
// Writes only to tools/governance/out/ (isolated Phase 0 infrastructure).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { execSync } from "node:child_process";
import { normalize, prePass, formCandidates, attachEvidence, signals, classify, cmpRec } from "./phase0-core.mjs";

const ROOT = new URL("../..", import.meta.url).pathname;
const OUT = join(ROOT, "tools/governance/out");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const manifest = [];
const read = (p) => { const t = readFileSync(join(ROOT, p), "utf8"); manifest.push({ path: p, sha256: sha(t) }); return t; };
const records = [];
const push = (source_id, source_path, record_locator, f) => records.push(normalize({
  source_record_id: `${source_id}:${record_locator}`, source_id, source_path, record_locator,
  raw_id: f.id ?? null, raw_name: f.name ?? null, raw_route: f.route ?? null, raw_module: f.module ?? null, raw_payload: f.payload ?? f,
}));

// SRC-01..04 registers
for (const [sid, mod] of [["SRC-01", "M00"], ["SRC-02", "M04"], ["SRC-03", "M05"], ["SRC-04", "M06"]]) {
  const p = `public/registers/${mod.toLowerCase()}.json`;
  const reg = JSON.parse(read(p)).registers.Screen_Register;
  const rows = Array.isArray(reg) ? reg : reg.rows;
  rows.forEach((r, i) => push(sid, p, `row${i}`, { id: r.screen_id, name: r.name, route: r.route ?? null,
    module: r.owning_module || r.ownership || mod, payload: r }));
}
// SRC-08 screens.ts
{
  const p = "src/lib/screens.ts"; const t = read(p);
  for (const m of t.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*workspace:\s*"([^"]+)"/g))
    push("SRC-08", p, m[1], { id: m[1], name: m[2], module: m[3], payload: { id: m[1], name: m[2], workspace: m[3] } });
}
// SRC-09 m08 registry
{
  const p = "src/lib/m08/registry.ts"; const t = read(p);
  for (const m of t.matchAll(/id:\s*"(SCR-M08-\d+)",\s*key:\s*"([^"]+)",[\s\S]*?route:\s*"([^"]+)"/g))
    push("SRC-09", p, m[1], { id: m[1], name: m[2], route: m[3], module: "M08", payload: { id: m[1], key: m[2], route: m[3] } });
}
// SRC-10 nav-config (evidence only)
{
  const p = "src/lib/nav-config.ts"; const t = read(p);
  let n = 0;
  for (const m of t.matchAll(/label:\s*"([^"]+)",\s*to:\s*"([^"]+)"[^}]*?scrId:\s*"([^"]+)"/g))
    push("SRC-10", p, `nav${n++}`, { id: m[3], name: m[1], route: m[2], payload: { label: m[1], to: m[2], scrId: m[3] } });
}
// SRC-11 route files
{
  const walk = (d) => readdirSync(d).flatMap((f) => { const x = join(d, f); return statSync(x).isDirectory() ? walk(x) : [x]; });
  const files = walk(join(ROOT, "src/routes")).filter((f) => f.endsWith(".tsx")).map((f) => relative(ROOT, f)).sort();
  for (const f of files) {
    const rel = f.replace(/^src\/routes\//, "").replace(/\.tsx$/, "");
    if (rel === "__root" || rel.startsWith("api/")) continue;
    const segs = rel.split(/[./]/);
    const layoutOnly = segs[segs.length - 1] === "route" || segs[segs.length - 1].startsWith("_");
    const route = "/" + segs.filter((s) => s !== "route").join("/");
    manifest.push({ path: f, sha256: sha(readFileSync(join(ROOT, f), "utf8")) });
    if (layoutOnly) continue;
    push("SRC-11", f, f, { route, name: null, payload: { file: f, route } });
  }
}
// SRC-12 Figma Phase 59 (evidence only)
{
  const p = "tools/figma-plugin/tokens-current-app.js"; const t = read(p);
  const data = new Function(t + "; return ABOX_CURRENT_APP;")();
  (data.screens ?? []).forEach((s) => push("SRC-12", p, s.key, { id: s.b9ScreenId ?? s.screenId ?? null,
    name: s.name ?? s.title ?? null, route: s.route ?? null, payload: { key: s.key, route: s.route, state: s.state ?? null } }));
}
// SRC-14 sample (evidence count only)
const m00SampleCount = (read("src/lib/m00-foundation.ts").match(/SCR_[A-Z0-9_]+/g) ?? []).length;

records.sort(cmpRec);
const pre = prePass(records);
const { candidates, refused, byRec } = formCandidates(records, pre);
const cands = candidates.map((c) => ({ ...c, recs: c.members.map((id) => byRec.get(id)) }));
const evidence = attachEvidence(records, cands);

// Matching: pairs sharing id, route or name tokens (bounded by index)
const matches = [];
const tokIdx = new Map();
cands.forEach((c, i) => { for (const r of c.recs) for (const k of [r.norm_id, r.norm_route, r.norm_name]) if (k) (tokIdx.get(k) ?? tokIdx.set(k, new Set()).get(k)).add(i); });
const seen = new Set();
for (const set of tokIdx.values()) { const arr = [...set].sort((a, b) => a - b); for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
  const k = arr[i] + ":" + arr[j]; if (seen.has(k)) continue; seen.add(k);
  const a = cands[arr[i]], b = cands[arr[j]]; const s = signals(a, b);
  const conflict = [...a.recs, ...b.recs].some((r) => r.norm_id && pre.protectedIds.has(r.norm_id));
  matches.push({ cand_a: a.cand_id, cand_b: b.cand_id, signals: s, class: classify(s, conflict) });
} }

// Issues
const issues = []; let n = 0;
const issue = (type, severity, body) => issues.push({ issue_id: "ISS-" + String(++n).padStart(5, "0"), issue_type: type, severity, ...body });
const semFor = (id) => (id === "SCR_AGENCY_SETUP" ? "SEM-01" : id === "UX-009" ? "SEM-02" : "SEM-07");
for (const id of [...pre.protectedIds].sort()) issue("SHARED_ALIAS", "Blocking", { alias: id, sem_ref: semFor(id),
  cand_ids: cands.filter((c) => c.recs.some((r) => r.norm_id === id)).map((c) => c.cand_id) });
for (const f of pre.findings.filter((f) => f.type === "ROUTE_CONFLICT")) issue("ROUTE_CONFLICT", "Blocking", { evidence: f, sem_ref: "SEM-07" });
for (const f of pre.findings.filter((f) => f.type === "CONFLICTING_METADATA")) issue("CONFLICTING_METADATA", "Review", { evidence: f, sem_ref: "SEM-06" });
for (const r of refused) issue("BOUNDARY_DECISION", "Blocking", { evidence: r, sem_ref: "SEM-07" });
for (const m of matches.filter((m) => m.class === "STRONG" || m.class === "POSSIBLE")) issue("POSSIBLE_DUPLICATE", "Review", { cand_ids: [m.cand_a, m.cand_b], evidence: m.signals, sem_ref: "SEM-05" });
for (const r of records.filter((r) => r.screen_defining && r.source_id !== "SRC-11" && !r.norm_route)) issue("MISSING_ROUTE", "Review", { record_ids: [r.source_record_id], sem_ref: r.source_id === "SRC-01" ? "SEM-04" : "SEM-07" });
for (const c of cands) if (c.recs.every((r) => r.source_id === "SRC-11")) issue("ORPHAN_ROUTE", "Review", { cand_ids: [c.cand_id], route: c.recs[0].norm_route });
for (const c of cands) { const rs = new Set(c.recs.filter((r) => r.source_id !== "SRC-11").map((r) => r.norm_route).filter(Boolean)); if (rs.size > 1) issue("ROUTE_DISCREPANCY", "Review", { cand_ids: [c.cand_id], routes: [...rs].sort(), sem_ref: c.recs.some((r) => r.source_id === "SRC-04") ? "SEM-03" : "SEM-07" }); }
for (const r of records.filter((r) => r.alias_kind === "UNKNOWN_ID")) issue("UNKNOWN_ID", "Info", { record_ids: [r.source_record_id] });
for (const e of evidence.filter((e) => e.source_id === "SRC-12" && e.cands.length === 0)) issue("FIGMA_MISMATCH", "Review", { record_ids: [e.record] });
const m00Reg = records.filter((r) => r.source_id === "SRC-01").length;
if (m00SampleCount !== m00Reg) issue("COUNT_DISCREPANCY", "Review", { sem_ref: "SEM-04", evidence: { m00_sample_ids: m00SampleCount, m00_register: m00Reg } });

// Population proof (pre-decision state)
const perSource = {};
for (const r of records) { const s = (perSource[r.source_id] ??= { records_in: 0, attached_to_candidate: 0, evidence_only: 0 }); s.records_in++; r.screen_defining ? s.attached_to_candidate++ : s.evidence_only++; }
for (const s of Object.values(perSource)) s.remainder = s.records_in - s.attached_to_candidate - s.evidence_only;
const byType = issues.reduce((a, i) => ((a[i.issue_type] = (a[i.issue_type] ?? 0) + 1), a), {});
const bySev = issues.reduce((a, i) => ((a[i.severity] = (a[i.severity] ?? 0) + 1), a), {});

let commit = null; try { commit = execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim(); } catch {}
const snapshot_hash = sha(JSON.stringify(manifest));
const run = {
  meta: { phase: "Phase 0 Reconciliation", authoritative: false, gsids_issued: 0, commit, snapshot_hash, sources: manifest.length },
  counts: { records: records.length, candidates: cands.length, matches: matches.length, issues: issues.length, issues_by_type: byType, issues_by_severity: bySev, protected_aliases: [...pre.protectedIds].sort() },
  population_proof: { per_source: perSource, candidates_open: cands.length, candidates_terminal: 0, approved_screens: 0,
    cross_check: { figma_screens: perSource["SRC-12"]?.records_in ?? 0, route_files_non_layout: perSource["SRC-11"]?.records_in ?? 0 },
    status: "AWAITING_HUMAN_RECONCILIATION" },
  records, candidates: cands.map(({ recs, ...c }) => c), evidence, matches, issues,
};
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "phase0-run.json"), JSON.stringify(run, null, 2) + "\n");
writeFileSync(join(OUT, "phase0-summary.json"), JSON.stringify({ meta: run.meta, counts: run.counts, population_proof: run.population_proof }, null, 2) + "\n");
console.log(JSON.stringify({ meta: run.meta, counts: run.counts, per_source: perSource }, null, 2));
