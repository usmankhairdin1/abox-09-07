/**
 * Phase 11 — formal ownership boundary map.
 * DOCUMENTATION ONLY. Built from the Phase 4–10 ownership evidence. It changes
 * no ownership and takes no configuration away from any runtime system.
 */
import type { BoundaryRecord } from "./canonical-readiness-types";

export const CANONICAL_BOUNDARIES: BoundaryRecord[] = [
  {
    layer: "Foundations",
    belongsHere: "Raw colour, spacing, radius, shadow, type family, size and motion values declared in src/styles.css.",
    doesNotBelongHere: "Any decision about where a value is used. Foundations name values, not usage.",
    owner: "design-system",
    evidence: "src/styles.css @theme block; Phase 1 and 7 foundation modules.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Semantic roles",
    belongsHere: "Meaning attached to a foundation value: primary, muted, hairline, destructive, info, sage, warning, metal tiers.",
    doesNotBelongHere: "Component-specific styling and one-off literal classes.",
    owner: "design-system",
    evidence: "Token roles recorded in Phase 7; metal tier tokens consumed by MetalBadge.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Core components",
    belongsHere: "Reusable units with their own props: UI primitives and the ABox components (Button, Input, Select, StatusBadge, PageHeader, KpiCard, EmptyState, DataTable and peers).",
    doesNotBelongHere: "Screen assumptions, route data fetching, business rules.",
    owner: "design-system",
    evidence: "Phase 5 inventory: 49 UI primitives, 27 ABox modules, with measured consumer counts.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Compounds",
    belongsHere: "Fixed compositions imported as one unit, such as the plan tile, the cart summary card and the metric card.",
    doesNotBelongHere: "Anything used in only one place, which stays route-local until adopted.",
    owner: "design-system",
    evidence: "Phase 9 compound nodes and their edges.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Patterns",
    belongsHere: "Recurring arrangements solving one screen problem, observed in at least two independent places.",
    doesNotBelongHere: "Markup that merely looks alike. Visual similarity is not evidence.",
    owner: "design-system",
    evidence: "Phase 10 pattern specifications keyed to the Phase 9 pat.* nodes.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Experience patterns",
    belongsHere: "A pattern specialised for one experience: same anatomy, different composition, density or wording.",
    doesNotBelongHere: "Changes to the core anatomy, which would make it a different pattern.",
    owner: "business",
    evidence: "Phase 10 experience pattern and extension records across the four experiences.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Shell systems",
    belongsHere: "InternalShell, MarketplaceShell and MemberShell: page frame, navigation model, account control per audience.",
    doesNotBelongHere: "A single shared navigation implementation. Three independent implementations exist by audience.",
    owner: "business",
    evidence: "InternalShell 89 consumers, MarketplaceShell 30, MemberShell on member routes.",
    status: "OBSERVED OVERLAP",
  },
  {
    layer: "Route-local kits",
    belongsHere: "M06, M08, Lucie and ai-elements kits written for one governed module.",
    doesNotBelongHere: "Design-system ownership. A kit is owned by its module until adoption is explicitly approved.",
    owner: "route",
    evidence: "Phase 5 and Phase 8 route-kit records.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Runtime branding (Branding & White-Label)",
    belongsHere: "Tenant colour, logo and name configuration resolved at runtime.",
    doesNotBelongHere: "The design system. It may define the slot a brand value fills; it never owns the value.",
    owner: "runtime",
    evidence: "Branding & White-Label screens under /app/jet/branding.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Marketplace Asset Management",
    belongsHere: "Tenant-supplied marketplace artwork and its administration.",
    doesNotBelongHere: "The design system, which models the image slot only.",
    owner: "runtime",
    evidence: "Marketplace asset administration route.",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Product and business logic",
    belongsHere: "Quoting, eligibility, cart rules, governed module rules, permissions.",
    doesNotBelongHere: "Any component or pattern record. The design system never encodes a business rule.",
    owner: "business",
    evidence: "cart-store, quote state, M08 evaluators.",
    status: "CURRENT IMPLEMENTATION",
  },
];

export const BOUNDARY_RULES: string[] = [
  "GOVERNANCE RULE — a thing has exactly one owner. Where two owners appear to claim it, that is a decision record, not a boundary.",
  "GOVERNANCE RULE — the design system may define how a runtime system consumes shared primitives, never what that system is configured to.",
  "GOVERNANCE RULE — route-local stays route-local until adoption is approved; adoption is never implicit.",
  "GOVERNANCE RULE — ownership is read from evidence, never inferred from a component's name or its folder.",
  "FUTURE DECISION — the three shells and the unowned loading and error presentation have no settled boundary and remain open.",
];
