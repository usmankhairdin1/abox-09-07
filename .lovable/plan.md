# ABox Phase 1 — Corrected Sitemap and Screen Inventory (No Visuals)

Verified against: IA structure JSON (8 workspaces, 13 modules, 180 capabilities, 53 screens, 43 objects), Blueprint capability statuses carried in that JSON, Module 1 V4 protected areas (M1PROT-001..009), and reconciliation gaps/packets (M1REC-001..019, M2CAND-001..006).

**Two independent axes, never merged again:**
- **Phase 1 status** — is it in Phase 1 at all: `P1-Build`, `P1-Foundation`, `P1-IfNeeded`, `Phase 2`, `Future seam`, `Not in ABox`.
- **Delivery packet** — who builds it and when: `M1` (protected, active), `M2-Cand` (reconciliation-assigned Module 2 candidate), `P1-Later` (later Phase 1 packet), `Seam`.

Everything below is Phase 1 unless the status column says otherwise. `[PROV]` = provisional ID I am proposing; needs ratification.

---

## A. Corrections made

1. **Fixed the biggest error in the previous draft: I used "M2" as a *Phase* status.** Off-exchange enrollment, the form configurator, dental, product builder, appointments/paper and commissions were shown as "M2", which reads as "not Phase 1". The IA capability register marks all of them `Build in Phase 1` (CAP_FORM_001..014, CAP_PROD_*, CAP_PAPER_001..013, CAP_COMM_001..017). They are now `P1-Build` on the phase axis and `M2-Cand` only on the delivery axis.
2. **Did I treat Module 1 as all of Phase 1? No — but I under-stated it.** Corrected: 12 protected Module 1 surfaces out of 82 wireframe targets; Module 1 is the shopping/EDE slice only.
3. **Off-exchange enrollment and form configurator: already present, now correctly phased.** SCR_OFFEX_ENROLL_START, SCR_DYNAMIC_FORM, SCR_FORM_BUILDER, SCR_FORM_PREVIEW, SCR_SUBMISSION_REVIEW/STATUS are `P1-Build` (CAP_FORM_001, CAP_FORM_004-007, CAP_FORM_010-013).
4. **Dental and reusable ancillary pattern: was missing as an explicit design obligation.** Added. CAP_FORM_002 "Dental enrollment flow" is `Build in Phase 1` as the minimum ancillary line; CAP_FORM_003 "Reusable ancillary enrollment pattern" is `Phase 1 foundation`, extensible to vision, life, critical illness, accident, hospital indemnity. Dental is now called out on SCR_PRODUCT_SELECT, SCR_OFFEX_ENROLL_START, SCR_DYNAMIC_FORM, SCR_PRODUCT_CATALOG, and a new **SCR_ANCILLARY_ENROLL_PATTERN [PROV]** pattern spec screen. Every enrollment screen is drawn product-agnostic so dental proves the reusable pattern rather than being a one-off.
5. **ICHRA: corrected to quote-only.** CAP_SHOP_017 and CAP_PROD_006 are explicit — "Quote only; application/enrollment/post-enrollment Phase 2". SCR_ICHRA_QUOTE is `P1-Build`; ICHRA enrollment/administration is recorded as **Phase 2, explicitly out**, with no screen drawn beyond a seam note. Ownership between Module 2 and a later Phase 1 packet remains open (M1REC-011).
6. **Payment: corrected the phase.** CAP_FORM_014 "Payment capture front end" and CAP_SHOP_019 "Payment step entry point" are `Build in Phase 1` — the UI behaves as if payment integration exists. CAP_FORM_015 "Actual payment vendor integration" is a `Future seam`. Previously I marked the whole screen provisional/blocked on vendor choice; that was wrong. The front end is designed now, vendor-agnostic; the integration is the seam. Payment stays out of the Module 1 EDE path (M1REC-010).
7. **Commissions: expanded to the full model list.** Previously compressed into one line. SCR_COMMISSION_SCHEDULE now explicitly carries CAP_COMM_002 agency-controlled schedules where allowed, CAP_COMM_004 PMPM, 005 PEPM, 006 flat fee, 007 PCPM, 008 contingent, 009 override, 010 upline bonuses, 011 super bonuses, 012 annual/recurring bonus models, 013 revenue splits, 014 referral rewards, 015 attribution chain, 016 ACL visibility. Statements CAP_COMM_017. Actual payment tracking (018) and reconciliation/adjustments/chargebacks/payout ops (019) are **Phase 2**, drawn as seams only.
8. **B2B2C paper sharing: confirmed nested, not top-level.** MOD_APPOINTMENTS_PAPER is explicitly "not default standalone top-level" in the IA module record and M1REC-007. Paper sharing appears inside carrier appointment, paper access, revenue split, referral configuration, sellability and attribution surfaces. Added the missing capability coverage: selling agency/agent marker (CAP_PAPER_008), sellability impact (011), attribution impact (012), audit trail (013). Full public paper marketplace (CAP_PAPER_014) is a `Future seam`.
9. **White labeling: broadened.** CAP_AGY_005 and CAP_ADMIN_002 cover logo, colors, footer, disclaimers, legal text, labels, support/contact, copy. Added CAP_AGY_004 storefront URLs, CAP_ADMIN_003 configurable labels (agency, advisor, marketplace, member), CAP_NOTIF_004 white-labeled notification templates, and CAP_OUT_006 white-labeled document branding. White labeling is therefore not one screen — it is SCR_WHITE_LABEL_CONFIG plus branding surfaces on notification templates and output templates.
10. **Module 1 protection: unchanged and reaffirmed.** 12 protected surfaces, shell-placement-only changes, delta required for anything else.
11. **Workspaces not portals: unchanged.** Eight workspaces, one internal shell, no portal products.
12. **Right drawer and bottom assistant: unchanged, and now sourced.** CAP_ADMIN_015 "Help/FAQ/page guidance config — right drawer and bottom help content" makes SCR_HELP_CONFIG the authoring surface for both.
13. **Stable IDs: kept.** All 53 IA `SCR_` IDs and 13 `MOD_` IDs used verbatim; provisional IDs are flagged and segregated.
14. **Provisional marking: tightened.** Every non-IA ID now carries `[PROV]` plus the reason it exists.

