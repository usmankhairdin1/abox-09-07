# Phase 0 Corrected Scan — Validation Findings (read-only)

This is a findings report, not an implementation plan. Approving it authorizes nothing. Step 3 still needs its own approval.

## 1. Candidate independence

**Confirmed.** Candidates are built in full before any SIG-06–SIG-10 signal is calculated. No matching result is ever passed back into candidate building.

Order in `phase0-extract.mjs`:

```text
1. Extract records from all sources                      (lines ~24–106)
2. F1 route status/evidence (annotation only, no union)   (~110–124)
3. prePass(records)          -> protected IDs/routes
4. formCandidates(records, pre)  <- CANDIDATES FIXED HERE (line 126)
5. attachEvidence(...)       -> evidence links only
6. Candidate features + technical disposition             (~131–150)
7. signalsFull / classifyFull over candidate pairs        (line 155)
8. matches.push({..., merged: false})                     (line 156)
9. Issues written from matches                            (no write-back)
```

`formCandidates` in `phase0-core.mjs` (line 77) merges records under only two rules:
- **Pass (a), SAME_ID** (line 97): the same normalized ID. Protected IDs are excluded.
- **Pass (b), SAME_ROUTE** (line 109): the same normalized route, excluding protected routes. The merge is refused if an ID is protected, if the names clash (similarity below 0.5), if the modules clash, or if two different IDs of the same kind would end up together.

Only screen-defining records are used. `formCandidates` takes no signals, matches, or evidence as input. `signalsFull`/`classifyFull` run afterwards against a candidate list that is already fixed.

## 2. STRONG match — SCR-M06-003 and SCR-M06-004

| | CAND-000103 | CAND-000104 |
|---|---|---|
| Record | SRC-04:row2 (M06 register) | SRC-04:row3 |
| ID | SCR-M06-003 | SCR-M06-004 |
| Name | Agent Profile | Agency Profile |
| Route | /agency/agent-profile | /agency/agency-profile |
| Module | M06 composite | M06 composite |
| Purpose | "Provide the controlled agent profile experience." | "Provide the controlled agency profile experience." |
| Primary actions | "View; create or update permitted state; inspect reasons, history and owner freshness." | identical |

Signals: SIG-04, 05, 07, 08 and 09 are true. SIG-01, 02, 03, 06 and 10 are false.

Why it is STRONG: the names differ by one edit ("agent" vs "agency", distance 0.077, below the 0.15 limit). That is combined with three other soft signals (07, 08, 09). The IDs, routes, Figma keys and structure signatures all differ, and 18 separate traceability/flow/packet evidence records stay attached to each candidate on its own.

Assessment: this looks like a **false positive**. Two different business screens have template-generated purpose and action text. Only a human can decide that.

**Unresolved and cannot merge automatically:**
- The match has `merged: false`.
- Both candidates remain SINGLE_SOURCE and `UNREVIEWED`.
- Issue ISS-02039 (POSSIBLE_DUPLICATE, SEM-05) is OPEN and `UNREVIEWED`.
- The two IDs are different values of the same kind, so candidate building would refuse to merge them even if it read matches, which it does not.

## 3. M00 populations — 34, 52 and 3

| Value | What it is | Source | Where it is traceable |
|---|---|---|---|
| **34** | Rows in the governed M00 Screen_Register | `public/registers/m00.json`, SRC-01 | 34 individual records `SRC-01:row0…row33`, each in its own candidate |
| **52** | A **stated** summary number, `M00_SNAPSHOT.counts.screens = 52` | `src/lib/m00-foundation.ts` (sample data, SRC-14) | `counts.m00.sample_stated_count` + COUNT_DISCREPANCY evidence |
| **3** | The screen entries **actually present** in `M00_SNAPSHOT.screens`: SCR_PLATFORM_HOME, SCR_AUDIT_LOG and SCR_ACL_MATRIX | same file, counted by structure | `counts.m00.sample_structural_entries` + COUNT_DISCREPANCY evidence |

All three numbers are recorded separately in one COUNT_DISCREPANCY issue (SEM-04) and in `counts.m00`. Nothing is added up, averaged, or reconciled.

**Limitation:** the three sample entries are counted and their source file hash is recorded, but they are **not** saved as individual SourceRecords. Tracing each one individually would require a future extractor change. That is not part of F1–F9 and I have not made it.

## 4. POSSIBLE match isolation

**Confirmed for all 2,604 POSSIBLE matches (and all 2,626 matches in total):**
- **Candidate membership:** unchanged. Matches are created only after candidates are fixed (§1), and every match has `merged: false`.
- **Human reconciliation status:** every candidate, record and issue is `UNREVIEWED`. The scan never writes any other value.
- **GSID assignment:** none. `meta.gsids_issued = 0`, and no record has a GSID field.
- **Future registry identity:** none is created. The output is marked `authoritative: false`. POSSIBLE items appear only as Review-level POSSIBLE_DUPLICATE issues waiting for a human.

## 5. Figma identity

**Confirmed.** The 179 Phase 59 records (SRC-12) and 179 B9 records (SRC-13) are `screen_defining: false` and `technical_disposition: EVIDENCE_ONLY`. They never enter candidate building. They are only linked to candidates by ID or route. Their Figma keys and structure signatures feed SIG-03 and SIG-10 as signals. A link means the evidence was found, not that screen identity is settled.

The following conflicts show this directly: SCR_AGENCY_SETUP against two routes, UX-009 against /plans, and UX-003–UX-008 sharing one Figma structure. They are reported as CONFLICT, not resolved.

## 6. Candidate integrity

**Confirmed.** There are 409 screen-defining records (SRC-01/02/03/04/08/09 plus 145 content route files). The candidates contain 409 member references, all unique. That is exactly one candidate per record, with nothing missing or duplicated. This follows from the union-find structure in `formCandidates` (every record starts on its own and ends in exactly one group). It does not depend on matches.

## 7. Protected aliases in Step 3

**Current state:**
- All 4 candidates carrying SCR_AGENCY_SETUP, UX-009 or SCR_PLATFORM_HOME have `technical_disposition: BLOCKED_PROTECTED_ALIAS`.
- They are excluded from both merge passes.
- Each alias has a Blocking SHARED_ALIAS issue (SEM-01, SEM-02, SEM-07).
- Every match that involves them is classed as CONFLICT (Blocking).

**Caveat:** Step 3 does not exist yet. The scan output cannot, by itself, stop a future Step 3 from resolving these aliases automatically. That protection depends on Step 3 being built to follow these rules: human boundary decisions for protected aliases, no automatic acceptance for protected IDs, and two-person approval. Those rules should be explicit acceptance criteria in the Step 3 plan.

## 8. No hidden mutation

**Confirmed:**
- The scan writes only `tools/governance/out/phase0-run.json` and `phase0-summary.json`.
- Database statistics for the 10 `gov_stage` tables all show 0 live rows. The scanner never connects to the database. This sandbox is not allowed to read those tables directly, so exact counts could not be run.
- `gsids_issued: 0` and `decisions_recorded: 0`.
- No reconciliation workspace, registry records, ledger records or decisions exist.
- This validation changed nothing. The only file written was this findings report.

## Summary of caveats

1. The STRONG match between SCR-M06-003 and SCR-M06-004 is probably a false positive caused by template text in the register. It needs a human decision.
2. The three M00 sample entries are counted but not stored as separate records.
3. Protecting the aliases in Step 3 must be written into the Step 3 design; the Phase 0 scan cannot enforce it on its own.
