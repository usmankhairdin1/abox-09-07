# Step 3 — Reconciliation Workspace: Design and Implementation Plan

This is a plan only. Approving it lets a later build turn implement what is described here. It does not by itself create tables, decisions or GSIDs, or change any baseline.

## 1. Purpose and baseline

Step 3 is where humans review the frozen Phase 0 baseline and record decisions about it, with two-person approval, until every candidate reaches a final state. The baseline is fixed:

- `tools/governance/out/phase0-run.json`, snapshot `d7800275…`, file hash `f7bdf608…`
- 1,897 records, 277 candidates, 2,626 matches, 2,917 issues

Step 3 only reads the baseline. It never re-runs the scan or edits the baseline. If the app sources change, a new scan is a separate run with its own approval and does not replace this one.

## 2. Workflow

```text
LOAD (once, hash-verified) -> QUEUE -> PROPOSE -> APPROVE / REJECT -> TERMINAL
                                              \-> WITHDRAW (proposer, before approval)
All candidates terminal + all Blocking issues decided -> APPROVED SET proposed -> second approver freezes it
```

1. **Load.** An operator loads the baseline file into `gov_stage` once. The loader checks the file hash and the snapshot hash against the values above and stops if either differs.
2. **Queue.** Issues are ordered by severity (Blocking, then Review, then Info), then SEM reference, then issue ID. Each item shows the source records side by side, the attached evidence and the SIG-01–SIG-10 values.
3. **Propose.** A reviewer proposes one decision. It must include an outcome, a rationale and at least one evidence reference.
4. **Approve.** A different person approves or rejects it. Approved decisions are permanent. To change one, a new decision supersedes it.
5. **Terminal state.** A candidate becomes terminal only through an approved decision.

## 3. Existing screen or new screen

For every candidate the reviewer must choose one of:

- **EXISTING:** it matches a governed register row (SRC-01–04 or SRC-09).
- **NEW:** it has no governed row, for example screens.ts entries, orphan routes, or Figma-only frames.

NEW screens can only become APPROVED_SCREEN with a rationale explaining why no register row applies. Matches may point to possible existing screens, but the choice is always human.

EXISTING/NEW is required only for APPROVED_SCREEN, MERGED_INTO and VARIANT_OF. NOT_A_SCREEN and DEFERRED can be chosen on their own, without an EXISTING/NEW classification.

## 4. Outcomes (the final states already defined in Phase 0)

| Outcome | Meaning | Required fields |
|---|---|---|
| APPROVED_SCREEN | One logical screen | name, owner module, primary route (or deferred route), included record IDs |
| MERGED_INTO | This candidate is the same screen as another | target candidate, which must not itself be MERGED_INTO (no chains) |
| VARIANT_OF | A state or variant of another screen | parent candidate, variant key |
| NOT_A_SCREEN | Layout, design reference or visual state | reason code |
| DEFERRED | Left out of this approved set | reason, owner |

## 5. Boundary patterns

| Pattern | How it is handled |
|---|---|
| ONE_SCREEN_MULTI_ROUTE | One APPROVED_SCREEN lists several routes. Each extra route candidate is MERGED_INTO it. |
| MULTIPLE_SCREENS_SHARED_LEGACY_ID | Split decision: each part becomes its own APPROVED_SCREEN. The legacy ID becomes an *unresolved shared alias*, owned by at most one screen and marked ambiguous on the others. |
| ONE_SCREEN_VARIANTS | Children are VARIANT_OF the parent (for example the UX-003–UX-008 wizard steps, or the UX-009 `filters` / `edit-quote` states). |
| DUPLICATE_CONFLICT | A decision is required: either DISTINCT_SCREENS (both approved separately) or DUPLICATE (one MERGED_INTO the other). |

## 6. Reviewing STRONG, POSSIBLE and CONFLICT evidence

- None of these classes is ever accepted automatically.
- STRONG and CONFLICT matches each need an explicit decision.
- POSSIBLE matches (2,604) may be closed in bulk as `DISTINCT_NO_ACTION` only when all of these hold:
  - the match has no SIG-01, SIG-02 or SIG-03;
  - a filter is recorded (for example "SIG-05+08+09 only");
  - the decision shows the count and hash of the pairs it closes;
  - a second person approves it.
