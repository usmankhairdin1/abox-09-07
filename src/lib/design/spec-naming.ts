/**
 * Phase 8 — naming governance for the future library.
 * DOCUMENTATION ONLY. No production component, prop or token is renamed.
 */
import type { SpecLabel } from "./component-spec-types";

export interface NamingConvention {
  subject: string;
  convention: string;
  example: string;
  avoid: string;
  label: SpecLabel;
}

export const NAMING_CONVENTIONS: NamingConvention[] = [
  {
    subject: "Components",
    convention: "PascalCase noun naming what the thing is, not where it appears.",
    example: "StatusBadge, DataTable, PageHeader",
    avoid: "Screen-derived names such as PlansHeader.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "Component families",
    convention: "Family name, then member: Core / Actions / Button.",
    example: "Core / Overlays / Dialog",
    avoid: "Flat lists where family membership is implied by prefix only.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
  {
    subject: "Variants",
    convention: "Lowercase single words describing appearance or meaning.",
    example: "solid, outline, ghost, link, pill",
    avoid: "primary1, altStyle, new.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "States",
    convention: "The shared state vocabulary, spelled identically in code and Figma.",
    example: "default, hover, focus-visible, disabled, loading",
    avoid: "Synonyms such as inactive for disabled.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "Sizes",
    convention: "Named by intent where two ladders must coexist; otherwise sm / md / lg.",
    example: "compact, standard, prominent",
    avoid: "Mixing numeric and t-shirt naming in one component.",
    label: "FUTURE DECISION",
  },
  {
    subject: "Density",
    convention: "dense and comfortable only.",
    example: "density=dense",
    avoid: "A third middle value without evidence.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "Slots",
    convention: "The anatomy vocabulary, in reading order terms.",
    example: "leading, label, trailing",
    avoid: "left and right, which break in other reading directions.",
    label: "GOVERNANCE RULE",
  },
  {
    subject: "Properties",
    convention: "camelCase; booleans read as a statement about the component.",
    example: "iconOnly, helperText, isLoading",
    avoid: "Negatives such as hideLabel.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "Tokens",
    convention: "Role then element then variant, never the literal colour.",
    example: "--action-surface, --action-foreground",
    avoid: "Literal names that lock a value, and compatibility aliases carried forward silently.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    subject: "Figma variables",
    convention: "Collection / group / role, matching the token role names.",
    example: "Semantic / Action / surface",
    avoid: "Divergence between Figma names and code names.",
    label: "FUTURE FIGMA ORGANIZATION",
  },
];

export const NAMING_RULES_NOTES: string[] = [
  "GOVERNANCE RULE — no production component, property or token is renamed by this specification.",
  "GOVERNANCE RULE — one concept, one word. Where two words already exist in production, both are recorded and neither is declared correct.",
  "GOVERNANCE RULE — names must survive white-labelling: nothing encodes a tenant, a colour or a brand.",
  "OBSERVED VARIATION — sm and smCard name the same height in the pill sizes; the duplication is recorded, not resolved.",
  "OBSERVED OVERLAP — Sheet names both a primitive and a product concept.",
];
