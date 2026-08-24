# ABox Phase 1 — Sitemap and Screen Inventory (No Visuals)

Structural baseline: `ABox_Phase1_IA_Structure_v1.0.json` (8 workspaces, 13 modules, 53 published screens, 43 objects). Scope envelope: Phase 1 Blueprint. Module 1 detail: Module 1 V4 Hardening Package. Boundary control: Module 1 Reconciliation Package (9 protected areas M1PROT-001..009, 19 gaps M1REC-001..019, 6 Module 2 candidate packets M2CAND-001..006).

IDs beginning `SCR_` are published IA IDs and are permanent. IDs marked **[PROV]** are provisional extensions I am proposing where the Blueprint or shell rules require a surface the IA inventory does not yet name; they need ID ratification before wireframing.

Legend for Phase status: **M1** = protected Module 1 build; **M2** = Module 2 candidate; **P1-L** = later Phase 1 packet; **SEAM** = future seam, drawn as a stub only. Wireframe priority: **P0** shell-critical, **P1** first wave, **P2** second wave, **P3** stub/provisional.

---

## 1. Global platform shell (internal, all workspaces)

One shell. No hardcoded Agent/Agency/Carrier/Admin portals (IA decision; RULE-M1REC-005).

```text
+--------------------------------------------------------------------------+
| TOP GLOBAL BAR                                                           |
| [brand] [Workspace ▾] [Entity ▾] [ Global search ] [🔔][✓ Tasks][AI][👤] |
+-----------+--------------------------------------------+-----------------+
| LEFT NAV  | MAIN CANVAS                                | RIGHT CONTEXT   |
| Modules   | (list / record / wizard / dashboard /      | DRAWER          |
| by ACL +  |  configurator page patterns)               | context, object |
| workspace |                                            | summary, help,  |
|           |                                            | guidance, audit,|
|           |                                            | next actions    |
|           |                                            +-----------------+
|           |                                            | [ ASSISTANT ]   |
+-----------+--------------------------------------------+-----------------+
```

| Shell region | ID | Contents | Notes |
|---|---|---|---|
| Top global bar | SHELL_TOPBAR **[PROV]** | Brand slot, workspace switcher, entity switcher, global search, notifications, tasks, AI assistant entry, profile/settings | Brand and labels configurable (SCR_WHITE_LABEL_CONFIG, SCR_HELP_CONFIG) |
| Workspace switcher | SHELL_WS_SWITCH **[PROV]** | Lists only workspaces the user holds access to; switching changes menu, data scope, labels, defaults, actions | Driven by OBJ_WORKSPACE, OBJ_ACL_POLICY |
| Entity switcher | SHELL_ENTITY_SWITCH **[PROV]** | Tenant / marketplace / agency / downline entity context | Driven by OBJ_ENTITY, OBJ_ENTITY_RELATIONSHIP; relationship graph decides the list |
| Global search | SHELL_SEARCH **[PROV]** | Cross-object search scoped by ACL and entity | Sensitive fields masked in results |
| Notifications | SHELL_NOTIFS **[PROV]** | In-app notification tray | OBJ_NOTIFICATION; Module 1 baseline exists (M1PROT-006) |
| Tasks | SHELL_TASKS **[PROV]** | Task counter and quick list, deep-links to SCR_TASKS | OBJ_TASK |
| Left navigation | SHELL_LEFTNAV **[PROV]** | Module containers, permission-filtered, labels configurable | Modules absent (not greyed) when not permitted |
| Right context drawer | SHELL_DRAWER **[PROV]** | Page context, object summary, guidance, help/FAQ, audit/history, next actions | Content authored in SCR_HELP_CONFIG; audit tab gated by ACL |
| Bottom-right assistant | SHELL_ASSISTANT **[PROV]** | Chatbot help, FAQs, copilot assistance, contextual to page + object | Governed by SCR_AI_GOVERNANCE, SCR_PLANO_CONFIG; logs OBJ_AI_INTERACTION |
| Profile & settings | SHELL_PROFILE **[PROV]** | Profile, preferences, language, sign out, support/impersonation exit | Impersonation must be visibly banded and audited |

The External Consumer Marketplace does **not** use this shell. It renders branded marketing/shopping chrome plus a consumer-facing help/Plan O affordance only. The Member Workspace uses a simplified, branded variant: top bar with brand, account, notifications, messages; no workspace/entity switcher; drawer reduced to help and next actions.

---

## 2. Workspaces

