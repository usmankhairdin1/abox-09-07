# Phase 0 Reconciliation Plan (for approval)

**Baseline:** Architecture Rev. 3, approved and unchanged. This plan only sets out how Phase 0 will run.

**Goal:** prove the current population of logical screens, using evidence and human decisions, before any permanent GSID exists.

Every activity below carries one tag:
- **R**: Read
- **E**: Extract
- **N**: Normalize
- **M**: Match
- **F**: Flag
- **H**: Human Decision
- **P**: Persist Staging Evidence

No activity modifies the existing application.

---

## 1. Non-touch boundaries (absolute)

Phase 0 must not modify any existing governed screen, route, navigation configuration, registry, Figma artifact, packet, or existing application behavior. In particular it writes **nothing** to:
- any existing file under `src/**`; existing pages, components, routes and libraries stay byte-identical
- `public/registers/*`
- `src/lib/governed/*`
- `screens.ts`, `m08/registry.ts`, `nav-config.ts`
- existing route files
- `tools/figma-plugin/**` (including token files and manifests)
- Figma B0–B10 and page 07
- packet JSON
- change logs
- the existing `m00.*` / `public.*` tables and functions

**Allowed exception — isolated Phase 0 infrastructure.** Phase 0 may add only *new* governance infrastructure:
- the `gov_stage` staging schema (§8);
- new, self-contained files for the read-only extractor and matcher;
- a new, isolated **Phase 0 Reconciliation Workspace** (§15).

This infrastructure is separate from the governed application screens:
- It is not a governed screen and is not part of the screen population. It is excluded from its own extraction.
- It does not change the existing screen population or navigation semantics.
- Removing it restores the application exactly.

Phase 0 also does not:
- issue GSIDs;
- create registry, alias-binding or ledger records;
- create permissions or roles;
- emit `m00_emit` events (candidate history stays in staging, per Rev. 3 §17);
- settle ownership or screen boundaries without a human decision.

All Phase 0 output lives in this isolated infrastructure. Removing it returns the project exactly to its pre-Phase 0 state.

## 2. Sources inspected (R)

| # | Source | Scope | Observed size |
|---|---|---|---|
| SRC-01 | `public/registers/m00.json` → Screen_Register | M00 | 34 rows; **no route column** |
| SRC-02 | `public/registers/m04.json` → Screen_Register | M04 | 36 |
| SRC-03 | `public/registers/m05.json` → Screen_Register | M05 | 30 |
| SRC-04 | `public/registers/m06.json` → Screen_Register | M06 | 35 |
| SRC-05 | `src/lib/governed/m0x.index.ts` + `types.ts` | Packet document control / approval status | per module |
| SRC-06 | Register support tables: Traceability, Requirement, Role_Permission_Matrix, User_Flow, Capability, and Prior/M0x Impact and Proposed Delta registers | Cross-reference evidence only | per module |
| SRC-07 | M06 change log entries (e.g. `CONF-M06-002`) | Discrepancy evidence | — |
| SRC-08 | `src/lib/screens.ts` | UX-### / SCR_* runtime metadata | ~120 entries |
| SRC-09 | `src/lib/m08/registry.ts` | SCR-M08-### | 10 |
| SRC-10 | `src/lib/nav-config.ts` | Navigation targets + screen-ID links | — |
| SRC-11 | `src/routes/**` (file tree only, parsed statically) | Live route inventory | 154 files |
| SRC-12 | `tools/figma-plugin/tokens-current-app.js` | Phase 59 screens, keys, signatures | 179 screens |
| SRC-13 | `tools/figma-plugin/tokens-b8.js`, `tokens-b9.js` | Governed experience / screen frames + reactions | B8 5, B9 179 |
| SRC-14 | `src/lib/m00-foundation.ts` | Sample data | 52 (evidence only) |

Every source is snapshotted by path, git commit and SHA-256 at extraction time. A reconciliation run is tied to exactly one snapshot set.

