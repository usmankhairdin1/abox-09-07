# Screen Governance and Screen-Level Traceability — Final Architecture Specification (rev. 3)

Design only. This revision applies the seven final corrections. Approving it approves the architecture and nothing else. It creates no code, tables, migrations, permissions, UI or files, and changes no IDs, routes, registers or Figma. Phase 0 will get its own separate plan.

---

## 1. Executive Summary

ABox gets an additive governance layer around its existing screen sources:

- **Candidate Screens** (`CAND-######`): temporary, discardable identities used in Phase 0, detection and review.
- **Canonical Screen Registry**: permanent logical screens with an immutable **GSID** (`GS-######`). A GSID is issued **only at approved registration**.
- **Alias model**: every existing ID (UX-###, SCR_*, SCR-M0x-###, SCR-M08-###, Figma keys, routes) stays unchanged and becomes an alias. There is an explicit UNRESOLVED_SHARED state for aliases that several screens use today.
- **Screen Versions**: the definition evolves while the identity stays fixed.
- **Screen Impact Matrix**: a proposed packet-to-screen relationship. **Screen Impact Ledger**: the approved historical packet-to-screen event. **Impact Scope**: the dimensions of that event.
- **Screen Relationships**: screen-to-screen facts (navigation, dependency, variant, lineage), kept separate from impacts.
- **Drift detection**: governance controls the *approved state*, not the physical ability to edit code. Unapproved changes surface as OUT_OF_BAND_CHANGE.

Events use the existing `m00_emit` → `m00.audit_event` / `m00.outbox_event`. Figma is evidence, never identity. Enforcement goes Report → Warn → Review → Block.

## 2. Final Design Principles

1. **Additive:** nothing existing is rewritten to make governance cleaner.
2. **A candidate is not an identity:** candidates may be discarded, merged or reclassified. GSIDs are issued only at approved registration and are never reused.
3. **Identity is permanent; the definition evolves:** the identity lock never freezes content.
4. **Append-only history:** corrections are compensating records.
5. **No silent semantic decisions:** automation may classify high-confidence evidence, but it must never silently resolve ambiguity about screen identity or screen impact.
6. **Evidence is not identity:** routes, names and signatures are signals.
7. **Governance is not an editing lock:** governance controls the approved definition, lineage and authorization; drift detection covers physical changes.
8. **One audit bus:** reuse `m00_emit`.
9. **One owner per governance fact:** no governance fact is kept in two places permanently.
10. **Staged enforcement:** Report → Warn → Review → Block.

## 3. Current-State Constraints (verified)

- **Four screen ID spaces:**
  - `src/lib/screens.ts` (UX-###, SCR_*).
  - `src/lib/governed/*.index.ts` together with `public/registers/m0x.json` → Screen_Register: M04 36, M05 30, M06 35 (SCR-M0x-###); M00 34 (SCR_*, all routes empty).
  - `src/lib/m08/registry.ts` (SCR-M08-###).
  - Figma tokens (`current:route:...` keys plus source, structure and binding signatures).
- **Shared aliases:**
  - `SCR_AGENCY_SETUP` → `/app/agency` and `/app/agency/entities` (`nav-config.ts:120,166`).
  - `UX-009` → `/plans` plus the Figma states `plans#filters` and `plans#edit-quote`.
- **Discrepancies:**
  - M00 screen count: 52 in `m00-foundation.ts` vs 34 in the register.
  - M06 routes: `CONF-M06-002` says they are empty, but `m06.json` has routes for all 35.
- The delta and impact registers carry `originating_packet` and `impacted_module`, but no screen IDs.
- **Reusable infrastructure:**
  - `public.m00_emit(...)`, `m00.audit_event`, and `m00.outbox_event` (which has no causation column).
  - `m00.role_template`, `permission_definition`, `role_assignment`, `m00.is_platform_admin()`, and the `JET_PLATFORM_ADMIN` role.
- **Protected:** Figma B0–B10, the 682 prototype links, Phase 59 import idempotency, all routes, and all existing registries.

## 4. Final Target Architecture

```text
 Existing sources (read-only)                         Build Packet
 screens.ts | governed/* | registers/*.json                 |
 m08/registry | Figma tokens | nav-config | src/routes      v
        |                                            [Intake] -> Packet Run
        v                                                   |
 [Phase 0 Staging]  Source Inventory -> Candidates (CAND-*) |
        |           -> Issues -> Human Reconciliation        v
        v                                            [Detection] -> Candidates / GSID matches
 Approved Reconciliation Set                                |
        |                                                   v
        '------------> [Registration / Commit] <---- [Screen Impact Matrix] <-> Review UI
                              | issues GSID only here
                              v
 +--------------------- Canonical Screen Registry ----------------------+
 | Screen(GSID) - Alias/Binding - Version - Fingerprint - Relationship |
 +----------------------------------------------------------------------+
        |                         |
        v                         v
 [Screen Impact Ledger]    m00_emit -> m00.audit_event + m00.outbox_event
        |
 [Traceability]  Packet->Screens | Screen->Packets | Screen->Screens
 [Drift Scanner] code / routes / metadata / Figma -> OUT_OF_BAND_CHANGE
 [governance-report analyzers] Report / Warn / Review / Block
```

## 5. Canonical Screen Registry

The registry contains **approved logical screens only**; candidates never appear in it.

| Group | Fields |
|---|---|
| Identity | gsid, identity_state, registered_at, registered_by, registered_by_packet_run or reconciliation_run, originating_candidate_ids[] |
| Display | primary_display_alias_id, name, slug |
| Ownership | owning_module, owner_role, steward_user |
| Governance | governance_state, id_locked, locked_at, locked_by |
| Conflict overlay | conflict_state, open_conflict_ids[] |
| Version pointer | current_version_no |
| Audit summary (derived from the Ledger) | last_impact_id, last_modified_at, last_modified_by, last_modified_packet |

The definition content (routes, purpose, roles, permissions, actions, requirements) lives on the **Version**.

**Authority (final principle):**
- **The registry is authoritative for:** screen identity, GSID, aliases and bindings, governance state, ownership, lifecycle, lineage, current governed version, packet lineage, impact history, identity lock, and screen relationships.
- **Existing systems stay authoritative for their specialized technical concerns:**
  - Code: route implementation and runtime UI.
  - Figma tokens: design nodes, signatures and prototype links.
  - Packet JSON: what each packet *specified*.
  - `screens.ts` and `m08/registry.ts`: runtime display metadata used by pages today.
- **During Phases 1–5:** existing sources are **validated against** the registry by the governance report; they are never overwritten.
- **Deferred decision:** whether a given source is later generated from, synchronized from, validated against, retained independently from, or retired in favour of the registry. This is decided per source after dependency analysis in Phases 0–1 (§31, deferred). Nothing is pre-committed.

## 6. Candidate Screen Model

`CandidateScreen`:
- cand_id (`CAND-######`), origin (PHASE0 | PACKET_RUN | DRIFT_SCAN), origin_run_id.
- source_refs[] and proposed_aliases[] (the IDs, routes and Figma keys observed).
- proposed_definition (json), detection_results[], matched_gsid (nullable).
- candidate_state:
  - OPEN
  - MATCHED_EXISTING (resolved to a GSID)
  - APPROVED_NEW (queued for registration)
  - MERGED_INTO (another candidate)
  - VARIANT_OF (a GSID or candidate)
  - REJECTED
  - DISCARDED
  - REGISTERED (terminal; links to the issued GSID)

```text
Source discovery / packet row / drift
        v
  CAND-000123 (OPEN)
        v  detection + human review
  +-- MATCHED_EXISTING -> GS-000045 (no new GSID)
  +-- VARIANT_OF       -> GS-000045 (variant alias; no new GSID)
  +-- MERGED_INTO      -> CAND-000120
  +-- REJECTED / DISCARDED (nothing consumed)
  '-- APPROVED_NEW -> [Registration/Commit] -> GS-000200 issued -> REGISTERED
```

**Rules:**
- Candidate IDs can be discarded, merged or reclassified. They carry **no** governance meaning and are never authoritative.
- Candidate IDs are unique within staging but are never promised to persist. They may be reused across staging resets.
- Rejected, merged, variant or matched candidates **do not consume GSIDs**.
- Phase 0 works entirely with candidates.
- A Matrix row references **either** an existing GSID **or** a CAND.
- A NEW screen receives its GSID only in the approved commit transaction.

## 7. GSID and Alias Governance

- **GSID:** `GS-######`. Issued in sequence **at registration only**, permanent, never reused, including after retirement.

**Alias:**
- alias_id, alias_value, alias_kind (UX | SCR_LEGACY | SCR_MODULE | M08 | FIGMA_KEY | FIGMA_NODE | ROUTE), source_system, source_ref.
- The alias value and kind are **immutable**.

**AliasBinding:**
- binding_id, alias_id, gsid (nullable), candidate_refs[] (GSIDs or CANDs while unresolved).
- binding_state (BOUND | UNRESOLVED_SHARED | ENDED), role (PRIMARY | SECONDARY | VARIANT).
- valid_from, valid_to, decided_by, decision_ref.

```text
Normal:      alias --BOUND--> GS-000123
Unresolved:  alias --UNRESOLVED_SHARED--> {GS-000123 | CAND-000045, GS-000124 | CAND-000046}
Re-mapped:   old binding ENDED (valid_to=t); new binding BOUND (valid_from=t) after approval
```

**Binding rules:**
- Bindings are never edited, only ended and replaced.
- An alias can move to another GSID **only** through an approved reconciliation, merge or split. This is recorded as an ALIAS_REBOUND ledger event.
- Old references stay correct: ledger rows and events store both `alias_value_at_time` and the GSID in effect at the time. Historical lookups use the binding valid at the event time.
- At any moment an alias has at most one BOUND PRIMARY or SECONDARY binding. VARIANT bindings attach to one GSID.
- UNRESOLVED_SHARED stays visible, and blocks lock, merge, retire and NEW-over actions on its candidates, until a person resolves it. **It is never silently assigned.**

**Deciding logical screen boundaries** (always a human reconciliation decision; the system shows evidence and never pre-selects an answer):

| Outcome | Result |
|---|---|
| ONE_SCREEN_MULTI_ROUTE | 1 GSID; one ROUTE alias per route |
| MULTIPLE_SCREENS_SHARED_LEGACY_ID | N GSIDs; the shared alias is PRIMARY on one and SECONDARY on the others |
| ONE_SCREEN_VARIANTS | 1 GSID; VARIANT aliases plus VARIANT_OF relationships where variants are modelled |
| DUPLICATE_CONFLICT | The candidates are merged before registration (with no GSID burned), or registered screens are merged with lineage |

## 8. Screen Version Model

`ScreenVersion`:
- gsid, version_no, created_by_impact_id, created_at.
- definition (json), routes[], requirement_ids[], scope_mask[].
- fingerprint_id, status (CURRENT | SUPERSEDED | REVERTED_FROM).

**Version-creation rules:**

| Change | Version? |
|---|---|
| New screen (approved registration) | GSID + v1 |
| UI_LAYOUT, CONTENT_COPY, NAVIGATION_ROUTE, WORKFLOW | vN+1 |
| BEHAVIOR, VALIDATION | vN+1 (marked non-visual) |
| DATA | vN+1 only if the screen's shown fields or regions change; otherwise a ledger event only |
| PERMISSIONS | vN+1 if the definition's roles or permissions change |
| REFERENCED / NO_UI_IMPACT | No version |
| Alias added or re-bound; relationship added | No version |
| Drift without an approved change | No version (OUT_OF_BAND_CHANGE) |
| Revert of an approved change | New version restoring the prior definition |

One approved impact with several scopes produces **one** version. A version can therefore hold several coordinated changes from one packet.

## 9. Screen Impact Ledger

> **Ledger Impact = the approved historical packet-to-screen event.** It is written once, when a Matrix decision is committed.

**Fields:**
- impact_id, gsid, alias_value_at_time.
- packet_id, packet_version, packet_run_id, module.
- impact_type, impact_scope[] (one record, several scopes), requirement_refs[].
- detection_class, detection_evidence, source_artifact (register, row, file hash).
- previous_version_no, resulting_version_no, before_ref, after_ref, diff.
- proposed_by, proposed_at, approval_state, approved_by, approved_at, decision_note.
- matrix_row_id, correlation_id (packet run), causation_id, compensates_impact_id.

**Impact types:**
- NEW, MODIFIED, REFERENCED, RETIRED, SUPERSEDED
- SPLIT, MERGED
- ALIAS_ADDED, ALIAS_REBOUND
- OUT_OF_BAND_CHANGE, OUT_OF_BAND_ADOPTED
- REVERTED

**Cardinality:**
- One approved Matrix decision creates **one primary Ledger impact**, carrying all of its scopes. The Ledger never has one row per scope.
- A *separate* ledger record is written only for a genuinely separate business event: for example an ALIAS_REBOUND caused by the same decision, or the SPLIT or MERGED lineage record, each with causation pointing to the primary impact.

**Rules:**
- **Immutable:** every written field.
- **Compensating records:** misclassification uses a new row with `compensates_impact_id`. A mistaken approval uses REVERTED plus a restoring version. A wrong binding uses ALIAS_REBOUND.
- **Rejected Matrix rows** do not create Ledger impacts. They stay on the frozen Matrix with a reason, and no GSID is consumed.
- **Withdrawn packet:** the Matrix is closed as WITHDRAWN. There are no Ledger impacts and no registry change.
- **Reverted approved change:** each impact gets a REVERTED record. MODIFIED gets a restoring version. NEW becomes RETIRED, and its GSID stays reserved forever. Bindings are ended and restored.

## 10. Screen Impact Matrix

> **Matrix Row = the proposed packet-to-screen relationship.** Exactly one row per (packet run × logical screen or candidate).

**Row fields:**
- matrix_row_id, packet_run_id, target (GSID or CAND), existing_or_new.
- proposed_impact_type, impact_scope[], requirement_refs[].
- current_version_no, proposed_version_no, detection_class, evidence, blocking_flags[].
- auto_eligible (bool, with its reasons), reviewer_decision (APPROVE | REJECT | RECLASSIFY | LINK_TO_GSID | MERGE_CANDIDATES | MARK_VARIANT | DEFER), decided_by, note.
- proposed_relationships[] (see §12).

| Target | Existing/New | Impact | Scope | Req | Cur | Prop | Detection | Evidence | Decision |
|---|---|---|---|---|--:|--:|---|---|---|
| GS-000123 (SCR-M06-014) | Existing | MODIFIED | BEHAVIOR, DATA, VALIDATION | REQ-031 | 3 | 4 | EXACT | alias + route | Review |
| GS-000130 (SCR-M06-017) | Existing | REFERENCED | NO_UI_IMPACT | REQ-044 | 1 | — | EXACT | alias + route, no conflicts | Auto |
| CAND-000501 (SCR-M07-001) | New | NEW | all | REQ-050 | — | 1 | NONE | no match | Review |
| CAND-000502 (SCR-M06-020?) | ? | CONFLICT | — | REQ-052 | — | — | POSSIBLE | name similarity to GS-000140 | Review |

**Lifecycle:**
- Generated at intake by the Detection Engine.
- Persisted per packet run, and is the data behind the review UI.
- Frozen (read-only) after the packet decision.
- A revised packet gets a new Matrix, compared with the previous one.
- On approval, each approved row produces one primary Ledger impact (causation = matrix_row_id), plus GSID issuance for APPROVED_NEW candidates.

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
- Scope is stored on the Matrix row and on the Ledger impact. It is a multi-value property of **one** event.
- Several scopes can apply at once. NO_UI_IMPACT cannot be combined with any other scope.
- Scope decides whether a version is created (§8), so a packet can affect a screen without creating a new version.
- Scope is derived from the packet's delta and requirement text, and confirmed by the reviewer (except under the strict auto-accept rule in §14).

**How it appears:** as chips, for example `MODIFIED [Behavior][Data][Validation] (Layout -)(Navigation -)`. It can be filtered in version and impact history.

## 12. Screen Relationship Model

The Ledger answers "what changed this screen". Relationships answer "how does this screen relate to other screens". These are different facts and are stored separately.

`ScreenRelationship`:
- rel_id, from_gsid, to_gsid, rel_type.
- valid_from_version, valid_to_version (only where it matters).
- established_by (impact_id | reconciliation_decision_id | manual_governance), state (ACTIVE | ENDED), note.

| Type | Meaning | Kind |
|---|---|---|
| REFERENCES | Screen or packet references another screen | Functional |
| NAVIGATES_TO | One screen navigates to another | Functional |
| DEPENDS_ON | Functionality depends on another screen | Functional |
| VARIANT_OF | A variant of another logical screen | Structural |
| RELATED_TO | General governed relationship | Functional |
| REPLACES | Replaces another screen | Lineage |
| SPLIT_FROM | Created by a split | Lineage (paired with a SPLIT ledger impact) |
| MERGED_FROM | Created by a merge | Lineage (paired with a MERGED ledger impact) |

**Rules:**
- Relationships are lightweight, auditable (through events) and version-aware only when valid_from/to is set.
- Relationships **never** carry impact scope, approval history or versions. That stays in the Ledger.
- Lineage relationships (REPLACES, SPLIT_FROM, MERGED_FROM) are written in the same commit as their SPLIT, MERGED or SUPERSEDED ledger impact. The Ledger records the *event*; the relationship records the resulting *structure*.
- Packet-level references are recorded as proposed_relationships on the Matrix row. For example, "MODIFIED Screen A" and "REFERENCES Screen B" are one impact plus one relationship, not two impacts.
- Non-lineage relationships can be added or ended by `screen.govern` without creating a version.

## 13. Build Packet Consumption Workflow

```text
Intake -> Identify (rows -> GSID match or CAND) -> Detect -> Matrix
  -> Auto-accept check (§14) -> Human review -> Packet approval (≠ proposer)
  -> Commit: issue GSIDs for APPROVED_NEW, write Versions, Bindings,
             Relationships, Ledger impacts, events (atomic per packet run)
  -> Identity lock (on registration) -> Traceability views
```

| Step | Automatic | Human | On reject / revise / revert |
|---|---|---|---|
| Intake | Parse and hash; refuse an identical packet + version + hash | — | — |
| Identify / Detect | Candidates created; GSID matches found | — | — |
| Matrix | Built | — | — |
| Auto-accept | Only rows passing all 10 conditions | — | A failing row → review |
| Review | — | All other rows | A rejected row → frozen as REJECTED; the candidate is discarded; no GSID used |
| Approve | — | A packet approver different from the proposer | Packet rejected → the whole Matrix is frozen REJECTED; nothing committed |
| Commit | GSIDs issued **here only** | — | Atomic; a failure rolls back the whole run |
| Revise | A new run and Matrix, compared with the previous one; unchanged rows are pre-marked carry-forward, still needing one-click confirmation | Changed rows | — |
| Revert | Compensating records (§9) | Approval required | — |

## 14. Existing vs New Detection

**Signals** (all deterministic, with configurable thresholds; no "AI decides"):
- S1 exact alias.
- S2 exact route (current or ended).
- S3 Figma key or node.
- S4 name/slug similarity ≥ threshold.
- S5 module.
- S6 requirement overlap.
- S7 purpose similarity.
- S8 primary-action overlap.
- S9 shared components.
- S10 equal structure signature.

| Class | Evidence | Confidence | Automatic | Review | Can create a screen | Can create a version |
|---|---|---|---|---|---|---|
| EXACT | S1 plus at least one of S2/S3/S5, with no contradiction | High | Link to the GSID; auto-accept only under the 10-condition rule | Required unless auto-accepted | No | Yes, after review |
| STRONG | S2+S4, S3+S4, or S1 with a contradicting module | Med-high | Suggest a link | Required | No | Yes, after review |
| POSSIBLE | Two or more of S4 and S6–S10, without S1/S2/S3 | Low | Show candidates | Required | Only after candidates are rejected → APPROVED_NEW | Only if linked |
| NONE | Nothing above threshold | — | Propose NEW (CAND) | Required | Yes, at commit | v1 only |
| CONFLICT | S1 hits an UNRESOLVED_SHARED, ENDED or retired alias, or one bound to 2+ GSIDs; S2 hits a route active on another GSID; the packet declares NEW for a BOUND alias | — | Hard block on the row | Must resolve | No | No |

**Auto-accept is allowed only when ALL ten conditions hold:**
1. Exact alias match.
2. No conflicting signal.
3. No route conflict.
4. No ownership conflict.
5. No open conflict on the screen.
6. The screen is not retired.
7. The packet does not declare it NEW.
8. No definition change is detected.
9. The impact is REFERENCED.
10. The scope is NO_UI_IMPACT.

In every other case the row needs review.

```text
target row
 |- S1 hit?
 |   |- alias UNRESOLVED/ENDED/retired/multi-bound, or packet says NEW -> CONFLICT
 |   |- corroborated & no contradiction -> EXACT
 |   '- else -> STRONG
 |- no S1: (S2|S3)+S4 -> STRONG ; route active elsewhere -> CONFLICT
 |- >=2 weak signals -> POSSIBLE
 '- none -> NONE (CAND, propose NEW)
EXACT: all 10 conditions? -> AUTO-ACCEPT (REFERENCED) : NEEDS REVIEW
```

## 15. Governance and Locking Lifecycle

There are four independent state dimensions, and no state overlaps another. **Candidates are outside this lifecycle** (§6).

- **Identity state (GSID):** ACTIVE → RETIRED. It begins at approved registration; there is no reserved or burned GSID state. Retired GSIDs stay reserved forever.
- **Governance state:** REGISTERED → GOVERNED.
  - REGISTERED: identity lock applied automatically.
  - GOVERNED: the owner has confirmed; definition changes are approved only through impacts.
  - A screen stays GOVERNED across versions. **MODIFIED is an impact type, not a state.**
- **Version state:** CURRENT | SUPERSEDED | REVERTED_FROM.
- **Conflict overlay:** NONE | OPEN | RESOLVED. OPEN blocks lock changes, merge, retire, re-bind and NEW-over.

**Mechanisms:**

| Mechanism | Takes effect | Controls | Does not control |
|---|---|---|---|
| GSID issuance | At the approved commit | Permanent, never-reused ID | — |
| Identity lock | At registration | GSID, primary display alias, bindings (changes only by approved re-bind) | The definition |
| Definition governance | At GOVERNED | Which definition is the approved one | **The physical ability to edit code, routes, styling, metadata or Figma** |

**Governance versus implementation.** Developers, Lovable and designers can still edit source code and Figma. Governance decides whether that change is the *approved* state:

```text
Physical change (code / route / metadata / Figma)
  -> Drift scanner compares with the governed version
  -> OUT_OF_BAND_CHANGE (governed version NOT updated)
  -> Governance decision (§16)
```

**Transitions:**

| Transition | Trigger | Actor | Approval | Version | Audit event |
|---|---|---|---|---|---|
| CAND APPROVED_NEW → REGISTERED | Packet or reconciliation commit | Approver | Yes | v1 | registered, locked |
| REGISTERED → GOVERNED | Owner confirms | Owner / governor | Yes | — | governed |
| GOVERNED → GOVERNED (new version) | Approved impact | Approver | Yes | vN+1 | versioned |
| → RETIRED | Approved RETIRED or MERGED | Governance admin | Yes (elevated) | — | retired / superseded |
| Conflict OPEN → RESOLVED | Detection → decision | System → reconciler | Yes | — | conflict_raised / resolved |

## 16. Out-of-Band Change Governance

**Detectors:**
- Figma signature drift.
- `src/routes` added, removed or renamed without a matching governed route.
- Changes in `screens.ts`, `governed/*`, registers or `m08/registry.ts` that differ from the current version.
- Direct UI or code edits (including Lovable-generated ones), caught by the code and signature scanners.

**What each detection does:**
- Writes an **OUT_OF_BAND_CHANGE** ledger record with the evidence.
- Raises a warning.
- **Never** updates the governed version.
- **Never** blocks the physical edit itself.

**Outcomes** (owner or governor proposes; a different approver confirms):

| Outcome | Effect |
|---|---|
| Adopt as governed change | OUT_OF_BAND_ADOPTED + new version |
| Reject as unauthorized | Recorded; a restore task opens |
| Associate with an existing packet | Added as a late Matrix row → normal review |
| Create a corrective packet / impact | New packet run pre-filled with the drift |
| Restore the governed state | Task closes when the scanner reports no drift |

## 17. Audit / Event Architecture

All events go through `public.m00_emit`. No second audit system is created.

- **Name pattern:** `abox.gov.<aggregate>.<verb>.v1`.
  - `screen`: registered, locked, governed, versioned, retired, superseded, split, merged, alias_added, alias_rebound, relationship_added, relationship_ended, conflict_raised, conflict_resolved, oob_detected, oob_resolved.
  - `packet_run`: ingested, matrix_built, row_decided, approved, rejected, withdrawn, reverted.
  - `reconciliation_run`: started, issue_raised, issue_decided, set_approved.
- **Candidates:** candidate events are not written to `m00.audit_event`; candidate history lives in staging. Only decisions that produce registry effects are audited. This keeps the audit log for permanent facts.
- **Aggregates:**
  - `screen` → GSID.
  - `packet_run` → run ID.
  - `reconciliation_run` → run ID.
- **Correlation:** packet run or reconciliation run.
- **Actor:** `p_actor`.
- **Payload:** `{packet_id, packet_version, impact_id, matrix_row_id, cand_id, gsid, alias_value, version_no, previous_version_no, before_ref, after_ref, scope[], rel_type, causation_id}`. Before and after are carried as version references; only small diffs go inline.
- **Causation:** stored in the payload by default. Adding a column to `m00.outbox_event` is a deferred decision.
- **Rebuilding history:** Ledger + Versions + Relationships, ordered by time. `m00.audit_event.payload_hash` is the independent tamper-evident copy.

## 18. Existing Registry Reconciliation

| Source | Transitional authority | Enters Phase 0 as |
|---|---|---|
| M04/M05/M06 Screen_Register | Module screen spec (ID, name, route, roles, purpose, owning module) | Inventory records + SCR_MODULE aliases |
| M00 Screen_Register | ID, name, workspace, requirement_ids (no routes) | Inventory + SCR_LEGACY aliases; MISSING_ROUTE issues |
| `governed/*.index.ts` | Packet approval status | Cross-check |
| `screens.ts` | Runtime display metadata | UX / SCR_LEGACY aliases |
| `m08/registry.ts` | M08 screen metadata | M08 aliases |
| Figma tokens | Nodes, signatures, prototype links | FIGMA aliases + fingerprints |
| `nav-config.ts`, `src/routes` | Live routes | ROUTE aliases |
| `m00-foundation.ts` | None (sample data) | COUNT_DISCREPANCY evidence only |

**Never overwritten, and never marked for generation, in this architecture:**
- Any source file.
- Figma pages B0–B10, prototype links and Phase 59 manifests.
- Routes.
- Change logs.

## 19. Phase 0 Reconciliation Design

**Nature:**
- Read-only against every source.
- Non-destructive, non-authoritative and staging-only.
- Candidate-based.
- Fully discardable.

**Phase 0 must not:**
- Issue GSIDs.
- Change IDs, routes, Figma, packet JSON, `screens.ts` or `m08/registry.ts`.
- Establish authoritative ownership or final screen boundaries without a human decision.
- Silently merge, split or resolve shared aliases.

```text
Extract -> Normalize -> Source Inventory -> Build Candidates (CAND-*)
  -> Alias Inventory -> Cross-match -> Issues -> Human decisions
  -> Approved Reconciliation Set (frozen, hashed) -> [Phase 1 registration issues GSIDs]
```

**Phase 0 produces:**
1. **Source Inventory:** per record — source, source_ref, existing ID, route, name, purpose, module, requirements, Figma references, signatures, and a file hash.
2. **Candidate Screen Records** (`CAND-*`): possible groupings, for example `CAND-000001 {SCR-M06-014, /plans, figma node …}`. They are not authoritative.
3. **Alias Inventory:** every identifier and route, with kind and source.
4. **Cross-Match Results:** EXACT / STRONG / POSSIBLE / NONE / CONFLICT per candidate pair and per alias.
5. **Reconciliation Issues:**
   - SHARED_ALIAS, BOUNDARY_DECISION, POSSIBLE_DUPLICATE
   - MISSING_ROUTE, ROUTE_DISCREPANCY, ORPHAN_ROUTE
   - COUNT_DISCREPANCY
   - MISSING_OWNER, MISSING_PURPOSE
   - CONFLICTING_METADATA
   - FIGMA_MISMATCH
6. **Human Reconciliation Decisions**, covering:
   - One screen or several.
   - Variant or separate screen.
   - Duplicate or legitimately distinct.
   - Alias ownership and route ownership.
   - Candidate relationships (including VARIANT_OF and REPLACES).
7. **Approved Reconciliation Set:** the only input to Phase 1. GSIDs are issued when this set goes through registration.

**Exit criteria:** every issue is decided or explicitly deferred with a reason; the counts balance per source; and you have signed off.

## 20. Duplicate Detection and Enforcement

| Rule | Level (final) |
|---|---|
| GSID reuse | Hard block |
| Alias bound to more than one governed GSID | Hard block |
| Retired identity reused | Hard block |
| Unresolved identity conflict affecting an action | Hard block |
| Packet declares NEW for an existing governed screen | Hard block |
| Duplicate active route where uniqueness applies | Hard block (Review during Phases 1–5) |
| Likely duplicate, module ownership conflict, Figma identity conflict, route or boundary ambiguity | Review |
| Missing metadata, incomplete legacy data, out-of-band drift, stale proposal | Warning |

Registry-internal integrity rules are hard blocks from Phase 1. Rules about repository and code content follow Report → Warn → Review → Block (§26).

## 21. Governance UI / UX

All of this sits under the JET admin workspace.

- **Registry list:** display ID, name, module, routes, governance state, lock, version, owner, last impacted by, last updated, and conflict / drift / unresolved-alias indicators. Search works across any alias.
- **Screen detail:**
  - Identity: GSID, aliases with binding history, originating candidates.
  - Definition, Governance, Conflicts.
  - Relationships graph.
  - Figma fingerprint, Requirements, Routes.
- **Version history** with scope chips and a diff between any two versions.
- **Impact history:** all Ledger events, including OOB and reverted ones.
- **Packet impact review (Matrix):**
  - Buckets: Impacted, Referenced, New (CAND), Conflicts (blocking), Possible duplicates, Needs review.
  - Auto-accepted rows show which conditions passed.
  - Row actions: approve, reject, reclassify, link-to-GSID, merge-candidates, mark-variant, defer.
  - Proposed relationships are shown on each row.
  - "Approve packet" is disabled while blocking rows remain, and for the proposer.
- **New screen registration:** confirm the CAND's name, module, routes and display alias, and see the nearest matches. The GSID is shown only after the commit.
- **Phase 0 workspace:** issue queue, source-by-source evidence, boundary-decision picker, candidate merge / variant tools.
- **Drift inbox:** OOB records and the five outcomes.

## 22. Packet → Screen Traceability

The header shows packet, version, module, ingested and approved dates, approver, and counts per bucket.

```text
M07 BP v1.0  approved 2026-10-02 by J.Doe
  GS-000123 SCR-M06-014 Agent Roster     MODIFIED    v3->v4 [Behavior][Data][Validation] REQ-M07-031 approved
      relationship: REFERENCES GS-000130
  GS-000130 SCR-M06-017 Agent Detail     REFERENCED  v1     [No UI]  REQ-M07-044 auto (10/10 conditions)
  GS-000200 SCR-M07-001 Commission Setup NEW         v1     [all]    REQ-M07-050 approved (from CAND-000501)
  CAND-000503 (rejected)                  —           —      reason: duplicate of GS-000140  (no GSID consumed)
```

## 23. Screen → Packet Traceability

The header shows display ID, GSID, aliases, state, lock, current version, owner and originating candidates.

```text
SCR-M06-014 (GS-000123) GOVERNED locked v4
  v1 NEW       M06 BP v1.0 (Phase 0 set RS-001)  [all]
  v2 MODIFIED  M07 BP v0.9  [Content]
  -- OOB       Figma drift 2026-10-10 -> associated with M07 BP v1.0
  v3 MODIFIED  M07 BP v1.0  [Behavior][Data][Validation]  REQ-M07-031  approved J.Doe
  v4 MODIFIED  M09 BP v1.2  [Navigation]  /agents -> /network/agents
```

## 24. Screen → Screen Relationship Traceability

```text
GS-000123 SCR-M06-014 Agent Roster
  NAVIGATES_TO -> GS-000130 Agent Detail        (since v1)
  DEPENDS_ON   -> GS-000150 Group Management    (since v3, via M07 BP v1.0)
  VARIANT_OF   <- GS-000124 Roster (bulk mode)
  Lineage: SPLIT_FROM GS-000090 (M06 BP v1.0, impact IMP-...)
```

Filters: relationship type, active/ended, and lineage only. Lineage entries link to their SPLIT, MERGED or SUPERSEDED ledger event.

## 25. Figma Integration

- **Identity:** never taken from Figma. FIGMA_KEY and FIGMA_NODE are only alias kinds.
- **Detection:** S3 and S10 are supporting signals.
- **Versioning:** a Figma change is evidence only.
- **Drift:** an unapproved change becomes OUT_OF_BAND_CHANGE.
- **Audit:** a fingerprint (key, node, source, structure and binding signatures, prototype count) is stored per version.
- **Preserved unchanged:** the extractor, plugin, B0–B10, the 682 links and Phase 59 behavior. The registry only reads the token files.

## 26. Governance Report / CI

The new analyzers in `scripts/governance-report.mjs` read a registry export plus the sources.

| Check | Report | Warn | Review | Block (Phase 6+) |
|---|---|---|---|---|
| Duplicate alias across sources | P1 | — | — | Yes |
| Route with no registered screen | P1 | P3 | P4 | New routes only |
| Retired ID in code or registers | P1 | — | — | Yes |
| Source differs from the governed version (drift) | P1 | P5 | P5 | No (drift workflow) |
| Open conflicts / unresolved shared aliases | P1 | — | — | Release gate |
| Unresolved Matrix rows | P3 | P4 | — | Release gate |
| Missing governance metadata | P1 | P2 | — | No |

## 27. Security and Separation of Duties

Built on `m00.role_template` / `permission_definition` / `role_assignment`. These permission codes are proposed; none are created now.

| Capability | Permission | Who | Elevated |
|---|---|---|---|
| View | `screen.read` | Internal users | No |
| Propose / ingest a packet | `screen.propose` | Module leads | No |
| Review Matrix rows | `screen.review` | Module leads, designers | No |
| Approve impacts / packet / registration | `screen.approve` | Module owner | Yes |
| Govern (confirm, metadata, aliases, non-lineage relationships) | `screen.govern` | Governance team | Yes |
| Retire / merge / split / re-bind / lineage | `screen.govern.admin` | Governance admin | Yes |
| Reconcile legacy conflicts (Phase 0) | `screen.reconcile` | Governance admin | Yes |
| Override a hard block | `screen.override` | `JET_PLATFORM_ADMIN` only, with a reason | Yes |

**Separation of duties:**
- Proposer ≠ approver, per packet run and per reconciliation set.
- For out-of-band changes, whoever adopts ≠ whoever approves.
- An override is the only exception. It is audited and needs acknowledgement from a second admin.

## 28. Migration / Implementation Phases

| Phase | Scope | GSIDs? | Rollback | Exit |
|---|---|---|---|---|
| 0 Reconcile | Staging, candidates, issues, decisions, approved set | **No** | Discard staging | Approved reconciliation set signed off |
| 1 Registry | Screen / Alias / Binding / Version / Relationship tables; register the approved set; read-only views | **Issued here** (registration) | Drop the new tables; sources untouched | Every alias resolves; counts match |
| 2 Identity governance | Lock, lifecycle, events, UNRESOLVED_SHARED handling | — | Event-based unlock | Reuse and conflict blocks proven |
| 3 Ledger | Ledger + seed NEW impacts from registration and packet document_control | — | Compensating rows | Screen→Packet complete |
| 4 Matrix + workflow | Intake, detection, candidates, Matrix, auto-accept rule, commit, revise / revert | At commit | Reject the run | One real packet end to end |
| 5 Drift + Figma | Scanners, fingerprints, OOB outcomes | — | Disable the scanners | Drift appears as warnings only |
| 6 Enforcement | Analyzers → gates; per-source dependency analysis for the deferred authority decision | — | Gate back to report | Zero open conflicts; gates green |

## 29. Edge Cases

| Case | Behavior |
|---|---|
| One ID, many routes | SHARED_ALIAS / BOUNDARY_DECISION; UNRESOLVED_SHARED until decided |
| Route change | MODIFIED [Navigation]; the old ROUTE binding ends |
| Rename | MODIFIED [Content] |
| Split | SPLIT impact + SPLIT_FROM relationships; new GSIDs issued at commit |
| Merge | MERGED impact + MERGED_FROM; the survivor keeps its GSID; the others are retired; aliases re-bound |
| Candidates found to be the same screen before registration | MERGE_CANDIDATES; one GSID at commit; nothing burned |
| Referenced with no change | Auto only under the 10 conditions; otherwise review |
| New screen resembling an existing one | POSSIBLE / STRONG → review |
| Several packets on one screen | Versions in approval order; a stale base version → rebase review |
| Packet revision | New Matrix with a comparison; carry-forward confirmation |
| Rejected or withdrawn | Matrix frozen; no Ledger impact; no GSID |
| Revert | Compensating records; restoring version |
| Retired screen referenced | CONFLICT; reinstatement needs elevated permission |
| Ownership conflict | Review |
| Code, Figma, Lovable or metadata change outside the workflow | OUT_OF_BAND_CHANGE; the edit itself is not blocked |
| Screen A modified and referencing Screen B | One impact on A + a REFERENCES relationship to B |

## 30. Risks and Trade-offs

| Risk | Mitigation | Alternative |
|---|---|---|
| GSIDs used up by abandoned proposals | Candidate IDs; GSID issued at commit only | Reserve at proposal (rejected) |
| Breaking Figma / prototypes | Registry reads Figma only; aliases keep keys | Renaming (rejected) |
| Permanent duplication of governance facts | Registry owns governance facts; sources are validated against it | Pre-commit to generating sources (deferred) |
| Automation resolving ambiguity | Strict 10-condition auto-accept; conflicts always block | Broad auto-accept (rejected) |
| Confusing impacts with relationships | Separate models; lineage paired explicitly | A single ledger (rejected) |
| Governance seen as an edit lock | Explicit drift model; physical edits allowed | Code-level locks (rejected) |
| Too many versions | Scope-based version rules | A version per impact |
| Audit growth | Candidates stay out of audit; reference-based payloads | Full snapshots |
| Poor legacy data | Phase 0 issue queue | Auto-clean (rejected) |
| Migration complexity | Seven reversible phases | Big-bang |

## 31. Final Decisions Required Before Implementation

**A. Architecture decisions — finalized by approving this document**

| # | Decision | Final choice |
|---|---|---|
| F1 | Canonical identity | GSID + existing IDs as immutable aliases with time-bounded bindings |
| F2 | Candidate vs permanent identity | CAND-* temporary; GSID issued only at approved registration or commit |
| F3 | Registry storage | Database (Lovable Cloud), reusing `m00_emit` |
| F4 | Registry authority | Identity, GSID, aliases, governance state, ownership, lifecycle, lineage, current version, packet lineage, impact history, identity lock, relationships |
| F5 | Matrix vs Ledger vs Scope | Matrix row = proposed relationship; Ledger impact = approved event; Scope = its dimensions; one impact holds several scopes |
| F6 | Auto-accept | Only EXACT + REFERENCED + NO_UI_IMPACT + all 10 conditions |
| F7 | Identity lock timing | Automatic at registration; the definition stays governable through versions |
| F8 | Governance vs implementation | Governance controls the approved state; physical edits are detected as drift, never blocked |
| F9 | Relationship model | Lightweight ScreenRelationship, separate from the Ledger; lineage paired with SPLIT / MERGED / SUPERSEDED impacts |
| F10 | Version rules | As in §8; Data and Permission changes create a version only when the definition changes |
| F11 | Separation of duties | Proposer ≠ approver; OOB adopter ≠ approver; audited override by platform admin |
| F12 | Enforcement | Registry integrity blocks from Phase 1; repository and code checks go Report → Warn → Review → Block, with gates in Phase 6 |

**B. Implementation decisions — deliberately deferred to Phase 0/1 or later**

| # | Decision | Deferred to | Default until decided |
|---|---|---|---|
| I1 | For each source (`screens.ts`, `m08/registry.ts`, governed indexes, registers): generate, sync, validate, keep independent, or retire | After Phase 1 dependency analysis | Validate against the registry |
| I2 | Causation column on `m00.outbox_event` vs payload field | Phase 2 | Payload field |
| I3 | Matching thresholds (S4 / S7 / S10) | Phase 0 calibration | Conservative (bias toward review) |
| I4 | Staging storage form (database schema vs files) | Phase 0 plan | Database staging schema |
| I5 | Drift scanner cadence (manual, scheduled, on build) | Phase 5 | Manual |
| I6 | Stale-proposal threshold N days | Phase 4 | 14 days |

**C. Business / semantic decisions — for human reconciliation in Phase 0**

| # | Decision |
|---|---|
| S1 | `SCR_AGENCY_SETUP` (`/app/agency`, `/app/agency/entities`): one screen with several routes, several screens, or variants |
| S2 | `UX-009` (`/plans`, `plans#filters`, `plans#edit-quote`): one screen, variants, or separate screens |
| S3 | M06 route authority: `CONF-M06-002` change log vs `m06.json` |
| S4 | M00: map the 34 routeless screens to live routes, and explain the 52 vs 34 count |
| S5 | Cross-registry matches (e.g. `screens.ts` entries vs packet SCR-M0x-### entries) |
| S6 | Ownership for screens with no or conflicting owning module |
| S7 | Any additional shared aliases or duplicates Phase 0 discovers |

---

## Architecture Approval Gate

Phase 0 can begin only after you approve all of the following:

1. **Finalized architecture decisions F1–F12** (section A), as written.
2. **The Phase 0 boundary** (§19): read-only, candidate-based, non-authoritative, discardable, issuing no GSIDs, and with no changes to any existing artifact.
3. **The deferred implementation defaults** I1–I6 (section B) as interim defaults, to be revisited at their named phase.
4. **The semantic decisions S1–S7** are to be made in the Phase 0 reconciliation workspace, and none are decided by this document.
5. **A separate Phase 0 implementation plan**, to be presented and approved before any Phase 0 work starts.

This document does not recommend starting implementation.
