# M08 — Licensing, Appointments, Credentials and Selling Authority

Controlled baseline: `ABox_Lucie_M08_..._Build_Packet_v1.0` (recovered bundle).
56 screens (SCR-M08-001…056), 36 flows (FLOW-M08-001…036), 300 requirements,
1,200 acceptance criteria, 78 permissions, 111 enumerations, 50 reason codes.
Scope images are illustrative only — no Medicare examples, no extra decision
outcomes. Only `ALLOWED`, `MORE_INFORMATION_NEEDED`, `NOT_ALLOWED`,
`NOT_APPLICABLE` (ENUM-M08-001) are used.

Delivery depth: designed screens on governed sample data, no new database
tables in this pass. English content held in one place so Spanish drops in later.

## Architecture principle

Experience is role-specific; authority, NPN attribution, credential evaluation
and verification are shared platform capabilities. Shared contracts are defined
first, then the Agent, Agency and JET experiences are built against them.

## Delivery sequence

**Phase 0 — Shared platform contracts (no UI)**
Typed model + deterministic evaluators drawn from the registers: credential,
verification, appointment, product authority, E&O, training, hold, affiliation
and contextual-authority dimensions kept as *separate* fields (never collapsed);
NPN role resolution (ACTING_PRODUCER, ATTRIBUTION, MARKETPLACE_SUBMISSION,
AGENCY, CARRIER_CREDIT, SERVICING, PRODUCER_OF_RECORD); authority decision
producing outcome + factors + reason codes + evidence; NIPR connection model
(USE_OWN_NIPR, USE_JET_NIPR_PAY_TO_PLAY only). Governed sample data covering
active, expiring, conflicted, disputed, held and migrated records.

**Phase 1 — JET Platform / authority engine**
SCR-M08-015…024 (NPN policy list, editor, simulation; authority rule sets,
editor, simulator, decision detail, carrier authority matrix, templates,
sponsorships), SCR-M08-046, 047 (enforcement readiness, activation),
SCR-M08-054, 049, 050, 052, 055, 056.
Flows: 003, 004, 005, 011, 029, 030, 032, 036.

**Phase 2 — Agent Workspace / Selling Setup (embedded in M06 profile)**
SCR-M08-001…010 rendered inside the existing agent and agency profiles — no
second profile, no disconnected application. Plus SCR-M08-036 renewals,
SCR-M08-037, 038 portfolio and sharing, SCR-M08-048 On Exchange authority route.
Flows: 001, 006, 007, 008, 009, 010, 013, 014, 021, 022.

**Phase 3 — Agency administration workspace**
SCR-M08-011…014 (command center, roster, work queue, case detail),
SCR-M08-032, 033, 034, 035, 040…045, 051, 053, 039.
Flows: 002, 012, 024, 025, 026, 027, 028, 031, 034, 035.

**Phase 4 — NIPR and verification (Agency config over JET service)**
SCR-M08-025…031. Flows: 015, 016, 017, 018, 019, 020, 023, 033.

## Key experience rules enforced throughout

- Separate status dimensions, each with its own label, icon and text — never one
  green/red badge. An agency-entered active appointment reads *active*, not
  awaiting carrier confirmation (EXCL-M08-015). An active license without
  purchased NIPR verification reads *active, not verified* (EXCL-M08-014).
- Marketplace registration and training information is optional and never
  produces a blocking alert or onboarding task (EXCL-M08-016,
  ENUM-M08-022).
- Ready-to-Sell always shows its context: agency, acting producer, resolved NPN,
  carrier, product scope, state, market, pathway, action, effective date.
- Deficiency resolution from quoting/enrollment preserves the selected plan,
  transaction context and return path, re-evaluates after correction, and
  returns the user to where they were.
- NPN Override is presented as an attribution policy: defaults, scoped
  exceptions, authorized targets (ENUM-M08-007 only), effective periods,
  explicit backups, simulate-before-activate, and an impact preview naming
  affected agents, products, carriers, states, pathways and transactions.
  Copy states explicitly that selecting another NPN does not transfer that
  person's license or appointment.