- Closing a match never changes candidate membership. Only an approved outcome decision does.

## 7. Protected aliases: SCR_AGENCY_SETUP, UX-009, SCR_PLATFORM_HOME

These are enforced in the database, not only in the screens:

- **No automatic merge or acceptance.** Any decision touching a candidate or issue with a protected alias must be of type `BOUNDARY_DECISION`. Bulk closure is refused for them.
- **Human boundary decision:** the decision must include an alias owner (or "unresolved shared"), one pattern from §5, and per-route assignments.
- **Two-person approval:** the proposer can never approve their own decision. The approver must hold the `gov_approver` role.
- **Rationale and audit:** the rationale must be at least 40 characters. Every action is logged.
- These are handled as SEM-01 (Agency setup), SEM-02 (UX-009) and SEM-07 (Platform home, including its name conflict: "JET Platform Home" vs "Platform Foundation Home").

## 8. Specific cases

- **SCR-M06-003 vs SCR-M06-004 (STRONG):** needs its own human DUPLICATE_CONFLICT decision. The evidence is shown neutrally, and no outcome is preselected, defaulted or suggested. Bulk closure is refused for it.
- **M00 34 / 52 / 3:** three separate items of evidence: 34 register rows, a stated count of 52, and 3 actual sample entries. The SEM-04 decision must deal with each number separately and cannot reconcile them by adding them up.
  - The 3 sample entries (SCR_PLATFORM_HOME, SCR_AUDIT_LOG, SCR_ACL_MATRIX) are viewable individually.
  - At load time they are read from the source file, which is checked against the hash in the baseline manifest.
  - They are stored as evidence rows in `gov_stage.m00_sample_entry`.
  - The Phase 0 scanner is not changed.
- **Figma (179 Phase 59 + 179 B9 records):** displayed as evidence only. They can never be the subject of a decision, and they are never enough for APPROVED_SCREEN or MERGED_INTO on their own. At least one screen-defining record must support the decision.

## 9. Decision, approval and audit model

Changes planned for a later migration (`gov_stage` only):

- **Fix a design conflict in the existing schema.** `decision` already has an `approved_by` column, but its trigger blocks all updates, so approval could never be written. The fix is a new append-only table `decision_event (event_id, decision_id, event_type[PROPOSED|APPROVED|REJECTED|WITHDRAWN|SUPERSEDED], actor, rationale, at)`. The existing `approved_by` column is left null.
- New append-only table `m00_sample_entry (run_id, entry_index, screen_id, name, payload, source_hash)`. It holds evidence only and is never a candidate.
- New table `gov_role (user_id, role[gov_reviewer|gov_approver|gov_operator])`, separate from profiles. It is checked by a security-definer function `gov_stage.has_gov_role`.
- New `audit_event`: an append-only, hash-chained log (`prev_hash`, `hash`) of loads, views of protected items, proposals, approvals and exports.
- Every write goes through security-definer functions:
  - `load_run(file_hash)`
  - `propose_decision(...)`
  - `approve_decision(id, idempotency_key)`
  - `reject_decision(...)`
  - `withdraw_decision(...)`
  - `propose_approved_set()`
  - `freeze_approved_set(set_id)`

  Direct table access is not granted.
- A decision's state is always derived from its latest event. A candidate's terminal state comes from its latest approved outcome that has not been superseded.

## 10. Proposer/approver separation

The same person can never propose and approve, enforced in three ways:
- a check constraint on the tables;
- a check inside the approval function;
- a test.

This applies to decisions, bulk closures and freezing the approved set. The operator who loads the baseline cannot approve decisions made in that run.

## 11. Idempotency and conflicts

- Loading is idempotent: loading the same hash again does nothing, and a different hash is refused.
- Every write takes an `idempotency_key`. Replaying the same call returns the original result.
- Only one open proposal is allowed per candidate or issue. A second proposal is refused with a reference to the first.
- Approval uses a version check. It fails if the evidence or any related decision changed after the proposal.
- MERGED_INTO cannot create cycles or chains, and VARIANT_OF cannot point to a candidate that is NOT_A_SCREEN or DEFERRED.