| ID | Workspace | IA phase | Primary users | Shell |
|---|---|---|---|---|
| WS_PLATFORM_ADMIN | JET Platform Workspace | Phase 1 build | JET admins, ops, implementation, support, compliance | Internal |
| WS_AGENCY | Agency Workspace | Phase 1 build | Agency owners, admins, managers, parent/upline users | Internal |
| WS_AGENT | Agent Workspace | Phase 1 build | Agents/producers | Internal (simplified) |
| WS_CARRIER | Carrier/Appointment Workspace | Phase 1 foundation | Carrier users, JET admins configuring carriers, appointed agencies | Internal (narrow module set) |
| WS_PARTNER | Partner/Referral Workspace | Phase 1 foundation | Referral partners, affinity/B2B2C partners | Internal (very narrow) |
| WS_EMPLOYER_GROUP | Employer/Group Workspace | Phase 1 foundation (ICHRA quote), Phase 2 deeper | Employer/group contacts, agents quoting ICHRA | Internal (narrow) |
| WS_CONSUMER_MARKETPLACE | External Consumer Marketplace | Phase 1 build | Anonymous shoppers, referral traffic | External branded |
| WS_MEMBER | Branded Member Workspace | Phase 1 foundation | Registered consumers/members | External branded, simplified |

Parent/master/upline status is a relationship property, not a workspace type (IA decision; M1REC-006).

---

## 3. Module containers

| IA module ID | Label | IA phase | Requested-name mapping |
|---|---|---|---|
| MOD_MY_WORK | My Work | Phase 1 build | My Work |
| MOD_REPORTING | Reporting & Intelligence | Phase 1 build/foundation | Dashboard and Analytics |
| MOD_LEADS_CUSTOMERS | Customers & Leads | Phase 1 build | Customers and Leads |
| MOD_MARKETPLACE_SALES | Marketplace & Sales | Phase 1 build | Marketplace and Sales |
| MOD_FORMS_ENROLLMENT | Forms & Enrollment | Phase 1 build | Forms and Enrollment |
| MOD_PRODUCTS_PLANS | Products, Plans & Rate Sources | Phase 1 build/foundation | Products, Plans, and Rates |
| MOD_AGENCY_ENTITY | Agency & Entity Management | Phase 1 build | Agency and Agent Management |
| MOD_APPOINTMENTS_PAPER | Appointments, Paper & Referrals | Phase 1 build/foundation | Carrier Appointments and Paper Access (nested, not top-level — M1REC-007) |
| MOD_COMMISSIONS | Commissions & Revenue Projection | Phase 1 build | Commission Setup, Projection, Statements, Reporting |
| MOD_COMMUNICATIONS | Notifications, Communications & Scheduling | Phase 1 build | Notifications, Communications, Scheduling |
| MOD_OUTPUTS_DOCS | Outputs, Documents & Reporting | Phase 1 build/foundation | Documents, Outputs, and Reporting |
| MOD_ADMIN_CONFIG | Admin, Configuration, Integrations & Audit | Phase 1 build | Admin and Configuration + Integrations and Audit |
| MOD_AI | AI Overlay, Plan O & Governance | Phase 1 build/foundation | AI, Plan O, and Governance |

Note: the request lists Integrations and Audit as a separate container; the IA package folds both into MOD_ADMIN_CONFIG. I follow IA and treat Integrations/Audit as sub-areas, and per M1REC-018 the AI overlay is a cross-platform layer, not a default top-level menu.

---

## 4. Screen inventory

Fields per screen: ID · Name · Workspace · Module · Primary users · Purpose · Phase status · Source basis · Objects · Major actions · Right drawer · ACL/config notes · Priority.

### 4.1 Consumer Marketplace (external)

**SCR_CONS_LANDING** — Consumer Marketplace Landing · WS_CONSUMER_MARKETPLACE · MOD_MARKETPLACE_SALES
- Users: anonymous shoppers, referral traffic. Purpose: branded entry, product categories, Plan O/help entry, start shopping.
- Status: **M1** (M1PROT-001). Source: IA + Module 1 V4 + Blueprint D2C.
- Objects: OBJ_MARKETPLACE, OBJ_TENANT, OBJ_LEAD (attribution). Actions: start shopping, choose product, launch Plan O, request help.
- Drawer: n/a external — consumer help/FAQ affordance only. ACL/config: white-label branding, disclosure copy, channel enablement, feature flags. Priority: P1 (as-built reference only).

**SCR_PRODUCT_SELECT** — Product Selection · same WS/module
- Users: consumers, referred traffic. Purpose: choose IFP on-exchange, off-exchange, dental/ancillary, ICHRA path where configured.
- Status: **M1** for IFP paths; off-exchange/ancillary path selection **M2** (M1REC-001, -003). Source: IA + Module 1 V4 + Blueprint.
- Objects: OBJ_PRODUCT, OBJ_MARKETPLACE. Actions: select product line, continue.
- Drawer: n/a. ACL/config: product availability, sellability rules decide which cards appear. Priority: P1.

**SCR_ELIGIBILITY_INTAKE** — Basic Eligibility Intake
- Users: consumers. Purpose: ZIP/county, effective date, household/member basics, product minimums.
- Status: **M1**. Source: Module 1 V4 quote wizard. Objects: OBJ_LEAD, OBJ_HOUSEHOLD, OBJ_MEMBER, OBJ_QUOTE_SESSION.
- Actions: enter household, resolve county, continue, save. Drawer: n/a. ACL/config: no-PHI URL rule, consent capture. Priority: P1.