## B. Remaining gaps

1. Nineteen `[PROV]` screen IDs and ten `SHELL_*` region IDs are unratified. They cannot enter the permanent registry until you approve them.
2. ICHRA quote packet ownership is undecided (M1REC-011).
3. Product Builder detail waits on the separate product configuration specs (M1REC-004); the screen is drawn structurally, its field-level detail is provisional.
4. E-signature is `Build in Phase 1 if needed` (CAP_FORM_009) — conditional on carrier/product requirements not yet enumerated.
5. Carrier self-service depth is undefined; WS_CARRIER is `Phase 1 foundation` and I am drawing a narrow surface only.
6. Employer/Group workspace beyond ICHRA quoting is Phase 2; no flows exist to design against.
7. Reporting dashboard content (metrics, cuts, visual grammar) is not specified anywhere; SCR_REPORTING_HOME will be structural until you supply the metric set.
8. Whether licensing is its own screen or lives inside SCR_AGENT_PROFILE is unresolved.
9. Off-exchange EDI template content is named (CAP_FORM_012) but not specified, so SCR_SUBMISSION_REVIEW output detail is provisional.

---

## C. Final sitemap

```text
ABOX
├── EXTERNAL — Consumer Marketplace (WS_CONSUMER_MARKETPLACE) [branded, simplified, no internal shell]
│   ├── Landing → Product Select → Eligibility Intake → Plan O → Results → Detail → Compare → Cart
│   ├── Registration / Login
│   ├── Shared Quote View (tokenized)
│   ├── Schedule / Request Help
│   ├── On-exchange → EDE Handoff Review → [JET EDE, outside ABox]
│   └── Off-exchange → Enroll Start → Dynamic Form → Doc Upload → E-Sign → Payment → Submission Review → Status
│
├── EXTERNAL — Member Workspace (WS_MEMBER) [branded, simplified shell]
│   └── Home · Quotes · Cart · Applications/Handoffs · Documents · Messages · Tasks · Submission Status
│
└── INTERNAL PLATFORM — one unified shell
    ├── Shell: Top bar (workspace ▾, entity ▾, search, notifications, tasks, AI, profile)
    │          Left nav (modules by ACL) · Right context drawer · Bottom-right assistant
    ├── WS_PLATFORM_ADMIN — JET Platform Workspace
    ├── WS_AGENCY        — Agency Workspace
    ├── WS_AGENT         — Agent Workspace
    ├── WS_CARRIER       — Carrier / Appointment Workspace       [P1 foundation]
    ├── WS_PARTNER       — Partner / Referral Workspace          [P1 foundation]
    └── WS_EMPLOYER_GROUP— Employer / Group Workspace            [ICHRA quote only]

    Modules (left nav, permission-filtered):
    MOD_MY_WORK · MOD_REPORTING · MOD_LEADS_CUSTOMERS · MOD_MARKETPLACE_SALES ·
    MOD_FORMS_ENROLLMENT · MOD_PRODUCTS_PLANS · MOD_AGENCY_ENTITY ·
    MOD_COMMISSIONS · MOD_COMMUNICATIONS · MOD_OUTPUTS_DOCS ·
    MOD_ADMIN_CONFIG (incl. Integrations + Audit) · MOD_AI (overlay, not default top-level)
    MOD_APPOINTMENTS_PAPER — nested under agency/entity, carrier, product, marketplace config
                              (NOT a top-level menu — M1REC-007)
```

Workspace summary:

