# M08 — Licensing, Appointments, Credentials and Selling Authority (revised)

Controlled baseline: `ABox_Lucie_M08_..._Build_Packet_v1.0` (recovered bundle).
56 screens (SCR-M08-001…056), 36 flows (FLOW-M08-001…036), 300 requirements,
1,200 acceptance criteria, 300 business rules, 78 permissions, 111 enumerations,
50 reason codes, 54 prior-module impacts, 54 proposed deltas.

Scope images are illustrative only. No Medicare examples, no extra decision
outcomes, no third NIPR mode, no invented routing. Only `ALLOWED`,
`MORE_INFORMATION_NEEDED`, `NOT_ALLOWED`, `NOT_APPLICABLE` (ENUM-M08-001).

Depth: designed screens on governed sample data; no new database tables in this
pass. English and Spanish both designed from the start.

## Revised delivery sequence

1. **Agent-facing Selling Setup** — first reviewable increment (below).
2. **Agency Administration** — command center, roster, work queue, cases, holds,
   renewals, E&O policies, training requirements, onboarding template,
   servicing/reassignment, migration, agency reports, audit history.
3. **NIPR and Verification** — agency configuration over the JET service.
4. **NPN and Authority Engine** — policies, rules, simulators, decision detail,
   sponsorships, enforcement, JET operations/compliance/reporting.

Shared M08 models and evaluators are created only as far as increment 1 needs
them. The authority engine is a supporting contract now, a designed experience
in increment 4.

### Increment 1 — Agent-facing Selling Setup

Embedded inside the existing M06 agent and agency profiles. No new profile, no
separate credential application, no disconnected workflow.

| Screen | Name |
| --- | --- |
| SCR-M08-001 | Selling Setup Overview |
| SCR-M08-002 | Where I Can Sell |
| SCR-M08-003 | What Is Blocking Me |
| SCR-M08-004 | License Detail |
| SCR-M08-005 | Appointment Detail |
| SCR-M08-006 | Product Authority Detail |
| SCR-M08-007 | E&O Coverage |
| SCR-M08-008 | Training and Marketplace Information |
| SCR-M08-009 | Credential Documents (M13 references) |
| SCR-M08-010 | NPN Attribution Summary |

Flows: FLOW-M08-001, 006, 008, 009, 010, 013, 014.
Read-only supporting context surfaced in-place: renewals (036) and On Exchange
route explanation (048) links, designed in later increments.

## Coverage check — all 56 screens and 36 flows

**Screens.** All 56 are present in the Screen Register, each with route,
audience, permission and capability, and all 56 appear in the Traceability
Register mapped to requirements, acceptance criteria and tests. Nothing missing.

Cluster allocation (56 of 56):
- Increment 1 (10): 001–010
- Increment 2 (23): 011, 012, 013, 014, 032, 033, 034, 035, 036, 037, 038, 039,
  040, 041, 042, 043, 044, 045, 048, 051, 053, 049, 052
- Increment 3 (7): 025, 026, 027, 028, 029, 030, 031
- Increment 4 (16): 015–024, 046, 047, 050, 054, 055, 056

**Flows.** All 36 are present with screen sets, happy path and exception path.
Allocation: 1 → 001, 006, 008, 009, 010, 013, 014; 2 → 002, 012, 021, 022, 024,
025, 026, 027, 028, 031, 034, 035, 007; 3 → 015, 016, 017, 018, 019, 020, 023,
033; 4 → 003, 004, 005, 011, 029, 030, 032, 036.

**Genuine source gaps found (reported, not invented):**
1. The Traceability Register maps requirement → AC → test → screen → API → event
   → task, but contains **no FLOW-M08 identifiers**. Flow-to-REQ/AC traceability
   is therefore derived from each flow's screen set, and the derivation is
   recorded as an assumption rather than as packet-sourced fact.
2. Four screens appear in **no flow**: SCR-M08-002 (Where I Can Sell),
   SCR-M08-035 (Credential Onboarding Template), SCR-M08-052 (JET M08 Reports),
   SCR-M08-054 (Reference Configuration). They will be built from their own
   requirement/AC coverage; no flow will be invented for them.
3. FLOW-M08-023 screen set contains the free-text value `Credential Merge Plan`
   where a screen identifier is expected. Treated as a data defect; the flow
   uses SCR-M08-039 only until the packet is corrected.