## 3. Extraction contract (E)

Each extracted item becomes one **SourceRecord**:

```text
source_id, source_path, source_hash, run_id, record_locator (sheet/row index | export name | line | file path),
raw_id, raw_name, raw_route, raw_module, raw_workspace/audience, raw_purpose,
raw_roles[], raw_permission, raw_primary_actions[], raw_sections/regions[],
raw_requirement_ids[], raw_capability_id, raw_status, raw_ownership/owning_module,
figma_key, figma_node_id, figma_signatures{source,structure,binding}, prototype_refs[],
raw_payload (verbatim JSON of the row/entry)
```

Fields taken from each source:

| Source | Fields |
|---|---|
| SRC-01 | screen_id, screen_record_id, name, workspace, ownership, purpose, roles, primary_actions, requirement_ids, required_states, status, capability_id |
| SRC-02 | screen_id, name, workspace_id, route, roles, purpose, sections, primary_actions, required_states, status, capability_id |
| SRC-03 | screen_id, name, workspace, route, ownership, purpose, roles, primary_actions, sections, status, capability_id |
| SRC-04 | screen_id, name, audience, route, owning_module, purpose, permission, primary_actions, required_regions, capability_id, status |
| SRC-05 | module, packet id, version, approval status, hash |
| SRC-06 | Rows referencing a screen ID, requirement ID or capability ID, kept as evidence edges |
| SRC-07 | Entry ID, claim text, affected screen IDs |
| SRC-08 | id, name, route/path, module/section, and every other declared property |
| SRC-09 | id, name, route, purpose, and every other declared property |
| SRC-10 | label, `to`/href, screenId references, group |
| SRC-11 | File path → derived route pattern; flags for layout-only, design-reference and dynamic segments |
| SRC-12 | stable key, route, state, group, B8/B9 cross-reference, source/structure/binding signatures |
| SRC-13 | B9 screen ID, frame key, reactions (target keys only) |
| SRC-14 | Screen count and names only |

Extraction is read-only and deterministic: the same snapshot always gives byte-identical output. It relies on static parsing only and never runs application code.

## 4. Normalization rules (N)

- **IDs:**
  - Trim, uppercase, and turn `_`↔`-` variants into a *comparison key*. The raw value is always kept.
  - Classify alias_kind by pattern (Rev. 3 §7):
    - `^UX-\d{3}$` → UX
    - `^SCR_[A-Z_]+$` → SCR_LEGACY
    - `^SCR-M0[0-7]-\d{3}$` → SCR_MODULE
    - `^SCR-M08-\d{3}$` → M08
    - `current:route:` → FIGMA_KEY
    - Figma node → FIGMA_NODE
    - otherwise UNKNOWN_ID (flagged).
- **Routes:**
  - Lowercase; strip the trailing slash, query and hash (the hash is kept separately as a `state` qualifier, e.g. `/plans#filters` → route `/plans` + state `filters`).
  - Normalize dynamic segments `$id`, `:id` and `{id}` → `:param`.
  - Collapse TanStack layout segments (`_authenticated`, `_app`) and `index`.
  - Keep raw_route alongside the normalized route.
- **Names:** Unicode NFKC normalization, lowercase, punctuation collapsed, stop-words removed (screen, page, view). Keep the original name.
- **Module:** derived from the ID prefix, the source file, or the `owning_module`/`ownership` field. Disagreements between these are kept, not resolved.
- **Lists:** roles, permissions, requirements and actions are split, trimmed, de-duplicated and sorted.
- **Empty values:** empty string and "TBD" → null, flagged as MISSING_*.
- **Figma:** signatures are copied exactly as they are and never interpreted.

## 5. Candidate formation rules (F, M, P)

Candidates are clusters of SourceRecords that *may* be one logical screen. They are never authoritative.

**Principle: a route is evidence of identity, not identity by itself.**

**Fixed processing order.** No candidate is ever merged first and classified as shared afterwards.

