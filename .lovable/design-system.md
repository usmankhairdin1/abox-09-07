# ABox Design System — as-built foundation record

Every statement below was verified against the running implementation and is labelled
**CURRENT IMPLEMENTATION** or **FUTURE OPPORTUNITY**. Nothing proposed is described as if it
already exists.

Live references (unlisted, direct-URL only, never linked from the application):

- `/design-system` — technical reference: live tokens, foundation audit, relationship tables,
  component/state/pattern inventories, governance, experiences, Figma blueprint.
- `/design-guide` — management guide: brand, colour, typography, components, states, product
  patterns, layout, iconography, governance, accessibility, experiences, Figma blueprint.

Reference-layer modules — documentation only, imported exclusively by those two routes:
`src/lib/design/types.ts`, `foundation.ts`, `relationships.ts`, `inventory.ts`, `governance.ts`,
plus `src/lib/design-tokens.ts` and `src/components/design/reference-kit.tsx`.

---

## 1. Architecture and ownership — CURRENT IMPLEMENTATION

```text
1 Foundation tokens      src/styles.css
2 UI primitives          src/components/ui/*        (49 shadcn primitives)
3 Business components    src/components/abox/*      (28 ABox components)
4 States & variants      variant maps inside those components
5 Reusable patterns      route markup with no component owner yet
6 Experience guidance    /design-guide sections
7 Application consumers  src/routes/*
```

Rule: a screen composes components, a component composes primitives, everything reads tokens.
No layer hardcodes a colour, font or shadow value.

## 2. Token architecture — CURRENT IMPLEMENTATION

`src/styles.css` is the only file that defines design values. It holds:

- `@theme inline` — 45 `--color-*` aliases, 7 radius steps, 4 font stacks, 5 shadows.
- `:root` — light theme (oklch). `.dark` — full dark re-declaration.
- A second `@theme inline` block exposing the compatibility aliases.

| Family | Tokens |
| --- | --- |
| Canvas & surfaces | background, surface, panel, card, popover, sidebar (+ foregrounds) |
| Brand | primary, primary-soft, sage, sage-soft, secondary, accent, ai (+ foregrounds) |
| Semantic | success, warning, destructive, info, muted (+ foregrounds) |
| Lines & focus | border, border-strong, hairline, input, ring |
| Charts | chart-1 … chart-5 |
| Metal tiers | bronze, expanded-bronze, silver, gold, platinum, catastrophic (+ `-fg` pairs) |
| Radius | sm 6px, md 10px, lg 14px, xl 18px, 2xl 22px, 3xl 28px, 4xl 36px; `--radius` 0.875rem |
| Shadows | card, elevated, drawer, plate, glow |
| Fonts | sans = Inter Tight, display = Bricolage Grotesque; serif/mono alias those stacks |

Contrast standard: dark background → light foreground, light background → dark foreground. Metal
tiers encode this explicitly with paired `-fg` tokens.

Compatibility aliases (keep — governed screens depend on them): `--brand-accent` → primary,
`--ai` / `--ai-foreground`, `--surface-1/2/3` → card/surface/panel, `--shadow-overlay` → elevated.

## 3. Typography — CURRENT IMPLEMENTATION

- Families: Inter Tight (body, labels, data), Bricolage Grotesque (display, h1–h3).
  `--font-serif` and `--font-mono` are aliases; there is no separate serif or mono face.
- Base layer: h1–h3 get the display family, weight 600, tracking −0.028em, `wdth 102 / opsz 32`.
  Body carries `ss01`, `cv11`, antialiasing and `optimizeLegibility`.
- Utilities: `.text-display` (600, −0.032em, line-height 1.02, opsz 48), `.text-eyebrow`
  (0.6875rem, uppercase, muted), `.text-serial` (0.625rem, uppercase, tabular, muted).
- Measured scale: `text-sm` ×759, `text-xs` ×445, `text-xl` ×94, `text-2xl` ×61, `text-lg` ×29,
  `text-base` ×24, `text-3xl` ×20, `text-4xl` ×19, `text-5xl`/`6xl` ×7 each.
- Sub-scale literals in deliberate use: `text-[10px]` ×29, `text-[11px]` ×22, `text-[10.5px]` ×3,
  `text-[0.8rem]` ×4.
- Weights: `font-medium` for labels and navigation, `font-semibold` for titles, values and badges.
  There is no routine `font-bold`.

### Typography relationships as implemented

| Pair | Implementation |
| --- | --- |
| Page title → supporting text | `text-display text-3xl md:text-4xl` → `text-lg` muted (compact: `text-xl md:text-2xl` → `text-xs`) |
| Eyebrow → title | `mb-3` |
| Section heading → body | `text-base`/`text-xl` semibold → `text-sm` muted — **varies by route** |
| Card title → description | semibold `text-sm`/`text-base` → `text-xs` muted — **varies** |
| Label → control | `text-xs`/`text-sm font-medium`, label above the control |
| Title → metadata | title semibold, metadata `.text-serial` |
| Numeric value → label | large `tabular-nums` semibold value under a `.text-eyebrow` label |
| Button typography | `text-sm font-medium` (primitives) vs `text-sm font-semibold` (action pills) — intentional |
| Table header | `text-[10px] font-semibold uppercase tracking-[0.18em]` muted |
| Badge | `text-[10px] font-semibold uppercase tracking-[0.12em]` |
| Helper / error / success | `text-xs` muted / `text-xs text-destructive` / `text-xs text-sage` |

## 4. Spacing — CURRENT IMPLEMENTATION

Tailwind's 4px scale; no custom spacing scale is defined. Measured frequency:

- `gap-2` ×301, `gap-3` ×173, `gap-4` ×128, `gap-1.5` ×127, `gap-1` ×103, `gap-6` ×52
- `p-5` ×178, `p-3` ×68, `p-4` ×65, `p-6` ×47
- `space-y-2` ×50, `space-y-5` ×42, `space-y-4` ×35, `space-y-3` ×33, `space-y-6` ×16

### Spacing relationships as implemented

| Relationship | Implementation |
| --- | --- |
| Page edge → content | `px-4 md:px-8` in `max-w-[88rem]` (web); `px-3 sm:px-4 lg:px-8` in `max-w-[1500px]` (internal) |
| Header → content | Each shell owns its offset: marketplace `sticky top-4` (`top-6` landing), internal `pt-6 md:pt-8` |
| Title block → content | PageHeader `mb-12` + `mt-10` hairline; compact `mb-6`, no hairline |
| Title → supporting text | `mt-5 text-lg` default, `mt-2 text-xs` compact |
| Title icon → title | `gap-4`; icon tile 48/56px default, 36px compact |
| Card edge → content | `p-5` dominant; `p-6` on KPI cards; `p-3`/`p-4` in dense internal chrome |
| Card title → description | `mt-1`–`mt-2` — **varies** |
| Card content → action | `mt-4` or bottom-pinned in a justify-between column — **varies** |
| Label → control | `space-y-2` |
| Control → helper / validation | next line in the same stack, `text-xs` in muted / destructive / sage |
| Field → field | `gap-5` two-column, `space-y-4`/`space-y-5` single column — **varies** |
| Icon → text | `gap-1.5` in chips and badges; `gap-2` inside buttons (icon forced to 16px) |
| Table header → body | shared `px-5 py-4` cells, `border-b` hairline under the head |
| Row → row | `border-b border-hairline/60`, `last:border-0`, `hover:bg-panel/40` |
| Filters → results | filter rail beside results; Sheet/drawer below the breakpoint |
| List item → list item | `space-y-2`, `mt-3` from the preceding heading |
| Nav item → nav item | `gap-1.5`–`gap-2`; items are `rounded-full px-3/4 py-2 text-sm min-h-10` |
| Dialog / drawer sections | header (title + description) then body, actions right-aligned at `gap-2` |
| Empty state internals | `px-6 py-14`, `gap-4`, dashed `border-strong`, 48px icon tile, `text-display text-2xl` |

