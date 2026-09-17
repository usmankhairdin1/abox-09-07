/**
 * Phase 11 — regression contract.
 * DOCUMENTATION ONLY. What any future canonicalization must prove it did not
 * change, and the evidence that proves it.
 */
import type { RegressionClause } from "./canonical-readiness-types";

export const REGRESSION_CONTRACT: RegressionClause[] = [
  {
    dimension: "Visual appearance",
    mustRemain: "Every screen renders identically at the covered viewports.",
    evidenceRequired: "Before and after screenshots of the representative routes.",
    method: "Same viewport, same data, same scroll position, compared image by image.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Spacing",
    mustRemain: "Padding, gaps and container widths unchanged, including the 88rem web container.",
    evidenceRequired: "Screenshot comparison plus the measured spacing records from Phase 2.",
    method: "Visual diff; measurement where a diff is ambiguous.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Typography",
    mustRemain: "Family, size, weight, line height, tracking and heading hierarchy unchanged.",
    evidenceRequired: "Screenshot comparison plus the Phase 3 measured scale.",
    method: "Visual diff on text-heavy routes.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Colour",
    mustRemain:
      "Every token value and every resolved colour unchanged, including metal tier backgrounds and their chosen foregrounds.",
    evidenceRequired: "Token values before and after; screenshots of plan results and filters.",
    method: "Token comparison plus visual diff.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Layout",
    mustRemain: "Structure, order and column counts unchanged.",
    evidenceRequired: "Screenshots at desktop and mobile.",
    method: "Visual diff.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Responsive behaviour",
    mustRemain:
      "The same breakpoints trigger the same structural changes, including the deliberately different stacking points.",
    evidenceRequired: "Screenshots at each covered viewport.",
    method: "Viewport sweep across the representative routes.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Interaction",
    mustRemain: "Hover, focus, selection, open and close behaviour unchanged.",
    evidenceRequired: "Scripted interaction runs on the affected surfaces.",
    method: "Browser automation with the same steps before and after.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Accessibility",
    mustRemain: "Roles, labels, focus order, keyboard access and aria-pressed semantics unchanged.",
    evidenceRequired: "Accessibility tree comparison on affected surfaces.",
    method: "Automated snapshot plus keyboard walkthrough.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Content",
    mustRemain:
      "Wording unchanged in English and Spanish, including exact labels such as Cart, Cart · N and Plan available.",
    evidenceRequired: "Text comparison in both languages.",
    method: "Rendered text diff.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Route behaviour",
    mustRemain:
      "Every route resolves to the same page with the same guards and the same preserved state.",
    evidenceRequired:
      "Route sweep and state checks such as preserved quote, cart and PlanAI progress.",
    method: "Navigation run through the representative routes.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Branding",
    mustRemain: "Branding & White-Label resolves tenant values exactly as before.",
    evidenceRequired: "Branding route rendering before and after.",
    method: "Visual and behavioural check of the branding screens.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Assets",
    mustRemain:
      "Marketplace Asset Management behaves identically; no asset is moved, renamed or re-encoded.",
    evidenceRequired: "Asset administration route rendering and asset references.",
    method: "Route check plus reference comparison.",
    status: "GOVERNANCE RULE",
  },
  {
    dimension: "Business logic",
    mustRemain: "Cart rules, quote state, eligibility and governed module evaluation unchanged.",
    evidenceRequired: "Behavioural runs of the affected flows.",
    method: "Scripted flows, including add-on bundling and single-selection per product type.",
    status: "GOVERNANCE RULE",
  },
];

export const REGRESSION_COVERAGE = {
  routes: [
    "/",
    "/plans",
    "/cart",
    "/agency/my-organization",
    "/app/jet/branding",
    "marketplace asset administration",
    "/member/settings",
  ],
  viewports: [
    { name: "Desktop", size: "1280 x 1800" },
    { name: "Tablet", size: "834 x 1100 — required wherever a stacking breakpoint is in scope" },
    { name: "Mobile", size: "390 x 900" },
  ],
  languages: ["English", "Spanish"],
  states: ["signed out", "signed in", "empty cart", "cart with a plan", "cart with add-ons"],
};

export const REGRESSION_RULES: string[] = [
  "GOVERNANCE RULE — evidence is captured before the change, not reconstructed afterwards.",
  "GOVERNANCE RULE — an unexplained difference is a failure, including one that looks like an improvement.",
  "GOVERNANCE RULE — a known animation difference is acknowledged in advance, never used to excuse an unexpected diff.",
  "GOVERNANCE RULE — tablet coverage is required whenever a stacking breakpoint is in scope, because the stacking points differ by screen today.",
  "GOVERNANCE RULE — the running application is the reference. Where documentation and the application disagree, the documentation is corrected.",
];