**SCR_PLANO_GUIDED_INTAKE** — Plan O Guided Intake · WS_CONSUMER_MARKETPLACE/WS_AGENT · MOD_AI
- Users: consumers, agents assisting. Purpose: goals/usage Q&A, optional provider/drug, disclaimers, escalation.
- Status: **M1** (M1PROT-002). Objects: OBJ_AI_INTERACTION, OBJ_RECOMMENDATION, OBJ_QUOTE_SESSION.
- Actions: answer, skip, apply to quote, escalate to human. Drawer: n/a external; agent-side drawer shows guardrail state. ACL/config: Plan O on/off, disclaimers, knowledge sources (SCR_PLANO_CONFIG). Priority: P1.

**SCR_QUOTE_RESULTS** — Quote Results · MOD_MARKETPLACE_SALES
- Users: consumers, agents. Purpose: plan cards, ranking + disclosure, filters, Plan O summary, sellability outcomes.
- Status: **M1**. Objects: OBJ_PLAN, OBJ_PLAN_RESULT, OBJ_RECOMMENDATION, OBJ_QUOTE_SESSION.
- Actions: filter, sort, compare, view detail, add to cart, save/share. Drawer: agent-side plan context. ACL/config: QHP display constraints, sellability outcome (view/quote/buy/route/refer/unavailable). Priority: P1.

**SCR_PLAN_DETAIL** — Plan Detail · Status **M1**. Objects: OBJ_PLAN, OBJ_DOCUMENT. Actions: view benefits/network/docs, add to compare/cart. ACL: plan doc visibility. Priority P1.

**SCR_PLAN_COMPARE** — Plan Compare · Status **M1**; export/share pack ties to MOD_OUTPUTS_DOCS (**P1-L**, M1REC-013). Objects: OBJ_PLAN_RESULT, OBJ_DOCUMENT. Actions: compare, remove, export/share. Priority P1.

**SCR_CART_REVIEW** — Cart Review · WS_CONSUMER_MARKETPLACE/WS_AGENT/WS_MEMBER
- Status: **M1** for cart and next steps; payment entry is **M2** and must not be added to the Module 1 EDE path (M1REC-010).
- Objects: OBJ_CART, OBJ_CART_ITEM, OBJ_PAYMENT_INTENT (seam). Actions: review, remove, register/save, continue by product path. ACL/config: cart expiration, channel enablement. Priority P1.

**SCR_REGISTRATION** — Registration/Login · Status **M1**. Objects: OBJ_USER, OBJ_CONSENT. Actions: register, log in, save quote, continue to Review & Enroll. ACL: consent, no-PHI URL. Priority P1.

**SCR_SHARED_QUOTE_VIEW** — Shared Quote View · Status **M1** (M1PROT-004). Objects: OBJ_QUOTE_SESSION, OBJ_ACTIVITY_EVENT. Actions: view read-only, express interest, request call; no cart mutation without login; expiration state. Priority P1.

**SCR_SCHEDULE_HELP** — Schedule/Request Help · MOD_COMMUNICATIONS · Status **M1** baseline (M1PROT-006); full scheduler is **P1-L** (M1REC-012). Objects: OBJ_TASK, OBJ_SCHEDULED_JOB, OBJ_NOTIFICATION. Actions: request call, pick time, confirm. Priority P1.

**SCR_EDE_HANDOFF_REVIEW** — EDE Handoff Review · Status **M1** and compliance-frozen (M1PROT-008, M1PROT-009). Objects: OBJ_CONSENT, OBJ_APPLICATION, OBJ_AUDIT_EVENT. Actions: review packet, consent, hand off to JET EDE in new tab. Drawer: agent-side compliance summary. ACL: EDE ownership boundary, audit. Priority P1 (do not restyle).

### 4.2 Off-exchange enrollment and forms (Module 2 candidate M2CAND-001)

**SCR_OFFEX_ENROLL_START** — Off-Exchange Enrollment Start · MOD_FORMS_ENROLLMENT · **M2** (M1REC-001). Users: consumers, agents. Objects: OBJ_PRODUCT, OBJ_APPLICATION. Actions: choose enrollment path, confirm next steps. Drawer: product/carrier requirements. ACL: product sellability, appointment/paper access. Priority P1 (highest-value new design).

**SCR_DYNAMIC_FORM** — Dynamic Application Form · **M2** (M1REC-002). Objects: OBJ_PRODUCT_FORM, OBJ_FORM_SUBMISSION. Actions: complete sections, conditional logic, validate, save/resume. Drawer: section guidance, required-doc list. ACL: field-level sensitivity. Priority P1.

**SCR_DOC_UPLOAD** — Document Upload · **M2**. Objects: OBJ_DOCUMENT. Actions: upload, replace, view status. Drawer: accepted formats, why required. Priority P2.

**SCR_ESIGN** — E-Signature · **M2**, IA marks "Phase 1 if needed". Objects: OBJ_SIGNATURE_REQUEST. Actions: request, sign, track. Drawer: signer status. Priority P2. Provisional pending vendor decision.