**FUTURE OPPORTUNITY:** normalizing the "varies" rows would re-space existing screens and is
explicitly out of scope.

## 5. Layout & responsive — CURRENT IMPLEMENTATION

- Web experience container: `max-w-[88rem]` (1408px), `px-4 md:px-8`, headers full width.
- Internal workspaces: `max-w-[1500px]` inside `InternalShell`; rail `w-[268px]` /
  `w-[80px]` collapsed / `w-[300px]` Sheet below `lg`.
- Member area: full-width header, `max-w-[88rem]` content, left icon rail with a connecting arc.
- Reading widths: `max-w-3xl` ×15, `max-w-2xl` ×14, `max-w-lg` ×14, `max-w-md` ×11.
- Landing hero: `min-h-[calc(100svh-5.25rem)]` with `items-center` — intentional one-off.
- Breakpoints: Tailwind defaults, no custom `screens`. Usage: `md` ×243 (primary), `sm` ×173,
  `lg` ×83, `xl` ×22, `2xl` ×2.
- Small screens: multi-column grids collapse to one column; nothing is hidden. `@media
  (max-width: 640px) { button, a { min-height: 44px } }` guarantees touch targets.
- Both shells open with a skip link (`sr-only focus:not-sr-only`).

## 6. Borders, radius, elevation, opacity — CURRENT IMPLEMENTATION

- Borders are 1px; `* { border-color: var(--color-border) }` sets the default. Emphasis uses
  `border-strong` or a ring, never a thicker border.
- Radius usage: `rounded-full` ×299 (pills), `rounded-2xl` ×294 (cards/tiles), `rounded-lg` ×170,
  `rounded-xl` ×95, `rounded-md` ×52, `rounded-sm` ×21, `rounded-3xl` ×17 (rails).
- Shadows are multi-layer navy-tinted stacks on cards and overlays only — no black shadows,
  no halos.
- Opacity is a tint modifier, not a dimmer: `/6`–`/12` icon tiles, `/20`–`/40` soft borders,
  `/60`–`/80` de-emphasised chrome text, `hover:bg-primary/90`, `disabled:opacity-50`.
  Status and metal badges render at full opacity everywhere, including unselected filter chips.
- One literal colour remains in a route: `bg-black/40` (plans mobile filter scrim).

## 7. Control sizing, icons, density — CURRENT IMPLEMENTATION

- Heights: `h-10` ×142 (dominant action), `h-11` ×69 (primary CTA), `h-9` ×46 (primitive default),
  `h-8` ×43 (dense internal).
- Icons: 16px (`h-4 w-4`) ×275 is the default; 12px ×34, 20px ×31, 24px ×4. Buttons force
  `[&_svg]:size-4`. KPI icon tile is 64px; PageHeader tiles 36px compact / 48–56px default.
- Density is experience-specific by design: web is airy, internal workspaces are dense.

## 8. Motion — CURRENT IMPLEMENTATION

- One easing curve everywhere: `cubic-bezier(0.2, 0.7, 0.2, 1)`.
- Durations: 200ms rail width, 300ms card hover, 320ms utility transitions, 700ms edge-sheen.
- Keyframes/classes: `animate-fade-rise` 500ms, `animate-hairline` 620ms, `animate-orbit` 22s,
  `animate-orbit-slow` 60s, `animate-drift` 6s, `animate-pulse-ring` 2.4s, `animate-shimmer` 2.4s.
- `CountUp` (`abox/motion.tsx`) animates KPI values.
- `prefers-reduced-motion` collapses all animation and transition durations to 0.01ms.

The landing orbit and KPI count-up are the known source of pixel noise in screenshot comparisons.

## 9. Utilities — CURRENT IMPLEMENTATION

`glass`, `ring-pill`, `ember-underline`, `divider-warm`, `card-brackets`, `edge-sheen`,
`noise-field`, `contour`, `aurora`, plus `ACTION_PILL` (8 canonical pill class strings in
`src/components/abox/action-pill.ts`, consumed by 64 call sites across 33 route files).

## 10. Component inventory — CURRENT IMPLEMENTATION

Consumer counts are import counts across `src/routes` and `src/components`, excluding each
component's own folder and the reference pages.

**ABox (in use):** InternalShell 89, StatusBadge 87, ACTION_PILL 33, MarketplaceShell 30,
PageHeader 23, DataTable 19, KpiCard 16, EmptyState 8, DownlineWizardStepper 8,
DownlineContextBanner 6, PlanCard 4, MemberShell 4, SaveContinueButton 3,
SuspendedMarketplaceNotice 2, ShoppingPathBar 2, ModuleTabs 2, MetalBadge 2, Logo 2,
QuoteEditPanel 1, ProductSwitcher 1, CarrierMark 1, motion 1.

**ABox (internal or unused):** OverflowText (used inside PlanCard), decor (used by shells and
EmptyState), ThemeToggle, PlaceholderScreen, and the two coexisting assistants
(`planai-assistant.tsx`, `plan-o-assistant.tsx`).

**UI primitives in application use:** Button 14, Card 6, Select 5, Tooltip 3, Input 3,
DropdownMenu 3, Sheet 2, Label 2, Dialog 2, and one consumer each for Textarea, Tabs, Slider,
Skeleton, RadioGroup, Progress, Popover, InputGroup, HoverCard, Command, ButtonGroup, Badge,
Spinner, Sonner.

**UI primitives installed with no application consumer yet:** Accordion, AlertDialog, Alert,
AspectRatio, Avatar, Breadcrumb, Calendar, Carousel, Chart, Checkbox, Collapsible, ContextMenu,
Drawer, Form, InputOTP, Menubar, NavigationMenu, Pagination, Resizable, ScrollArea, Separator,
Sidebar, Switch, Table, Toggle, ToggleGroup. This is inventory, not a defect.

## 11. State inventory — CURRENT IMPLEMENTATION

Default; hover (`hover:bg-*/90`, `hover:bg-accent`, card lift `-translate-y-0.5`, `card-brackets`,
`edge-sheen`); focus (`focus-visible:ring-1 ring-ring`, skip links); active/selected
(`aria-pressed`, active nav weight, `ring-2 ring-offset-2` where the pattern calls for it);
disabled (`opacity-50`, `pointer-events-none`); error (`aria-invalid` + `text-xs text-destructive`);
success (sage badge or `text-xs text-sage`); loading (Skeleton, Spinner, `animate-shimmer`,
SaveContinueButton saving state); empty (EmptyState, DataTable empty row); reduced motion.

## 12. Pattern inventory — CURRENT IMPLEMENTATION

Owned patterns: page frame (three shells), page title block (PageHeader), action pill row,
data table, KPI grid, empty state, wizard stepper, search control, toast (sonner mounted in
`src/routes/__root.tsx`, triggered from `cart-store`), loading/skeleton.

