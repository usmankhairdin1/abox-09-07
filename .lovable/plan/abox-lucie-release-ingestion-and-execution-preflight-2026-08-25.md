# ABox Lucie Release — Ingestion and Execution Preflight

No requirements, architecture, backlog or module packets are produced here. This is the preflight only.

## 1. Files opened and reviewed

**Lucie Release Handover Package v1.0 (controlling for Lucie)**
- `00_Handoff_Control`: SOURCE_HIERARCHY_AND_SUPERSESSION_NOTICE v1.0, README, Release Notes, QA Report, SHA-256 manifest
- `01_Canonical_Definition`: Release Charter and Boundary Contract v1.0, Four-Month Delivery Blueprint v1.0
- `02_Registers_and_Matrices`: workstream plan (9), capability register (145), module slice map (M00–M26, 27 slices), product pathway matrix (5), IA surface baseline (111), role and access baseline (6), decision register (21 locked), open item register (15), assumption, risk, protected seam (17), launch gates (9), source hierarchy, terminology control, governed workbook
- `03_Project_Bootstrap`: Canonical Registry JSON, Machine Context, Bootstrap Prompt
- `04_Upstream_References`: Module 1 V4 Hardening Package (zip), Module 1 PRD v1.3.2, Module 1 PRD Traceability v1.0.2, M03 Stage 1 Build Packet v1.1 (reference only)

**Phase 1 Information Architecture Package v2.0**: supersession notice v2.0, IA Blueprint v2.0, Screen and Surface Catalog v2.0, screen inventory, workspace/module matrix, ACL rules, configuration registry, control and extension registry, object relationships, role–module access, module map, v1→v2 delta register, registers workbook, IA Canonical Registry JSON, IA Machine Context.

**Phase 1 Source Package v1.0**: supersession notice v1.0, Canonical Product and Operating Blueprint, Architecture Module Ownership Sequencing and Control, capability register, module registry, scope boundaries, decisions, launch gates, open items, workbook, Canonical Registry JSON, Machine Context.

**North Star**: Foundational Context Package v1.0 (Read Me First, North Star Master Context, Reference Matrices, Decision/Assumption/Risk register, Module 1 Continuity and Delta register, Source-of-Truth Change and Delta Governance, handoff instructions) plus the North Star Handover set (Platform North Star Blueprint, Architecture Guardrails and Service Model, Data Integration Compliance and Audit Foundation, Capability Map and Phasing Matrix, machine context).

**Module 1 (protected)**: V4 Requirements Hardening Pack, Compliance/AI Guardrails Pack, Data–API Integration Pack, QA Regression Pack, Agentic Task Pack, Traceability Workbook, clickable wireframes, PRD v1.3.2 and traceability companion, plus the Module 1 Reconciliation Package.

## 2. Unreadable, incomplete, duplicated or stale

| Item | Finding | Disposition |
|---|---|---|
| DOCX/PDF pairs across all packages | Duplicate renderings of one artifact | Read DOCX/PDF text; no conflict |
| `ABox_M03_Stage1_Build_Packet_v1.1.zip` | Present, reference-only by all three notices | Not consumed as authority |
| North Star naming | Lucie hierarchy names "North Star Handover Package v1.0"; upload is "North Star Foundational Context Package v1.0" | Same baseline family; treated as rank-5 long-term intent. Nonblocking assumption A-02 |
| June 2026 Product Architecture and Module Sequencing Pack | Retired by all three notices; README of Lucie still lists it under upstream references | Stale statement identified, not inherited |
| June 2026 Phase 1 Blueprint deck | Excluded by Lucie README; superseded framing | Not used for scope |
| Prior in-project wireframe artifacts (`/m1`, `/p1`, `/hf`) | Built against the earlier IA v1.0 and retired sequencing pack | Reconcile to IA v2.0 surface IDs before reuse; do not treat as baseline |
| Nothing was unreadable | All archives extracted cleanly | — |

## 3. Authority model as understood

