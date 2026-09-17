/**
 * Phase 11 — Figma readiness audit.
 * DOCUMENTATION ONLY. Nothing exists in Figma: no file, component, variable,
 * style, asset or library has been created. This module records only whether
 * the documented system would be ready to become one.
 */
import type { FigmaReadinessArea } from "./canonical-readiness-types";

export const FIGMA_READINESS: FigmaReadinessArea[] = [
  {
    area: "Foundation variables",
    currentEvidence:
      "Colour, spacing, radius, shadow and type values declared in src/styles.css and inventoried in Phases 1, 2, 3 and 7.",
    gap: "None for the values themselves.",
    blocker: "no blocker",
    readiness: "READY",
  },
  {
    area: "Semantic variables",
    currentEvidence:
      "Tone and tier roles exist as tokens and are consumed by StatusBadge and MetalBadge.",
    gap: "Several roles are still expressed as literal classes rather than named roles.",
    blocker: "insufficient evidence",
    readiness: "PARTIAL",
  },
  {
    area: "Typography styles",
    currentEvidence:
      "Measured scale from Phase 3 including text-sm at 779 uses and font-medium at 406.",
    gap: "Whether the current sizes become fewer named roles is an open decision.",
    blocker: "insufficient evidence",
    readiness: "PARTIAL",
    note: "Blocked on dec.typography-roles.",
  },
  {
    area: "Component definitions",
    currentEvidence:
      "64 building blocks specified in Phase 8 with anatomy, props, variants and states.",
    gap: "Areas with competing implementations have no single definition to model.",
    blocker: "duplicate implementation",
    readiness: "PARTIAL",
  },
  {
    area: "Variants",
    currentEvidence:
      "Variant records exist for badges, buttons, page headers, KPI tones and plan tiles.",
    gap: "Table and field variants depend on unresolved duplicates.",
    blocker: "duplicate implementation",
    readiness: "PARTIAL",
  },
  {
    area: "States",
    currentEvidence:
      "States recorded from real handling in Phases 8 and 10, including selection semantics carried by aria-pressed.",
    gap: "Loading and error states have no owner to model.",
    blocker: "no owner",
    readiness: "PARTIAL",
  },
  {
    area: "Properties",
    currentEvidence: "Component properties recorded per specification.",
    gap: "Property naming is proposed, not agreed.",
    blocker: "insufficient evidence",
    readiness: "PARTIAL",
  },
  {
    area: "Patterns",
    currentEvidence:
      "Phase 10 specifies 23 patterns with anatomy, states, responsive behaviour and density.",
    gap: "Four pattern areas are blocked by duplicates or missing owners.",
    blocker: "duplicate implementation",
    readiness: "PARTIAL",
  },
  {
    area: "Experience extensions",
    currentEvidence:
      "Phase 10 records extensions and intentional differences across the four experiences.",
    gap: "None for modelling; differences are documented and preserved.",
    blocker: "no blocker",
    readiness: "READY",
  },
  {
    area: "Naming",
    currentEvidence: "Phase 6 and Phase 8 naming records plus the Phase 11 naming readiness audit.",
    gap: "Collisions and literal-token names remain unresolved proposals.",
    blocker: "insufficient evidence",
    readiness: "BLOCKED",
  },
  {
    area: "Component hierarchy",
    currentEvidence: "The Phase 9 graph gives a complete foundation-to-screen hierarchy.",
    gap: "None.",
    blocker: "no blocker",
    readiness: "READY",
  },
  {
    area: "Accessibility metadata",
    currentEvidence:
      "Roles, labels, focus behaviour and decorative-icon handling recorded in Phases 4 and 8.",
    gap: "Focus treatment and disabled tokens are open decisions from Phase 7.",
    blocker: "insufficient evidence",
    readiness: "PARTIAL",
  },
  {
    area: "Responsive behaviour",
    currentEvidence: "Transcribed breakpoint behaviour per pattern in Phase 10.",
    gap: "Stacking breakpoints differ by screen, so a single responsive variant set cannot be modelled yet.",
    blocker: "experience variation",
    readiness: "PARTIAL",
  },
  {
    area: "Density",
    currentEvidence: "Density records per pattern in Phase 10.",
    gap: "36px versus 40px controls and p-5 versus p-6 cards are undecided.",
    blocker: "insufficient evidence",
    readiness: "BLOCKED",
  },
  {
    area: "Content model",
    currentEvidence: "Content requirements recorded per component and pattern.",
    gap: "Long text, error and loading content are unspecified in several areas.",
    blocker: "no owner",
    readiness: "PARTIAL",
  },
  {
    area: "Asset ownership",
    currentEvidence:
      "No image files in the repository; brand marks are code-drawn; carrier marks are deterministic monograms.",
    gap: "None — the boundary is clear.",
    blocker: "runtime boundary",
    readiness: "READY",
    note: "Tenant artwork stays runtime-owned and is not library content.",
  },
  {
    area: "Branding boundary",
    currentEvidence:
      "Branding & White-Label resolves tenant values at runtime; the system models the slot only.",
    gap: "None.",
    blocker: "runtime boundary",
    readiness: "READY",
  },
  {
    area: "Library governance",
    currentEvidence: "Phase 11 change governance and regression contract exist as documentation.",
    gap: "No named owner, review cadence or publishing process has been agreed.",
    blocker: "no owner",
    readiness: "FUTURE DECISION",
  },
];

export const FIGMA_BLOCKERS: string[] = [
  "Figma BLOCKED — naming: collisions and literal-token names must be settled before components can be named in a library.",
  "Figma BLOCKED — density: control height and card padding must be decided before size variants can exist.",
  "Figma PARTIAL — component definitions, variants, states, patterns and content model are partly blocked by the open duplicate decisions.",
  "Figma READY — foundation values, hierarchy, experience extensions, asset ownership and the branding boundary.",
  "FUTURE DECISION — library governance has no owner and no process.",
];

export const FIGMA_READINESS_RULES: string[] = [
  "GOVERNANCE RULE — no area is marked READY on the strength of appearance; readiness means the documentation is complete enough to build from.",
  "GOVERNANCE RULE — an area blocked by an open decision stays blocked; it is not modelled speculatively.",
  "GOVERNANCE RULE — creating the library is itself an approval, not a consequence of this audit.",
];