**SCR_PAYMENT_CAPTURE** — Payment Capture Front End · **M2** (M1REC-009, -010). Objects: OBJ_PAYMENT_INTENT. Actions: enter method, submit, view status. ACL: PCI-sensitive, masked, no PII in URL. Priority P2. Vendor undecided — draw as abstracted seam.

**SCR_SUBMISSION_REVIEW** — Submission Review · WS_CONSUMER_MARKETPLACE/WS_AGENT/WS_AGENCY · **M2** (M1REC-017). Objects: OBJ_ENROLLMENT_SUBMISSION, OBJ_FORM_SUBMISSION. Actions: run readiness checks, correct, submit, generate EDI/API output. Drawer: readiness checklist, audit. Priority P1.

**SCR_SUBMISSION_STATUS** — Submission Status · WS_MEMBER/WS_AGENT/WS_AGENCY · **M2**. Objects: OBJ_ENROLLMENT_SUBMISSION, OBJ_ACTIVITY_EVENT. Actions: track, retry, view errors. Priority P2.

**SCR_FORM_PREVIEW [PROV]** — Form Preview/Test Harness · WS_PLATFORM_ADMIN/WS_AGENCY · MOD_FORMS_ENROLLMENT · **M2**. Basis: M1REC-002 UI note ("admin builder, preview, consumer intake, agent review, readiness"). Actions: preview form as consumer/agent, test conditional logic. Priority P2.

### 4.3 Agent Workspace

**SCR_AGENT_MY_WORK** — Agent My Work · MOD_MY_WORK · **M1**-adjacent (Module 1 covers agent quoting; the full My Work surface is **P1-L**). Objects: OBJ_TASK, OBJ_LEAD, OBJ_QUOTE_SESSION, OBJ_ACTIVITY_EVENT. Actions: work queue, open lead, resume quote, complete task. Drawer: next actions, AI suggestions. ACL: assignment scope. Priority P0 (first internal shell proof).

**SCR_AGENT_QUICK_QUOTE** — Agent Quick Quote · **M1** (M1PROT-003). Objects: OBJ_LEAD, OBJ_QUOTE_SESSION, OBJ_CART. Actions: select/create lead, quote, save, share, resume. Drawer: lead summary, marketplace/product visibility. ACL: marketplace + product permission. Priority P1 (as-built).

### 4.4 Customers and Leads

**SCR_LEAD_LIST** — Lead List · WS_AGENT/WS_AGENCY/WS_PLATFORM_ADMIN · **P1-L**. Objects: OBJ_LEAD. Actions: filter, assign/reassign, bulk action, open. Drawer: filter explanation, assignment rules. ACL: entity + downline visibility, attribution. Priority P1.

**SCR_LEAD_DETAIL** — Lead Detail · **P1-L**. Objects: OBJ_LEAD, OBJ_ACTIVITY_EVENT, OBJ_TASK, OBJ_QUOTE_SESSION, OBJ_NOTIFICATION. Actions: edit, assign, log activity, create task, start quote, share quote. Drawer: timeline, readiness, related objects, next actions. Priority P1.

**SCR_CUSTOMER_360** — Customer 360 · WS_AGENT/WS_AGENCY/WS_MEMBER · **P1-L**. Objects: OBJ_CUSTOMER, OBJ_HOUSEHOLD, OBJ_MEMBER, OBJ_DOCUMENT, OBJ_APPLICATION. Actions: view history, open quotes/applications, message, add document. Drawer: household structure, consents, audit. ACL: sensitive/PHI masking. Priority P2.

**SCR_TASKS** — Tasks & Follow Ups · MOD_MY_WORK · **P1-L** (Module 1 has a baseline). Objects: OBJ_TASK, OBJ_SCHEDULED_JOB. Actions: create, assign, complete, snooze. Priority P2.

### 4.5 Products, Plans and Rates (M2CAND-002)

**SCR_PRODUCT_CATALOG** — Product Catalog · WS_AGENCY/WS_PLATFORM_ADMIN/WS_CARRIER · **M2**. Objects: OBJ_PRODUCT, OBJ_PLAN, OBJ_DOCUMENT. Actions: search, filter by type/state/carrier, open, enable/disable availability. Drawer: source and status of rates. ACL: entity product access. Priority P1.

**SCR_PRODUCT_BUILDER** — Product Builder · **M2**, provisional detail (M1REC-004 — awaiting separate product configuration specs). Objects: OBJ_PRODUCT, OBJ_PRODUCT_FORM, OBJ_RATE_SOURCE. Actions: configure behaviour, attach forms/docs/rates, publish. Drawer: validation, dependency warnings. Priority P2, marked provisional.

**SCR_RATE_SOURCE** — Plan/Rate Source Management · **M2**. Objects: OBJ_RATE_SOURCE. Actions: configure Ideon/carrier file/API/manual/synthetic mode, test, view status. Drawer: last sync, error log. ACL: platform-admin heavy. Priority P2.

