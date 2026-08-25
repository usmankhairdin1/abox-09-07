/**
 * Module 1 (V4 Hardening) screen inventory.
 *
 * Source of truth: ABox_Module1_Clickable_Wireframes_Final.pptx (UX-001 … UX-026)
 * in ABox_Module1_V4_Hardening_Package, supported by the V4 Requirements
 * Hardening Pack, Compliance & AI Guardrails Pack and Traceability Workbook.
 *
 * Scope fence: ABox_Module1_Reconciliation_Package_v1.0. Nothing here adds a
 * broader Phase 1 capability. Shell, drawer, assistant and navigation framing
 * come from the Phase 1 IA Handoff Package and are tagged as non-disruptive
 * IA alignment.
 */

export type M1Scope = "Protected Module 1 scope" | "Non-disruptive IA alignment";

export type M1Group =
  | "Consumer shopping"
  | "Registration & enroll"
  | "Handoff"
  | "Agent"
  | "Module 1 configuration"
  | "AI";

export interface M1Screen {
  id: string;
  slug: string;
  name: string;
  group: M1Group;
  shell: "consumer" | "internal";
  user: string;
  purpose: string;
  components: string[];
  actions: string[];
  drawer: string[] | null;
  assistant: string;
  compliance: string[];
  source: string;
  scope: M1Scope;
  /** Forward click paths from the V4 deck. */
  next: string[];
}

const V4_WF = "ABox_Module1_Clickable_Wireframes_Final.pptx";
const V4_REQ = "ABox_Module1_V4_Requirements_Hardening_Pack.docx";
const V4_COMP = "ABox_Module1_V4_Compliance_AI_Guardrails_Pack.docx";
const V4_AI = "ABox_Module1_V4_Agentic_AI_Implementation_Task_Pack.docx";
const V4_DATA = "ABox_Module1_V4_Data_API_Integration_Pack.docx";
const IA = "ABox_Phase1_IA_Handoff_Package_v1.0";
const RECON = "ABox_Module1_Reconciliation_Package_v1.0";

