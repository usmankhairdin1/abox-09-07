# ABox Design Charter — Locked Sources and Design Rules (Pre-Wireframe)

No visuals are produced under this plan. Its only output is a locked, written charter that governs every later wireframe batch.

## 1. Locked source hierarchy (in my words)

| Rank | Package | What it decides | What it must never be used for |
|---|---|---|---|
| 1 | North Star Package | Why ABox exists and where it is going: insurance distribution operating platform, marketplace of marketplaces, graph-based org/relationship model, AI posture, service and architecture guardrails. It is the tie-breaker on direction. | Screen layout, field lists, Phase 1 scoping calls. |
| 2 | Phase 1 Blueprint Deck | The full Phase 1 capability surface: D2C and agent-assisted shopping, agency/parent relationships, IFP on and off exchange, ancillary, ICHRA quoting, leads, form configurator, governance, licensing, reporting, outputs, integrations, B2B2C paper sharing, commissions, AI overlay. It defines what counts as "in Phase 1". | Deciding structure or navigation, or reopening Module 1 detail. |
| 3 | Phase 1 IA Handoff Package | How Phase 1 is structured and expressed: workspaces, modules, navigation, shell regions, page and object patterns, ACL model, configuration/white-label points, data flow, screen inventory with stable SCR IDs. This is the structural authority for all new wireframes. | Adding or removing capabilities, or rewriting Module 1 behaviour. |
| 4 | Module 1 V4 Hardening Package | Detailed, already-hardened Module 1 screens, states, and flows: shopping, Plan O, quote, results, compare, cart, registration, shared quote, agent quick quote, dashboard/resume, notifications, minimal agency config, EDE handoff. Authoritative for Module 1 behaviour. | Inferring Phase 1 scope, or as a model for non-Module-1 screens. |
| 5 | Module 1 Reconciliation Package | The boundary referee: what Module 1 already covers, what is protected, and how each broader Phase 1 gap is classified as Module 2 or a later Phase 1 packet. | Changing Module 1 requirements or inventing new capabilities. |

Resolution order in practice: direction conflicts resolve upward (North Star wins); scope conflicts resolve to the Blueprint; structure conflicts resolve to the IA package; Module 1 behaviour conflicts resolve to Module 1 V4; and any question of "does this belong in Module 1 or later" resolves to Reconciliation.

Supporting artifacts (Product Architecture and Module Sequencing pack, Source of Truth and Delta Control doc, Decision Register) are treated as governance inputs, not as a sixth source of scope. The Source of Truth doc's rules are adopted: stable IDs are permanent, never reused; retired items are marked Retired, not deleted; every change is logged as a delta with Add / Modify / Remove / Clarify / Supersede / Defer.

## 2. Locked design rules (in my words)

Structure
- ABox is workspace-based. There is no Agent Portal, Agency Portal, Carrier Portal, or Admin Portal as a separate product. A workspace changes context, menu, data scope, labels, defaults, and available actions inside one platform.
- One unified internal shell for all internal users, with modules revealed by permission rather than by product.
- The consumer marketplace is a separate, externally branded, deliberately simplified experience, not the internal shell in disguise.
- Registered consumers/members get a branded Member Workspace, distinct from the anonymous shopping surface.

Internal shell regions (fixed for every internal screen)
- Top global bar: workspace switcher, entity switcher, global search, notifications, tasks, AI assistant entry, profile.
- Left navigation: modules and sub-modules, filtered by ACL and workspace.
- Main canvas: the page pattern (list, record, wizard, dashboard, configurator).
- Right context drawer: page context, object summary, guidance, help, audit/history, next actions.
- Bottom-right assistant: chatbot help, FAQs, copilot-style assistance, contextual to the current page and object.

Configurability
- Menu labels, workspace labels, entity labels, branding, help content, FAQs, available actions, feature flags, and ACL are all admin-configurable within global guardrails. Wireframes must therefore show label and content slots, never hardcoded copy presented as fixed, and each configurable element is annotated with its configuration point.

