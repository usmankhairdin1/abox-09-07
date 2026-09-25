# Phase 0 Steps 1–2 — Read-only Scan Validation

Scope: a read-only analysis of the saved scan (`tools/governance/out/phase0-run.json`; commit `b15d140…`; snapshot hash `4ae9d3c6…`).

Nothing was changed to produce this summary: nothing was loaded into `gov_stage`, no decisions were recorded, no GSIDs were issued, and no application artifacts were touched.

**Headline:** the scan respected every boundary, but validation found **extraction and matching gaps**. Because of these gaps, several issue counts are understated and one is misattributed. They are listed in §8 as proposed fixes, which need your approval before Step 3. The data has not been adjusted to make the counts fit.

---

## 1. Actual counts vs plan estimates

| Item | Plan estimate | Scan | Classification | Explanation |
|---|---|---|---|---|
| `screens.ts` (SRC-08) | ~120 | 119 | Count correction | The estimate counted every `id:` token, including the interface declaration. There are 119 real entries. |
| Route files (SRC-11) | 154 files | 153 records | Extraction scope (needs review) | `__root.tsx` is excluded. The layout-only filter uses a simple segment heuristic. Phase 59 identified 6 layout-only and 2 design-reference files, and they are probably still counted here as screens (see §8-F4). |
| Navigation links (SRC-10) | not estimated | 67 | Extraction scope | Only nav entries that carry a `scrId` are captured. Entries without a screen ID are not extracted (§8-F5). |
| Figma screens (SRC-12) | 179 | 179 | Matches | 96 carry a governed screen ID; 83 are route-only. |
| SourceRecords total | not estimated | 663 | Derived | 34 + 36 + 30 + 35 + 119 + 10 + 67 + 153 + 179. SRC-05/06/07/13 are not extracted yet (§8-F6). |
| Candidates | not estimated | 285 | Derived | Formed from screen-defining records only (§5). |
| Issues | not estimated | 245 | Derived, understated | See §3 and §8. |
| M00 sample count (SRC-14) | 52 | 6 | Parsing interpretation (defect) | The regex counted only distinct `SCR_*` tokens. The COUNT_DISCREPANCY evidence value (6 vs 34) is therefore wrong and must be re-extracted (§8-F7). |

## 2. What "every source balances" means

Confirmed: **every extracted record has an explicit disposition. It does not mean that every record matched something.**

| Source | Records | Attached to a candidate | Evidence-only | Remainder |
|---|---:|---:|---:|---:|
| SRC-01 M00 | 34 | 34 | 0 | 0 |
| SRC-02 M04 | 36 | 36 | 0 | 0 |
| SRC-03 M05 | 30 | 30 | 0 | 0 |
| SRC-04 M06 | 35 | 35 | 0 | 0 |
| SRC-08 `screens.ts` | 119 | 119 | 0 | 0 |
| SRC-09 M08 | 10 | 10 | 0 | 0 |
| SRC-10 nav | 67 | 0 | 67 (all linked to ≥1 candidate) | 0 |
| SRC-11 routes | 153 | 153 | 0 | 0 |
| SRC-12 Figma | 179 | 0 | 179 (all linked to ≥1 candidate) | 0 |

- **Unmatched records stay visible.** A record without a match is still "attached": it is a singleton candidate with its own issue, and nothing is discarded. For example:
  - each of the 34 M00 rows is its own candidate and carries a MISSING_ROUTE issue;
  - each of the 87 unmatched route files is its own candidate and carries an ORPHAN_ROUTE issue.
- **Traceability:** every record keeps its source path, source hash, record locator and verbatim raw payload.
- **Dispositions not yet used:** NOT_A_SCREEN and DEFERRED are *decision* outcomes (Step 3). No record has them yet.

## 3. Issue breakdown (245)