Unowned conventions: surface card markup (`rounded-2xl border bg-card p-5`, border token varies),
section heading sizes, filter rail, results toolbar, plan comparison layout.

**FUTURE OPPORTUNITY:** breadcrumbs, pagination, avatars and charts have primitives and tokens but
no consuming screen. Govern them when a feature needs them.

## 13. Safe centralization rules — CURRENT IMPLEMENTATION

1. Preservation beats centralization; if a refactor could change rendered output, document it.
2. Only exact-duplicate class strings may be lifted, and the constant must be byte-identical.
3. Never normalize a value because a neighbouring value looks tidier.
4. New tokens only when no equivalent production token exists.
5. Colour utilities are always token-backed.
6. Dark background → light foreground; light background → dark foreground.
7. `src/lib/design/*` and `src/components/design/*` are documentation only and must never be
   imported by application screens or business logic.
8. `/design-system` and `/design-guide` stay unlisted.

## 14. Intentional one-offs — do not normalize

Landing hero height; exchange filter chips without a selection ring; sub-scale type literals;
`max-w-[1500px]` internal width versus `max-w-[88rem]` web width; the `bg-black/40` scrim;
`font-semibold` action pills beside `font-medium` primitives; serif/mono font aliases.

## 15. FUTURE OPPORTUNITIES — none of this is implemented

| Opportunity | Why it was not done |
| --- | --- |
| Fold in ~40 near-miss pill class strings | Differ by margins, `disabled:`, `justify-center`, `py-3`; needs per-site visual verification |
| `SurfaceCard` component | Border token alternates between `border` and `hairline` |
| `SectionHeading` component | Would normalize existing heading sizes |
| Tokenize the `bg-black/40` scrim | Could shift the scrim's exact appearance |
| Consolidate the two assistants | Behavioural change, not styling |
| Normalize spacing relationships | Would re-space existing screens |
| Govern breadcrumbs / pagination / avatars / charts | No consuming feature yet |
| Machine-readable token export (W3C format) for Figma | Additive tooling, not yet built |

## 16. Experience architecture — CURRENT IMPLEMENTATION

One core system, one master guide, and per-experience guidance. Experiences never get their own
tokens or forked components.

- **Web / Marketing** — landing, ICHRA, support, shared links, auth. `max-w-[88rem]`, airy,
  display-led, MarketplaceShell in landing mode.
- **Shopping** — plans, detail, compare, cart, coverage, quote, apply, review, select. Same
  container, comparative density, PlanCard/MetalBadge/CarrierMark, compact PageHeader.
- **Dashboard / Admin** — agency, marketplace admin, JET platform, member area. InternalShell,
  `max-w-[1500px]`, dense controls, KPI + DataTable.
- **Future experiences** — reserved slot; must reuse or extend an existing shell.

## 17. Figma mapping blueprint — FUTURE OPPORTUNITY (nothing converted)

| Implementation | Figma |
| --- | --- |
| CSS custom property in `src/styles.css` | Variable in a Light/Dark collection |
| Typography utility + measured scale | Text style |
| `--radius-*` | Number variable bound to corner radius |
| `--shadow-*` | Effect style |
| `src/components/ui/*` | Component |
| `src/components/abox/*` | Component in the ABox library |
| Variant prop (Button variant/size, StatusBadge tone, MetalBadge tier, PageHeader variant, ACTION_PILL key) | Variant property |
| Interaction state | Boolean/enum component property |
| Recurring pattern | Layout template built from library components |
| Brand asset (AboxMark tones, CarrierMark) | Library asset / component set |
| Experience guide | Page or section in the library file |
| Breakpoints sm 640 / md 768 / lg 1024 / xl 1280 | Frame presets |

---

## Phase 2b — Spacing & layout audit

Reference modules added: `src/lib/design/spacing.ts`, `layout.ts`, `spatial-relationships.ts`,
plus layout sections appended to `governance.ts`. Documentation only — imported exclusively by
`/design-system` and `/design-guide`. No application file was modified in this phase.

### Spacing source of truth — CURRENT IMPLEMENTATION

There is **no spacing token in `src/styles.css`**. Spacing is expressed entirely with Tailwind
utility classes at each call site, on the default 0.25rem step scale. The audit tables are
therefore the record of what ships. Approximate occurrence counts across `src/routes` and
`src/components`:

| Value | Uses | Purpose |
| --- | --- | --- |
| `gap-2` | 316 | Default icon-to-text / control gap; also baked into `button.tsx` |
| `px-3` | 238 | Control interior padding |
| `gap-1` | 232 | Tightest inline grouping |
| `p-5` | 187 | De-facto ABox card interior |
| `gap-3` | 173 | Composite block grouping |
| `px-4` | 154 | Page gutter (mobile) and control padding |
| `gap-4` | 133 | Card-grid gutter |
| `py-2` | 129 | Control vertical padding |
| `px-5` | 102 | Table cell / emphasis control padding |
| `p-4` | 77 | Compact card interior |
| `p-3` | 70 | Dense strip padding |
| `gap-6` | 52 | Filter rail ↔ results, main ↔ sidebar |
| `p-6` | 48 | shadcn Card / dialog / sheet interior |
| `space-y-5` | 42 | Admin section stacking |
| `max-w-[88rem]` | 23 | Web-experience container ceiling |

### Containers — CURRENT IMPLEMENTATION

| Container | Ceiling | Gutters | Notes |
| --- | --- | --- | --- |
| Web experience | `max-w-[88rem]` (1408px) | `px-4 md:px-8` | 23 call sites, no owning component |
| Admin / internal shell | `max-w-[1500px]` | `px-4 md:px-8` content, `px-3 sm:px-4 lg:px-8` topbar | rail offset `lg:pl-[292px]` / `lg:pl-[104px]` |
| Floating glass header | none (full bleed) | `px-4 md:px-8` | `sticky top-4`, `top-6` on landing |
| Shopping split | inherits 88rem | `gap-6` | `aside w-64 shrink-0`, hidden below `lg` |
| Detail split | inherits 88rem | `gap-6` / `gap-5` | `lg:grid-cols-[1fr_320px]` and `[minmax(0,1fr)_360px]` |
| Member shell | `max-w-[88rem]` | `px-4 md:px-8`, `pt-10 md:pt-14` | nav rail flips orientation at `md` |
| Overlays | dialog `max-w-lg`, sheet `w-3/4 sm:max-w-sm` | `p-6`, `gap-4` | nav drawer overrides to `w-[300px] p-0` |

### Responsive — CURRENT IMPLEMENTATION

Breakpoint modifier counts: `md` 246, `sm` 173, `lg` 87, `xl` 22, `2xl` 2. Structural change is
concentrated at `md` (gutters, typography, orientation) and `lg` (rails, split collapse).
The dominant grid step is `sm:grid-cols-2` (53 uses). Overflow is always handled by horizontal
scrolling — columns are never dropped or reflowed.

### Density — CURRENT IMPLEMENTATION

Eight observed contextual modes: primitive (36px controls), marketplace (40px), card comfortable
(`p-5`), card spacious (`p-6`), card compact (`p-3`/`p-4`), table dense, navigation dense, and
marketing spacious. No density token exists; these are descriptions, not a system.

### Dimensions — CURRENT IMPLEMENTATION

