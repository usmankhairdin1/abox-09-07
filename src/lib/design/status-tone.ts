/**
 * Phase 7 — status / tone foundation and metal-tier foundation.
 * DOCUMENTATION ONLY. No production tone is consolidated here, and no
 * winner is chosen among the overlapping tone vocabularies.
 */
import type { BlueprintRow, TokenSpec } from "./types";

const P5 = "Phase 5 — components, variants, states" as const;

/** The tone vocabularies that exist in production today. */
export const TONE_VOCABULARY: BlueprintRow[] = [
  {
    item: "StatusBadge tones",
    source: "src/components/abox/status-badge.tsx",
    current:
      "Six tones: sage, primary, warning, muted, destructive, info. Each sets a --tone variable and mixes it — 88 percent tone for text, 12 percent over card for the fill, 34 percent for the border, plus a solid dot.",
    future:
      "A status role set with explicit surface, ink, line and indicator steps rather than a single mix recipe.",
    label: "CURRENT IMPLEMENTATION",
    phase: P5,
    note: "89 files use StatusBadge or InternalShell; this is the most widely shared tone vocabulary.",
  },
  {
    item: "Badge primitive variants",
    source: "src/components/ui/badge.tsx",
    current: "shadcn variants: default, secondary, destructive, outline.",
    future: "Mapped onto the same future status roles, or kept as an emphasis axis.",
    label: "OBSERVED OVERLAP",
    phase: P5,
    note: "Two badge systems coexist. Neither is retired.",
  },
  {
    item: "Semantic status tokens",
    source: "src/styles.css",
    current:
      "--destructive, --warning, --info, --success exist as tokens. --success has one direct consumer; StatusBadge has no success tone.",
    future: "status/positive, status/caution, status/info, status/danger as a complete set.",
    label: "OBSERVED OVERLAP",
    phase: "Phase 1 — foundations",
  },
  {
    item: "MetaChip tones in the reference layer",
    source: "src/components/design/reference-kit.tsx",
    current: "Four tones: muted, primary, sage, warning — documentation only, never shipped in the app.",
    future: "Reference-only; excluded from the canonical component set.",
    label: "CURRENT IMPLEMENTATION",
    phase: P5,
  },
  {
    item: "Alert primitive",
    source: "src/components/ui/alert.tsx",
    current: "Variants default and destructive only; no caution or info variant.",
    future:
      "FUTURE DECISION — whether alerts adopt the full status role set or stay deliberately binary.",
    label: "FUTURE DECISION",
    phase: P5,
  },
  {
    item: "Business outcome semantics",
    source: "M08 selling-setup surfaces",
    current:
      "The four controlled outcomes — Allowed, More Information Needed, Not Allowed, Not Applicable — are rendered through StatusBadge tones.",
    future:
      "A documented mapping from business outcome to status role, so the outcome vocabulary and the visual tone stay separable.",
    label: "GOVERNANCE RULE",
    phase: P5,
    note: "Business meaning must not be inferred from colour alone; the label always carries it.",
  },
];

/** Overlapping meanings, recorded without consolidation. */
export const TONE_OVERLAPS: BlueprintRow[] = [
  {
    item: "Positive is expressed two ways",
    source: "StatusBadge `sage` vs --success",
    current: "Components reach for sage; the success token is used once.",
    future: "One positive status role, with sage recorded as the brand accent it originally was.",
    label: "OBSERVED DUPLICATE",
    phase: P5,
  },
  {
    item: "`primary` as a status tone",
    source: "StatusBadge `primary`",
    current: "Brand navy doubles as a neutral-emphasis status tone.",
    future: "An `emphasis` or `selected` role distinct from the brand colour.",
    label: "OBSERVED OVERLAP",
    phase: P5,
  },
  {
    item: "`muted` as a status tone",
    source: "StatusBadge `muted` → var(--foreground)",
    current: "The muted tone resolves to the foreground ink, not to --muted.",
    future: "A `neutral` status role named for what it does.",
    label: "OBSERVED VARIATION",
    phase: P5,
    note: "The tone name and the token it points at do not match.",
  },
  {
    item: "Two badge families",
    source: "StatusBadge vs Badge",
    current: "Different shapes, sizes, typography and colour mechanics for adjacent purposes.",
    future: "FUTURE DECISION — one badge with a status axis, or two components with stated purposes.",
    label: "FUTURE DECISION",
    phase: P5,
  },
];

