# F1–F9 Execution Blocker — Diagnostic

## Root cause

The approved corrections have not executed because they were never implemented in the active governance files. After the validation exposed F1–F9, the conversation remained in **planning mode**, where project-file edits are blocked. The approval card was then cancelled each time a new message arrived before it could complete the mode transition.

This is not a scan-time approval gate, a governance guard, or a failure inside the extractor. It is a workflow/mode blocker before execution.

The saved report is therefore still the last output from the original extractor. It was read repeatedly for validation, but it was not regenerated with F1–F9 because no corrected implementation exists to run.

## Evidence

- `tools/governance/out/phase0-run.json` is timestamped 18:24 and still reports:
  - 663 records
  - 285 candidates
  - 1 match
  - 245 issues
  - only SRC-01, 02, 03, 04, 08, 09, 10, 11 and 12
  - only SIG-01 through SIG-05 in match output
- Its record shape has no technical `disposition`, `route_status`, route-evidence list, or separate human reconciliation status.
- Its candidate shape contains only `cand_id` and `members`.
- `phase0-core.mjs` explicitly hard-codes `SIG-03: false` and implements only SIG-01, 02, 04 and 05.
- No implementation exists for SIG-06, 07, 08, 09 or 10.
- No extractor exists for SRC-05, SRC-06, SRC-07 or SRC-13.
- There are no F1–F9 functions, flags, or correction markers in the current governance implementation.
- No package script, build script, hook or scheduler invokes the Phase 0 scan. It runs only when `node tools/governance/phase0-extract.mjs` is invoked manually.
- The working-tree check showed no pending changes in `tools/governance`, `src`, `public`, Figma tools, database migrations, roadmap or project instructions from this diagnostic.

## Files and functions involved

### Generates `phase0-run.json`

- `tools/governance/phase0-extract.mjs`
  - Reads the currently implemented sources.
  - Constructs issues and the Population Proof inline.
  - Writes `tools/governance/out/phase0-run.json` at line 127.
  - Writes `phase0-summary.json` at line 128.

### Current matching and candidate logic

- `tools/governance/phase0-core.mjs`
  - `normalize()` — current normalization only; no route-status/disposition fields.
  - `prePass()` — current shared-ID/route/name detection.
  - `formCandidates()` — current candidate union.
  - `attachEvidence()` — current ID/route evidence attachment.
  - `signals()` — only SIG-01–SIG-05; SIG-03 hard-coded false.
  - `classify()` — classifies from that incomplete signal set.

### Tests

- `tools/governance/phase0-core.test.mjs`
  - Tests normalization, protected aliases, union/stop rules and determinism.
  - Has no F1–F9 coverage.

### Saved output

- `tools/governance/out/phase0-run.json`
- `tools/governance/out/phase0-summary.json`

These are generated artifacts, not an independent execution path.

## F1–F9 existence check

| Correction | Exists now? | Current behavior |
|---|---|---|
| F1 route evidence + three route states | No | Nav/Figma evidence can attach by route/ID, but it does not produce SOURCE_MISSING_ROUTE / ROUTE_EVIDENCE_AVAILABLE / ROUTE_RECONCILED. |
| F2 fuzzy matching + SIG-06–09 | Partial / No | SIG-04 exists as Jaccard in `signals()`, but candidate-pair generation indexes exact tokens, so fuzzy-only pairs are never evaluated. SIG-06–09 do not exist. |
| F3 M06/M08 register-route-not-live | No | No issue is emitted. |
| F4 layout/design-reference classification | No | Current route heuristic is incomplete; no proposed NOT_A_SCREEN evidence exists. |
| F5 every navigation entry | No | Only entries matching `label + to + scrId` are extracted. |
| F6 SRC-05/06/07/13 + SIG-03/10 | No | Sources absent; SIG-03 hard-coded false; SIG-10 absent. |
| F7 structural M00 sample count | No | Current regex counts token occurrences and yielded 6, not the intended structural population. |
| F8 ORPHAN_ROUTE → SEM-07 | No | ORPHAN_ROUTE issues have no `sem_ref`. |
| F9 technical disposition vs human status | No | Neither field exists. |

## Old-path and stale-artifact findings

- **Old path:** yes. The only runner imports the original `phase0-core.mjs` functions. There is no corrected alternate path.
- **Approval/guard in scan:** none. No code-level approval gate or stop condition prevents F1–F9.
- **Stale artifact:** yes in the ordinary sense: `phase0-run.json` is the unchanged 18:24 output. It is not being actively regenerated behind the scenes.
- **Artifact reuse:** yes. The later validation read this saved file directly. It did not pretend to be a corrected run, but repeatedly presenting it created that appearance.
- **Working tree:** no F1–F9 changes are present.

## Smallest safe remediation plan

Once build mode is available:

1. Modify only:
   - `tools/governance/phase0-core.mjs`
   - `tools/governance/phase0-extract.mjs`
   - `tools/governance/phase0-core.test.mjs`
   - generated files under `tools/governance/out/`
2. Implement exactly F1–F9 as already approved, with no Step 3 work.
3. Add tests proving:
   - all ten signals are computed;
   - protected aliases do not merge;
   - route evidence never becomes ROUTE_RECONCILED;
   - technical disposition and human status are independent;
   - SRC-05/06/07/13 and all nav entries are extracted;
   - M00 is counted structurally;
   - route discrepancies and NOT_A_SCREEN evidence are emitted;
   - ORPHAN_ROUTE carries SEM-07.
4. Run the corrected scan twice against one captured snapshot manifest.
5. Compare the complete generated bytes.
6. Return the corrected validation report and stop.

No Reconciliation Workspace, database writes, decisions, GSIDs, architecture changes or existing application-artifact edits are part of the remediation.

## Confirmation

This diagnostic was read-only. It did not rerun the scan and made no project, database, Figma, application or generated-output changes. F1–F9 remain unimplemented pending approval of this remediation.

## Execution note

Approving this card switches the session from planning to building. That is the one step that has been missing: earlier approval cards were cancelled because a new message arrived while they were still pending. After approval, F1–F9 will be implemented in the four approved locations only, tested, run twice for byte-identical output, and reported. Work will stop before Step 3.