| ID | Workspace | IA phase | Shell |
|---|---|---|---|
| WS_PLATFORM_ADMIN | JET Platform Workspace | P1-Build | Internal |
| WS_AGENCY | Agency Workspace | P1-Build | Internal |
| WS_AGENT | Agent Workspace | P1-Build | Internal, simplified |
| WS_CARRIER | Carrier/Appointment Workspace | P1-Foundation | Internal, narrow |
| WS_PARTNER | Partner/Referral Workspace | P1-Foundation | Internal, very narrow |
| WS_EMPLOYER_GROUP | Employer/Group Workspace | P1-Foundation (ICHRA quote); Phase 2 deeper | Internal, narrow |
| WS_CONSUMER_MARKETPLACE | External Consumer Marketplace | P1-Build | External branded |
| WS_MEMBER | Branded Member Workspace | P1-Foundation | External branded, simplified |

Shell regions (all `[PROV]` IDs, all P1-Build): SHELL_TOPBAR, SHELL_WS_SWITCH, SHELL_ENTITY_SWITCH, SHELL_SEARCH, SHELL_NOTIFS, SHELL_TASKS, SHELL_LEFTNAV, SHELL_DRAWER (context · object summary · guidance · help/FAQ · audit · next actions), SHELL_ASSISTANT (chatbot · FAQ · copilot · contextual), SHELL_PROFILE. Drawer and assistant content is authored in SCR_HELP_CONFIG (CAP_ADMIN_015).

---

## D. Final screen inventory

Format per screen: **ID** — Name · Workspace · Module · *Phase status / Packet / Priority*
- Users · Purpose · Objects · Actions · Drawer · ACL/config · Source

### D1. Consumer Marketplace — shopping (Module 1 protected)

**SCR_CONS_LANDING** — Consumer Marketplace Landing · WS_CONSUMER_MARKETPLACE · MOD_MARKETPLACE_SALES · *P1-Build / M1 / P1*
- Anonymous shoppers, referral traffic. Branded entry, categories, Plan O entry, request help. Objects: OBJ_MARKETPLACE, OBJ_TENANT, OBJ_LEAD. Actions: start shopping, select category, launch Plan O, request help. Drawer: n/a (external help affordance only). Config: white-label branding, storefront URL, disclosure copy, channel enablement, feature flags. Source: IA + M1 V4 + CAP_SHOP_001.

**SCR_PRODUCT_SELECT** — Product Selection · same · *P1-Build / M1 (IFP paths) + M2-Cand (off-exchange, dental/ancillary, ICHRA entry) / P1*
- Consumers. Choose IFP on-exchange, IFP off-exchange, **dental (minimum ancillary line)**, extensible ancillary, ICHRA quote path where configured. Objects: OBJ_PRODUCT, OBJ_MARKETPLACE. Actions: select line, continue. Config: product availability + sellability decide visible cards. Source: CAP_SHOP_002, M1REC-003.

**SCR_ELIGIBILITY_INTAKE** — Basic Eligibility Intake · *P1-Build / M1 / P1*
- Consumers. ZIP/county, effective date, household/member basics, product minimums. Objects: OBJ_LEAD, OBJ_HOUSEHOLD, OBJ_MEMBER, OBJ_QUOTE_SESSION. Actions: enter, resolve county, continue, save. Config: no-PHI-in-URL rule, consent capture. Source: M1 V4, CAP_LEAD_006.

**SCR_PLANO_GUIDED_INTAKE** — Plan O Guided Intake · WS_CONSUMER_MARKETPLACE/WS_AGENT · MOD_AI · *P1-Build / M1 (M1PROT-002) / P1*
- Consumers, assisting agents. Goals/usage Q&A, optional provider/drug, disclaimers, escalation. Objects: OBJ_AI_INTERACTION, OBJ_RECOMMENDATION, OBJ_QUOTE_SESSION. Actions: answer, skip, apply to quote, escalate. Drawer (agent side): guardrail + disclaimer state. Config: SCR_PLANO_CONFIG. Guardrails frozen.

**SCR_QUOTE_RESULTS** — Quote Results · *P1-Build / M1 / P1*
- Plan cards, ranking with disclosure, filters, Plan O summary, sellability outcomes. Objects: OBJ_PLAN, OBJ_PLAN_RESULT, OBJ_RECOMMENDATION. Actions: filter, sort, compare, detail, add to cart, save/share. Config: QHP display constraints; sellability outcome (view/quote/buy/route/refer/unavailable/continue-to-EDE).

**SCR_PLAN_DETAIL** — Plan Detail · *P1-Build / M1 / P1* — benefits, premium, network, documents, explanations. Objects: OBJ_PLAN, OBJ_DOCUMENT. Actions: add to compare/cart. Config: plan doc visibility.

