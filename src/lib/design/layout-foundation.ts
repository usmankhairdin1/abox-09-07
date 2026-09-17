/**
 * Phase 7 — layout, container and breakpoint foundation.
 * DOCUMENTATION ONLY. No container width or breakpoint is changed.
 */
import type { BlueprintRow } from "./types";

const P2 = "Phase 2 — spacing, layout, responsive" as const;

export const CONTAINER_SPEC: BlueprintRow[] = [
  {
    item: "Web experience container — max-w-[88rem]",
    source: "23 occurrences across web-experience routes and shells",
    current:
      "1408px centred container with px-4 md:px-8 gutters. Applied to landing, plans, cart, compare, coverage, apply, review, ICHRA, select, auth, shared links and the two reference pages.",
    future: "Number variable Container / Web = 1408, paired with the gutter rule.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
    note: "Chosen deliberately over 96rem and full width after side-by-side review.",
  },
  {
    item: "Full-width header band",
    source: "Marketplace and member shells",
    current: "The header spans the viewport while its inner content respects the 88rem container.",
    future: "A band pattern: full-bleed surface, constrained content.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "Internal shell content area",
    source: "src/components/abox/internal-shell.tsx — 89 shared consumers with StatusBadge",
    current: "Fixed navy rail plus a fluid content column with its own padding; not 88rem bound.",
    future: "Container / Admin, defined as fluid with a max reading width for prose blocks.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
    note: "Dashboard surfaces were deliberately excluded from the 88rem change.",
  },
  {
    item: "Member shell",
    source: "src/components/abox/member-shell.tsx",
    current: "Full-width header, 88rem content, left icon navigation with a centred connecting arc.",
    future: "Container / Web reused, with a member navigation pattern.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "Shopping split layout",
    source: "/plans",
    current: "Filter rail beside a results column, collapsing to a stacked layout at small widths.",
    future: "Layout pattern Split / Filter + Results with a named rail width.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "Detail layouts",
    source: "Plan detail, organization detail tabs",
    current: "Primary column with a summary column; summary widths vary between surfaces.",
    future: "Layout pattern Detail / Primary + Summary with one summary width.",
    label: "OBSERVED VARIATION",
    phase: P2,
  },
  {
    item: "Overlays",
    source: "Dialog, Drawer, Sheet",
    current: "Widths come from the shadcn primitives; the scrim is bg-black/40.",
    future: "Overlay sizes as number variables; scrim as an opacity token.",
    label: "OBSERVED VARIATION",
    phase: P2,
  },
  {
    item: "Reading measure",
    source: "max-w-3xl on intros",
    current: "768px measure for descriptive paragraphs.",
    future: "Number variable Measure / Prose = 768.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
];

export const BREAKPOINT_SPEC: BlueprintRow[] = [
  {
    item: "sm — 640px",
    source: "169 occurrences",
    current:
      "Mostly used for inline stacking and to switch between abbreviated and full labels. The base layer also enforces a 44px minimum tap height for buttons and links below 640px.",
    future: "Documentation metadata; Figma frame width 640.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "md — 768px",
    source: "223 occurrences — the most used breakpoint",
    current:
      "The real layout switch: gutters go from 16 to 32px, headings step up, grids move to two columns, inputs drop to 14px.",
    future: "The primary responsive boundary in the Figma frame set.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "lg — 1024px",
    source: "73 occurrences",
    current: "Three-column grids and the point where shopping splits into rail plus results.",
    future: "Figma frame width 1024.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "xl — 1280px",
    source: "27 occurrences",
    current: "Occasional wider grids and rail widths.",
    future: "Figma frame width 1280.",
    label: "CURRENT IMPLEMENTATION",
    phase: P2,
  },
  {
    item: "2xl — 1536px",
    source: "3 occurrences",
    current: "Rarely used; the 88rem container reaches its maximum before it matters.",
    future: "Recorded as available but effectively unused.",
    label: "POSSIBLY UNUSED",
    phase: P2,
  },
  {
    item: "No custom breakpoints",
    source: "src/styles.css",
    current: "The Tailwind defaults are used unmodified; no project breakpoint is declared.",
    future: "Keep the default set. Adding a breakpoint would need its own justification.",
    label: "GOVERNANCE RULE",
    phase: P2,
  },
];

export const SHAPE_SPEC: BlueprintRow[] = [
  {
    item: "Radius scale",
    source: "src/styles.css @theme inline",
    current:
      "--radius-sm 6px, md 10px, lg 14px, xl 18px, 2xl 22px, 3xl 28px, 4xl 36px, plus --radius 0.875rem (14px) in :root.",
    future: "Number variables Radius / 100 to 700 mapping to the same seven steps.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "rounded-full",
    source: "297 occurrences",
    current: "Pills, badges, avatars, status dots, action pills and filter chips.",
    future: "Radius / Full as a semantic role, not a number.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "rounded-2xl on cards",
    source: "264 occurrences",
    current: "The dominant card radius across ABox components and reference tables.",
    future: "Radius role Surface / Card = 22px.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "rounded-md on controls",
    source: "Button, Input, Select, Textarea; 52 direct occurrences",
    current: "Buttons and form controls use the shadcn default md radius.",
    future: "Radius role Control = 10px.",
    label: "OBSERVED VARIATION",
    phase: "Phase 5 — components, variants, states",
    note: "Controls at 10px sit beside cards at 22px — a deliberate contrast, recorded not corrected.",
  },
  {
    item: "rounded-xl and rounded-lg",
    source: "89 and 170 occurrences",
    current: "Intermediate radii on inner blocks, list rows and rule cards.",
    future: "Retained as Radius / 400 and Radius / 300.",
    label: "OBSERVED VARIATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Border width",
    source: "Product-wide",
    current: "1px is effectively the only border width; thicker rules are drawn with gradients.",
    future: "Number variable Border / Hairline = 1.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Focus ring width",
    source: "Button and Input: focus-visible:ring-1",
    current: "1px ring in the ring colour, with outline removed.",
    future:
      "FUTURE DECISION — a 1px ring is thin for a visible focus indicator; changing it is a visual change and out of scope here.",
    label: "FUTURE DECISION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Decorative borders",
    source: "card-brackets, ring-pill, divider-warm, edge-sheen utilities",
    current:
      "Corner brackets drawn from layered gradients, inset pill rings, warm dividers and a sweeping hairline on hover.",
    future: "Figma effect or decorative component; not expressible as a border variable.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Elevation tokens",
    source: "--shadow-card 37, --shadow-elevated 9, --shadow-plate 6, --shadow-drawer 3, --shadow-glow 11 uses",
    current:
      "Five navy-tinted shadow recipes, each a multi-layer stack. --shadow-overlay aliases --shadow-elevated.",
    future:
      "Figma effect styles Elevation / Card, Elevated, Plate, Drawer, Glow. Multi-layer shadows cannot be number variables.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Elevation is component-level",
    source: "Card, Dialog, Drawer, plate surfaces",
    current: "Each component picks its shadow directly; there is no elevation ladder.",
    future: "An elevation role per surface kind, so the ladder is explicit.",
    label: "FUTURE OPPORTUNITY",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Opacity suffixes",
    source: "112 `opacity-` occurrences plus inline alpha suffixes such as /5, /10, /40, /90",
    current:
      "Hover states use /90 and /80 on solid surfaces; tinted panels use /5 and /10; disabled uses opacity-50 from the primitive layer.",
    future: "Number variables Opacity / Disabled 0.5, Subtle 0.05, Tint 0.1, Hover 0.9.",
    label: "OBSERVED VARIATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Scrim",
    source: "bg-black/40 — 1 occurrence",
    current: "A single literal scrim value behind an overlay.",
    future: "Opacity / Scrim with a token colour instead of literal black.",
    label: "FUTURE OPPORTUNITY",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Glass surface",
    source: "@utility glass — 25 occurrences",
    current:
      "color-mix of card at 82 percent with a 14px blur and 140 percent saturation, over a hairline border.",
    future: "Figma effect style Glass; the colour mix is not a variable.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Badge opacity",
    source: "/plans filters and plan tiles",
    current: "Badges render at full opacity in both filters and listings, by explicit request.",
    future: "A rule that status and tier badges are never dimmed to express state.",
    label: "GOVERNANCE RULE",
    phase: "Phase 5 — components, variants, states",
  },
];
