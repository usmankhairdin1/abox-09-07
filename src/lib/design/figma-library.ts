/**
 * Phase 6 — future Figma library blueprint and variable/style mapping.
 *
 * DOCUMENTATION ONLY.
 *
 * NO FIGMA COMPONENT EXISTS. Nothing here has been drawn, converted, exported
 * or synchronised. This is a specification for a library that a future phase
 * would build, derived strictly from the audited production implementation.
 *
 * Consumers: /design-system, /design-guide.
 */
import type { FigmaSectionEntry, FigmaVariableMapping } from "./types";

export const FIGMA_LIBRARY_BLUEPRINT: FigmaSectionEntry[] = [
  {
    section: "00 Foundations",
    purpose:
      "The variable layer everything else binds to: colour, typography, spacing, radius, borders, elevation, iconography, assets and motion metadata.",
    belongs:
      "Every CSS custom property from src/styles.css as a Figma variable, the type ramp as text styles, the spacing scale as number variables, radius and shadow as variables, the icon size steps, the brand marks, and motion documented as metadata.",
    excludes:
      "Components, screens, tenant brand values and any value that does not exist in src/styles.css.",
    source: "src/styles.css — Phase 1, 2, 3 and 4 audits",
    mapping: "One variable per token, named identically minus the leading dashes.",
    governanceOwner: "Design system owner, synchronised from code.",
    migration: "Built first. Nothing above it can be built until the variables exist.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    section: "01 Components",
    purpose: "The canonical component library, organised by category, not by experience.",
    belongs:
      "Actions, Forms, Display, Containers, Data, Navigation, Overlays, Feedback, Brand, Commerce and Shell — each component mirroring a real implementation with matching variant, size, tone and state properties.",
    excludes:
      "Any component that does not exist in code, any experience-forked copy of a shared component, and any component invented to make the library look complete.",
    source: "src/components/ui/*, src/components/abox/* — Phase 5 inventory",
    mapping: "One Figma component per canonical component map entry.",
    governanceOwner: "Design system owner; changes reviewed against production.",
    migration: "Built after Foundations; components bind to variables, never to raw hex.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    section: "02 Patterns",
    purpose: "Repeated compositions, assembled from 01 Components rather than redrawn.",
    belongs:
      "Page, Forms, Search, Filters, Results, Data, Navigation, Commerce, Dashboard and Responsive pattern frames.",
    excludes:
      "New components. If a pattern needs something that is not in 01, that is a signal to add a component, not to draw one inside the pattern.",
    source: "Phase 5 pattern inventory plus route evidence",
    mapping: "Each pattern lists the components it instantiates.",
    governanceOwner: "Design system owner with experience input.",
    migration: "Built after Components.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    section: "03 Screens",
    purpose: "Representative real screens and future screen templates, kept clearly apart.",
    belongs:
      "Landing, plan results, cart, member settings, an agency workspace and an admin workspace as representative current screens; template frames marked as templates.",
    excludes:
      "Speculative redesigns. A screen frame documents what ships or is explicitly labelled a template.",
    source: "src/routes/* — 123 routes across three shells",
    mapping: "Each screen frame names its shell and the patterns it uses.",
    governanceOwner: "Experience owners.",
    migration: "Built after Patterns.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    section: "04 Experience Guidance",
    purpose:
      "Usage guidance for Web/Marketing, Shopping/Commerce, Dashboard/Admin and Future experiences.",
    belongs:
      "Density choices, hierarchy guidance, appropriate patterns, content tone, and do/don't examples that reference Core components.",
    excludes:
      "Component definitions. This section never introduces a component; that is the rule that keeps one system from becoming three.",
    source: "Measured consumers per route family",
    mapping: "References into 01 and 02; defines nothing of its own.",
    governanceOwner: "Experience owners, reviewed by the design system owner.",
    migration: "Built alongside Patterns.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    section: "05 Documentation",
    purpose:
      "The written rules: design guide, usage, accessibility, content, do/don't, governance.",
    belongs:
      "Accessibility requirements, responsive rules, branding and asset governance, the duplicate resolution process, change propagation and the migration record.",
    excludes: "Anything that contradicts the code. Code is the source of truth.",
    source: ".lovable/design-system.md, /design-guide, /design-system",
    mapping: "Mirrors the reference pages rather than restating them differently.",
    governanceOwner: "Design system owner.",
    migration: "Maintained continuously, not built once.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
];

export const FIGMA_VARIABLE_MAPPINGS: FigmaVariableMapping[] = [
  {
    source: "Colour tokens in src/styles.css",
    figma: "Color variables, grouped Brand / Surface / Foreground / Status / Metal / Chart",
    kind: "Variable (colour)",
    mapping: "One to one. Light and dark become two modes of one collection.",
    limitation:
      "Tokens composed with color-mix() at runtime — the StatusBadge tone treatment — have no direct Figma equivalent and must be expressed as resolved values per tone.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Typography ramp",
    figma: "Text styles plus font-size and line-height number variables",
    kind: "Style + variable",
    mapping:
      "Each measured size becomes a text style. text-sm, the most used size at 779 occurrences, is the base.",
    limitation:
      "Responsive type steps written as Tailwind breakpoint utilities cannot be one text style; each breakpoint needs its own style or a variable mode.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Font weights",
    figma: "Text style property",
    kind: "Style",
    mapping: "font-medium at 406 occurrences is the dominant emphasis weight.",
    limitation: "None.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Spacing scale",
    figma: "Number variables Space/1 … Space/24",
    kind: "Variable (number)",
    mapping:
      "Direct. gap-2 at 316 uses, px-3 at 238, gap-1 at 232, p-5 at 187 are the highest-traffic steps.",
    limitation:
      "Arbitrary values such as max-w-[88rem] and min-w-[640px] have no scale step; they need their own named variables first.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Radius tokens",
    figma: "Number variables Radius/*",
    kind: "Variable (number)",
    mapping: "Direct, including the rounded-full pill radius as a named maximum.",
    limitation: "None.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Border tokens",
    figma: "Colour variables plus a stroke-width variable",
    kind: "Variable",
    mapping: "--border and --hairline become two named stroke colours.",
    limitation:
      "Production alternates between the two on visually similar surfaces, so the Figma library must document both rather than pick one.",
    label: "OBSERVED VARIATION",
  },
  {
    source: "Shadow / elevation tokens",
    figma: "Effect styles",
    kind: "Style",
    mapping: "One effect style per shadow token.",
    limitation:
      "Composite hover effects — lift plus bracket reveal plus sheen — are motion, not elevation, and cannot be an effect style.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Opacity",
    figma: "Number variables",
    kind: "Variable (number)",
    mapping: "Limited use. Badges are deliberately full opacity by product decision.",
    limitation:
      "disabled:opacity-50 is a state expression rather than a design value; it maps to a State property, not to an opacity variable.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Breakpoints",
    figma: "Documentation variables / metadata",
    kind: "Metadata",
    mapping: "sm, md, lg, xl recorded as documented numbers.",
    limitation:
      "Figma has no native breakpoint concept; these are documentation values and cannot drive a frame automatically.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Icon sizes",
    figma: "Number variables Icon/14, Icon/16, Icon/20, Icon/24",
    kind: "Variable (number)",
    mapping: "16px is the dominant size, enforced by the Button base rule.",
    limitation: "None.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Motion",
    figma: "Documentation metadata",
    kind: "Metadata",
    mapping:
      "Durations of 300–700ms and the signature easing recorded as written guidance, along with the reduced-motion rule.",
    limitation:
      "Figma cannot express the reduced-motion collapse to 0.01ms; it must be stated in documentation.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Brand marks",
    figma: "Brand frame components",
    kind: "Component",
    mapping: "AboxMark and AboxWordmark redrawn as vector components with tone variants.",
    limitation:
      "The code marks are drawn procedurally; the Figma copies are a mirror and must be re-verified whenever the code changes.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    source: "Tenant and marketplace assets",
    figma: "Not represented",
    kind: "Excluded",
    mapping: "None. Deliberately absent from the library.",
    limitation:
      "These are runtime data owned by Branding & White-Label and Marketplace Asset Management. Putting them in Figma would create a second, stale source of truth.",
    label: "GOVERNANCE RULE",
  },
];