1. **Lucie Handover v1.0** — Lucie scope, simplifications, exclusions, workstreams, delivery depth, gates.
2. **Phase 1 Source v1.0** — broader product/operating model, current module ownership (M00–M26), dependency sequence, production posture Lucie must preserve.
3. **Phase 1 IA v2.0** — shell, workspaces, navigation, stable screen/surface IDs, canonical object homes, journeys, access and configuration placement.
4. **Module 1 V4 Hardening + PRD v1.3.2 + Traceability v1.0.2** — `protected_detailed_module_baselines = [M01]`. **Module 1 is the only protected detailed module baseline.**
5. **North Star** — long-term identity; anti-narrowing control.

M02 and M03 remain stable module IDs and capability-ownership labels; their prior packets are reference-only. The 2026-06-24 sequencing pack has no authority. Module number is not build order. Any older README/CSV/JSON statement conflicting with this hierarchy is named as stale and not inherited.

## 4. Lucie scope, simplifications, exclusions, seams

**In scope:** IFP on-exchange (FPL/subsidy tools, compare, PlanAI, cart, registration, save/resume, agent assistance, JET EDE handoff); IFP off-exchange (fixed application, three carrier pathways); dental and vision on canned versioned plans with the same three pathways; ICHRA employer/agent census, contribution strategy, quoting, interest routing; basic agency/agent management with parent–child hierarchy, roles, licenses, appointments, NIPR, captive posture, reason-coded sellability; basic CRM and Customer 360 with tasks, assignment, attribution, quote sharing, dashboards; Twilio/SendGrid communications, canned editable templates, notification center, help drawer, preferences, themes, limited white labeling, ACL, tenant isolation, audit, canned workflows; Ideon IFP loading, JET E-Signature, PDF and EDI generation, nonproduction payment simulation; operational reporting and integration health.

**Simplifications (locked decisions):** versioned fixed forms instead of the dynamic configurator (LUC-DEC-008); fixed Ideon loader/mapping instead of product administration (LUC-DEC-009); canned versioned dental/vision plan data, never embedded in frontend code (LUC-DEC-010); parent/downline relationship view only (LUC-DEC-011); one primary active affiliation; exactly three off-exchange pathways (LUC-DEC-006/007); text-only PlanAI; selected commercial availability (LUC-DEC-003).

**Excluded:** dynamic form authoring, full product configurator, DocuSign, voice PlanAI, live payments, commissions (M12), policy servicing (M18), contract sharing / selling paper (M07), dialer and voice intelligence (M16), offers and bundles (M17), Medicare (M19), group fully insured/self-funded (M22), carrier-led distribution (M23), service case management (M25), unrestricted workflow authoring.

**Protected seams (17, LUC-SEAM-001…017):** relationship graph (M05), multiple affiliations (M06), contract sharing (M07), dynamic product/formula platform (M03), dynamic forms (M26), live payment provider (M11), commissions (M12), and the remaining registered seams. Rule applied everywhere: retain IDs, objects and interface boundaries; never present a seam as implemented and never collapse the data model.

**State separation preserved:** availability, quoteability, sellability, enrollability, application readiness, EDI generation, external handoff, payment posture and confirmed external outcome stay distinct. PDF ≠ carrier acceptance; EDI generated ≠ submitted; EDE handoff ≠ enrollment; simulation ≠ authorization, capture or settlement.

## 5. Workstream validation and dependencies

| WS | Lane | Window | Entry dependency | Key modules |
|---|---|---|---|---|
| WS-00 Program control, source lock, governance | Program control | 1–16 | Approved handover | M00, all excluded-seam IDs |
| WS-01 Platform shell, identity, marketplace, governance | Foundation | 1–6 | WS-00 lock | M00, M04 |
| WS-02 IFP commerce, Ideon, JET EDE | Commerce | 1–8 | WS-01; Ideon + EDE contracts | M01, M02, M03 |
| WS-03 Agency, agent, licensing, sellability | Distribution ops | 2–8 | WS-01 org/ACL | M05, M06, M08 |
| WS-04 Off-exchange, dental, vision, applications, outputs | Enrollment | 4–11 | WS-02 cart, WS-03 sellability, carrier inputs | M26, M21, M13, M11 |
| WS-05 CRM, tasks, Twilio, help | Customer ops | 3–10 | WS-01, WS-02 events | M09, M10, M13 |
| WS-06 ICHRA quoting and interest routing | Employer | 4–10 | WS-01, WS-02, WS-05 | M20 |
| WS-07 PlanAI and AI governance | AI | 3–11 | WS-02 quote context, WS-01 audit | M14, M15 |
| WS-08 Reporting, integration health, QA, launch hardening | Hardening | 8–16 | Stable events/statuses | M24, M00 |

