# Screen Governance and Screen-Level Traceability — Final Architecture Specification

This document is design only. Approving it approves the architecture; it does not start any work. It creates or changes no code, tables, migrations, UI, IDs, registers or Figma. Phase 0 will get its own plan for approval.

---

## 1. Executive Summary

ABox gets an additive governance layer made of seven parts:

- **Canonical Screen Registry** — one row per logical screen.
- **Governance Screen ID (GSID)** — a permanent internal ID for each screen.
- **Alias model** — every existing ID keeps working, and aliases that several screens currently share can stay in an unresolved state until a person decides.
- **Screen Versions** — each approved change adds a version to the same screen.
- **Screen Impact Matrix** — what a packet proposes to change right now.
- **Screen Impact Ledger** — the permanent history of what happened.
- **Impact Scope** — which aspects of a screen an impact touches.

Existing sources keep running unchanged during the transition. At the end, the registry becomes the single source of truth for screen identity, governance and lineage. Events go through the existing `m00_emit` → `m00.audit_event` / `m00.outbox_event` path. Figma is evidence only, never identity. Enforcement tightens gradually: Report → Warn → Review → Block.

## 2. Architecture Refinements From the Previous Design

| # | Change |
|---|---|
| 1 | The alias model now has an explicit **UNRESOLVED_SHARED** state: one alias, several candidate screens, visible until a person resolves it. |
| 2 | SCR_AGENCY_SETUP and UX-009 are **no longer pre-decided**. They become Phase 0 reconciliation decisions. |
| 3 | **ID Reservation, Identity Lock and Definition editability** are separated into different mechanisms. |
| 4 | **Transitional and target sources of truth** are defined separately. |
| 5 | A new **Screen Impact Matrix** (a working proposal) sits apart from the Ledger (history). |
| 6 | A new **Impact Scope** model, where several scopes can apply at once. |
| 7 | **Explicit detection rules** per class: evidence, confidence, what happens automatically, whether it can create a screen or a version. |
| 8 | **Explicit version-creation rules** by scope. |
| 9 | **Out-of-band change** gets five defined outcomes. |
| 10 | The **lifecycle is split** into four independent state dimensions; "MODIFIED" is removed as a state. |
| 11 | Ledger fields are final, with explicit rules for immutability, compensation, rejection, withdrawal and revert. |
| 12 | Event model detailed to implementation level. The one possible schema change to the event infrastructure is flagged as a decision. |
| 13 | Phase 0 is fully specified as a read-only staging step with a defined output. |

## 3. Current-State Constraints (verified)

- **Four ID spaces:**
  - `src/lib/screens.ts` — UX-### and SCR_*.
  - `src/lib/governed/*.index.ts` plus `public/registers/m0x.json` → Screen_Register:
    - M04: 36 screens; M05: 30; M06: 35 — all in the SCR-M0x-### format.
    - M00: 34 screens in SCR_* format, with no routes.
  - `src/lib/m08/registry.ts` — SCR-M08-###.
  - Figma tokens — keys such as `current:route:/plans`, plus signatures.
- **Shared aliases:**
  - `SCR_AGENCY_SETUP` is used by `/app/agency` and `/app/agency/entities` (`nav-config.ts:120,166`).
  - `UX-009` is used by `/plans` and by the Figma states `plans#filters` and `plans#edit-quote`.
- **Data discrepancies:**
  - M00 has 52 screens in `m00-foundation.ts` but 34 in its register.
  - The M06 change log `CONF-M06-002` says routes are empty, but `m06.json` has routes for all 35 screens.
- **Delta/impact registers** carry `originating_packet` and `impacted_module` but no screen IDs.
- **Existing infrastructure to reuse:**
  - `public.m00_emit(event_name, aggregate_type, aggregate_id, tenant_id, payload, audit_code, actor, correlation)`.
  - `m00.audit_event`: event_code, actor, correlation_id, payload_hash, metadata.
  - `m00.outbox_event`: aggregate_type, aggregate_id, correlation_id, payload — **no causation column**.
  - `m00.role_template`, `permission_definition`, `role_assignment`; `m00.is_platform_admin()`; role code `JET_PLATFORM_ADMIN`.
- **Protected:** Figma B0–B10, the 682 prototype links, Phase 59 import idempotency, and all existing routes.

## 4. Final Design Principles

1. **Additive.** Nothing existing is rewritten to make governance cleaner.
2. **Identity is permanent; definition evolves.** A lock applies to identity, never to content.
3. **Append-only history.** Corrections are new records pointing back to the original.
4. **No silent semantic decisions.** Screen boundaries, merges, splits and alias moves require a person.
5. **Evidence is not identity.** Routes, names and signatures are only matching signals.
6. **One audit bus.** Reuse `m00_emit`.
7. **One owner per fact.** No governance data is kept in two places for good.
8. **Enforcement tightens gradually:** Report → Warn → Review → Block.

## 5. Final Target Architecture (A)