```text
1. Extract and normalize all SourceRecords                         (E, N)
2. Conflict pre-pass: detect shared IDs, shared routes,
   conflicting alias ownership, conflicting screen-defining metadata (F)
3. Mark affected aliases/routes PROTECTED from automatic union     (F)
4. Deterministic candidate union (rules below)                     (M)
5. PROTECTED aliases stay unresolved until a human decision (§10)  (H)
```

`SCR_AGENCY_SETUP` and `UX-009` are always PROTECTED by the pre-pass, whatever the scan detects.

Rules:
1. **Seed:** each SourceRecord from a *screen-defining* source (SRC-01…04, 08, 09, 11) starts as a singleton.
2. **Deterministic union** happens only when one of these is true:
   - (a) **Hard identity evidence:** the same normalized, non-PROTECTED ID appears in two sources.
   - (b) **Route evidence:** the same normalized route and state, **and all** of the following:
     - no conflicting identity evidence (no different IDs of the same kind);
     - no conflicting alias ownership;
     - no conflicting screen-defining metadata (name, module, purpose);
     - neither the route nor any involved alias is PROTECTED or shared.

   If any of these conditions fails, the records are not merged; a review issue is raised instead (BOUNDARY_DECISION or POSSIBLE_DUPLICATE).
3. **Evidence-only attachment:** these attach to the cluster(s) they reference but **never create or merge clusters**:
   - SRC-10 nav links, SRC-12/13 Figma records, SRC-06 references and SRC-14 samples.
4. **Stop rule:** a union that would put two different IDs **of the same alias_kind** into one cluster (e.g. two SCR-M06 IDs) is refused, and a POSSIBLE_DUPLICATE or BOUNDARY_DECISION issue is raised.
5. **Shared aliases:** an alias marked PROTECTED in step 3 never merges records. Each side stays a separate candidate linked to the unresolved shared alias.
6. **Numbering:** `CAND-######`, issued in a fixed order (source order, then record locator), so reruns on the same snapshot reproduce the same numbers. Candidate IDs are valid only within a run (Rev. 3 §6).

## 6. Matching logic (M)

**Naming used in this plan:**
- `SIG-01`–`SIG-10` are the Rev. 3 §14 detection signals (S1–S10 in Rev. 3), renamed only for clarity.
- `SEM-01`–`SEM-07` are the Phase 0 semantic reconciliation decisions (§11).

The architecture itself is unchanged.

Signals are computed for every candidate pair that shares any signal:

| Signal | Computation |
|---|---|
| SIG-01 | Equal normalized ID |
| SIG-02 | Equal normalized route (+ state) |
| SIG-03 | Equal Figma key or node |
| SIG-04 | Name similarity: token Jaccard ≥ 0.8 **or** normalized Levenshtein ≤ 0.15 (initial threshold, I3) |
| SIG-05 | Equal module |
| SIG-06 | Requirement-ID overlap ≥ 1 |
| SIG-07 | Purpose token Jaccard ≥ 0.6 |
| SIG-08 | Primary-action overlap ≥ 50% |
| SIG-09 | Shared components (from the Phase 59 mapping) ≥ 50% |
| SIG-10 | Equal structure signature |

Classification follows the Rev. 3 §14 table without change: EXACT / STRONG / POSSIBLE / NONE / CONFLICT. **Every result stores its signal vector and the evidence records behind it.** Nothing is accepted automatically in Phase 0, and every non-singleton result needs a human decision.

## 7. Issue detection (F)