| Type | Count | Severity | Candidates | Records | Human decision | SEM | Kind |
|---|---:|---|---:|---:|---|---|---|
| SHARED_ALIAS | 3 | Blocking | 4 | (via alias) | Yes | SEM-01, SEM-02, SEM-07 | Identity/boundary |
| CONFLICTING_METADATA | 1 | Review | (SCR_PLATFORM_HOME) | 2 | Yes | SEM-06 | Identity/boundary |
| ORPHAN_ROUTE | 87 | Review | 87 | 87 | Yes (screen / NOT_A_SCREEN / link) | none assigned (§8-F8) | Identity/boundary |
| MISSING_ROUTE | 153 | Review | — | 153 (M00 34, `screens.ts` 119) | Yes | SEM-04 (34), SEM-07 (119) | Data quality, but the 119 are a scope artifact (§8-F1) |
| COUNT_DISCREPANCY | 1 | Review | — | — | Yes | SEM-04 | Data quality (evidence value wrong, §8-F7) |
| BOUNDARY_DECISION, POSSIBLE_DUPLICATE, ROUTE_CONFLICT, ROUTE_DISCREPANCY, FIGMA_MISMATCH, UNKNOWN_ID | 0 | — | — | — | — | — | Understated (§8-F2, F3) |

- **By severity:** 3 Blocking, 242 Review, 0 Info.
- **By kind:**
  - 91 are identity/boundary questions (3 + 1 + 87).
  - 154 are metadata/data-quality issues (153 + 1).
- **Representative examples:**
  - `ISS-00001` SHARED_ALIAS `SCR_AGENCY_SETUP` → CAND-000138.
  - `ISS-00002` SHARED_ALIAS `SCR_PLATFORM_HOME` → CAND-000001, CAND-000161.
  - `ISS-00004` CONFLICTING_METADATA `SCR_PLATFORM_HOME`: "JET Platform Home" vs "Platform Foundation (M00)".
  - `ISS-00005` MISSING_ROUTE `SRC-01:row0`.
  - `ISS-00158` ORPHAN_ROUTE `/accessibility` → CAND-000199.
  - `ISS-00245` COUNT_DISCREPANCY: M00 sample vs register.

## 4. Newly discovered protected alias: `SCR_PLATFORM_HOME`

- **How it was found:** the pre-pass found it through the **name-conflict** rule ("JET Platform Home" in M00 vs "Platform Foundation (M00)" in `screens.ts`). It was not found through route sharing, and it is not hard-coded.
- **Not merged:** the M00 row stays CAND-000001 and the `screens.ts` entry stays CAND-000161. Matching classed the pair as CONFLICT (SIG-01 = true).
- **Traceable records:** `SRC-01:row0`, `SRC-08:SCR_PLATFORM_HOME`, nav `SRC-10:nav46` (`/app/jet/platform`), and Figma `current:route:/app/jet/platform`.
- **Handling:** it goes through the same human-decision path as the other shared aliases (SHARED_ALIAS Blocking + SEM-06 metadata review). No boundary is assumed.
- **Permanent identity:** no GSID and no permanent identity were created.

The same review turned up two related findings:
- `SCR_AGENCY_SETUP` and `UX-009` are PROTECTED only by the fixed always-protected list, because their `screens.ts` records have no route. Their second routes and states exist only as nav/Figma *evidence*, so the pre-pass could not detect the sharing independently (§8-F1).
- The route files `/app/agency` and `/app/agency/entities` are separate ORPHAN_ROUTE candidates, so each side stays traceable.

## 5. Candidate integrity

- **Total:** 285 candidates, `CAND-000001`–`CAND-000285`. They are temporary, apply to this run only, and carry no governance meaning.
- **Membership sizes:**
  - 217 singletons;
  - 4 with two members (M04/M05 + `screens.ts`);
  - 64 with three members (register + `screens.ts` + route file).

| Source combination | Candidates | Formation reason |
|---|---:|---|
| SRC-11 only | 87 | Orphan route |
| SRC-08 only | 53 | No matching ID or route |
| SRC-02 + 08 + 11 | 35 | Same ID + same route, no conflict |
| SRC-04 only | 35 | M06 routes don't match any live route file (§8-F3) |
| SRC-01 only | 34 | M00 has no route |
| SRC-03 + 08 + 11 | 29 | Same ID + same route |
| SRC-09 only | 10 | M08 routes don't match any live route file (§8-F3) |
| SRC-02 + 08 / SRC-03 + 08 | 1 / 1 | Same ID; the register route isn't live |