**SCR_FORM_BUILDER** — Form Configurator · WS_PLATFORM_ADMIN/WS_AGENCY · **M2** (M1REC-002). Objects: OBJ_PRODUCT_FORM. Actions: build sections/fields/rules, variant by product/state/carrier, version, publish. Drawer: rule validation, usage/impact. Priority P1.

### 4.6 Agency and Agent Management (M2CAND-003)

**SCR_AGENCY_PROFILE** — Agency/Entity Profile · **P1-L / M2**. Objects: OBJ_ENTITY, OBJ_ENTITY_RELATIONSHIP, OBJ_APPOINTMENT, OBJ_ACL_POLICY. Actions: edit profile, manage branding, manage agents, view relationships/appointments/marketplaces. Drawer: relationship summary, audit. ACL: local admin vs platform admin. Priority P0 (anchors the Agency workspace proof).

**SCR_AGENT_PROFILE** — Agent Profile · **P1-L**. Objects: OBJ_USER, OBJ_ROLE. Actions: edit, manage licenses/NPN, assign products/marketplaces, set commission visibility. Drawer: license/appointment readiness. ACL: commission visibility flag. Priority P1.

**SCR_RELATIONSHIP_GRAPH** — Relationship Graph · **P1-L / M2** (M1REC-006). Objects: OBJ_ENTITY_RELATIONSHIP. Actions: view parent/child/upline/downline/partner/shared-paper links, add/revoke. Drawer: what a relationship grants. Priority P2.

**SCR_ENTITY_LIST [PROV]** — Entity/Agency List · WS_PLATFORM_ADMIN/WS_AGENCY · MOD_AGENCY_ENTITY · **P1-L**. Basis: IA object patterns require a list pattern for every record type; the inventory names the profile but not the list. Actions: search, filter by relationship/state/status, create entity. Priority P2, provisional.

**SCR_LICENSE_MGMT [PROV]** — Licensing & NPN Management · WS_AGENCY/WS_PLATFORM_ADMIN · MOD_AGENCY_ENTITY · **P1-L**. Basis: Blueprint licensing scope; IA folds licensing into agent profile. Actions: track licenses/appointments by state/carrier, expiry alerts. Priority P3, provisional — confirm whether this stays inside SCR_AGENT_PROFILE.

### 4.7 Appointments, Paper and Referrals (nested — M1REC-007)

**SCR_APPOINTMENT_CONFIG** — Carrier Appointment Configuration · WS_AGENCY/WS_PLATFORM_ADMIN/WS_CARRIER · **M2**. Objects: OBJ_APPOINTMENT. Actions: add appointment by carrier/state/product/NPN, set visibility (public/private/partner/downline). Drawer: what visibility implies downstream. Priority P1.

**SCR_PAPER_SHARING_CONFIG** — Paper Sharing Configuration · **M2** (M1REC-008). Objects: OBJ_PAPER_ACCESS_GRANT. Actions: grant/revoke recursive access, write-on-paper, NPN override, revenue split. Drawer: recursion preview, audit. ACL: high sensitivity. Priority P1.

**SCR_REFERRAL_CONFIG** — Referral Reward Configuration · WS_AGENCY/WS_PLATFORM_ADMIN/WS_PARTNER · **M2**. Objects: OBJ_REFERRAL_AGREEMENT. Actions: define destination, reward terms, product/carrier limits. Priority P2.

**SCR_PAPER_ACCESS_REQUEST [PROV]** — Paper Access Request & Approval · WS_AGENCY · MOD_APPOINTMENTS_PAPER · **M2**. Basis: M1REC-008 names access request as part of paper sharing but the inventory has no request surface. Actions: request access, approve/deny, track. Priority P2, provisional.

### 4.8 Commissions (M2CAND-004)

**SCR_COMMISSION_SCHEDULE** — Commission Schedule Setup · WS_AGENCY/WS_PLATFORM_ADMIN/WS_CARRIER · **P1-L** (M1REC-009). Objects: OBJ_COMMISSION_SCHEDULE, OBJ_COMMISSION_RULE. Actions: define PMPM/PEPM/flat/PCPM, contingent, override, bonuses, splits. Drawer: rule precedence explanation. ACL: highly restricted. Priority P1.

**SCR_COMMISSION_PROJECTION** — Commission Projection View · WS_AGENT/WS_AGENCY/WS_PLATFORM_ADMIN · **P1-L**. Objects: OBJ_COMMISSION_PROJECTION. Actions: view projected revenue by quote/cart/policy. ACL: agent-level visibility flag decides whether the module appears at all. Priority P2.

**SCR_COMMISSION_STATEMENTS** — Commission Statements/Reports · **P1-L**. Objects: OBJ_COMMISSION_STATEMENT. Actions: filter by agency/agent/policy/carrier, export. Priority P2. Payment tracking, reconciliation, chargebacks stay Phase 2 (**SEAM**).

### 4.9 Notifications, Communications and Scheduling

