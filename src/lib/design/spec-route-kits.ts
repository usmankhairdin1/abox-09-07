/**
 * Phase 8 — route-local kits and their future relationship to ABox Core.
 * DOCUMENTATION ONLY. No kit is modified, merged or retired.
 */
import type { SpecLabel } from "./component-spec-types";

export interface RouteKitSpec {
  kit: string;
  source: string;
  scope: string;
  overlapsWith: string;
  futureRelationship: string;
  label: SpecLabel;
}

export const ROUTE_KITS: RouteKitSpec[] = [
  {
    kit: "M06 kit",
    source: "src/components/m06",
    scope: "Agency and agent profile screens, including embedded Selling Setup.",
    overlapsWith: "Buttons, page headers, field wrappers, tables.",
    futureRelationship:
      "Becomes an experience extension that composes core components instead of re-implementing them. No change is proposed now.",
    label: "OBSERVED DUPLICATE",
  },
  {
    kit: "M06 screen-common",
    source: "src/components/m06",
    scope: "Shared building blocks inside the M06 screens only.",
    overlapsWith: "Core layout and card patterns.",
    futureRelationship: "Folds into the M06 experience extension layer.",
    label: "OBSERVED DUPLICATE",
  },
  {
    kit: "M08 kit",
    source: "src/components/m08",
    scope: "Licensing, appointments, credentials and selling authority screens.",
    overlapsWith: "Status presentation, tables, field wrappers, empty states.",
    futureRelationship:
      "Its governed status presentation stays domain-specific; generic parts would consume core components.",
    label: "OBSERVED DUPLICATE",
  },
  {
    kit: "Lucie",
    source: "src/components/lucie",
    scope: "Lucie traceability and delivery surfaces.",
    overlapsWith: "Cards, tables, navigation.",
    futureRelationship: "Experience extension; kept separate from core.",
    label: "OBSERVED DUPLICATE",
  },
  {
    kit: "Lucie app",
    source: "src/components/lucie-app",
    scope: "Lucie application shell and screens.",
    overlapsWith: "Shell and navigation patterns.",
    futureRelationship: "Experience extension with its own shell.",
    label: "OBSERVED DUPLICATE",
  },
  {
    kit: "ai-elements",
    source: "src/components/ai-elements",
    scope: "Conversational and AI building blocks.",
    overlapsWith: "Assistant surfaces, message lists, input controls.",
    futureRelationship:
      "A candidate shared extension across assistants, once an assistant contract exists. Not proposed for now.",
    label: "FUTURE OPPORTUNITY",
  },
];

export const KIT_ARCHITECTURE: string[] = [
  "FUTURE CANONICAL TARGET — ABox Core holds only components with no domain knowledge: actions, forms, display, containers, data, navigation, overlays, feedback.",
  "FUTURE CANONICAL TARGET — experience extensions sit above core and add domain meaning: commerce for shopping, administration for dashboards, marketing for web.",
  "FUTURE CANONICAL TARGET — route-local kits sit above extensions and stay free to be one-off, provided they compose rather than re-implement.",
  "GOVERNANCE RULE — dependencies point one way only: kit → extension → core → foundation. Core never imports from a kit.",
  "GOVERNANCE RULE — a route-local kit is legitimate. Local is not a defect; it becomes one only when the same thing is rebuilt in a third place.",
  "FUTURE MIGRATION — nothing in this phase moves code between these layers.",
];