export const M1_SCREENS: M1Screen[] = [
  {
    id: "UX-001",
    slug: "ux-001",
    name: "Marketplace Landing",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C, unauthenticated)",
    purpose:
      "Branded entry point for an agency's consumer marketplace. Establishes who is presenting the marketplace, what can be shopped, and the two ways in: guided (Plan-O) or self-directed browse.",
    components: [
      "Agency brand block: logo, marketplace name, licensed-entity line",
      "Hero with single primary value statement and ZIP capture",
      "Two entry cards — 'Help me choose' (Plan-O) and 'Browse plans myself'",
      "Product line strip limited to lines the agency has enabled",
      "Returning-visitor strip: resume quote / sign in",
      "Trust and compliance footer: licensure, privacy, non-discrimination, third-party marketing disclosure",
    ],
    actions: [
      "Enter ZIP and start",
      "Start Plan-O guided path",
      "Start manual browse",
      "Resume a saved quote",
      "Sign in",
    ],
    drawer: null,
    assistant:
      "Bottom-right help bubble in consumer voice. FAQ set only: what is this site, who is the agency, is this the official exchange, how is my data used. No plan advice offered from the landing page.",
    compliance: [
      "Agency identity, licensure and 'not a government website' disclosure must be visible without scrolling past the hero.",
      "Marketing disclosure and privacy notice load with the page, not behind a modal.",
      "Landing visit creates an anonymous session id used later for lead attribution; consent banner governs analytics.",
    ],
    source: `${V4_WF} slide 1; ${V4_REQ}; branding config supplied by UX-024`,
    scope: "Protected Module 1 scope",
    next: ["ux-002", "ux-003", "ux-015", "ux-016"],
  },
  {
    id: "UX-002",
    slug: "ux-002",
    name: "Product Selection & Path Choice",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C, unauthenticated)",
    purpose:
      "Consumer picks the product line to shop and the shopping path. This is the single screen that carries both the Plan-O entry and the Browse entry.",
    components: [
      "Product line cards driven by agency product configuration (IFP on-exchange primary; ancillary lines shown only when enabled)",
      "Path choice: guided Plan-O vs manual browse, each with plain-language description of what happens next",
      "Availability note when a line is not sellable for the ZIP or the agency is not appointed",
      "Progress indicator showing the quote wizard steps ahead",
    ],
    actions: [
      "Select product line",
      "Choose guided path (to UX-003 then UX-005)",
      "Choose browse path (to UX-003 then UX-009 browse tab)",
      "Back to landing",
    ],
    drawer: null,
    assistant:
      "FAQ: difference between guided and browse, what on-exchange means, can I change my mind later. Answer copy is agency-configurable within platform guardrails.",
    compliance: [
      "Only product lines the agency is licensed and appointed to sell may be selectable; unavailable lines render disabled with a reason, never hidden silently.",
      "Path choice is recorded on the quote object for later audit of how the consumer was guided.",
    ],
    source: `${V4_WF} slide 2; product enablement from UX-024`,
    scope: "Protected Module 1 scope",
    next: ["ux-003"],
  },
  {
    id: "UX-003",
    slug: "ux-003",
    name: "Quote Wizard: ZIP, County & Effective Date",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C) or agent operating the wizard",
    purpose:
      "First wizard step. Establishes the rating location and coverage effective date, which together determine which plans can be quoted at all.",
    components: [
      "ZIP input with county disambiguation list when a ZIP spans counties",
      "State derived and displayed read-only",
      "Effective date selector constrained to valid OEP/SEP-derived dates",
      "Coverage year indicator",
      "Wizard stepper (1 of 3/4 depending on path)",
      "Inline validation messaging",
    ],
    actions: ["Confirm location", "Select county", "Select effective date", "Continue", "Back"],
    drawer: null,
    assistant:
      "Contextual help on why county matters and what effective date means. No eligibility determination is made or implied here.",
    compliance: [
      "County selection is mandatory when ambiguous — silently defaulting to the first county is not acceptable for rating accuracy.",
      "Effective dates outside a valid enrollment window must be blocked with an explanation rather than accepted and failed downstream.",
      "Location and effective date are stamped on the quote and carried unchanged into the EDE handoff payload.",
    ],
    source: `${V4_WF} slide 3; ${V4_REQ}; ${V4_DATA} (rating area / service area lookup)`,
    scope: "Protected Module 1 scope",
    next: ["ux-004"],
  },
  {
    id: "UX-004",
    slug: "ux-004",
    name: "Quote Wizard: Household Members",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C) or agent operating the wizard",
    purpose:
      "Capture the household composition used for rating: who is applying, ages/DOB, tobacco status and relationship.",
    components: [
      "Member rows: relationship, date of birth or age, tobacco use, applying-for-coverage toggle",
      "Add / remove member controls",
      "Household summary chip (count of applicants)",
      "Optional household income entry point that routes to the subsidy step",
      "Validation for missing or implausible values",
    ],
    actions: ["Add member", "Remove member", "Mark member as not applying", "Continue", "Back"],
    drawer: null,
    assistant:
      "Help on who counts as a household member and why tobacco status affects rates. Assistant never asks for SSN, immigration status or medical history in Module 1.",
    compliance: [
      "Module 1 collects rating inputs only. No SSN, no citizenship/immigration attestation, no health questions — those belong to the EDE application after handoff.",
      "Date of birth is treated as sensitive: masked in downstream internal list views, unmasked only on the object page with a logged reason.",
      "Household changes create a new quote version rather than mutating a shared quote already sent to a consumer.",
    ],
    source: `${V4_WF} slide 4; ${V4_REQ}; ${V4_COMP} (minimum-necessary data rule)`,
    scope: "Protected Module 1 scope",
    next: ["ux-005", "ux-007"],
  },
  {
    id: "UX-005",
    slug: "ux-005",
    name: "Plan-O Goals & Usage",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C) or agent in guided mode",
    purpose:
      "Guided-path intake. Captures priorities and expected usage so Plan-O can produce a ranked recommendation. This is the Plan-O entry proper.",
    components: [
      "Priority selection: lowest premium, lowest out-of-pocket when used, keep my doctor, keep my prescriptions, predictable costs",
      "Expected usage level selector (low / moderate / high) with plain-language examples",
      "Budget comfort range input (optional)",
      "Optional provider and drug entry point (routes to UX-006)",
      "Explanation panel: what Plan-O does and does not do",
    ],
    actions: [
      "Set priorities",
      "Set expected usage",
      "Add providers/drugs",
      "See my recommendations",
      "Skip to browse",
    ],
    drawer: null,
    assistant:
      "Copilot-style prompts help the consumer express priorities. All assistant output is framed as informational, never as a recommendation to enroll.",
    compliance: [
      "Plan-O is a decision-support tool, not advice: a persistent disclosure states that results are informational and the consumer chooses the plan.",
      "The inputs used for ranking must be disclosed on the results screen; the consumer can change them at any time.",
      "Every Plan-O run is logged with its inputs, model/ruleset version and outputs for later governance review.",
    ],
    source: `${V4_WF} slide 5; ${V4_AI} (Plan-O ranking guardrails); ${V4_COMP}`,
    scope: "Protected Module 1 scope",
    next: ["ux-006", "ux-007", "ux-009"],
  },
  {
    id: "UX-006",
    slug: "ux-006",
    name: "Provider & Drug Optional Lookup",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C) or agent in guided mode",
    purpose:
      "Optional refinement step. Lets the consumer name doctors and prescriptions so results can display network and formulary indicators.",
    components: [
      "Provider search with selected-provider chips",
      "Drug search with dosage/quantity fields and selected-drug chips",
      "Empty state making clear the step is optional and skippable",
      "Data-source and freshness note",
    ],
    actions: ["Search provider", "Add provider", "Search drug", "Add drug", "Skip", "Continue"],
    drawer: null,
    assistant:
      "Help on why network and formulary data may be out of date and how to verify with the carrier.",
    compliance: [
      "Network and formulary indicators must be labeled as carrier-supplied and subject to change; the consumer is told to confirm directly with the carrier before relying on them.",
      "Data source and last-refresh date are displayed wherever a match/no-match indicator appears.",
      "No provider or drug data is used for anything other than display filtering in Module 1.",
    ],
    source: `${V4_WF} slide 6; ${V4_DATA} (provider/formulary integration seam)`,
    scope: "Protected Module 1 scope",
    next: ["ux-007", "ux-009"],
  },
  {
    id: "UX-007",
    slug: "ux-007",
    name: "Optional Subsidy Check",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C) or agent in guided mode",
    purpose:
      "Offers an optional, skippable subsidy estimate and collects the minimum inputs needed for it.",
    components: [
      "Opt-in explanation: what an estimate is worth and that it can be skipped",
      "Estimated annual household income input",
      "Household size confirmation carried from UX-004",
      "Other-coverage question set required for the estimate",
      "Skip control given equal visual weight to continue",
    ],
    actions: ["Estimate my savings", "Skip this step", "Back"],
    drawer: null,
    assistant:
      "Explains estimate vs official determination and what happens on the exchange later.",
    compliance: [
      "The step must be genuinely optional — results are reachable without it.",
      "Income is collected as an estimate for display purposes only; it is not an application attestation.",
      "Consumer is told that only the exchange can determine actual eligibility.",
    ],
    source: `${V4_WF} slide 7; ${V4_COMP} (subsidy disclosure rules)`,
    scope: "Protected Module 1 scope",
    next: ["ux-008", "ux-009"],
  },
  {
    id: "UX-008",
    slug: "ux-008",
    name: "Subsidy Estimate & Education",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C) or agent in guided mode",
    purpose:
      "Presents the estimated advance premium tax credit and cost-sharing reduction tier, with the education needed to interpret it correctly.",
    components: [
      "Estimated monthly credit figure with prominent estimate framing",
      "CSR eligibility indicator and what it changes",
      "Assumptions list (income, household size, coverage year, other-coverage answers)",
      "Effect-on-results explainer: how estimated credit is applied to displayed premiums",
      "Edit assumptions control",
    ],
    actions: ["Apply estimate to results", "Edit assumptions", "Continue without applying"],
    drawer: null,
    assistant: "FAQ on reconciliation at tax time and why the final amount can differ.",
    compliance: [
      "Every figure is labeled an estimate; the word must appear adjacent to the number, not only in a footnote.",
      "Assumptions used are displayed with the result and travel with any shared quote.",
      "Final eligibility is determined only by the exchange during the EDE application — stated explicitly on this screen.",
      "Estimate inputs, ruleset version and outputs are written to the audit trail.",
    ],
    source: `${V4_WF} slide 8; ${V4_COMP}`,
    scope: "Protected Module 1 scope",
    next: ["ux-009"],
  },
  {
    id: "UX-009",
    slug: "ux-009",
    name: "Plan Results",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C), agent, or shared-quote recipient",
    purpose:
      "The core results surface. Carries both the Plan-O recommendation view and the manual browse view with filters, as two tabs over one result set.",
    components: [
      "Tabs: 'Recommended for you' (Plan-O ranked) and 'All plans' (manual browse)",
      "Plan-O panel on the recommended tab: ranked plans with fit reason, ranking-basis disclosure and 'why this plan' expander",
      "Filter rail: metal level, carrier, monthly premium, deductible, plan type (HMO/PPO/EPO), HSA eligibility, provider match, drug match",
      "Sort control (premium, deductible, estimated total annual cost, Plan-O fit)",
      "Plan cards: carrier, plan name, metal, premium after estimated credit, deductible, MOOP, network/formulary indicators",
      "Compare checkbox per card with a compare tray",
      "Result count, applied-filter chips and no-results state",
      "Subsidy-applied banner when an estimate from UX-008 is in effect",
    ],
    actions: [
      "Switch between recommended and all plans",
      "Apply / clear filters",
      "Sort results",
      "Open plan details",
      "Select up to three plans to compare",
      "Add plan to cart",
      "Save or share the quote",
    ],
    drawer: null,
    assistant:
      "Contextual help on metal levels, deductible vs MOOP, and reading the estimated-cost figure. Assistant may explain a ranking but must not tell the consumer which plan to buy.",
    compliance: [
      "When the recommended tab is shown, the basis for ranking must be disclosed on-screen — no unexplained ordering.",
      "Displayed premiums show both full premium and premium after estimated credit, with the estimate label attached.",
      "Total-cost figures are estimates based on stated usage assumptions and must say so.",
      "Only plans the agency can sell for that location and effective date appear; suppressed plans are the result of sellability rules, not editorial choice.",
      "Result set, filters and sort at the moment of selection are captured for audit.",
    ],
    source: `${V4_WF} slide 9; ${V4_AI} (ranking disclosure); ${V4_COMP}`,
    scope: "Protected Module 1 scope",
    next: ["ux-010", "ux-011", "ux-012", "ux-013"],
  },
  {
    id: "UX-010",
    slug: "ux-010",
    name: "Plan Detail Panel / Page",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C), agent, or shared-quote recipient",
    purpose: "Full detail for a single plan so the consumer can evaluate it before adding to cart.",
    components: [
      "Header: carrier, plan name, metal tier, plan id, network type",
      "Cost summary: premium, premium after estimated credit, deductible, MOOP, coinsurance",
      "Benefit table: primary care, specialist, urgent care, ER, generic/brand/specialty drugs, imaging, maternity",
      "Provider match list and drug match list when UX-006 was used",
      "Documents: Summary of Benefits and Coverage, plan brochure, formulary link",
      "Plan-O fit explanation when arriving from the recommended tab",
      "Sticky action bar",
    ],
    actions: ["Add to cart", "Add to compare", "Open SBC", "Back to results", "Share this plan"],
    drawer: null,
    assistant: "Benefit-term glossary and help reading the SBC.",
    compliance: [
      "SBC and formulary access must be available before any add-to-cart action, per plan display requirements.",
      "Benefit values are carrier-sourced; the display shows the source and effective coverage year.",
      "Any Plan-O fit narrative is labeled as generated decision support, not a recommendation to purchase.",
    ],
    source: `${V4_WF} slide 10; ${V4_DATA} (plan benefit + SBC sourcing)`,
    scope: "Protected Module 1 scope",
    next: ["ux-011", "ux-013"],
  },
  {
    id: "UX-011",
    slug: "ux-011",
    name: "Plan Comparison",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C), agent, or shared-quote recipient",
    purpose:
      "Side-by-side comparison of up to three selected plans across the attributes that drive the decision.",
    components: [
      "Column per plan with carrier, plan name and metal",
      "Aligned attribute rows: premium, premium after estimated credit, deductible, MOOP, coinsurance, key copays, network type, provider match, drug match, HSA eligibility",
      "Difference highlighting toggle",
      "Estimated annual cost row with an assumptions link",
      "Per-column add-to-cart action",
      "Remove-from-comparison control",
    ],
    actions: [
      "Remove a plan",
      "Highlight differences",
      "Add to cart",
      "Back to results",
      "Share comparison",
    ],
    drawer: null,
    assistant: "Explains what each compared attribute means; does not rank the compared plans.",
    compliance: [
      "Comparison must present the same attribute set for every plan — no selective omission that favors one carrier.",
      "Estimated annual cost carries the same estimate labeling and assumptions disclosure as results.",
      "Maximum of three plans keeps the comparison legible and matches V4 behavior.",
    ],
    source: `${V4_WF} slide 11`,
    scope: "Protected Module 1 scope",
    next: ["ux-013"],
  },
  {
    id: "UX-012",
    slug: "ux-012",
    name: "More Coverage / Ancillary Cards",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C)",
    purpose:
      "Displays additional coverage lines the agency has enabled alongside the medical selection. Module 1 is display and interest capture only.",
    components: [
      "Cards per enabled ancillary line (for example dental, vision) with a short benefit summary",
      "Interest capture control rather than an enrollment control",
      "Availability note when a line is not enabled or not sellable",
      "Explanatory line that these are separate from the on-exchange medical application",
    ],
    actions: ["Express interest", "Learn more", "Continue without adding"],
    drawer: null,
    assistant:
      "FAQ on how ancillary coverage differs from the medical plan and what happens after expressing interest.",
    compliance: [
      "No ancillary enrollment in Module 1 — the reconciliation package holds ancillary enrollment for a later packet. This screen must not present a purchase or checkout path.",
      "Interest capture creates a lead activity, and the consumer is told an agent will follow up.",
      "Cards appear only for lines enabled in UX-024 and permitted by sellability rules.",
    ],
    source: `${V4_WF} slide 12; scope fence from ${RECON}`,
    scope: "Protected Module 1 scope",
    next: ["ux-013"],
  },
  {
    id: "UX-013",
    slug: "ux-013",
    name: "Cart Drawer",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C) or agent building a quote",
    purpose:
      "Holds the consumer's selection and shows what will be carried into the enrollment path.",
    components: [
      "Selected medical plan line with premium and estimated credit applied",
      "Ancillary interest lines shown as interest, visually distinct from the enrollable selection",
      "Household summary and effective date",
      "Running estimated monthly total with estimate labeling",
      "Remove and change-plan controls",
      "Save quote and share quote controls",
      "Primary continue action into the enroll gate",
    ],
    actions: ["Remove item", "Change plan", "Save quote", "Share quote", "Continue to review"],
    drawer: null,
    assistant:
      "Explains that the cart is a saved selection, not a purchase, and that enrollment happens on the exchange.",
    compliance: [
      "The cart must never read as a completed purchase; totals are labeled estimated and no payment is collected in Module 1.",
      "Only one medical plan may be active in the cart at a time.",
      "Cart add, remove and change events are written to the quote audit trail with timestamp and actor.",
    ],
    source: `${V4_WF} slide 13`,
    scope: "Protected Module 1 scope",
    next: ["ux-014"],
  },
  {
    id: "UX-014",
    slug: "ux-014",
    name: "Review & Enroll Gate",
    group: "Registration & enroll",
    shell: "consumer",
    user: "Consumer (D2C)",
    purpose:
      "Final review of the selection and the point at which the consumer is told exactly what happens next, before any account creation or handoff.",
    components: [
      "Read-only summary: household, location, effective date, selected plan, estimated credit, estimated monthly cost",
      "Ancillary interest summary",
      "Next-steps explainer describing the exchange application ahead",
      "Consent and acknowledgement block (agent of record where applicable, information sharing, e-signature/consent to contact)",
      "Edit links back to each contributing step",
      "Primary action: create account and continue",
    ],
    actions: [
      "Edit selection",
      "Accept disclosures",
      "Create account & continue",
      "Save for later",
    ],
    drawer: null,
    assistant:
      "Answers 'what happens after I click continue' in the same wording as the handoff explanation screen.",
    compliance: [
      "Required consents must be affirmative and individually recorded with timestamp, IP and the exact disclosure text version presented.",
      "Agent-of-record consent is captured here when the session is agent-attributed.",
      "The screen must state that no coverage is in force until the exchange application is completed and the carrier accepts it.",
      "The review snapshot is immutable and retained as the pre-handoff record.",
    ],
    source: `${V4_WF} slide 14; ${V4_COMP} (consent capture)`,
    scope: "Protected Module 1 scope",
    next: ["ux-015", "ux-023"],
  },
  {
    id: "UX-015",
    slug: "ux-015",
    name: "Registration / Login Gate",
    group: "Registration & enroll",
    shell: "consumer",
    user: "Consumer (D2C), new or returning",
    purpose:
      "Converts the anonymous shopping session into an identified member account so the quote, cart and handoff state can be persisted and resumed.",
    components: [
      "Create-account form: name, email, mobile, password",
      "Sign-in form for returning users with forgot-password path",
      "Verification step (email or SMS code)",
      "Explanation of why an account is required at this point",
      "Anonymous-session merge notice: your quote and cart will be attached to this account",
      "Consent to contact and terms acknowledgement",
    ],
    actions: ["Create account", "Sign in", "Verify code", "Resend code", "Back to review"],
    drawer: null,
    assistant:
      "Help with verification codes and account recovery only. No shopping advice at the gate.",
    compliance: [
      "Credentials handled by the platform identity service; no password is stored or displayed in application data.",
      "Account creation links the anonymous session's quote to the member record and stamps the merge in the audit trail.",
      "Consent-to-contact is separate from terms acceptance and separately recorded.",
      "Lead attribution (agency, agent, marketplace source) is locked at account creation.",
    ],
    source: `${V4_WF} slide 15; ${V4_REQ} (session merge + attribution)`,
    scope: "Protected Module 1 scope",
    next: ["ux-023", "ux-016"],
  },
  {
    id: "UX-016",
    slug: "ux-016",
    name: "Consumer Dashboard / Resume",
    group: "Registration & enroll",
    shell: "consumer",
    user: "Registered consumer / member (returning)",
    purpose:
      "Branded member landing that lets a returning consumer resume exactly where they left off and see the status of what they started.",
    components: [
      "Resume card for the most recent in-progress quote with its step and last-updated time",
      "Saved quotes list with status (draft, shared, expired, handed off)",
      "Application status card reflecting EDE handoff state returned to ABox",
      "Household summary card",
      "Documents and notices area (Module 1 scope: quote summary and handoff confirmation)",
      "My agent card with contact and request-a-call action",
      "Notifications list",
    ],
    actions: [
      "Resume quote",
      "Open a saved quote",
      "Start a new quote",
      "Contact my agent",
      "Request a call",
    ],
    drawer: null,
    assistant:
      "Member-voice help: where is my application, how do I resume, how do I reach my agent.",
    compliance: [
      "Member sees only their own household's records; agent-only fields and internal notes never render here.",
      "Application status is a mirror of the state ABox received from the exchange handoff — it must be labeled as such and timestamped, not presented as a live exchange determination.",
      "Expired shared quotes display as expired rather than silently disappearing.",
    ],
    source: `${V4_WF} slide 16; IA member-workspace pattern from ${IA} (chrome only)`,
    scope: "Protected Module 1 scope",
    next: ["ux-009", "ux-022"],
  },
  {
    id: "UX-017",
    slug: "ux-017",
    name: "Agent Quick Quote Start",
    group: "Agent",
    shell: "internal",
    user: "Licensed agent / producer (internal workspace)",
    purpose:
      "Lets an agent open a quote in seconds from inside the platform, typically while on the phone with a prospect.",
    components: [
      "Minimal start form: ZIP/county, effective date, household members",
      "Existing-lead lookup so the quote attaches to a known lead instead of creating a duplicate",
      "New-lead capture when no match exists",
      "Agency / writing-entity selector when the agent operates under more than one",
      "Recent quick quotes list for fast resume",
      "Left module nav on Marketplace & Sales; top bar carries workspace and entity context",
    ],
    actions: ["Search lead", "Create lead", "Start quick quote", "Resume a recent quote"],
    drawer: [
      "Context: current workspace, entity and writing agency for this quote",
      "Summary: matched lead record if one is attached",
      "Guidance: quick quote vs full consumer flow",
      "Help & FAQ: agent-facing FAQ set",
      "Audit: who started this quote and under which entity",
      "Next actions: send quote, schedule a call, log an activity",
    ],
    assistant:
      "Copilot for agents: prefill hints from the matched lead, reminders about missing rating inputs.",
    compliance: [
      "Agent must hold an active license and appointment for the state and product before the quote can proceed; the gate is enforced here, not at send time only.",
      "The writing entity chosen determines commission attribution and is recorded on the quote.",
      "Creating a lead from this screen records source as agent quick quote.",
    ],
    source: `${V4_WF} slide 17; shell/nav framing from ${IA}`,
    scope: "Protected Module 1 scope",
    next: ["ux-018"],
  },
  {
    id: "UX-018",
    slug: "ux-018",
    name: "Agent Quick Quote Workspace",
    group: "Agent",
    shell: "internal",
    user: "Licensed agent / producer (internal workspace)",
    purpose:
      "The agent's working surface over the same quote engine the consumer uses: inputs on one side, live results on the other, so the agent can talk a prospect through options.",
    components: [
      "Left input rail: household, location, effective date, subsidy estimate inputs, Plan-O priorities",
      "Right results panel reusing the UX-009 result set with the same filters and sort",
      "Compare tray and plan detail access",
      "Cart / selection summary for the prospect",
      "Notes field written to the lead timeline",
      "Actions: send quote, schedule call, save",
    ],
    actions: [
      "Edit rating inputs and re-run results",
      "Run Plan-O",
      "Open plan detail / compare",
      "Add plan to the prospect's selection",
      "Log a note",
      "Send quote",
    ],
    drawer: [
      "Context: lead, agency, agent of record",
      "Summary: quote version, plan count, subsidy estimate state",
      "Guidance: what the consumer will see when this quote is shared",
      "Help & FAQ: agent FAQ",
      "Audit: quote version history and re-runs",
      "Next actions: send quote, request call, create task",
    ],
    assistant:
      "Agent copilot: summarize the difference between two plans in consumer language, draft the send-quote message. Output is marked assistive and requires the agent to confirm before it is sent.",
    compliance: [
      "The agent-facing results must be the same result set the consumer would see for the same inputs — no agent-only plan visibility that isn't a sellability difference.",
      "Sensitive prospect fields are masked by default and unmasking is logged.",
      "Any AI-drafted consumer-facing text passes through UX-026 review before it leaves the platform.",
      "Quote versions are immutable once shared.",
    ],
    source: `${V4_WF} slide 18; ${V4_AI}`,
    scope: "Protected Module 1 scope",
    next: ["ux-019", "ux-022", "ux-026"],
  },
  {
    id: "UX-019",
    slug: "ux-019",
    name: "Agent Send Quote",
    group: "Agent",
    shell: "internal",
    user: "Licensed agent / producer (internal workspace)",
    purpose:
      "Composes and sends a shared quote link to the consumer, with the delivery, expiry and disclosure settings the agency permits.",
    components: [
      "Recipient block from the lead record with editable email / mobile",
      "Channel selection (email, SMS) limited to channels enabled in UX-025",
      "Message composer with agency-approved template and AI-draft option",
      "Included-plans selector (which plans the shared view will show)",
      "Link expiry setting within agency-configured bounds",
      "Preview of the consumer's read-only view",
      "Send confirmation state with a copyable link",
    ],
    actions: [
      "Select plans to include",
      "Choose channel",
      "Edit message",
      "Preview as consumer",
      "Send",
      "Copy link",
    ],
    drawer: [
      "Context: recipient, channel, consent state",
      "Summary: quote version being shared and its expiry",
      "Guidance: what changes after sending (version locks)",
      "Help & FAQ",
      "Audit: prior sends for this lead",
      "Next actions: schedule follow-up, create task",
    ],
    assistant:
      "Drafts the accompanying message; the draft is labeled AI-generated and must be reviewed in UX-026 before send.",
    compliance: [
      "Consent to contact on the chosen channel must exist before send; SMS requires its own consent record and opt-out language.",
      "Agent licensing and appointment are re-verified at send time for every product included.",
      "Required disclosures and the agency's licensed-entity identification are appended to every outbound message by the platform, not by the agent.",
      "Send events record actor, channel, recipient, quote version, expiry and message body version.",
      "Sending locks the quote version — later edits create a new version rather than changing what the consumer received.",
    ],
    source: `${V4_WF} slide 19; ${V4_COMP}; channel config from UX-025`,
    scope: "Protected Module 1 scope",
    next: ["ux-020", "ux-026", "ux-021"],
  },
  {
    id: "UX-020",
    slug: "ux-020",
    name: "Shared Quote Read-Only View",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer recipient of an agent-shared quote (unauthenticated, tokenized link)",
    purpose:
      "The branded, read-only view a consumer sees when opening an agent's shared quote link, with clear paths to act.",
    components: [
      "Agency brand header and 'prepared by <agent>' attribution",
      "Household and effective date summary, read-only",
      "Included plan cards with the same disclosures as results",
      "Compare view across the included plans",
      "Expiry notice with the date the link stops working",
      "Action bar: I'm interested, request a call, continue to enroll",
      "Expired-link state with a request-a-new-quote action",
    ],
    actions: [
      "Open plan detail",
      "Compare included plans",
      "I'm interested",
      "Request a call",
      "Continue to enroll",
    ],
    drawer: null,
    assistant:
      "Consumer-voice help limited to understanding the quote and reaching the agent. No editing capability is offered.",
    compliance: [
      "Read-only by construction: the recipient cannot alter household, rating inputs or the plan set — any change requires a new quote from the agent.",
      "Tokenized link with expiry; expired or revoked tokens show a neutral expiry screen and disclose no PII.",
      "Displayed PII is limited to what the recipient already provided; DOBs and any identifiers render masked.",
      "Estimate labeling, ranking-basis disclosure and agency licensure identification carry over unchanged from the results screen.",
      "Every open of the link is logged with timestamp for the lead timeline.",
    ],
    source: `${V4_WF} slide 20; ${V4_COMP} (tokenized share rules)`,
    scope: "Protected Module 1 scope",
    next: ["ux-022", "ux-014"],
  },
  {
    id: "UX-021",
    slug: "ux-021",
    name: "Lead Timeline & Milestones",
    group: "Agent",
    shell: "internal",
    user: "Agent, agency manager or agency admin (internal workspace)",
    purpose:
      "Chronological record of everything that happened on a lead within Module 1, plus the milestone states that indicate where the consumer is in the shopping-to-handoff journey.",
    components: [
      "Milestone strip: lead created, quote started, quote shared, quote viewed, plan selected, account created, handoff initiated, handoff confirmed",
      "Activity feed: quote created/versioned, quote sent, link opened, interest expressed, call requested, callback scheduled, notes, notifications sent",
      "Filter by activity type and actor",
      "Quick actions: log note, create task, resume quote, send quote, request call",
      "Related objects: quotes, shared links, account, handoff record",
    ],
    actions: [
      "Filter timeline",
      "Log a note",
      "Create a task",
      "Open related quote",
      "Resume the consumer's quote",
    ],
    drawer: [
      "Context: lead ownership, agency, agent of record",
      "Summary: current milestone and days in stage",
      "Guidance: what the next milestone requires",
      "Help & FAQ",
      "Audit: full event log including system events",
      "Next actions: send quote, schedule call, create task",
    ],
    assistant:
      "Summarizes the lead's history and suggests the next Module 1 action, always citing the events it used.",
    compliance: [
      "Timeline is append-only; entries cannot be edited or deleted, only annotated.",
      "System events (link opens, notification sends, handoff callbacks) are distinguishable from human actions.",
      "Timeline is scoped by the relationship graph — an agent sees their own leads, an agency admin sees the entity and its downline.",
      "Sensitive values in event payloads render masked; unmasking is itself an audited event.",
      "Module 1 timeline covers shopping through handoff only; post-enrollment servicing events are out of scope.",
    ],
    source: `${V4_WF} slide 21; object-page pattern from ${IA}`,
    scope: "Protected Module 1 scope",
    next: ["ux-018", "ux-022"],
  },
  {
    id: "UX-022",
    slug: "ux-022",
    name: "Schedule Time / Request Call",
    group: "Consumer shopping",
    shell: "consumer",
    user: "Consumer (D2C or shared-quote recipient)",
    purpose:
      "The 'I'm interested' path. Lets a consumer ask to be contacted or pick a simple time window, and routes the request to the right agent.",
    components: [
      "Interest confirmation summarizing what the consumer is interested in (quote, specific plan, or ancillary line)",
      "Contact preference: call me back vs pick a time",
      "Simple availability picker: day plus time-window slots",
      "Contact details with consent-to-contact checkbox",
      "Optional message field",
      "Confirmation state with what happens next and expected response window",
    ],
    actions: [
      "Request a call",
      "Pick a time window",
      "Confirm contact details",
      "Submit",
      "Cancel",
    ],
    drawer: null,
    assistant:
      "Explains response times and how to reach the agency directly; does not attempt to answer plan questions here.",
    compliance: [
      "Consent to be contacted is explicit and separately recorded per channel, with opt-out language for SMS.",
      "Scheduling in Module 1 is a request for a time window, not a booked calendar appointment — the confirmation copy must not promise a confirmed booking.",
      "Requests route by the agency's routing rules from UX-025 and create an auditable lead activity.",
      "No plan or subsidy advice is given in the confirmation copy.",
    ],
    source: `${V4_WF} slide 22; routing config from UX-025; scope fence from ${RECON}`,
    scope: "Protected Module 1 scope",
    next: ["ux-016", "ux-021"],
  },
  {
    id: "UX-023",
    slug: "ux-023",
    name: "JET / EDE Handoff Confirmation & Explanation",
    group: "Handoff",
    shell: "consumer",
    user: "Registered consumer (D2C), or agent-assisted consumer",
    purpose:
      "Explains the on-exchange EDE handoff in plain language, captures the consent required to transfer information, and confirms the handoff after it is initiated.",
    components: [
      "Plain-language explainer: you are continuing on the enhanced direct enrollment application to complete your on-exchange enrollment",
      "What transfers: household, location, effective date, selected plan; what does not transfer and will be asked again",
      "What you will need list (identity verification, income documentation)",
      "Agent-of-record statement when the session is agent-attributed",
      "Consent to transfer information, with the disclosure text shown inline",
      "Primary continue-to-application action and a save-and-return-later option",
      "Post-initiation confirmation state: reference id, timestamp, status and how to return to ABox",
      "Error / unavailable state with retry and agent-contact path",
    ],
    actions: [
      "Read disclosures",
      "Consent and continue",
      "Save and finish later",
      "Copy reference id",
      "Return to my dashboard",
    ],
    drawer: null,
    assistant:
      "Answers what EDE is, why the consumer leaves ABox, and whether they lose their work. Assistant does not provide eligibility or enrollment advice.",
    compliance: [
      "Consent to transfer must be affirmative, versioned and logged with timestamp, IP and the exact disclosure text displayed.",
      "The consumer must be told they are being taken to the enhanced direct enrollment application and that eligibility is determined there, not in ABox.",
      "No coverage is in force at handoff — the confirmation must say so explicitly.",
      "The handoff payload is recorded (fields sent, target, reference id, response) and is replayable for audit without re-sending PII to the screen.",
      "Failures are surfaced honestly with a recovery path; a failed handoff must never render as success.",
    ],
    source: `${V4_WF} slide 23; ${V4_DATA} (EDE handoff payload); ${V4_COMP}`,
    scope: "Protected Module 1 scope",
    next: ["ux-016"],
  },
  {
    id: "UX-024",
    slug: "ux-024",
    name: "Module 1 Config: Branding & Products",
    group: "Module 1 configuration",
    shell: "internal",
    user: "Agency admin (internal workspace), platform admin",
    purpose:
      "The minimal agency configuration Module 1 requires on the branding and product side: how the consumer marketplace looks and which product lines it can shop.",
    components: [
      "Brand settings: logo, marketplace display name, primary color token, favicon",
      "Marketplace URL / subdomain field",
      "Licensed-entity and disclosure text fields used in the consumer footer",
      "Product line enablement list with per-line on/off and state availability read-out",
      "Plan-O enablement toggle and priority-set selection",
      "Ancillary line enablement (display and interest capture only in Module 1)",
      "Preview-as-consumer action",
      "Guardrail notes where platform policy overrides agency choice",
    ],
    actions: [
      "Upload logo",
      "Edit marketplace name",
      "Enable/disable a product line",
      "Toggle Plan-O",
      "Preview as consumer",
      "Save",
    ],
    drawer: [
      "Context: entity being configured and inheritance from the parent agency",
      "Summary: what is enabled today",
      "Guidance: which settings the consumer sees immediately",
      "Help & FAQ",
      "Audit: configuration change history with actor and timestamp",
      "Next actions: preview, publish",
    ],
    assistant:
      "Explains the effect of each setting on the consumer marketplace and which settings the platform locks.",
    compliance: [
      "Product enablement cannot exceed the agency's licensing and appointments — the UI shows why a line is unavailable rather than allowing an invalid configuration.",
      "Disclosure and licensed-entity text is required before a marketplace can be published.",
      "Every configuration change is versioned and auditable, with the prior value retained.",
      "Only Module 1 settings appear here; broader white labeling (notification and document templates, full theme systems) belongs to a later Phase 1 packet.",
    ],
    source: `${V4_WF} slide 24; scope fence from ${RECON}`,
    scope: "Protected Module 1 scope",
    next: ["ux-025", "ux-001"],
  },
  {
    id: "UX-025",
    slug: "ux-025",
    name: "Module 1 Config: Routing & Notifications",
    group: "Module 1 configuration",
    shell: "internal",
    user: "Agency admin (internal workspace), platform admin",
    purpose:
      "The minimal agency configuration Module 1 requires on the operational side: who gets the lead and what messages go out.",
    components: [
      "Lead routing rules: round robin, by state/licensure, by product line, or named default owner",
      "Fallback owner and unassigned-queue setting",
      "Business hours and response-window expectation used in consumer confirmation copy",
      "Notification matrix: event (quote shared, link opened, interest expressed, call requested, handoff initiated, handoff confirmed) by recipient (consumer, agent, agency) by channel (email, SMS, in-app)",
      "Channel enablement with consent-requirement notes",
      "Template selection per notification from agency-approved templates",
      "Test-send action",
    ],
    actions: [
      "Add routing rule",
      "Reorder rules",
      "Set fallback owner",
      "Toggle a notification",
      "Choose a template",
      "Send test",
      "Save",
    ],
    drawer: [
      "Context: entity being configured and inherited rules from the parent",
      "Summary: active rules and enabled notifications",
      "Guidance: how routing interacts with licensing",
      "Help & FAQ",
      "Audit: rule and notification change history",
      "Next actions: test send, publish",
    ],
    assistant: "Explains routing precedence and which notifications require consumer consent.",
    compliance: [
      "Routing can only assign a lead to an agent licensed and appointed for the state and product; invalid targets are blocked at configuration time.",
      "SMS notifications cannot be enabled for consumer recipients without the consent capture that produces the required consent record.",
      "Platform-required disclosures are appended to outbound templates and cannot be removed by the agency.",
      "Configuration changes are versioned and auditable.",
    ],
    source: `${V4_WF} slide 25; ${V4_COMP}`,
    scope: "Protected Module 1 scope",
    next: ["ux-024", "ux-021"],
  },
  {
    id: "UX-026",
    slug: "ux-026",
    name: "AI Review & Confirmation",
    group: "AI",
    shell: "internal",
    user: "Agent or agency admin (internal workspace)",
    purpose:
      "The human-in-the-loop checkpoint for any AI-generated output that would reach a consumer or change a record: the user reviews, edits, confirms or rejects.",
    components: [
      "Generated output panel with an explicit AI-generated label",
      "Source / basis panel listing the records and inputs the output was derived from",
      "Editable draft area with change tracking against the original generation",
      "Guardrail check results (prohibited-advice check, disclosure presence, PII check)",
      "Confirm, edit-and-confirm, regenerate and reject controls",
      "Rejection reason capture",
      "Model / ruleset version and generation timestamp",
    ],
    actions: [
      "Review basis",
      "Edit draft",
      "Regenerate",
      "Reject with reason",
      "Confirm and continue",
    ],
    drawer: [
      "Context: the action the output belongs to and the record it affects",
      "Summary: guardrail check results",
      "Guidance: what the reviewer is responsible for checking",
      "Help & FAQ: AI usage policy",
      "Audit: generation, edits, decision and actor",
      "Next actions: send, save draft, escalate",
    ],
    assistant:
      "The assistant does not self-approve here; the panel is the control surface over the assistant's own output.",
    compliance: [
      "No AI output reaches a consumer without an explicit human confirmation recorded against a named user.",
      "AI must not generate plan recommendations phrased as advice, eligibility determinations, or guarantees of coverage or cost; the guardrail check blocks confirmation when such language is detected.",
      "Generation inputs, output, model/ruleset version, edits and the reviewer's decision are all retained for governance review.",
      "Rejected outputs are retained with their rejection reason and are never silently discarded.",
    ],
    source: `${V4_WF} slide 26; ${V4_AI}; ${V4_COMP}`,
    scope: "Protected Module 1 scope",
    next: ["ux-019", "ux-018"],
  },
];

