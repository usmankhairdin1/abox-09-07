/**
 * Phase 8 — anatomy vocabulary for future ABox Core components.
 * DOCUMENTATION ONLY. No production markup is described as changing.
 */
import type { SpecLabel } from "./component-spec-types";

export interface AnatomyTerm {
  part: string;
  definition: string;
  appliesTo: string;
  neverForce: string;
  currentEvidence: string;
  label: SpecLabel;
}

export const ANATOMY_VOCABULARY: AnatomyTerm[] = [
  {
    part: "Root",
    definition: "The single outer element that owns shape, elevation and the component's box.",
    appliesTo: "Every component without exception.",
    neverForce: "Never split a root; a component has exactly one.",
    currentEvidence: "button.tsx, card.tsx, status-badge.tsx all render one outer element.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    part: "Leading",
    definition: "The slot before the label in reading order — icon, avatar, indicator or control.",
    appliesTo: "Button, ActionPill, ListItem, FormField, StatusBadge, PageHeader.",
    neverForce: "Not applicable to plain Surface, Divider or Skeleton.",
    currentEvidence: "Header nav links render a Lucide icon before the label.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    part: "Icon",
    definition: "A glyph slot, decorative or labelled, sized by the icon foundation.",
    appliesTo: "Actions, Display, Feedback, Navigation.",
    neverForce: "Containers and layout primitives carry no icon slot.",
    currentEvidence:
      "lucide-react imported in 144 files; base button rule sizes child SVG to 16px.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Label",
    definition: "The primary text of a component; the accessible name when no aria-label exists.",
    appliesTo: "Actions, Forms, Badges, Tabs, ListItem.",
    neverForce: "Icon-only controls replace it with an accessible name, not an empty label.",
    currentEvidence: "ACTION_PILL and Button both use text-sm font-medium.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Supporting",
    definition: "Secondary text that qualifies the label without being helper or error text.",
    appliesTo: "PageHeader, Card, ListItem, EmptyState, KpiCard.",
    neverForce: "Do not use it as a second heading.",
    currentEvidence: "PageHeader renders a description under the title.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Trailing",
    definition: "The slot after the label — chevron, count, secondary action or status.",
    appliesTo: "Actions, ListItem, Navigation, Select, DropdownMenu triggers.",
    neverForce: "Not a place for primary content.",
    currentEvidence: "Header profile control renders a chevron after the user name.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Header",
    definition: "The leading structural band of a container: title, supporting text, actions.",
    appliesTo: "Card, Dialog, Sheet, Panel, Table toolbar region.",
    neverForce: "A Badge or Button has no header.",
    currentEvidence: "card.tsx exposes CardHeader; dialog.tsx exposes DialogHeader.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Body",
    definition: "The main content region of a container.",
    appliesTo: "Card, Dialog, Sheet, Panel, Table.",
    neverForce: "Not applicable to inline components.",
    currentEvidence: "CardContent, DialogContent body region.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Footer",
    definition: "The trailing structural band, usually actions or summary.",
    appliesTo: "Card, Dialog, Sheet, Table (pagination region).",
    neverForce: "Optional everywhere; never added only for symmetry.",
    currentEvidence: "CardFooter, DialogFooter.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Title",
    definition: "The heading element of a container region.",
    appliesTo: "Card, Dialog, Sheet, PageHeader, EmptyState, Section.",
    neverForce: "Never more than one per region.",
    currentEvidence: "CardTitle, DialogTitle, PageHeader title.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Description",
    definition: "Explanatory prose directly under a title.",
    appliesTo: "Card, Dialog, EmptyState, PageHeader, FormField.",
    neverForce: "Do not use for validation messages — that is Error.",
    currentEvidence: "CardDescription, DialogDescription.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Content",
    definition: "Generic slot for arbitrary children where no stricter part applies.",
    appliesTo: "Surface, Panel, ScrollArea, Section.",
    neverForce: "Prefer a named part when one fits.",
    currentEvidence: "Shell content regions.",
    label: "FUTURE CANONICAL TARGET",
  },
  {
    part: "Action",
    definition: "A slot reserved for interactive controls belonging to the container.",
    appliesTo: "PageHeader, Card, Dialog footer, TableToolbar, EmptyState.",
    neverForce: "Not a place for status text.",
    currentEvidence: "PageHeader accepts an actions node; EmptyState accepts an action.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Media",
    definition: "Image, illustration or brand mark region.",
    appliesTo: "PlanCard (carrier mark), BrandMark surfaces.",
    neverForce:
      "No image files exist in src or public except the favicon, so this slot is mostly code-drawn today.",
    currentEvidence: "CarrierMark renders a deterministic monogram, not a file.",
    label: "OBSERVED VARIATION",
  },
  {
    part: "Indicator",
    definition: "A non-interactive signal: dot, tier mark, progress, selection tick.",
    appliesTo: "StatusBadge, MetalBadge, Progress, Checkbox, Tabs.",
    neverForce: "An indicator never carries the accessible name alone.",
    currentEvidence: "MetalBadge and StatusBadge render solid tone marks.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Control",
    definition: "The focusable input element inside a field.",
    appliesTo: "Input, Select, Checkbox, Radio, Switch, Combobox, SearchField.",
    neverForce: "A display component has no control.",
    currentEvidence: "input.tsx, select.tsx, checkbox.tsx.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Helper",
    definition: "Persistent guidance text below a control.",
    appliesTo: "FormField and its descendants.",
    neverForce: "Never doubles as an error.",
    currentEvidence: "form.tsx FormDescription.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Error",
    definition: "Validation text that replaces or accompanies helper text.",
    appliesTo: "FormField, inline validation, Alert.",
    neverForce: "Never used for neutral information.",
    currentEvidence: "form.tsx FormMessage.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Overlay",
    definition: "The scrim behind a floating surface.",
    appliesTo: "Dialog, Sheet, Drawer, AlertDialog.",
    neverForce: "Popover and DropdownMenu have none.",
    currentEvidence: "dialog.tsx and sheet.tsx render a Radix overlay.",
    label: "CURRENT IMPLEMENTATION",
  },
  {
    part: "Trigger",
    definition: "The element that opens an overlay and owns its open state.",
    appliesTo: "Dialog, Sheet, Popover, DropdownMenu, Tooltip, Combobox, Command.",
    neverForce: "Always a real control, never a bare div.",
    currentEvidence: "Radix trigger components throughout src/components/ui.",
    label: "CURRENT IMPLEMENTATION",
  },
];

export const ANATOMY_RULES: string[] = [
  "GOVERNANCE RULE — anatomy parts are named slots, not required markup. A component declares only the parts it genuinely has.",
  "GOVERNANCE RULE — one Root and at most one Title per region. Everything else is optional.",
  "GOVERNANCE RULE — Leading and Trailing describe position in reading order, not left and right, so right-to-left and bilingual layouts stay correct.",
  "GOVERNANCE RULE — Helper and Error are distinct parts even when only one renders at a time.",
  "FUTURE DECISION — whether Content stays a generic part or is replaced by named parts per container is unresolved; current shells use ad-hoc content regions.",
];
