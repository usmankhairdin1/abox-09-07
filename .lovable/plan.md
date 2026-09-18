# Phase 48 — Governance Reconciliation & Audit-Trail Model (PLAN ONLY)

No implementation. No file changes in this phase. Production stays byte-identical.

## A. Fresh governance inventory (measured)

Governance documents in `.lovable/`: `manual-work-map.md` (663 lines, single human governance source, Phases 1–47), `design-system.md`, `project.json`, nine archived phase plan documents, the `plan/` archive, and the two Phase 47 generated artifacts `governance-report.json` / `governance-report.md`. `roadmap.md` at the project root still lists Phase 3 as deferred — known stale governance text, unchanged.

Phase 47 report, re-read for this phase: **201 findings**, schema fields `rule, file, line, type, canonicalOwner, exception, reason, futureAction, category`.

| Rule | Type | Count |
| --- | --- | --- |
| E5 | documented-exception | 10 |
| E5 | library-owned | 5 |
| E6 | canonical-consumer-count | 21 |
| E7 | canonical-name-collision | 5 |
| E7 | duplicate-export-name | 160 |

Enforcement status: E1, E2, E3, E4 and the `server-only` restriction active as ESLint errors; E5, E6, E7 report-only, on demand, not wired to build, dev, CI or runtime.