**SCR_PLAN_COMPARE** — Plan Compare · *P1-Build / M1 / P1* — side-by-side; export/share pack via MOD_OUTPUTS_DOCS (`P1-Later`, CAP_OUT_002/006). Objects: OBJ_PLAN_RESULT, OBJ_DOCUMENT. AI comparison support CAP_AI_003.

**SCR_CART_REVIEW** — Cart Review · WS_CONSUMER_MARKETPLACE/WS_AGENT/WS_MEMBER · *P1-Build / M1 (cart) + M2-Cand (payment entry) / P1*
- Multi-product cart, next steps per product line, register/save, payment entry point. Objects: OBJ_CART, OBJ_CART_ITEM, OBJ_PAYMENT_INTENT. Payment must not enter the Module 1 EDE path (M1REC-010). Source: CAP_SHOP_009, CAP_SHOP_019.

**SCR_REGISTRATION** — Registration/Login · *P1-Build / M1 / P1* — register/login to save, continue to Review & Enroll, member workspace link (CAP_LEAD_015). Objects: OBJ_USER, OBJ_CONSENT.

**SCR_SHARED_QUOTE_VIEW** — Shared Quote View · *P1-Build / M1 (M1PROT-004) / P1* — tokenized read-only, interest/request-call, expiration, timeline logging, no cart mutation without login. Objects: OBJ_QUOTE_SESSION, OBJ_ACTIVITY_EVENT.

**SCR_SCHEDULE_HELP** — Schedule/Request Help · MOD_COMMUNICATIONS · *P1-Build / M1 baseline + P1-Later (full scheduler) / P1* — Objects: OBJ_TASK, OBJ_SCHEDULED_JOB, OBJ_NOTIFICATION. Source: CAP_SHOP_014, CAP_NOTIF_009, M1REC-012.

**SCR_EDE_HANDOFF_REVIEW** — EDE Handoff Review · *P1-Build / M1 (M1PROT-008, -009) / P1, do not restyle* — Review & Enroll packet, consent, handoff to JET EDE in new tab. On-exchange application capture is **Not in ABox** (CAP_FORM_016). Objects: OBJ_CONSENT, OBJ_APPLICATION, OBJ_AUDIT_EVENT.

### D2. Off-exchange enrollment, dental/ancillary and forms (all P1-Build; packet M2-Cand / M2CAND-001)

**SCR_OFFEX_ENROLL_START** — Off-Exchange Enrollment Start · WS_CONSUMER_MARKETPLACE/WS_AGENT · MOD_FORMS_ENROLLMENT · *P1-Build / M2-Cand / P1*
- Consumers, agents. Choose product-specific enrollment path (IFP off-exchange, dental, extensible ancillary), confirm next steps. Objects: OBJ_PRODUCT, OBJ_APPLICATION. Drawer: product/carrier requirements, required docs. ACL: sellability + appointment/paper access. Source: CAP_FORM_001, CAP_FORM_002, CAP_SHOP_016.

**SCR_DYNAMIC_FORM** — Dynamic Application Form · *P1-Build / M2-Cand / P1*
- Configurable sections, conditional logic, product-specific sections, validation, save/resume. Objects: OBJ_PRODUCT_FORM, OBJ_FORM_SUBMISSION. Drawer: section guidance, required-doc list. ACL: field-level sensitivity. Source: CAP_FORM_004-007. Must render dental identically to IFP off-exchange — no product-specific hardcoding.

**SCR_ANCILLARY_ENROLL_PATTERN [PROV]** — Reusable Ancillary Enrollment Pattern · MOD_FORMS_ENROLLMENT · *P1-Foundation / M2-Cand / P2*
- Product/design owners. A pattern-spec screen showing how the dental flow generalises to vision, life, critical illness, accident, hospital indemnity. Objects: OBJ_PRODUCT, OBJ_PRODUCT_FORM. Source: CAP_FORM_003. Provisional: no IA screen exists for a documented pattern, but the capability is explicit and design must not hardcode dental.

**SCR_DOC_UPLOAD** — Document Upload · *P1-Build / M2-Cand / P2* — Objects: OBJ_DOCUMENT. Source: CAP_FORM_008, CAP_OUT_007.

**SCR_ESIGN** — E-Signature · *P1-IfNeeded / M2-Cand / P2* — Objects: OBJ_SIGNATURE_REQUEST. Source: CAP_FORM_009. Conditional on carrier/product requirement.

**SCR_PAYMENT_CAPTURE** — Payment Capture Front End · *P1-Build (front end) + Future seam (vendor integration) / M2-Cand / P2*
- Full payment step designed and behaving as if integration exists; vendor-agnostic so integration lands later without redesign. Objects: OBJ_PAYMENT_INTENT. ACL: masked/PCI-sensitive, no PII in URL. Source: CAP_FORM_014, CAP_FORM_015, CAP_SHOP_019, M1REC-009/-010.