const P1 = "Phase 1 — foundations" as const;

function metal(
  token: string,
  value: string,
  darkValue: string,
  fg: string,
  fgDark: string,
  meaning: string,
): TokenSpec {
  return {
    token,
    value,
    darkValue,
    modes: "different",
    kind: "semantic",
    purpose: meaning,
    consumers: "MetalBadge, plan tiles, plan-results metal filters, cart line items.",
    usage: "Consumed through MetalBadge and the metal filter chips on /plans.",
    foreground: `${fg} (light) / ${fgDark} (dark)`,
    contrast:
      "Foreground is chosen per tier so the solid badge keeps legible text; gold uses dark ink in both modes.",
    source: "src/styles.css",
    status: "CURRENT IMPLEMENTATION",
    futureRole: "Product tier variable, kept in a separate group from generic status.",
    figma: "Color variable ABox Core / Color / Tier / <name> with a paired On variable.",
    migration: "Direct mapping in both modes. Never merge with the status group.",
    phase: P1,
  };
}

export const TIER_FOUNDATION: TokenSpec[] = [
  metal(
    "--metal-bronze",
    "oklch(0.56 0.105 58)",
    "oklch(0.72 0.105 58)",
    "oklch(0.99 0 0)",
    "oklch(0.14 0.02 58)",
    "Bronze metal tier — a plan's actuarial value band, a product fact, not a quality judgement.",
  ),
  metal(
    "--metal-expanded-bronze",
    "oklch(0.52 0.090 58)",
    "oklch(0.68 0.095 58)",
    "oklch(0.99 0 0)",
    "oklch(0.14 0.02 58)",
    "Expanded Bronze tier — a distinct regulatory tier, deliberately close to but separate from Bronze.",
  ),
  metal(
    "--metal-silver",
    "oklch(0.58 0.018 255)",
    "oklch(0.78 0.020 255)",
    "oklch(0.99 0 0)",
    "oklch(0.14 0.01 255)",
    "Silver metal tier.",
  ),
  metal(
    "--metal-gold",
    "oklch(0.66 0.130 92)",
    "oklch(0.82 0.130 92)",
    "oklch(0.16 0.02 92)",
    "oklch(0.16 0.02 92)",
    "Gold metal tier — the only tier whose foreground is dark in both modes.",
  ),
  metal(
    "--metal-platinum",
    "oklch(0.56 0.075 205)",
    "oklch(0.76 0.075 205)",
    "oklch(0.99 0 0)",
    "oklch(0.14 0.02 205)",
    "Platinum metal tier.",
  ),
  metal(
    "--metal-catastrophic",
    "oklch(0.56 0.150 25)",
    "oklch(0.70 0.120 25)",
    "oklch(0.99 0 0)",
    "oklch(0.14 0.02 25)",
    "Catastrophic tier — a plan category, not an error state, despite sitting near the destructive hue.",
  ),
];

/** Governance that keeps product tiers separate from status. */
export const TIER_GOVERNANCE: BlueprintRow[] = [
  {
    item: "Tier is a product fact",
    source: "src/components/abox/metal-badge.tsx",
    current:
      "MetalBadge renders a solid tier colour with a per-tier foreground; the tier name is always written out.",
    future:
      "Tier variables stay in their own Figma group and are never reused as status, emphasis or chart colours.",
    label: "GOVERNANCE RULE",
    phase: P5,
  },
  {
    item: "Catastrophic is not danger",
    source: "--metal-catastrophic vs --destructive",
    current: "Both sit near hue 25; they carry unrelated meanings.",
    future:
      "Documented separation so a future palette change to one never propagates to the other.",
    label: "GOVERNANCE RULE",
    phase: P1,
  },
  {
    item: "Expanded Bronze proximity",
    source: "--metal-bronze vs --metal-expanded-bronze",
    current: "Same hue, four hundredths of lightness apart.",
    future:
      "Keep the values; require the label to carry the distinction rather than colour alone. Colour is not sufficient to differentiate the two tiers.",
    label: "GOVERNANCE RULE",
    phase: P1,
  },
  {
    item: "Filter chips reuse the listing badge",
    source: "/plans metal filters",
    current: "Filter chips use the same solid MetalBadge treatment as the plan tiles, at full opacity.",
    future: "One tier presentation shared by filter and result, recorded as the canonical behaviour.",
    label: "CURRENT IMPLEMENTATION",
    phase: P5,
  },
];
