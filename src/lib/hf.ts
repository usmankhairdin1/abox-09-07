/**
 * Batch 1 — higher-fidelity wireframes for the ABox Phase 1 core experience
 * foundation. These are visual-fidelity screens built on the proposed design
 * system direction (.lovable/design-system.md). Low-fidelity structure at /m1
 * and /p1 stays untouched and remains the scope-of-record.
 *
 * Every screen carries four annotation tracks: design decisions, ACL behavior,
 * configuration points, and source basis.
 */

export type HfShellKind = "internal" | "consumer";

export interface HfScreen {
  id: string;
  slug: string;
  name: string;
  group: string;
  shell: HfShellKind;
  workspace: string;
  module: string;
  user: string;
  purpose: string;
  /** Key visual/interaction decisions taken in this screen. */
  decisions: string[];
  /** What changes for whom, and what disappears rather than greys out. */
  acl: string[];
  /** What an authorized admin can change without a code release. */
  config: string[];
  /** Which package(s) this screen is derived from. */
  source: string;
  /** Protected Module 1 scope vs broader Phase 1 / IA alignment. */
  scope: string;
  /** Batch 2 annotation tracks. */
  objects?: string[];
  dataFlow?: string[];
  assumptions?: string[];
}

/** Groups that belong to batch 2 (broader Phase 1 operations & configuration). */
export const HF_BATCH1_GROUPS = ["Foundation", "Module 1 · consumer", "Module 1 · internal"];

export const HF_BATCH2_GROUPS = [
  "Off-exchange enrollment & forms",
  "Products, plans & rates",
  "Distribution, paper & revenue",
  "Commissions & statements",
  "Operations, configuration & audit",
];

