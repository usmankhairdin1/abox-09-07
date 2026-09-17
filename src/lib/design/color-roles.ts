/**
 * Phase 7 — colour role architecture and light/dark mode model.
 * DOCUMENTATION ONLY. Consumed by `/design-system` and `/design-guide`.
 */
import type { BlueprintRow, RoleChainEntry } from "./types";

/** primitive → semantic role → component usage → experience. */
export const COLOR_ROLE_CHAINS: RoleChainEntry[] = [
  {
    primitive: "oklch(1 0 0) — pure white",
    semantic: "--background (canvas) and --card (raised)",
    componentRole: "Page canvas; Card, PlanCard, KpiCard, DataTable surface",
    experience: "All three experiences",
    evidence: "src/styles.css :root; 149 bg-background, 264 bg-card occurrences",
    label: "OBSERVED OVERLAP",
    note: "One primitive currently serves two semantic roles in light mode.",
  },
  {
    primitive: "oklch(0.968 0.003 265) — cool light gray",
    semantic: "--surface (sunken)",
    componentRole: "Section band, filter rail, toolbar backdrop",
    experience: "Shopping and admin",
    evidence: "79 bg-surface occurrences",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    primitive: "oklch(0.31 0.090 265) — Meridian navy",
    semantic: "--primary, --ring, --chart-1",
    componentRole: "Button default surface, link text, focus ring, first chart series",
    experience: "All three experiences",
    evidence: "src/styles.css; Button cva default; 229 bg-primary occurrences",
    label: "OBSERVED OVERLAP",
    note: "Brand identity, interaction affordance, focus feedback and data encoding share one value.",
  },
  {
    primitive: "oklch(0.955 0.004 265) — neutral 955",
    semantic: "--secondary, --muted, --accent",
    componentRole: "Secondary button surface, muted surface, ghost hover surface",
    experience: "All three experiences",
    evidence: "src/styles.css :root — three declarations with an identical value",
    label: "OBSERVED DUPLICATE",
    note: "Three semantic names, one primitive. No winner is chosen in this phase.",
  },
  {
    primitive: "oklch(0.50 0.018 265) — mid navy gray",
    semantic: "--muted-foreground",
    componentRole: "Supporting text, placeholders, eyebrow and serial utilities",
    experience: "All three experiences",
    evidence: "716 text-muted-foreground occurrences — the most used colour pair in the product",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    primitive: "oklch(0.55 0.085 195) — teal",
    semantic: "--sage, --chart-2",
    componentRole: "StatusBadge positive tone, accent emphasis, second chart series",
    experience: "Shopping and admin",
    evidence: "28 bg-sage, 41 text-sage occurrences; StatusBadge tone map",
    label: "OBSERVED OVERLAP",
    note: "--success exists separately but is used once; positive meaning lives mostly on sage.",
  },
  {
    primitive: "oklch(0.72 0.125 75) — amber",
    semantic: "--warning, --chart-4",
    componentRole: "Caution badge, review callout, fourth chart series",
    experience: "Shopping and admin",
    evidence: "24 bg-warning occurrences; chart-4 declaration",
    label: "OBSERVED OVERLAP",
  },
  {
    primitive: "oklch(0.55 0.185 25) — red",
    semantic: "--destructive",
    componentRole: "Destructive button, error text, blocking status",
    experience: "All three experiences",
    evidence: "19 bg-destructive, 47 text-destructive occurrences",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    primitive: "navy at 10 / 11 / 16 / 24 percent alpha",
    semantic: "--border, --hairline, --input, --border-strong",
    componentRole: "Card edge, table rule, control outline, emphasised divider",
    experience: "All three experiences",
    evidence: "497 border-border, 98 border-hairline occurrences",
    label: "OBSERVED OVERLAP",
    note: "border and hairline sit one hundredth of an alpha step apart.",
  },
  {
    primitive: "oklch(0.235 0.060 265) — deep rail navy",
    semantic: "--sidebar family",
    componentRole: "Navigation rail surface, active item, hover, line, ring",
    experience: "Dashboard / admin only",
    evidence: "163 sidebar occurrences; InternalShell",
    label: "CURRENT IMPLEMENTATION",
    note: "A self-contained inverse context, not a third theme.",
  },
  {
    primitive: "oklch(0.52 0.115 292) — violet",
    semantic: "--ai / --ai-foreground",
    componentRole: "Assistant identity",
    experience: "Shopping (PlanAI)",
    evidence: "Compatibility layer declaration; 0 bg-ai class occurrences found",
    label: "POSSIBLY UNUSED",
  },
];