**SCR_SUBMISSION_REVIEW** — Submission Review · WS_CONSUMER_MARKETPLACE/WS_AGENT/WS_AGENCY · *P1-Build / M2-Cand / P1*
- Agent/admin review before submission, readiness checks (missing data, docs, signatures, consents), standard EDI template output, API hook. Objects: OBJ_ENROLLMENT_SUBMISSION, OBJ_FORM_SUBMISSION. Drawer: readiness checklist, audit. Source: CAP_FORM_010-013, M1REC-017.

**SCR_SUBMISSION_STATUS** — Submission Status · WS_MEMBER/WS_AGENT/WS_AGENCY · *P1-Build / M2-Cand / P2* — track, retry, view errors. Objects: OBJ_ENROLLMENT_SUBMISSION, OBJ_ACTIVITY_EVENT.

**SCR_FORM_BUILDER** — Form Configurator · WS_PLATFORM_ADMIN/WS_AGENCY · *P1-Build / M2-Cand / P1*
- Build sections, fields, rules; variants by product, carrier, state, user type; version and publish. Objects: OBJ_PRODUCT_FORM. Drawer: rule validation, usage impact. Source: CAP_FORM_004-006, M1REC-002.

**SCR_FORM_PREVIEW [PROV]** — Form Preview / Test Harness · *P1-Build / M2-Cand / P2* — preview as consumer/agent, test conditional logic. Basis: M1REC-002 UI note.

### D3. Agent Workspace

**SCR_AGENT_MY_WORK** — Agent My Work · WS_AGENT · MOD_MY_WORK · *P1-Build / P1-Later / P0* — assigned leads, tasks, follow-ups, quotes, shared-quote activity, schedule items. Objects: OBJ_TASK, OBJ_LEAD, OBJ_QUOTE_SESSION, OBJ_ACTIVITY_EVENT. Drawer: next actions, AI suggestions. ACL: assignment + entity scope.

**SCR_AGENT_QUICK_QUOTE** — Agent Quick Quote · *P1-Build / M1 (M1PROT-003) / P1* — quote for anonymous prospect or existing lead, save/share/resume. Objects: OBJ_LEAD, OBJ_QUOTE_SESSION, OBJ_CART. ACL: marketplace + product permission.

### D4. Customers and Leads (P1-Build; packet P1-Later)

**SCR_LEAD_LIST** — Lead List · WS_AGENT/WS_AGENCY/WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P1* — filters, assignment, status (new, quoted, carted, shared, scheduled, handoff, enrolled, lost — CAP_LEAD_004), attribution. Objects: OBJ_LEAD. ACL: entity + downline visibility.

**SCR_LEAD_DETAIL** — Lead Detail · *P1-Build / P1-Later / P1* — overview, timeline, tasks, quotes, communications, readiness, related objects. Objects: OBJ_LEAD, OBJ_ACTIVITY_EVENT, OBJ_TASK, OBJ_QUOTE_SESSION, OBJ_NOTIFICATION. Drawer: timeline, next actions.

**SCR_CUSTOMER_360** — Customer 360 · WS_AGENT/WS_AGENCY/WS_MEMBER · *P1-Build/Foundation / P1-Later / P2* — customer/member/household profile, history, quotes, documents, messages. Objects: OBJ_CUSTOMER, OBJ_HOUSEHOLD, OBJ_MEMBER, OBJ_DOCUMENT, OBJ_APPLICATION. ACL: sensitive-data masking.

**SCR_TASKS** — Tasks & Follow Ups · MOD_MY_WORK · *P1-Build / M1 baseline + P1-Later / P2* — Objects: OBJ_TASK, OBJ_SCHEDULED_JOB.

### D5. Products, Plans and Rates (P1-Build/Foundation; packet M2-Cand / M2CAND-002)

**SCR_PRODUCT_CATALOG** — Product Catalog · WS_AGENCY/WS_PLATFORM_ADMIN/WS_CARRIER · *P1-Build / M2-Cand / P1* — IFP on/off exchange, **dental (CAP_PROD_004)**, broader ancillary (CAP_PROD_005, foundation), ICHRA quote products (CAP_PROD_006, quote only). Objects: OBJ_PRODUCT, OBJ_PLAN, OBJ_DOCUMENT. ACL: entity product access.

**SCR_PRODUCT_BUILDER** — Product Builder · *P1-Build / M2-Cand / P2, detail provisional* — configure behaviour, attach forms/docs/rate sources, publish. Objects: OBJ_PRODUCT, OBJ_PRODUCT_FORM, OBJ_RATE_SOURCE. Blocked detail: M1REC-004 product configuration specs.

**SCR_RATE_SOURCE** — Plan/Rate Source Management · WS_PLATFORM_ADMIN/WS_AGENCY · *P1-Build / M2-Cand / P2* — Ideon, carrier files, API/manual/synthetic modes, status, test. Objects: OBJ_RATE_SOURCE.

### D6. Agency, Agent and Entity Management (P1-Build; packet M2-Cand / M2CAND-003)

