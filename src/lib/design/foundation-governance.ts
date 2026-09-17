/**
 * Phase 7 — foundation governance and maturity.
 * Descriptive only. No score, no ranking, no remediation performed.
 */
import type { BlueprintRow, FoundationMaturityRecord } from "./types";

export const FOUNDATION_MATURITY: FoundationMaturityRecord[] = [
  {
    category: "Colour",
    implementation: "Semantic variables in both light and dark, with paired foregrounds.",
    evidence:
      "Full :root and .dark blocks; 264 bg-card, 716 text-muted-foreground, 497 border-border.",
    centralization: "CENTRALIZED",
    variation:
      "Five compatibility aliases remain; bg-info, bg-success and bg-panel are used once or twice each.",
    ownership: "styles.css",
    futureTarget: "Primitive layer beneath the existing semantic names.",
    readiness: "Ready to mirror into Figma once oklch conversion is accepted.",
    openDecision: "Whether the aliases are retired.",
  },
  {
    category: "Tier colour",
    implementation: "Six tiers with explicit foregrounds, theme-independent.",
    evidence: "--metal-* and --metal-*-fg; used by MetalBadge in tiles, filters and cart.",
    centralization: "CENTRALIZED",
    variation: "None. Opacity was deliberately removed from every tier surface.",
    ownership: "styles.css and MetalBadge",
    futureTarget: "A separate Tier collection.",
    readiness: "Highest-maturity category in the system.",
    openDecision: "None.",
  },
  {
    category: "Status tone",
    implementation: "One --tone variable mixed at 12%, 34% and 88% by StatusBadge.",
    evidence: "Six tones; StatusBadge shared across 89 files.",
    centralization: "CENTRALIZED",
    variation: "Tone choice is made per call site with no shared status→tone map.",
    ownership: "StatusBadge",
    futureTarget: "A named status role vocabulary.",
    readiness: "Component is ready; the semantic mapping is not.",
    openDecision: "Whether tone mixing is precomputed for Figma.",
  },
  {
    category: "Typography",
    implementation: "Two families with three named role utilities; sizes set per call site.",
    evidence: "779 text-sm, 406 font-medium, 225 text-eyebrow, 194 text-display, 16 text-serial.",
    centralization: "PARTIALLY CENTRALIZED",
    variation: "Heading and description sizes differ between comparable surfaces.",
    ownership: "styles.css for families and utilities; call sites for sizes.",
    futureTarget: "A role-based text style set.",
    readiness: "Scale is measured; roles are not yet declared.",
    openDecision: "Which heading sizes are canonical. JetBrains Mono is declared but unused.",
  },
  {
    category: "Spacing",
    implementation: "Tailwind 4px ladder used consistently.",
    evidence: "gap-2 316, px-3 238, gap-1 232, p-5 187, gap-3 173, px-4 154, gap-4 133.",
    centralization: "PARTIALLY CENTRALIZED",
    variation: "Card padding varies between p-4, p-5 and p-6; gap-1.5 coexists with gap-2.",
    ownership: "Call sites",
    futureTarget: "Named spacing tokens plus relationship rules.",
    readiness: "Values are stable; relationships are implicit.",
    openDecision: "A canonical card padding.",
  },
  {
    category: "Layout and container",
    implementation: "88rem web container; shells manage dashboard width.",
    evidence: "23 max-w-[88rem] occurrences; three shell families.",
    centralization: "PARTIALLY CENTRALIZED",
    variation: "Deliberate: dashboards are excluded by instruction.",
    ownership: "Shells and page files",
    futureTarget: "Container tokens per experience.",
    readiness: "Ready.",
    openDecision: "None — the split is intentional.",
  },
  {
    category: "Shape and elevation",
    implementation: "Seven radius steps and five named shadows.",
    evidence:
      "rounded-full 297, rounded-2xl 264, rounded-lg 170, rounded-xl 89, rounded-md 52; shadow-card 37, glow 11, elevated 9, plate 6, drawer 3.",
    centralization: "CENTRALIZED",
    variation: "Radius classes are chosen per call site rather than by semantic role.",
    ownership: "styles.css",
    futureTarget: "Semantic radius roles over the existing steps.",
    readiness: "Shadows map to effect styles directly.",
    openDecision: "Whether every radius step is still needed.",
  },
  {
    category: "Iconography",
    implementation: "Lucide throughout with one documented Tabler exception.",
    evidence: "144 files, 149 distinct icons; h-4 w-4 274, h-3.5 w-3.5 68, h-3 w-3 34, h-5 w-5 26.",
    centralization: "CENTRALIZED",
    variation: "Two class spellings for 16px. Font Awesome installed but unused.",
    ownership: "Call sites plus the shared wrapper",
    futureTarget: "Icon size tokens and a single canonical library.",
    readiness: "Ready.",
    openDecision: "Removal of the unused dependency.",
  },
  {
    category: "Motion",
    implementation: "Six keyframes on one shared easing curve with a global reduced-motion rule.",
    evidence:
      "107 transition and 22 duration occurrences; orbit 4, drift 3, fade-rise 2, pulse-ring 2, shimmer 1.",
    centralization: "PARTIALLY CENTRALIZED",
    variation:
      "Durations are per-utility; the common 150ms is a framework default, not a declared value.",
    ownership: "styles.css",
    futureTarget: "Named duration roles.",
    readiness: "Easing is ready; durations are not.",
    openDecision: "The canonical micro duration.",
  },
  {
    category: "Density and controls",
    implementation: "Primitives default to 36px; 40px is widespread at call sites.",
    evidence: "h-10 143, h-9 47; Button h-8/h-9/h-10; Input h-9; 44px mobile floor.",
    centralization: "PARTIALLY CENTRALIZED",
    variation: "Two heights in active parallel use.",
    ownership: "Primitives and call sites",
    futureTarget: "Declared density modes.",
    readiness: "Blocked on the height decision.",
    openDecision: "One standard height, or two named modes.",
  },
  {
    category: "Accessibility",
    implementation: "Paired foregrounds, reduced motion, mobile touch floor, aria-hidden icons.",
    evidence: "69 focus-visible declarations, 68 ring-ring occurrences.",
    centralization: "PARTIALLY CENTRALIZED",
    variation: "Focus ring width and offset vary between primitives and hand-written sites.",
    ownership: "styles.css and primitives",
    futureTarget: "One foundation-level focus treatment.",
    readiness: "Strong base; focus needs consolidating.",
    openDecision: "Disabled state by token instead of opacity.",
  },
  {
    category: "Theming",
    implementation: "Light and dark with full name parity.",
    evidence: "Matching :root and .dark blocks.",
    centralization: "CENTRALIZED",
    variation: "Tier colours are intentionally identical across modes.",
    ownership: "styles.css",
    futureTarget: "Figma modes.",
    readiness: "Ready.",
    openDecision: "Whether white-label becomes a third mode.",
  },
];