| Issue | Rule |
|---|---|
| SHARED_ALIAS | One ID links to 2+ distinct normalized routes or states (known: `SCR_AGENCY_SETUP`, `UX-009`) |
| BOUNDARY_DECISION | Cluster holds multiple routes/states or a refused union (§5.4) |
| POSSIBLE_DUPLICATE | STRONG/POSSIBLE match between candidates in different clusters |
| ROUTE_CONFLICT | One normalized route claimed by 2+ candidates with different IDs of the same kind |
| ORPHAN_ROUTE | Route in SRC-11 with no screen-defining record |
| MISSING_ROUTE | Screen record with no route (all 34 M00 rows; any others) |
| ROUTE_DISCREPANCY | Same ID, different routes across sources; or a change-log claim that contradicts the register (`CONF-M06-002` vs `m06.json`) |
| COUNT_DISCREPANCY | Per-source count mismatch (M00: 52 samples vs 34 register rows; 179 Figma screens vs candidate total) |
| MISSING_OWNER / MISSING_PURPOSE | Null after normalization |
| CONFLICTING_METADATA | Same ID with different name, module or roles across sources |
| FIGMA_MISMATCH | Figma screen with no candidate; a candidate whose route has no Figma screen; different signatures on one key |
| UNKNOWN_ID | ID matches no alias pattern |

Each issue records: issue_id, type, severity (Blocking / Review / Info), the affected candidates and records, the evidence, and the SEM decision it relates to (if any). Blocking issues must be decided before exit.

## 8. Staging model (P)

This is Phase 0 staging only. It is **not** the Phase 1 registry.

- **Storage (I4 default):** a separate `gov_stage` database schema, not exposed through the app's data interface.
- **Access:** only the platform admin can read or write it.
- **Removal:** it has no foreign keys into existing tables, so it can be dropped at any time.

Tables:
- `recon_run`: run_id, snapshot manifest (paths, hashes, commit), status, started/finished, operator.
- `source_record`: §3 contract.
- `alias_observation`: alias_value, alias_kind, source_record_id.
- `candidate`, `candidate_member`: candidate ↔ source_record, with the reason for membership.
- `match_result`: pair, signal vector, class, evidence.
- `issue`: §7.
- `decision`: §10.
- `approved_set`, `approved_set_item`: §13.

Rules:
- Staging rows are **append-only per run**.
- A rerun creates a new run_id. Decisions from an earlier run can be carried forward only through explicit confirmation (§10).
- This schema is the only database change in Phase 0, and it gets its own migration once this plan is approved.

## 9. Registry-by-registry reconciliation (M, F, H)

| Registry | Handling |
|---|---|
| M00 (SRC-01) | No routes. Candidates formed on ID only; every row gets MISSING_ROUTE. SRC-08/10/11 routes are proposed as evidence (SIG-04/SIG-06) and never attached automatically. SRC-14 is used only for COUNT_DISCREPANCY. |
| M04 / M05 | Route + ID seeds; check against SRC-08/11; ROUTE_DISCREPANCY where they differ. |
| M06 | `m06.json` routes are used as observed. `CONF-M06-002` is recorded as a contradicting claim → ROUTE_DISCREPANCY (SEM-03). |
| M08 (SRC-09) | Seeds by SCR-M08 ID + route; check against SRC-11/12. |
| `screens.ts` | UX/SCR_* seeds; cross-kind matches to SCR_MODULE/M08 are raised as POSSIBLE_DUPLICATE or STRONG (SEM-05). |
| Governed indexes | Approval-status evidence per module; the status is copied into candidate evidence. |
| Impact/delta registers | Module-level evidence only (they contain no screen IDs); never used to form candidates. |

## 10. Human reconciliation decisions (H, P)

Decision types (Rev. 3 §7):
- ONE_SCREEN_MULTI_ROUTE
- MULTIPLE_SCREENS_SHARED_LEGACY_ID
- ONE_SCREEN_VARIANTS
- DUPLICATE_CONFLICT (merge candidates)
- DISTINCT_SCREENS
- NOT_A_SCREEN (layout, design reference or visual state only)
- ASSIGN_ALIAS_OWNER
- ASSIGN_ROUTE_OWNER
- ASSIGN_OWNER_MODULE
- ACCEPT_DISCREPANCY_WITH_REASON
- DEFER_WITH_REASON

