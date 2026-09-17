# Foundation audit & Design System governance layer

Continuation of the completed centralization work. This phase is documentation and
reference-layer only: the running application is not touched.

## Absolute safety rule

No existing application file changes. No visual, behavioural, routing, navigation, branding,
asset, responsive, typography, icon or logic change anywhere in the product. The only files
written are the two unlisted reference pages, their supporting reference modules, and the
documentation file. If centralizing something could alter rendered output, it is recorded as a
future opportunity instead of applied.

## What already exists (verified in code)

- `src/styles.css` — the single token source: `@theme inline` (radius 6→36px, Inter Tight /
  Bricolage Grotesque, five shadows), `:root` light theme, `.dark` overrides, compatibility
  aliases, six metal tiers with paired foregrounds, utilities (`text-display`, `text-eyebrow`,
  `text-serial`, `glass`, `ring-pill`, `ember-underline`, `noise-field`, `contour`,
  `card-brackets`, `edge-sheen`), six keyframes and six animation classes, plus a
  `prefers-reduced-motion` block.
- `src/components/ui/` — 49 shadcn primitives. `src/components/abox/` — 28 business components
  including the three shells, `action-pill.ts` and `page-header.tsx`.
- `/design-system` and `/design-guide` exist, are unlisted, and consume production tokens and
  components. `src/components/design/reference-kit.tsx` and `src/lib/design-tokens.ts` support
  them. `.lovable/design-system.md` holds the first as-built pass.
- Tailwind default breakpoints are in use (no custom `screens`); responsive behaviour is
  expressed per component with `sm:`/`md:`/`lg:` utilities.

## Work in this phase

### 1. Foundation inventory (read-only audit)

Audit and record, per category: source file, token/class name, current value, consumers, whether
it is a true shared source of truth, a recurring convention, or an intentional one-off. Categories:
color and semantic roles, brand, surfaces, foregrounds, borders, input/ring, status, metal tiers,
typography (families, weights, sizes, line heights, tracking, utilities), spacing, layout and
containers, grids, breakpoints, border widths, radius, elevation, opacity conventions, icon sizes,
control heights and density, motion, utility classes, and compatibility aliases.

### 2. Relationship audits (what the app actually does)

Beyond the raw scales, extract the recurring *relationships* by measuring real call sites:
page edge→content, header→content, section→section, title→supporting text, heading→body,
label→control, control→helper, control→error, field→field, icon→text, card edge→content,
card title→description, content→action, toolbar/filters→results, table header→body, list and nav
item rhythm, dialog/drawer sections, grid and column gaps. Same for typography pairings
(heading→supporting text, label→control, title→metadata, value→label, button and nav text).
These are documented exactly as found; none are normalized.

### 3. Reference-layer structure

New documentation-only data modules under `src/lib/design/` (foundation inventory, spacing and
typography relationships, layout and motion records, governance metadata). They carry names,
sources, usage notes and ownership flags — never new values, and no duplicate tokens.
`src/components/design/reference-kit.tsx` gains a small number of display primitives
(metadata card, relationship row, inventory table, governance badge) used only by the two
reference pages.

### 4. `/design-system` — technical reference

Extend with the audited foundation: full token inventory with source-of-truth metadata,
typography and spacing relationship tables, layout/container and breakpoint records, border,
radius and elevation usage rules, motion inventory, utility-class catalogue, control heights and
icon sizes, and the compatibility alias list. Each entry states what it is, where it lives, what
it is for, what must not change, and whether it is global, component-level or experience-specific.
Examples keep rendering real production components.

### 5. `/design-guide` — master management guide

Add plain-language governance: the ownership hierarchy, how a change propagates, what is shared
versus intentionally local, and the experience-separation model. It stays management-facing — no
second component library.

### 6. Experience separation (architecture only)

Document one core system with experience-specific guidance sections — Web/Marketing, Shopping,
Dashboard/Admin, and a slot for future experiences — inside the existing guide. No competing
systems, no per-experience tokens, no screen changes.

### 7. `.lovable/design-system.md`

Rewrite as the full as-built record: foundation inventory, ownership, token architecture, spacing,
typography, layout, border/radius/elevation, motion, responsive conventions, component and pattern
hierarchy, safe centralization rules, intentional one-offs to leave alone, and future
opportunities. Every statement is labelled CURRENT IMPLEMENTATION or FUTURE OPPORTUNITY.

### 8. Figma mapping blueprint

Extend the mapping table: token→variable, typography→text style, radius→variable, shadow→effect
style, component→component, variant→variant property, state→component property, pattern→layout
template, asset→library item, experience guide→Figma page structure. Blueprint only; no conversion.

## Validation

Typecheck, lint and build; load both reference pages at desktop and mobile with no console errors;
confirm neither page is linked from any navigation; confirm `git diff` shows no existing
application file changed; re-run the screenshot comparison against the existing baselines for
`/`, `/plans`, `/cart` and `/agency/my-organization` at all three viewports, accounting for the
known animation noise.

## Final report

Files changed, foundation categories audited, source-of-truth files identified, new reference
structures created, existing files intentionally untouched, deferred opportunities, the exact URLs
affected, validation results, confirmation that the application is preserved, and remaining gaps
for the next phase.
