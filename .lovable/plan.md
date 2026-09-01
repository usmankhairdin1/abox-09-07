# M06 Screen Build-Out — Agency, Agent and Network Management

Build the remaining M06 surfaces (SCR-M06-001..035) as working, prototype-grade
screens on top of the `lucie_m06` schema and the existing `m06Invoke` server
function. Production activation is not requested and remains unauthorized.

## Goal

Today M06 has a full 28-table schema, one server entrypoint with ~24 operations,
and only three screens (`/m06`, `/m06/roster`, `/m06/console`). This plan brings
the other 32 screens online so the module can be walked end-to-end:
navigation → screen → action → result → history.

## What gets built

Grouped into seven screen families, all under `/m06`:

1. **Workforce roster and profile** — roster filters/saved views, profile
   overview, contacts, identifiers, affiliation history, correction request,
   status timeline, documents (M13 projection, read-only).
2. **Identity and duplicates** — duplicate candidate queue, side-by-side compare,
   link/unlink review, resolution outcome with reason capture.
3. **Business units and teams** — structure tree, unit detail, team detail,
   membership add/remove, bulk move, leadership assignment.
4. **Lifecycle** — onboarding case board, case detail with step checklist,
   transfer, leave, suspension (blocked at "access revoked" until M00 confirms),
   termination, reinstatement.
5. **Readiness and marketplace** — readiness scorecard, blocking-reason detail,
   service scope editor, availability declaration, marketplace participation
   status (M04 projection, read-only).
6. **Notes, tasks and history** — note composer with visibility levels, task
   references, consolidated history/audit trail per profile.
7. **Operations** — job register, reconciliation runs and drift report,
   exception queue with triage, event outbox inspector, notification requests.

Each screen carries its stable `SCR-M06-*` ID in a non-intrusive metadata rail
(same pattern the governed estate already uses), plus visible actor, permission
code and scope so stakeholders can see the access model in play.

## Data and behavior

- Every read and write goes through the existing `m06Invoke` server function and
  `lucie_m06_api` database function. No client-side direct table access.
- New operations are added to `m06Invoke` where a screen needs one (duplicates,
  BU/teams, lifecycle transitions, readiness recompute, jobs, exceptions).
- Writes land in real tables and emit into `lucie_m06.event_outbox`. The outbox
  stays unpublished — publication is gated on DELTA-M06-M00-012.
- Realistic fictional seed data (agencies, agents, offices, cases, exceptions)
  so screens render populated, not empty.
- Tenant/organization ambiguity fails closed: a missing or ambiguous scope
  returns denied, never a broad result set.

## Deliberate boundaries

- **M00 blockers stand.** Custom roles, scoped assignment and effective-access
  evaluation are not invented here. Screens that depend on them render the
  intended UI with a clear "pending M00 approval" disposition banner instead of
  fake enforcement. Suspension never reports complete without M00 confirmation.
- **Ownership preserved.** Licenses/appointments (M08), credential files (M13),
  marketplace routes and referral tokens (M04), organizations and offices (M05),
  identity foundations (M00) are shown as read-only projections.
- **M01 is frozen.** No changes to Module 1 code.
- Permission + scope is evaluated server-side before the UI offers an action, on
  permission codes — never on literal role names.

## Sequence

1. Seed data + shared M06 screen primitives (metadata rail, denial state, empty
   and error states).
2. Roster/profile family, then identity/duplicates.
3. Business units and teams.
4. Lifecycle cases.
5. Readiness and marketplace projections.
6. Notes, tasks, history.
7. Operations surfaces.
8. Navigation wiring in `nav-config.ts` and an M06 index that maps all 35 IDs to
   their routes.

## Technical notes

- Routes: flat files `src/routes/m06.<area>.<screen>.tsx` matching existing
  convention; `src/routes/m06.tsx` stays the layout with `<Outlet />`.
- Server: extend `src/lib/m06/m06.functions.ts` (single `m06Invoke` op switch);
  extend `lucie_m06_api` via migration for new ops.
- Migrations: additive only — seed data and any new op support. Existing
  V001–V008 objects are not altered.
- UI reuses the current design system tokens and shell; no new visual language.

## Open items (do not block this build)

- CONF-M06-002: the screen register has no route/permission bindings. Routes and
  permission codes will be assigned here and logged in
  `docs/m06/CHANGE_CONTROL_LOG.md` for governed confirmation.
- CONF-M06-003 (activation input off-by-one) and CONF-M06-001 (authored DDL
  approval) remain raised and unresolved.