Each decision record holds: decision_id, run_id, issue_ids[], candidate_ids[], type, outcome payload, rationale (required), evidence refs, proposed_by, proposed_at, approved_by, approved_at, state.

**Decision states:**

```text
PROPOSED → APPROVED | REJECTED | WITHDRAWN
APPROVED → SUPERSEDED (only by a later approved decision)
```

- **Separation of duties:** the approver must be a different person from the proposer (Rev. 3 §27).
- **No overwriting:** decisions are never edited, and every state change is stored as a new row.
- **Carry-forward:** on a rerun, an earlier decision applies only if the hashes of its evidence records are unchanged, and it still needs a confirming click. Otherwise it is re-opened.

## 11. SEM-01–SEM-07 handling

| SEM | Captured as | Required evidence shown |
|---|---|---|
| SEM-01 `SCR_AGENCY_SETUP` | PROTECTED + SHARED_ALIAS + BOUNDARY_DECISION → boundary decision + alias owner | nav-config lines, both route files, Figma keys, register rows |
| SEM-02 `UX-009` | PROTECTED + SHARED_ALIAS + BOUNDARY_DECISION (states `filters`, `edit-quote`) | screens.ts entry, Figma state frames, route |
| SEM-03 M06 routes | ROUTE_DISCREPANCY → ACCEPT_DISCREPANCY_WITH_REASON (which source is observed truth) | change-log text vs 35 JSON routes vs live routes |
| SEM-04 M00 | 34× MISSING_ROUTE + COUNT_DISCREPANCY → a route assignment or DEFER per screen, plus one decision explaining 52 vs 34 | proposed matches with signal scores |
| SEM-05 Cross-registry | POSSIBLE_DUPLICATE/STRONG → DUPLICATE_CONFLICT or DISTINCT_SCREENS | side-by-side record comparison |
| SEM-06 Ownership | MISSING_OWNER / CONFLICTING_METADATA → ASSIGN_OWNER_MODULE | module signals |
| SEM-07 New findings | Any issue not listed above, including new PROTECTED aliases found by the pre-pass | as generated |

The plan decides none of these. They are made only in the workflow above.

## 12. Figma evidence (R, E, M, F)

- Figma records are **evidence**. They never seed a candidate and never supply an identity (Rev. 3 §25).
- They contribute:
  - the SIG-03 and SIG-10 signals;
  - FIGMA_KEY and FIGMA_NODE alias observations;
  - FIGMA_MISMATCH issues;
  - the fingerprint that is passed to Phase 1.
- The Phase 59 formula for its 179 screens is reconciled line by line against the candidates, as a cross-check of the population.
- **Fingerprints passed to Phase 1** are evidence attached to the reconciled logical screen and its version/evidence set. They must never:
  - create a GSID;
  - redefine logical screen identity;
  - silently change a governed definition;
  - override a human reconciliation decision.
- Figma is read from token files only. Figma Desktop is not opened and no plugin is run.

## 13. Proving the logical screen population

This is the central deliverable. It is a **Population Proof** report, balanced two ways:

```text
Per source:  records_in = attached_to_candidate + evidence_only + NOT_A_SCREEN + deferred   (must balance to 0 remainder)
Per candidate: every candidate ends in exactly one terminal state:
   APPROVED_SCREEN | MERGED_INTO | VARIANT_OF | NOT_A_SCREEN | DEFERRED(reason)
Population  = count(APPROVED_SCREEN)
Cross-check = reconcile Population vs 179 Figma screens, 154 route files, and each registry count,
              with every difference explained by a decision or issue ID.
```

The proof must also show that:
- every source record is accounted for;
- every candidate reaches a terminal state;
- every shared or duplicate ID (including every PROTECTED alias) is explained by a decision;
- every route conflict is explained by a decision;
- every M00/M04/M05/M06/M08 discrepancy is resolved or explicitly deferred with a reason;
- every Figma difference is explained.

