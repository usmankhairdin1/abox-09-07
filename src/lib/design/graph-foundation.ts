/**
 * Phase 9 — foundation → semantic role edges.
 * DOCUMENTATION ONLY. References the Phase 7 foundation records rather than
 * restating the token inventory.
 */
import type { DependencyEdge, DependencyNode } from "./graph-types";

export const FOUNDATION_NODES: DependencyNode[] = [
  { id: "fnd.color", layer: "foundation", name: "Colour tokens", source: "src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 7 colour foundation records" },
  { id: "fnd.type", layer: "foundation", name: "Typography scale", source: "src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 3 and Phase 7 typography records" },
  { id: "fnd.space", layer: "foundation", name: "Spacing scale", source: "Tailwind scale as used", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 2 measured occurrences" },
  { id: "fnd.layout", layer: "foundation", name: "Container & breakpoints", source: "src/routes, src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "88rem container, 23 occurrences" },
  { id: "fnd.radius", layer: "foundation", name: "Radius", source: "src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 7 shape records" },
  { id: "fnd.border", layer: "foundation", name: "Hairline border", source: "src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 7 shape records" },
  { id: "fnd.elevation", layer: "foundation", name: "Shadow & elevation", source: "src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 7 shape records" },
  { id: "fnd.opacity", layer: "foundation", name: "Opacity usage", source: "component classes", ownership: "pattern", status: "OBSERVED VARIATION", evidence: "opacity-50 disabled treatment per primitive" },
  { id: "fnd.icon", layer: "foundation", name: "Icon sizing", source: "component classes", ownership: "pattern", status: "OBSERVED VARIATION", evidence: "h-4 w-4 and size-4 both in use" },
  { id: "fnd.motion", layer: "foundation", name: "Motion", source: "src/styles.css, src/components/abox/motion.tsx", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 7 motion records" },
  { id: "fnd.control", layer: "foundation", name: "Control sizing", source: "button.tsx, action-pill.ts, input.tsx", ownership: "primitive", status: "OBSERVED VARIATION", evidence: "32 / 36 / 40 / 44px all ship" },
  { id: "fnd.density", layer: "foundation", name: "Density", source: "screen class choices", ownership: "pattern", status: "UNOWNED AREA", evidence: "No component exposes density as a property" },
  { id: "fnd.status", layer: "foundation", name: "Status tones", source: "src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Phase 7 tone vocabulary" },
  { id: "fnd.tier", layer: "foundation", name: "Metal tier tokens", source: "src/styles.css", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Solid tier tokens including Expanded Bronze" },
];

export const SEMANTIC_ROLE_NODES: DependencyNode[] = [
  { id: "role.action-surface", layer: "semantic-role", name: "Action surface", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "--primary consumed by Button and ACTION_PILL" },
  { id: "role.action-foreground", layer: "semantic-role", name: "Action foreground", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "--primary-foreground" },
  { id: "role.destructive", layer: "semantic-role", name: "Destructive", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "--destructive in Button and Alert" },
  { id: "role.surface", layer: "semantic-role", name: "Surface layers", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "--background, --surface, --panel, --card" },
  { id: "role.focus", layer: "semantic-role", name: "Focus ring", ownership: "foundation", status: "OBSERVED VARIATION", evidence: "--ring with several widths and offsets" },
  { id: "role.text-primary", layer: "semantic-role", name: "Primary text", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "--foreground" },
  { id: "role.text-supporting", layer: "semantic-role", name: "Supporting text", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "--muted-foreground" },
  { id: "role.status-tone", layer: "semantic-role", name: "Status tone", ownership: "foundation", status: "OBSERVED OVERLAP", evidence: "Badge, Alert, toast and StatusBadge vocabularies overlap" },
  { id: "role.tier", layer: "semantic-role", name: "Product tier", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Tier tokens with contrast-chosen foreground" },
  { id: "role.rhythm", layer: "semantic-role", name: "Spacing rhythm", ownership: "pattern", status: "UNOWNED AREA", evidence: "gap-2 316, px-3 238, gap-1 232, p-5 187 occurrences" },
  { id: "role.type-role", layer: "semantic-role", name: "Type roles", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "text-sm 779 uses, font-medium 406" },
  { id: "role.container", layer: "semantic-role", name: "Container width", ownership: "pattern", status: "CURRENT IMPLEMENTATION", evidence: "max-w-[88rem] on web-experience routes" },
  { id: "role.shape", layer: "semantic-role", name: "Shape & elevation", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "rounded-2xl family, hairline, card shadow" },
  { id: "role.glyph", layer: "semantic-role", name: "Glyph size", ownership: "pattern", status: "OBSERVED VARIATION", evidence: "16px inside controls; larger in empty states" },
  { id: "role.motion", layer: "semantic-role", name: "Motion role", ownership: "foundation", status: "CURRENT IMPLEMENTATION", evidence: "Shared transitions and the motion component" },
  { id: "role.control-height", layer: "semantic-role", name: "Control height", ownership: "primitive", status: "OBSERVED VARIATION", evidence: "Two ladders coexist deliberately" },
  { id: "role.density", layer: "semantic-role", name: "Density mode", ownership: "pattern", status: "FUTURE CANONICAL TARGET", evidence: "Expressed by class choice, not by a role" },
  { id: "role.disabled", layer: "semantic-role", name: "Disabled treatment", ownership: "primitive", status: "FUTURE DECISION", evidence: "opacity-50 per primitive; no token role exists" },
];

export const FOUNDATION_EDGES: DependencyEdge[] = [
  { from: "fnd.color", to: "role.action-surface", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "--primary read by button.tsx and action-pill.ts", ownership: "Foundation" },
  { from: "fnd.color", to: "role.action-foreground", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "--primary-foreground", ownership: "Foundation" },
  { from: "fnd.color", to: "role.destructive", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "--destructive", ownership: "Foundation" },
  { from: "fnd.color", to: "role.surface", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "--background, --surface, --panel, --card", ownership: "Foundation", note: "Three compatibility surface aliases remain in the stylesheet." },
  { from: "fnd.color", to: "role.focus", relation: "defines", status: "OBSERVED VARIATION", evidence: "--ring applied with differing widths and offsets", ownership: "Foundation" },
  { from: "fnd.color", to: "role.text-primary", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "--foreground", ownership: "Foundation" },
  { from: "fnd.color", to: "role.text-supporting", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "--muted-foreground", ownership: "Foundation" },
  { from: "fnd.status", to: "role.status-tone", relation: "defines", status: "OBSERVED OVERLAP", evidence: "Four tone vocabularies consume overlapping tokens", ownership: "Foundation" },
  { from: "fnd.tier", to: "role.tier", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "MetalBadge and tier filters", ownership: "Foundation", note: "Tier meaning is commerce-specific and never folded into the generic tone set." },
  { from: "fnd.type", to: "role.type-role", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "Measured type usage in Phase 3", ownership: "Foundation" },
  { from: "fnd.space", to: "role.rhythm", relation: "defines", status: "UNOWNED AREA", evidence: "Spacing is chosen per call site, not through a role", ownership: "No single owner" },
  { from: "fnd.layout", to: "role.container", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "88rem on web-experience routes; shells set their own", ownership: "Shell and route" },
  { from: "fnd.radius", to: "role.shape", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "rounded-md and rounded-2xl families", ownership: "Foundation" },
  { from: "fnd.border", to: "role.shape", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "hairline border token", ownership: "Foundation" },
  { from: "fnd.elevation", to: "role.shape", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "card and overlay shadows", ownership: "Foundation" },
  { from: "fnd.icon", to: "role.glyph", relation: "defines", status: "OBSERVED VARIATION", evidence: "Two sizing syntaxes compute identically", ownership: "No single owner" },
  { from: "fnd.motion", to: "role.motion", relation: "defines", status: "CURRENT IMPLEMENTATION", evidence: "Shared transition utilities", ownership: "Foundation" },
  { from: "fnd.control", to: "role.control-height", relation: "defines", status: "OBSERVED VARIATION", evidence: "Button, ACTION_PILL and input ladders", ownership: "Primitive and ABox" },
  { from: "fnd.density", to: "role.density", relation: "defines", status: "FUTURE CANONICAL TARGET", evidence: "Not established: density has no production role", ownership: "Undecided" },
  { from: "fnd.opacity", to: "role.disabled", relation: "defines", status: "FUTURE DECISION", evidence: "Not established: disabled is a class treatment, not a role", ownership: "Undecided" },
];
