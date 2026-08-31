# M06 — Thin Vertical Slice Implementation Plan v1.0

Sequencing rule applied: **canonical data → tenant isolation → organization scope → server-side permission and scope enforcement → UI actions.** No UI action is enabled before its server-side permission and scope evaluation exists and is tested.

Effort unit: engineer-weeks (EW), 2-week iterations.

---

## Slice 0 — Delivery and evidence spine
**Sequence 0 · Owner: Architecture · 1.5 EW · Status: buildable now**

- Scope: schema-per-module namespace `lucie_m06`, migration runner discipline, change-control log, stable-ID linting in PR templates, traceability export.
- Requirements: `REQ-M06-CTL-*` (evidence subset) · AC: mapped `AC-M06-*` · Tests: `TEST-M06-*-05` evidence assertions.
- Migrations: none (tooling only).
- Security: PR evidence template — actor, assignment, permission, scope, denial evidence.
- Evidence: `docs/m06/CHANGE_CONTROL_LOG.md`, traceability register render.
- Dependencies: none. **Gate: GATE-M06-002 prep.**

## Slice 1 — Canonical workforce core + tenant isolation
**Sequence 1 · Owner: Data Engineering + Backend · 4 EW · Status: buildable now**

- Capabilities: CAP-M06-001, 002, 003, 004.
- Requirements: `REQ-M06-FUN-001` (roster-only people), `-002` (canonical WorkforceProfile), `-003` (one primary active affiliation), `-004` (captivity classification), `-005` (profile fields, credential experience embedded not owned).
- Objects: `OBJ-M06-001` WorkforceProfile, `OBJ-M06-002` AgencyOperationalProfile, `OBJ-M06-003` AgencyAffiliation, `OBJ-M06-031` ProfileStatusHistory, `OBJ-M06-032` AffiliationCorrection.
- Schemas: `WorkforceProfile`, `AgencyAffiliation`, `AgencyOperationalProfile`, `AffiliationCorrection`.
- Migrations: **M06-V001 (authored)** — `lucie_m06` schema, workforce core tables, tenant column NOT NULL, entity `version` column, `created_by`/`updated_by`; partial unique index enforcing exactly one primary active affiliation per person. **M06-V007 (authored)** — FORCE ROW LEVEL SECURITY + tenant predicate on every table.
- APIs: `/v1/workforce-profiles` create/read/update/list subset, `/v1/affiliations` (6 ops).
- Events: workforce profile and affiliation lifecycle subset of `EVT-M06-*` — **emitted to outbox only, not published** until `DELTA-M06-M00-012`.
- Security: tenant ambiguity → deny; `SEC-M06-*` tenant isolation controls; no SSN/DOB in payload.
- Tests: `TEST-M06-001-*` … `TEST-M06-005-*`; negative cross-tenant read/write tests.
- Evidence: migration + rollback script, RLS proof query, retention note.
- Dependencies: Slice 0. **Gates: GATE-M06-002, GATE-M06-003.**
- Tasks: `TASK-M06-001` … `TASK-M06-005`.

## Slice 2 — Person identity, duplicate detection, protected fields
**Sequence 2 · Owner: Backend + Security · 3 EW · Status: data model buildable now; matching BLOCKED**

- Capabilities: CAP-M06-017, CAP-M06-019.
- Objects: `OBJ-M06-029` DuplicateCandidate, `OBJ-M06-030` IdentityLinkReview, `OBJ-M06-037` UserAccountProjection.
- Screens: `SCR-M06-007` Roster-only Conversion, `SCR-M06-033` Duplicate Review.
- Migrations: **M06-V002** — duplicate candidate, identity link review, projection tables.
- **Blocked by `DELTA-M06-M00-001`, `-002`, `-009`.** Global person ID, tokenized SSN matching and step-up are M00-owned. M06 builds the review workflow and the reference column; the match itself calls M00 and fails closed while the delta is draft.
- Security: full SSN/DOB never stored, logged, evented, or exported; reveal requires step-up (blocked).
- **Gates: GATE-M06-004** identity vault and privacy review.

## Slice 3 — Organization scope consumption (M05) + agency operational profile
**Sequence 3 · Owner: Backend · 2.5 EW · Status: buildable now**