## 12. Security

- Every page requires sign-in plus a governance role, checked on the server.
- `gov_stage` stays hidden from the browser and from signed-in users generally. Access happens only through server functions that verify the role with the caller's own session, then call the security-definer functions.
- No admin-key access is used for role checks.
- There is no anonymous access, and role or admin status is never judged in the browser.

## 13. Read and write scope

**May read:** the frozen baseline file, and `gov_stage` data through the server functions.

**May write:** only `gov_stage` tables, through the functions listed in §9, plus exports under `tools/governance/out/step3/`.

**Must not modify:**
- the Phase 0 output files or the scanner;
- routes, `screens.ts`, nav, registers, M08, the M00 sample data, or governed indexes;
- Figma tokens or the plugin, or anything in Figma;
- application tables, the Architecture Rev. 3 document, or the B0–B10 design-system batches.

It must also create no GSIDs and no registry or ledger records.

## 14. Proposed files (later build turn)

- `drizzle/migrations/0001_step3_workspace.sql`: `decision_event`, `gov_role`, `audit_event`, `m00_sample_entry`, the functions and grants (§9–12).
- `tools/governance/step3-load.mjs`: hash-verified baseline loader.
- `src/lib/governance/recon.functions.ts`: server functions (queue, detail, propose, approve, reject, withdraw, set).
- `src/lib/governance/recon.server.ts`: helpers that call the database functions.
- New pages under `src/routes/governance/`: `reconciliation.tsx` (queue), `reconciliation.$candId.tsx` (review), `reconciliation.approved-set.tsx`.
- `tools/governance/step3.test.mjs` plus database tests.
- Updates to `AGENTS.md` and `roadmap.md`.

**D1 (approved):** new isolated `/governance/*` pages are allowed as dedicated governance tooling, as new files only. No existing screen, route, nav item, Figma file, register, M08 file, M00 source data or other protected artifact is modified. `src/routeTree.gen.ts` regenerates automatically when pages are added and is not edited by hand. The Phase 0 scanner and its output files are not touched.

## 15. Tests and acceptance criteria

1. The loader refuses a baseline whose file hash or snapshot hash differs; loading the same file twice produces no change.
2. The baseline file bytes are unchanged before and after Step 3; loaded rows equal 1,897 / 277 / 2,626 / 2,917.
3. A proposer approving their own decision is refused (constraint, function and screen).
4. For each of the 3 protected aliases: bulk closure, non-boundary decisions, short rationale and self-approval are all refused.
5. M06-003/004 is refused in bulk and needs its own decision.
6. The SEM-04 decision schema requires the 34, 52 and 3 evidence to be referenced separately.
7. Decisions supported only by Figma evidence are refused.
8. Replaying a write with the same idempotency key returns the original result; a second open proposal is refused; approval against stale evidence is refused; merge cycles are refused.
9. Updating or deleting records, decisions, events or the audit log is blocked; the audit hash chain verifies.
10. Users without a governance role get 403 on every server function; anonymous users cannot reach `gov_stage`.
11. The approved set can be frozen only when all candidates are terminal and all Blocking issues are decided, with a second approver; the frozen set's hash is recorded.
12. Checks show no changes to protected files (§13).
13. NOT_A_SCREEN and DEFERRED can be recorded without EXISTING/NEW. APPROVED_SCREEN, MERGED_INTO and VARIANT_OF are refused without it.
14. All 3 M00 sample entries can be viewed individually. The loader refuses them if the source file hash differs from the baseline manifest.
15. Bulk closure of POSSIBLE matches leaves candidate membership and outcomes unchanged.
16. The M06-003/004 decision screen has no preselected or default outcome.

## 16. When GSIDs become allowed

GSIDs stay forbidden throughout Step 3. They may be issued only when all of these are true:

1. the approved set is frozen with two-person approval;
2. the population proof balances (remainder 0 per source);
3. SEM-01 to SEM-07 are all decided or explicitly deferred;
4. a separate Phase 1 registration plan has been approved.

GSIDs are then issued once, at registration, per Architecture Rev. 3. Step 3 has no code that creates them.
