# M06 Phase 0 — Preflight and Context Load Evidence

Module: **M06 Agency, Agent and Network Management**
Packet: `ABox_Lucie_M06_Agency_Agent_and_Network_Management_Build_Packet_v1.0`
Status: **PRODUCTION BUILD BASELINE — implementation planning authorized, production activation NOT authorized**
Recorded: 2026-08-31

## 1. Controlling release chain

`M01 baseline -> M00 -> M05 -> M04 -> M06`

Authority: `DEC-M06-001` … `DEC-M06-089` (89 approved decisions).

## 2. Source precedence (locked, highest first)

1. Approved M06 discovery decisions and revisions (`DEC-M06-*`, `M06-DISC-*`)
2. Finalized M00 v1.1, protected M01 V4, M05 v1.0, M04 v1.0 contracts
3. M06 canonical registry, OpenAPI, AsyncAPI, JSON schemas, migrations
4. Requirements, acceptance criteria, tests, traceability registers
5. Narrative documents and implementation instructions
6. AMS workbook and other reference inputs — **NON-BASELINE**

No lower-precedence artifact may expand scope, alter canonical ownership, or activate a draft prior-module delta.

## 3. Loading order executed

Certification → READ ME FIRST → Master Handoff Guide → Athina Execution Instructions → Preflight and Scope Lock → Canonical Registry → Requirements and Business Rules → UX/IA → Data/API/Event → Security/Privacy/AI → Prior Module Impact and Deltas → Implementation Task Pack → QA/Traceability → Operations and Runbooks.

## 4. Integrity verification

| Check | Result |
| --- | --- |
| SHA-256 manifest (`ABox_Lucie_M06_SHA256_Manifest_v1.0.txt`) | **279 / 279 matched, 0 mismatched, 0 missing** |
| `test_contract_counts.py` + `test_security_invariants.py` | **3 passed** |
| Package file count | 280 files, 17 controlled folders |

## 5. Reconciled counts

| Artifact | Count |
| --- | --- |
| Approved decisions | 89 |
| Capabilities | 25 |
| Requirements (FUNCTIONAL 89 / CONTROL 46) | 135 |
| Acceptance criteria | 470 |
| Tests | 675 |
| Business rules | 135 |
| API operations | 82 |
| Events | 77 |
| Objects (M06-owned 29 / owner-module projections 11) | 40 |
| Permissions | 75 |
| Role permission matrix rows | 225 |
| Roles | 4 |
| Screens | 35 |
| User flows | 18 |
| State models | 15 |
| Implementation tasks | 175 |
| Security controls | 40 |
| Compliance controls | 20 |
| Risks | 20 |
| Launch gates | 20 (all `NOT_EVIDENCED`) |
| Activation inputs | 12 (all `OPEN_ACTIVATION_INPUT`) |
| Proposed deltas | 27 (M00 12, M01 4, M04 5, M05 6) — **none approved** |

All counts reconcile with the READ ME FIRST control table and the packet's own executable count test.

## 6. Ownership boundaries asserted

| Domain | Canonical owner |
| --- | --- |
| Identity, users, roles, permissions, scoped assignment, sessions, effective access | **M00** |
| Organizations, offices, hierarchy, legal structure | **M05** |
| Marketplace routes, referral tokens, participant readiness | **M04** |
| Licenses, appointments, credentials, final selling authority | **M08** |
| Credential files | **M13** |
| Workforce profile, affiliation, business units/teams, lifecycle cases, availability/service scope, operational readiness, notes/history, M06 tasks and exceptions | **M06** |

M06 holds **projections only** for the 11 `OWNER_MODULE_PROJECTION` objects (OBJ-M06-008/009/010/034/035/036/037/038/039 and related). Projections are read models; writes route to the owning module.

## 7. Engineering invariants (fail-closed)

- Tenant or organization ambiguity → **denied**.
- Manager, title, team lead, office **do not** grant authority. Permission + scope evaluation only; never literal role-name checks.
- Active role changes create **new versions**.
- Access changes **invalidate stale access immediately**.
- Suspension is not complete until **M00 confirms access and session revocation**.
- M06 never stores raw referral tokens or credential file content.
- M06 never infers sellability without **M08**.
- Full SSN, DOB, note text, credential content, raw referral tokens never enter logs, events, or standard exports.

## 8. Conflicts raised (not silently resolved)

| ID | Conflict | Impact |
| --- | --- | --- |
| CONF-M06-001 | `10_Machine_Readable/02_Contracts/migrations/V001–V008` contain **marker-table stubs only** (`lucie_m06.<name>__marker`), not the DDL for the 29 M06-owned objects. M00 and M05 packets shipped executable DDL. | Physical schema must be authored from the Object Register + JSON schemas and reviewed under `GATE-M06-002`. Raised against `OBJ-M06-001..040`, `REQ-M06-FUN-002`, `GATE-M06-002`. **Needs confirmation that authored DDL is in scope, or that the executable DDL is a pending packet supplement.** |
| CONF-M06-002 | `Screen_Register` columns `audience`, `route`, `owning_module`, `permission`, `primary_actions`, `required_regions`, `capability_id` are empty for all 35 screens. | Screen-level permission binding and routing cannot be derived from the register; must come from the UX/IA specification narrative (lower precedence) or a register correction. Raised against `SCR-M06-001..035`. |
| CONF-M06-003 | `Activation_Input_Register` maps `ACTIN-M06-001..012` to `GATE-M06-002..013`, offset by one from the gate titles they describe (e.g. "M00 custom-role delta approval" is due at GATE-M06-002 "Schema and migration review", not GATE-M06-001 "M00 foundational access deltas approved"). | Gate sequencing ambiguity. Plan treats ACTIN-M06-001 as gating **GATE-M06-001**; requires ratification. |
| CONF-M06-004 | `Prior_Module_Impact_Register` skips `IMP-M06-021` (22 rows, IDs run 001–023). | Either a withdrawn impact or a register gap. Requires confirmation before impact closure is claimed complete. |

## 9. Boundary statement

Packet completion is not software implementation and not production activation. All 20 launch gates remain `NOT_EVIDENCED` and all 12 activation inputs remain `OPEN`.