`h-10` (142 uses) is the most common explicit control height, followed by `h-11` (69), `h-9` (46)
and `h-8` (43). Primitive buttons and inputs are `h-9`. `min-h-11` appears on 16 controls and
`min-h-10` on 3. Filter rail `w-64`; admin rail 292px / 104px; dialog 512px; drawer 384px.
Viewport-relative sizing uses `svh`/`dvh` deliberately: hero `min-h-[calc(100svh-5.25rem)]`,
shells `min-h-dvh`, assistant panels `h-[min(620px,calc(100dvh-7rem))]`.

### OBSERVED VARIATION

- Card interiors run `p-3` / `p-4` / `p-5` / `p-6` across comparable surfaces.
- Marketplace controls are 40px while shadcn primitives are 36px (deliberate, both ship).
- Detail splits use 320px and 360px summary columns, with `gap-6` and `gap-5`.
- Icon-to-text gap is both `gap-1.5` and `gap-2`.
- Two table densities: ABox `DataTable` `px-5 py-4` vs shadcn table head `h-10 px-2`.
- Marketing sections use two rhythms: `py-16 md:py-24` and `py-24 md:py-32`.
- Block stacking uses `space-y-4`, `space-y-5` and `space-y-6` for the same structural role.
- Admin gutters add an `sm` step the web experience does not have.
- Hero and editorial grids each tune their own fraction ratio (1.15fr/1fr, 1fr/1.1fr, 1.2fr/1fr).

None of these were normalized.

### GOVERNANCE RULE

- Spacing is governed by the existing implementation; the shipping value wins.
- Reuse a recurring spacing relationship before inventing a new one.
- Reuse a layout pattern only where one genuinely exists.
- Inconsistency is recorded as OBSERVED VARIATION, never silently normalized.
- Shared spacing and layout belong to the Core Design System; experience layouts are usage
  patterns of that system, not separate systems.
- The 1408px web ceiling and the 1500px admin ceiling are deliberately different — do not merge.
- Dashboard and admin surfaces are out of scope for web-experience width and spacing decisions.
- Reference modules stay documentation-only and unimported by application code.

### Unowned recurring areas — FUTURE OPPORTUNITY

Page container, shopping page vertical padding (`pt-4 pb-8 md:pt-6 md:pb-10`), card grid recipe,
results toolbar row, detail split with sticky summary, form field rhythm, and section
heading → supporting text spacing all recur with no component or token owner.

### Deferred — FUTURE OPPORTUNITY

Web-experience container component; card padding convergence; detail-split width alignment;
results toolbar component; icon-to-text gap convergence; table density convergence; a universal
touch-target floor; and a spacing/layout variable export for Figma. Each would change rendered
output or add tooling, so none were applied. All Phase 1 and Phase 2 deferred opportunities above
remain open and unchanged.

### Figma mapping — blueprint only

Spacing value → number variable; semantic relationship → documented spacing rule; container →
layout template (two templates: 1408px web, 1500px admin); grid → grid style plus pattern frame;
flex (`min-w-0 flex-1` / `shrink-0`) → Auto Layout Fill / Hug; breakpoint → frame preset;
control dimension → component size property; shells → layout templates; form, dashboard, shopping
and overlay structures → pattern frames. Nothing has been converted and no runtime code was
altered to ease future conversion.

---

## Phase 3 — Typography audit (reference layer only)

Documentation-only phase. No application screen, route, component, token or style
value was changed. Reference modules are consumed only by `/design-system` and
`/design-guide`.

### CURRENT IMPLEMENTATION