```text
 Existing sources (read-only inputs)            Build Packet
 screens.ts | governed/* | registers/*.json          |
 m08/registry | Figma tokens | nav-config            v
        |                                      [Intake] -> Packet Run
        v                                            |
 [Phase 0 Staging + Reconciliation Queue]            v
        | (human decisions)                   [Detection Engine]
        v                                            |
 +----------------- Canonical Screen Registry -------+-----+
 | Screen (GSID) -- Alias -- Version -- Fingerprint        |
 +--------^-------------------------^----------------------+
          |                         |
   [Commit on approval]     [Screen Impact Matrix]  <- review UI
          |                         |
          +------> [Screen Impact Ledger] (append-only)
          |
          +------> m00_emit -> m00.audit_event + m00.outbox_event
          |
 [Traceability Views]  Packet->Screens | Screen->Packets
 [Drift Scanner] Figma/code/route -> OUT_OF_BAND_CHANGE
 [governance-report analyzers] -> Report / Warn / Block
```

## 6. Canonical Screen Registry (B)

| Group | Fields | Owned by the registry |
|---|---|---|
| Identity | gsid, created_at, created_by, created_by_packet_run, identity_state | Yes |
| Display | primary_display_alias_id, name, slug | Yes |
| Ownership | owning_module, owner_role, steward_user | Yes |
| Governance | governance_state, id_locked, locked_at, locked_by | Yes |
| Conflict | conflict_state, open_conflict_ids[] | Yes (derived from the conflict queue) |
| Version pointer | current_version_no | Yes |
| Lineage | superseded_by[], split_from, merged_into | Yes |
| Audit summary (derived) | last_impact_id, last_modified_at/by/packet | Yes (computed from the Ledger) |

Definition content (routes, purpose, roles, permissions, actions, requirements) lives on the **Version**, not on the Screen row.

### Source of truth

| Concern | Transitional (Phases 0–5) | Target (after Phase 6) |
|---|---|---|
| Screen identity, GSID, aliases | Registry (new) | **Registry** |
| Governance state, lock, lifecycle | Registry | **Registry** |
| Ownership | Registry (seeded from the packet `owning_module`) | **Registry** |
| Packet lineage, impact history | Registry (Ledger) | **Registry** |
| Current governed version | Registry | **Registry** |
| Route implementation (the files under `src/routes`) | Code | **Code** (the registry records the expected route; a mismatch counts as drift) |
| Display strings used by pages (`SCREENS` in `screens.ts`) | `screens.ts` | Generated from the registry, or checked against it (decision D5) |
| Packet specification content (Screen_Register rows) | Packet JSON | **Packet JSON** stays the historical record of what each packet said; the registry records what was *approved* |
| Figma nodes, signatures, prototype links | Figma tokens | **Figma tokens** (the registry stores the fingerprint snapshot per version as evidence) |
| M08 screen metadata | `m08/registry.ts` | Checked against the registry, or generated from it (D5) |

Rule: the registry never *copies* a governance fact that another system also maintains. Where a copy is unavoidable during transition, the registry holds it, and the source is checked against it by the governance report.

## 7. GSID and Alias Governance (C)

**GSID:** `GS-######`, issued in sequence, never reused, and never shown in place of the familiar ID unless no alias exists.

**Alias entity:**
- alias_id, alias_value, alias_kind (UX | SCR_LEGACY | SCR_MODULE | M08 | FIGMA_KEY | FIGMA_NODE | ROUTE), source_system, source_ref.
- binding_state (BOUND | UNRESOLVED_SHARED | ENDED).
- valid_from, valid_to.
- Each alias links to its screen through an **AliasBinding** record: binding_id, alias_id, gsid (nullable while unresolved), candidate_gsids[], role (PRIMARY | SECONDARY | VARIANT), valid_from, valid_to, decided_by, decision_ref.

```text
Normal:        alias --BOUND--> GS-000123
Unresolved:    alias --UNRESOLVED_SHARED--> {candidate GS-000123, candidate GS-000124}
Re-mapped:     alias --ENDED (valid_to=t)--> GS-000123
               alias --BOUND (valid_from=t)--> GS-000124   (human-approved)
```

**Rules:**
- **Immutable fields:** once created, the alias *value* and *kind* never change. Bindings are never edited, only ended and replaced.
- **Validity periods:** yes, on every binding. Historical lookups use the binding that was valid at the event's time.
- **Moving an alias:** allowed only through an approved reconciliation or merge/split decision. It is recorded as ALIAS_REBOUND in the Ledger and emitted as an event.
- **Past references:** ledger rows and events keep the alias value *and* the gsid that was valid at the time, so old records stay correct after a move.
- **Uniqueness:** at most one BOUND PRIMARY or SECONDARY binding per alias at any moment. VARIANT bindings can share a GSID. UNRESOLVED_SHARED blocks governance actions on its candidate screens until resolved.

**How the logical boundary is decided** (Phase 0 and review — always a human decision). A reviewer picks one of:

| Outcome | Meaning | Result |
|---|---|---|
| ONE_SCREEN_MULTI_ROUTE | Same screen reachable by several routes | 1 GSID; one ROUTE alias per route; version routes[] lists all |
| MULTIPLE_SCREENS_SHARED_LEGACY_ID | Distinct screens that shared a legacy ID | N GSIDs; the shared alias stays PRIMARY on one and becomes SECONDARY on the others |
| ONE_SCREEN_VARIANTS | UI states of one screen (e.g. filters, edit) | 1 GSID; variant aliases with role VARIANT |
| DUPLICATE_CONFLICT | The same screen registered twice | Merge (§14) with lineage |

The system shows evidence (routes, nav entries, Figma frames, purposes) but never proposes an outcome as a default.

## 8. Screen Version Model (D)

`ScreenVersion`:
- gsid, version_no, created_by_impact_id, created_at
- definition (json: name, purpose, roles, permissions, primary_actions, states, regions)
- routes[], requirement_ids[], scope_mask (the scopes that changed, relative to the previous version)
- fingerprint_id (nullable), status (CURRENT | SUPERSEDED | REVERTED_FROM)

```text
GS-000123 (alias SCR-M06-014)
  v1  created  M06 BP v1.0   scopes: all
  v2  modified M07 BP v1.0   scopes: Behavior, Data
  v3  modified M09 BP v1.2   scopes: Navigation
```

**Version-creation rules:**

| Change | Creates a version? | Why |
|---|---|---|
| New screen | GSID + v1 | — |
| UI / Layout, Content, Navigation/Route, Workflow | Yes, vN+1 | These change the governed definition |
| Behavior-only, Validation-only | Yes, vN+1 | They change the screen's functional contract (flagged as non-visual) |
| Data-only | Yes if it changes the fields or regions shown; otherwise No (a ledger row with scope Data) | Only changes to the screen's contract create a version |
| Permission-only | Yes if roles or permissions on the definition change | Access is part of the contract |
| Referenced / No UI impact | No | A ledger row only |
| Figma drift without a packet | No; OUT_OF_BAND_CHANGE | Evidence, not a decision |
| Alias added or re-bound | No | Identity metadata only |
| Revert | Yes, a new version restoring the old definition | History is never rewritten |

## 9. Screen Impact Ledger (E)

The Ledger is append-only. Its final fields:
- impact_id, gsid (nullable until registered), proposed_gsid
- alias_value_at_time, packet_id, packet_version, packet_run_id, module
- impact_type, impact_scope[], requirement_refs[]
- detection_class, detection_evidence (json)
- source_artifact (register, row id, file hash)
- previous_version_no, resulting_version_no
- before_ref, after_ref (version pointers), diff (json)
- proposed_by, proposed_at
- approval_state (PROPOSED | APPROVED | REJECTED | WITHDRAWN | REVERTED), approved_by, approved_at, decision_note
- correlation_id (packet run), causation_id (the impact or matrix row that led to this one)
- compensates_impact_id

**Impact types:**
- NEW, MODIFIED, REFERENCED, RETIRED, SUPERSEDED
- SPLIT, MERGED
- ALIAS_ADDED, ALIAS_REBOUND
- OUT_OF_BAND_CHANGE, OUT_OF_BAND_ADOPTED
- REVERTED

**Immutable:** every field of a written row. Only the move from `approval_state` PROPOSED to a final state is allowed, and it is recorded as a decision event, not an in-place edit of evidence.

**Corrected through a compensating record:**
- A wrong classification: a new row with `compensates_impact_id`.
- A mistaken approval: a REVERTED row plus a restoring version.
- A wrong alias binding: ALIAS_REBOUND.

**What happens in each case:**
- **Rejected:** the row stays as REJECTED with a reason. No registry change. A GSID reserved for a NEW proposal is burned, never reused.
- **Packet withdrawn** before approval: every PROPOSED row becomes WITHDRAWN and the matrix is closed. No registry change.
- **Approved change reverted:** a REVERTED row per impact. MODIFIED → a new version equal to the prior definition. NEW → RETIRED, with the GSID kept reserved. Alias changes → the binding is ended and restored.

## 10. Screen Impact Matrix (F)

**Purpose:** the working proposal for one packet run, answering "what does this packet propose right now". The Ledger records what happened; the Matrix is what the review works through.

**Generated** by the Detection Engine at intake: one row per candidate screen (packet Screen_Register rows, screens named in delta `affected_artifacts`, and registered screens that share requirement IDs).

**Row fields:**
- matrix_row_id, packet_run_id, candidate_ref
- matched_gsid, existing_or_new
- proposed_impact_type, impact_scope[], requirement_refs[]
- current_version_no, proposed_version_no
- detection_class, evidence summary, blocking flags
- reviewer_decision (APPROVE | REJECT | RECLASSIFY | LINK | MARK_VARIANT | DEFER), decided_by, note

| Screen | Existing/New | Impact | Scope | Requirement | Current | Proposed | Detection | Evidence | Decision |
|---|---|---|---|---|--:|--:|---|---|---|
| SCR-M06-014 | Existing | MODIFIED | Behavior, Data | REQ-031 | 2 | 3 | EXACT | alias+route | Approve |
| SCR-M06-017 | Existing | REFERENCED | none | REQ-044 | 1 | — | EXACT | alias+route | Auto |
| SCR-M07-001 | New | NEW | all | REQ-050 | — | 1 | NONE | no match | Approve |
| SCR-M06-020 | Existing? | CONFLICT | — | REQ-052 | 4 | — | POSSIBLE | name similarity | Review |