**SCR_AGENCY_PROFILE** — Agency/Entity Profile · WS_AGENCY/WS_PLATFORM_ADMIN · *P1-Build / M2-Cand / P0* — profile, branding, storefront URLs (CAP_AGY_004), relationships, agents, marketplaces, appointments, local ACL. Objects: OBJ_ENTITY, OBJ_ENTITY_RELATIONSHIP, OBJ_APPOINTMENT, OBJ_ACL_POLICY. Drawer: relationship summary, audit.

**SCR_AGENT_PROFILE** — Agent Profile · *P1-Build / M2-Cand / P1* — info, licenses/NPN, assignments, product access, commission visibility flag. Objects: OBJ_USER, OBJ_ROLE.

**SCR_RELATIONSHIP_GRAPH** — Relationship Graph · *P1-Build/Foundation / M2-Cand / P2* — parent, child, upline, downline, partner, referral, shared-paper links. Objects: OBJ_ENTITY_RELATIONSHIP. Drawer: what each relationship grants. Source: M1REC-006 — Module 1's tenant model is not redesigned.

**SCR_ENTITY_LIST [PROV]** — Entity/Agency List · *P1-Build / M2-Cand / P2* — list pattern for OBJ_ENTITY; IA names the profile but no list.

**SCR_LICENSE_MGMT [PROV]** — Licensing & NPN Management · WS_AGENCY/WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P3* — licenses/appointments by state and carrier, expiry alerts. Open: may collapse into SCR_AGENT_PROFILE.

### D7. Appointments, Paper Sharing and Referral Economics — nested, never top-level (M1REC-007)

**SCR_APPOINTMENT_CONFIG** — Carrier Appointment Configuration · WS_AGENCY/WS_PLATFORM_ADMIN/WS_CARRIER · *P1-Build / M2-Cand / P1* — appointment record (CAP_PAPER_001), public/private visibility (003), by carrier/state/product/NPN, appointed NPN override (007). Objects: OBJ_APPOINTMENT. Drawer: downstream effect of visibility on sellability and attribution.

**SCR_PAPER_SHARING_CONFIG** — Paper Sharing Configuration · WS_AGENCY/WS_PLATFORM_ADMIN · *P1-Build / M2-Cand / P1* — paper ownership/access record (CAP_PAPER_002), relationship-based sharing (004), recursive permissions (005), write-on-paper, selling agency/agent marker (008), revenue split configuration (009), sellability impact (011), attribution impact (012), audit trail (013). Objects: OBJ_PAPER_ACCESS_GRANT. ACL: high sensitivity. This is where B2B2C lives.

**SCR_PAPER_ACCESS_REQUEST [PROV]** — Request to Write Using Paper · *P1-IfPossible (CAP_PAPER_006) / M2-Cand / P2* — request, approve/deny, track. Objects: OBJ_PAPER_ACCESS_GRANT.

**SCR_REFERRAL_CONFIG** — Referral Reward Configuration · WS_AGENCY/WS_PLATFORM_ADMIN/WS_PARTNER · *P1-Build / M2-Cand / P2* — referral destinations, rewards, one-time/recurring terms, product/carrier limits (CAP_PAPER_010). Objects: OBJ_REFERRAL_AGREEMENT.

Future seam, no screen: full public paper marketplace (CAP_PAPER_014).

### D8. Commissions and Revenue Projection (P1-Build; packet P1-Later / M2CAND-004)

**SCR_COMMISSION_SCHEDULE** — Commission Schedule Setup · WS_AGENCY/WS_PLATFORM_ADMIN/WS_CARRIER · *P1-Build / P1-Later / P1*
- Carriers, JET admins, permitted agency admins. Covers: schedule setup (CAP_COMM_001), **agency-controlled schedules where allowed** (002), **PMPM** (004), **PEPM** (005), **flat fee** (006), **PCPM** (007), **contingent** (008), **override** (009), **upline bonuses** (010), **super bonuses** (011), **annual/recurring bonus models** (012), **revenue splits** (013), referral rewards (014). Objects: OBJ_COMMISSION_SCHEDULE, OBJ_COMMISSION_RULE. Drawer: rule precedence and attribution-chain explanation. ACL: restricted; agency-controlled editing only where the platform grants it.

**SCR_COMMISSION_PROJECTION** — Commission Projection View · WS_AGENT/WS_AGENCY/WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P2* — projected value by quote/cart/policy before payment/reconciliation (CAP_COMM_003), attribution chain (015). Objects: OBJ_COMMISSION_PROJECTION. ACL: CAP_COMM_016 — the module is absent, not greyed, when visibility is off.

**SCR_COMMISSION_STATEMENTS** — Commission Statements/Reports · *P1-Build / P1-Later / P2* — statements by agency/agent/policy/carrier/product (CAP_COMM_017), export. Objects: OBJ_COMMISSION_STATEMENT.

