/**
 * Phase 6 — future naming convention.
 *
 * DOCUMENTATION ONLY. The convention is designed to be compatible with the
 * CURRENT codebase, so adopting it never forces a rename. Existing names that
 * already satisfy it are noted as such; existing names that do not are recorded
 * as FUTURE DECISION rather than corrected.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { NamingRule } from "./types";

export const NAMING_CONVENTIONS: NamingRule[] = [
  {
    subject: "Colour tokens",
    convention:
      "--{role} for a base role and --{role}-{modifier} for a derived one. Role names describe meaning, never appearance.",
    example: "--primary, --primary-foreground, --primary-soft, --sage, --sage-soft, --hairline",
    codebaseFit: "Already satisfied. Every token in src/styles.css follows this shape today.",
    figmaFit: "Maps directly to a Figma colour variable with the same name minus the leading dashes.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Metal tier tokens",
    convention: "--metal-{tier} paired with --metal-{tier}-foreground.",
    example: "--metal-gold and --metal-gold-foreground",
    codebaseFit: "Already satisfied, including Expanded Bronze.",
    figmaFit: "A Tier variable collection with a foreground pair per tier.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Spacing and size tokens",
    convention:
      "Keep the Tailwind scale as the vocabulary. Name only values that are currently arbitrary literals.",
    example: "--container-web for the 88rem width; --table-min for the 640px table floor",
    codebaseFit:
      "FUTURE OPPORTUNITY — these literals appear 23 times and once respectively, with no token behind them.",
    figmaFit: "Number variables consumed by layout constraints.",
    label: "FUTURE OPPORTUNITY",
  },
  {
    subject: "Components",
    convention: "PascalCase, noun-first, no experience prefix. The name states what it is.",
    example: "StatusBadge, MetalBadge, PageHeader, DataTable, EmptyState",
    codebaseFit: "Already satisfied across abox/* and ui/*.",
    figmaFit: "One Figma component per name, grouped by category rather than by prefix.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Compound components",
    convention:
      "Parent name plus a dotted or suffixed part name; parts are never exported as standalone top-level names.",
    example: "Card / CardHeader / CardContent / CardFooter",
    codebaseFit: "Satisfied by the shadcn primitives; the ABox compounds keep their parts internal.",
    figmaFit: "Nested Figma components inside the parent.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Route-local kits",
    convention:
      "Prefix with the module so a name collision with Core is impossible at a glance.",
    example: "M06StatusTag rather than StatusTag; M06Sheet rather than Sheet",
    codebaseFit:
      "FUTURE DECISION — not satisfied today. The M06 kit's Sheet collides by name with ui/Sheet.",
    figmaFit: "A module section separate from Core.",
    label: "FUTURE DECISION",
  },
  {
    subject: "Variants",
    convention:
      "Lowercase, single word where possible, describing intent rather than colour or size.",
    example: "default, outline, ghost, destructive, secondary, link",
    codebaseFit: "Already satisfied by Button and ui/Badge.",
    figmaFit: "A Variant property with identical values.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Sizes",
    convention: "xs, sm, md (or default), lg, xl. A component uses only the steps it needs.",
    example: "Button default/sm/lg/icon; ACTION_PILL xs/sm/md/lg",
    codebaseFit:
      "OBSERVED VARIATION — Button calls its middle step `default` while ACTION_PILL calls it `md`, and ACTION_PILL adds `smCard`.",
    figmaFit: "A Size property; the outlier steps need an explicit mapping note.",
    label: "OBSERVED VARIATION",
  },
  {
    subject: "Tones",
    convention: "Semantic tone names, never colour names.",
    example: "sage, primary, warning, muted, destructive, info",
    codebaseFit: "Satisfied by StatusBadge. `sage` is a brand accent name rather than a pure role.",
    figmaFit: "A Tone property bound to the tone variables.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "States",
    convention:
      "Use the platform's own vocabulary — hover, focus-visible, active, disabled, open, selected, loading — not invented synonyms.",
    example: "focus-visible rather than focussed; disabled rather than inactive",
    codebaseFit: "Already satisfied.",
    figmaFit: "A State property using the same words.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Patterns",
    convention: "Descriptive noun phrases in title case, naming the problem the pattern solves.",
    example: "Page frame, Results toolbar, Filter rail, Surface card, Empty state",
    codebaseFit: "No naming exists today because most patterns have no owner.",
    figmaFit: "A Patterns section organised by problem.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "Experience patterns",
    convention: "Experience prefix plus pattern name, so scope is obvious.",
    example: "Shopping / Filter rail; Dashboard / KPI row; Web / Hero",
    codebaseFit: "Not used today; experience patterns live inline in routes.",
    figmaFit: "Experience subsections that reference, never redraw, Core components.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "Icons",
    convention:
      "Keep the library's own export name. A wrapper is named for its product role, not for its shape.",
    example: "lucide ShoppingCart used directly; ToothIcon wraps Tabler IconDental",
    codebaseFit: "Already satisfied.",
    figmaFit: "One icon frame per library name.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Assets",
    convention: "Role-based names. Never encode a tenant, a size or a colour into an asset name.",
    example: "AboxMark, AboxWordmark",
    codebaseFit: "Already satisfied; there is almost nothing to name, as assets are code-drawn.",
    figmaFit: "A brand frame mirroring the component names.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    subject: "Figma variables",
    convention:
      "Collection/group/name, where the name equals the CSS custom property without its dashes.",
    example: "Color/Brand/primary; Color/Status/warning; Radius/radius",
    codebaseFit: "Compatible; no code rename required.",
    figmaFit: "Native. Grouping comes from the collection path, not from the token name.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    subject: "Figma components",
    convention: "Section/Category/ComponentName, matching the canonical component map.",
    example: "01 Components/Actions/Button; 01 Components/Display/StatusBadge",
    codebaseFit: "Compatible; the component names are unchanged.",
    figmaFit: "Native Figma page and frame structure.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    subject: "Figma component properties",
    convention:
      "Title-case property names with lowercase values that match the code exactly: Variant, Size, Tone, State, Density, Icon.",
    example: "Variant = outline; Size = sm; Tone = warning; State = disabled",
    codebaseFit: "Values map one to one onto the current props.",
    figmaFit: "Native. Keeping values identical is what makes the mapping checkable.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
];
