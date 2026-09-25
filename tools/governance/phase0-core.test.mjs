import assert from "node:assert/strict";
import { normalize, prePass, formCandidates, normRoute, aliasKind } from "./phase0-core.mjs";

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
console.log("phase0-core tests passed");
