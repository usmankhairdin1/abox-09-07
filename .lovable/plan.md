# Phase 52 / Batch B4 — Figma Component Foundation (PLAN ONLY)

Target file: `ABox Design System — Library`. `ABox Proof — Scratch` untouched. No page creation, renaming, reordering or population. `src/**` untouched. B1 variables, B2 typography variables and B3 styles are read-only foundations.

## 1. Source findings (measured this turn)

Usage counts exclude `src/lib/design/**`, `src/components/design/**` and the two reference routes.

ABox layer (importer counts): status-badge 89, surface 82, action-pill-component 38, page-header 25, data-table 20, kpi-card 18, marketplace-page-layout 10, empty-state 10, downline-wizard-stepper 8, plan-card 6, downline-context-banner 6, logo 5, metal-badge 4, notice-page 4, save-continue-button 3, carrier-mark 3, module-tabs 2, field 2, control 2. Shells (internal 89, marketplace 30, member 4) are B7.

UI primitives with real production importers: button 22, select 7, input 7, card 6, label 5, skeleton 4, textarea 3, tabs 3, dialog 4, sheet 3, tooltip 4, dropdown-menu 3, popover 1, progress 1, slider 1, radio-group 1, separator 2.

Observed production props today: Button `variant` ∈ {default (omitted), ghost, outline}; `size` ∈ {default (omitted), sm, icon, icon-sm}. ACTION_PILL keys used: primaryXs, primaryMd, primaryLg, primaryLgPlain, outlineXs, outlineSm, outlineSmCard, outlineMd, outlineMdPlain, outlineLg (all 10). StatusBadge tones used: sage, primary, warning, muted, destructive, info (all 6). MetalBadge tiers: Bronze, Expanded Bronze, Silver, Gold, Platinum, Catastrophic (6).

## 2. Included inventory (14 objects)

Component Sets (10):

| Figma name | Variant property → values | Source |
| --- | --- | --- |
| `ABox/Action/ActionPill` | `variant` → the 10 exact ACTION_PILL keys | `abox/action-pill.ts` |
| `ABox/Action/Button` | `variant` × `size`, only pairs enumerated from call sites (rule in §4) | `ui/button.tsx` |
| `ABox/Status/StatusBadge` | `tone` → sage, primary, warning, muted, destructive, info | `abox/status-badge.tsx` |
| `ABox/Status/MetalBadge` | `tier` → Bronze, Expanded Bronze, Silver, Gold, Platinum, Catastrophic | `abox/metal-badge.tsx` |
| `ABox/Surface/Surface` | `padding` × `elevated` × `interactiveHover` × `decor`, only combinations enumerated from call sites | `abox/surface.tsx` |
| `ABox/Control/Control` | `height` (md, lg) × `focusRing` (true, false), enumerated combinations only | `abox/control.tsx` |
| `ABox/Card/KpiCard` | `tone` → default, primary, sage, warning | `abox/kpi-card.tsx` |
| `ABox/Header/PageHeader` | `variant` → default, compact | `abox/page-header.tsx` |
| `ABox/Nav/ModuleTab` | `state` → default, active (production `activeProps`) | `abox/module-tabs.tsx` |
| `ABox/Nav/WizardStep` | `state` → current, done, upcoming, unreachable (the four real branches) | `abox/downline-wizard-stepper.tsx` |

Single Components (4): `ABox/Feedback/EmptyState`, `ABox/Form/LabeledField`, `ABox/Form/Input`, `ABox/Brand/AboxMark` (variant set on `tone` → primary, sage, sidebar, foreground).

Text / boolean / instance-swap properties are added only where production exposes the prop: EmptyState (`title` text, `body` boolean+text, `icon` boolean, `action` instance swap), KpiCard (`label`, `value`, `delta` boolean, `hint` boolean, `icon` boolean), PageHeader (`title`, `eyebrow` boolean+text, `description` boolean+text, `icon` boolean, `actions` instance swap), LabeledField (`label` text, control = exposed nested instance), StatusBadge/MetalBadge/ActionPill/Button (label text; icon slot only where the class string carries `gap-*`). Defaults are set only where production sets one: Button `variant=default`, `size=default`; KpiCard `tone=default`; PageHeader `variant=default`; Surface `padding=md` and the three booleans `false`; Control `height=md`, `focusRing=false`; AboxMark `tone=primary`.

