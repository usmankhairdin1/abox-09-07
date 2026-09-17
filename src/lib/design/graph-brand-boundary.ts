/**
 * Phase 9 — brand and asset ownership boundary.
 *
 * DOCUMENTATION ONLY. Runtime Branding & White-Label and Marketplace Asset
 * Management remain operational features with their own owners. Nothing they
 * manage is a design-system token, and this graph never describes it as one.
 */
import type { OwnershipRecord, SpecLabel } from "./graph-types";

export interface BoundaryEdge {
  from: string;
  to: string;
  direction: string;
  status: SpecLabel;
  rule: string;
}

export const BRAND_BOUNDARY: BoundaryEdge[] = [
  {
    from: "Foundation colour roles",
    to: "Runtime brand configuration",
    direction: "Foundation defines the role; the runtime feature supplies a value for it.",
    status: "CURRENT IMPLEMENTATION",
    rule: "A tenant value fills a role. It never becomes a token and never enters the stylesheet.",
  },
  {
    from: "Runtime brand configuration",
    to: "Foundation",
    direction: "No dependency. The runtime feature cannot define, add or rename a foundation role.",
    status: "GOVERNANCE RULE",
    rule: "The arrow runs one way only.",
  },
  {
    from: "BrandMark / Wordmark components",
    to: "Runtime brand assets",
    direction:
      "Components describe placement, tone and clear space; assets are supplied at runtime.",
    status: "CURRENT IMPLEMENTATION",
    rule: "Marks are code-drawn today; no image files ship except the favicon.",
  },
  {
    from: "CarrierMark",
    to: "Marketplace asset management",
    direction:
      "The monogram is a deterministic fallback; real artwork would come from asset management.",
    status: "OBSERVED VARIATION",
    rule: "The mark is explicitly illustrative and is not carrier artwork.",
  },
  {
    from: "Design system",
    to: "Marketplace asset management screen",
    direction: "The design system owns the components the screen is built from, nothing on it.",
    status: "GOVERNANCE RULE",
    rule: "Storage, upload and asset lifecycle belong to the runtime feature.",
  },
  {
    from: "Design system",
    to: "Branding & White-Label screen",
    direction: "Same boundary: components yes, configured values no.",
    status: "GOVERNANCE RULE",
    rule: "A brand colour shown on that screen is data, not a token.",
  },
];

export const OWNERSHIP_MODEL: OwnershipRecord[] = [
  {
    layer: "Foundation",
    ownedBy: "The stylesheet",
    changesRequire: "Review of every semantic role that reads the value",
    outsideTheSystem: "Tenant brand values",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Semantic role",
    ownedBy: "The design system",
    changesRequire: "Review of every component role that consumes it",
    outsideTheSystem: "Domain meaning such as tier or exchange status",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Core component",
    ownedBy: "Primitive and ABox component authors",
    changesRequire: "Review of measured consumers",
    outsideTheSystem: "Business logic and data",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Compound",
    ownedBy: "The component that defines the composition",
    changesRequire: "Review of the patterns built on it",
    outsideTheSystem: "Screen-specific arrangements",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Pattern",
    ownedBy: "No single owner today for several patterns",
    changesRequire: "Review of every experience that uses it",
    outsideTheSystem: "One-off screen layouts",
    status: "UNOWNED AREA",
  },
  {
    layer: "Experience",
    ownedBy: "The shell and its screens",
    changesRequire: "Review of the screens inside it",
    outsideTheSystem: "Other experiences",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Screen",
    ownedBy: "The route",
    changesRequire: "Nothing beyond itself, provided it composes rather than redefines",
    outsideTheSystem: "Shared components",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    layer: "Runtime branding",
    ownedBy: "Branding & White-Label",
    changesRequire: "Its own approval path",
    outsideTheSystem: "The whole design system",
    status: "GOVERNANCE RULE",
  },
  {
    layer: "Runtime assets",
    ownedBy: "Marketplace Asset Management",
    changesRequire: "Its own approval path",
    outsideTheSystem: "The whole design system",
    status: "GOVERNANCE RULE",
  },
];
