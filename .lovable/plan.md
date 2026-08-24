# ABox Structured Understanding Summary (pre-wireframe)

No screens generated yet. This is the understanding baseline I will design from.

## A. What ABox is

ABox (Agency in a Box) is JET's AI-enabled insurance distribution and agency operating platform whose north star is a **marketplace of marketplaces** — product-agnostic distribution infrastructure across B2C, B2B, B2B2C, agency-led, carrier-led and hybrid models (`ABox_Platform_North_Star_Blueprint_v1.0`, DEC-001).

The North Star explicitly states what ABox is **not**: not a quote funnel, not a CRM, not an agency portal, not a carrier portal, not an AI assistant, not on-exchange/EDE only, not single-tenant, not a one-off Module 1 build. Module 1 (agency-led IFP shopping) is the first production slice, not the definition of the product.

Structural spine: graph-based organization/relationship model (never "1 agency = 1 marketplace = 1 hierarchy"), 20 required platform services, ~47 canonical objects, ~35 canonical events, 24 hard no-go architecture rules. AI posture: Plan-O is guidance/recommendation only, never binding decisions, never definitive language; AI output versioned and auditable; other AI agents are separately branded/sellable and must not be folded into the Plan-O brand.

## B. What Phase 1 covers

Phase 1 = Lucie parity + stronger agency infrastructure + configurable products + practical AI. Enumerated tracks from the Blueprint deck: D2C marketplace; agent-assisted shopping; agency & master agency model (hierarchy, roles, permissions, branded agency/agent marketplaces); IFP on-exchange (handoff to JET EDE gateway); IFP off-exchange (configurable application capture + hybrid submission); ancillary (dental, vision, life, critical illness, accident, hospital indemnity — quote-level in Phase 1); ICHRA (employer inputs, census-based deep quote, lead routing — quote only); lead management & notifications (CRM pipeline, tasks, attribution, event-triggered multi-channel comms); **form configurator** (dynamic forms, conditional logic, documents, e-signature, review, audit; Quote-Only / Application-Capture-Only / Integrated-Submission pathways); governance, licensing & access (consent, audit, PII, licenses/appointments, role & hierarchy access); reporting and outputs (quote packets, comparison packs, application summaries, templated white-labeled outputs, dashboards, BI); integrations (Ideon files/API, JET EDE gateway, carrier APIs, dialers); **B2B2C paper/contract sharing** (rule-based recursive carrier contract access, listings, revenue attribution, audit); **commissions** (flat/tiered/overrides/advance & clawback setup, projection, statements — full reconciliation/payout is Phase 3); AI overlay Phase 1 = Practical Assistance (consumer shopping AI, guided intake, lead intelligence, agent readiness, governance guardrails, product/config QA).

Phase 1 is therefore materially broader than Module 1: off-exchange enrollment, form configurator, product/plan configuration, commissions, B2B2C paper sharing, ICHRA quoting, ACL/admin configuration, outputs and reporting all belong to Phase 1 design.

## C. What Module 1 covers

Module 1 V4 (= M01 in the sequencing pack) is the active build packet: IFP shopping D2C and agent-assisted, through EDE handoff.

- 26 visual wireframe screens `UX-001`–`UX-026`; 28 behavioral specs `SCR-001`–`SCR-028`; 16 confirmed decisions; 14+ objects (Lead, QuoteSession, Cart, PlanORecommendation, SharedQuote, EDEHandoffPacket, AuditEvent…); 18 integration seams `API-001`–`API-018`; QA journeys `JRN-001`–`JRN-008`.
- Flow: marketplace landing → product selection → Plan-O guided vs browse → ZIP/effective date → household members → goals/priority/usage → optional provider & drug lookup → optional subsidy check → results (single on/off-exchange **toggle**, one plan set at a time) → plan detail → compare (up to 5) → ancillary "more coverage" → cart drawer (one cart grouped by product type) → Review & Enroll gate (registration required) → registration (email/password or phone OTP) → consumer dashboard/resume.
- Agent side: quick quote start (anonymous prospect or existing lead) → single-page quote workspace with Plan-O assist → send quote (email/SMS, 7-day default expiry) → read-only shared quote (only "I'm Interested" and "Request Call/Schedule"; no add-to-cart) → lead timeline & milestones → scheduling.
- EDE handoff: on-exchange Review & Enroll opens the JET on-exchange marketplace/EDE in a new tab with a configurable handoff packet; ABox tracks status and returned outcome only.
- Minimal agency config only: branding basics, product availability basics, ranking disclosure text, quote/cart expiration, basic routing, notification channels/templates basics, scheduling availability, Plan-O toggle, demo/live mode.
- Compliance guardrails grounded in 45 CFR §155.220 and CMS web-broker guidance: all QHPs accessible, no compensation-based ranking on-exchange, ranking methodology disclosed, off-exchange prioritization allowed only with disclosure, APTC/CSR never implied off-exchange, AI field-fills labeled "Filled by Plan-O" and editable, audit events on consent/AI fill/toggle/handoff/config change.
- Module 1 non-goals (stated): full Agency Management, off-exchange application configurator and carrier submission, product-specific ancillary forms/underwriting, full HTML prototype, final JET on-exchange branding, legal sign-off on compliance copy.