Access and safety on every screen
- Every screen is drawn in an ACL-aware way: workspace context, entity access, relationship rules (agency/parent/downline), product access, sellability rules, and sensitive-data handling. Each screen gets an explicit note on what is hidden, masked, read-only, or absent for a lesser-permissioned viewer, plus the empty/denied state.

## 3. Contradictions and tensions found in the files

1. Hierarchy vs. the packages' own Source of Truth doc. Your ranking puts the IA package at 3, above Module 1 V4 at 4. `ABox_Source_of_Truth_and_Delta_Control_v1.0.md` states the IA baseline "supersedes earlier informal IA assumptions only" and explicitly that the Module 1 V4 packet is "not superseded by IA package", with a standing "Module 1 protection rule". Read together: IA outranks Module 1 for structure, Module 1 still outranks IA for its own screen behaviour. I will operate on that split reading unless you rule otherwise.
2. Blueprint is marked "not superseded by IA package" as executive scope, while the IA package carries the screen inventory. So the Blueprint can name a Phase 1 capability that has no IA screen yet. Those are gaps to log, not licence to invent structure.
3. Stable-ID collision inside the SCR family. Module 1 V4 uses `SCR-001`…`SCR-028` for behavioural specs; the IA inventory uses semantic IDs such as `SCR_CONS_LANDING`. Same declared ID family, two incompatible formats. I will always qualify IDs by package (`M1:SCR-014`, `IA:SCR_CONS_LANDING`) and never merge the two numbering spaces.
4. Module 1 already ships clickable wireframes (`ABox_Module1_Clickable_Wireframes_Final.pptx`) authored before the IA shell was locked. Any Module 1 screen redrawn inside the new shell risks reading as a redesign. Treated as a hard constraint in section 4.
5. "No hardcoded portals" is stated as a rule in both the IA package and the Reconciliation package, yet portal-shaped language persists in role framing across the older material. Rule wins; language gets normalised to workspaces.
6. Open decisions remain unresolved in the Decision Register / reconciliation open questions (Module 2 packaging, product configuration specifics, and related items). These will be drawn as annotated "decision pending" surfaces rather than guessed, subject to your instruction.

## 4. How Module 1 is protected from accidental expansion or redesign

- Frozen baseline. Before any Module 1 screen is touched, its Module 1 V4 spec and existing wireframe are the reference. The Module 1 canvas content, field set, step order, states, and copy intent stay as specified.
- Shell-only adaptation. For Module 1 screens the only permitted change is placing the existing canvas inside the locked shell regions. Shell chrome is additive; it does not relabel, reorder, or re-scope what is inside the canvas.
- Two-register screen list. Every wireframe is tagged `MODULE_1_PROTECTED`, `PHASE_1_NEW`, or `DEFERRED (Module 2 / later packet)`. Nothing gets built without a tag.
- Reconciliation as the gate. If a Phase 1 capability wants to appear on a Module 1 screen, it is checked against the Reconciliation package's gap classification. If it is classified as Module 2 or later, it is not drawn on the Module 1 screen; it becomes its own deferred entry.
- Delta discipline. Any genuinely necessary Module 1 change is not made silently. It is written as a delta (affected IDs, current state, proposed state, classification, reason, impact on wireframes/build/QA/compliance) and surfaced to you for approval before the wireframe changes.
- No new Module 1 IDs. New screens receive new Phase 1 IA IDs. The Module 1 `SCR-###` space is closed.
- Self-check per batch. Each batch is reviewed against the package's own preflight checklist: what governs this batch, what active build packets must not be disturbed, which locked decisions apply, which IDs are reused vs. new, and what is explicitly not superseded.

## 5. What this plan produces

Approving this plan locks sections 1, 2, and 4 as the standing charter for all later wireframe work, and records the section 3 contradictions as items awaiting your rulings. No screens, no visuals, no code. The next step waits on your instruction for the first wireframe batch, its fidelity, and its delivery format.