export const HF_SCREENS: HfScreen[] = [
  {
    id: "HF-01",
    slug: "internal-shell",
    name: "Internal platform shell",
    group: "Foundation",
    shell: "internal",
    workspace: "All internal workspaces",
    module: "SHELL",
    user: "Any authenticated internal user",
    purpose:
      "One unified shell for every internal workspace: global bar for workspace, entity, search, notifications, tasks, assistant and profile; left module nav; right context drawer; bottom-right assistant.",
    decisions: [
      "One shell, never separate portals. Workspace switching re-scopes modules, data, labels, defaults and actions inside the same chrome, so a user never re-learns the product when their role widens.",
      "Left nav is modules only, single level. Sub-objects are reached through the object page, not through nested menu trees — this is what keeps an enterprise app from feeling like a legacy admin portal.",
      "Global bar is 52px and monochrome; the brand accent is spent on the primary action in the page body, never on chrome. Active nav state is a filled surface plus a 2px accent rail, not a colored background block.",
      "Right drawer keeps a fixed section order — Context, Summary, Guidance, Help & FAQ, Audit, Next actions — so muscle memory transfers across all 83 Phase 1 screens.",
      "Density is a user preference (comfortable / compact) applied at the shell, not per screen.",
    ],
    acl: [
      "Modules the role cannot access are absent from the nav, never greyed. Absence is the ACL signal.",
      "Entity switcher renders the relationship graph (parent, child, upline, downline, partner), not a flat account list; a user only sees their own subtree.",
      "Audit drawer tab renders only with audit.view. Commissions module disappears entirely when commission.view is off.",
      "Support impersonation renders a persistent banded strip in the global bar and forces audit logging on every action.",
      "Global search results are entity- and ACL-scoped; sensitive fields return masked and out-of-scope objects never appear at all.",
    ],
    config: [
      "Workspace names, module labels and object labels come from the tenant label dictionary (Admin → Labels).",
      "Module visibility per workspace, per role template, plus local ACL overrides at entity level.",
      "Feature flags can remove a module from the shell without a release.",
      "Logo, accent and per-workspace landing page are tenant-configurable; contrast is validated at save time.",
      "Drawer help, page guidance and FAQ content are authored per screen ID in Admin → Help.",
    ],
    source:
      "ABox_Phase1_IA_Handoff_Package_v1.0 (shell, workspaces, navigation, drawer, help model); North Star (workspace model, AI posture).",
    scope: "IA foundation — governs all Phase 1 screens",
  },
  {
    id: "HF-02",
    slug: "my-work",
    name: "My Work",
    group: "Foundation",
    shell: "internal",
    workspace: "WS_AGENCY / WS_AGENT / WS_PLATFORM_ADMIN",
    module: "MOD_MY_WORK",
    user: "Agent, agency manager, agency admin",
    purpose:
      "Role-aware landing page: what needs me today, my pipeline, my tasks and the events I own — assembled from objects the user can already see, never a separate data store.",
    decisions: [
      "Opens with a 'Needs you' band, not a metric wall. Numbers without an action are pushed below the fold.",
      "Four metric cards maximum, single line each, no icon tiles or sparkline decoration. Every metric is clickable into a filtered list.",
      "Work queue rows are 44px with a status chip in a fixed column so the eye scans one vertical line for state.",
      "Status is never color-only: chip carries text plus a shape-distinct dot for accessibility.",
      "Empty state is written per queue and names the next action, e.g. 'No quotes waiting on you — start a quick quote'.",
    ],
    acl: [
      "Agent sees assigned records only; agency manager sees own entity; agency admin sees entity plus downline.",
      "The pipeline card sums only records inside the data-visibility scope — totals never leak downline volume upward beyond permission.",
      "Commission-related widgets are absent for roles without commission.view.",
    ],
    config: [
      "Which cards and queues appear per role template, and their order.",
      "This page can be set as the default landing per workspace or overridden per user in profile preferences.",
      "Queue definitions (filters, SLA thresholds, empty-state copy) are configurable.",
    ],
    source:
      "ABox_Phase1_IA_Handoff_Package_v1.0 (My Work module, page patterns, ACL); Phase 1 Blueprint (lead management).",
    scope: "Broader Phase 1 — foundation",
  },
  {
    id: "HF-03",
    slug: "dashboard",
    name: "Dashboards & analytics",
    group: "Foundation",
    shell: "internal",
    workspace: "WS_AGENCY / WS_PLATFORM_ADMIN",
    module: "MOD_REPORTING",
    user: "Agency admin, agency manager, platform admin",
    purpose:
      "Production, pipeline, attribution and AI-interaction reporting scoped to the current entity subtree, with export and drill-through into the underlying records.",
    decisions: [
      "Scope bar sits above the charts and is always visible: entity, date range, product line, channel. The user can always answer 'what am I looking at'.",
      "Charts are outline-first — thin axes, single accent series, comparison series in neutral. No gradient fills, no 3D, no chart junk.",
      "Every chart has a matching table beneath it; the table is the accessible and exportable representation of the same data.",
      "Loading uses skeletons that match the final layout, so the page does not reflow when data lands.",
      "AI-derived insight rows are visually marked with the AI token and always cite the records they were derived from.",
    ],
    acl: [
      "Attribution and downline breakdowns require hierarchy visibility; a manager sees own entity only and the downline dimension is removed from the scope bar, not disabled.",
      "Commission revenue panels are absent without commission.view.",
      "Export is separately permissioned from view; export events are written to the audit log with the applied scope.",
    ],
    config: [
      "Which dashboards exist per workspace, and which panels each role template can see.",
      "Default date range and default scope per workspace.",
      "Export formats and whether export is enabled for a tenant.",
    ],
    source:
      "ABox_Phase1_IA_Handoff_Package_v1.0 (Dashboards & Analytics shell); Phase 1 Blueprint (reporting, attribution, AI reporting).",
    scope: "Broader Phase 1 — foundation",
  },
  {
    id: "HF-04",
    slug: "marketplace-landing",
    name: "Branded consumer marketplace landing",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer (unauthenticated)",
    purpose:
      "Agency-branded entry point that establishes who is selling, offers guided (PlanAI) or self-directed shopping, and carries required non-government disclosure above the fold.",
    decisions: [
      "Hero + card grid: one clear promise, two shopping entries of equal visual weight, and the licensed-entity line inside the hero rather than buried in the footer.",
      "Guided and Browse are peers. Guided gets the accent fill, Browse gets the outline — a preference, not a lock-out.",
      "Consumer type scale steps up (36/20/16) versus the internal shell; more air, fewer borders, wider radius. Same tokens, different skin.",
      "Trust strip directly under the hero: licensed entity, no cost to use, no obligation, privacy.",
      "No stock-photo hero. Structure and typography carry the brand so any tenant's palette reads correctly.",
    ],
    acl: [
      "Public and unauthenticated. Nothing here reveals agency internals, agent lists, commission data or other tenants.",
      "Which products appear is driven by marketplace configuration plus sellability rules for the visitor's state.",
    ],
    config: [
      "Logo, brand color, typography scale, hero headline and subhead, imagery, and CTA labels per marketplace.",
      "Which entries are enabled (Guided on/off via FLAG_PLAN_O), product tiles shown, footer disclosure blocks (required blocks cannot be removed).",
      "Consumer help bubble FAQs are per-marketplace content.",
    ],
    source: "ABox_Module1_V4_Hardening_Package (UX-001); IA package for external chrome.",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-05",
    slug: "product-selection",
    name: "Product selection",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "Choose the product line to shop — IFP on-exchange, IFP off-exchange, dental and other configured ancillary lines — with an honest statement of where each path ends.",
    decisions: [
      "Each product card states the path end-state up front (for example: on-exchange finishes on the exchange enrollment site) so the EDE handoff later is never a surprise.",
      "Cards are equal height with identical field slots — name, who it suits, what it covers, what happens next — so they compare as columns.",
      "Unavailable lines are shown as a quiet 'not available in your area' state with the reason, rather than being silently dropped.",
      "Multi-select is not used here; one line starts the quote and additional lines are added later at cart.",
    ],
    acl: [
      "Visible product lines respect marketplace product access, state sellability and effective-date windows.",
      "Off-exchange lines only appear where the agency holds an appointment permitting sale on that paper.",
    ],
    config: [
      "Product tile order, copy, icon, and enable/disable per marketplace.",
      "Ancillary lines are configured, not coded — dental is the minimum proof line, extensibility is the point.",
      "Availability messaging text.",
    ],
    source:
      "ABox_Module1_V4_Hardening_Package (UX-002); Phase 1 Blueprint (product lines, ancillary extensibility).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-06",
    slug: "quote-wizard",
    name: "D2C quote wizard",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "Collect the minimum needed to quote — location and effective date, household members, and an optional subsidy estimate — in a short, resumable, low-anxiety flow.",
    decisions: [
      "One question group per step, a visible 3-step progress rail, and a persistent summary of what has been answered so far.",
      "Wizard column is capped at 720px even on wide screens; long forms in wide columns read as work.",
      "Subsidy step is explicitly optional with a skip that is a real button, not a link — and the results page still works without it.",
      "Validation is inline on blur, never a summary error block at the top after submit.",
      "Save & resume is offered at every step; leaving is a normal outcome, not an abandonment.",
      "Estimates are labeled 'estimate' at the point of the number, not only in a footnote.",
    ],
    acl: [
      "Anonymous-safe. Nothing collected here requires an account, and no SSN or full identity data is requested at quote stage.",
      "Income entered for the subsidy estimate is treated as sensitive: masked in agent-facing views, excluded from exports without permission, and never used outside the estimate.",
    ],
    config: [
      "Which steps and fields appear per marketplace and product line; the subsidy step can be switched off entirely.",
      "Effective-date rules, allowed ZIP/state set, household member limits.",
      "Help text, tooltips and step titles are content-configured.",
    ],
    source: "ABox_Module1_V4_Hardening_Package (UX-004, UX-005, UX-006, UX-007).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-07",
    slug: "plan-o",
    name: "PlanAI guided shopping",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "AI-assisted recommendation view: a small ranked set with a plain-language reason for each, the tradeoff being made, and an always-available exit to the full unfiltered list.",
    decisions: [
      "Recommendations are presented as a ranked short list with a stated reason, never as a single 'best plan' verdict.",
      "Every AI surface is visually grounded with the AI token and a persistent 'how this was ranked' affordance — no invisible AI.",
      "'Show all plans' is a permanent control at the top of the list, not a footer escape hatch. Guidance must never feel like a cage.",
      "The reason line cites the inputs used (budget, doctors, prescriptions, usage) so the ranking is inspectable.",
      "Disclaimer is attached to the recommendation block itself, so it travels with any shared or printed output.",
    ],
    acl: [
      "PlanAI availability is a tenant/marketplace feature flag; when off, the entry disappears and Browse is the only path.",
      "Ranking inputs, prompts and outputs are logged to the AI interaction log for governance review.",
      "The assistant cannot make eligibility determinations or guarantee costs; it escalates to a licensed agent instead.",
    ],
    config: [
      "Ranking weights, number of recommendations, allowed inputs and disclaimer text (Plan-O controls, SCR_PLANO_CONFIG).",
      "Enable/disable per tenant, marketplace and module; knowledge sources are controlled centrally.",
      "Escalation target (request a call, schedule, assign agent).",
    ],
    source:
      "ABox_Module1_V4_Hardening_Package (UX-003, UX-011); North Star (AI posture); Phase 1 Blueprint (AI overlay, governance).",
    scope: "Protected Module 1 scope · configuration owned by Phase 1 AI governance",
  },
  {
    id: "HF-08",
    slug: "plan-results",
    name: "Plan results",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "The full result set with filters, sort, subsidy-applied pricing, and the compare/cart actions — the workhorse screen of Module 1.",
    decisions: [
      "Plan card fields sit in identical slots on every card (premium, deductible, out-of-pocket max, network, carrier) so the list scans as a table while reading as cards.",
      "Premium is the largest element on the card; the subsidy-applied figure leads and the gross premium sits beneath it as struck context.",
      "Filters are a left rail on desktop and a bottom sheet on mobile, with applied filters echoed as removable chips above the results.",
      "Compare is a checkbox on the card with a docked bar that appears at 2 selections and states the maximum.",
      "Result count and applied scope are stated in text above the list — never only implied by the filter rail.",
      "Skeleton cards preserve the exact card geometry during rate loading.",
    ],
    acl: [
      "Result set is filtered by state sellability, effective date, marketplace product access and paper access before ranking.",
      "Internal-only fields — commission, override, paper owner — are never rendered on the consumer surface, at any role.",
      "The same results screen viewed by an agent in assisted mode may add internal context, which is a separate agent-mode variant, not a consumer capability.",
    ],
    config: [
      "Which filters and sorts exist, default sort, card fields shown, and badge rules per marketplace.",
      "Disclaimer and estimate copy; whether subsidy-applied pricing is shown.",
      "PlanAI badge on ranked plans is toggled with the PlanAI flag.",
    ],
    source: "ABox_Module1_V4_Hardening_Package (UX-008, UX-009, UX-010).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-09",
    slug: "plan-compare",
    name: "Compare plans",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "Side-by-side comparison of up to three plans across a fixed attribute set, with differences made obvious and a direct path to cart.",
    decisions: [
      "Attribute labels are a sticky first column and plan headers are sticky on scroll, so context never leaves the viewport.",
      "A 'highlight differences' toggle dims identical rows instead of hiding them — the user stays oriented in the full attribute list.",
      "The best value in each numeric row is marked with a subtle accent underline and a text label, not color alone.",
      "Maximum of three plans on desktop, two on mobile; the constraint is stated before it is hit.",
      "Every column keeps its own Add to cart action so the decision can be acted on without scrolling back.",
    ],
    acl: [
      "Comparison is built from the same ACL-filtered result set; a plan the visitor cannot buy can never enter the compare tray.",
      "Shared or exported comparisons carry the same disclosure blocks as the on-screen version.",
    ],
    config: [
      "Comparison attribute set and row order per product line.",
      "Maximum compare count.",
      "Whether comparison output can be emailed or downloaded (ties to the outputs module).",
    ],
    source:
      "ABox_Module1_V4_Hardening_Package (UX-012); Phase 1 Blueprint (benefit comparison output).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-10",
    slug: "cart",
    name: "Cart",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "Hold the selected medical plan plus any ancillary lines, show the combined monthly cost, and route each line to its correct next step.",
    decisions: [
      "The cart is multi-line by design — this is the seam that makes ancillary and off-exchange lines work later without a redesign.",
      "Each line states its own next step and owner, because an on-exchange line finishes on the exchange while a dental line finishes in ABox. One cart, two destinations, stated plainly.",
      "Total is a summary of monthly cost, with each line itemized; estimate language is attached to any subsidy-dependent figure.",
      "Add-on suggestions are a quiet secondary row, never an interstitial or a pre-checked upsell.",
      "Removing a line is immediate with an undo, not a modal confirmation.",
    ],
    acl: [
      "Lines are re-validated against sellability and effective date at cart load; a line that became unavailable is flagged in place with the reason rather than vanishing.",
      "No pricing internals (commission, split, override) render on this surface.",
    ],
    config: [
      "Which ancillary lines can be cross-sold and their suggestion rules.",
      "Whether checkout requires registration before or after review (registration gate placement).",
      "Cart copy and next-step descriptions per product line.",
    ],
    source: "ABox_Module1_V4_Hardening_Package (UX-013); Phase 1 Blueprint (ancillary lines).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-11",
    slug: "registration-gate",
    name: "Registration / login gate",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "Convert an anonymous shopper into a member account at the last responsible moment, preserving the cart and explaining exactly why an account is needed.",
    decisions: [
      "The gate leads with what the user gets — saved quote, resume later, documents in one place — before it asks for anything.",
      "Cart summary stays visible beside the form so the user can see nothing was lost.",
      "Minimum viable fields only: name, email, password, phone optional. Identity verification belongs to enrollment, not to registration.",
      "Sign in and create account are one panel with a toggle, not two competing pages.",
      "Consent checkboxes are separate, unchecked, and specific — contact consent is never bundled into terms acceptance.",
    ],
    acl: [
      "Creates a member identity in the consumer/member workspace, associated to the originating marketplace, agency and (if any) agent.",
      "Attribution captured here drives lead ownership and later revenue splits; it is written once and is audited.",
      "Password and credential handling never surfaces in agent-facing views.",
    ],
    config: [
      "Gate placement (before review vs before submit), required fields, consent text and channels.",
      "Whether social/one-time-code sign-in is offered per marketplace.",
      "Branded confirmation and welcome message templates.",
    ],
    source: "ABox_Module1_V4_Hardening_Package (UX-014); IA package (Member Workspace).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-12",
    slug: "ede-handoff",
    name: "On-exchange EDE handoff explanation",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer",
    purpose:
      "Explain, before any redirect, that the on-exchange application completes through the enhanced direct enrollment partner — what carries over, what will be asked, and how to come back.",
    decisions: [
      "This is a full interstitial, never a modal or a toast. A handoff that changes who holds the application deserves a page.",
      "Three explicit blocks: what happens next, what carries over, what you will need — in that order, before the continue button.",
      "The destination is named in text next to the continue action; the user is never redirected to an unnamed third party.",
      "A visible 'come back here' explanation with the resume path, so the round trip is understood as part of one journey.",
      "Continue is a single primary action; the secondary is 'talk to a licensed agent', not a dead-end back button.",
    ],
    acl: [
      "The consumer keeps agency and agent attribution across the handoff; the association is written before redirect and audited.",
      "No PII beyond what the handoff contract requires leaves the platform; the transferred payload is logged.",
      "Post-handoff status is read back into the lead timeline where the integration supports it; where it does not, the timeline says so rather than implying a status.",
    ],
    config: [
      "Handoff partner, destination label, explanatory copy and disclosure blocks per marketplace/state.",
      "Whether the handoff opens in the same tab or a new one; return-path messaging.",
      "Agent escalation target for the secondary action.",
    ],
    source:
      "ABox_Module1_V4_Hardening_Package (UX-016); Reconciliation package (EDE stays a handoff in Module 1).",
    scope: "Protected Module 1 scope — no on-platform on-exchange enrollment",
  },
  {
    id: "HF-13",
    slug: "shared-quote",
    name: "Shared quote (read-only)",
    group: "Module 1 · consumer",
    shell: "consumer",
    workspace: "WS_CONSUMER_MARKETPLACE (shared link)",
    module: "MOD_MARKETPLACE_SALES",
    user: "Consumer recipient of an agent-prepared quote",
    purpose:
      "A branded, link-accessible, read-only view of a quote an agent prepared, with the preparing agent identified and a single clear way to act on it.",
    decisions: [
      "'Prepared for you by' is the first thing on the page — agent name, license line, contact, and when it was prepared.",
      "Read-only is expressed structurally: no filters, no sort, no editable fields. Nothing looks interactive that is not.",
      "A validity date is stated on the quote, and an expired link renders a specific expired state with a re-request action — never a generic error.",
      "The chrome is stripped of marketplace navigation so the link stays focused on the one decision.",
      "Actions are limited and unambiguous: continue this quote, ask a question, request a call.",
    ],
    acl: [
      "Link-scoped access with no login: the token grants read access to this quote only and never exposes the agent's book, other clients or internal fields.",
      "Views and actions are written to the quote timeline so the agent sees engagement.",
      "Expiry and revocation are enforced server-side; a revoked link cannot be re-opened from cache.",
    ],
    config: [
      "Link validity window, whether re-request is allowed, and the branded template used.",
      "Which fields appear on the shared view.",
      "Notification templates fired on send, on first view, and on action.",
    ],
    source:
      "ABox_Module1_V4_Hardening_Package (UX-017, UX-021); Phase 1 Blueprint (shared quote notifications).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-14",
    slug: "agent-quick-quote",
    name: "Agent quick quote",
    group: "Module 1 · internal",
    shell: "internal",
    workspace: "WS_AGENT / WS_AGENCY",
    module: "MOD_MARKETPLACE_SALES",
    user: "Licensed agent",
    purpose:
      "Produce a quote on a phone call in under a minute: minimal inputs, immediate results, and one action to send it as a shared quote.",
    decisions: [
      "Single-screen, no wizard. The agent is on a call — steps cost time, so inputs and results share the viewport.",
      "Input rail is left, results are right, and results refresh in place as inputs change. No submit-and-wait page transition.",
      "Keyboard-first: tab order follows the phone conversation, and enter from any field re-quotes.",
      "The send action is always visible in the page header, not at the end of the result list.",
      "Internal context the consumer never sees — paper, appointment status, projected commission where permitted — appears in the right drawer, deliberately outside the quote body so it can never leak into a shared output.",
    ],
    acl: [
      "Only products the agent is licensed and appointed to sell are quotable; others are absent with an explanatory drawer note.",
      "Projected commission renders only with commission.view; without it the drawer section is absent, not zeroed.",
      "Quote is created under the agent's entity with attribution recorded for later splits; agents cannot re-attribute their own quotes.",
      "Sending a quote to a consumer is logged with recipient, channel and timestamp.",
    ],
    config: [
      "Which fields appear in the quick-quote rail per product line.",
      "Default effective date logic and default sort of results.",
      "Send channels (email, SMS), templates and branding.",
    ],
    source:
      "ABox_Module1_V4_Hardening_Package (UX-020, UX-021); IA package (internal shell alignment).",
    scope: "Protected Module 1 scope",
  },
  {
    id: "HF-15",
    slug: "lead-detail",
    name: "Lead detail with timeline",
    group: "Module 1 · internal",
    shell: "internal",
    workspace: "WS_AGENCY / WS_AGENT",
    module: "MOD_LEADS_CUSTOMERS",
    user: "Agent, agency manager",
    purpose:
      "The canonical object page: identity header, status, related objects, and a unified timeline of every quote, message, share, view and system event on the record.",
    decisions: [
      "This is the object page framework, proven on the lead object — header, status rail, tabs, related objects, timeline, drawer. Every other object in Phase 1 reuses this exact skeleton.",
      "One timeline, all event types, filterable by type — separate 'notes' and 'activity' tabs are how history gets lost.",
      "Header carries identity, status, owner and the single most likely next action; secondary actions live in an overflow so the header never becomes a toolbar.",
      "System events, human actions and AI actions are visually distinguished at the marker, and AI entries state which model surface produced them.",
      "Status changes are entries in the timeline, not just a changed field — the record explains itself without opening audit.",
      "Inline edit on the field level with save on blur; no separate edit mode page.",
    ],
    acl: [
      "Agents see assigned leads only; managers see the entity; admins see the entity plus downline. An out-of-scope lead is not found, not forbidden.",
      "Sensitive fields (income entered for subsidy estimate, identity data) render masked with an explicit reveal that is itself audited.",
      "Timeline entries are filtered by the viewer's permission — for example, commission events are absent without commission.view.",
      "Reassignment requires entity.manage and writes an audit entry naming both parties.",
    ],
    config: [
      "Object label ('Lead' / 'Prospect' / 'Opportunity'), status set and status transitions.",
      "Which tabs, related-object panels and timeline event types appear per role template.",
      "Task auto-creation rules from timeline events; notification templates per event.",
    ],
    source:
      "ABox_Phase1_IA_Handoff_Package_v1.0 (object page pattern, timelines); ABox_Module1_V4_Hardening_Package (UX-023 Module 1 timeline events).",
    scope: "Module 1 timeline events protected · object framework is broader Phase 1",
  },

  /* ======================================================== batch 2 — ops */

  {
    id: "HF-16",
    slug: "offex-intake",
    name: "Off-exchange enrollment intake",
    group: "Off-exchange enrollment & forms",
    shell: "internal",
    workspace: "WS_AGENCY / WS_AGENT",
    module: "MOD_FORMS_ENROLLMENT",
    user: "Agent or agency enrollment specialist; consumer can be handed a resumable link",
    purpose:
      "Opens an off-exchange application: confirms the applicant, product and effective date, resolves which carrier form set applies, and starts a saveable submission with a readiness contract visible from the first screen.",
    decisions: [
      "Readiness is shown before work starts, not at the end. The right column carries a live checklist (identity, form set resolved, documents, signature, payment) so the agent never reaches submit and discovers a blocker.",
      "Form resolution is stated in plain language — product + state + carrier + effective date resolved to a named form version — and is a link into the configurator record.",
      "Save & resume is a first-class button in the page header, not a hidden autosave. A resume link with expiry can be sent to the consumer.",
      "Effective date is validated against the product availability window at intake and again at release; a stale answer is never trusted.",
      "Applicant search precedes creation, so intake attaches to an existing lead or member rather than creating a duplicate object.",
    ],
    acl: [
      "enrollment.create scoped to the entity; an agent may only intake against products their agency is enabled for and their agent record is appointed for.",
      "Appointment gap blocks intake with a named reason and an inline 'request to write on paper' action rather than a silent empty product list.",
      "Sensitive applicant fields (SSN, DOB, income) render masked with an audited reveal.",
      "Payment capture appears only with payment.capture; without it the agent sees a 'payment pending' state and the consumer is sent a payment link.",
    ],
    config: [
      "Which products are enrollable off-exchange, per agency and per state.",
      "Readiness checklist composition per product line, and which items hard-block submission.",
      "Resume-link expiry, and whether consumer self-serve resume is enabled for the tenant.",
      "Whether payment is captured at submission or after carrier acceptance.",
    ],
    objects: [
      "Submission (off-exchange application)",
      "Applicant / lead / member",
      "Product + plan + rate version pin",
      "Resolved form set version",
      "Document requirement set",
      "Signature request",
      "Payment intent",
    ],
    dataFlow: [
      "Intake pins the rate version so a later rate load cannot change a quoted premium under a live application.",
      "Product catalog + availability rules are read at intake; the form configurator resolves the form set; neither is authored here.",
      "Creating a submission writes a timeline entry on the lead/member object and can auto-create an agent task.",
      "Submission release emits the EDI template output and/or the API hook call; both are downstream of readiness passing.",
    ],
    assumptions: [
      "Off-exchange is a first-party ABox flow — there is no external EDE-style redirect, so ABox owns the full application record.",
      "Payment front end is capture-and-tokenise only; settlement and reconciliation are out of Phase 1 UI scope.",
    ],
    source:
      "Phase 1 Blueprint (off-exchange enrollment, EDI output, API hook, payment capture); IA Handoff (MOD_FORMS_ENROLLMENT, object page pattern); Reconciliation (off-exchange is explicitly outside Module 1).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-17",
    slug: "dynamic-form",
    name: "Dynamic application form",
    group: "Off-exchange enrollment & forms",
    shell: "internal",
    workspace: "WS_AGENCY / WS_AGENT (agent-assisted) · consumer skin when self-serve",
    module: "MOD_FORMS_ENROLLMENT",
    user: "Agent completing on behalf of an applicant, or the applicant on a resumed link",
    purpose:
      "Renders the resolved carrier form set as a sectioned wizard: conditional questions, per-field validation, document capture, e-signature and a submission readiness gate — all driven by configuration, never by hardcoded screens.",
    decisions: [
      "Left rail is section progress with per-section state (complete, incomplete, blocked). Long carrier forms need a map, and a single stepper cannot carry twenty sections.",
      "Conditional fields appear and disappear in place with a short reason line ('shown because coverage type = family'), which makes a configured form debuggable by a human.",
      "Validation is inline on blur and re-run as a single block at the readiness gate; errors are listed with jump links, never as a toast.",
      "Documents and signature are sections in the same flow, not a separate module, so the applicant experiences one continuous process.",
      "Every page carries the form version identifier in the footer — what was signed must be provable later.",
    ],
    acl: [
      "Field-level ACL: an agent may be blocked from viewing full SSN while still being able to submit; masked-but-required fields are completed by the applicant on a resumed link.",
      "Only enrollment.submit may release the submission; enrollment.review can flag and return but not release.",
      "Signature cannot be applied on behalf of an applicant by any role — signer identity is captured and audited.",
      "Support impersonation may read the form but is blocked from signature and payment actions.",
    ],
    config: [
      "Sections, fields, order, help text, conditional logic and validation rules (all from the configurator).",
      "Which documents are required per product/state, and accepted file types and sizes.",
      "Signature method (typed, drawn, third-party) and whether wet signature upload is allowed as fallback.",
      "Whether the applicant may self-complete sensitive sections via a resume link.",
    ],
    objects: [
      "Form set version",
      "Field definitions + conditional rules",
      "Submission answers",
      "Uploaded documents",
      "Signature record (signer, method, timestamp, IP)",
      "Validation result set",
    ],
    dataFlow: [
      "Answers persist per section so save & resume never loses a partially typed section.",
      "Answers map to EDI template segments and API payload fields through the configurator's mapping layer — the form does not know the transport.",
      "The readiness gate re-evaluates product availability, appointment validity and rate effectiveness at release time.",
      "Signature and document events are written to both the submission timeline and the audit log.",
    ],
    assumptions: [
      "One resolved form set per submission; a mid-application form version change requires an explicit re-resolve with the applicant re-confirming affected sections.",
      "E-signature is captured in-platform for Phase 1; a third-party signature vendor is a later integration.",
    ],
    source:
      "Phase 1 Blueprint (dynamic form flow, document capture, e-signature, readiness checks); IA Handoff (wizard and form patterns).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-18",
    slug: "form-configurator",
    name: "Form configurator",
    group: "Off-exchange enrollment & forms",
    shell: "internal",
    workspace: "WS_PLATFORM_ADMIN (authoring) · WS_AGENCY read-only",
    module: "MOD_FORMS_ENROLLMENT",
    user: "Platform forms administrator; compliance reviewer approves publication",
    purpose:
      "Authors the form library: which form set applies to which product, state and carrier, the fields and sections inside it, conditional logic, required documents, signature settings, validation rules — with preview, versioning and audit.",
    decisions: [
      "Three-pane builder: form tree, field canvas, property inspector. This is the one screen in Phase 1 that earns a builder layout, because it is authoring rather than transacting.",
      "Rules are written as readable sentences ('Show Spouse SSN when Coverage type is Family'), not as a code editor. Configuration must survive a non-engineer author.",
      "Preview renders the exact applicant runtime in the same component set as HF-17, with a test-data harness — a preview that is not the runtime is a lie.",
      "Publishing is a versioned, approved event. Drafts are freely editable; published versions are immutable and can only be superseded.",
      "Impact panel names how many in-flight submissions reference the current version before a publish is allowed.",
    ],
    acl: [
      "forms.author is platform-level; agencies get read-only visibility of which form applies, never editing.",
      "Publication requires a second approver with forms.approve; the author cannot approve their own version.",
      "Deleting a field that has captured answers is blocked outright — it can only be deprecated.",
      "Audit tab is present only with audit.view, and records diff-level changes.",
    ],
    config: [
      "Form resolution rules by product, line, state, carrier, channel and effective date window.",
      "Field types, labels, help text, placeholder, masking and sensitivity classification.",
      "Conditional logic, cross-field validation, and required-document rules.",
      "Signature settings, mapping to EDI segments / API payload keys, and version approval requirement.",
    ],
    objects: [
      "Form set + version",
      "Section",
      "Field definition",
      "Conditional rule",
      "Validation rule",
      "Document requirement",
      "Signature setting",
      "Resolution rule",
      "Publish/approval record",
    ],
    dataFlow: [
      "Resolution rules are read at intake (HF-16) and produce the form set version pinned onto the submission.",
      "Mapping definitions here are what make the EDI template and API hook outputs possible without per-carrier code.",
      "A published version becomes the runtime for new submissions only; in-flight submissions keep their pinned version.",
      "Every publish writes an immutable audit record with author, approver, diff and effective date.",
    ],
    assumptions: [
      "Carrier form content is supplied by the carrier; ABox configures rather than authors legal form language.",
      "One field library is shared across form sets so common fields map consistently to the object model.",
    ],
    source:
      "Phase 1 Blueprint (form configurator: library, rules, field builder, conditional logic, validation, preview, versioning); IA Handoff (configuration patterns, audit).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-19",
    slug: "product-catalog",
    name: "Product catalog",
    group: "Products, plans & rates",
    shell: "internal",
    workspace: "WS_PLATFORM_ADMIN (authoring) · WS_AGENCY read-only for enabled products",
    module: "MOD_PRODUCTS_PLANS",
    user: "Platform product administrator; agency admin sees the enabled subset",
    purpose:
      "The authoritative list of everything ABox can quote or enroll — on-exchange IFP, off-exchange IFP, ancillary lines and ICHRA quoting — and the state of each product: quotable, enrollable, enabled per agency, rate-healthy.",
    decisions: [
      "One dense table, line filters as tabs. A catalog is a working list, so it opens as a list rather than a card gallery.",
      "Quotable and enrollable are separate columns, because ICHRA is quotable and never enrollable in Phase 1 and that distinction must be visible at a glance.",
      "Rate health is surfaced in the catalog row, not buried in rate management — a product with stale rates is a consumer-facing problem.",
      "Agency enablement is edited in a side sheet from the row, keeping the operator in the list they were scanning.",
      "Retire is available; delete is not. Historical quotes and policies must keep resolving their product.",
    ],
    acl: [
      "product.manage is platform-level. Agency admins get product.view scoped to their enabled products only.",
      "Enabling a product for an agency is blocked without a valid carrier appointment path — the block names the missing appointment.",
      "Agencies may narrow availability inside their own subtree but can never widen beyond platform rules.",
      "Rate source configuration is absent for agency roles; they see only effective date and staleness.",
    ],
    config: [
      "Product line taxonomy, consumer display name and description per product.",
      "Which agencies may sell which products, with effective dates.",
      "Quote-only vs enrollable, and which marketplaces expose the product.",
      "Stale-rate policy: warn, suppress or stop quoting.",
    ],
    objects: [
      "Product",
      "Product line / category",
      "Carrier",
      "Availability rule set",
      "Rate source binding",
      "Agency enablement record",
      "Plan count / rate version",
    ],
    dataFlow: [
      "Every marketplace, quote and results screen reads this catalog; Module 1 consumes it and gains no management capability.",
      "Enablement joins to carrier appointments — the appointment record is the gate, the catalog is the switch.",
      "Retiring a product removes it from new quoting while historical references continue to resolve.",
      "Availability is evaluated at quote time and again at submission release; a cached answer is never authoritative.",
    ],
    assumptions: [
      "Plan and benefit data arrive by carrier or exchange feed; ABox curates rather than authors benefit design.",
      "ICHRA is modelled as a quote-only product family with no enrollment path present in Phase 1.",
    ],
    source:
      "Phase 1 Blueprint (product catalog, rate sources, ancillary extensibility, ICHRA quoting); IA Handoff (SCR_PROD_*); low-fidelity SCR_PROD_CATALOG.",
    scope: "Broader Phase 1 — Module 1 reads it read-only",
  },
  {
    id: "HF-20",
    slug: "product-builder",
    name: "Product builder",
    group: "Products, plans & rates",
    shell: "internal",
    workspace: "WS_PLATFORM_ADMIN",
    module: "MOD_PRODUCTS_PLANS",
    user: "Platform product administrator",
    purpose:
      "Defines a new product without code: line template, rating inputs, displayed attributes, rate source binding, form binding, bundling and cart behaviour. Dental is the reference ancillary; the same pattern must carry vision, accident and critical illness.",
    decisions: [
      "Bindings are a visible contract, not a hidden validation. A four-item binding checklist (rates, form, availability, commission schedule) sits beside the definition and publish is disabled until it is satisfied.",
      "Line templates pre-fill rating inputs and displayed attributes, which is how ancillary extensibility stays generic instead of hardcoding dental.",
      "Displayed attributes are authored as card slots (3-4 max) and detail slots, mirroring exactly what the consumer plan card renders — so the author sees the consumer consequence.",
      "A live consumer preview of the resulting plan card sits in the right column, in the branded consumer skin.",
      "Quote-only is a first-class switch that removes the enrollment path rather than disabling a button.",
    ],
    acl: [
      "product.manage plus product.publish; publishing without a rate source or, for enrollable products, a form binding is blocked.",
      "Line templates are platform-owned — agencies cannot author product definitions at all, and the module is absent from their nav.",
      "Commission schedule assignability is set here but the schedule itself is authored in Commissions by commission.manage.",
    ],
    config: [
      "Line templates and what each pre-fills.",
      "Rating input set (age, ZIP/rating area, tobacco, family composition, custom).",
      "Card vs detail attributes and document links.",
      "Bundling: can be added with medical, standalone only, or requires a medical plan in cart.",
    ],
    objects: [
      "Product definition",
      "Line template",
      "Rating input set",
      "Displayed attribute set",
      "Rate source binding",
      "Form binding",
      "Bundling rules",
      "Publish record",
    ],
    dataFlow: [
      "Rating inputs define the quote request shape; the marketplace wizard collects exactly these and nothing more.",
      "Form binding is the link into the configurator resolution rules used by off-exchange intake.",
      "Publishing makes the product visible to enablement, and from there to marketplaces via availability rules.",
      "Module 1's 'More coverage' surface renders ancillary products defined here; the Module 1 screen itself is unchanged.",
    ],
    assumptions: [
      "Dental is the minimum ancillary proof required by the blueprint; the builder generalises the pattern rather than special-casing it.",
      "Rating dimensions beyond the standard set are supported as named custom inputs, not as free-form formulas, in Phase 1.",
    ],
    source:
      "Phase 1 Blueprint (product builder, dental minimum, ancillary extensibility); IA Handoff (configuration patterns); low-fidelity SCR_PROD_BUILDER.",
    scope: "Broader Phase 1 — seam into Module 1 ancillary cards",
  },
  {
    id: "HF-21",
    slug: "appointment-setup",
    name: "Carrier appointment setup",
    group: "Distribution, paper & revenue",
    shell: "internal",
    workspace: "WS_AGENCY / WS_PLATFORM_ADMIN",
    module: "MOD_AGENCY_ENTITY",
    user: "Agency admin, platform operations; compliance reviewer verifies",
    purpose:
      "The carrier appointment record: carrier, paper owner, states, lines, NPN in force, effective and termination dates, verification state — the gate that decides whether an agency or agent may write a product at all.",
    decisions: [
      "The record opens on the object page framework: identity header with state chip, tabbed body, timeline, right drawer. Appointments are objects, not settings.",
      "Downstream consequence is stated on the record: which products this appointment unlocks and how many agents inherit it. An appointment nobody can trace is a compliance risk.",
      "Verification state is separate from active state — 'active, unverified' is a real and dangerous condition, so it is a distinct chip rather than a boolean.",
      "Expiry and termination are surfaced as a dated warning band 60 days out, because a lapsed appointment silently kills sales.",
      "Appointed agency NPN override is a named field with a reason and an audit entry, never an inline untracked edit.",
    ],
    acl: [
      "appointment.manage at the owning entity; upline may view a downline appointment but only the paper owner may edit it.",
      "NPN override requires appointment.override plus a reason; the override is reported and appears in the audit log.",
      "Terminating an appointment is blocked while in-flight submissions depend on it; the block lists them.",
      "Agents see their own inherited appointment status only, not the agency-level record.",
    ],
    config: [
      "Carrier list, line and state dimensions, and which document types must be attached for verification.",
      "Expiry warning windows and whether an unverified appointment may be used for quoting.",
      "Whether downline agencies inherit or must hold their own appointment per carrier.",
      "Reason-code list for overrides and terminations.",
    ],
    objects: [
      "Carrier appointment",
      "Carrier",
      "Paper owner entity",
      "Agency / agent entity",
      "NPN record",
      "License record",
      "Appointment document",
      "Verification event",
    ],
    dataFlow: [
      "Product enablement in the catalog reads this record; no appointment means no enablement and no enrollable product.",
      "The appointment supplies the writing NPN used on submissions, EDI output and commission attribution.",
      "License records are joined but authored in agent setup — an appointment cannot be verified against a lapsed license.",
      "Appointment state changes emit notifications to the affected agency and create compliance tasks.",
    ],
    assumptions: [
      "Carrier appointment data is entered and verified in ABox in Phase 1; carrier-system sync is a later integration.",
      "One appointment record per carrier + paper owner + state + line combination.",
    ],
    source:
      "Phase 1 Blueprint (carrier appointments, paper access, NPN override, selling agency/agent markers); IA Handoff (object page pattern, hierarchy visibility).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-22",
    slug: "paper-splits",
    name: "Paper access & revenue split configuration",
    group: "Distribution, paper & revenue",
    shell: "internal",
    workspace: "WS_AGENCY (paper owner) / WS_PLATFORM_ADMIN",
    module: "MOD_AGENCY_ENTITY",
    user: "Paper-owning agency admin; requesting agency admin sees the request side only",
    purpose:
      "Who may write on whose paper and how the resulting revenue divides: public or private visibility, partner, upline and downline access, requests to write, selling agency and selling agent markers, and the split table that governs every policy written under it.",
    decisions: [
      "Two halves on one screen: access on the left (who can write), splits on the right (what each party earns). They are the same decision and separating them into two screens caused the ambiguity this batch resolves.",
      "Splits render as a table that always totals 100% with a live remainder row. An arithmetic error here is a payment dispute.",
      "Requests to write are an inbox on the record with approve, decline-with-reason and expiry, not an email thread.",
      "Visibility is a three-state control (public in marketplace of marketplaces, private, invite-only) with a plain-language consequence line under each.",
      "Effective dating is mandatory on any split change, and the previous version stays visible — splits are never retroactively rewritten.",
    ],
    acl: [
      "Only the paper owner may grant access or edit splits. Upline sees the arrangement, downline sees only its own row.",
      "split.view is separate from split.manage; an agent sees the split affecting their own production only, and never another agent's rate.",
      "Approving a request is blocked when the requesting entity has no valid appointment or licence for the state/line.",
      "Every access grant, revocation and split change writes an audit entry naming both entities and the actor.",
    ],
    config: [
      "Visibility modes available to a tenant, and whether public paper listing is enabled at all.",
      "Permitted split participant roles (paper owner, selling agency, selling agent, upline, referral partner).",
      "Split precision, minimum/maximum bounds per role, and approval requirement above a threshold.",
      "Request expiry, required justification fields and reason-code lists.",
    ],
    objects: [
      "Paper (carrier appointment paper)",
      "Paper access grant",
      "Request to write",
      "Revenue split arrangement + version",
      "Selling agency marker",
      "Selling agent marker",
      "Entity relationship (upline / downline / partner)",
    ],
    dataFlow: [
      "Access grants widen which products appear for the granted entity, downstream into the catalog and the marketplace.",
      "The split arrangement in force at policy effective date is what commission calculation uses — the projection and statements both resolve through it.",
      "Selling agency and selling agent markers set on a submission are the keys commission attribution and reporting join on.",
      "B2B2C nesting is expressed here: a partner writing on a downline's granted paper produces a multi-party split rather than a new entity type.",
    ],
    assumptions: [
      "Splits are percentage-based on commissionable revenue in Phase 1; per-product overrides are handled in the commission schedule, not here.",
      "A policy resolves exactly one split arrangement version, pinned at effective date.",
    ],
    source:
      "Phase 1 Blueprint (paper owner, public/private visibility, partner/downline/upline access, request to write, NPN override, selling markers, revenue splits, audit); Reconciliation (B2B2C nesting under appointments).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-23",
    slug: "referral-rewards",
    name: "Referral reward setup",
    group: "Distribution, paper & revenue",
    shell: "internal",
    workspace: "WS_AGENCY / WS_PLATFORM_ADMIN",
    module: "MOD_COMMISSIONS",
    user: "Agency admin configuring partner rewards; partner sees only their own program",
    purpose:
      "Defines what a referral partner earns: one-time and recurring reward models, qualifying events, attribution window, caps, payout timing and the disclosure attached to the program — plus the audit trail every reward change requires.",
    decisions: [
      "Reward model is chosen as a card set (one-time per enrollment, recurring monthly, tiered by volume, hybrid) with the money mechanics rendered underneath — the model choice changes the form, not just a dropdown value.",
      "A worked example calculates a live reward from sample volume as the admin types. Reward rules that cannot be checked get set wrong.",
      "Qualifying event is explicit (lead created, application submitted, policy effective, policy persists 90 days) because that single choice decides reward risk.",
      "Attribution window and 'last touch vs first touch' are stated on the same screen as the reward — attribution is part of the reward definition.",
      "Compliance disclosure text is required before activation and is versioned with the program.",
    ],
    acl: [
      "reward.manage at the sponsoring entity. Partners have read-only access to their own program and their own accrual.",
      "Programs paying on lead creation require a second approver, because that model carries the highest abuse risk.",
      "Partner-facing views never expose the underlying commission the agency earns — only the partner's own reward.",
      "Deactivating a program does not cancel accrued unpaid rewards; that requires a separate reversal with reason.",
    ],
    config: [
      "Reward models available per tenant, and caps per partner, per period and per program.",
      "Qualifying events, attribution window and clawback rules on early cancellation.",
      "Payout timing and whether payout is manual or scheduled.",
      "Required disclosure text and whether partner acceptance is captured.",
    ],
    objects: [
      "Referral program + version",
      "Referral partner entity",
      "Reward rule (one-time / recurring)",
      "Qualifying event definition",
      "Attribution record",
      "Accrual + payout record",
      "Disclosure acceptance",
    ],
    dataFlow: [
      "Referral attribution is captured at lead creation and carried on the lead, the quote and the submission.",
      "Qualifying events fire from policy lifecycle events; accruals appear in the commission projection and on statements as a distinct reward line.",
      "Recurring rewards generate a monthly accrual for the configured duration, reconciled against policy persistence.",
      "Program changes are effective-dated; in-flight attributions keep the program version they were created under.",
    ],
    assumptions: [
      "Rewards are internal accruals with an export for payment; ABox does not disburse funds in Phase 1.",
      "Referral rewards are distinct from commission splits and never alter a licensed agent's commission.",
    ],
    source:
      "Phase 1 Blueprint (referral reward setup, one-time and recurring rewards, audit); IA Handoff (ACL, audit patterns).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-24",
    slug: "commission-schedule",
    name: "Commission schedule setup",
    group: "Commissions & statements",
    shell: "internal",
    workspace: "WS_PLATFORM_ADMIN / WS_AGENCY (own schedules)",
    module: "MOD_COMMISSIONS",
    user: "Platform commission administrator, agency admin with commission.manage",
    purpose:
      "Authors every commission model ABox must support — PMPM, PEPM, PCPM, flat fee, percentage of premium, contingent categories, overrides, upline bonuses, super bonuses and annual or recurring bonus models — bound to product, carrier, paper, entity and effective window.",
    decisions: [
      "Model type drives the rate form. Choosing PMPM asks for per-member-per-month; PEPM asks per-employee; a bonus asks for threshold tiers. One generic 'amount' field would make this screen unusable.",
      "Rate rows are effective-dated and stacked, so an admin reads the history of a rate rather than overwriting it.",
      "Override and bonus layers are shown as a stack diagram (base → override → upline bonus → super bonus) with a live worked example, because the layering is where operators lose the plot.",
      "Contingent commission categories are marked as contingent throughout and excluded from projections by default, with an explicit include toggle.",
      "Publish is a two-step approval with an impact count of affected in-force policies.",
    ],
    acl: [
      "commission.manage; the whole Commissions module is absent from the nav without commission.view.",
      "Agency admins may author schedules for their own subtree only, and never above the platform-set maximum.",
      "Bonus and super-bonus layers are typically platform-only; the layer is absent, not read-only, for agency roles.",
      "Every rate change, publish and approval writes an audit entry with actor, approver and diff.",
    ],
    config: [
      "Which models a tenant may use, and the permitted rate bounds per model.",
      "Bonus threshold dimensions (volume, lives, persistence, product mix) and measurement period.",
      "Contingent categories and their default inclusion in projections.",
      "Approval thresholds and effective-date rules (immediate, next period, next plan year).",
    ],
    objects: [
      "Commission schedule + version",
      "Rate row per model type",
      "Override layer",
      "Bonus / super-bonus rule",
      "Contingent category",
      "Product / carrier / paper binding",
      "Entity scope",
      "Approval record",
    ],
    dataFlow: [
      "The schedule in force at policy effective date, combined with the split arrangement, is what produces every projection and statement line.",
      "Schedules bind to products from the catalog and to paper from the appointment record; they never define product or paper themselves.",
      "Publishing recalculates projections forward only; posted statement periods are immutable.",
      "Bonus rules are evaluated per measurement period against production data, producing accruals rather than immediate postings.",
    ],
    assumptions: [
      "Carrier-paid commission statements are ingested for reconciliation; ABox calculates expected commission and compares.",
      "PCPM is treated as per-covered-person-per-month and is distinct from PMPM at the member-count definition level.",
    ],
    source:
      "Phase 1 Blueprint (schedule setup, PMPM, PEPM, PCPM, flat fee, contingent, overrides, upline and super bonuses, annual/recurring bonus models); Reconciliation (full commission model set moved beyond Module 1).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-25",
    slug: "commission-projection",
    name: "Commission projection",
    group: "Commissions & statements",
    shell: "internal",
    workspace: "WS_AGENCY / WS_AGENT",
    module: "MOD_COMMISSIONS",
    user: "Agency admin, agency manager, agent (own production only)",
    purpose:
      "Forward-looking expected revenue from in-force and pending business: projected by month, product, carrier and entity, with the quote and cart internal projection that tells an agent what a deal is worth before it is written.",
    decisions: [
      "Projection is explicitly labelled as an estimate with its basis stated (schedule version, split version, persistence assumption). An unqualified revenue number gets treated as a promise.",
      "One chart, one matching table. The table is the exportable and accessible truth; the chart is orientation only.",
      "A per-deal projection strip is shown as it appears inside quote and cart — internal-only, never rendered on a consumer surface.",
      "Contingent and bonus components are separated from base commission with a toggle, so the operator can see the guaranteed floor.",
      "Assumption controls (persistence rate, close rate on pending) are on the page, not hidden in settings, because they change the number materially.",
    ],
    acl: [
      "Agents see their own production only; managers see their entity; admins see entity plus downline, gated on hierarchy visibility.",
      "Downline detail rows collapse to totals without downline.view, and the dimension is removed from the scope bar rather than disabled.",
      "The internal projection strip inside quote and cart requires commission.view — for other roles it does not render at all.",
      "Export is separately permissioned and each export writes the applied scope to the audit log.",
    ],
    config: [
      "Default persistence and close-rate assumptions per tenant, and whether users may change them.",
      "Whether contingent and bonus components are included by default.",
      "Projection horizon (12/24/36 months) and period granularity.",
      "Whether the in-quote projection strip is enabled for a tenant and for which roles.",
    ],
    objects: [
      "Projection run",
      "Policy / submission (in-force and pending)",
      "Commission schedule version",
      "Split arrangement version",
      "Bonus accrual",
      "Entity scope",
      "Assumption set",
    ],
    dataFlow: [
      "Reads policies, pending submissions, schedules and splits; writes nothing except the projection run record used for audit.",
      "Quote and cart request a single-deal projection through the same calculation path as the portfolio view — one engine, two surfaces.",
      "Projections are recalculated when a schedule or split version publishes, and the change is visible as a delta versus the previous run.",
      "Statement posting supersedes projection for closed periods; the two never disagree for a posted month.",
    ],
    assumptions: [
      "Projection is advisory and never a payable; only statements produce payable amounts.",
      "Pending business is weighted by close rate rather than counted at full value.",
    ],
    source:
      "Phase 1 Blueprint (projection view, quote/cart internal projection, ACL-controlled visibility); IA Handoff (dashboard and reporting patterns).",
    scope: "Broader Phase 1 — internal-only seam near Module 1 cart",
  },
  {
    id: "HF-26",
    slug: "agency-statement",
    name: "Agency statement",
    group: "Commissions & statements",
    shell: "internal",
    workspace: "WS_AGENCY / WS_PLATFORM_ADMIN",
    module: "MOD_COMMISSIONS",
    user: "Agency admin, agency finance role, platform operations",
    purpose:
      "The posted commission statement for an entity and period: earned, adjustments, reversals, overrides and bonuses, split allocations out to downline and partners, reconciliation against carrier-reported amounts, and the policy-level detail behind every total.",
    decisions: [
      "Statement opens as a summary ledger with drill-through to policy level, never as a flat 4,000-row export dump. The totals must be defensible line by line.",
      "Variance against carrier-reported commission is a first-class column with a status chip (matched, variance, missing), because reconciliation is the real work.",
      "Posted periods are locked and visually marked as immutable; corrections appear as dated adjustments in a later period.",
      "Split allocations out to downline and partners are shown on the same statement, so the agency sees gross earned and net retained together.",
      "Every figure carries its basis on hover: schedule version, split version, policy count.",
    ],
    acl: [
      "commission.view plus statement.view at the entity; agents cannot open an agency statement at all.",
      "Downline allocation detail requires hierarchy visibility; without it the downline block collapses to a single total.",
      "Adjustments and reversals require statement.adjust and a reason code, and are always audited.",
      "Export and share are separately permissioned; a shared statement is watermarked with the recipient and the scope.",
    ],
    config: [
      "Statement period calendar, posting day and lock rules.",
      "Which columns and blocks appear per role template, and statement branding for white-label output.",
      "Variance tolerance thresholds and the reason-code list for adjustments.",
      "Whether carrier statement ingestion is enabled and how unmatched rows are surfaced.",
    ],
    objects: [
      "Statement (entity + period)",
      "Statement line (policy level)",
      "Adjustment / reversal",
      "Bonus accrual posting",
      "Split allocation",
      "Carrier-reported record",
      "Reconciliation status",
    ],
    dataFlow: [
      "Built from policies, schedule versions and split versions in force at each policy's effective date; the same engine as the projection.",
      "Carrier statement ingestion joins on policy and NPN to produce the variance column.",
      "Posting a period freezes it, supersedes projection for those months, and feeds attribution and revenue dashboards.",
      "Downline allocations become the downline agency's own statement lines — one posting event produces both sides.",
    ],
    assumptions: [
      "ABox produces statements and exports for payment; it does not move money in Phase 1.",
      "Carrier statement formats vary and are normalised on ingestion; unmatched rows are worked as exceptions, not silently dropped.",
    ],
    source:
      "Phase 1 Blueprint (agency statement, policy level statement, ACL controlled visibility); IA Handoff (reporting, outputs, white-labelled documents).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-27",
    slug: "agent-statement",
    name: "Agent statement",
    group: "Commissions & statements",
    shell: "internal",
    workspace: "WS_AGENT",
    module: "MOD_COMMISSIONS",
    user: "Agent / producer (own production only)",
    purpose:
      "The agent's own earnings for a period: what was earned per policy, what was adjusted, what is pending and why — written to be understood by one person about their own money, not by a finance team.",
    decisions: [
      "Deliberately simpler than the agency statement: three totals, one policy table, one explanation block. Same data model, different information density.",
      "'Why is this different from last month' is answered on the page with a named delta list (new policies, cancellations, adjustments, bonus posting) instead of leaving the agent to diff two statements.",
      "Pending amounts are separated from paid with the specific reason for pending on each row — this is the single largest driver of commission support tickets.",
      "The agent never sees agency margin, upline override or another agent's rate; the statement is complete about their own line and silent about everything else.",
      "A dispute action opens a task against the statement line with the line context attached, rather than an untracked message.",
    ],
    acl: [
      "Scoped hard to the authenticated agent's own production; there is no entity selector on this screen.",
      "Override, bonus and margin components earned by others are absent from the data, not masked in the UI.",
      "A manager viewing an agent's statement does so through the agency statement drill-through, which is audited as a sensitive read.",
      "Dispute creation is available to the agent; adjustment authority is not.",
    ],
    config: [
      "Which components an agent may see (base, own bonus, own referral reward) per role template.",
      "Statement branding, disclosure text and delivery (in-app, emailed PDF).",
      "Whether disputes are enabled and the SLA / routing for dispute tasks.",
      "Pending reason-code vocabulary shown to agents.",
    ],
    objects: [
      "Statement (agent + period)",
      "Statement line (policy level)",
      "Pending reason",
      "Adjustment",
      "Own bonus accrual",
      "Dispute task",
    ],
    dataFlow: [
      "Derived from the same posting run as the agency statement — agent and agency statements can never disagree because they are one calculation.",
      "Selling-agent markers on submissions are the attribution key; a missing marker surfaces as an unattributed exception to the agency, not as a silent zero.",
      "Disputes create tasks in the agency work queue and appear on the statement timeline.",
      "Statement delivery emits a notification through the communications module using a branded template.",
    ],
    assumptions: [
      "Agents are paid by their agency, not by ABox; the statement is the record of what the agency owes.",
      "Historical statements remain immutable and viewable after an agent's appointment or licence lapses.",
    ],
    source:
      "Phase 1 Blueprint (agent statement, policy level statement, ACL controlled visibility); IA Handoff (workspace scoping, ACL).",
    scope: "Broader Phase 1 — outside Module 1",
  },
  {
    id: "HF-28",
    slug: "notification-scheduler",
    name: "Notification scheduler",
    group: "Operations, configuration & audit",
    shell: "internal",
    workspace: "WS_AGENCY / WS_PLATFORM_ADMIN",
    module: "MOD_COMMUNICATIONS",
    user: "Agency marketing/ops admin, platform communications admin",
    purpose:
      "Where a message becomes a program: event-based triggers, time-based and recurring schedules, delayed sends, channel selection across email, SMS and in-app, branded templates, consent enforcement and the resulting communication timeline.",
    decisions: [
      "One list of programs with trigger, channel, audience, schedule and state in a single row — an ops admin needs to answer 'what will go out this week' in one glance.",
      "The trigger builder reads as a sentence: when [event] · wait [delay] · if [condition] · send [template] via [channel]. Configuration that reads as prose gets reviewed properly.",
      "Consent is enforced at send time and displayed as a suppression count on the program, so a program never silently drops half its audience.",
      "Quiet hours and frequency caps are tenant-level guardrails shown inline on every program, not buried in global settings.",
      "A dry-run preview resolves a real recipient's merge fields and shows the branded rendering per channel before activation.",
    ],
    acl: [
      "comms.manage to author, comms.send to activate a program; manual one-off messages require comms.send at the entity.",
      "Agencies may author within their subtree and cannot message another agency's contacts; the audience picker cannot express it.",
      "SMS requires an explicit tenant-level enablement plus captured consent per contact; without it the channel is absent from the picker.",
      "Programs touching commission or statement content require commission.view on both author and recipient side.",
    ],
    config: [
      "Template library per channel with branded layouts, and the label dictionary applied to all copy.",
      "Trigger event catalogue, delay and recurrence options, quiet hours, frequency caps.",
      "Consent categories, capture points and suppression rules.",
      "Task auto-creation rules from events, and which programs are tenant-locked versus agency-editable.",
    ],
    objects: [
      "Communication program",
      "Trigger (event / schedule)",
      "Template + version per channel",
      "Audience definition",
      "Consent record",
      "Send / delivery record",
      "Communication timeline entry",
      "Task",
    ],
    dataFlow: [
      "Triggers subscribe to platform events (quote shared, application saved, submission status changed, policy effective, statement posted) — the same event stream the timelines render.",
      "Every send writes a communication timeline entry on the related object, so the lead or member record explains its own outreach history.",
      "Shared-quote notifications in Module 1 are produced by programs configured here; the Module 1 screens are unchanged.",
      "Delivery failures and opt-outs feed back as suppression and can auto-create follow-up tasks.",
    ],
    assumptions: [
      "Email and SMS delivery run through platform-level providers; per-tenant sending domains are a configuration, not a separate integration build.",
      "Consent is captured at the contact level and honoured across every program and channel without exception.",
    ],
    source:
      "Phase 1 Blueprint (email/SMS/in-app templates, event and time triggers, recurring/delayed sends, manual messages, consent, branded templates, communication timeline, task creation).",
    scope: "Broader Phase 1 — configuration seam into Module 1 notifications",
  },
  {
    id: "HF-29",
    slug: "branding-settings",
    name: "Branding & white labeling settings",
    group: "Operations, configuration & audit",
    shell: "internal",
    workspace: "WS_PLATFORM_ADMIN / WS_AGENCY (own marketplace)",
    module: "MOD_ADMIN_CONFIG",
    user: "Platform admin, agency admin with branding.manage",
    purpose:
      "Turns a tenant into a branded marketplace: logo, colour, radius and type scale tokens, domain, label dictionary, document and email branding — with live preview across consumer and document surfaces and contrast validation at save.",
    decisions: [
      "Left column edits tokens, right column previews the real consumer surfaces in the branded skin. White labeling is only believable when the author sees the marketplace, not a swatch grid.",
      "Brand is expressed as tokens (primary, ring, accent surface, radius, type scale) — never as per-screen overrides. This is what keeps layout identical across every tenant.",
      "Contrast is validated at save with a named failure ('primary on white fails AA for body text') and a suggested corrected value; a tenant cannot ship an inaccessible marketplace.",
      "The label dictionary lives on the same screen as colour, because renaming 'Agency' to 'Firm' is the same act of white labeling as changing the logo.",
      "Document and email branding preview beside the web preview, since the same brand must survive a PDF and an email client.",
    ],
    acl: [
      "branding.manage at the owning tenant; agencies brand their own marketplace only and cannot alter platform-level guardrails.",
      "Platform-locked tokens (destructive, warning, success, AI) are absent from the agency editor — semantic status must stay legible across all tenants.",
      "Domain configuration requires a platform action; agencies request it and see verification state.",
      "Publishing a brand change is audited with a before/after token diff and a preview snapshot reference.",
    ],
    config: [
      "Logo, wordmark, favicon, primary and accent tokens, radius, type scale, and consumer hero imagery.",
      "Label dictionary for workspaces, modules, objects and actions.",
      "Marketplace domain / subdomain, legal footer, disclosure text and support contact.",
      "Which surfaces the brand applies to (marketplace, shared quote, documents, email, member workspace).",
    ],
    objects: [
      "Tenant / marketplace",
      "Brand token set + version",
      "Label dictionary",
      "Domain record",
      "Document brand profile",
      "Email brand profile",
      "Contrast validation result",
    ],
    dataFlow: [
      "Token sets are applied at runtime to the consumer shell, shared quote, member workspace and every generated document — one source, many surfaces.",
      "The label dictionary is read by the shell, drawer, help content and outputs; no label is hardcoded in a screen.",
      "Publishing a brand version is effective immediately for web surfaces and from the next generation for documents already issued.",
      "Brand changes are audited and reversible to a prior version without re-entering values.",
    ],
    assumptions: [
      "Tenants supply assets meeting minimum dimensions; ABox validates rather than designs logos.",
      "Layout, spacing and component structure are platform-owned and are not tenant-configurable in Phase 1.",
    ],
    source:
      "Phase 1 Blueprint (full branding and white labeling, configurable labels); IA Handoff (white labeling, label dictionary, help model); design system direction (three-layer token strategy).",
    scope: "Broader Phase 1 — drives Module 1 consumer chrome",
  },
  {
    id: "HF-30",
    slug: "acl-config",
    name: "ACL configuration",
    group: "Operations, configuration & audit",
    shell: "internal",
    workspace: "WS_PLATFORM_ADMIN / WS_AGENCY (local overrides)",
    module: "MOD_ADMIN_CONFIG",
    user: "Platform security admin; agency admin for local overrides inside guardrails",
    purpose:
      "Role templates, permission grants, data-visibility scope by hierarchy, module and menu visibility, sensitive-field rules and local overrides — with a resolution tester that proves what a specific user can actually see.",
    decisions: [
      "The permission matrix is the body of the screen, grouped by module, with view/create/edit/approve columns. Security configuration must be readable as a grid, not a checkbox list.",
      "Global guardrails render as a locked band above local overrides, so an agency admin can see the ceiling they are working under instead of discovering it as an error.",
      "A resolution tester takes a user, entity and object and returns the effective answer plus the exact rule that decided it — this is the screen's most important feature.",
      "Data visibility is configured as scope (own records, own entity, entity plus downline, global) separately from permission, because conflating the two is the classic source of leaks.",
      "Sensitive-field rules are explicit: masked, revealable-with-audit, or absent. 'Absent' is a real option and is the default for the highest sensitivity class.",
    ],
    acl: [
      "acl.manage; a role can never grant a permission it does not itself hold, and the matrix greys nothing — ungrantable cells are simply not editable and say why.",
      "Agency admins edit local overrides only, and only narrowing, never widening beyond the platform template.",
      "Changing an ACL rule requires a reason and, above a configured sensitivity, a second approver.",
      "Every change writes an audit entry with actor, template, diff and the count of affected users.",
    ],
    config: [
      "Role templates per workspace and their default permission sets.",
      "Permission catalogue per module, data-visibility scopes, and sensitive-field classification.",
      "Module and menu visibility per role, and feature flags that remove a module entirely.",
      "Approval thresholds, reason-code lists and whether local overrides are permitted at all for a tenant.",
    ],
    objects: [
      "Role template",
      "Permission grant",
      "Data-visibility scope rule",
      "Local override",
      "Sensitive-field rule",
      "Feature flag",
      "User / entity assignment",
      "Resolution test result",
    ],
    dataFlow: [
      "Every screen in Phase 1 resolves through these rules — nav composition, drawer sections, column sets, actions and field masking all read the same resolved permission set.",
      "Entity relationships from agency management supply the hierarchy that data-visibility scopes traverse.",
      "Publishing a template change re-resolves sessions on next request; in-flight approvals keep the rule version they were raised under.",
      "Denied access attempts are written to the audit log and surfaced as a security report rather than only a UI message.",
    ],
    assumptions: [
      "Permission by absence is the platform rule: an unpermitted module or action is not rendered at all.",
      "Roles are templates plus overrides; per-user bespoke permission sets are deliberately not supported in Phase 1.",
    ],
    source:
      "Phase 1 Blueprint (global ACL, local ACL, role and permission templates, data visibility by hierarchy); IA Handoff (ACL model, workspace configuration, sensitive data rules).",
    scope: "Broader Phase 1 — governs every screen including Module 1",
  },
  {
    id: "HF-31",
    slug: "audit-log",
    name: "Audit log",
    group: "Operations, configuration & audit",
    shell: "internal",
    workspace: "WS_PLATFORM_ADMIN / WS_AGENCY (own subtree)",
    module: "MOD_ADMIN_CONFIG",
    user: "Compliance reviewer, platform security admin, agency admin with audit.view",
    purpose:
      "The immutable record of who did what, to which object, in which entity and workspace, with the before and after — covering human actions, system events, AI interactions, configuration changes, sensitive-data reveals and export events.",
    decisions: [
      "Filter-first layout: the filter bar is the primary interface because an audit log is only useful as a question-answering tool.",
      "Every row expands in place to a before/after diff rather than navigating away, so a reviewer can work a list without losing position.",
      "Actor type is visually distinguished — person, system, AI, integration — and AI entries name the model surface and the prompt context reference.",
      "Sensitive-data reveals, exports and impersonation sessions are highlighted as a distinct class, because those are what a regulator asks about first.",
      "Export of the audit log is itself audited, and the resulting entry states the applied filters.",
    ],
    acl: [
      "audit.view is required for the module and for the Audit drawer section on every other screen; without it the section does not exist.",
      "Agency reviewers see their own subtree only; platform-level entries are absent, not redacted.",
      "No role can edit or delete an audit entry — the UI offers no such action at all.",
      "Field-level values inside a diff respect sensitive-field rules; a masked field stays masked in the audit view.",
    ],
    config: [
      "Which event types are recorded per module, and retention period per class.",
      "Which classes are highlighted as sensitive, and alerting rules on high-risk events.",
      "Export formats, export permission and whether export requires a reason.",
      "Saved views per role (for example a compliance reviewer's default filter set).",
    ],
    objects: [
      "Audit entry",
      "Actor (user / system / AI / integration)",
      "Target object reference",
      "Entity + workspace context",
      "Before/after diff",
      "Session / impersonation record",
      "Export event",
    ],
    dataFlow: [
      "Every module writes here; the Audit drawer section on each screen is a filtered view of this same store, not a separate log.",
      "AI interaction logging from the governance module lands as audit entries with model, surface and grounding references.",
      "Entries are append-only and retained per policy; deletion is a retention-driven system action, never a user action.",
      "High-risk classes can trigger notifications through the communications module and create compliance tasks.",
    ],
    assumptions: [
      "One audit store serves compliance, security and support; there is no separate shadow log.",
      "Retention is configured per tenant within a platform minimum, and shortening retention is itself an audited configuration change.",
    ],
    source:
      "Phase 1 Blueprint (event/audit logs, data export controls, AI interaction reporting); IA Handoff (audit patterns, drawer audit section, sensitive data rules).",
    scope: "Broader Phase 1 — governs every screen including Module 1",
  },
];

