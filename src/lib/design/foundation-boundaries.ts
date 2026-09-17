/**
 * Phase 7 — ownership boundaries between the core foundation, brand /
 * white-label configuration, marketplace asset management and experiences.
 * Documentation only; no runtime owner is changed.
 */
import type { BlueprintRow } from "./types";

const P4 = "Phase 4 — iconography & assets" as const;

export const FOUNDATION_BOUNDARIES: BlueprintRow[] = [
  {
    item: "ABox Core foundation",
    source: "src/styles.css",
    current:
      "Owns colour roles, tiers, radii, shadows, type families, utilities and keyframes for the whole application.",
    future: "The single canonical foundation. Not tenant-configurable.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Branding & White-Label",
    source: "src/routes/app/jet/branding",
    current:
      "A runtime administration surface that configures tenant-facing brand values. It is the source of truth for those values and is untouched by the reference layer.",
    future:
      "A brand/ token group layered over the core, restricted to brand colour, logo and name.",
    label: "GOVERNANCE RULE",
    phase: P4,
  },
  {
    item: "Marketplace Asset Management",
    source: "src/routes/marketplace/admin/assets",
    current:
      "Runtime owner of marketplace assets. Nothing in the reference layer reads, mirrors or edits it.",
    future: "Stays a runtime system. The design system documents its slots, never its content.",
    label: "GOVERNANCE RULE",
    phase: P4,
  },
  {
    item: "Configurable vs fixed",
    source: "Phase 7 analysis",
    current:
      "No formal boundary is declared in code; branding configuration happens to touch a narrow set.",
    future:
      "Configurable: brand colour, logo, product name. Fixed: status roles, tier colours, spacing, radii, type scale, focus and motion. FUTURE DECISION on whether brand colour may drive the action role.",
    label: "FUTURE DECISION",
    phase: P4,
  },
  {
    item: "Tier colours",
    source: "--metal-*",
    current: "Identical in light and dark and across tenants.",
    future:
      "Explicitly non-configurable: tiers carry regulated product meaning, not brand expression.",
    label: "GOVERNANCE RULE",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Status colours",
    source: "sage, warning, destructive, info, success",
    current: "Shared globally; tone is chosen per call site.",
    future: "Non-configurable. Status meaning must not shift per tenant.",
    label: "GOVERNANCE RULE",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Experience-specific layout",
    source: "88rem web container vs dashboard shells",
    current:
      "Web and shopping share the 88rem container; dashboards deliberately do not, by explicit instruction.",
    future:
      "Recorded as an experience-level decision that the core foundation must not override.",
    label: "GOVERNANCE RULE",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    item: "Route-local kits",
    source: "M06, M08, Lucie and Lucie-app kits, AI elements",
    current: "Own module-specific composition within their routes.",
    future:
      "They consume the foundation and never redefine it. Promotion to core requires a governed decision.",
    label: "GOVERNANCE RULE",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Reference layer",
    source: "src/lib/design/*, reference-kit, /design-system, /design-guide",
    current:
      "Consumed only by the two unlisted routes. No production screen imports any of it.",
    future: "Remains read-only documentation. It never becomes a runtime dependency.",
    label: "GOVERNANCE RULE",
    phase: "Phase 6 — direct production read",
  },
  {
    item: "Unowned patterns",
    source: "Card surface markup, .story-link used 89 times with no definition found",
    current: "Recurring patterns with no owning component or declaration.",
    future: "Ownership assignment is deferred to a later governed phase.",
    label: "FUTURE DECISION",
    phase: "Phase 3 — typography",
  },
];