All nine validate against the blueprint windows, the module slice map and the 145-capability register (WS-00 9, WS-01 14, WS-02 33, WS-03 27, WS-04 21, WS-05 24, WS-06 1, WS-07 3, WS-08 13). Note: WS-06 and WS-07 carry very few registered capability rows relative to their scope — capability elaboration needed, not scope change (see assumptions).

**Critical path:** identity/tenant controls → Ideon fixed mapping with real data → JET EDE contract → canonical quote/cart snapshots → sellability decision (fail closed) → fixed form and pathway runtime → carrier PDF/EDI inputs → consent and Twilio → PlanAI legal mode and evaluation → integrated QA and operating ownership.

**Parallelizable after WS-01 exits:** WS-03 (from week 2), WS-05 (from week 3), WS-07 (from week 3), WS-04 and WS-06 (from week 4). WS-08 overlaps feature work from week 8. WS-00 runs continuously.

## 6. Workstream → IA, pathway, integration and gate mapping

| WS | IA workspaces (surfaces) | Product pathways | Integrations | Gates |
|---|---|---|---|---|
| WS-00 | Governance surfaces in `WS_PLATFORM_ADMIN` | none | none | LUC-GATE-01 |
| WS-01 | `WS_PLATFORM_ADMIN`, `WS_AGENCY`, `WS_CONSUMER_MARKETPLACE` shell | all (context) | none | 01, 06, 09 |
| WS-02 | `WS_CONSUMER_MARKETPLACE`, `WS_AGENT`, `WS_MEMBER` | IFP on/off exchange | Ideon, JET EDE | 02, 04, 05 |
| WS-03 | `WS_AGENCY`, `WS_PLATFORM_ADMIN` | all (sellability) | NIPR | 05, 06, 09 |
| WS-04 | `WS_CONSUMER_MARKETPLACE`, `WS_AGENT`, `WS_PLATFORM_ADMIN` | off-exchange, dental, vision (quote-only / app+PDF / app+EDI) | JET E-Signature, carrier EDI, payment simulation seam | 02, 03, 07 |
| WS-05 | `WS_AGENT`, `WS_AGENCY`, `WS_MEMBER` | all | Twilio, SendGrid | 05, 06, 08 |
| WS-06 | `WS_EMPLOYER_GROUP`, `WS_AGENT` | ICHRA employer quoting | none (routing internal) | 05, 09 |
| WS-07 | consumer, agent, employer PlanAI surfaces | all | AI runtime | 05 |
| WS-08 | `WS_PLATFORM_ADMIN` reporting and health | all | all connectors (health) | 06, 08, 09 |

IA surface baseline totals: 111 surfaces, all wireframe-required — `WS_PLATFORM_ADMIN` 35, `WS_CONSUMER_MARKETPLACE` 21, `WS_AGENCY` 21, `WS_AGENT` 20, `WS_EMPLOYER_GROUP` 9, `WS_MEMBER` 5. Roles: JET admin, agency admin, selling agent, unlicensed staff, consumer, employer contact.

## 7. Conflicts and controlling disposition

| Conflict | Disposition |
|---|---|
| Lucie README lists the retired June sequencing pack among upstream references | Retired; no authority. Module posture from Phase 1 Source v1.0 |
| M03 Stage 1 packet and prior M02 packets read as build baselines | Reference-only; M02/M03 remain ownership labels only |
| "Plan O" in earlier IA v1 and in existing project code | PlanAI is canonical (Phase 1 supersession statement); IA v2.0 retains the ID with renamed label |
| Existing in-project screens built on IA v1 IDs and old sequencing | IA v2.0 controls IDs and placement; 85 of 111 surfaces are new in v2.0 |
| Lucie excludes commissions while broader Phase 1 owns M12 depth | Lucie excludes; retain attribution fields and module boundary (LUC-SEAM-007) |
| Payment appears in cart/application review surfaces | Nonproduction simulation only; production shows external/pending status (LUC-GATE-07) |
| North Star breadth vs Lucie narrowness | Lucie controls delivery depth; North Star prevents architectural narrowing |

