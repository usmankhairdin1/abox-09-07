/**
 * Phase 7 — component semantic foundation roles.
 *
 * FUTURE CANONICAL TARGET mappings only. Each `current` field records what
 * production does today; the role names do not exist in code and no
 * component implementation is modified.
 */
import type { ComponentRoleSpec } from "./types";

export const COMPONENT_FOUNDATION_ROLES: ComponentRoleSpec[] = [
  {
    component: "Button",
    source: "src/components/ui/button.tsx — 22 direct consumers",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      { slot: "Action surface", foundation: "action/primary", current: "bg-primary" },
      {
        slot: "Action foreground",
        foundation: "action/primary-on",
        current: "text-primary-foreground",
      },
      { slot: "Hover surface", foundation: "state/hover", current: "hover:bg-primary/90" },
      { slot: "Outline border", foundation: "line/control", current: "border-input" },
      {
        slot: "Focus ring",
        foundation: "state/focus-ring",
        current: "focus-visible:ring-1 ring-ring",
      },
      { slot: "Disabled", foundation: "opacity/disabled", current: "disabled:opacity-50" },
      { slot: "Icon size", foundation: "icon/400", current: "[&_svg]:size-4" },
      { slot: "Typography", foundation: "type/action", current: "text-sm font-medium" },
      { slot: "Height", foundation: "control/compact", current: "h-9 (lg h-10, sm h-8)" },
      { slot: "Padding", foundation: "space/400 inline", current: "px-4 py-2" },
      { slot: "Radius", foundation: "radius/control", current: "rounded-md" },
      {
        slot: "Elevation",
        foundation: "elevation/raised-subtle",
        current: "shadow / shadow-sm per variant",
      },
    ],
  },
  {
    component: "Input",
    source: "src/components/ui/input.tsx — 7 direct consumers",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      { slot: "Input surface", foundation: "surface/control", current: "bg-transparent" },
      { slot: "Input foreground", foundation: "content/primary", current: "inherited" },
      { slot: "Input border", foundation: "line/control", current: "border-input" },
      {
        slot: "Placeholder",
        foundation: "content/secondary",
        current: "placeholder:text-muted-foreground",
      },
      {
        slot: "Focus ring",
        foundation: "state/focus-ring",
        current: "focus-visible:ring-1 ring-ring",
      },
      { slot: "Disabled", foundation: "opacity/disabled", current: "disabled:opacity-50" },
      { slot: "Typography", foundation: "type/body", current: "text-base md:text-sm" },
      { slot: "Height", foundation: "control/compact", current: "h-9" },
      {
        slot: "Helper / error",
        foundation: "status/danger",
        current: "Not owned by the primitive",
      },
    ],
    note: "Helper and error text are written at each call site; no shared field component owns them.",
  },
  {
    component: "Card",
    source:
      "src/components/ui/card.tsx and the ABox card pattern — 6 primitive consumers, 264 bg-card occurrences",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      { slot: "Surface", foundation: "surface/raised", current: "bg-card" },
      { slot: "Border", foundation: "line/hairline", current: "border-hairline or border-border" },
      { slot: "Elevation", foundation: "elevation/card", current: "shadow-card where applied" },
      { slot: "Radius", foundation: "radius/card", current: "rounded-2xl" },
      {
        slot: "Internal spacing",
        foundation: "space/500",
        current: "p-5, with p-4 and p-6 variants",
      },
      { slot: "Title", foundation: "type/component-title", current: "text-base font-semibold" },
      { slot: "Description", foundation: "type/supporting", current: "text-xs or text-sm muted" },
    ],
    note: "The ABox card surface is a recurring markup pattern rather than one owned component.",
  },
  {
    component: "StatusBadge",
    source: "src/components/abox/status-badge.tsx — shared across 89 files with InternalShell",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      {
        slot: "Tone",
        foundation: "status/<role>",
        current: "--tone set from sage, primary, warning, muted, destructive or info",
      },
      {
        slot: "Background",
        foundation: "status/<role>-subtle",
        current: "color-mix tone 12% over card",
      },
      {
        slot: "Foreground",
        foundation: "status/<role>-on-subtle",
        current: "color-mix tone 88% with foreground",
      },
      {
        slot: "Border",
        foundation: "status/<role>-line",
        current: "color-mix tone 34% with transparent",
      },
      { slot: "Indicator dot", foundation: "status/<role>", current: "solid 6px dot at full tone" },
      {
        slot: "Typography",
        foundation: "type/micro-label",
        current: "text-[10px] font-semibold uppercase tracking-[0.12em]",
      },
      { slot: "Radius", foundation: "radius/full", current: "rounded-full" },
      { slot: "Padding", foundation: "space/300 inline", current: "px-2.5 py-0.5" },
    ],
    note: "The mix percentages are the real foundation here; a future role set would name them as steps.",
  },
  {
    component: "MetalBadge",
    source: "src/components/abox/metal-badge.tsx",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      { slot: "Tier surface", foundation: "tier/<name>", current: "solid --metal-<name>" },
      {
        slot: "Tier foreground",
        foundation: "tier/<name>-on",
        current: "--metal-<name>-fg, chosen per tier",
      },
      { slot: "Typography", foundation: "type/micro-label", current: "uppercase micro label" },
      { slot: "Radius", foundation: "radius/full", current: "rounded-full" },
      {
        slot: "Opacity",
        foundation: "none",
        current: "always full opacity, in filters and listings alike",
      },
    ],
  },
  {
    component: "PageHeader",
    source: "src/components/abox/page-header.tsx — 25 consumers",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      {
        slot: "Title",
        foundation: "type/page-title",
        current: "display family, compact variant reduced",
      },
      { slot: "Supporting", foundation: "type/supporting", current: "muted description" },
      { slot: "Eyebrow", foundation: "type/eyebrow", current: "text-eyebrow" },
      { slot: "Actions", foundation: "component/button", current: "Button and ACTION_PILL" },
      {
        slot: "Spacing",
        foundation: "space/relationship title→supporting",
        current: "mt-1 to mt-3",
      },
    ],
  },
  {
    component: "DataTable",
    source: "src/components/abox/data-table.tsx — 20 consumers",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      {
        slot: "Shell surface",
        foundation: "surface/raised",
        current: "bg-card with a hairline border",
      },
      {
        slot: "Head typography",
        foundation: "type/table-head",
        current: "10px uppercase tracked muted",
      },
      { slot: "Cell typography", foundation: "type/table-cell", current: "text-sm" },
      { slot: "Row rule", foundation: "line/hairline", current: "border-hairline" },
      { slot: "Density", foundation: "density/table", current: "two padding modes in use" },
      { slot: "Radius", foundation: "radius/card", current: "rounded-2xl" },
    ],
  },
  {
    component: "KpiCard",
    source: "src/components/abox/kpi-card.tsx — 18 consumers",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      { slot: "Surface", foundation: "surface/raised", current: "bg-card" },
      { slot: "Value", foundation: "type/numeric-kpi", current: "display family, tabular figures" },
      { slot: "Label", foundation: "type/eyebrow", current: "text-eyebrow" },
      { slot: "Delta status", foundation: "status/<role>", current: "tone-driven" },
    ],
  },
  {
    component: "EmptyState",
    source: "src/components/abox/empty-state.tsx — 10 consumers",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      { slot: "Icon", foundation: "icon/illustrative", current: "larger Lucide icon" },
      { slot: "Title", foundation: "type/component-title", current: "font-semibold" },
      { slot: "Body", foundation: "type/supporting", current: "muted" },
      { slot: "Action", foundation: "component/button", current: "Button" },
      {
        slot: "Surface",
        foundation: "surface/raised",
        current: "card or bare region depending on the call site",
      },
    ],
    note: "Surface treatment varies by call site.",
  },
  {
    component: "Action pill",
    source: "src/components/abox/action-pill.ts — 82 references across 35 files",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      {
        slot: "Surface",
        foundation: "surface/raised",
        current: "card surface with a hairline ring",
      },
      { slot: "Typography", foundation: "type/action", current: "text-sm font-medium" },
      { slot: "Radius", foundation: "radius/full", current: "rounded-full" },
      { slot: "Icon gap", foundation: "space/200", current: "gap-2" },
      { slot: "Hover", foundation: "state/hover", current: "accent hover surface" },
    ],
    note: "Centralised in Phase 1 as an exact-duplicate class string; it is a shared constant, not yet a component.",
  },
  {
    component: "Dialog / Drawer",
    source: "src/components/ui/dialog.tsx, drawer.tsx — 4 consumers each",
    label: "FUTURE CANONICAL TARGET",
    roles: [
      { slot: "Overlay surface", foundation: "surface/overlay", current: "bg-popover" },
      { slot: "Scrim", foundation: "opacity/scrim", current: "bg-black/40" },
      {
        slot: "Elevation",
        foundation: "elevation/elevated or drawer",
        current: "--shadow-elevated, --shadow-drawer",
      },
      { slot: "Radius", foundation: "radius/card", current: "shadcn default" },
      {
        slot: "Section spacing",
        foundation: "space/relationship dialog",
        current: "primitive defaults",
      },
    ],
  },
];