/** Where one token currently carries both a primitive and a semantic responsibility. */
export const COLOR_ROLE_OVERLAPS: BlueprintRow[] = [
  {
    item: "Brand vs action vs focus",
    source: "--primary, --ring",
    current: "One navy value is the brand colour, the default action surface and the focus ring.",
    future:
      "Three named roles — brand/primary, action/primary, state/focus-ring — initially resolving to the same value so nothing moves.",
    label: "FUTURE CANONICAL TARGET",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Secondary, muted and accent",
    source: "--secondary, --muted, --accent",
    current: "Three semantic names hold an identical value in both light and dark.",
    future:
      "Retain all three names but source them from one primitive so the intent of each is explicit.",
    label: "OBSERVED DUPLICATE",
    phase: "Phase 1 — foundations",
    note: "No winner is selected in this phase.",
  },
  {
    item: "Card vs canvas in light mode",
    source: "--card, --background",
    current: "Both are pure white; separation is carried by border and shadow, not by colour.",
    future:
      "Keep the values, and record in the specification that elevation is a border-plus-shadow decision, not a colour decision.",
    label: "OBSERVED OVERLAP",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Positive meaning",
    source: "--sage, --success",
    current: "StatusBadge expresses positive through `sage`; --success has one direct consumer.",
    future:
      "A status role `status/positive` with a documented relationship to the sage brand accent.",
    label: "FUTURE DECISION",
    phase: "Phase 5 — components, variants, states",
  },
  {
    item: "Chart colours reusing semantic tokens",
    source: "--chart-1, --chart-2, --chart-4",
    current: "Series 1, 2 and 4 duplicate primary, sage and warning.",
    future:
      "A dataviz group sourced from primitives, so a caution hue is not accidentally read as a warning in a chart.",
    label: "FUTURE OPPORTUNITY",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Two surface vocabularies",
    source: "--surface / --panel / --card and --surface-1 / -2 / -3",
    current: "Both naming families are live; the numbered set exists for compatibility.",
    future:
      "One vocabulary in the canonical layer, with the numbered set kept as documented aliases.",
    label: "OBSERVED OVERLAP",
    phase: "Phase 1 — foundations",
  },
];

/** Light and dark values side by side, with the future Figma mode mapping. */
export const THEME_MODE_MAP: BlueprintRow[] = [
  {
    item: "Canvas and ink invert",
    source: "--background, --foreground",
    current: "White / navy ink in light; deep navy / near-white in dark. Different in both modes.",
    future: "Two modes on one Figma variable: Light and Dark.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Surface ladder inverts and compresses",
    source: "--surface, --panel, --card, --popover",
    current:
      "Light mode steps downward from white; dark mode steps upward from 0.165 lightness, and card sits above background rather than equal to it.",
    future:
      "Mode-aware variables where the dark mode expresses elevation through lightness and light mode expresses it through border and shadow.",
    label: "OBSERVED VARIATION",
    phase: "Phase 1 — foundations",
    note: "The two modes do not use the same mechanism for elevation.",
  },
  {
    item: "Primary shifts hue",
    source: "--primary",
    current: "oklch(0.31 0.090 265) in light; oklch(0.68 0.125 255) in dark — lighter and bluer.",
    future: "One variable, two modes. Hue shift is intentional and is recorded as such.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Destructive is mode-invariant",
    source: "--destructive, --destructive-foreground",
    current: "Not redefined in `.dark`; the light value carries into dark mode.",
    future:
      "FUTURE DECISION — either declare an explicit dark value or record mode-invariance as deliberate.",
    label: "FUTURE DECISION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Status foregrounds are partly mode-invariant",
    source: "--warning-foreground, --info-foreground, --success-foreground",
    current: "The background values are redefined in dark mode; their foregrounds are not.",
    future: "Paired mode definitions so every status surface and its ink move together.",
    label: "OBSERVED VARIATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Borders switch colour space",
    source: "--border, --hairline, --input, --border-strong",
    current: "Navy at low alpha in light; white at low alpha in dark.",
    future:
      "Mode-aware line variables. A single alpha value cannot serve both modes, which Figma handles naturally with modes.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Metal tiers lighten for dark mode",
    source: "--metal-* and --metal-*-fg",
    current:
      "Every tier and every tier foreground is redefined in `.dark`, with foregrounds flipping from near-white to near-black.",
    future: "Tier variables with both modes, kept in a separate group from generic status.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Sidebar stays dark in both modes",
    source: "--sidebar family",
    current: "Rail is navy in light mode and darker navy in dark mode; it never becomes light.",
    future:
      "A scoped inverse group rather than a mode. Figma modes cannot express a region that ignores the page mode.",
    label: "OBSERVED VARIATION",
    phase: "Phase 1 — foundations",
  },
  {
    item: "Theme switching in the product",
    source: "src/routes/*",
    current: "The theme toggle was removed on request; the application runs in the light theme.",
    future:
      "Dark tokens remain maintained so the mode stays available; the Figma Dark mode documents them.",
    label: "CURRENT IMPLEMENTATION",
    phase: "Phase 6 — direct production read",
    note: "Dark values exist and are complete, but users do not currently switch modes.",
  },
];