**Font architecture**
- `--font-sans` — `"Inter Tight", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
- `--font-display` — `"Bricolage Grotesque", "Inter Tight", …`
- `--font-serif` aliases the display stack; `--font-mono` aliases the sans stack. Neither
  is a real serif or monospace face.
- `h1, h2, h3, .font-display` — display family, weight 600, `letter-spacing -0.028em`,
  `font-variation-settings "wdth" 102, "opsz" 32`.
- `body` sets `font-feature-settings "ss01", "cv11"`.

**Utilities**
- `.text-display` (194) — display family, 600, `-0.032em`, line-height `1.02`, `opsz 48`. Size is never declared.
- `.text-eyebrow` (229) — 11px, weight 500, uppercase, muted.
- `.text-serial` (46) — 10px, uppercase, muted, tabular figures.
- `.ember-underline` — 2px primary hover/focus underline.

**Measured scale** — `text-sm` 779, `text-xs` 464, `text-xl` 94, `text-2xl` 61,
`text-lg` 29, `text-base` 29, `text-3xl` 20, `text-4xl` 19, `text-5xl` 7, `text-6xl` 7,
`text-7xl` 1. Sub-scale literals: 10px (34), 11px (23), 10.5px (3), 0.8rem (4), 9px (1).

**Weights** — `font-medium` 406, `font-semibold` 125, `font-normal` 10, `font-bold` 1.

**Colour** — `text-muted-foreground` 803, `text-primary` 276, `text-foreground` 159,
`text-destructive` 49, `text-sage` 44, `text-warning` 19. State is expressed through
colour and opacity only; size and weight never change between states.

**Data typography** — `tabular-nums` 90 uses on prices, totals, KPI values and identifiers.

**Accessibility** — `sr-only` 22, `aria-live` 3, 44px minimum touch target below 640px,
reduced-motion rule collapses transitions, `OverflowText` reveals truncated values on
hover and focus.

### OBSERVED VARIATION (recorded, not corrected)
- Section headings use `text-base`, `text-xl` and `text-2xl` for the same role.
- Card descriptions are `text-xs` or `text-sm` depending on whether the shadcn Card is used.
- Uppercase tracking uses 0.08em, 0.12em, 0.14em, 0.18em and `tracking-widest`.
- Table headers ship in two densities (shadcn `font-medium` vs ABox 10px uppercase).
- Action pills use `font-semibold` where the Button primitive uses `font-medium`.
- `text-sage` (44) and `text-success` (3) both express success.

### INSTALLED BUT UNUSED
- JetBrains Mono is requested in `__root.tsx` at weights 400/500 and referenced nowhere.
- `--font-serif` has no consumer.
- `.story-link` is referenced 89 times and defined in no stylesheet.
- `font-bold` is loaded for both families and used once (the 404 numeral).
- Breadcrumb, Pagination and Avatar primitives have no consumer.

### FUTURE OPPORTUNITY (not applied)
Bind or remove JetBrains Mono; define or remove `.story-link`; a `SectionHeading`
component; uppercase tracking convergence; named sub-scale tokens for 10px/11px;
raising the micro-type floor above 10px; success token convergence; tabular figures for
dates; a generated Figma text-style export. Each would change rendered output and is
therefore recorded only.

### FIGMA BLUEPRINT
Two families, three working weights, variable-font axis values on the display styles,
one text style per observed size/line-height/tracking triple, roles named after the code
(`display`, `eyebrow`, `serial`, `body`, `caption`, `badge`) rather than an h1/h2/h3
ladder the product does not use, desktop/mobile variants for responsive steps, and a
tabular-figure data style.

---

## Phase 4 — Iconography & assets audit (reference layer only)

Documentation-only phase. No production icon, mark, size, stroke, colour, route,
component or asset path was changed. Branding & White-Label and Marketplace Asset
Management were inspected as evidence and remain the runtime sources of truth.

### CURRENT IMPLEMENTATION — icon sources
- `lucide-react` — 149 distinct icons across 144 files. The de facto icon system.
- `@tabler/icons-react` — exactly one import, `IconDental`, wrapped by
  `src/components/icons/tooth-icon.tsx` and used as the Dental product icon.
- Inline SVG in three files only: `abox/logo.tsx` (brand mark),
  `abox/decor/index.tsx` (decorative primitives), `routes/auth.tsx`.
- No icon font, no CSS-drawn icon, no image-based icon.

### CURRENT IMPLEMENTATION — sizes
`h-4 w-4` 281, `h-3.5 w-3.5` 68, `h-3 w-3` 34, `h-5 w-5` 32, `size-4` 31, `h-8 w-8` 18,
`h-9 w-9` 14, `h-10/h-12/h-6/size-5` smaller. The Button primitive enforces
`[&_svg]:size-4 [&_svg]:shrink-0`. 36px is the shared control, icon-button and
brand-mark footprint.

### CURRENT IMPLEMENTATION — treatment
Stroke width is **never** overridden on a Lucide icon anywhere in the product; explicit
`strokeWidth` (0.75/1/1.25/1.75) exists only inside the decorative primitives. Icons are
outline-only, use `currentColor` by default, and where coloured always use a semantic
token — no hex or arbitrary colour appears on any icon. Opacity is not used to tone icons
down. No icon carries a shadow or filter.

### CURRENT IMPLEMENTATION — accessibility & states
`aria-hidden` 257 uses across 99 files; `aria-label` 90; `sr-only` 28. Dialog and Sheet
close buttons are the reference icon-only pattern. Focus lives on the wrapping control,
never the glyph. A global rule gives a 44px minimum touch target below 640px. State is
carried by colour, and sometimes by the wrapper's background or border — never by size,
stroke or glyph substitution.

### CURRENT IMPLEMENTATION — logos, marks & imagery
- `AboxMark` — inline SVG, four tones (`primary`/`sage`/`sidebar`/`foreground`), default
  36px, `aria-hidden`, every fill and stroke a CSS variable.
- `AboxWordmark` — text, not artwork; default and compact variants.
- `CarrierMark` — deterministic initial monograms on hue-derived discs, documented in its
  own source as illustrative placeholders rather than official carrier logos.
- `public/favicon.ico` — the only binary visual asset in the repository.
- **No raster imagery, no committed SVG file, no `<img>` element, no `src/assets`
  directory.** Runtime-uploaded LOGO/MARK/FAVICON/HERO assets exist only through
  Marketplace Asset Management (REQ-M04-BRD-004).

### OBSERVED VARIATION
- `h-4 w-4` and `size-4` express the same 16px size in two syntaxes.
- Four overlapping negative-status glyphs: `XCircle`, `Ban`, `ShieldAlert`, `PauseCircle`.
- `Settings` and `Settings2` both open configuration.
- `ShoppingCart` and `ShoppingBag` both signal commerce.
- The auth route holds inline decorative SVG outside the decor module.
- No single loading-icon convention.

### UNOWNED AREA
- Dual-purpose glyphs: `Eye` (Vision product + preview), `Shield` (Life product +
  security), `Users` (ICHRA product + people — intentional), `Activity` (Critical Illness
  + metrics).
- The circular icon container — roughly 104 similar `rounded-full` bordered wrappers with
  no owning component.
- Imagery conventions: because nothing renders an image, there is no alt-text,
  aspect-ratio or object-fit convention to document.

### INSTALLED BUT UNUSED / POSSIBLY UNUSED / OBSERVED DUPLICATE
- INSTALLED BUT UNUSED — `@fortawesome/free-solid-svg-icons` has no import in `src`.
- POSSIBLY UNUSED — nine decor primitives (`CornerCrop`, `TickerRule`, `MarqueeSerial`,
  `IsoStack`, `GlassPanel`, `HealthPulseShield`, `PolicyLines`, `FamilySilhouette`,
  `PlateFrame`) have no consumer found; only six are used, all on the landing page.
- OBSERVED DUPLICATE — `HairlineGrid`, `ConcentricArcs`, `DiagonalWeave` are compatibility
  aliases resolving to `DotField` and `OrbitalRings`.
- AVAILABLE BUT UNUSED — the `Avatar` primitive has no consuming screen.

### GOVERNANCE RULE
One icon library; a second is a design-system decision, not a per-screen one. Product
glyphs are set only in `src/lib/products.ts`. Icons never carry meaning alone. Icon colour
is always a token. Brand marks read tokens so white-label re-themes them without a new
asset. Branding & White-Label and Marketplace Asset Management own runtime assets — the
design system documents them and must never duplicate them. Carrier monograms are
placeholders; replacing them is an asset and licensing decision.

### FUTURE OPPORTUNITY (not applied)
Remove the unused Font Awesome dependency; consolidate the single Tabler import; converge
`h-4 w-4` with `size-4`; a shared `Icon` wrapper or icon-size tokens; an `IconButton` with
a required label; an `IconDisc` for the repeated circular wrapper; resolve the decor
aliases and unused primitives; a negative-status glyph mapping; define imagery conventions
before the first image ships; a generated Figma icon-library export.

### FIGMA BLUEPRINT
One shared icon library containing only the icons in use; size as a component property
(12/14/16/20, 16 default); colour inherited rather than baked in; state as a variant on
the parent control, not the icon; semantic categories as library pages; the product-icon
map as a documentation table; `AboxMark` as a brand component with tone variants;
`AboxWordmark` as a text style; `CarrierMark` explicitly labelled illustrative; decor as a
marketing-only illustration section; marketplace assets as documented placeholder slots.

---

## Phase 5 — Complete component inventory + reference governance

Documentation and reference-layer work only. No production component, route, style or behaviour
was changed. Every finding below is recorded, not fixed.

Reference modules added: `src/lib/design/components.ts`, `component-variants.ts`,
`component-states.ts`, `component-relationships.ts`. `types.ts` and `governance.ts` were extended
additively. Consumed only by `/design-system` and `/design-guide`.

### CURRENT IMPLEMENTATION — inventory

- **ABox business components** — 27 modules under `src/components/abox` plus the `decor` folder.
- **shadcn/UI primitives** — 49 modules under `src/components/ui`; 29 have a production consumer.
- **Icon components** — one, `src/components/icons/tooth-icon.tsx`, wrapping Tabler `IconDental`.
- **Shells** — three (Internal, Marketplace, Member) covering 123 routes.
- **Route-local kits** — M06 kit, M06 screen common, M08 kit, Lucie kit, Lucie-app kit,
  `src/components/ai-elements`. Real reusable components, owned by a module rather than by the
  design system. Recorded here for the first time.
- **Reference-only** — `src/components/design/reference-kit.tsx`, two consumers, both docs pages.

Taxonomy: fifteen categories from FOUNDATION PRIMITIVE through REFERENCE ONLY, one per component.

### CURRENT IMPLEMENTATION — consumers

Measured by import path, each component's own folder and both reference pages excluded.
StatusBadge 89, InternalShell 89, ACTION_PILL 35 files / 82 key references, MarketplaceShell 30,
PageHeader 25, Button 22, DataTable 20, KpiCard 18, EmptyState 10, PlanCard 6, Logo 5,
MetalBadge 4, MemberShell 4, CarrierMark 3.

Direct counts understate three components: `motion` (1 direct, reaching most screens through
PageHeader and KpiCard), `OverflowText` (0 route imports, reaching plan surfaces through PlanCard)
and `ToothIcon` (1 direct import, rendering on every dental product surface).

### CURRENT IMPLEMENTATION — variants, sizes, states

- Button — variant: outline 18, ghost 11, secondary 2, destructive 2, link 1; `default` is never
  written explicitly. Size: sm 12, icon 5, icon-sm 3, lg 1; `default` never passed explicitly.
- ACTION_PILL — primaryMd 21, outlineXs 11, primaryLg 10, outlineLg 8, outlineSmCard 7,
  outlineSm 7, outlineMd 6, primaryXs 4. The only export where every variant is in use.
- StatusBadge — primary 34, muted 31, warning 29, sage 27, info 16, destructive 4.
- MetalBadge — all six tiers render from live data, each a token fill with a paired foreground.
- State is expressed through colour, weight, background and border. No component changes its icon
  or its size to express a state, and only SaveContinueButton and PlanCard change content.

### OBSERVED VARIATION

- Two action ladders: Button is rounded-md and stops at h-10; ACTION_PILL is rounded-full and
  reaches h-11. `primaryLg` uses px-6 while `outlineLg` uses px-5.
- PlanCard uses eight boolean flags rather than a cva variant prop.
- CarrierMark and AboxMark take a numeric pixel size rather than a named scale.
- PlanCard's responsive strategy is prop-driven, not breakpoint-driven.
- DataTable scrolls horizontally below 640px rather than restacking.
- InternalShell's search control is desktop-only with no mobile equivalent.

### OBSERVED DUPLICATE / OBSERVED OVERLAP

- Tables — `abox/data-table.tsx`, `lucie/ui.tsx` Table, `lucie-app/ui.tsx` DataTable, plus the
  unused `ui/table.tsx`. Column APIs differ; none is a drop-in replacement.
- Page headers — ABox PageHeader, lucie PageHead, lucie-app PageHeader.
- Empty states — ABox EmptyState and lucie-app EmptyState.
- Assistants — `planai-assistant.tsx` and `plan-o-assistant.tsx`.
- Name collision — `ui/sheet.tsx` and `m06/kit.tsx` both export `Sheet` for different things.
- Status vocabulary — 15 distinct tone values across StatusBadge, m06 `Tone` and lucie-app
  `ChipTone` for one conceptual scale.
- Form fields — the ui primitives, m06 Field/TextInput/Picker and lucie-app Field; `ui/form.tsx`
  is installed and used by none of them.
- Actions — Button, ACTION_PILL and m06 `Btn`.
- Tabs — `ui/tabs.tsx` (panel switching) and `abox/module-tabs.tsx` (link navigation).

### INSTALLED BUT UNUSED / POSSIBLY UNUSED

- INSTALLED BUT UNUSED (high confidence) — 20 of 49 primitives: Accordion, AlertDialog,
  AspectRatio, Avatar, Breadcrumb, Calendar, Carousel, Chart, Collapsible, ContextMenu, Form,
  InputOTP, Menubar, NavigationMenu, Pagination, Resizable, ScrollArea, Sidebar, Table,
  ToggleGroup. Also `abox/theme-toggle.tsx` and `abox/placeholder-screen.tsx`.
- POSSIBLY UNUSED (medium confidence) — both assistants and the whole `ai-elements` tree, which is
  reachable only through PlanAiAssistant; several decor exports (CornerCrop, TickerRule,
  MarqueeSerial, IsoStack, GlassPanel, PolicyLines, FamilySilhouette).
- Unused variants — Badge secondary/destructive/outline; KpiCard warning tone.
- Nothing was deleted or uninstalled.

### UNOWNED AREA

Card surface; form fields; results toolbar and filter chip row; loading (no shared convention, no
announcement); the circular icon container (~104 occurrences); the status tone vocabulary;
product-wide bilingual strings.

### CURRENT IMPLEMENTATION — accessibility

Native semantics throughout, skip links in the shells, `focus-visible:ring-1 ring-ring`, real
`disabled` attributes, `aria-hidden` on decorative icons (257 occurrences across 99 files),
`aria-pressed` on toggles, `th scope="col"` and optional sr-only captions in DataTable, Radix
dialog semantics, 44px mobile touch targets, and reduced-motion collapsing every duration.

FUTURE OPPORTUNITY — clickable table rows are not keyboard reachable; loading states are not
announced; error text is not always associated with `aria-describedby`; there is no shared helper
enforcing an accessible name on icon-only controls.

### Cross-references

Typography (Phase 3) — Button `text-sm font-medium`, DataTable header
`text-[10px] uppercase tracking-[0.18em]`, body `text-sm`, prices `$#,##0.00` with tabular
numerals. Section headings and card descriptions still use several sizes per role.