export const HF_BY_SLUG: Record<string, HfScreen> = Object.fromEntries(
  HF_SCREENS.map((s) => [s.slug, s]),
);

export const HF_SLUGS = HF_SCREENS.map((s) => s.slug);

/** Tenant brand presets used to prove the white-label token layer at runtime. */
export interface BrandPreset {
  id: string;
  name: string;
  marketplace: string;
  /** oklch primary + ring, applied as CSS variable overrides on the consumer root. */
  primary: string;
  primaryForeground: string;
  ring: string;
  accentSurface: string;
  radius: string;
  mark: string;
}

export const BRANDS: BrandPreset[] = [
  {
    id: "BRAND_NORTHWIND",
    name: "Northwind Benefits",
    marketplace: "northwind.abox.market",
    primary: "oklch(0.42 0.11 254)",
    primaryForeground: "oklch(0.99 0.005 250)",
    ring: "oklch(0.55 0.11 254)",
    accentSurface: "oklch(0.955 0.02 254)",
    radius: "0.625rem",
    mark: "NW",
  },
  {
    id: "BRAND_HARBOR",
    name: "Harbor Point Health",
    marketplace: "harborpoint.abox.market",
    primary: "oklch(0.45 0.105 178)",
    primaryForeground: "oklch(0.99 0.005 178)",
    ring: "oklch(0.58 0.1 178)",
    accentSurface: "oklch(0.955 0.025 178)",
    radius: "1rem",
    mark: "HP",
  },
  {
    id: "BRAND_CEDAR",
    name: "Cedar Ridge Insurance",
    marketplace: "cedarridge.abox.market",
    primary: "oklch(0.44 0.13 28)",
    primaryForeground: "oklch(0.99 0.005 28)",
    ring: "oklch(0.58 0.13 28)",
    accentSurface: "oklch(0.96 0.02 28)",
    radius: "0.375rem",
    mark: "CR",
  },
];
