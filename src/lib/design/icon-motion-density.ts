/**
 * Phase 7 — iconography, motion and control/density foundation.
 * DOCUMENTATION ONLY, built on the Phase 2 and Phase 4 audits.
 * No icon import, wrapper, animation or control height is modified.
 */
import type { BlueprintRow } from "./types";

const P4 = "Phase 4 — iconography & assets" as const;
const P2 = "Phase 2 — spacing, layout, responsive" as const;
const P1 = "Phase 1 — foundations" as const;

export const ICON_FOUNDATION_SPEC: BlueprintRow[] = [
  {
    item: "lucide-react",
    source: "Imported by 144 files; 149 distinct icons in use",
    current: "The house icon library. Stroke-based, 24px viewbox, size set by class.",
    future: "The single canonical icon source. Figma library section Iconography / Lucide.",
    label: "CURRENT IMPLEMENTATION",
    phase: P4,
  },
  {
    item: "@tabler/icons-react",
    source: "One import — IconDental",
    current:
      "Used solely for the dental product icon, wrapped in the shared forwardRef and aria-hidden wrapper so it behaves like a Lucide icon.",
    future: "Documented exception with a stated reason: no equivalent exists in Lucide.",
    label: "CURRENT IMPLEMENTATION",
    phase: P4,
  },
  {
    item: "Font Awesome",
    source: "package.json",
    current: "Installed; no production import found.",
    future: "FUTURE DECISION — remove or adopt. Not removed in this phase.",
    label: "INSTALLED BUT UNUSED",
    phase: P4,
  },
  {
    item: "Inline SVG",
    source: "src/components/abox/decor/*, auth surfaces, AboxMark, AboxWordmark, CarrierMark",
    current:
      "Brand marks and decorative graphics are drawn in code, not stored as files. CarrierMark generates a deterministic monogram with a fallback.",
    future:
      "Figma components for the marks; CarrierMark stays generated because it is data-driven.",
    label: "CURRENT IMPLEMENTATION",
    phase: P4,
  },
  {
    item: "16px — h-4 w-4",
    source: "274 occurrences",
    current: "The default icon size beside body text and inside buttons.",
    future: "Number variable Icon / 400 = 16. The canonical default.",
    label: "CURRENT IMPLEMENTATION",
    phase: P4,
  },
  {
    item: "16px — size-4",
    source: "28 occurrences, including the Button cva `[&_svg]:size-4`",
    current: "The same 16px expressed with the newer Tailwind shorthand.",
    future: "One spelling in the canonical layer.",
    label: "FUTURE OPPORTUNITY",
    phase: P4,
    note: "Two spellings of one value. Converging them is a pure class rename with no visual effect — still not done here.",
  },
  {
    item: "14px — h-3.5 w-3.5",
    source: "68 occurrences",
    current: "Icons inside chips, pills and dense table rows.",
    future: "Number variable Icon / 350 = 14.",
    label: "CURRENT IMPLEMENTATION",
    phase: P4,
  },
  {
    item: "12px — h-3 w-3",
    source: "34 occurrences",
    current: "Micro icons beside eyebrow and serial text.",
    future: "Number variable Icon / 300 = 12.",
    label: "CURRENT IMPLEMENTATION",
    phase: P4,
  },
  {
    item: "20px — h-5 w-5 / size-5",
    source: "26 and 2 occurrences",
    current: "Header and empty-state icons.",
    future: "Number variable Icon / 500 = 20.",
    label: "OBSERVED VARIATION",
    phase: P4,
  },
  {
    item: "Decorative icon sizing",
    source: "Landing cards, empty states, decor components",
    current: "Larger arbitrary sizes set per composition; not part of the four-step ladder.",
    future: "Recorded as illustration sizing, outside the icon scale.",
    label: "OBSERVED VARIATION",
    phase: P4,
  },
  {
    item: "Stroke behaviour",
    source: "Lucide defaults",
    current: "Default stroke width is used throughout; no project-wide override.",
    future: "Record the default as canonical and require a reason for any override.",
    label: "GOVERNANCE RULE",
    phase: P4,
  },
  {
    item: "Accessibility convention",
    source: "Icon wrappers and icon-only buttons",
    current:
      "Decorative icons are aria-hidden; icon-only controls carry an accessible name through aria-label or visually hidden text.",
    future: "Stated as a foundation rule, not left to each call site.",
    label: "CURRENT IMPLEMENTATION",
    phase: P4,
  },
];

