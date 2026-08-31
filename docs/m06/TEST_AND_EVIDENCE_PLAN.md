# M06 — Test and Implementation Evidence Plan

## 1. Test inventory

675 tests in `ABox_Lucie_M06_Test_Register_v1.0.csv`, five per requirement (`TEST-M06-<nnn>-01..05`), mapped to 135 requirements and 470 acceptance criteria. Every test ID must appear in an automated test name or an explicit manual evidence record. No requirement closes on manual evidence alone unless the register marks it manual.

## 2. Test layers

| Layer | Coverage | Gate |
| --- | --- | --- |
| Migration and schema | Forward + rollback for every authored M06 migration; column nullability, entity version, tenant column presence | GATE-M06-002 |
| Tenant isolation | Cross-tenant read/write/list denial on all `lucie_m06` tables; RLS FORCED assertion; ambiguous-tenant → deny | GATE-M06-003 |
| Authorization | Permission + scope denial matrix over 75 permissions × 225 role-permission rows; **assert no literal role-name branch exists** (static check); version-on-change; immediate invalidation of stale access | GATE-M06-001, 003, 018 |
| Privacy | SSN/DOB/note text/credential content/raw referral token absent from logs, event payloads, and standard exports (payload scanners) | GATE-M06-004 |
| Contract | OpenAPI 82 operations and AsyncAPI 77 events schema-validated; idempotency replay returns identical result | GATE-M06-013 |
| Cross-module fail-closed | M08 unavailable → no sellability inferred; M13 unavailable → no file content surfaced; M04 token never materialized | GATE-M06-006, 007 |
| Regression | M05 / M04 / M01 suites re-run on every M06 release candidate; all 27 deltas flagged `regression_required = YES` | GATE-M06-005 |
| Import/export | Round-trip integrity against `03_Import_Export_Fixtures`; partial-failure and duplicate handling | GATE-M06-012 |
| Bilingual | EN/ES parity for every screen state including denials and empties | GATE-M06-009 |
| Accessibility | WCAG 2.2 AA, automated + manual keyboard/SR pass on 35 screens | GATE-M06-010 |
| Performance | Roster scale, effective-access evaluation latency, import throughput against the agreed environment profile | GATE-M06-011 |
| Operations | 20 runbook drills, monitoring/alerting on 30 metrics, rollback and emergency disable rehearsal | GATE-M06-014, 015, 016 |
| UAT | 18 `UF-M06-*` user-flow journeys | GATE-M06-017 |

## 3. Per-PR evidence minimum (per Athina instructions)

| Evidence | Required content |
| --- | --- |
| Traceability | `REQ-M06-*`, `AC-M06-*`, `TEST-M06-*` IDs in PR body; `TASK-M06-*` in branch name |
| Authorization | Actor, assignment, permission code, scope, and a captured denial case |
| Data | Migration ID, rollback script, RLS proof, retention treatment |
| Integration | Contract version, idempotency key behavior, failure behavior |
| UX | EN/ES screenshots, accessibility result, all UI states incl. denial |
| Operations | Metric, alert, runbook link, rollback path |
| Delta check | Explicit statement that no `DRAFT_FOR_GOVERNED_APPROVAL` delta behavior is activated |

## 4. Evidence artifacts maintained in-repo

- `docs/m06/PHASE0_PREFLIGHT_EVIDENCE.md` — integrity, counts, precedence, conflicts
- `docs/m06/IMPLEMENTATION_PLAN.md` — slices, sequence, effort
- `docs/m06/DELTA_DEPENDENCY_REPORT.md` — 27 deltas, 22 impacts, blocking verdict
- `docs/m06/CHANGE_CONTROL_LOG.md` — CCL-M06-* record of every deviation
- `docs/m06/TEST_AND_EVIDENCE_PLAN.md` — this document

## 5. Gate status at readout

All 20 launch gates `NOT_EVIDENCED`. All 12 activation inputs `OPEN_ACTIVATION_INPUT`. Production activation is not authorized and no gate may be claimed on planning artifacts alone.