Phase 2, seams only: actual payment tracking (CAP_COMM_018), reconciliation/adjustments/chargebacks/payout operations (CAP_COMM_019).

### D9. Notifications, Communications and Scheduling (P1-Build; packet P1-Later / M2CAND-006)

**SCR_NOTIFICATION_TEMPLATES** — Notification Templates · WS_AGENCY/WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P2* — email/SMS/in-app templates, **white-labeled by tenant/marketplace (CAP_NOTIF_004)**, triggers, consent, test send. Objects: OBJ_NOTIFICATION.

**SCR_SCHEDULER** — Scheduler · *P1-Build / P1-Later / P2* — time-based, delayed, recurring, event-based jobs, run history. Objects: OBJ_SCHEDULED_JOB. Module 1's simple calendar stays intact (M1PROT-006).

**SCR_NOTIFICATION_CENTER [PROV]** — Notification Center · all internal · *P1-Build / P1-Later / P1* — full-page target behind the top-bar bell.

### D10. Outputs, Documents and Reporting

**SCR_OUTPUT_STUDIO** — Output/Document Templates · WS_AGENCY/WS_PLATFORM_ADMIN · MOD_OUTPUTS_DOCS · *P1-Build/Foundation / P1-Later / P2* — quote packets, comparison packs, application summaries (CAP_OUT_003), enrollment/submission packets (CAP_OUT_004), **white-labeled document branding (CAP_OUT_006)**. Objects: OBJ_DOCUMENT.

**SCR_REPORTING_HOME** — Reporting Home · WS_AGENCY/WS_AGENT/WS_PLATFORM_ADMIN · MOD_REPORTING · *P1-Build/Foundation / P1-Later / P1* — lead, quote, product, attribution, commission, audit and AI dashboards. Structural until metrics are supplied. ACL: data scope by entity and relationship.

**SCR_DOCUMENT_LIBRARY [PROV]** — Document Library · WS_AGENCY/WS_AGENT/WS_MEMBER · *P1-Build/Foundation / P1-Later / P3* — list pattern for stored OBJ_DOCUMENT.

### D11. AI Overlay, Plan O and Governance (cross-platform layer, not a default top-level menu — M1REC-018)

**SCR_AI_GOVERNANCE** — AI Governance Record · WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P1* — model, instructions, guardrails, prompt versions, tests, approvals, logs. Objects: OBJ_AI_WORKER, OBJ_AI_GOVERNANCE_RECORD. Source: M1REC-014 — Module 1 Plan O guardrails stay intact.

**SCR_PLANO_CONFIG** — Plan O Configuration · WS_PLATFORM_ADMIN/WS_AGENCY · *P1-Build/Foundation / P1-Later / P2* — enable/disable, disclaimers, knowledge sources, escalation, voice/text controls.

**SCR_AI_INTERACTION_LOG [PROV]** — AI Interaction Log · WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P3* — list pattern for OBJ_AI_INTERACTION.

### D12. Admin, Configuration, Integrations and Audit (P1-Build; packet P1-Later / M2CAND-005)

**SCR_WHITE_LABEL_CONFIG** — White Label Configuration · WS_AGENCY/WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P1*
- Full white labeling beyond URLs: logo, color palette, footer, disclaimers, legal text, contact info, support links, copy, labels, template branding, storefront URLs; live preview. Objects: OBJ_TENANT, OBJ_MARKETPLACE. Drawer: guardrail limits on what an agency may override. Source: CAP_AGY_004, CAP_AGY_005, CAP_ADMIN_002, CAP_ADMIN_003. Companion branding surfaces: SCR_NOTIFICATION_TEMPLATES, SCR_OUTPUT_STUDIO.

**SCR_SELLABILITY_RULES** — Sellability Decision Configuration · WS_PLATFORM_ADMIN/WS_AGENCY · *P1-Build / P1-Later / P1* — outcomes: view, quote, buy, route, refer, unavailable, continue to EDE; scenario tester. Drawer: rule trace. Governs behaviour on nearly every consumer screen.

**SCR_ROUTING_RULES** — Routing Rules · *P1-Build / P1-Later / P2* — assignment by marketplace, product, geography, language, workload; fallback.

**SCR_ACL_CONFIG** — ACL Configuration · WS_PLATFORM_ADMIN/WS_AGENCY · *P1-Build / P1-Later / P1* — global/local roles, permissions, action controls within guardrails. Drawer: effective-permission preview. Objects: OBJ_ROLE, OBJ_ACL_POLICY.

**SCR_FEATURE_FLAGS** — Feature Flags · WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P2*.

**SCR_INTEGRATIONS** — Integration Management · WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P2* — Ideon, JET EDE, off-exchange EDI/API hook, payment seam, notification vendors; health and test (CAP_ADMIN_011).