- **Persisted:** yes, per packet run, so review can span several sessions and revisions can be compared.
- **Relationship to ScreenImpact:** a matrix row is a proposal. On packet approval, each decided row writes exactly one Ledger row (causation_id = matrix_row_id).
- **Source of the review UI:** the Matrix *is* the review UI's data.
- **After a decision:** the matrix is frozen (read-only) and linked from the packet run. A revised packet creates a new matrix and shows the differences against the previous one.

## 11. Impact Scope Model

**Scopes:**
- UI_LAYOUT
- BEHAVIOR
- DATA
- PERMISSIONS
- NAVIGATION_ROUTE
- VALIDATION
- CONTENT_COPY
- WORKFLOW
- NO_UI_IMPACT

**Rules:**
- Scope is stored on the Matrix row and on the Ledger row.
- Several scopes can apply at once. NO_UI_IMPACT cannot be combined with any other.
- Scope drives version creation through the §8 table. A packet can affect a screen with no new version (e.g. REFERENCED + NO_UI_IMPACT, or DATA without a contract change).
- The scope is taken from the packet's delta and requirement text, and confirmed by the reviewer. It is never final without review, except for REFERENCED + NO_UI_IMPACT.

**How it appears in the UI:** a scope chip row on each matrix and ledger line, for example:

```text
SCR-M06-014  MODIFIED  [Behavior] [Data] [Validation]  (Layout -)(Navigation -)
```

The version history lets users filter by scope.

## 12. Build Packet Consumption Workflow (G)

```text
Intake -> Identify -> Detect -> Build Matrix -> Review -> Approve/Reject
   -> Commit (Registry + Versions + Ledger + Events) -> Lock -> Trace
```

| Step | System | Data produced | Automatic | Human | Reject / Revise / Revert |
|---|---|---|---|---|---|
| Intake | Parse document_control, registers; hash the file | Packet Run | Yes | — | Same packet + version + hash → refused as a duplicate |
| Identify | Build the candidate list | Candidates | Yes | — | — |
| Detect | Classify per §13 | Detection results | Yes | — | — |
| Matrix | Propose type and scope | Matrix rows | Yes | — | — |
| Review | Per-row decisions | Decisions | EXACT+REFERENCED+NO_UI only | All other rows | A rejected row is excluded; the packet continues |
| Approve | Packet-level sign-off (a different person from the proposer) | Approval | — | Yes | Whole packet rejected → all rows REJECTED; nothing committed |
| Commit | Issue GSIDs, write versions, alias bindings, ledger rows, events | Registry changes | Yes | — | Atomic per packet run |
| Lock | Identity lock on newly registered screens (D3) | Lock event | Per decision | Optional | — |
| Trace | Views update | — | Yes | — | — |

- **Revised packet:** a new run and a new matrix, compared with the previous one. Rows identical to already-approved decisions are pre-marked "carried forward" and still need one-click confirmation. Changed rows are reviewed again.
- **Reverted packet:** compensating REVERTED rows per §9.

## 13. Existing vs New Detection (H)

**Signals:**
- S1 alias exact
- S2 route exact (current or ended)
- S3 Figma key/node
- S4 name/slug normalized equality or similarity at least 0.85
- S5 module = owning_module
- S6 requirement overlap
- S7 purpose text similarity
- S8 primary actions overlap
- S9 shared components
- S10 structure signature equal

The thresholds are deterministic and configurable. There is no free-form AI decision.

| Class | Qualifying evidence | Confidence | Automatic behavior | Review | Can create a screen? | Can create a version? |
|---|---|---|---|---|---|---|
| **EXACT** | S1 plus at least one of S2/S3/S5, and no contradicting signal | High | Link to the GSID | Only if the proposed type is not REFERENCED+NO_UI | No | Yes (after review) |
| **STRONG** | S2+S4, or S3+S4, or S1 with a contradicting module | Medium-high | Suggest the link | Required (one click) | No | Yes (after review) |
| **POSSIBLE** | Any two of S4, S6, S7, S8, S9, S10 without S1/S2/S3 | Low | Show the candidates | Required | Only after the reviewer rejects the candidates | Only if linked |
| **NONE** | No signal above threshold | — | Propose NEW | Required | Yes (after approval) | v1 only |
| **CONFLICT** | S1 hits an alias that is UNRESOLVED_SHARED, ENDED on a retired screen, or bound to 2+ GSIDs; or S2 hits a route active on another GSID; or the packet declares NEW for a BOUND alias | — | Hard block on that row | Must be resolved | No | No |

