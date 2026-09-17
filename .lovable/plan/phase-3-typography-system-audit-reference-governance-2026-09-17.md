# Phase 3 — Typography System Audit + Reference Governance

Documentation, reference and governance work only. No font, size, weight, line height, tracking, text colour, hierarchy, component or screen changes. Inconsistency is recorded as OBSERVED VARIATION or FUTURE OPPORTUNITY, never normalised. Only `src/lib/design/*`, `src/components/design/reference-kit.tsx`, the two reference routes, `.lovable/design-system.md` and `roadmap.md` are touched.

## What the pre-audit already found

Measured from `src/styles.css`, `src/routes/__root.tsx`, `src/routes` and `src/components`:

- Three families declared: `--font-sans` Inter Tight, `--font-display` Bricolage Grotesque, with `--font-serif` and `--font-mono` both aliasing those stacks — there is no real serif or mono face.
- **JetBrains Mono is loaded in the font link but never referenced by any token or class** — installed but unused.
- Three typography utilities ship: `.text-display` (194 uses), `.text-eyebrow` (229), `.text-serial` (46), each with fixed family, weight, tracking and, for eyebrow/serial, size, transform and colour.
- Base layer sets `h1, h2, h3, .font-display` to display family, weight 600, `-0.028em` tracking and `wdth 102 / opsz 32` variation settings.
- Size distribution: `text-sm` 779, `text-xs` 464, `text-xl` 94, `text-2xl` 61, `text-lg` 29, `text-base` 29, `text-3xl` 20, `text-4xl` 19, `text-5xl` 7, `text-6xl` 7, `text-7xl` 1, plus sub-scale literals `text-[10px]` 34, `text-[11px]` 23, `text-[0.8rem]` 4, `text-[10.5px]` 3, `text-[9px]` 1.
- Weights: `font-medium` 406, `font-semibold` 125, `font-normal` 10, `font-bold` 1 — despite 400/500/600/700 being loaded for both families.
- Tracking: `tracking-widest` 18, `tracking-[0.18em]` 12, `tracking-tight` 10, `tracking-[0.12em]` 8, plus `[0.14em]` and `[0.08em]`.
- Line height: `leading-relaxed` 20, `leading-none` 16, `leading-tight` 4, `leading-snug` 3, `leading-[0.98]`, `leading-[0.96]`, `leading-4`.
- Text behaviour: `tabular-nums` 90, `uppercase` 38, `truncate` 33, `underline` 19, `whitespace-nowrap` 12, `break-all` 9, `break-words` 4, `line-clamp-1/2` 5, `italic` 3, `line-through` 3, `capitalize` 2.

## What gets built

### 1. `src/lib/design/typography.ts` (new, reference-only)
- **Font architecture** — each family with exact name, import location, fallback stack, purpose and consumers; each weight with its numeric value, evident semantic role, usage count and whether it is loaded-but-unused.
- **Type scale** — every observed size with computed value, occurrence count, paired line height, weight, family, tracking and representative consumers, including the arbitrary sub-scale literals recorded exactly as written.
- **Utility inventory** — `.text-display`, `.text-eyebrow`, `.text-serial` with their full declared values, source, consumers, ownership, maturity and variations.
- **Semantic hierarchy** — one entry per role (display, page title, subtitle, section heading, card title and supporting text, body, secondary body, label, caption, helper, error, status, button label, nav label, table header and body, metadata, KPI value and label, product and plan names, price, numeric, serial, eyebrow) with actual values, where used, consistency and ownership.
- **Numeric and data typography** — prices, counts, percentages, dates, IDs, KPI figures, table values and badge numbers, including `tabular-nums` usage and the `font-variant-numeric` baked into `.text-serial`.

### 2. `src/lib/design/typography-behavior.ts` (new, reference-only)
- **Responsive typography** — per-role desktop/tablet/mobile behaviour with the triggering breakpoint, source and consumer examples; md carries almost all size steps.
- **Typography states** — default, hover, focus, active, selected, disabled, loading, error, success, warning, informational, muted and destructive, recording colour, weight, underline and opacity changes only as implemented.
- **Text length and content behaviour** — wrapping, truncation, line clamping, ellipsis, `break-all`, `whitespace-nowrap`, reading-width caps and the `OverflowText` component, with the containers that are fixed vs flexible height.
- **Accessibility and readability** — smallest observed sizes (down to `text-[9px]`), muted and disabled text conventions, link distinction, error and success treatment, `sr-only` and skip-link typography, the mobile `min-height: 44px` rule on buttons and links, and the reduced-motion block.

### 3. Extensions to existing modules
- `types.ts` — types for the new records.
- `relationships.ts` — extend the existing typography pairings to cover the full requested set (page title → subtitle, section heading → supporting text, card title → description, label → control, control → helper/error, KPI value → label, product name → metadata, plan name → description, price → billing text, table header → body, nav label → metadata, eyebrow → heading, heading → body, body → action, badge → adjacent text, icon → text), each marked consistent / mostly consistent / variable / one-off with ownership.
- `inventory.ts` — a component typography cross-reference covering Button, Input, Textarea, Select, DropdownMenu, Tabs, Card, Badge, StatusBadge, MetalBadge, navigation, sidebar, Table, Tooltip, Popover, Dialog, Sheet, Alert, Toast, form controls, search, filters, PlanCard, product cards, cart, KpiCard, DataTable, EmptyState, wizard stepper, and the marketplace and admin patterns.
- `governance.ts` — typography governance rules, maturity classifications using the existing governance language, unowned typography areas, deferred opportunities, and the Figma typography mapping (family → font family, weight → text-style weight, size/line height/tracking → text style, semantic role → text style, responsive rule → documentation, numeric → data text style, utility → usage rule, component and state typography → component properties, plus naming guidance derived from the current implementation).

### 4. Reference pages
`/design-system` gains a typography reference section: font families, type scale, semantic typography, hierarchy shown with real examples, responsive behaviour, component typography, states, accessibility and the Figma mapping — rendered with the existing reference-kit components and a small number of new documentation-only table helpers. `/design-guide` gains management-level typography governance stating that existing typography is the source of truth, that established roles are reused before new ones are introduced, that variation is not silently normalised, that typography changes are high visual risk, and that there is one Core Typography System — with usage guidance for Web/Marketing, Shopping/Marketplace, Dashboard/Admin and Future Experiences.

### 5. Documentation
`.lovable/design-system.md` and `roadmap.md` updated with every statement labelled CURRENT IMPLEMENTATION, OBSERVED VARIATION, GOVERNANCE RULE or FUTURE OPPORTUNITY, including the JetBrains Mono finding, the serif/mono aliasing, the sub-scale literals, the unowned section-heading sizing and all previously recorded deferred opportunities preserved.

## Validation

TypeScript, ESLint, production build; `/design-system` and `/design-guide` at desktop and mobile with no console errors; both confirmed unlisted with no navigation references; a file-level check that nothing outside the allowed scope changed; screenshot comparison of `/`, `/plans`, `/cart` and `/agency/my-organization` at desktop, tablet and mobile, treating known animation regions as noise exactly as in Phase 2.