## 8. Open items by class

- **Product/design dependency:** launch cohort (LUC-OQ-014), brand assets and theme defaults (015)
- **Build dependency:** Ideon products/fields/refresh cadence (007), Twilio/SendGrid configuration (010)
- **Integration test dependency:** first off-exchange carrier (002), carrier EDI specifications (005), JET EDE handoff contract (008), NIPR verification approach (009)
- **Legal/compliance gate:** launch states (001), approved forms and PDF templates (006), PlanAI deployment approval (011)
- **Production activation dependency:** dental plan set (003), vision plan set (004), future payment provider (012), commercial pricing and entitlements (013)

None is a definition blocker; all 15 are already classified as such in the Lucie register.

## 9. Blocking questions (only true blockers)

1. **Artifact form:** should the execution artifacts be delivered as governed documents/registers (markdown + CSV/JSON in this project) or as an application that renders the Lucie architecture, backlog and traceability? Both are feasible; the answer changes every subsequent output.
2. **Existing wireframe estate:** the `/m1`, `/p1` and `/hf` screens in this project were built on IA v1.0 and the retired sequencing pack. Do we reconcile them to IA v2.0 Lucie surface IDs, quarantine them as historical, or ignore them for now?
3. **Module 1 delta posture:** are any Module 1 deltas currently approved, or is Module 1 strictly frozen for Lucie (I will assume strictly frozen unless told otherwise)?

## 10. Nonblocking assumptions to record

- A-01: WS-06 and WS-07 capability rows will be elaborated to workstream depth without widening Lucie scope.
- A-02: the uploaded North Star Foundational Context Package v1.0 is the rank-5 North Star baseline referenced by the Lucie hierarchy.
- A-03: fixed plans, fixed forms and canned workflows are modeled as governed versioned assets with owner, effective dates, lifecycle state, audit history and replaceable service boundary.
- A-04: canonical object model is inherited from IA v2.0; no Lucie-specific object model or module numbering is created.
- A-05: every Lucie artifact row will carry Lucie capability ID + canonical module ID + IA surface ID + workstream + gate.
- A-06: unspecified carriers, states, EDI layouts, acknowledgements, legal copy, NIPR behavior, pricing and payment providers are represented as dependencies, never invented.

## 11. Recommended first execution artifact

**Lucie Traceability and Delivery Spine v0.1** — the backbone every later requirement, story, screen and test attaches to. It would contain:

1. Locked authority header: active source versions consumed, stale statements identified and rejected.
2. Master traceability matrix: 145 capability IDs × canonical module IDs × IA surface IDs × workstream × pathway × integration × gate, with orphan detection both ways.
3. Workstream charters (9): objective, entry/exit criteria, dependency edges, protected seams touched, gates owned.
4. Vertical slice definition A–H with the integrated outcome and demonstrable acceptance posture per slice.
5. Surface coverage map: all 111 Lucie surfaces by workspace and posture, marking adapted safety surfaces and the single nonproduction surface.
6. State machine register: availability, quoteability, sellability, enrollability, application readiness, EDI generation, external handoff, payment posture, confirmed external outcome — with the non-equivalence rules stated as testable invariants.
7. Module 1 protection appendix: PRD/traceability controls that may not be weakened (typed consent, safe URL, EDE handoff, audit, PlanAI evidence, stale quote, PHI/PII), each mapped to the Lucie surfaces that touch it.
8. Seam register restatement (17) with the UI and data-model prohibitions per seam.
9. Open items and assumptions carried forward with owner and blocking stage.

Stopping here per instruction — awaiting direction before any requirements, architecture, backlog or module packets.
