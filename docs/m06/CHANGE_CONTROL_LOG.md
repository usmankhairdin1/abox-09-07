# M06 — Change Control Log

| ID | Date | Type | Description | Disposition |
| --- | --- | --- | --- | --- |
| CCL-M06-001 | 2026-08-31 | Preflight | Packet extracted and integrity-verified: 279/279 SHA-256 entries matched; packet contract and security-invariant tests 3/3 passed. | CLOSED |
| CCL-M06-002 | 2026-08-31 | Preflight | Count reconciliation against READ ME FIRST control table: 89 decisions, 135 requirements, 470 AC, 675 tests, 82 APIs, 77 events, 175 tasks, 27 deltas, 20 gates, 12 activation inputs, 25 capabilities. All reconcile. | CLOSED |
| CCL-M06-003 | 2026-08-31 | Scope lock | Release chain `M01 -> M00 -> M05 -> M04 -> M06` and six-level source precedence recorded. AMS workbook confirmed NON-BASELINE reference input. | CLOSED |
| CCL-M06-004 | 2026-08-31 | Conflict | **CONF-M06-001** — packet migrations `V001–V008` are marker-table stubs, not DDL for the 29 M06-owned objects. Physical schema must be authored from Object Register + JSON schemas. | **OPEN — requires approval** |
| CCL-M06-005 | 2026-08-31 | Conflict | **CONF-M06-002** — Screen Register rows `SCR-M06-001..035` have empty `route`, `permission`, `primary_actions`, `required_regions`, `capability_id`. Screen-to-permission binding not derivable from a baseline artifact. | **OPEN — requires register correction** |
| CCL-M06-006 | 2026-08-31 | Conflict | **CONF-M06-003** — Activation inputs `ACTIN-M06-001..012` map to gates `GATE-M06-002..013`, off by one from the gate titles they describe. | **OPEN — requires ratification** |
| CCL-M06-007 | 2026-08-31 | Conflict | **CONF-M06-004** — Prior Module Impact Register omits `IMP-M06-021` (22 rows, IDs 001–023). | **OPEN — requires confirmation** |
| CCL-M06-008 | 2026-08-31 | Delta hold | All 27 proposed deltas confirmed `DRAFT_FOR_GOVERNED_APPROVAL` / `NOT_STARTED`. 9 M00 deltas are hard blockers (`blocking_for_m06 = YES`). No delta behavior activated. | HELD |
| CCL-M06-009 | 2026-08-31 | Protection | M01 confirmed protected. `DELTA-M06-M01-001..004` are design-only; no M01 implementation without governed approval. | HELD |
| CCL-M06-010 | 2026-08-31 | Plan | Thin-vertical-slice plan v1.0 issued (11 slices, 40.5 EW) with data → isolation → org scope → server enforcement → UI ordering. | CLOSED |
