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
}

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
      "Agency-branded entry point that establishes who is selling, offers guided (Plan O) or self-directed shopping, and carries required non-government disclosure above the fold.",
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
    source: "ABox_Module1_V4_Hardening_Package (UX-002); Phase 1 Blueprint (product lines, ancillary extensibility).",
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
    name: "Plan O guided shopping",
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
      "Plan O availability is a tenant/marketplace feature flag; when off, the entry disappears and Browse is the only path.",
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
      "Plan O badge on ranked plans is toggled with the Plan O flag.",
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
    source: "ABox_Module1_V4_Hardening_Package (UX-012); Phase 1 Blueprint (benefit comparison output).",
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
    source: "ABox_Module1_V4_Hardening_Package (UX-016); Reconciliation package (EDE stays a handoff in Module 1).",
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
    source: "ABox_Module1_V4_Hardening_Package (UX-017, UX-021); Phase 1 Blueprint (shared quote notifications).",
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
    source: "ABox_Module1_V4_Hardening_Package (UX-020, UX-021); IA package (internal shell alignment).",
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
