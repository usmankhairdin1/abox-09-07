/**
 * Phase 7 — how the one core foundation is expressed per experience.
 * There is one system; these are contextual usage notes, not sub-systems.
 */
import type { BlueprintRow } from "./types";

const P2 = "Phase 2 — spacing, layout, responsive" as const;

export const FOUNDATION_EXPERIENCE_GUIDANCE: BlueprintRow[] = [
  {
    item: "Web / marketing",
    source: "Landing, ICHRA, support, auth, referral and error routes",
    current:
      "88rem centred container, full-width header, viewport-aware hero, display typography at its largest, decorative utilities such as aurora, contour and edge-sheen, generous vertical rhythm.",
    future:
      "Expressive tier of the same foundation: larger type roles, wider spacing steps, decorative motion permitted.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "Shopping / marketplace",
    source: "Plans, cart, compare, coverage, apply, review, select",
    current:
      "Same 88rem container inside MarketplaceShell across 30 routes; compact PageHeader, dense filter chips, solid tier badges at full opacity, tabular numerals for premiums, single-select per product type in the cart.",
    future:
      "Decision tier: compact density, numeric type role, tier and status colour carry product meaning and are never decorative.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "Dashboard / admin",
    source: "InternalShell across 89 files, agency, JET and member surfaces",
    current:
      "Shell-managed width rather than the 88rem container, DataTable across 20 routes, KpiCard across 18, StatusBadge everywhere, eyebrow labels, denser tables.",
    future:
      "Operational tier: densest spacing, smallest sustainable type, status colour dominant, decoration absent.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
    note: "Dashboards were explicitly excluded from the container-width change and must stay that way.",
  },
  {
    item: "Member experience",
    source: "member-shell.tsx",
    current:
      "Full-width header with an 88rem content area and a 36px icon navigation with a connecting arc.",
    future: "A fourth contextual expression sitting between web and dashboard.",
    label: "OBSERVED VARIATION",
    phase: P2,
  },
  {
    item: "Shared across all experiences",
    source: "styles.css, StatusBadge, Button, Input, icon sizes, focus, motion",
    current:
      "Colour roles, tier colours, status tones, radii, shadows, type families, icon sizes, focus treatment and reduced-motion behaviour are identical everywhere.",
    future:
      "This shared set is the core. Anything not in it is experience guidance, not a second system.",
    label: "GOVERNANCE RULE",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Future experiences",
    source: "Proposed",
    current: "Not applicable.",
    future:
      "A new experience inherits the full core and may only add container width, density mode and decorative permission. It may not introduce colour roles, tiers or type families.",
    label: "GOVERNANCE RULE",
    phase: "Phase 6 — direct production read",
  },
];