export const M1_BY_SLUG: Record<string, M1Screen> = Object.fromEntries(
  M1_SCREENS.map((s) => [s.slug, s]),
);

export const M1_GROUPS: M1Group[] = [
  "Consumer shopping",
  "Registration & enroll",
  "Handoff",
  "Agent",
  "Module 1 configuration",
  "AI",
];

/** Requested wireframe list mapped onto the V4 inventory, shown on the index. */
export const M1_REQUEST_MAP: { req: string; ids: string[] }[] = [
  { req: "Branded consumer marketplace landing", ids: ["UX-001"] },
  { req: "Product selection", ids: ["UX-002"] },
  { req: "Plan-O entry and Browse entry", ids: ["UX-002", "UX-005"] },
  { req: "D2C IFP quote wizard", ids: ["UX-003", "UX-004", "UX-005", "UX-006"] },
  { req: "ZIP / county / effective date", ids: ["UX-003"] },
  { req: "Household / member inputs", ids: ["UX-004"] },
  { req: "Optional subsidy estimate", ids: ["UX-007", "UX-008"] },
  { req: "Plan results", ids: ["UX-009"] },
  { req: "Plan details", ids: ["UX-010"] },
  { req: "Manual browse and filters", ids: ["UX-009"] },
  { req: "Plan-O recommendation view", ids: ["UX-009", "UX-005"] },
  { req: "Compare plans", ids: ["UX-011"] },
  { req: "Cart", ids: ["UX-013"] },
  { req: "Registration / login gate", ids: ["UX-015"] },
  { req: "Review and enroll", ids: ["UX-014"] },
  { req: "On-exchange EDE handoff explanation", ids: ["UX-023"] },
  { req: "Shared quote read-only view", ids: ["UX-020"] },
  { req: "I'm interested / request call flow", ids: ["UX-022"] },
  { req: "Returning user dashboard / resume", ids: ["UX-016"] },
  { req: "Agent quick quote", ids: ["UX-017", "UX-018"] },
  { req: "Agent send quote", ids: ["UX-019"] },
  { req: "Simple scheduling / request callback", ids: ["UX-022"] },
  { req: "Lead timeline view (Module 1 scope)", ids: ["UX-021"] },
  { req: "Minimal agency configuration for Module 1", ids: ["UX-024", "UX-025"] },
  { req: "Also in V4, included for completeness", ids: ["UX-006", "UX-012", "UX-026"] },
];