## D. What the IA package controls

`ABox_Phase1_IA_Handoff_Package_v1.0` is the **structural baseline** for full Phase 1 — not just Module 1 — and it explicitly does not supersede the Blueprint deck or the active Module 1 V4 packet.

It locks 14 IA decisions (`DEC_IA_001`–`014`): one unified internal shell (no separate Agent/Agency/Carrier/Admin portal products); workspace-based operating contexts; left nav for function-based module containers plus top global bar; right context/help drawer plus bottom-right assistant; permission-aware global search; default landing My Work with per-user permitted landing preference; My Work (action) separate from Dashboards (visibility); shared object page framework with per-object specialization; unified permission-scoped timeline; modules grouped by business function not role; shared object spine instead of silos; externally branded consumer marketplace plus branded Member Workspace; front-end configuration layer within guardrails.

It defines 8 workspaces (`WS_CONSUMER_MARKETPLACE`, `WS_MEMBER`, `WS_AGENT`, `WS_AGENCY`, `WS_PLATFORM_ADMIN`, `WS_CARRIER`, `WS_EMPLOYER_GROUP`, `WS_PARTNER`), 13 modules (`MOD_MY_WORK` … `MOD_REPORTING`), 180 capabilities (`CAP_*`), **53 screens** (`SCR_CONS_LANDING` … `SCR_HELP_CONFIG`) with workspace assignment and build vs foundation status, 43 objects (`OBJ_*`), 42 events (`EVT_*`), and named flows (consumer shopping, agent-assisted, off-exchange enrollment, product/rate source, paper sharing). Frame naming is mandated as `<SCREEN_ID> - <Screen Name> - <Workspace/Experience>`, with governance via stable IDs, delta log and preflight checklist.

## E. What the reconciliation package controls

`ABox_Module1_Reconciliation_Packet_v1.0` protects the active build and routes gaps forward. It freezes 9 protected scope items `M1PROT-001`–`009` (D2C IFP flow, Plan-O, agent quick quote, shared quote, consumer dashboard, notifications/scheduling baseline, minimal agency configs, EDE handoff boundary, compliance/audit guardrails), and locks `DEC-M1REC-001`–`006` (Module 1 stays active; reconciliation is additive only; IA guidance must be non-breaking; Phase 1 > Module 1; stable IDs mandatory; artifact tool-neutral).

Gap disposition taxonomy (exactly one per gap): covered by Module 1; non-breaking IA alignment; carry forward to Module 2; carry forward to later Phase 1 packet; future seam only; requires decision; do not build (with reason).

19 gaps `M1REC-001`–`019` map to `CAP_*` IDs and are bundled into 6 Module-2 candidates `M2CAND-001`–`006`: off-exchange end-to-end enrollment, form configurator, dental/ancillary enrollment, product builder/deep product config, full white labeling, agency/parent-upline relationship model, carrier appointments & paper sharing, referral & reward economics, commissions setup/projection/statements, payment capture front end, ICHRA quoting, full scheduler/communication center, outputs/documents/reporting expansion, AI governance beyond Plan-O, Member Workspace evolution, admin/config/ACL/menu controls, off-exchange submission integrations, sellability decision layer, stable-ID/delta governance.

Sequencing context: 26 modules `M00`–`M25` in four waves; M01 is Module 1; Phase 1 depth lands in Wave 2 (M02–M15 subset), Phase 2 (Medicare, full ICHRA, servicing) and Phase 3 (carrier-led, group, payout reconciliation) come later.

## F. What must not be changed in Module 1

No redesign, re-sequencing or re-scoping of: the D2C IFP quote→results→compare→cart→registration flow and its single on/off-exchange toggle; Plan-O guided vs browse behavior, disclaimers, "Filled by Plan-O" labeling and escalation; agent quick quote single-page pattern; shared quote read-only constraint (no cart mutation, only Interested / Request Call); consumer dashboard/resume as the first Member Workspace slice; the notification/scheduling baseline; the minimal agency config set (do not expand it into full Agency Management); the EDE handoff boundary (new-tab handoff packet, ABox does not perform exchange enrollment); the compliance/audit guardrails; the `UX-###` / `SCR-###` ID space.

IA alignment for Module 1 screens is presentational and non-breaking only: shell placement, right drawer slots, assistant entry point, label configurability, permission states, ID cross-referencing.