Nesting: PlanCard, DataTable rows and shells are not created; where a set needs another set (e.g. LabeledField's control) it uses an instance of the B4 component, never a copied structure.

## 3. Excluded, with reason

- Zero-importer primitives: accordion, alert-dialog, aspect-ratio, avatar, breadcrumb, calendar, carousel, chart, collapsible, context-menu, form, input-otp, menubar, navigation-menu, pagination, resizable, scroll-area, sidebar, table, toggle, toggle-group — file exists, no production consumer.
- Reference-route-only: alert, checkbox, switch, drawer (only `routes/design-system.tsx`).
- Assistant-surface-only: spinner, command, hover-card, input-group, button-group (only `components/ai-elements/*`).
- Behavioural overlays/nav primitives (dialog, sheet, popover, tooltip, dropdown-menu, tabs): interaction patterns, deferred to B6.
- Composites deferred: PlanCard, DataTable, marketplace-page-layout, notice-page, downline-context-banner, shopping-path-bar, product-switcher, quote-edit-panel, suspended-marketplace-notice, the three shells, planai-assistant / plan-o-assistant (zero importers, documented gap).
- CarrierMark: monogram and hue are computed at runtime from the carrier name — no finite variant set exists (limitation, not a component).
- `badge.tsx`, `card.tsx`, `skeleton.tsx`, `textarea.tsx`, `select.tsx`, `label.tsx`: real importers but used beneath ABox components or as raw Tailwind defaults; carried as B4-deferred atoms with their importer list recorded, not created, to avoid a second source of truth next to Surface/Control/StatusBadge.

## 4. Enumeration rule (no invented variants)

The extractor enumerates literal prop values at production call sites. Combinations never present in production are not created. A dynamic/computed prop value that cannot be resolved statically is not guessed: it is recorded verbatim as a limitation with file and line, and the enumeration STOPs if it would change a set's variant axis.

## 5. Foundation bindings

Colors → B3 Color Styles (which already bind B1 variables); typography → B3 Text Styles where one exists (eyebrow, serial), otherwise B2 typography variables bound on the text node; elevation → B3 Effect Styles; spacing, radius, border and control height/width → B1 variables. No hard-coded foundation value is allowed inside a component when the corresponding foundation exists. Bindings come from the production declaration, never from value equality.

## 6. Limitations to record verbatim

`color-mix()` tints in `status-badge.tsx` (lines 20–24) are runtime-computed and are approximated by no substitute — the bound tone variable plus the verbatim expression in the description. `oklch` → sRGB conversion, as in B1/B3. Hover/group-hover, transitions and `animate-hairline` are not Figma states. `card-brackets`, `edge-sheen`, `glass`, decorative `DiagonalWeave` in EmptyState: no Figma equivalent. `CountUp` in KpiCard, `FadeRise` in PageHeader: motion. Responsive `md:`/`xl:` rules inside PageHeader, PlanCard, KpiCard: recorded as later composition concerns, not variants. `AboxMark` is inline SVG and is recreated as vector nodes; its `hairline` stroke binds to the B1 variable.

## 7. Idempotency

Exact-name matching; existing component / set / variant reused and updated in place; duplicate name = STOP; type or category mismatch = STOP; nothing unrelated deleted. Components are created detached from any page's visible content via the plugin's existing hidden-construction approach, so no B0 page gains content. Run 2 creates zero objects; Run 1 and Run 2 ids identical.

## 8. `b4-verify`

All 25 checks from the brief, in order: counts (components, sets, variants), exact names, exact variant property names and values, boolean/text/instance-swap properties, defaults, per-object source mapping, B1/B2/B3 bindings, no hard-coded foundation duplicates, no equality-derived relationships, no invented states, no file-only primitives, nesting consistency, B1 unchanged (9 collections / 200 variables), B2 unchanged (19 variables), B3 unchanged (79 styles), zero new pages and empty B0 pages at indices 0..6, no patterns/shells/screens/documentation, `git diff --stat -- src/` empty, `code.js` regenerated only by `build.mjs`, offline Run 1 pass, offline Run 2 zero-creation with identical ids, and an explicit line stating whether the run was offline mock or real Figma Desktop.

Final report prints: totals, every component/set/variant name with id, property/value list with ids, source file and line map, binding summary, exclusion list with reasons, limitations verbatim, Run 1 and Run 2 output, zero-creation proof, unchanged-page proof, unchanged-source proof, and `RESULT: B4 PASSED` or `RESULT: B4 FAILED — do not proceed to B5.`

## 9. Files

Created: `tools/figma-plugin/extract-b4.mjs`, `tools/figma-plugin/tokens-b4.js` (generated). Modified: `tools/figma-plugin/plugin.js` (B4 section + `b4-run` / `b4-verify` entry), `tools/figma-plugin/ui.html` (two buttons), `tools/figma-plugin/build.mjs` (concat `tokens-b4.js`), `tools/figma-plugin/README.md`, `.lovable/manual-work-map.md`. Generated: `tools/figma-plugin/code.js` via `node build.mjs` only, never hand-edited. No `src/**` file is created, modified or deleted; no app UI, routing, branding, data or behaviour changes.

## 10. Run procedure

Offline: regenerate `code.js`, run the mock harness twice, require `RESULT: B4 PASSED` both times with strict zero creations on run 2 — explicitly labelled simulated, ids never presented as real. Real: re-import the plugin in Figma Desktop, open `ABox Design System — Library`, click **Create components**, then **Verify components**, run creation a second time, and send both outputs with ids.

Out of scope: B5 pattern/state/composition work, B6 patterns, B7 shells, B8 screens, page population, documentation content, publishing.