```text
candidate
 |- S1 alias hit?
 |    |- alias UNRESOLVED / retired / multi-bound -> CONFLICT
 |    |- packet says NEW                           -> CONFLICT
 |    |- corroborated (S2|S3|S5) & no contradiction -> EXACT
 |    '- otherwise                                  -> STRONG
 |- no S1: S2+S4 or S3+S4                          -> STRONG
 |          route active on other GSID             -> CONFLICT
 |- two weak signals                               -> POSSIBLE
 '- none                                           -> NONE (propose NEW)
then: EXACT & unchanged & NO_UI -> REFERENCED (auto); else -> review
```

## 14. Governance and Locking Lifecycle (I)

There are four independent dimensions, so no state overlaps another.

**Identity state:** RESERVED → ACTIVE → RETIRED

```text
 RESERVED (GSID issued on proposal; never reusable)
    |-- proposal rejected --> BURNED (reserved forever, never active)
    '-- approved --> ACTIVE --> RETIRED (reserved forever)
```

**Governance state:** DISCOVERED → PROPOSED → REGISTERED → GOVERNED

- DISCOVERED: imported by Phase 0 or found by a drift scan; no approval yet.
- PROPOSED: in a matrix awaiting a decision.
- REGISTERED: approved; identity lock applied according to D3.
- GOVERNED: owner confirmed. Content changes happen **only** through approved impacts.
- A screen stays GOVERNED across versions. **MODIFIED is not a state; it is a Ledger impact type.**

**Version state** (per version): CURRENT | SUPERSEDED | REVERTED_FROM

**Conflict state** (overlay): NONE | OPEN (blocks lock, merge, retire and NEW-over) | RESOLVED

**The three mechanisms kept apart:**

| Mechanism | Takes effect | Freezes | Does NOT freeze |
|---|---|---|---|
| ID Reservation | When the GSID is issued (on proposal) | The GSID value can never be reused | Anything else |
| Identity Lock | On REGISTERED (D3) | GSID, primary display alias, alias bindings (changes only via approved re-bind) | The definition |
| Definition governance | On GOVERNED | Direct edits | Versioned changes through approved impacts |

**Transitions:**

| Transition | Trigger | Actor | Approval | Identity immutable | New version | Audit |
|---|---|---|---|---|---|---|
| → DISCOVERED | Phase 0 import or drift scan | System | No | Reserved | No | discovered event |
| → PROPOSED | Matrix NEW row | System | No | Reserved | No | proposed |
| → REGISTERED | Packet approved | Approver | Yes | Yes (lock) | v1 | registered, locked |
| → GOVERNED | Owner confirms | Owner / governor | Yes | Yes | No | governed |
| GOVERNED (new version) | Approved MODIFIED | Approver | Yes | Yes | vN+1 | versioned |
| → RETIRED | Approved RETIRED / MERGED | Governance admin | Yes (elevated) | Stays reserved | No | retired / superseded |
| Conflict OPEN / RESOLVED | Detection / resolution | System / reconciler | Resolution needs approval | Unchanged | No | conflict_raised / resolved |

## 15. Out-of-Band Change Governance

**Detectors:**
- Figma signature drift, compared with the current version's fingerprint.
- Code route changes: a file under `src/routes` added, removed or renamed without a matching version route.
- Screen metadata changes in `screens.ts`, `governed/*` or registers that differ from the current version.
- Direct UI edits made in Lovable, which surface through the code or signature detectors.

Each detection writes an **OUT_OF_BAND_CHANGE** ledger row with the evidence, raises a warning, and **never changes the governed version**.

**Outcomes** (decided by the owner or a governor):

| Outcome | Effect |
|---|---|
| Adopt as a governed change | OUT_OF_BAND_ADOPTED + new version (requires an approver, not the person who adopts) |
| Reject as unauthorized | Ledger note; creates a restore task |
| Associate with an existing packet | Links to that packet run as a late matrix row → normal review |
| Create a corrective packet / impact | Opens a new packet run pre-filled with the drift |
| Restore the governed state | Task to revert the source; closes when the drift clears |

## 16. Audit / Event Architecture

All events go through `public.m00_emit`. No second audit system is created.

- **Naming:** `abox.gov.<aggregate>.<verb>.v1`
  - Screen: discovered, proposed, registered, locked, governed, versioned, retired, superseded, split, merged, alias_added, alias_rebound, conflict_raised, conflict_resolved, oob_detected, oob_resolved.
  - Packet run: ingested, matrix_built, row_decided, approved, rejected, withdrawn, reverted.
- **aggregate_type:** `screen` (aggregate_id = GSID) or `packet_run` (aggregate_id = packet_run_id).
- **correlation:** packet_run_id, or reconciliation_run_id in Phase 0.
- **actor:** `p_actor` (auth user). System-initiated events use the workload identity.
- **payload:** `{ packet_id, packet_version, impact_id, matrix_row_id, version_no, previous_version_no, before_ref, after_ref, alias_value, gsid, scope[], causation_id }`. Before and after are stored as **references** to versions, with only small diffs inline.
- **Causation:** `m00.outbox_event` has no causation column. Default: carry `causation_id` inside the payload. Adding a nullable causation column is decision D7; it is not assumed.
- **Rebuilding history:** Ledger rows ordered by time, joined to Versions, give the full screen story. Audit events are the independent tamper-evident copy (`payload_hash`).