## G. Broader Phase 1 areas to design beyond Module 1

Using IA screen IDs, in workspace groups:

- **Off-exchange enrollment & forms**: `SCR_OFFEX_ENROLL_START`, `SCR_DYNAMIC_FORM`, `SCR_DOC_UPLOAD`, `SCR_ESIGN`, `SCR_PAYMENT_CAPTURE`, `SCR_SUBMISSION_REVIEW`, `SCR_SUBMISSION_STATUS`, `SCR_FORM_BUILDER`.
- **Products & sellability**: `SCR_PRODUCT_CATALOG`, `SCR_PRODUCT_BUILDER`, `SCR_RATE_SOURCE`, `SCR_SELLABILITY_RULES`.
- **Agency & entity**: `SCR_AGENCY_PROFILE`, `SCR_AGENT_PROFILE`, `SCR_RELATIONSHIP_GRAPH`, `SCR_WHITE_LABEL_CONFIG`.
- **Appointments, paper, referrals (B2B2C)**: `SCR_APPOINTMENT_CONFIG`, `SCR_PAPER_SHARING_CONFIG`, `SCR_REFERRAL_CONFIG`.
- **Commissions**: `SCR_COMMISSION_SCHEDULE`, `SCR_COMMISSION_PROJECTION`, `SCR_COMMISSION_STATEMENTS`.
- **Leads & customers**: `SCR_LEAD_LIST`, `SCR_LEAD_DETAIL`, `SCR_CUSTOMER_360`, `SCR_TASKS`, `SCR_AGENT_MY_WORK`.
- **Communications**: `SCR_NOTIFICATION_TEMPLATES`, `SCR_SCHEDULER`, `SCR_ROUTING_RULES`.
- **Outputs & reporting**: `SCR_OUTPUT_STUDIO`, `SCR_REPORTING_HOME`.
- **Admin, ACL, AI governance**: `SCR_ACL_CONFIG`, `SCR_FEATURE_FLAGS`, `SCR_INTEGRATIONS`, `SCR_AUDIT_LOG`, `SCR_HELP_CONFIG`, `SCR_AI_GOVERNANCE`, `SCR_PLANO_CONFIG`.
- **Foundation-level (low fidelity, noted seams)**: `SCR_MEMBER_HOME` and Member Workspace, Employer/Group ICHRA quote, Partner/referral workspace, Carrier workspace surfaces.

Every internal frame must carry: top global bar (workspace switcher, entity switcher, global search, tasks, notifications, AI/help, profile/preferences), configurable permission-aware left nav, right context drawer, bottom-right assistant, plus empty / loading / error / no-permission states.

## H. Assumptions

1. Wireframes are structural and low-to-mid fidelity, tool-agnostic, not final visual design; JET on-exchange branding is unresolved and shown as placeholder.
2. Module 1 frames are re-expressed only as non-breaking IA alignment, keeping `UX-###`/`SCR-###` references alongside `SCR_*` IA IDs.
3. Foundation-status screens (Member Workspace, ICHRA, Partner, Carrier) get placeholder structure with notes rather than invented behavior.
4. ICHRA is quote-only in Phase 1; group application/enrollment is out.
5. Commissions cover setup, projection and statements; payout reconciliation is out.
6. Where the IA JSON and the Module 1 packet differ in label or naming, the IA package governs structure and Module 1 governs behavior.
7. Ancillary in Phase 1 is quote/cart plus dental as the first enrollment proof line; product-specific underwriting forms are deferred.
8. Screen-level ACL variants are shown as state annotations on one frame, not duplicated frames per role.
9. Desktop-first for internal workspaces, mobile-first for the consumer marketplace, unless directed otherwise.
10. No delta log has been supplied beyond these five packages, so the baseline is treated as current.

## I. Blocking questions

1. **Wireframe output format and where it lives.** Options: (a) a clickable React wireframe app built in this Lovable project, (b) static low-fidelity frame documents/exports, (c) both. This determines everything downstream.
2. **Sequence of the first batch.** Start with the internal platform shell plus one workspace end-to-end (Agency), or with the highest-risk Phase 1 gap (off-exchange enrollment + form configurator), or produce a complete shallow pass across all 53 screens first?
3. **Fidelity level.** Grey-box structural wireframes with annotations, or mid-fidelity with real ABox/agency branding tokens applied?
4. **Unresolved source decisions to design around.** The reconciliation packet leaves OQ-M1REC-001 to 005 open (Module 2 packaging, Saad's pending product-config specs, Phase 1 B2B2C depth, payment vendor UX pattern, commission statement granularity). Should I design those areas as annotated placeholders, or hold them until decisions land? Also unclear: whether Carrier self-service surfaces appear at all in Phase 1 wireframes.