- **Multiple routes:** 0 candidates. **Multiple IDs:** 0.
- **Protected aliases:** `SCR_AGENCY_SETUP`, `UX-009`, `SCR_PLATFORM_HOME`.
- **Matches:** 1 (CONFLICT, CAND-000001 ↔ 000161). There were no STRONG or POSSIBLE matches, which indicates under-matching, not a clean population (§8-F2).

## 6. No architecture changes

Steps 1–2 did not change or reinterpret any of the following:
- GSID rules
- candidate rules
- the alias model
- the Screen Version model
- the Impact Matrix and Impact Ledger
- SIG-01–SIG-10
- SEM-01–SEM-07
- the Relationship model
- the Phase 0/Phase 1 boundary

`gov_stage` holds no rows. No registry, ledger or event records exist. There were no edits to `src/**`, registers, Figma tokens or existing tables.

## 7. Plan conformance

- **Conforms:**
  - the fixed pre-pass order;
  - PROTECTED aliases are never merged;
  - route alone never merges records when names conflict;
  - the stop rule;
  - evidence-only sources never create candidates;
  - deterministic output (a byte-identical rerun was verified);
  - numbering valid only within a run.
- **Does not yet conform:** SIG-03 and SIG-06–SIG-10 are not computed (SIG-03 is hard-set to false), and the SRC-05/06/07/13 extraction is missing. Details are in §8.

## 8. Proposed extractor corrections before Step 3 (for approval)

Corrections are to the read-only files in `tools/governance/` only. No existing application artifact changes.

| # | Gap | Correction |
|---|---|---|
| F1 | `screens.ts` has no route field, so all 119 records get MISSING_ROUTE, and shared routes for `SCR_AGENCY_SETUP`/`UX-009` are invisible to the pre-pass | Extract the route → screen-ID annotation from route files and nav-config as screen-defining *route evidence*. Include it in the pre-pass (not in union) so shared-alias detection works from data. Downgrade `screens.ts` MISSING_ROUTE to Info when a route is known from evidence. |
| F2 | Matching only indexes exact tokens, so there are no STRONG/POSSIBLE matches | Compare candidate pairs within a module and across registries using SIG-04 fuzzy name similarity, and implement SIG-06–SIG-09 from the extracted fields. Raise POSSIBLE_DUPLICATE issues. |
| F3 | All 35 M06 and 10 M08 register routes don't match live route files, and this isn't flagged | New issue class under ROUTE_DISCREPANCY, "register route not live", linked to SEM-03 (M06) and SEM-07 (M08). It stays evidence; nothing is auto-linked. |
| F4 | Layout-only and design-reference route files are counted as screens | Reuse the Phase 59 classification (6 layout-only, 2 design-reference) as evidence. Those files become proposed NOT_A_SCREEN issues, still requiring a decision. |
| F5 | Nav entries without a `scrId` are skipped | Extract every nav entry. |
| F6 | SRC-05/06/07/13 are not extracted | Add them as evidence-only (approval status, requirement edges, `CONF-M06-002`, B9 IDs). Compute SIG-03/SIG-10 from Figma keys and signatures. |
| F7 | The M00 sample count is wrong (6) | Count screen entries structurally. Recompute COUNT_DISCREPANCY. |
| F8 | ORPHAN_ROUTE has no SEM link | Link it to SEM-07. |
| F9 | The disposition list isn't explicit in the output | Add a per-record `disposition` field: ATTACHED, EVIDENCE_LINKED, EVIDENCE_UNLINKED, or ORPHAN_CANDIDATE. |

After the corrections, re-run twice, confirm determinism, and return an updated validation summary. Step 3 still waits for your separate approval.
