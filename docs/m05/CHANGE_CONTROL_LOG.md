# M05 Change Control Log

| ID | Date | Type | Subject | Disposition |
| --- | --- | --- | --- | --- |
| CCL-M05-001 | 2026-08-31 | Preflight | Package integrity: 299/299 SHA-256 matched; 17/17 package contract tests passed | Recorded, no change |
| CCL-M05-002 | 2026-08-31 | Environment | M05 schema `lucie_m05` stood up on workspace-managed Cloud Postgres as Local Development; QA/UAT/Production separation outstanding | Open |
| CCL-M05-003 | 2026-08-31 | Governance | 14 proposed M00 deltas and 12 proposed protected M01 deltas confirmed DRAFT_FOR_GOVERNED_APPROVAL / NOT_STARTED; none implemented | Recorded, gated |
| CCL-M05-004 | 2026-08-31 | Migration | V001–V007 applied in controlled order, unedited | In progress |
| CCL-M05-005 | 2026-08-31 | Security hardening | Pinned `search_path` on the six `lucie_m05` functions (`current_tenant_id`, `current_user_id`, `is_jet_admin`, `validate_relationship`, `validate_tenant_owner`, `prevent_mutation`); no behavioural change to controlled DDL | Applied |
| CCL-M05-006 | 2026-08-31 | Verification | V001–V007 applied; packaged verification checks all pass (34 tables, 33 forced-RLS, 33 policies, schema version `M05-1.0-V007`); security linter clean | Closed |