**SCR_AUDIT_LOG** — Audit Log · WS_PLATFORM_ADMIN/WS_AGENCY · *P1-Build / P1-Later / P2* — Objects: OBJ_AUDIT_EVENT; impersonation events highlighted.

**SCR_HELP_CONFIG** — Help/FAQ/Page Guidance Config · WS_PLATFORM_ADMIN/WS_AGENCY · *P1-Build / P1-Later / P1* — authors **right-drawer content and bottom-right assistant content**, FAQs, copilot knowledge, per-screen page guidance (CAP_ADMIN_015).

**SCR_TENANT_MARKETPLACE_SETUP [PROV]** — Tenant & Marketplace Setup · WS_PLATFORM_ADMIN · *P1-Build / P1-Later / P1* — CAP_ADMIN_001 exists; no IA screen does.

**SCR_GLOBAL_SEARCH_RESULTS [PROV]** — Global Search Results · *P1-Build / P1-Later / P2* — shell requirement.

**SCR_PROFILE_SETTINGS [PROV]** — Profile & Settings · *P1-Build / P1-Later / P2* — shell requirement.

### D13. Workspace homes

**SCR_MEMBER_HOME** — Member Workspace Home · WS_MEMBER · MOD_MY_WORK · *P1-Foundation / M1 first slice (M1PROT-005, M1REC-015) + P1-Later expansion / P1* — saved quotes, cart, applications/handoffs, messages, documents, assigned agent, stale-quote refresh. The Module 1 dashboard/resume slice is protected; only additive areas are newly designed. Source: CAP_LEAD_015.

**SCR_PLATFORM_HOME [PROV]** — JET Platform Workspace Home · *P1-Build / P1-Later / P1*.
**SCR_AGENCY_HOME [PROV]** — Agency Workspace Home · *P1-Build / P1-Later / P0*.
**SCR_CARRIER_HOME [PROV]** — Carrier Workspace Home · WS_CARRIER · *P1-Foundation / P1-Later / P3* — narrow: products, appointments, commission schedules, documents. Carrier self-service expands later.
**SCR_PARTNER_HOME [PROV]** — Partner/Referral Workspace Home · WS_PARTNER · *P1-Foundation / Seam / P3*.
**SCR_PARTNER_REFERRAL_TRACKING [PROV]** — Referral Tracking · WS_PARTNER · *P1-Foundation / Seam / P3*.
**SCR_MEMBER_MESSAGES [PROV]** / **SCR_MEMBER_DOCUMENTS [PROV]** — WS_MEMBER · *P1-Foundation / P1-Later / P3* — the IA workspace record names Messages and Documents as member modules without screens.

### D14. Employer/Group and ICHRA

**SCR_ICHRA_QUOTE [PROV]** — ICHRA Quote · WS_EMPLOYER_GROUP/WS_AGENT · MOD_MARKETPLACE_SALES · *P1-Build, **quote only** / packet undecided (M1REC-011) / P2* — census, affordability inputs, quote, output. Objects: OBJ_ENTITY, OBJ_HOUSEHOLD, OBJ_MEMBER, OBJ_QUOTE_SESSION. Source: CAP_SHOP_017, CAP_PROD_006.

**SCR_EMPLOYER_HOME [PROV]** — Employer/Group Workspace Home · *P1-Foundation / Seam / P3*.

**Explicitly excluded from Phase 1, no screens:** ICHRA application, ICHRA enrollment, ICHRA post-enrollment administration (Phase 2); on-exchange application capture (Not in ABox — CAP_FORM_016); actual payment vendor integration (Future seam); commission payment tracking, reconciliation, adjustments, chargebacks, payout ops (Phase 2); full public paper marketplace (Future seam).

### D15. Protected Module 1 screen list (frozen — shell placement only)

SCR_CONS_LANDING · SCR_PRODUCT_SELECT (IFP paths) · SCR_ELIGIBILITY_INTAKE · SCR_PLANO_GUIDED_INTAKE · SCR_QUOTE_RESULTS · SCR_PLAN_DETAIL · SCR_PLAN_COMPARE · SCR_CART_REVIEW (no payment) · SCR_REGISTRATION · SCR_SHARED_QUOTE_VIEW · SCR_AGENT_QUICK_QUOTE · SCR_SCHEDULE_HELP (baseline) · SCR_EDE_HANDOFF_REVIEW · SCR_MEMBER_HOME (dashboard/resume slice) · Module 1 minimal agency configuration surfaces (M1PROT-007). Any change requires a written delta and your approval.

**Counts:** 53 published IA screens + 10 shell regions + 20 provisional screens = **83 wireframe targets**; 12 protected Module 1 surfaces plus 3 partially protected (SCR_PRODUCT_SELECT, SCR_CART_REVIEW, SCR_MEMBER_HOME).

---

Approving this locks the inventory as the wireframe register. Wireframes start only after you confirm, and after the section B items you want resolved are resolved.