**Discrepancy found (the phase's main substantive result).** Of the 160 E7 `duplicate-export-name` findings, **154 are the exported `Route` constant** that TanStack file-based routing requires in every route module, and they are currently bucketed as `route-local-implementation`. Every route file legitimately and necessarily exports `Route`; this is a framework convention, not a duplicate definition. The remaining 6 are `Section` (2), `LoadingRows` (2), `Field` (2) across Lucie / M06 / M08 — already documented exceptions. So the report's real signal is 6 findings and 154 framework-convention entries, and the governance record should say so rather than leaving 160 undifferentiated. No other discrepancy exists between `manual-work-map.md` and the generated reports.

## B. Finding reconciliation record structure

Each reviewed finding gets one record with exactly these fields, recorded in `manual-work-map.md`:

```text
rule            E5 | E6 | E7
file            repository-relative path
site            line or symbol, where applicable
findingType     report `type` value, verbatim
classification  one of the Section C classes
owner           canonical source, runtime owner, shell, subtree, or library
canonicalSource path, when a canonical owner exists
exceptionReason prose reason, only for accepted exceptions
evidence        what was read to reach the disposition
disposition     accepted | review-required | stale | false-positive
reviewStatus    reviewed | not-reviewed
phaseMarker     "Phase 48" (no timestamps, no machine paths)
blockingEligible  no | conditional (with the exact condition)
```

No decision is invented: a finding with no evidence-backed disposition is recorded as `review-required` / `not-reviewed`, never silently resolved. `phaseMarker` replaces dates so the record stays deterministic.

## C. Classification vocabulary

Exactly eight classes, applied by evidence only: accepted/documented exception; canonical usage; intentional one-off; route or business-coupled; shell-specific; reference/runtime boundary; review-required; stale/false-positive. Nothing is ranked, scored or prioritised — the classes are unordered.

A ninth, narrowly scoped class is proposed for E7: **framework convention** — an export the framework requires in every module of a kind (the 154 `Route` exports). Without it, genuine E7 signal stays buried. It is descriptive only and grants no migration authority.

## D. Exception governance

Every existing exception survives Phase 48 untouched: three independent shells; Lucie; M06; M08; AI elements; shadcn/Radix primitives; the five route-local tables; business-coupled UI; Group B/C Surface cases; documented control variants; runtime branding; Marketplace Asset Management; reference content; the static ABox logo distinction from runtime White-Label. Report detection of similar code is never grounds to remove or merge an exception; exceptions change only through a separately approved phase with exact parity evidence.

## E. E5 review model

Review classifies; it never edits. No colour changes, no literal-to-token replacement, no runtime branding change, no route or library visualisation change. The frozen allowlist (carrier-mark hue, app.jet.branding display copy, plan-o-assistant shadow, the two brand-preview `#fff` contrast values, `src/components/ui/**` library-owned) is preserved as-is; all 15 current E5 findings are already classified and none is `review-required`, so the allowlist is evidenced as complete at this tree state. If a future run surfaces an unclassified literal, it is recorded as `review-required`, not allowlisted retroactively and not normalised.

## F. E6 counting model

`importerFiles` and `usageSites` remain two separate, separately labelled numbers for all 21 canonical symbols, alongside `typeOnlyImporters`, `referenceImporters`, `reExports`, `independentSystems`. Neither number is ever presented as a correction of the other, and no combined "consumer count" may be emitted. The historically divergent DataTable figures (Phase 42: 20 importer files; Phase 44: 23 call sites; Phase 47 AST run: 19 importer files / 26 usage sites) are preserved side by side as measurements from different tooling units, with the tooling named for each.

## G. E7 duplicate-definition model

Exact exported-name detection only — no JSX, class-string, utility, prop-shape or visual heuristic, no automatic winner selection, no deletion or merge. Disposition path for an apparent duplicate: **accepted intentional duplicate** when it lies inside a documented exception or is a framework convention; **review-required** when it is an exact canonical export name declared outside its canonical owner with no documented exception; **confirmed canonical adoption opportunity** only after a separate phase supplies exact parity evidence at 1440/834/390 and names two measurable consumers. Phase 48 produces no adoption opportunities.

## H. Staleness / drift model

A recorded finding is stale when the current source no longer contains the cited construct at the cited file (exact-name or exact-literal check against the present tree), or when the file no longer exists. Detection is a re-run of the deterministic report plus a diff of finding identity tuples `(rule, file, findingType)` against the recorded set — no timestamps, no machine paths, no network, no randomness. A stale finding is marked `stale` in the governance record; production code is never touched to make a finding stale or non-stale.

## I. Future blocking eligibility (nothing implemented now)

- **E5** could become blocking only for a precisely enumerated literal form in a precisely enumerated directory, with a frozen allowlist proven complete over at least one further phase, and zero findings at enable time. Repetition alone is never evidence.
- **E6** is inherently non-blocking: a consumer count is an inventory, not an invariant. No blocking form is proposed now or expected later.
- **E7** could become blocking only for exact canonical export names redeclared outside their canonical owner, after the framework-convention class and every documented exception are encoded and a full run shows zero unexplained findings.

In all three cases a future phase must supply its own plan, its own negative controls and an independent rollback. Phase 48 authorises none of this.

## J. Validation plan

Baseline lint capture and comparison (16,783 findings; `no-restricted-imports` 0); `tsgo` typecheck; production build; E1/E2/E3/E4 and `server-only` negative controls via `eslint --stdin`; two consecutive report runs compared by SHA-256 for determinism; report schema field-set unchanged; `git diff --stat -- src/` empty; locked canonical-source hashes unchanged (styles.css, canonical ABox sources, three shells, marketplace-store, logo, ui/table, ui/pagination, reference sources, eslint.config.js); no generated runtime asset; confirmation that `manual-work-map.md` remains the sole human governance source and that neither generated report is cited as a definition of ownership.

## K. Expected changes

Governance documentation only: a Phase 48 block in `.lovable/manual-work-map.md` recording the inventory, the reconciliation record structure, the classification vocabulary, the dispositions for the 201 findings (including the 154 framework-convention `Route` exports and the 6 real name collisions), the staleness model and the blocking-eligibility conditions. Optionally, the stale Phase 3 line in `roadmap.md` is corrected as a governance-only edit.

If reconciliation turns up nothing that needs recording, **zero-change completion is an explicitly valid outcome**.

No `src/` change, no ESLint change, no script change, no report-schema change, no runtime or branding or asset change.

## L. Rollback

Documentation-only: delete the Phase 48 block from `manual-work-map.md` and revert the optional `roadmap.md` line. No production rollback is possible or necessary because no production file is touched. Phases 45–47 enforcement and diagnostics remain intact by construction.

## M. Success criteria

E5/E6/E7 remain report-only; no production migration; no generated report becomes source of truth; all exception boundaries intact; `importerFiles` and `usageSites` stay separate; E7 stays exact-definition-only; no automatic remediation; E1–E4 still enforced; a defined reconciliation model links the governance record to the Phase 47 reports; every unresolved finding is explicitly `review-required`; production output completely unchanged.
