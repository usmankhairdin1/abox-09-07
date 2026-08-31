# M06 — Prior Module Impact and Delta Dependency Report

27 proposed deltas. **Approval status of all 27: `DRAFT_FOR_GOVERNED_APPROVAL`. Implementation status: `NOT_STARTED`. Regression required: YES for all 27.**

No delta may be activated by packet finalization. Any M06 work whose behavior depends on a draft delta is **blocked** or must ship behind a disabled feature control with a fail-closed default.

## A. Hard blockers — `blocking_for_m06 = YES` (9, all M00)

These are the M00 custom role, scoped assignment, and effective access changes the assignment calls out. Nothing in the access, roles, or identity surface may be built to final behavior until these are approved.

| Delta | Title | Blocks |
| --- | --- | --- |
| DELTA-M06-M00-001 | Global person ID and protected identity vault | Slice 2 (identity), CAP-M06-017, SCR-M06-033, SCR-M06-007 |
| DELTA-M06-M00-002 | Protected DOB and tokenized SSN matching | Slice 2, duplicate detection `OBJ-M06-029`, `SCR-M06-033` |
| DELTA-M06-M00-003 | **Versioned custom workforce roles** | Slice 5, `SCR-M06-010/011`, CAP-M06-008 |
| DELTA-M06-M00-004 | **Agency-assignable permission metadata** | Slice 5, Permission Register consumption (75 permissions), `SCR-M06-009` |
| DELTA-M06-M00-005 | **Scoped direct role assignments** | Slice 5, `SCR-M06-012`, all scope-evaluated APIs |
| DELTA-M06-M00-006 | **Business-unit and team inherited assignments** | Slice 4 → 5 join, `SCR-M06-015..018` |
| DELTA-M06-M00-007 | **Effective-access evaluation and explanation** | Slice 5, `OBJ-M06-010`, `SCR-M06-013` |
| DELTA-M06-M00-008 | **Immediate access invalidation and reauthorization** | Slice 6 (suspension/offboarding), invariant "stale access invalidated immediately" |
| DELTA-M06-M00-009 | Sensitive access approval and step-up | Slice 2 + Slice 9 sensitive-field reveal |

**Consequence:** Slices 5 and 6 cannot reach done. Slices 1–4 may proceed because they are canonical data, tenant isolation, and organization scope — the assignment's required foundation — and they consume only finalized M00 v1.1 / M05 v1.0 contracts.

## B. Conditional blockers — `blocking_for_m06 = CONDITIONAL` (18)

Blocking only for the specific behavior named. Build the surrounding slice; keep the dependent behavior behind a control.

| Module | Deltas | Behavior gated |
| --- | --- | --- |
| M00 | 010 (M06 task/import/export job types), 011 (email + Twilio SMS orchestration), 012 (M06 audit and event catalogue) | Slice 8 jobs/import/export; Slice 7 notifications; the 77 `EVT-M06-*` contracts cannot be registered in the M00 catalogue until 012 is approved |
| M01 | 001 current workforce affiliation + permission context, 002 historical attribution continuity, 003 stale affiliation and suspension rejection, 004 open-work reassignment and handoff history | **M01 is the protected baseline.** No M01 code changes. M06 must publish events and let M01 consume post-approval. Slice 6 transfer/offboarding reassignment is design-only until then |
| M04 | 001 agency operational-readiness input, 002 operational-agent-eligibility input, 003 referral-link lifecycle reevaluation, 004 permission-and-scope marketplace administration, 005 roster participant and referral projections | Slice 7 marketplace/referral integration. M06 emits readiness; M04 remains owner of routes and tokens |
| M05 | 001 operational groups as nonlegal structures, 002–006 (org lifecycle, office validity, hierarchy scope, composite agency profile, note audiences) | Slice 3 org scope consumption and Slice 4 business units/teams as **non-legal** structures |

## C. Prior module impacts (22 records, IMP-M06-001 … IMP-M06-023, 021 absent)

| Module | Impacts | Disposition |
| --- | --- | --- |
| M00 | 001 global person identity, 002 custom roles, 003 scoped assignments, 004 effective access, 005 tasks and jobs, 006 notifications, 007 sessions and step-up, 008 audit events | All require governed delta approval before dependent M06 behavior activates |
| M05 | 009 organization lifecycle, 010 office validity, 011 hierarchy scope, 012 operational groups, 013 composite agency profile, 014 note audiences | Consume M05 v1.0 contracts read-only; groups are M06 non-legal structures |
| M04 | 015 participant readiness, 016 eligible agent, 017 referral lifecycle, 018 permissions, 019 roster projections | M06 supplies inputs; M04 owns decision and tokens |
| M01 | 020 seller context, 022 stale affiliation prevention, 023 reassignment | **Protected — no implementation without approval** |

## D. Dependency verdict

- **Buildable now:** Slices 1, 2 (data model portion only), 3, 4, 9 (evidence spine), 10 (test harness).
- **Buildable behind disabled controls:** Slices 7, 8.
- **Blocked pending approval:** Slice 5 (roles and effective access) end-to-end, Slice 6 (lifecycle suspension/offboarding completion), all M01-touching behavior.