- Capabilities: CAP-M06-001, CAP-M06-022, CAP-M06-024.
- Requirements: agency operational readiness (`REQ-M06-FUN-006`), agency defaults and propagation.
- Objects: `OBJ-M06-038` OrganizationProjection, `OBJ-M06-039` OfficeProjection, `OBJ-M06-027` AgencyDefaults.
- APIs: `/v1/organizations` (10 ops, read-projection + M06-owned operational profile writes).
- Screens: `SCR-M06-004` Agency Profile, `SCR-M06-034` Agency Defaults, `SCR-M06-001` Agency Administration Home (read-only shell).
- **M05 owns organizations and offices.** M06 reads projections and never writes org or office records. Office validity and hierarchy scope resolved via M05 contracts; ambiguous org → deny.
- Conditional dependency: `DELTA-M06-M05-002..006`.
- Tests: org-scope denial matrix, stale office rejection.
- **Gate: GATE-M06-005** M05/M04/M01 regression.

## Slice 4 — Business units, teams, memberships (non-legal structures)
**Sequence 4 · Owner: Backend + Frontend · 3 EW · Status: buildable now, inheritance deferred**

- Capability: CAP-M06-007.
- Objects: `OBJ-M06-004..007`.
- Migrations: **M06-V003** — business unit, team, membership tables with tenant + org scope.
- APIs: `/v1/business-units` (3), `/v1/teams` (3), `/v1/business-unit-memberships` (1), `/v1/team-memberships` (1).
- Screens: `SCR-M06-015..018`.
- **Invariant: manager, title, team lead and office grant no authority.** Membership is organizational only in this slice.
- **Role inheritance from BU/team is blocked by `DELTA-M06-M00-006`** — ship the structure, not the inheritance.
- Conditional: `DELTA-M06-M05-001` (operational groups as non-legal structures).

## Slice 5 — Roles, scoped assignment, effective access
**Sequence 5 · Owner: Backend + Security · 6 EW · Status: BLOCKED**

- Capabilities: CAP-M06-008, CAP-M06-009.
- Objects: `OBJ-M06-008` RoleProjection, `-009` RoleAssignmentProjection, `-010` EffectiveAccessProjection, `-028` RoleTemplateCopy.
- APIs: `/v1/access` (14 ops) — evaluation, explanation, assignment, audit.
- Screens: `SCR-M06-008..014` (Roles and Access Home, System Role Detail, Custom Role Builder, Role Version Compare, Role Assignments, Effective Access Inspector, Access Audit).
- Registers consumed: 75 permissions, 225 role-permission matrix rows, 4 roles.
- **Blocked by `DELTA-M06-M00-003, -004, -005, -006, -007, -008`.** M00 owns roles, permissions, scoped assignment, evaluation and invalidation. M06 renders and requests; it does not implement an authorization engine.
- Non-negotiable: evaluation by **permission code + scope**, never by literal role name. Active role change → new version. Access change → immediate invalidation.
- Tests: full denial matrix, version-on-change, stale-token invalidation, explanation correctness.
- **Gates: GATE-M06-001, GATE-M06-003, GATE-M06-018.**

## Slice 6 — Lifecycle: onboarding, transfer, offboarding, suspension
**Sequence 6 · Owner: Backend + Frontend · 5 EW · Status: partially blocked**

- Capabilities: CAP-M06-005, CAP-M06-006.
- Objects: `OBJ-M06-011..013`, `OBJ-M06-033` WorkAssignmentContext.
- Migrations: **M06-V004** — lifecycle case tables + state model enforcement (`State_Model_Register`, 15 models).
- APIs: `/v1/transfers` (2), `/v1/offboarding` (2), workforce-profile lifecycle ops.
- Screens: `SCR-M06-005` Add Agent Wizard, `SCR-M06-006` Add Staff Wizard, `SCR-M06-019..021`.
- **Suspension cannot be displayed as complete until M00 confirms access and session revocation** — depends on `DELTA-M06-M00-008`. Until approved, suspension terminal state is `PENDING_ACCESS_REVOCATION`.
- Open-work reassignment depends on `DELTA-M06-M01-004`; **M01 is protected — design only.**
- Guided setup must hide module boundaries (critical rule) while still routing each write to its canonical owner.

