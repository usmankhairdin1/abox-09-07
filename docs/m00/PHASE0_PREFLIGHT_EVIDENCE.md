# M00 Phase 0 — Package Preflight Evidence

Package ID: ABOX-LUCIE-M00-BP · Version 1.1 · Status PRODUCTION_BUILD_READY
Controlled date 2026-08-14 · Certification PASS_FOR_PRODUCTION_BUILD_HANDOFF
Controlling execution record: M00-ATHINA-001 v1.1
Preflight executed: 2026-08-25 (UTC)

## PF-01 Integrity verification (hashes)

Source: `00_Handoff_Control/SHA256_MANIFEST_ABox_Lucie_M00_Platform_Foundation_Build_Packet_v1.1.txt`

- Manifest entries: 271
- Verified matching: 271
- Mismatched: 0
- Missing: 0

Result: PASS. No coding may proceed from any copy outside this verified extraction.

## PF-02 Package validation record

`FINAL_VALIDATION_RESULTS_...json` — overall_result PASS, 22 of 22 checks passed,
zero BLOCKING failures.

## PF-03 Executable package tests

`11_Machine_Readable/07_Executable_Test_Scaffolds/tests/test_package_contracts.py`
executed with pytest 8, jsonschema 4, PyYAML 6.

Result: 14 passed, 0 failed — matches the certified figure
(`executable_package_tests_passed = 14`).

## PF-04 Stable ID load and count reconciliation

Counts independently derived from the canonical registry
(`11_Machine_Readable/00_Canonical_Registry/ABox_Lucie_M00_Canonical_Registry_v1.1.json`)
and cross-checked against the controlled CSV registers.

| Register | Registry | CSV | Expected | Result |
| --- | --- | --- | --- | --- |
| Requirements | 201 | 201 | 201 | match |
| Acceptance criteria | 603 | 603 | 603 | match |
| API operations | 82 | 82 | 82 | match |
| Event contracts | 66 | 66 | 66 | match |
| Governed scenarios (tests) | 253 | 253 | 253 | match |
| Gherkin scenarios on disk | — | 253 | 253 | match |
| M01 impact records | 20 | 20 | 20 | match |
| Proposed M01 deltas | 17 | 17 | 17 | match |
| PostgreSQL migrations | 7 | — | 7 | match |

Supporting registers also loaded: 25 capabilities, 45 objects, 35 relationships,
15 states, 30 invariants, 65 business rules, 50 validation rules, 6 workspaces,
34 screens, 6 role templates, 93 permissions, 558 role/permission cells,
15 integrations, 30 security controls, 20 compliance controls, 12 AI controls,
18 launch gates, 20 operations, 30 metrics, 8 reports, 15 runbooks,
225 implementation tasks, 25 epics, 75 stories, 33 enumerations,
7 production hardening records, 150 decisions, 18 risks, 15 open items.

## PF-05 Migration set

`V001..V007` present in order plus `VERIFY__post_migration_assertions.sql`.
`V002__canonical_and_technical_tables.sql` declares 48 tables, matching the
"all 48 tables" Phase 2 exit rule. No released migration may be edited.

## PF-06 M01 protected-baseline status

All 17 proposed deltas: status `DRAFT_FOR_GOVERNED_APPROVAL`,
implementation_status `NOT_STARTED`. None may be implemented.
PMI-M00-M01-017 is deferred to M13 under M1D-018 and is not resolved inside M00.

## PF-07 Conflicts and unreadable artifacts

None. Every controlling artifact in the required loading order was readable
(MD, JSON, CSV, SQL, YAML, DOCX/PDF pairs). No contradiction found between the
canonical registry, CSV registers, OpenAPI/AsyncAPI contracts, migrations and
narrative specifications during preflight.

## PF-08 Environment separation

Local Development, QA, UAT and Production separation is asserted as a Phase 0
exit condition. Currently only a Local Development environment exists in this
workspace; QA, UAT and Production provisioning remains an open Phase 1 item and
is recorded in the change-control log rather than assumed complete.
