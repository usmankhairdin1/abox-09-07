/**
 * Phase 8 — Actions category specification.
 * DOCUMENTATION ONLY. Current implementations are recorded, never changed.
 */
import type { SpecCategoryGroup } from "./component-spec-types";

export const ACTION_SPECS: SpecCategoryGroup = {
  id: "spec-actions",
  category: "actions",
  title: "Actions",
  summary:
    "Three action paths ship today — the Button primitive, the ACTION_PILL class strings and route-local button helpers. All three are preserved. The future canonical target describes one action surface without declaring any current path correct.",
  specs: [
    {
      name: "Button",
      category: "actions",
      purpose: "Trigger an operation in place. The system's baseline interactive control.",
      anatomy: [
        {
          part: "Root",
          requirement: "required",
          role: "button or Slot element owning shape and focus ring",
        },
        { part: "Leading", requirement: "optional", role: "icon before the label" },
        {
          part: "Label",
          requirement: "conditional",
          role: "accessible name unless aria-label is supplied",
        },
        { part: "Trailing", requirement: "optional", role: "icon or count after the label" },
      ],
      contentModel: [
        "Short verb-first label.",
        "Optional single leading glyph.",
        "Icon-only form requires an accessible name.",
      ],
      properties: [
        {
          name: "variant",
          propertyClass: "visual-variant",
          values: "default, destructive, outline, secondary, ghost, link",
          defaultValue: "default",
          figma: "variant-property",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          name: "size",
          propertyClass: "size",
          values: "sm, default, lg, icon, icon-sm",
          defaultValue: "default",
          figma: "variant-property",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          name: "asChild",
          propertyClass: "behavioral",
          values: "boolean",
          figma: "code-only",
          label: "CURRENT IMPLEMENTATION",
          note: "Renders a link or custom element through Radix Slot.",
        },
        {
          name: "disabled",
          propertyClass: "state",
          values: "boolean",
          figma: "variant-property",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          name: "leadingIcon / trailingIcon",
          propertyClass: "icon",
          values: "glyph slot",
          figma: "instance-swap",
          label: "FUTURE CANONICAL TARGET",
          note: "Icons are children today, not props.",
        },
        {
          name: "loading",
          propertyClass: "state",
          values: "boolean",
          figma: "variant-property",
          label: "FUTURE CANONICAL TARGET",
          note: "No loading state exists today.",
        },
      ],
      variants: [
        {
          kind: "visual",
          name: "appearance",
          values: "default, outline, secondary, ghost, link",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          kind: "semantic",
          name: "intent",
          values: "destructive",
          label: "OBSERVED OVERLAP",
          note: "destructive is simultaneously a visual and a semantic variant.",
        },
        {
          kind: "size",
          name: "size",
          values: "h-8 / h-9 / h-10 plus icon forms",
          label: "CURRENT IMPLEMENTATION",
        },
      ],
      states: [
        {
          state: "hover",
          affects: "background",
          accessibility: "not announced",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          state: "focus-visible",
          affects: "ring",
          accessibility: "required",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          state: "disabled",
          affects: "opacity, pointer-events",
          accessibility: "disabled attribute",
          label: "OBSERVED VARIATION",
        },
        {
          state: "loading",
          affects: "icon, interaction",
          accessibility: "polite announcement for long work",
          label: "FUTURE CANONICAL TARGET",
        },
      ],
      sizes: "sm h-8, default h-9, lg h-10, icon square forms.",
      density: "No density property; dense screens pick the smaller size.",
      dependencies: {
        typography: "text-sm font-medium",
        spacing: "px-3 to px-6 by size, gap-2 icon to label",
        color: "--primary, --destructive, --secondary, --accent, --ring",
        shape: "rounded-md, hairline border on outline",
        icon: "child SVG sized to 16px by the base rule",
      },
      responsive: "No internal breakpoints; consumers control stacking and full-width behavior.",
      accessibility:
        "Native button semantics, visible focus ring, disabled removes pointer events. Icon-only usage needs an explicit accessible name — the component does not enforce it today.",
      interaction: "Click and Enter/Space activate. No double-submit protection.",
      composition: {
        allowedChildren: "Text, one or two glyphs.",
        prohibited: "Nested interactive elements, block layout, paragraphs.",
        parentPatterns: "PageHeader actions, Card footer, Dialog footer, TableToolbar, FilterBar.",
      },
      experienceExtensions:
        "Marketplace and web experiences reach for the pill appearance instead; dashboards use the primitive directly.",
      currentImplementation: [
        {
          file: "src/components/ui/button.tsx",
          exportName: "Button, buttonVariants",
          consumers: "22 direct files",
          note: "Also reached indirectly through Dialog, Sheet and Drawer.",
        },
      ],
      observedVariations: [
        "Some screens apply className overrides for width and rounding.",
        "Icon size is sometimes set explicitly even though the base rule already sizes it.",
      ],
      futureCanonicalTarget:
        "One action component whose appearance set includes a pill form, with named icon slots and a loading state, so pill and button stop being separate paths.",
      figmaMapping:
        "Component with Variant, Size, Icon-leading, Icon-trailing and State properties; label as a text property.",
      migrationNotes:
        "FUTURE MIGRATION — would touch the 35 files using ACTION_PILL plus 22 Button consumers. Visual diffing mandatory. Not scheduled.",
      governanceStatus: "documented current component",
      label: "CURRENT IMPLEMENTATION",
    },
    {
      name: "ActionPill",
      category: "actions",
      purpose:
        "A rounded action appearance applied to both buttons and links, which is why it exists as class strings rather than a component.",
      anatomy: [
        {
          part: "Root",
          requirement: "required",
          role: "button or anchor carrying the pill classes",
        },
        { part: "Leading", requirement: "optional", role: "icon" },
        { part: "Label", requirement: "required", role: "action text" },
      ],
      contentModel: ["Verb-first label.", "Optional glyph."],
      properties: [
        {
          name: "tone",
          propertyClass: "visual-variant",
          values: "primary, outline",
          figma: "variant-property",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          name: "size",
          propertyClass: "size",
          values: "xs, sm, smCard, md, lg",
          figma: "variant-property",
          label: "OBSERVED VARIATION",
          note: "sm and smCard resolve to the same height.",
        },
      ],
      variants: [
        {
          kind: "visual",
          name: "tone",
          values: "primary, outline",
          label: "CURRENT IMPLEMENTATION",
        },
        { kind: "size", name: "size", values: "h-8 to h-11", label: "CURRENT IMPLEMENTATION" },
      ],
      states: [
        {
          state: "hover",
          affects: "background",
          accessibility: "not announced",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          state: "focus-visible",
          affects: "ring",
          accessibility: "required",
          label: "CURRENT IMPLEMENTATION",
        },
      ],
      sizes: "xs h-8, sm/smCard h-9, md h-10, lg h-11.",
      density: "Size choice carries density.",
      dependencies: {
        typography: "text-sm font-medium",
        spacing: "px-3 to px-6, gap-2",
        color: "--primary, --foreground, hairline border",
        shape: "fully rounded",
        icon: "16px leading glyph",
      },
      responsive: "Consumers decide wrapping; hero usage stacks below sm.",
      accessibility: "Inherits the semantics of whichever element it is applied to.",
      interaction: "Depends on the host element: navigation for anchors, activation for buttons.",
      composition: {
        allowedChildren: "Text and one glyph.",
        prohibited: "Block content.",
        parentPatterns: "Landing hero, marketplace headers, card actions, table row actions.",
      },
      experienceExtensions: "Dominant in web and marketplace experiences.",
      currentImplementation: [
        {
          file: "src/components/abox/action-pill.ts",
          exportName: "ACTION_PILL",
          consumers: "35 files, 82 references",
        },
      ],
      observedVariations: [
        "Applied to both anchors and buttons, so semantics vary by call site.",
        "Two size names produce one height.",
      ],
      futureCanonicalTarget:
        "Absorbed as an appearance of the single canonical action component, with the link case expressed through an element property.",
      figmaMapping: "Same component family as Button, distinguished by an Appearance variant.",
      migrationNotes: "FUTURE MIGRATION — 35 files. Not scheduled.",
      governanceStatus: "documented current variation",
      label: "OBSERVED OVERLAP",
    },
    {
      name: "IconButton",
      category: "actions",
      purpose: "A square action carrying only a glyph.",
      anatomy: [
        { part: "Root", requirement: "required", role: "square control" },
        { part: "Icon", requirement: "required", role: "the only visible content" },
      ],
      contentModel: ["One glyph.", "An accessible name supplied separately."],
      properties: [
        {
          name: "size",
          propertyClass: "size",
          values: "icon, icon-sm",
          figma: "variant-property",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          name: "accessibleName",
          propertyClass: "accessibility",
          values: "string",
          figma: "code-only",
          label: "GOVERNANCE RULE",
        },
      ],
      variants: [
        {
          kind: "visual",
          name: "appearance",
          values: "inherits Button appearances",
          label: "CURRENT IMPLEMENTATION",
        },
      ],
      states: [
        {
          state: "focus-visible",
          affects: "ring",
          accessibility: "required",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          state: "disabled",
          affects: "opacity",
          accessibility: "disabled attribute",
          label: "CURRENT IMPLEMENTATION",
        },
      ],
      sizes: "Square forms matching the Button ladder.",
      density: "Used mainly in dense toolbars and table rows.",
      dependencies: {
        typography: "none",
        spacing: "centred padding",
        color: "shares Button roles",
        shape: "rounded-md",
        icon: "16px",
      },
      responsive: "No internal breakpoints.",
      accessibility:
        "An accessible name is mandatory; touch target should meet the comfortable minimum.",
      interaction: "Same as Button.",
      composition: {
        allowedChildren: "One glyph.",
        prohibited: "Text labels.",
        parentPatterns: "Toolbars, table rows, overlay close controls.",
      },
      experienceExtensions: "Dashboard dense toolbars are the heaviest user.",
      currentImplementation: [
        {
          file: "src/components/ui/button.tsx",
          exportName: "Button size=icon",
          consumers: "Part of the 22 Button consumers",
        },
      ],
      observedVariations: [
        "Some close controls are hand-rolled inside overlay primitives rather than using the icon size.",
      ],
      futureCanonicalTarget:
        "A distinct named component so the accessible-name requirement can be enforced by its own contract.",
      figmaMapping: "Variant of the action family with Label hidden and an instance-swap icon.",
      migrationNotes: "FUTURE MIGRATION — low volume.",
      governanceStatus: "future canonical target",
      label: "FUTURE CANONICAL TARGET",
    },
    {
      name: "Link",
      category: "actions",
      purpose: "Navigate to another route or resource.",
      anatomy: [
        { part: "Root", requirement: "required", role: "anchor or router Link" },
        { part: "Leading", requirement: "optional", role: "icon" },
        { part: "Label", requirement: "required", role: "destination text" },
      ],
      contentModel: ["Destination-describing text, never 'click here'."],
      properties: [
        {
          name: "href / to",
          propertyClass: "behavioral",
          values: "route or URL",
          figma: "code-only",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          name: "appearance",
          propertyClass: "visual-variant",
          values: "inline, nav, pill",
          figma: "variant-property",
          label: "OBSERVED VARIATION",
        },
      ],
      variants: [
        {
          kind: "visual",
          name: "appearance",
          values: "inline text link, header nav link, pill-styled link",
          label: "OBSERVED VARIATION",
        },
      ],
      states: [
        {
          state: "hover",
          affects: "color, underline",
          accessibility: "not announced",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          state: "focus-visible",
          affects: "ring",
          accessibility: "required",
          label: "CURRENT IMPLEMENTATION",
        },
        {
          state: "selected",
          affects: "color, weight",
          accessibility: "aria-current for navigation",
          label: "OBSERVED VARIATION",
        },
      ],
      sizes: "Inherits surrounding text size.",
      density: "n/a",
      dependencies: {
        typography: "text-sm, .story-link utility in places",
        spacing: "gap-2 to a glyph",
        color: "--primary, --foreground",
        shape: "none",
        icon: "16px",
      },
      responsive: "Header links collapse into the mobile navigation.",
      accessibility: "Real anchors so keyboard and middle-click behave natively.",
      interaction: "Navigation, handled by the router.",
      composition: {
        allowedChildren: "Text and one glyph.",
        prohibited: "Nested interactive content.",
        parentPatterns: "Header navigation, footers, inline prose.",
      },
      experienceExtensions:
        "Header navigation is a web and marketplace pattern; dashboards use sidebar navigation instead.",
      currentImplementation: [
        {
          file: "@tanstack/react-router Link",
          exportName: "Link",
          consumers: "Widely used across routes",
        },
        {
          file: "src/styles.css",
          exportName: ".story-link",
          consumers: "89 references",
          note: "UNOWNED AREA — the class is used but has no definition found in the stylesheet.",
        },
      ],
      observedVariations: [
        "Link styling is expressed through Button variant=link, ACTION_PILL, .story-link and plain classes.",
      ],
      futureCanonicalTarget:
        "One link component with inline and navigation appearances, and the pill case delegated to the action family.",
      figmaMapping: "Text component with Appearance and State variants.",
      migrationNotes: "FUTURE MIGRATION — blocked until the .story-link question is resolved.",
      governanceStatus: "documented current variation",
      label: "OBSERVED VARIATION",
    },
    {
      name: "ButtonGroup",
      category: "actions",
      purpose: "Join related actions into one visual unit.",
      anatomy: [
        { part: "Root", requirement: "required", role: "group container" },
        { part: "Content", requirement: "required", role: "two or more actions" },
      ],
      contentModel: ["Two or more peer actions of the same size."],
      properties: [
        {
          name: "orientation",
          propertyClass: "visual-variant",
          values: "horizontal, vertical",
          figma: "variant-property",
          label: "CURRENT IMPLEMENTATION",
        },
      ],
      variants: [
        {
          kind: "structural",
          name: "orientation",
          values: "horizontal, vertical",
          label: "CURRENT IMPLEMENTATION",
        },
      ],
      states: [
        {
          state: "default",
          affects: "joined radii",
          accessibility: "group role where meaningful",
          label: "CURRENT IMPLEMENTATION",
        },
      ],
      sizes: "Inherits the size of its children.",
      density: "n/a",
      dependencies: {
        typography: "inherited",
        spacing: "shared edges, no gap",
        color: "inherited",
        shape: "outer radius only",
        icon: "inherited",
      },
      responsive: "Wraps or switches to vertical on narrow viewports at the consumer's discretion.",
      accessibility:
        "Children keep their own semantics; the group is presentational unless a role applies.",
      interaction: "No behavior of its own.",
      composition: {
        allowedChildren: "Button, IconButton.",
        prohibited: "Mixed sizes, unrelated actions.",
        parentPatterns: "Toolbars, table row actions.",
      },
      experienceExtensions: "Mostly dashboard toolbars.",
      currentImplementation: [
        {
          file: "src/components/ui/button-group.tsx",
          exportName: "ButtonGroup",
          consumers: "Available primitive with limited adoption",
          note: "POSSIBLY UNUSED — present in the primitive set with few direct consumers.",
        },
      ],
      observedVariations: ["Several screens achieve grouping with flex and gap instead."],
      futureCanonicalTarget: "Kept as a thin layout wrapper over the action family.",
      figmaMapping: "Component with Orientation and Count variants.",
      migrationNotes: "No migration implied.",
      governanceStatus: "documented current component",
      label: "POSSIBLY UNUSED",
    },
    {
      name: "SplitButton",
      category: "actions",
      purpose: "A primary action with an attached menu of related actions.",
      anatomy: [{ part: "Root", requirement: "required", role: "not implemented" }],
      contentModel: ["No production evidence."],
      properties: [],
      variants: [],
      states: [],
      sizes: "Undetermined.",
      density: "Undetermined.",
      dependencies: { typography: "n/a", spacing: "n/a", color: "n/a", shape: "n/a", icon: "n/a" },
      responsive: "n/a",
      accessibility: "n/a",
      interaction: "n/a",
      composition: { allowedChildren: "n/a", prohibited: "n/a", parentPatterns: "n/a" },
      experienceExtensions: "n/a",
      currentImplementation: [],
      observedVariations: [],
      futureCanonicalTarget:
        "No component in the codebase combines a primary action with an attached menu. Specifying one would mean inventing behavior, so it is left open.",
      figmaMapping: "Not defined.",
      migrationNotes: "None.",
      governanceStatus: "future decision",
      label: "FUTURE DECISION",
    },
  ],
};
