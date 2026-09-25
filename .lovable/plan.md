# Screen Governance and Screen-Level Traceability — Architecture and Design

Design only. Approving this plan approves the architecture, not implementation. It creates no code, tables, migrations, UI or ID changes. Each implementation phase below will get its own plan for approval.

---

## 1. Executive Summary

ABox gets a new, **additive governance layer** that wraps the existing screen sources without replacing them:

- A **Canonical Screen Registry**: one row per logical screen.
- An **append-only Screen Impact Ledger**: every packet × screen decision.
- **Screen Versions**: each approved change gives the same screen a new version.
- A **governed Build Packet consumption workflow** that ends in human approval.

Every existing ID (UX-###, SCR_*, SCR-M0x-###, Figma keys) is kept exactly as it is and registered as an **alias** of an internal Governance ID (recommended Option B). History is written through the existing `m00_emit` → `m00.audit_event` / `m00.outbox_event` plumbing, so no new audit system is needed. Figma signatures act as evidence, never as identity. Enforcement arrives gradually: report-only first, CI gates last.

## 2. Current-State Constraints

Confirmed by the two assessments and a fresh read:

- **Four separate ID spaces:**
  - `src/lib/screens.ts` (`SCREENS`, UX-### and SCR_*).
  - `src/lib/governed/*.index.ts` together with `public/registers/m0x.json` → `Screen_Register` (M04 36, M05 30, M06 35, all SCR-M0x-###; M00 34, SCR_* format, every route empty).
  - `src/lib/m08/registry.ts` (SCR-M08-###).
  - Figma `tokens-b9.js` / `tokens-current-app.js` (keys like `current:route:/plans`, plus signatures).
- **Shared IDs exist today:**
  - `SCR_AGENCY_SETUP` is used by `/app/agency` and `/app/agency/entities` (`nav-config.ts:120,166`).
  - `UX-009` is used by `/plans`, plus the Figma states `plans#filters` and `plans#edit-quote`.
- **Conflicting source data:**
  - `m00-foundation.ts` reports 52 M00 screens; the M00 register has 34.
  - The M06 change log (`CONF-M06-002`) says routes are empty; `m06.json` has routes on all 35 rows.
- **Delta and impact registers** track changes at module and requirement level only. They never name a screen.
- **Reusable infrastructure:**
  - `m00.audit_event`, `m00.outbox_event` and `public.m00_emit(...)`.
  - `lucie_m05.event_outbox` (aggregate_version, causation_id).
  - `m00.role_template`, `permission_definition`, `role_assignment`; `m00.is_platform_admin()`.
- **Figma protection:** B0–B10 frames, 682 prototype links and the Phase 59 import must keep working. They are keyed off today's IDs and routes.
- `scripts/governance-report.mjs` runs by hand only, is report-only, and does not read screen registers.

## 3. Design Principles

1. **Additive:** the registry references existing sources and never rewrites them.
2. **Identity is permanent:** once issued, an ID is never renamed, reused or deleted.
3. **Identity is separate from definition:** locking the ID does not freeze the screen's content.
4. **Append-only history:** ledger rows and versions are never updated in place; corrections are new rows.
5. **Evidence, not identity:** routes, names and signatures are only matching signals.
6. **A person decides ambiguity:** the system never merges, splits or resolves a conflict silently.
7. **Reuse audit plumbing:** one event bus, one audit table.
8. **Gradual enforcement:** report → warn → block.

## 4. Target Architecture

```text
 Build Packet (document_control + Screen_Register + Delta registers)
        |
        v
 [Intake & Parse] -> Packet Record (packet_id, version, module, hash)
        |
        v
 [Screen Identification] -> Candidate list (one per packet screen row)
        |
        v
 [Detection Engine] -- reads --> Canonical Registry + Aliases + Figma signatures
        |   classification: EXACT / STRONG / POSSIBLE / NONE / CONFLICT
        v
 [Impact Proposal] -> Proposed Ledger rows (NEW / MODIFIED / REFERENCED / RETIRED ...)
        |
        v
 [Human Review UI] -- approve / reject / reclassify / link
        |
        v
 [Commit]  -> Registry row (new) or Screen Version (existing)
           -> Ledger rows marked APPROVED / REJECTED
           -> m00_emit(...) -> m00.audit_event + m00.outbox_event
        |
        v
 [Traceability Views]  Packet -> Screens   |   Screen -> Packets
        ^
        |  (report-only, later CI) governance-report screen analyzers
```

## 5. Canonical Screen Registry Design

### Option A vs Option B

| | A: existing ID is the canonical ID | B: internal Governance ID + existing IDs as aliases |
|---|---|---|
| Multiple formats | 4 formats become "canonical" side by side | One format internally; all 4 kept as aliases |
| Shared IDs (SCR_AGENCY_SETUP) | Cannot be split without renaming | Resolved by attaching aliases to one or more Governance IDs |
| M00 SCR_* vs SCR-M0x | Mixed forever | Kept as aliases; no rename |
| Screens with no ID yet (new, or Figma-only) | Must invent an ID in some legacy format | Issued a Governance ID at once |
| Risk to Figma / routes | None | None; aliases preserve every lookup |
| Complexity | Lower | One lookup table more |

**Recommendation: Option B.**

- **The problem it solves:** today's IDs are neither unique (shared IDs) nor in a single format, and some screens exist only in Figma. A neutral internal ID (`GSID`, e.g. `GS-000123`, issued in sequence and never reused) lets ABox govern all of them without renaming anything.
- **Display rule:** users keep seeing their familiar ID. Each screen has one alias marked **primary display ID** (e.g. `SCR-M06-014`), so the GSID stays mostly invisible.

### Registry entity (conceptual)

| Group | Fields |
|---|---|
| **Identity** | gsid, primary_display_id, name, slug, owning_module, created_at, created_by, created_by_packet, retired_at, superseded_by_gsid[] |
| **Aliases** (child) | alias_value, alias_kind (UX / SCR_LEGACY / SCR_MODULE / M08 / FIGMA_KEY / FIGMA_NODE / ROUTE), source_system, is_primary, valid_from, valid_to |
| **Governance** | governance_state, id_locked (bool), id_locked_at/by, owner (role/team), steward, open_conflicts_count |
| **Current definition** (points to version) | current_version_no, route(s), purpose, roles, permissions, primary_actions, requirement_ids[], current_source_artifact |
| **Technical fingerprint** (per version) | figma_key, figma_node_id, source_signature, structure_signature, binding_signature, captured_at |
| **Audit summary** (derived) | last_modified_at, last_modified_by, last_modified_by_packet |

Routes live on the version, as a list, because one screen can have several routes and routes can change.

## 6. Screen Identity and ID Governance

| Topic | Rule |
|---|---|
| Persistent / immutable | A GSID is permanent from issue. Aliases can be added, or ended with `valid_to`, but never deleted. |
| Locking | `id_locked=true` freezes the GSID, primary display ID and alias bindings. Content still changes through versions. |
| No reuse | Issued GSIDs and every alias value ever used are reserved forever, retired ones included. Reusing one is a hard block. |
| Legacy formats | UX-###, SCR_*, SCR-M0x-###, SCR-M08-### and Figma keys are imported unchanged as aliases with their `alias_kind`. |
| Shared IDs | Imported as **UNRESOLVED_SHARED** conflicts. A reviewer chooses one of: (a) one logical screen with several routes, (b) separate screens, where the shared legacy ID stays on one and the others get new GSIDs with the old ID as a secondary alias, or (c) a variant/state of a parent screen (for example `plans#filters`). |
| Route change | New version with the new route; the old route stays as an ended ROUTE alias for redirect and trace purposes. |
| Rename | New version; GSID and display ID unchanged. |
| Duplicate | Detected at intake (§9); resolved by link or reject, never auto-merged. |
| Split | The original stays (or is retired). New screens get GSIDs with `split_from` lineage; ledger type SPLIT. |
| Merge | The surviving GSID continues. The others are retired with `superseded_by`; their aliases move to the survivor with an end date recorded; ledger type MERGED. |
| Retire | State RETIRED. The ID stays reserved and history stays readable. |

**The two known shared IDs are not decided here.** They go into the Phase 0 conflict queue for your decision.

## 7. Screen Impact / Traceability Ledger

An append-only entity called **ScreenImpact**. Its fields:

- impact_id, gsid (or proposed_gsid), packet_id, packet_version, module
- impact_type, description, requirement_refs[], source_artifact (register + row id)
- previous_version_no, resulting_version_no
- detection_class, detection_evidence (json)
- before_snapshot, after_snapshot (json diff of the definition)
- proposed_by, proposed_at, approval_state (PROPOSED / APPROVED / REJECTED / WITHDRAWN / REVERTED), approved_by, approved_at, decision_note
- correlation_id (the packet run), causation_id (the triggering impact)

**Impact types:**
- Required: NEW, MODIFIED, REFERENCED (unchanged), RETIRED, SUPERSEDED.
- Also recommended:
  - SPLIT / MERGED, for lineage.
  - ROUTE_CHANGED, as a subtype of MODIFIED for quick filtering.
  - ALIAS_ADDED, for reconciliation, no content change.
  - REVERTED, a compensating row.
  - OUT_OF_BAND_CHANGE, a change detected with no packet behind it.

Rows are never edited. A correction is a new row whose causation points at the earlier one.

## 8. Build Packet Consumption Workflow

| Step | System does | Output | Automatic | Human | Reject / Revise / Revert |
|---|---|---|---|---|---|
| 1 Intake | Parse `document_control`, Screen_Register, delta and impact registers; hash the file | Packet record (id, version, module, hash) | Yes | none | A duplicate hash with the same version is refused |
| 2 Identify | One candidate per packet screen row, plus screens named in `affected_artifacts` | Candidate list | Yes | none | — |
| 3 Existing/New | Detection engine (§9) | Classification + evidence per candidate | Yes | none | — |
| 4 Impact proposal | Infer type: exact match with a changed definition → MODIFIED; unchanged → REFERENCED; no match → NEW; delta says remove → RETIRED | Ledger rows in PROPOSED state | Yes | none | — |
| 5 Review | Reviewer sees grouped buckets (§13) | Decisions | — | **Required** for NEW, POSSIBLE, CONFLICT, RETIRED, SPLIT/MERGE. Can be skipped for EXACT+REFERENCED | A rejected row becomes REJECTED (kept, with reason); the packet continues |
| 6 Approve | The packet approver signs the whole packet run | Approval record | — | **Required** | Rejecting the whole packet makes every row REJECTED; the registry is untouched |
| 7 Commit | Create GSIDs for NEW, versions for MODIFIED, state changes for RETIRED; emit events | Registry and version rows, events | Yes (after approval) | none | — |
| 8 Lock | Newly registered screens enter REGISTERED and become LOCKED when their owner confirms (or automatically, per the decision in §24) | Lock event | Configurable | Optional | — |
| 9 Trace | Views refresh from the ledger | — | Yes | none | — |

- **Revised packet** (same packet_id, higher version): the workflow reruns, diffing against the previous run. Unchanged approved rows carry forward as REFERENCED-to-prior-decision; changed rows need fresh review. Earlier rows are kept.
- **Reverted packet:** each approved row gets a compensating REVERTED row. MODIFIED screens get a *new* version restoring the prior definition (history is never deleted). NEW screens become RETIRED, and their GSIDs stay reserved.

## 9. Existing vs New Screen Detection

**Signals, from strongest to weakest:**
1. Exact alias match (any ID format).
2. Exact route match (current or ended).
3. Figma key or node ID match.
4. Slug or name similarity.
5. Owning-module match.
6. Overlap in requirement IDs.
7. Structure-signature similarity.
8. Purpose and primary-action text similarity.
9. Shared components or routes.

| Class | Rule (examples) | Action |
|---|---|---|
| **EXACT** | Alias match **and** (route or module agrees), with no contradicting signal | Auto-accept the link. REFERENCED needs no review; MODIFIED goes to review. |
| **STRONG** | Route + name/slug match, or alias match with a different module | Warn and require review (one click) |
| **POSSIBLE** | Only weak signals: name similarity, requirement overlap, similar structure | Require review |
| **NONE** | No signal above threshold | Propose NEW; review required |
| **CONFLICT** | Alias maps to two or more GSIDs; route owned by another active GSID; packet declares NEW for an existing alias; reserved or retired ID reused | **Hard block** until resolved |

No single signal besides an exact alias can produce EXACT. Even an alias needs a corroborating signal, which stops a mis-typed ID from linking silently.

```text
candidate
  -> alias hit? --no--> route/figma/name signals? --none--> NEW
       |yes                    |weak--> POSSIBLE
       v                       |strong-> STRONG
  alias -> >1 GSID or reserved/retired? --yes--> CONFLICT (block)
       |no
  route/module agree? --no--> STRONG (review)
       |yes
  definition changed? --yes--> EXACT + MODIFIED (review)
                      --no---> EXACT + REFERENCED (auto)
```

## 10. Screen Versioning Model

- **Identity:** the GSID (plus aliases), permanent.
- **Version:** `ScreenVersion(gsid, version_no, definition json, routes[], requirement_ids[], fingerprint, created_by_impact_id, created_at)`. Immutable. `version_no` rises one step per screen (v1, v2, v3).
- **Governance state:** stored on the registry row and changed only by lifecycle transitions.
- **Technical signature:** attached to a version as evidence, and also captured on its own by Figma scans.

For example, `SCR-M06-014` stays `SCR-M06-014`: M06 BP v1.0 creates v1, M07 BP v1.0 creates v2, M09 BP v1.2 creates v3. The registry's `current_version_no` points at the latest approved version.

## 11. Governance and Locking Lifecycle

```text
DISCOVERED --> PROPOSED --> REGISTERED --> GOVERNED(LOCKED) --> RETIRED
     |            |              ^   |          |   ^
     |         REJECTED          |   +--(new version via approved impact)--+
     +--> CONFLICTED ------------+            SUPERSEDED (merge/split)
```

| Transition | Trigger | Actor | Approval | ID immutable? | New version? |
|---|---|---|---|---|---|
| → DISCOVERED | Reconciliation import or Figma scan | System | No | Reserved, not locked | No |
| → PROPOSED | A packet impact proposes NEW | System | No | GSID reserved | No |
| → REGISTERED | Impact approved | Packet approver | Yes | Yes (never reusable) | v1 |
| → GOVERNED (LOCKED) | Owner confirms, or auto on registration (decision) | Screen owner | Yes | Yes + aliases frozen | No |
| GOVERNED → GOVERNED | Approved MODIFIED impact | Packet approver | Yes | Unchanged | vN+1 |
| → CONFLICTED | Detection conflict | System | — | Unchanged | No |
| → RETIRED / SUPERSEDED | Approved RETIRED / MERGED impact | Governance admin | Yes (elevated) | Reserved forever | No |
| → REJECTED | Proposal rejected | Reviewer | — | GSID burned, not reused | No |

**MODIFIED is not a state.** A screen stays GOVERNED while it gains versions.

Every transition records: actor, time, packet, impact_id, correlation_id and a reason.

- **The ID lock** stops changes to identity: GSID, primary display ID and aliases.
- **Definition editability** is controlled separately. A GOVERNED screen's content can change only through an approved ledger impact, never by direct edit.

## 12. Audit / Event Architecture

**Reuse, and add no new audit tables:**
- Call `public.m00_emit(event_name, aggregate_type, aggregate_id, tenant_id, payload, audit_code, actor, correlation)`. It writes both `m00.audit_event` and `m00.outbox_event`.
- Leave `lucie_m05.event_outbox` alone; it belongs to the M05 domain.

**Events:**
- `abox.gov.screen.discovered.v1`, `.proposed.v1`, `.registered.v1`, `.locked.v1`, `.versioned.v1`
- `abox.gov.screen.alias_added.v1`, `.retired.v1`, `.superseded.v1`, `.conflict_raised.v1`, `.conflict_resolved.v1`
- `abox.gov.packet.ingested.v1`, `.impact_proposed.v1`, `.impact_decided.v1`, `.packet_approved.v1`, `.packet_reverted.v1`

**Structure:**
- aggregate_type `screen`, aggregate_id = GSID. Packet events use aggregate `build_packet`.
- Payload: `{version_no, packet_id, packet_version, module, impact_id, impact_type, before, after, causation_id}`.
- Actor = `p_actor`; correlation = the packet run ID.

**Reconstruction:** a screen's history is the ordered set of its ScreenImpact rows plus its ScreenVersion rows. The audit events are an independent tamper-evident copy (`payload_hash`). A causation ID needs a payload field because `m00.outbox_event` has no causation column. Adding a nullable column is optional; the choice is left to engineering.

## 13. Existing Registry Reconciliation and Migration

| Source | Authoritative for | Becomes |
|---|---|---|
| Packet Screen_Register (M04/M05/M06 json) | Module screen ID, name, route, roles, purpose, owning module | v1 definition + SCR_MODULE alias |
| M00 Screen_Register | Screen ID, name, workspace, requirement_ids (**not routes**) | v1 without route + SCR_LEGACY alias, flagged `MISSING_ROUTE` |
| `governed/*.index.ts` | Same IDs as the json, plus approval status | Cross-check only |
| `src/lib/screens.ts` | App display name / purpose for UX-### and SCR_* | UX / SCR_LEGACY aliases |
| `m08/registry.ts` | SCR-M08-### | M08 aliases |
| Figma tokens | Figma key, node ID, signatures, prototype links | FIGMA aliases + fingerprint |
| `nav-config.ts` routes | Current live route per nav entry | ROUTE aliases |
| `m00-foundation.ts` | Nothing (sample data) | Not imported; its 52-screen count is logged as a data-quality note |

**Conflicts become records, not guesses.** Each one is a `ReconciliationConflict(kind, sources[], values[], status, resolver, resolution)`. Kinds:
- `SHARED_ID`: SCR_AGENCY_SETUP, UX-009.
- `ROUTE_DISAGREEMENT`: the M06 change log vs json.
- `COUNT_MISMATCH`: M00 52 vs 34.
- `MISSING_ROUTE`: M00 ×34.
- `CROSS_REGISTRY_MATCH`: likely the same screen in two ID spaces.

**Always reviewed by a person:** every conflict kind, and every cross-registry link.

**Never overwritten automatically:**
- The source files: registers, `screens.ts`, governed indexes, M08 and Figma tokens. They stay read-only inputs.
- Figma prototype links and the B0–B10 pages.

## 14. Duplicate Detection and Enforcement

| Rule | Level | Why |
|---|---|---|
| Same alias bound to two or more active GSIDs | Hard block | Identity must be unique |
| Reuse of a reserved or retired ID | Hard block | No-reuse guarantee |
| Packet declares NEW for an existing alias | Hard block | Would duplicate a screen |
| Same route active on two GSIDs (not declared variants) | Human review | Could be legitimate state variants |
| Cross-registry likely match | Human review | Could be the same screen, or a coincidence |
| Owning-module conflict (packet module differs from registry owner) | Human review | Ownership is a business decision |
| Figma key maps to another GSID | Human review | Figma naming may lag |
| Missing route / purpose / owner | Warning | Data quality; doesn't threaten identity |
| Signature drift without a packet | Warning (+ OUT_OF_BAND ledger row) | Evidence of change outside the workflow |
| Unresolved PROPOSED impacts older than N days | Warning | Hygiene |

## 15. Proposed UI / UX

All screens live in a new "Screen Governance" area within the existing JET admin workspace.

- **Screen Registry:** a table with display ID, name, module, route(s), state badge, version, owner, last impacted by (packet), last updated and a conflict icon. Filters by module, state and conflicts; search by any alias.
- **Screen Detail:** tabs for Identity (GSID, aliases by kind), Definition (current version), Governance (state, lock, owner, conflicts), Figma (keys, signatures, prototype link count), Requirements, Related routes and artifacts.
- **Version History:** version, packet, module, change summary, date, actor, approver, signatures, and a diff between any two versions.
- **Impact History:** every ledger row for the screen, rejected and reverted ones included, with a filter.
- **Build Packet Impact Review:** a packet header, then buckets — Impacted, Referenced-unchanged, New, Conflicts (blocking), Possible duplicates, Needs review. Each row shows candidate, match class, evidence chips and actions (approve, reject, reclassify, link-to-existing, mark variant). A final "Approve packet" is enabled only when no blocking conflicts remain.
- **New Screen Registration:** reached from a NEW row. It confirms the name, owning module and route, shows the closest existing matches, issues a GSID and sets the primary display ID (keeping the packet's ID).
- **Actions by state:**
  - PROPOSED: approve / reject.
  - REGISTERED: lock / edit metadata / retire.
  - GOVERNED: add alias / propose retire / view.
  - CONFLICTED: resolve.
  - RETIRED: view only.

## 16. Traceability Views

**Packet → Screens.** The packet header shows id, version, module, ingested and approved dates, and approver. Then one line per screen:

```text
M07 BP v1.0
  SCR-M06-014  Agent Roster      IMPACTED   v2 -> v3  REQ-M07-031  approved J.Doe 2026-10-02
  SCR-M06-017  Agent Detail      IMPACTED   v1 -> v2  REQ-M07-044  approved J.Doe
  SCR-M04-009  Marketplace Home  REFERENCED v4        REQ-M07-002  auto
  SCR-M07-001  Commission Setup  NEW        v1        REQ-M07-050  approved J.Doe
  (rejected) SCR-M07-003 ...     NEW        —         reason: duplicate of SCR-M06-020
```

**Screen → Packets.** The screen header shows display ID, GSID, state, current version and owner. Then one line per packet:

```text
SCR-M06-014
  v1  Created by   M06 BP v1.0  M06  2026-08-31  approved A.B
  v2  Modified by  M07 BP v1.0  M07  change: +bulk action  REQ-M07-031
  v3  Modified by  M09 BP v1.2  M09  change: route /agents -> /network/agents
```

## 17. Figma Integration

- The extractor's `key`, `sourceSignature`, `structureSignature` and `bindingSignature` are recorded per version as the **fingerprint**. They are used for:
  - Detection: a supporting signal.
  - Validation: after commit, the Figma frame should exist for GOVERNED screens.
  - Version comparison: structure changes show up in the diff.
  - Change evidence and audit evidence.
- They are never used as identity.
- The Figma import path, B0–B10 and the 682 prototype links are unchanged. The registry only *reads* the tokens files.
- **Figma changes with no packet:** a scheduled or manual "Figma scan" compares signatures to the current version. Drift creates an OUT_OF_BAND_CHANGE ledger row (a warning) that the owner either adopts as a new version or flags for correction. It never changes the screen automatically.

## 18. Governance Report / CI Integration

Extend `scripts/governance-report.mjs` with new analyzers. They read the registry export plus the source files.

| Check | Phase 1–5 | Later gate |
|---|---|---|
| Duplicate alias across sources | Report | CI block |
| Duplicate active route | Report | Review-required gate |
| Screen route in `src/routes` with no GSID alias | Report | CI block for new routes only |
| Reuse of retired ID in code or registers | Report | CI block |
| Registry conflicts open | Report | Release gate |
| Missing governance metadata | Report | Warning |
| PROPOSED impacts unresolved | Report | Release gate |

Gates are introduced only after the conflict backlog is cleared, so the build is never blocked by legacy data.

## 19. Permissions and Roles

Built on the existing `m00.role_template` / `permission_definition` / `role_assignment`, with a new permission set:

| Action | Permission | Elevated? |
|---|---|---|
| View registry and history | `screen.read` | No |
| Propose a new screen / ingest packet | `screen.propose` | No |
| Review impacts (per module) | `screen.review` | No |
| Approve impact / packet | `screen.approve` | Yes (module owner) |
| Reject impact | `screen.review` | No |
| Register screen / lock ID | `screen.govern` | Yes |
| Edit governance metadata (owner, aliases) | `screen.govern` | Yes |
| Retire / merge / split | `screen.govern.admin` | Yes |
| Override a hard-block conflict | `screen.override` | Yes, platform admin only (`m00.is_platform_admin()`), with a reason |

Proposer and approver must be different people for the same packet (separation of duties).

## 20. Migration Plan and Recommended Phases

| Phase | Scope | Depends on | Data | Risk | Rollback | Exit |
|---|---|---|---|---|---|---|
| 0 Reconcile | Read-only import into a staging area; conflict list; your decisions on shared IDs, M00 routes, the M06 route source | — | None written to the registry | Low | Discard staging | Every conflict has a decision |
| 1 Registry | Registry + alias + version tables; import approved staging as DISCOVERED/REGISTERED v1; read-only UI | 0 | ~135 packet screens + screens.ts + M08 + Figma aliases | Alias mapping errors | Drop new tables; sources untouched | Counts reconcile; every alias resolves |
| 2 ID governance | Lock, reservation, no-reuse, state machine, events via `m00_emit` | 1 | Lock existing approved screens | Over-locking | Unlock via event | Reuse attempts blocked in tests |
| 3 Ledger | ScreenImpact append-only table; backfill "created by" from packet `document_control` | 2 | Seed CREATED rows | Wrong seed attribution | Compensating rows | Screen→Packet view shows origin for all |
| 4 Packet workflow | Intake, detection, review UI, commit, revise/revert | 3 | — | False matches | Reject run | One real packet processed end-to-end |
| 5 Figma evidence | Fingerprints on versions; drift scan | 4 | Attach current signatures | Noise from drift | Disable scan | Drift raises warnings only |
| 6 Enforcement | governance-report analyzers → CI gates | 5 | — | Blocking builds | Flip gates back to report | Zero open conflicts; gates green |

## 21. Edge Cases

| Case | Behavior |
|---|---|
| One ID, many routes | Reviewer picks: one screen with a routes list, variants, or a split (§6) |
| Route change | New version; old route kept as an ended alias |
| Rename | New version; ID unchanged |
| Split / merge | SPLIT / MERGED impacts with lineage; retired IDs stay reserved |
| Referenced, no UI change | REFERENCED row, no new version |
| New screen resembles an existing one | POSSIBLE / STRONG → review; link or register |
| Same screen, many packets | Versions in approval order; concurrent proposals against the same base version → the second must rebase (review) |
| Packet revision | Rerun with a diff; unchanged approvals carry forward |
| Rejected impact | Kept as REJECTED; no registry change |
| Revert | Compensating rows; restoring version; NEW → RETIRED |
| Retired screen referenced by a new packet | Hard block unless it is reinstated (elevated) |
| Ownership conflict | Review; the owning module changes only by governance admin |
| Figma / manual / out-of-workflow change | OUT_OF_BAND_CHANGE warning; owner adopts or rejects |

## 22. Risks and Mitigations

- **Breaking Figma / prototype links:** the registry is read-only toward Figma and aliases keep every key. Mitigation: never rewrite sources.
- **Registry duplicating the source files:** the registry is authoritative only for governance data; sources stay authoritative for their content until a later decision.
- **False duplicate detection:** multi-signal matching with the corroboration rule; reviewers can reclassify.
- **Too much approval:** EXACT+REFERENCED auto-passes; reviews are bundled per packet.
- **Audit growth:** events are small (with a diff, not full snapshots); snapshots live on versions only.
- **Too many versions:** a version is created only on an approved MODIFIED impact, not on signature drift.
- **Poor legacy data quality:** Phase 0 conflicts are resolved before import, and warnings are tracked.
- **Performance:** alias lookups use indexes; the registry holds under 1k screens.
- **Migration complexity:** phased delivery, each phase reversible.

## 23. Open Questions

- Which source is authoritative for M06 routes (the change log or `m06.json`)?
- Should M00's 34 routeless screens be mapped to live routes from `nav-config.ts`, or stay routeless?
- Is the 52 in `m00-foundation.ts` just stale sample data? (Recommended: yes, ignore it.)
- Should the Figma B9 state screens (`plans#filters`, `#edit-quote`) be governed as their own screens or as variants?

---

## 24. Decisions I Need to Approve Before Implementation

| Decision | Options | Recommended | Why | Consequences |
|---|---|---|---|---|
| 1. Canonical identity | A: existing IDs canonical · B: internal GSID + aliases | **B** | Handles shared IDs, mixed formats and Figma-only screens without renaming | A: shared IDs cannot be split without renames. B: one extra lookup; users still see their familiar IDs |
| 2. Shared IDs (SCR_AGENCY_SETUP, UX-009) | One screen with several routes · separate screens · variants | **SCR_AGENCY_SETUP = 2 separate screens** (Agency Home, Entities); **UX-009 = 1 screen with 2 state variants** | Different pages vs. states of one page | Separate screens: the second page gets a new GSID with the old ID kept as a secondary alias. Variants: one version history covers both |
| 3. Where the registry lives | Database (Lovable Cloud) · versioned JSON files in the repo | **Database** | Needs approvals, locking, actors and events; reuses `m00_emit` | Database: needs roles and UI. Files: simpler, but no enforceable approval or audit |
| 4. Source-of-truth after migration | Registry authoritative for governance only · registry becomes authoritative for all screen metadata | **Governance only (for now)** | Keeps packets, `screens.ts` and Figma working unchanged | Governance only: two places hold definitions until a later decision. Full: a larger refactor of the pages and extractors |
| 5. Lock timing | Automatic on registration · explicit owner lock | **Automatic on registration** | Stops reuse at once; content can still change through versions | Automatic: less control, safer. Explicit: flexible, with a window for accidental reuse |
| 6. Review burden | Review everything · auto-accept EXACT+REFERENCED only | **Auto-accept EXACT+REFERENCED** | Removes the bulk of trivial reviews | Review everything: slower, maximum control |
| 7. Enforcement timing | CI gates in Phase 1 · report-only until Phase 6 | **Report-only until Phase 6** | Legacy conflicts would otherwise block builds | Early gates: stricter, but likely blocked work |
| 8. Separation of duties | Proposer may approve · proposer ≠ approver | **Proposer ≠ approver** | Standard governance control | Same person allowed: faster, weaker audit |
| 9. M06 route authority and M00 routes | Change log vs json; map M00 from nav-config vs leave blank | **`m06.json` authoritative; map M00 routes in Phase 0 review** | The json is the newer packet artifact; nav-config has the live routes | Wrong choice → wrong routes on v1 (fixable by versioning) |
