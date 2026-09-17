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