Spacing (Phase 2) — Button `px-4 py-2`, table cells `px-5 py-4`, card padding dominated by `p-5`,
icon-to-text gap `gap-2` in Button vs `gap-1/1.5` in the pills, content width `max-w-[88rem]`.

Iconography (Phase 4) — `size-4` enforced inside Button, 16px the dominant size, stroke never
overridden, StatusBadge deliberately uses a dot rather than a glyph, EmptyState's 48px square
frame is the only non-circular icon container.

### Maturity

CENTRALIZED — page frame, commerce UI, brand marks, reference layer.
PARTIALLY CENTRALIZED — actions, feedback, the decor set.
SHARED — overlays, most primitives.
DUPLICATED — tables, page headers, empty states, status tags.
UNOWNED — card surface, form fields.
REPEATED — navigation beyond the shells.
EXPERIENCE-SPECIFIC and previously UNDOCUMENTED — the four module kits.

No scores, rankings or grades.

### FUTURE FIGMA ORGANIZATION

One core library — Foundations (tokens, typography, iconography, assets), Components (actions,
forms, display, containers, data, navigation, overlays, feedback, brand), Patterns (page
structures, forms, data, navigation, commerce), and contextual experience guidance for
Web/Marketing, Shopping/Marketplace, Dashboard/Admin and a reserved Future slot. Variant props map
to Figma variant properties under their existing names; repeated markup maps to pattern candidates
rather than automatic components; reference-kit is never mapped. This hierarchy does not exist in
production today.

### FUTURE OPPORTUNITY — deferred

Converge the four table implementations (high risk); converge the parallel page headers and empty
states (medium); unify the status tone vocabulary (high); give the card surface a component owner
(high); introduce a shared Field component (high); resolve the two assistants (medium); decide the
fate of the unused primitives and the ai-elements tree (low); keyboard path for clickable rows
(low); announce loading states (low); shared accessible-name helper for icon-only controls (low);
reconcile the Button and ACTION_PILL ladders (medium).

---

## Phase 6 — Architecture & Normalization Blueprint

**Status: documentation / reference layer only. The application was not changed.**

Phase 6 turns the Phase 1–5 audit into an architecture specification for a future
canonical ABox Design System and a future design library. It selects no winners,
fixes no inconsistencies, deletes no components and introduces no aliases into
production code.

### Label vocabulary

Every Phase 6 row carries exactly one label so the reader never has to guess:

`CURRENT IMPLEMENTATION` · `OBSERVED VARIATION` · `OBSERVED DUPLICATE` ·
`OBSERVED OVERLAP` · `INSTALLED BUT UNUSED` · `POSSIBLY UNUSED` · `UNOWNED AREA` ·
`GOVERNANCE RULE` · `FUTURE CANONICAL TARGET` · `FUTURE OPPORTUNITY` ·
`FUTURE FIGMA ORGANIZATION` · `FUTURE MIGRATION` · `FUTURE DECISION`

### CURRENT IMPLEMENTATION — what the architecture describes

- One unified ABox Core: Foundations → Components → Patterns → Experience Guidance.
- A seven-level hierarchy from token to screen, with one-directional dependencies.
- Three shell families covering 123 routes; six route-local kits alongside them.
- Brand marks are code-drawn Core foundations; tenant and marketplace assets remain
  runtime data owned by Branding & White-Label and Marketplace Asset Management.
- Steps 1–3 of change propagation work today: decision → shared owner → reference layer.

### FUTURE CANONICAL TARGET — what a later phase could aim for

- A canonical component map pairing each measured implementation with a target name,
  classification, variant/size/state set and anatomy.
- Anatomy, variant, state, accessibility, responsive and density blueprints, with
  production evidence and the proposal kept in separate columns.
- A naming convention that the current codebase already satisfies almost everywhere,
  so adoption forces no rename.
- A migration roadmap, lowest risk first, each phase carrying prerequisites,
  validation, rollback and visual-diff requirements.

### FUTURE DECISION — deliberately left open

Duplicate and overlap areas are recorded with consumers, differences, risks and the
decision required. No production winner has been chosen. Unowned areas — card
surface, form field, results toolbar, loading — still do not propagate automatically,
because nothing owns them.

### NOT DONE — stated plainly

- No Figma library, component, variable or style exists. Nothing was drawn, converted,
  exported or synchronised, and no DOM-to-Figma conversion is implied.
- The application has not been migrated to any abstraction this blueprint proposes.
- No inconsistency found in the audit was fixed.

### Reference-layer files added in Phase 6

`src/lib/design/architecture.ts`, `classification.ts`, `canonical-components.ts`,
`blueprints.ts`, `architecture-relationships.ts`, `normalization.ts`,
`brand-asset-architecture.ts`, `naming.ts`, `figma-library.ts`, plus Phase 6 types in
`types.ts` and Phase 6 governance/experience/change-propagation exports in
`governance.ts`.

Consumed only by `/design-system` (technical) and `/design-guide` (management). Both
remain unlisted and reachable by direct URL only.

---

## Phase 7 — Foundation Specification & Token Governance

Reference-only. No production token, component, screen or style was changed.

### CURRENT IMPLEMENTATION — what the audit measured

- **Colour.** Every colour is a semantic CSS variable in `src/styles.css`, defined in
  full for both `:root` and `.dark`, and each surface ships with a paired foreground.
  Measured usage: `text-muted-foreground` 716, `border-border` 497, `bg-card` 264,
  `text-primary` 268, `bg-primary` 229, `bg-background` 149, `border-hairline` 98,
  `bg-surface` 79, `ring-ring` 68, `text-sage` 41, `bg-sage` 28, `bg-warning` 24,
  `text-destructive` 47, `bg-destructive` 19, `bg-panel` 3, `bg-info` 1, `bg-success` 1.
- **Tier colour.** Six metal tiers with explicit foregrounds, identical in both themes,
  always full opacity. The most mature category in the system.
- **Status tone.** `StatusBadge` accepts six tones and derives the chip surface, text and
  border by mixing one `--tone` variable at 12%, 34% and 88%. Shared with `InternalShell`
  across 89 files.
- **Typography.** Inter Tight for text, Bricolage Grotesque for display, with serif and
  mono aliased to them; JetBrains Mono is declared but unused. Only three named roles
  exist — `text-display` 194, `text-eyebrow` 225, `text-serial` 16. Sizes are otherwise
  chosen per call site: `text-sm` 779, `font-medium` 406.
- **Spacing.** The Tailwind 4px ladder, used consistently: `gap-2` 316, `px-3` 238,
  `gap-1` 232, `p-5` 187, `gap-3` 173, `px-4` 154, `gap-4` 133.
- **Shape and elevation.** Seven radius steps, five named shadows. `rounded-full` 297,
  `rounded-2xl` 264, `rounded-lg` 170, `rounded-xl` 89, `rounded-md` 52; `shadow-card` 37,
  `shadow-glow` 11, `shadow-elevated` 9, `shadow-plate` 6, `shadow-drawer` 3.
- **Icons.** Lucide in 144 files with 149 distinct icons; Tabler imported once for
  `IconDental`; Font Awesome installed and unused. Sizes: 16px 274 + 28, 14px 68,
  12px 34, 20px 26.
- **Motion.** Six keyframes on one shared easing curve, `cubic-bezier(0.2, 0.7, 0.2, 1)`,
  plus a global `prefers-reduced-motion` rule.
- **Density.** `Button` and `Input` default to 36px; 40px is widespread at call sites
  (`h-10` 143, `h-9` 47). A 44px touch floor applies below 640px.
- **Layout.** 88rem centred container across web and shopping (23 occurrences);
  dashboards deliberately use shell-managed width.

### OBSERVED VARIATION — recorded, not corrected

- Two control heights, 36px and 40px, in active parallel use.
- Two class spellings for the same 16px icon size.
- Card padding at `p-4`, `p-5` and `p-6`; `gap-1.5` alongside `gap-2`.
- Heading and description sizes differ between comparable surfaces.
- Focus ring width and offset vary between primitives and hand-written call sites.
- Five compatibility aliases remain: `--brand-accent`, `--surface-1/2/3`,
  `--shadow-overlay`, `--ai`.
- `.story-link` is used 89 times with no definition found.

### FUTURE OPPORTUNITY — proposed, not implemented

- A primitive layer beneath the existing semantic variables.
- A named token system per category: `space/`, `radius/`, `icon/`, `motion/`, `type/`,
  `tier/`, `status/`, `control/`, `brand/`.
- Role-based text styles; named motion durations; declared density modes.
- A disabled state expressed by token rather than 50% opacity.

### Figma mapping constraints worth knowing up front

- Colours are authored in oklch; Figma stores hex/sRGB, so conversion is lossy at gamut
  edges. Code stays the source of truth and Figma mirrors it, one direction only.
- Multi-layer shadows are effect styles, never variables.
- `color-mix` tone derivation has no Figma equivalent — either six precomputed tone
  triplets per mode, or tone stays code-only. Open decision.
- Keyframe animation and the generated `CarrierMark` cannot be represented as library
  assets.

### Boundaries

Branding & White-Label and Marketplace Asset Management remain the runtime sources of
truth and were not read, mirrored or modified. Tier and status colours are recorded as
non-configurable; brand colour, logo and product name are the configurable set.

### NOT DONE

No duplicate was resolved, no value renamed, no alias removed, no unused dependency
deleted, no Figma asset created, and no application file outside the reference layer
touched.

### Reference-layer files added in Phase 7

`src/lib/design/foundation-model.ts`, `color-foundation.ts`, `color-roles.ts`,
`status-tone.ts`, `typography-foundation.ts`, `spacing-foundation.ts`,
`layout-foundation.ts`, `icon-motion-density.ts`, `component-roles.ts`,
`token-naming.ts`, `figma-variables.ts`, `foundation-accessibility.ts`,
`foundation-boundaries.ts`, `foundation-experience.ts`, `foundation-governance.ts`,
plus Phase 7 types in `types.ts` and five display tables in `reference-kit.tsx`.