export const FOUNDATION_GOVERNANCE_RULES: BlueprintRow[] = [
  {
    item: "Adding a token",
    source: "Proposed process",
    current: "Values are added directly to styles.css or written inline at a call site.",
    future:
      "A new token requires a role name, a stated purpose, a foreground partner if it is a surface, both theme values, and a named owner.",
    label: "GOVERNANCE RULE",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Changing a token",
    source: "Proposed process",
    current: "A change propagates instantly to every consumer with no impact list.",
    future:
      "Every change is accompanied by the measured consumer count from this reference layer before it is applied.",
    label: "GOVERNANCE RULE",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Deprecating a token",
    source: "The five compatibility aliases",
    current: "Aliases are kept indefinitely with no removal date.",
    future: "Mark deprecated, record remaining consumers, remove only when the count reaches zero.",
    label: "FUTURE OPPORTUNITY",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Approving a new colour role",
    source: "Proposed process",
    current: "No approval step exists.",
    future:
      "A new role must be shown to be unserved by the existing roles, and must state its contrast pairing.",
    label: "GOVERNANCE RULE",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Introducing a value at a call site",
    source: "Arbitrary Tailwind values in production",
    current: "Permitted and present, for example max-w-[88rem] and the 10px micro label.",
    future:
      "Allowed, but a value that recurs three times becomes a token candidate for the next audit.",
    label: "GOVERNANCE RULE",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    item: "Experience-specific values",
    source: "Container widths, density",
    current: "Set per shell and per page.",
    future:
      "Experience guidance may set container, density and decorative permission, and nothing else.",
    label: "GOVERNANCE RULE",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    item: "Keeping code and Figma in step",
    source: "Proposed process",
    current: "No Figma library exists.",
    future:
      "Code is the source of truth. A Figma change is a proposal until it lands in styles.css.",
    label: "GOVERNANCE RULE",
    phase: "Phase 6 — direct production read",
  },
  {
    item: "Preservation rule",
    source: "Phases 1 to 7",
    current:
      "Every audit phase has been reference-only; no production screen, token or component has been changed.",
    future:
      "Normalisation is a separate, explicitly approved phase. Documentation never edits production.",
    label: "GOVERNANCE RULE",
    phase: "Phase 6 — direct production read",
  },
];