export const MOTION_FOUNDATION_SPEC: BlueprintRow[] = [
  {
    item: "Keyframes",
    source: "src/styles.css",
    current:
      "Six: abox-fade-rise, abox-orbit, abox-pulse-ring, abox-hairline-draw, abox-drift, abox-shimmer.",
    future: "Motion documentation metadata; keyframes are not variables in Figma.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Animation utilities and durations",
    source: "src/styles.css",
    current:
      "fade-rise 500ms, hairline 620ms, orbit 22s, orbit-slow 60s, drift 6s, pulse-ring 2.4s, shimmer 2.4s. Usage: 2, 2, 4, 3, 2 and 1 occurrences respectively.",
    future: "Named durations for the short end; ambient loops stay per-animation.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Easing",
    source: "src/styles.css",
    current:
      "cubic-bezier(0.2, 0.7, 0.2, 1) is the single shared curve, used by every entrance and hover transition.",
    future:
      "One easing token Motion / Standard. This is the most consistent motion decision present.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Transition conventions",
    source: "107 `transition-` and 22 `duration-` occurrences",
    current:
      "transition-colors dominates for hover states; explicit durations appear on decorative utilities at 320ms and 700ms.",
    future: "Motion / Micro 150ms, Motion / Standard 320ms, Motion / Emphasis 700ms.",
    label: "OBSERVED VARIATION",
    phase: P1,
    note: "150ms is the Tailwind default rather than a declared project value.",
  },
  {
    item: "Reduced motion",
    source: "src/styles.css base layer",
    current:
      "A prefers-reduced-motion block forces animation and transition durations to 0.01ms globally.",
    future: "Recorded as a foundation guarantee that applies to every future motion token.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
  },
  {
    item: "Loading motion",
    source: "Skeleton primitive, animate-shimmer",
    current: "Skeleton uses the primitive's pulse; shimmer is used once.",
    future: "One loading motion, chosen in a later phase.",
    label: "FUTURE DECISION",
    phase: P1,
  },
  {
    item: "Motion semantic roles",
    source: "Phase 7",
    current: "No role vocabulary exists in production; durations are chosen per utility.",
    future:
      "Instant, micro, standard, emphasis and ambient roles — supported for standard, emphasis and ambient by the evidence above; instant and micro remain FUTURE DECISION.",
    label: "FUTURE DECISION",
    phase: P1,
  },
];

export const DENSITY_FOUNDATION_SPEC: BlueprintRow[] = [
  {
    item: "Button default height",
    source: "src/components/ui/button.tsx — h-9",
    current: "36px with px-4 py-2 and 16px icons.",
    future: "Control / Compact = 36.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Button lg height",
    source: "Button cva size lg — h-10",
    current: "40px with px-8.",
    future: "Control / Standard = 40.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Button sm and icon sizes",
    source: "Button cva",
    current: "sm is h-8 px-3 text-xs; icon is h-9 w-9; icon-sm is h-8 w-8.",
    future: "Control / Dense = 32, with square icon variants at the same heights.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Input height",
    source: "src/components/ui/input.tsx — h-9",
    current: "36px with px-3 py-1, matching the default button.",
    future: "Control / Compact shared by button and input.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "40px vs 36px controls",
    source: "143 h-10 and 47 h-9 occurrences",
    current:
      "Both heights are in active use: h-10 appears widely at call sites while the primitives default to h-9.",
    future:
      "FUTURE DECISION — two documented density modes, or one standard height. The variation is preserved exactly as found.",
    label: "OBSERVED VARIATION",
    phase: P2,
  },
  {
    item: "Touch-target floor",
    source: "src/styles.css base layer",
    current: "Below 640px every button and link is given a 44px minimum height.",
    future: "A foundation guarantee rather than a media-query side effect.",
    label: "CURRENT IMPLEMENTATION",
    phase: P1,
    note: "Above 640px a 32px dense button falls below the 44px guideline; recorded, not corrected.",
  },
  {
    item: "Table density",
    source: "DataTable and reference tables",
    current: "px-5 py-4 cells in reference tables; production tables use denser padding.",
    future: "Two table density modes.",
    label: "OBSERVED VARIATION",
    phase: P2,
  },
  {
    item: "Icon-to-control relationship",
    source: "Button cva `[&_svg]:size-4`",
    current: "A 36px control carries a 16px icon; dense chips carry 14px.",
    future: "Rule: icon size steps down one level with each control density step.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Member navigation icon circles",
    source: "src/components/abox/member-shell.tsx",
    current: "36px circles with the connecting arc passing through their centres.",
    future: "A navigation dimension record rather than a general control height.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
];