**SCR_NOTIFICATION_TEMPLATES** — Notification Templates · WS_AGENCY/WS_PLATFORM_ADMIN · **P1-L** (M1REC-012). Objects: OBJ_NOTIFICATION. Actions: edit email/SMS/in-app templates, branding, triggers, consent rules, test send. Priority P2.

**SCR_SCHEDULER** — Scheduler · **P1-L**. Objects: OBJ_SCHEDULED_JOB. Actions: create time-based/delayed/recurring/event jobs, view runs. Priority P2.

**SCR_NOTIFICATION_CENTER [PROV]** — Notification Center · all internal workspaces · MOD_COMMUNICATIONS · **P1-L**. Basis: shell requires a full-page target behind the top-bar bell. Actions: read, filter, mark read, act. Priority P1, provisional.

### 4.10 Outputs, Documents and Reporting

**SCR_OUTPUT_STUDIO** — Output/Document Templates · WS_AGENCY/WS_PLATFORM_ADMIN · **P1-L** (M1REC-013). Objects: OBJ_DOCUMENT. Actions: configure quote packets, comparison packs, application summaries, submission packets. Priority P2.

**SCR_REPORTING_HOME** — Reporting Home · WS_AGENCY/WS_AGENT/WS_PLATFORM_ADMIN · MOD_REPORTING · **P1-L**. Objects: aggregate over OBJ_LEAD, OBJ_QUOTE_SESSION, OBJ_COMMISSION_*, OBJ_AUDIT_EVENT, OBJ_AI_INTERACTION. Actions: pick dashboard, filter, drill, export. Drawer: metric definitions. ACL: data scope by entity/relationship. Priority P1.

**SCR_DOCUMENT_LIBRARY [PROV]** — Document Library · WS_AGENCY/WS_AGENT/WS_MEMBER · MOD_OUTPUTS_DOCS · **P1-L**. Basis: OBJ_DOCUMENT needs a list pattern; the inventory names templates but not stored output browsing. Priority P3, provisional.

### 4.11 AI, Plan O and Governance

**SCR_AI_GOVERNANCE** — AI Governance Record · WS_PLATFORM_ADMIN · **P1-L** (M1REC-014). Objects: OBJ_AI_WORKER, OBJ_AI_GOVERNANCE_RECORD. Actions: register model/instructions/guardrails, version prompts, run tests, approve, review logs. Priority P1.

**SCR_PLANO_CONFIG** — Plan O Configuration · WS_PLATFORM_ADMIN/WS_AGENCY · **P1-L**, but must not alter Module 1 Plan O guardrails. Objects: OBJ_AI_WORKER. Actions: enable/disable, edit disclaimers, set knowledge sources, escalation, voice/text controls. Priority P2.

**SCR_AI_INTERACTION_LOG [PROV]** — AI Interaction Log · WS_PLATFORM_ADMIN · MOD_AI · **P1-L**. Basis: OBJ_AI_INTERACTION exists and SCR_AI_GOVERNANCE references logs without a dedicated log surface. Priority P3, provisional.

### 4.12 Admin, Configuration, Integrations and Audit (M2CAND-005)

**SCR_WHITE_LABEL_CONFIG** — White Label Configuration · WS_AGENCY/WS_PLATFORM_ADMIN · **P1-L** (M1REC-005). Objects: OBJ_TENANT, OBJ_MARKETPLACE. Actions: set logo/colors/copy/footer/disclaimers/legal/contact, preview. Drawer: guardrail limits. Priority P1.

**SCR_SELLABILITY_RULES** — Sellability Decision Configuration · WS_PLATFORM_ADMIN/WS_AGENCY · **P1-L**. Objects: OBJ_PRODUCT, OBJ_APPOINTMENT, OBJ_ACL_POLICY. Actions: define outcomes (view/quote/buy/route/refer/unavailable/continue-to-EDE), test a scenario. Drawer: rule trace. Priority P1 — this screen governs behaviour on nearly every consumer screen.

**SCR_ROUTING_RULES** — Routing Rules · **P1-L**. Objects: OBJ_LEAD, OBJ_ENTITY. Actions: configure assignment by marketplace/product/geography/language/workload, set fallback. Priority P2.

**SCR_ACL_CONFIG** — ACL Configuration · WS_PLATFORM_ADMIN/WS_AGENCY · **P1-L**. Objects: OBJ_ROLE, OBJ_ACL_POLICY. Actions: define global/local roles, permissions, action controls within guardrails. Drawer: effective-permission preview. Priority P1.

**SCR_FEATURE_FLAGS** — Feature Flags · WS_PLATFORM_ADMIN · **P1-L**. Actions: toggle features/modules by tenant/workspace/module. Priority P2.

**SCR_INTEGRATIONS** — Integration Management · WS_PLATFORM_ADMIN · **P1-L**. Objects: OBJ_RATE_SOURCE and integration configs. Actions: configure Ideon, JET EDE, EDI/API hook, payment seam, notification vendors; test; view health. Priority P2.