- NIPR Setup: Connection Mode has exactly two options. Own mode collects
  Username, Password (required), Account/Customer ID and Environment
  (optional); after save it shows "credential configured" plus Replace, and
  never redisplays or reveals the password. JET mode collects no provider
  credentials and shows entitlement, enabled services, allowance/pricing, usage
  and approval requirements. Not Enabled and Not Configured are screen states.
  Test Connection distinguishes connection failure from an inactive licence.
  Paid fallback always requires explicit authorization.
- On Exchange: appointment and compensation never affect consumer visibility,
  order, comparison or recommendation. Agent diagnostics explain the limitation;
  consumer copy stays neutral and shows the configured next action.
- Servicing: temporary assistance, internal servicing assignment, permanent
  agent change and external producer/NPN change are distinct, with required
  authorization and external completion shown separately.
- Documents use M13 references only, with pending-dependency and unavailable
  states; M08 never implies it stores files.
- Review mode and live enforcement are visually and textually unmistakable.

## Reusable component inventory

Reused as-is: `InternalShell`, `ModuleTabs`, `PageHeader`, `DataTable`,
`KpiCard`, `EmptyState`, `StatusBadge`, `PlaceholderScreen`, the M06 kit
(`StatusTag`, `Btn`, fields, `Id`, `Note`), shadcn primitives.

New shared M08 components: dimension status strip (multi-dimension, non-colour
cues), authority outcome panel (outcome + factors + reasons + evidence),
context ribbon (agency/producer/NPN/carrier/product/state/market/pathway/action/
date), NPN role map, policy scope builder, simulation panel, impact preview
(who and what changes, not a count), blocker card with return-path resume,
verification result panel with conflict/dispute states, provenance chip
(ENUM-M08-004), secret-configured field, entitlement/usage meter, review-vs-live
mode banner, approval-dependent notice, bulk partial-success summary.

State coverage per screen: loading, empty, not configured, pending agency
approval, active attested, verification in progress, conflict, dispute,
expiration, suspension, unauthorized, unavailable dependency, historical
read-only, bulk partial success.

## Approval dependencies (design proceeds, marked approval-dependent)

All prior-module deltas are `PROPOSED_NOT_APPROVED`: M00 (14), M01 (8), M03 (8),
M04 (8), M05 (8), M06 (8). Finalized M00/M01/M03/M04/M05/M06 behaviour is not
redesigned. Anything relying on a proposed delta — notably the embedded Selling
Setup seam and credential readiness dimension in M06 (DELTA-M08-M06-001…008),
M08 permission definitions and audit events in M00 — carries a visible
approval-dependent marker in the UI and in the traceability notes.

## Material conflicts to flag now

1. Embedded Selling Setup depends on an unapproved M06 seam; until approved it
   renders inside the existing profile using M08-owned data only.
2. Documents depend on M13, which is not implemented; document screens ship in
   pending-dependency state.
3. Enforcement activation and NIPR paid services depend on JET entitlement and
   metering (M00 deltas) — shown as review-mode/simulated only.
4. On Exchange route detail depends on M03/M04 transaction context; sample
   context is used and labelled.
5. No M08 tables exist yet; this pass is UI on governed sample data, so live
   enforcement remains unauthorized.

## Technical notes

Routes follow the packet register paths, mapped onto existing workspaces:
agent screens under the agent/workforce profile, agency screens under
`/agency/credentials`, `/agency/authority`, `/agency/verification`,
`/agency/servicing`, `/agency/m08`, platform screens under `/jet/m08`.
Model, evaluators and sample data live in `src/lib/m08/`; shared components in
`src/components/m08/`; a screen registry mirrors the M06 pattern so every frame
carries its SCR, FLOW, REQ, AC, permission and delta identifiers. Copy lives in
a single strings module for later Spanish. Each route defines its own `head()`.