## 17. Existing Registry Reconciliation

| Source | Authoritative (transitional) for | Imported as |
|---|---|---|
| M04/M05/M06 Screen_Register (json) | Module screen ID, name, route, roles, purpose, owning module | SCR_MODULE alias + candidate v1 |
| M00 Screen_Register | ID, name, workspace, requirement_ids (not routes) | SCR_LEGACY alias + candidate v1 flagged MISSING_ROUTE |
| `governed/*.index.ts` | Approval status per packet | Cross-check only |
| `screens.ts` | App display name and purpose | UX / SCR_LEGACY alias |
| `m08/registry.ts` | SCR-M08-### | M08 alias |
| Figma tokens | Key, node, signatures, prototype links | FIGMA aliases + fingerprint |
| `nav-config.ts` + `src/routes` | Live routes | ROUTE aliases |
| `m00-foundation.ts` | Nothing (sample data) | Not imported; the count gap is logged |

**Never overwritten automatically:**
- Any source file.
- Figma pages B0–B10 and prototype links.
- Phase 59 manifests.
- Existing routes.
- The M06 change log.

## 18. Phase 0 Reconciliation Design (J)

**Read-only** against every source. It writes only to a new staging area.

```text
Extract (all sources) -> Normalize -> Cross-match -> Detect issues
   -> Staging snapshot (immutable, hashed) -> Review queue
   -> Human decisions -> Approved reconciliation set (input to Phase 1)
```

**Phase 0 produces:**
1. A **Source inventory**: every record from every source, with its source_ref and a file hash.
2. **Candidate screens**: proposed logical groupings. Nothing is decided.
3. An **Alias inventory**: every ID and route, with kind and source.
4. A **Cross-match report**: STRONG / POSSIBLE matches across the ID spaces.
5. **Issues**, each one a review item:
   - SHARED_ALIAS: SCR_AGENCY_SETUP, UX-009, and any others found.
   - BOUNDARY_DECISION: one screen with several routes, several screens, variants, or duplicate.
   - MISSING_ROUTE: 34 M00 screens.
   - ROUTE_DISCREPANCY: M06 change log vs json.
   - COUNT_DISCREPANCY: M00 52 vs 34.
   - MISSING_OWNER, MISSING_PURPOSE.
   - CONFLICTING_METADATA: e.g. names that differ across sources.
   - FIGMA_MISMATCH: a Figma key with no registry candidate, or the reverse.
   - ORPHAN_ROUTE: a route with no screen record.
6. A **Reconciliation report** with counts per source, per issue kind, and resolved/open.
7. An **Approved reconciliation set**, frozen when you sign off; it is Phase 1's only input.

**Exit criteria:** every issue is decided or explicitly deferred, the counts balance, and you have signed off.

## 19. Duplicate Detection and Enforcement

| Rule | Final level | Phase 1–5 level |
|---|---|---|
| GSID reuse | Hard block | Hard block (built into the registry) |
| Alias bound to more than one governed GSID | Hard block | Hard block |
| Retired identity reused | Hard block | Hard block |
| Unresolved identity conflict affecting an action | Hard block | Hard block |
| Packet declares NEW for an existing governed screen | Hard block | Hard block |
| Duplicate active route where uniqueness applies (not VARIANT / multi-route) | Hard block | Review |
| Likely duplicate (STRONG / POSSIBLE) | Review | Review |
| Module ownership conflict | Review | Review |
| Figma identity conflict | Review | Review |
| Route ambiguity / boundary ambiguity | Review | Review |
| Missing metadata / incomplete legacy data | Warning | Warning |
| Out-of-band drift | Warning (then review of the outcome) | Warning |
| Proposal stale for more than N days | Warning | Warning |

Registry-internal integrity rules block from day one because they protect the new data. Rules that apply to code and repository content start as report-only (§23).

## 20. Governance UI / UX

All screens live under the JET admin workspace ("Screen Governance").

- **Registry list:** display ID, name, module, routes, governance state, identity lock, version, owner, last impacted by, last updated, conflict / drift indicators. Filters and search cover any alias.
- **Screen detail:** Identity (GSID, aliases with bindings and validity), Definition (current version), Governance (states, lock, owner), Conflicts, Figma (fingerprint, prototype count), Requirements, Routes, Related artifacts.
- **Version history:** version, packet, module, scope chips, change summary, date, actor, approver, signatures, and a diff between any two versions.
- **Impact history:** every ledger row, including rejected, withdrawn, reverted and out-of-band ones.
- **Packet impact review:** built on the Matrix. Grouped as Impacted, Referenced, New, Conflicts (blocking), Possible duplicates, Needs review. Each row has evidence and scope chips and the actions approve / reject / reclassify / link / mark variant / defer. "Approve packet" is disabled while blocking rows remain, and for the proposer.
- **New screen registration:** confirm name, owning module, routes and primary display alias; see the nearest matches; a GSID is issued when approved.
- **Reconciliation workspace (Phase 0):** a queue of issues with side-by-side source evidence and the boundary-decision picker.
- **Actions by state:**
  - PROPOSED: approve / reject.
  - REGISTERED: confirm governance / edit metadata.
  - GOVERNED: add alias / propose retire / resolve drift.
  - CONFLICT OPEN: resolve.
  - RETIRED: view only.