**SCR_AUDIT_LOG** — Audit Log · WS_PLATFORM_ADMIN/WS_AGENCY · **P1-L**. Objects: OBJ_AUDIT_EVENT. Actions: filter, inspect, export. ACL: permission-controlled visibility, impersonation events highlighted. Priority P2.

**SCR_HELP_CONFIG** — Help/FAQ/Page Guidance Config · WS_PLATFORM_ADMIN/WS_AGENCY · **P1-L**. Actions: author right-drawer content, FAQs, copilot knowledge, page guidance per screen. Priority P1 — it is the content source for the drawer and assistant on every screen.

**SCR_TENANT_MARKETPLACE_SETUP [PROV]** — Tenant & Marketplace Setup · WS_PLATFORM_ADMIN · MOD_ADMIN_CONFIG · **P1-L**. Basis: the JET Platform Workspace lists "Tenant/Marketplace Setup" as a key module but the inventory has no screen. Objects: OBJ_TENANT, OBJ_MARKETPLACE. Priority P1, provisional.

**SCR_GLOBAL_SEARCH_RESULTS [PROV]** — Global Search Results · all internal · MOD_ADMIN_CONFIG (shell) · **P1-L**. Basis: shell rule. Priority P2, provisional.

**SCR_PROFILE_SETTINGS [PROV]** — Profile & Settings · all internal · shell · **P1-L**. Basis: shell rule. Priority P2, provisional.

### 4.13 Workspace home screens

**SCR_MEMBER_HOME** — Member Workspace Home · WS_MEMBER · MOD_MY_WORK · **M1 as first slice** (M1PROT-005 / M1REC-015 — Module 1 dashboard/resume becomes the first Member Workspace slice and must not be redesigned now); expansion is **P1-L**. Objects: OBJ_QUOTE_SESSION, OBJ_CART, OBJ_APPLICATION, OBJ_TASK, OBJ_NOTIFICATION, OBJ_DOCUMENT. Actions: resume quote, view cart, track application, message agent, refresh stale quote. Priority P1 (as-built for the Module 1 slice, new design only for additive areas).

**SCR_PLATFORM_HOME [PROV]** — JET Platform Workspace Home · WS_PLATFORM_ADMIN · MOD_MY_WORK · **P1-L**. Priority P1, provisional.

**SCR_AGENCY_HOME [PROV]** — Agency Workspace Home · WS_AGENCY · MOD_MY_WORK · **P1-L**. Priority P0, provisional — needed for the Agency workspace proof.

**SCR_CARRIER_HOME [PROV]** — Carrier Workspace Home · WS_CARRIER · MOD_MY_WORK · **SEAM/P1-L**. Narrow: products, appointments, commission schedules, documents. Priority P3, provisional — full carrier self-service is explicitly later.

**SCR_PARTNER_HOME [PROV]** — Partner/Referral Workspace Home · WS_PARTNER · MOD_MY_WORK · **SEAM**. Referral links, referred lead status, reward terms. Priority P3, provisional.

**SCR_PARTNER_REFERRAL_TRACKING [PROV]** — Referral Tracking · WS_PARTNER · MOD_APPOINTMENTS_PAPER · **SEAM**. Priority P3, provisional.

**SCR_MEMBER_MESSAGES [PROV]** / **SCR_MEMBER_DOCUMENTS [PROV]** — Member Messages / Member Documents · WS_MEMBER · **P1-L**. Basis: the IA workspace record lists Messages and Documents as member modules without dedicated screens. Priority P3, provisional.

### 4.14 Employer/Group and ICHRA

**SCR_EMPLOYER_HOME [PROV]** — Employer/Group Workspace Home · WS_EMPLOYER_GROUP · MOD_MY_WORK · **SEAM** (Phase 1 foundation only). Priority P3, provisional.

**SCR_ICHRA_QUOTE [PROV]** — ICHRA Quote · WS_EMPLOYER_GROUP/WS_AGENT · MOD_MARKETPLACE_SALES · **P1-L** (M1REC-011 — ownership between Module 2 and a later Phase 1 packet is undecided). Objects: OBJ_ENTITY, OBJ_HOUSEHOLD, OBJ_MEMBER, OBJ_QUOTE_SESSION. Actions: build census, set affordability inputs, quote, output. Priority P2, provisional — this is a Blueprint Phase 1 capability with no IA screen, and it needs a ruling.

---

## 5. Protected Module 1 screen list (do not redesign)

Governed by M1PROT-001..009 and RULE-M1REC-001. Shell placement is the only permitted change; canvas content, field sets, step order, states, and copy intent are frozen.

