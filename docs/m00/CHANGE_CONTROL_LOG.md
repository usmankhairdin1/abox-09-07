# M00 Change Control and Clarification Log

Controlling package: ABOX-LUCIE-M00-BP v1.1 (PRODUCTION_BUILD_READY).
Precedence applied to every entry:

1. Approved M00 change records and approved protected M01 deltas
2. Canonical M00 registry and governed machine contracts
3. Numbered requirements, business rules and acceptance criteria
4. Traceability workbook and controlled CSV registers
5. Controlled narrative specifications and handoff documents
6. Visuals and examples
7. Phase 1 and North Star context

Rules: no stable ID is ever renumbered or reused; contradictions stop the
affected workstream and open an entry here instead of being silently reconciled.

| Log ID | Type | Raised | Affected stable IDs | Statement | Status |
| --- | --- | --- | --- | --- | --- |
| CCL-001 | Preflight record | 2026-08-25 | Package-level | Phase 0 preflight executed: 271/271 hashes verified, 22/22 package validation checks PASS, 14/14 executable package tests PASS, all certified counts reconciled (201/603/82/66/7/253/20/17). Evidence: `docs/m00/PHASE0_PREFLIGHT_EVIDENCE.md`. | CLOSED — PASS |
| CCL-002 | Open item | 2026-08-25 | Phase 0 exit rule "Local/QA/UAT/Production separation" | Only Local Development exists today. QA, UAT and Production environments, and their promotion controls, are not yet provisioned. Phase 1 (repository and delivery foundation) must establish them before any activation claim. | OPEN |
| CCL-003 | Constraint record | 2026-08-25 | 17 PDMs (all `DRAFT_FOR_GOVERNED_APPROVAL`), PMI-M00-M01-017, M1D-018 | No proposed M01 delta is implemented. PMI-M00-M01-017 stays deferred to M13 under M1D-018 and is not resolved inside M00. M01 requirements, screens, schemas, APIs, integrations, terminology and tests remain unchanged; PlanAI is display terminology only, historical Plan-O / Plan-AI aliases preserved. | OPEN — enforced |
| CCL-004 | Source defect | 2026-08-25 | V003 `ck_connector_definition_02` | Released statement compares `connector_definition.supported_environments` (`text[]`) with a scalar `IN` list; PostgreSQL rejects it (22P02 malformed array literal). Statement held back unapplied; all other V003 statements applied unedited. Requires an approved change record (likely `supported_environments <@ ARRAY[...]`). | OPEN — constraint not enforced in Local Development |
| CCL-005 | Source defect | 2026-08-25 | V003 `ck_release_record_01` | Released statement checks `release_record.version > 0`, but V002 declares `version` as text; PostgreSQL rejects it (42883 operator does not exist: text > integer). Statement held back unapplied; all other V003 statements applied unedited. Requires an approved change record (column type or constraint expression). | OPEN — constraint not enforced in Local Development |
| CCL-006 | Hardening record | 2026-08-25 | V001 context functions | The five `m00` helper functions were created without a pinned `search_path`. A post-migration hardening statement sets `search_path = m00, public, pg_temp` on each. No released migration file was edited and no function body changed. | CLOSED — applied |
| CCL-007 | Environment record | 2026-08-25 | Phase 2 exit rule | V001–V007 applied in order to the workspace-managed Cloud PostgreSQL instance as the Local Development environment. `VERIFY__post_migration_assertions.sql` passes: 0 tables without primary key, 0 tables without forced RLS, 45 canonical objects, 6 roles, 93 permissions, 558 role/permission rows, 57 geographies, 0 duplicate active provider routes. | CLOSED — PASS |