**Approved Reconciliation Set:** the frozen, hashed list of APPROVED_SCREEN candidates, independently approved. Each carries:
- its alias set (with PRIMARY/SECONDARY/VARIANT roles as decided);
- its routes and owner module;
- its Figma fingerprint;
- links to the source records;
- the decision IDs behind it.

Approving the set needs two people (proposer ≠ approver). This set is the only input to Phase 1, where GSIDs are issued.

## 14. Reports (R from staging, P)

1. **Source Inventory report:** per-source counts, hashes, and extraction warnings.
2. **Alias Inventory:** every alias with its kind and all of its occurrences.
3. **Candidate report:** members, signals, class and state.
4. **Match report:** pairs by class, with evidence.
5. **Exception report:** open issues by type and severity; blocking issues first.
6. **Route Conflict report:** routes against claiming candidates; orphan routes.
7. **Shared/Duplicate ID report.**
8. **Decision log:** every decision with its states and actors.
9. **Population Proof** (§13).
10. **Figma cross-check.**

Each report can be exported as CSV/JSON and is stamped with the run_id and snapshot hash.

## 15. Phase 0 workflow and UI

- A new, isolated **Phase 0 Reconciliation Workspace**:
  - It is new governance infrastructure (§1), not a governed application screen.
  - It is platform-admin gated and reads from staging only.
  - Contents:
    - Run view: snapshot and counts.
    - Issue queue, filterable by type, severity and SEM decision.
    - Candidate detail: source records side by side, signals, and Figma/route evidence.
    - Decision form: type, outcome, rationale, evidence.
    - Approval queue.
    - Reports and exports.
    - Approved-set review and sign-off.
- A read-only **extraction/matching runner** that reads source files and writes only to staging. It can be re-run at any time.
- No existing page, route, navigation configuration or behavior changes:
  - The workspace is reached only through its own new, isolated entry point.
  - It is excluded from the screen population and from extraction.

## 16. Exit criteria

1. Snapshot hashes are recorded, and a re-run on the same snapshot gives identical candidates and matches.
2. Every source balances to zero remainder (§13).
3. Zero open Blocking issues. Every Review issue is decided or deferred with a reason.
4. SEM-01–SEM-07 are each decided or explicitly deferred (a deferral excludes the affected screens from the set).
5. Every PROTECTED alias has a human decision or an explicit deferral.
6. Every candidate is in a terminal state.
7. Every Population Proof cross-check difference is explained.
8. The Approved Reconciliation Set is frozen, hashed and approved by two people.
9. A non-touch verification passes:
   - the git diff shows no change to any existing file on the §1 list;
   - only new Phase 0 infrastructure files were added;
   - the existing tables are unchanged.

## 17. Artifacts handed to Phase 1

- Approved Reconciliation Set (frozen JSON + hash).
- The alias set per approved screen, with its roles and the decision that set them.
- Explicit UNRESOLVED_SHARED aliases that remain.
- Route ownership map; owner-module map.
- Figma fingerprints per screen, as evidence only (§12).
- Relationship proposals made in decisions (VARIANT_OF, REPLACES).
- Deferred-item list with reasons.
- Full report pack and decision log.
- Snapshot manifest.

**No GSIDs, registry rows or events exist at handoff.**

## Technical details

- **Build steps after this plan is approved** (each a separate, reviewable step; none starts before approval):
  1. A migration that creates only the `gov_stage` schema and tables, with grants for the service role and platform admin only, and RLS enabled.
  2. A read-only extractor/matcher in new files, with unit tests for normalization, pre-pass protection, the union and stop rules, the `SCR_AGENCY_SETUP`/`UX-009` protection, and determinism.
  3. The isolated Phase 0 Reconciliation Workspace (new files only; no edits to existing files).
  4. Report exports.
- **Initial thresholds (I3):** SIG-04 0.8 / 0.15 and SIG-07 0.6. They can be changed only through a recorded decision that gives a reason.
- **Rollback:** drop `gov_stage` and remove the isolated workspace files. No existing data or files are affected.