| Screen | Protected by |
|---|---|
| SCR_CONS_LANDING, SCR_PRODUCT_SELECT (IFP paths), SCR_ELIGIBILITY_INTAKE | M1PROT-001 |
| SCR_QUOTE_RESULTS, SCR_PLAN_DETAIL, SCR_PLAN_COMPARE | M1PROT-001 |
| SCR_CART_REVIEW (without payment), SCR_REGISTRATION | M1PROT-001, M1REC-010 |
| SCR_PLANO_GUIDED_INTAKE and Plan O guardrails/disclaimers/escalation | M1PROT-002, M1REC-014 |
| SCR_AGENT_QUICK_QUOTE | M1PROT-003 |
| SCR_SHARED_QUOTE_VIEW | M1PROT-004 |
| SCR_MEMBER_HOME (Module 1 dashboard/resume slice only) | M1PROT-005, M1REC-015 |
| SCR_SCHEDULE_HELP and the Module 1 notification baseline | M1PROT-006 |
| Module 1 minimal agency configuration surfaces (branding basics, product availability, Plan O on/off, expirations, channel enablement, routing fallback, availability, disclosure copy, demo/live mode) | M1PROT-007 |
| SCR_EDE_HANDOFF_REVIEW and the EDE boundary | M1PROT-008 |
| Compliance and audit guardrails on all of the above (no-PHI URL, consent, QHP display, audit logging) | M1PROT-009 |

Anything that would change these is written as a delta and approved before a wireframe moves.

## 6. Broader Phase 1 screen list (new design required)

Not in Module 1; needed for complete Phase 1 wireframes.

- **Shell (all provisional IDs):** SHELL_TOPBAR, SHELL_WS_SWITCH, SHELL_ENTITY_SWITCH, SHELL_SEARCH, SHELL_NOTIFS, SHELL_TASKS, SHELL_LEFTNAV, SHELL_DRAWER, SHELL_ASSISTANT, SHELL_PROFILE.
- **Enrollment (M2CAND-001):** SCR_OFFEX_ENROLL_START, SCR_DYNAMIC_FORM, SCR_DOC_UPLOAD, SCR_ESIGN, SCR_PAYMENT_CAPTURE, SCR_SUBMISSION_REVIEW, SCR_SUBMISSION_STATUS, SCR_FORM_BUILDER, SCR_FORM_PREVIEW.
- **Products (M2CAND-002):** SCR_PRODUCT_CATALOG, SCR_PRODUCT_BUILDER, SCR_RATE_SOURCE.
- **Agency/appointments/paper (M2CAND-003):** SCR_AGENCY_PROFILE, SCR_AGENT_PROFILE, SCR_RELATIONSHIP_GRAPH, SCR_ENTITY_LIST, SCR_LICENSE_MGMT, SCR_APPOINTMENT_CONFIG, SCR_PAPER_SHARING_CONFIG, SCR_REFERRAL_CONFIG, SCR_PAPER_ACCESS_REQUEST.
- **Commissions (M2CAND-004):** SCR_COMMISSION_SCHEDULE, SCR_COMMISSION_PROJECTION, SCR_COMMISSION_STATEMENTS.
- **CRM depth:** SCR_LEAD_LIST, SCR_LEAD_DETAIL, SCR_CUSTOMER_360, SCR_TASKS, SCR_AGENT_MY_WORK.
- **Communications/outputs/reporting (M2CAND-006):** SCR_NOTIFICATION_TEMPLATES, SCR_SCHEDULER, SCR_NOTIFICATION_CENTER, SCR_OUTPUT_STUDIO, SCR_REPORTING_HOME, SCR_DOCUMENT_LIBRARY.
- **Admin/config (M2CAND-005):** SCR_WHITE_LABEL_CONFIG, SCR_SELLABILITY_RULES, SCR_ROUTING_RULES, SCR_ACL_CONFIG, SCR_FEATURE_FLAGS, SCR_INTEGRATIONS, SCR_AUDIT_LOG, SCR_HELP_CONFIG, SCR_TENANT_MARKETPLACE_SETUP, SCR_GLOBAL_SEARCH_RESULTS, SCR_PROFILE_SETTINGS.
- **AI:** SCR_AI_GOVERNANCE, SCR_PLANO_CONFIG, SCR_AI_INTERACTION_LOG.
- **Workspace homes and seams:** SCR_PLATFORM_HOME, SCR_AGENCY_HOME, SCR_CARRIER_HOME, SCR_PARTNER_HOME, SCR_PARTNER_REFERRAL_TRACKING, SCR_MEMBER_MESSAGES, SCR_MEMBER_DOCUMENTS, SCR_EMPLOYER_HOME, SCR_ICHRA_QUOTE.

Totals: 53 published IA screens + 10 shell regions + 19 provisional screens = 82 wireframe targets, of which 12 are protected Module 1 surfaces.

## 7. Items needing your ruling before wireframing

1. Ratify or rename the 19 provisional `[PROV]` screen IDs and the 10 `SHELL_*` region IDs so they enter the permanent registry.
2. ICHRA quote ownership (M1REC-011): Module 2 or a later Phase 1 packet.
3. Product Builder detail is blocked on the separate product configuration specs (M1REC-004) — draw provisional or hold.
4. Payment and e-signature vendors are undecided — I plan to draw both as abstracted seams.
5. Confirm whether licensing gets its own screen or stays inside SCR_AGENT_PROFILE.