## 21. Traceability Views (K, L)

**Packet → Screens (K).** The header shows packet, version, module, ingested and approved dates, approver, and row counts by bucket.

```text
M07 BP v1.0  (approved 2026-10-02 by J.Doe)
  SCR-M06-014  Agent Roster      MODIFIED    v2->v3  [Behavior][Data]  REQ-M07-031  approved
  SCR-M06-017  Agent Detail      REFERENCED  v1      [No UI]           REQ-M07-044  auto
  SCR-M07-001  Commission Setup  NEW         v1      [all]             REQ-M07-050  approved
  SCR-M07-003  (proposed)        REJECTED    —                         reason: duplicate of SCR-M06-020
```

**Screen → Packets (L).** The header shows display ID, GSID, aliases, state, lock, current version and owner.

```text
SCR-M06-014  (GS-000123)  GOVERNED  locked  v3
  v1  NEW       M06 BP v1.0  M06  2026-08-31  [all]         approved A.B
  v2  MODIFIED  M07 BP v1.0  M07  2026-10-02  [Behavior]    REQ-M07-031  approved J.Doe
  --  OOB       Figma drift  —    2026-10-10  warning -> adopted as v3?
  v3  MODIFIED  M09 BP v1.2  M09  2026-11-15  [Navigation]  route /agents -> /network/agents
```

## 22. Figma Integration

- **Identity:** never taken from Figma alone. FIGMA_KEY and FIGMA_NODE are only alias kinds.
- **Detection:** S3 (key/node) and S10 (structure signature) are supporting signals.
- **Versioning:** a Figma change is evidence only; it never creates a version by itself.
- **Drift:** unapproved signature changes produce OUT_OF_BAND_CHANGE.
- **Audit:** a fingerprint (key, node, source, structure and binding signatures, prototype link count) is captured per version.
- **Preservation:** the registry *reads* the tokens files. The extractor, plugin, B0–B10 pages, 682 links and Phase 59 behavior are unchanged.

## 23. Governance Report / CI

New analyzers are added to `scripts/governance-report.mjs`, reading a registry export plus the source files.

| Check | Report | Warn | Review | Block (Phase 6+) |
|---|---|---|---|---|
| Duplicate alias across sources | P1 | — | — | Yes |
| Route in `src/routes` with no registered screen | P1 | P3 | P4 | New routes only |
| Retired ID used in code or registers | P1 | — | — | Yes |
| Source value differs from the governed version | P1 | P5 | P5 | No (drift workflow) |
| Open conflicts | P1 | — | — | Release gate |
| Unresolved PROPOSED rows | P3 | P4 | — | Release gate |
| Missing governance metadata | P1 | P2 | — | No |

## 24. Security and Permissions

Built on `m00.role_template` / `permission_definition` / `role_assignment`. New permission codes:

| Capability | Permission | Default role | Elevated |
|---|---|---|---|
| View | `screen.read` | All internal | No |
| Propose / ingest packet | `screen.propose` | Module leads | No |
| Review matrix rows | `screen.review` | Module leads, designers | No |
| Approve impacts / packet | `screen.approve` | Module owner | Yes |
| Govern (confirm, edit metadata, add alias) | `screen.govern` | Screen governance team | Yes |
| Retire / merge / split / re-bind alias | `screen.govern.admin` | Governance admin | Yes |
| Reconcile legacy conflicts (Phase 0) | `screen.reconcile` | Governance admin | Yes |
| Override a hard block | `screen.override` | `JET_PLATFORM_ADMIN` only, with a reason | Yes |

**Separation of duties:** proposer ≠ approver on the same packet run, and adopter ≠ approver for out-of-band changes. An override is the only exception; it is audited, and a second admin must acknowledge it within N days.

## 25. Migration / Implementation Phases

| Phase | Scope | Depends on | Data | Risk | Rollback | Exit |
|---|---|---|---|---|---|---|
| 0 Reconcile | Staging, issue queue, reconciliation UI | — | Read-only extracts | Low | Discard staging | All issues decided; sign-off |
| 1 Registry | Screen, Alias, Binding, Version tables; import the approved set; read-only views | 0 | Approved set | Mapping errors | Drop the new tables; sources untouched | Every alias resolves; counts match |
| 2 Identity governance | Reservation, lock, state machine, events | 1 | Lock approved screens | Over-locking | Unlock by event | Reuse blocked in tests |
| 3 Ledger | Ledger + seed NEW rows from packet document_control | 2 | Seed rows | Wrong attribution | Compensating rows | Screen→Packet shows the origin for every screen |
| 4 Matrix + workflow | Intake, detection, matrix, review, commit, revise / revert | 3 | — | False matches | Reject the run | One real packet processed end to end |
| 5 Drift + Figma | Fingerprints, drift scanner, out-of-band outcomes | 4 | Current signatures | Noise | Disable the scanner | Drift shows only as warnings |
| 6 Enforcement | Report analyzers → CI / release gates | 5 | — | Build blockage | Revert gate to report | Zero open conflicts; gates green |