Consumed only by `/design-system` and `/design-guide`, both still unlisted.

## Phase 8 — ABox Core canonical component library specification

Reference layer only. No production file was created, edited, renamed, deleted or
refactored. The application is pixel-, behavior-, route-, responsive-, branding- and
asset-identical to before this phase.

### CURRENT IMPLEMENTATION

The specification records, per component: where it lives, what it renders, its measured
consumers, its variants, states, sizes, dependencies, composition and accessibility as
they actually ship. Counts reused from Phase 5 include StatusBadge and InternalShell at
89 files, ACTION_PILL at 35 files and 82 references, MarketplaceShell 30, PageHeader 25,
Button 22, DataTable 20, KpiCard 18, EmptyState 10, Input and Select 7 each, Card 6,
PlanCard 6, Label 5, Skeleton and Dialog 4 each.

### OBSERVED DUPLICATE / OBSERVED OVERLAP

Ten parallel areas are recorded side by side in `spec-duplicates.ts` with no ordering,
ranking, preference or winner: tables, page headers, empty states, form fields, action
paths, assistants, the Sheet naming collision, the status and tone vocabularies, tabs,
and shells versus the sidebar primitive.

### UNOWNED AREA

Layout primitives, table toolbars, filter bars, results summaries, lists, list items,
data rows, search fields, loading states, error states, product cards, comparison layouts
and amount formatting have no component owner today; they are composed per screen.

### FUTURE DECISION

Nine questions are left explicitly open rather than answered: one size ladder or two,
canonical card padding, one focus treatment, token-based disabled state, disambiguating
the Sheet name, whether ai-elements becomes the shared assistant layer, retiring the
unused icon dependency and compatibility aliases, a media and image contract, and date
presentation rules. SplitButton, Notification and Image/Media are specified as FUTURE
DECISION because the codebase contains no evidence for them.

### FUTURE CANONICAL TARGET

Proposals only: one action surface absorbing the pill appearance, one field contract, one
semantic tone vocabulary, one data family, one header contract with standard and compact
forms, named layout primitives, a shell contract, and a commerce extension layer above
the core. None of these exists and nothing has moved towards them.

### Reference-layer files added in Phase 8

`src/lib/design/component-spec-types.ts`, `spec-anatomy.ts`, `spec-properties.ts`,
`spec-variants.ts`, `spec-states.ts`, `spec-sizing.ts`, `spec-icons.ts`,
`spec-components-{actions,forms,display,containers,data,navigation,overlays,feedback,brand,commerce,shell}.ts`,
`spec-registry.ts`, `spec-composition.ts`, `spec-dependencies.ts`, `spec-duplicates.ts`,
`spec-route-kits.ts`, `spec-experience.ts`, `spec-accessibility.ts`, `spec-content.ts`,
`spec-figma-library.ts`, `spec-figma-mapping.ts`, `spec-naming.ts`, `spec-governance.ts`,
plus three display helpers in `reference-kit.tsx` (`ComponentSpecCard`,
`SpecMatrixTable`, `DuplicateRegisterTable`).

`spec-registry.ts` is the single assembly point; both reference pages render from it and
no specification is restated inline. Both routes remain unlisted and direct-URL only.

## Phase 9 — Integrated system & dependency graph

CURRENT IMPLEMENTATION — the graph describes the product as it exists; no production file was changed in this phase.

- Model lives in `src/lib/design/graph-*.ts`, assembled by `graph-registry.ts`. Consumed only by `/design-system` and `/design-guide`.
- Eight layers: foundation → semantic role → component role → core component → compound → pattern → experience pattern → screen. Dependencies point one direction only.
- Edges are created only from code evidence (imports, measured consumer counts, route composition). Visual similarity never creates an edge.
- Every edge carries a status: CURRENT IMPLEMENTATION, OBSERVED VARIATION, OBSERVED DUPLICATE, OBSERVED OVERLAP, UNOWNED AREA, INSTALLED BUT UNUSED, GOVERNANCE RULE, FUTURE CANONICAL TARGET, FUTURE DECISION.
- Consumer counts reuse the Phase 5 measurements; reference-page usage is never counted as production consumption.
- Duplicates map several implementations to one conceptual role, with no winner, ranking or score.
- Route-local kits (M06, M06 common, M08, Lucie, Lucie-app, ai-elements) and the three shells are represented in place; nothing is merged or moved.
- Branding & White-Label and Marketplace Asset Management are modelled as runtime consumers of the foundation. Tenant values fill roles; they never become tokens.
- Change impact is derived by traversing edges, not written by hand. Where the graph cannot answer safely it reports `not-determinable`.

FUTURE OPPORTUNITY — resolving duplicates, assigning owners to unowned patterns, and any migration remain deferred and approval-dependent. Migration stages are conceptual; none has started and no first component is named. Nothing exists in Figma.

## Phase 10 — Pattern & experience architecture

Reference layer only. No production file was changed in this phase.

- Modules live in `src/lib/design/pattern-*.ts`, `experience-patterns.ts`, `experience-extensions.ts` and `screen-pattern-map.ts`, assembled by `pattern-registry.ts`. Consumed only by `/design-system` and `/design-guide`.
- CURRENT IMPLEMENTATION — pattern ids are the same `pat.*` ids the Phase 9 graph uses. Composition and screen traceability are computed by walking Phase 9 edges, not re-declared, and `REGISTRY_INTEGRITY` surfaces any id present in one phase and missing from the other.
- CURRENT IMPLEMENTATION — anatomy, states, responsive behaviour and density are transcribed from real files: `page-header.tsx`, `kpi-card.tsx`, `data-table.tsx`, `empty-state.tsx`, `downline-wizard-stepper.tsx`, the three shells, `index.tsx`, `plans.index.tsx`, `cart.tsx`, `member.settings.tsx`.
- OBSERVED VARIATION — stacking breakpoints differ: cart and hero stack at lg, member stacks at md. Card grids are three-column in marketing and single-column in plan results. Hero action pills sit at h-11 against the shared pill height.
- OBSERVED DUPLICATE — tabular presentation (DataTable, table primitive, route-local tables), field/form composition (primitive fields, M06 kit, M08 kit), assistant surfaces (PlanAI, Plan-O, ai-elements), and screen opening headers (PageHeader, marketing section headings, internal shell masthead).
- OBSERVED OVERLAP — the three shells implement navigation independently; that is deliberate per audience and recorded, not corrected.
- UNOWNED — marketing section headers have no owning component; loading and error presentation have no owner while the empty case does.
- INSTALLED BUT UNUSED — the pagination primitive has no production consumer, so pagination is recorded as FUTURE DECISION — insufficient implementation evidence.
- FUTURE DECISION — no duplicate has a winner, no density question is settled, no unowned pattern has been assigned an owner.
- FUTURE OPPORTUNITY — aligning stacking breakpoints, card padding, control heights or table densities would each change production output and remain out of scope until separately approved.
- FUTURE OPPORTUNITY — `pattern-figma.ts` is a blueprint. Nothing exists in Figma: no file, component, variant, style or asset has been created.
- Branding & White-Label and Marketplace Asset Management stay runtime-owned. Patterns consume those values; the design system does not take their configuration.