## Slice 7 — Readiness, eligibility, marketplace and referral integration
**Sequence 7 · Owner: Backend · 4 EW · Status: behind disabled control**

- Capabilities: CAP-M06-010, CAP-M06-023, CAP-M06-025, CAP-M06-018.
- Objects: `OBJ-M06-014..017`, `-034` ReferralLinkProjection, `-035` CredentialReadinessProjection, `-036` MarketplaceReadinessProjection.
- APIs: `/v1/service-scopes` (2), `/v1/operational-eligibility` (1).
- Screens: `SCR-M06-023`, `SCR-M06-024`, `SCR-M06-025`, `SCR-M06-026`.
- **M08 alone is authoritative for contextual selling authority.** M06 computes *operational* eligibility and fails closed without an M08 answer. **M13 owns credential files** — M06 stores references only, never content. **M04 owns referral tokens** — M06 stores projections, never raw tokens.
- Conditional deltas: `DELTA-M06-M04-001..005`.
- **Gates: GATE-M06-006** M08 fail-closed contract, **GATE-M06-007** M13 document boundary.

## Slice 8 — Notes, history, tasks, exceptions, import/export, reconciliation, notifications
**Sequence 8 · Owner: Backend + Data · 4.5 EW · Status: behind disabled control**

- Capabilities: CAP-M06-011..016.
- Objects: `OBJ-M06-018..026`.
- Migrations: **M06-V005** notes/history, **M06-V006** jobs and reconciliation, **M06-V008** indexes + outbox.
- APIs: `/v1/notes` (1), `/v1/exceptions` (4), `/v1/imports` (3), `/v1/exports` (2), `/v1/reports` (1), `/v1/reconciliation` (2), `/v1/support` (2).
- Screens: `SCR-M06-022`, `SCR-M06-027..032`.
- Conditional deltas: `DELTA-M06-M00-010` (job types), `-011` (email/Twilio), `-012` (audit and event catalogue).
- Idempotency required on all mutating ops (`x-idempotency-required: true`); outbox + reconciliation run for event integrity.
- Note text, credential content and raw tokens excluded from standard exports.
- **Gates: GATE-M06-008, GATE-M06-012, GATE-M06-013, GATE-M06-014.**

## Slice 9 — Agent Workspace and Agency Administration surfaces (bilingual, accessible)
**Sequence 9 · Owner: Frontend + UX · 4 EW · Status: follows its server slices**

- Capabilities: CAP-M06-021, CAP-M06-022.
- Screens: all 35 `SCR-M06-*` in final state; 18 `UF-M06-*` user flows.
- Every action button is rendered only after a server-side permission+scope check returns allow; client-side hiding is presentation, not enforcement.
- EN/ES parity and WCAG 2.2 AA on all UI states including denial and empty states.
- **Gates: GATE-M06-009, GATE-M06-010, GATE-M06-017.**

## Slice 10 — Operations, performance, rollback, pilot
**Sequence 10 · Owner: Operations + QA · 3 EW**

- 20 runbooks, 30 metrics, monitoring and alerting, emergency disable, rollback drill, performance profile, pilot cohort.
- **Gates: GATE-M06-011, GATE-M06-015, GATE-M06-016, GATE-M06-019, GATE-M06-020.**

---

## Sequence summary

| Seq | Slice | EW | Status |
| --- | --- | --- | --- |
| 0 | Delivery/evidence spine | 1.5 | Go |
| 1 | Workforce core + tenant isolation | 4.0 | Go |
| 2 | Identity + duplicates | 3.0 | Partial (matching blocked) |
| 3 | Org scope + agency profile | 2.5 | Go |
| 4 | Business units and teams | 3.0 | Go (inheritance deferred) |
| 5 | Roles and effective access | 6.0 | **Blocked** |
| 6 | Lifecycle and transfer | 5.0 | Partial |
| 7 | Readiness and marketplace | 4.0 | Control-gated |
| 8 | Notes/jobs/events | 4.5 | Control-gated |
| 9 | Surfaces | 4.0 | Follows |
| 10 | Operations | 3.0 | Follows |
| | **Total** | **40.5 EW** | |

At 4 engineers: ~11 iterations (~22 weeks) assuming M00 deltas approve before iteration 4. Every week of M00 delta delay pushes slices 5, 6 and 9 one-for-one.