## 26. Edge Cases

| Case | Behavior |
|---|---|
| One ID, many routes | BOUNDARY_DECISION (§7); never automatic |
| Route change | MODIFIED [Navigation]; old ROUTE alias ended |
| Rename | MODIFIED [Content]; aliases unchanged |
| Split | SPLIT impact; new GSIDs with `split_from`; aliases re-bound by decision |
| Merge | MERGED; the survivor keeps its GSID; others RETIRED with `superseded_by`; aliases re-bound |
| Referenced, no change | REFERENCED + NO_UI_IMPACT; no version |
| New screen resembling an existing one | POSSIBLE / STRONG → review |
| Several packets touch one screen | Versions in approval order; a stale base version → rebase review |
| Packet revision | New matrix, compared with the previous one; carry-forward confirmation |
| Rejected impact | REJECTED row; burned GSID stays reserved |
| Revert | Compensating rows; restoring version |
| Retired screen referenced again | CONFLICT; reinstatement needs `screen.govern.admin` |
| Conflicting ownership | Review; owner changes only through `screen.govern` |
| Figma, manual or code change outside the workflow | OUT_OF_BAND_CHANGE + the five outcomes |

## 27. Risks and Trade-offs

| Risk | Mitigation | Alternative considered |
|---|---|---|
| Breaking Figma / prototype links | Registry is read-only toward Figma; aliases keep every key | Renaming IDs — rejected |
| Governance facts kept in two places | Registry is the target owner; sources are checked against it | Keeping sources authoritative forever — rejected (permanent duplication) |
| False duplicate matches | Corroboration rule; deterministic thresholds; reclassify action | ML similarity — deferred |
| Too much approval work | Auto-pass for EXACT+REFERENCED+NO_UI; per-packet batching; carry-forward | Review everything — slower |
| Too many versions | Version only on contract-changing scopes | A version per impact — noisy |
| Audit data growth | Before/after by reference; diffs are small | Full snapshots in events — rejected |
| Poor legacy data | Phase 0 queue; warnings tracked | Auto-cleaning — rejected |
| Too rigid | Report → Warn → Review → Block | Immediate CI gates — rejected |
| Migration complexity | Seven reversible phases | Big-bang — rejected |
| Performance | Under 1k screens; indexed alias and route lookups | — |

## 28. Final Decisions Required Before Implementation

Screen boundaries are **not** listed here. Whether `SCR_AGENCY_SETUP` is one screen or two, and whether `UX-009` is one screen with variants, are **Phase 0 reconciliation decisions**.

| # | Decision | Options | Recommended | Reason | Consequences |
|---|---|---|---|---|---|
| D1 | Canonical identity | A: existing IDs · B: GSID + aliases | **B** | Handles shared aliases, mixed formats and Figma-only screens without renames | A: shared aliases cannot be resolved without renames · B: one extra lookup layer |
| D2 | Registry storage | Database (Lovable Cloud) · versioned JSON in the repo | **Database** | Approvals, locks, actors and events need enforcement; reuses `m00_emit` | Database: needs roles and UI · JSON: no enforceable approvals or audit |
| D3 | Identity lock timing | Automatic on REGISTERED · explicit owner action | **Automatic on REGISTERED** | Closes the reuse window at once; the definition still evolves | Auto: less manual control · Explicit: risk of accidental re-binding before the lock |
| D4 | Auto-accept scope | None · EXACT+REFERENCED+NO_UI only | **EXACT+REFERENCED+NO_UI** | Removes trivial reviews safely | None: maximum control, slower packets |
| D5 | Target handling of `screens.ts` and the M08 registry | Generate from the registry · validate against the registry · leave as is | **Validate in Phases 1–5, then generate from the registry** | Removes duplication in the end without breaking pages now | Generate early: page refactor risk · Leave: permanent duplication |
| D6 | Version rule for Data / Permission-only changes | Always version · version only when the contract changes · never | **Only when the contract changes** | Keeps versions meaningful | Always: too many versions · Never: permission history lost |
| D7 | Causation storage | Payload field · add a nullable `causation_id` column to `m00.outbox_event` | **Payload field** (no change to existing infrastructure) | Avoids changing shared M00 tables | Column: easier to query, but changes M00 infrastructure |
| D8 | Enforcement timeline | Gates in Phase 1 · report until Phase 6 | **Report until Phase 6** (registry integrity blocks from Phase 1) | Legacy conflicts would otherwise block builds | Early gates: stricter, likely stalled work |
| D9 | Separation of duties | Allow self-approval · proposer ≠ approver with an audited override | **Proposer ≠ approver + override** | Standard control with an escape hatch | Self-approval: faster, weaker audit |
| D10 | Out-of-band adoption | Owner can adopt alone · adopt needs a separate approver | **Separate approver** | Keeps drift from bypassing review | Owner alone: faster, weaker control |
