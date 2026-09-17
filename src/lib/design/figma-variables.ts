/**
 * Phase 7 — mapping from the current foundation to future Figma variables,
 * styles and modes. Nothing here has been created in Figma.
 */
import type { BlueprintRow } from "./types";

const P1 = "Phase 1 — foundations" as const;

export const FIGMA_VARIABLE_MAP: BlueprintRow[] = [
  {
    item: "Collection — ABox Primitives",
    source: "Proposed",
    current: "No primitive layer exists; every CSS variable is already semantic.",
    future:
      "Hidden collection of raw colour, number and string values. Semantic variables alias into it.",
    label: "FUTURE CANONICAL TARGET",
    phase: P1,
  },
  {
    item: "Collection — ABox Semantic, modes Light / Dark",
    source: "src/styles.css :root and .dark",
    current: "Both themes are fully defined; the dark block overrides the same variable names.",
    future:
      "One collection, two modes. Name parity between the blocks is what makes this a clean mapping.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Collection — ABox Tier",
    source: "--metal-* and --metal-*-fg",
    current: "Six tiers with explicit foregrounds; identical in both themes.",
    future: "Single-mode collection, deliberately separate from status colour.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Collection — ABox Brand",
    source: "Runtime branding and white-label screens",
    current: "A narrow configurable set is applied at runtime by the branding surface.",
    future:
      "Separate collection so tenant overrides cannot reach status, tier or structural tokens.",
    label: "GOVERNANCE RULE",
    phase: P1,
  },
  {
    item: "Colour variables",
    source: "The full :root token set",
    current: "Authored in oklch.",
    future:
      "Figma stores hex or sRGB. Conversion is lossy at the edges of the gamut — the CSS remains the source of truth and Figma is a mirror.",
    label: "FUTURE CANONICAL TARGET",
    phase: P1,
    note: "This constraint must be recorded before any library is built.",
  },
  {
    item: "Number variables",
    source: "Spacing ladder, radius steps, icon sizes, control heights, breakpoint values",
    current: "Spacing and icon sizes come from Tailwind; radii are project variables.",
    future: "Number variables bound to gap, padding, corner radius and component size.",
    label: "FUTURE CANONICAL TARGET",
    phase: P1,
  },
  {
    item: "Text styles",
    source: "Measured type scale and the three named type utilities",
    current:
      "text-display, text-eyebrow and text-serial are the only named roles; other sizes are set per call site.",
    future:
      "Composite text styles per role. Family and weight can additionally be variables; the composite style cannot.",
    label: "OBSERVED VARIATION",
    phase: "Phase 3 — typography",
  },
  {
    item: "Effect styles",
    source: "--shadow-card, -elevated, -drawer, -plate, -glow",
    current: "Five multi-layer shadows.",
    future: "Effect styles, not variables. Multi-layer shadows are unsupported as variables.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Grid styles",
    source: "Container widths and breakpoints",
    current: "88rem web container; dashboards are full-bleed within their shells.",
    future: "Layout grid styles per experience and per breakpoint frame.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 2 — spacing, layout, responsive",
  },
  {
    item: "Unmappable — color-mix",
    source: "StatusBadge tone mixing at 12%, 34% and 88%",
    current: "Tone surfaces are computed at runtime from a single tone variable.",
    future:
      "Figma has no runtime mix. Either six precomputed tone triplets per mode, or the tone stays code-only. FUTURE DECISION.",
    label: "FUTURE DECISION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Unmappable — keyframe animation",
    source: "Six keyframes",
    current: "CSS animations with shared easing.",
    future: "Documentation metadata plus optional prototype interactions only.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Unmappable — generated marks",
    source: "CarrierMark, AboxMark, AboxWordmark",
    current: "Drawn in code; CarrierMark is deterministic from data.",
    future: "The brand marks become components; CarrierMark stays code-generated.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 4 — iconography & assets",
  },
  {
    item: "Compatibility aliases",
    source: "--brand-accent, --surface-1/2/3, --shadow-overlay, --ai",
    current: "Aliases retained for older call sites.",
    future: "Excluded from the Figma library; they are code-compatibility only.",
    label: "FUTURE OPPORTUNITY",
    phase: P1,
  },
  {
    item: "Sync direction",
    source: "Proposed",
    current: "No sync exists.",
    future:
      "One direction only: code → Figma. The application is the source of truth, so a Figma edit is a proposal until it lands in styles.css.",
    label: "GOVERNANCE RULE",
    phase: P1,
  },
];