4. Thinnest requirement coverage sits on SCR-M08-008, 027, 028, 033 (two
   requirement links each) — noted so review does not mistake sparse coverage
   for missing design.

## Bilingual design from the start

All M08 copy lives in one strings module with `en` and `es` entries authored
together. Layout rules applied to every component: no fixed-width labels, no
text baked into icons, wrapping and two-line allowance on status labels, tabs
and chips, truncation with accessible full text only where the register permits,
and column widths sized against the Spanish string. Dates, numbers and periods
are locale-formatted. Every state (loading, empty, not configured, pending
approval, conflict, dispute, expiration, suspension, unauthorized, unavailable
dependency, historical read-only, bulk partial success) is authored in both
languages.

## Experience rules enforced throughout

- Status dimensions stay separate — credential, verification, appointment,
  product authority, E&O, training, compliance holds, M06 affiliation and
  operational readiness, marketplace/route readiness, contextual authority —
  each with its own label and non-colour cue. Never one green or red badge.
- An agency-entered active appointment reads *active*, never awaiting carrier
  confirmation (EXCL-M08-015). An active licence without purchased verification
  reads *active, not verified* (EXCL-M08-014).
- Marketplace registration and training information is optional and never
  produces a blocking alert or onboarding task (EXCL-M08-016, ENUM-M08-022).
- Ready-to-sell presentation always shows context: agency, acting producer,
  resolved NPN, carrier, product scope, state, market, pathway, action,
  effective date.
- Resolving a deficiency from quoting or enrollment preserves the selected plan,
  transaction context and return path, re-evaluates after correction and returns
  the user without restarting.
- NPN attribution separates the person doing the work, the NPN receiving
  attribution, the NPN submitted externally, carrier credit and servicing or
  producer of record; copy states that selecting another NPN does not transfer
  that person's licence or appointment.
- Documents use M13 references with pending-dependency and unavailable states;
  M08 never implies it owns file storage.
- Every screen carries its SCR, applicable FLOW, REQ, AC, permission,
  prior-module impact and delta identifiers, plus an approval-dependent marker
  where relevant.

## Reusable component inventory

Reused unchanged: `InternalShell`, `ModuleTabs`, `PageHeader`, `DataTable`,
`KpiCard`, `EmptyState`, `StatusBadge`, `PlaceholderScreen`, the M06 kit
(`StatusTag`, `Btn`, field controls, `Id`, `Note`), existing shadcn primitives.
No existing component is replaced or restyled.

New, shared across all four increments: dimension status strip, provenance chip
(ENUM-M08-004), context ribbon, blocker card with return-path resume, authority
outcome panel, NPN role map, evidence and history panel, impact preview naming
who and what changes, secret-configured field, entitlement/usage meter,
review-vs-live mode banner, approval-dependent notice, bulk partial-success
summary, M13 dependency placeholder.

## Approval dependencies

Every prior-module delta is `PROPOSED_NOT_APPROVED`, `NOT_STARTED`: M00 (14),
M01 (8), M03 (8), M04 (8), M05 (8), M06 (8). Finalized M00, M01, M03, M04, M05
and M06 behaviour, navigation, branding and components are not changed. Increment
1 depends on DELTA-M08-M06-001 to 006 (embedded Selling Setup seam, credential
readiness dimension, Where I Can Sell and What Is Blocking Me summaries,
affiliation context, profile access boundaries) and on DELTA-M08-M00-001 to 004
(permission definitions, custom role assignment, effective-access context, audit
events). Until approved, those surfaces render inside the existing profile from
M08-owned data and are marked approval-dependent.

## Genuine conflicts

1. Embedded Selling Setup requires an unapproved M06 seam — designed against
   M08-owned data with the dependency visible.
2. M13 is not implemented, so document screens ship in pending-dependency state.
3. JET entitlement and metering (M00 deltas) are unapproved, so paid NIPR
   services and enforcement activation are review-mode only.
4. On Exchange route detail needs M03/M04 transaction context; sample context is
   used and labelled as such.
5. No M08 tables exist; this is governed sample data, so live enforcement stays
   unauthorized.
6. The four register defects listed in the coverage check.

## Technical notes

Model, evaluators, sample data and strings under `src/lib/m08/`; shared
components under `src/components/m08/`; a screen registry mirrors the existing
M06 registry so each frame resolves its controlled identifiers. Agent screens
render inside the existing M06 profile hosts; later increments use the packet
routes under `/agency/...` and `/jet/m08/...`. Each route defines its own
`head()`.
