# PHASE 14 — Canonical Production Component Library Plan

**PHASE 14 IS PLAN ONLY. NO PRODUCTION APPLICATION CHANGES HAVE BEEN MADE.**

**The existing rendered application is the preservation baseline. Any future canonical production component must reproduce the existing visual, responsive, accessibility, interaction, navigation, content, branding, asset, and business-logic behavior exactly for every verified consumer.**

No visual cleanup, normalization, consolidation, duplicate removal, component replacement, "small" improvement, "equivalent" redesign, mass find-and-replace or big-bang migration is proposed or performed. Where a future canonical component could not reproduce a current implementation exactly, the incompatibility is documented and the current implementation is left untouched.

**Measurement method.** Consumer counts are importing files matched on `import … from "@/components/…"`, with `src/lib/design/**`, `src/components/design/**` and the two design routes excluded. Class and literal counts are occurrences across `src/routes` and `src/components` under the same exclusion. All counts were re-measured for this document. Propagation is asserted only where a real import exists — never because two pieces of UI look alike.

---

## SECTION 1 — CURRENT COMPONENT ARCHITECTURE RE-VALIDATION

### A. `src/components/ui/*` — 49 files

| Component | Export | Prod consumers | Experiences | Variants / sizes as written | Styling source | Foundation deps | Preservation risk |
|---|---|---|---|---|---|---|---|
| Button (`ui/button.tsx`) | `Button`, `buttonVariants`, `ButtonProps` | **22** | admin, marketing, member | variants `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes `default h-9 px-4 py-2`, `sm h-8 rounded-md px-3 text-xs`, `lg h-10 rounded-md px-8`, `icon h-9 w-9`, `icon-sm h-8 w-8`; `asChild` via Radix `Slot` | CVA + `cn` | `--primary`, `--destructive`, `--secondary`, `--accent`, `--input`, `--ring`, `--radius-md` | High — 22 files, 6 variants, 5 sizes |
| Input | `Input` | 7 | admin, marketing | none | class string | `--input`, `--ring` | Medium |
| Select | Radix set | 7 | admin | Radix parts | class strings | `--popover`, `--border` | Medium |
| Card | `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` | 6 | admin, member | none | class strings | `--card`, `--border`, radius | Medium |
| Skeleton | `Skeleton` | 4 | admin | none | class string | `--muted` | Low |
| Dialog | Radix set | 4 | admin | Radix parts | class strings | `--popover`, shadows | Medium |
| Tooltip | Radix set | 4 | shells, tables | side/align | class strings | `--popover` | Low |
| Tabs | Radix set | 3 | admin | Radix parts | class strings | `--muted`, `--background` | Low |
| Textarea | `Textarea` | 3 | admin, branding | none | class string | `--input`, `--ring` | Low |
| Sheet | Radix set | 3 | shells | `side` | class strings | `--background`, `--shadow-drawer` | Medium |
| DropdownMenu | Radix set | 3 | shells | Radix parts | class strings | `--popover` | Medium |
| Alert | `Alert`, `AlertTitle`, `AlertDescription` | 1 | admin | `default`, `destructive` | CVA | `--destructive` | Low |
| Badge | `Badge`, `badgeVariants` | 1 | admin | CVA variants | CVA | `--primary`, `--secondary` | Low |
| Checkbox / RadioGroup / Switch / Popover | Radix | 1 each | admin | Radix | class strings | `--primary`, `--input` | Low |
| Form | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` | see §15 | admin | — | class strings | `--destructive`, `--muted-foreground` | Medium |
| Sonner | `Toaster` | mounted in `src/routes/__root.tsx` | all | theme-aware | class strings | tokens | Low |
| Installed, zero production importers | `table.tsx`, `pagination.tsx`, `drawer.tsx`, `carousel.tsx`, `menubar.tsx`, `resizable.tsx`, `input-otp.tsx`, `context-menu.tsx`, `chart.tsx`, and others | 0 | — | — | — | — | None (inert) |

### B. `src/components/abox/*` — 27 modules

| Component | File | Export | Prod consumers | Experiences | Variants / states | Foundation deps | Risk |
|---|---|---|---|---|---|---|---|
| InternalShell | `internal-shell.tsx` (501 lines) | `InternalShell` | **89** | admin | workspace switcher, collapsible rail, mobile `Sheet` drawer, `glass` header pill `max-w-[1500px]`, content `max-w-[1500px]`, renders `PlanOAssistant` | `--sidebar*`, `glass`, shadows | Highest |
| StatusBadge | `status-badge.tsx` | `StatusBadge` | **87** | all | tones `sage`, `primary`, `warning`, `muted`, `destructive`, `info`; colour derived at runtime via `color-mix(in oklch, var(--tone) 88%/12%/34%, …)`; dot marker | status tokens | Highest |
| ACTION_PILL | `action-pill.ts` | `ACTION_PILL` | **33** | all | 8 strings: `primaryXs/Md/Lg`, `outlineXs/Sm/SmCard/Md/Lg` | `--primary`, `--border`, `--accent`, `--card` | High |
| MarketplaceShell | `marketplace-shell.tsx` (223) | `MarketplaceShell` | **30** | commerce | `variant: "landing" \| default` (sticky `top-4` vs `top-6`), floating pill nav written inline, optional product rail, footer `max-w-[88rem]` | `glass`, `--card` | High |
| PageHeader | `page-header.tsx` | `PageHeader` | **23** | all | `variant: "default" \| "compact"`; props `eyebrow`, `scrId`, `title`, `description`, `icon`, `actions`, `className`; wraps `FadeRise`; animated hairline | `--font-display`, `--surface`, `--border`, `animate-hairline` | High |
| DataTable | `data-table.tsx` | `DataTable`, `Column<T>` | **19** | admin | props `columns`, `rows`, `getRowId`, `caption`, `empty`, `onRowClick`, `ariaLabel`; header `text-[10px] uppercase tracking-[0.18em]`; cells `px-5 py-4`; `min-w-[640px]` scroll | `--hairline`, `--card` | High |
| KpiCard | `kpi-card.tsx` | `KpiCard` | **16** | admin | props `label`, `value`, `delta`, `icon`, `hint`, `tone` (default …); value `text-display text-5xl tabular-nums leading-none`, icon `h-8 w-8` | `--card`, `text-display`, `text-eyebrow` | Medium |
| EmptyState | `empty-state.tsx` | `EmptyState` | **8** | all | props `icon`, `title`, `body`, `action`; dashed `border-border-strong`, `bg-surface/60`, `DiagonalWeave` decor, icon plate `h-12 w-12 rounded-md` | `--surface`, `--border-strong`, `--hairline` | Medium |
| DownlineWizardStepper | `downline-wizard-stepper.tsx` | — | 8 | admin | flow steps | tokens | Low |
| DownlineContextBanner | `downline-context-banner.tsx` | — | 6 | admin | — | tokens | Low |
| PlanCard | `plan-card.tsx` | `PlanCard` | **4** | commerce | props `plan`, `onAdd`, `onCompareToggle`, `onSaveToggle`, `inCart`, `inCompare`, `saved`, `compact`, `horizontal`, `matchScore`, `subsidizedPrice`, `isBestMatch` | `--card`, metal tokens | Medium |
| MemberShell | `member-shell.tsx` (145) | `MemberShell` | **4** | member | `MEMBER_NAV` rail with centred connecting arc, header `sticky top-4`, content `max-w-[88rem]` | `--card`, `--hairline` | Medium |
| SaveContinueButton | `save-continue-button.tsx` | — | 3 | admin | — | `ACTION_PILL`-like | Low |
| Logo | `logo.tsx` | `AboxMark` **3**, `AboxWordmark` **0** | brand | code-drawn SVG | `--primary` | Low |
| MetalBadge | `metal-badge.tsx` | `MetalBadge` | **2** | commerce | six tiers via `[--tone]`/`[--tone-fg]`; geometry identical to StatusBadge | `--metal-*` | Low |
| ModuleTabs | `module-tabs.tsx` | `ModuleTabs`, `ModuleTab` | **2** | admin | `Link` tabs, `activeProps` highlight, `exact` option | `--hairline`, `--primary` | Low |
| ShoppingPathBar | `shopping-path-bar.tsx` | — | 2 | commerce | — | tokens | Low |
| SuspendedMarketplaceNotice | `suspended-marketplace-notice.tsx` | — | 2 | commerce | — | tokens | Low |
| CarrierMark | `carrier-mark.tsx` | `CarrierMark` | **1** | commerce | deterministic monogram | tokens | Low |
| ProductSwitcher | `product-switcher.tsx` | — | 1 | commerce | — | tokens | Low |
| QuoteEditPanel | `quote-edit-panel.tsx` | — | 1 | commerce | — | tokens | Low |
| PlanOAssistant | `plan-o-assistant.tsx` | `PlanOAssistant` | **1** (`internal-shell.tsx`) | admin | `surface="internal"` | tokens | Low |
| Motion | `motion.tsx` | `FadeRise` | via PageHeader + 1 route | all | respects reduced motion | `animate-fade-rise` | Low |
| Zero production importers | `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx` | — | **0** | — | — | — | None (inert) |

### C. `src/components/abox/decor/*`

`OrbitalRings`, `DotField`, `Aurora`, `CornerCrop`, `RadialTicks`, `TickerRule`, `MarqueeSerial`, `IsoStack`, `GlassPanel`, `HealthPulseShield`, `CoverageWeave`, `BlueprintGrid`, `PolicyLines`, `FamilySilhouette`, plus aliases `HairlineGrid = DotField`, `ConcentricArcs = OrbitalRings`, `DiagonalWeave = DotField`, and `PlateFrame`. Decorative system; `DiagonalWeave` is consumed by `EmptyState`.

### D. Shells — see §14.

### E–G. Route-local kits, route-local UI, repeated inline implementations — see §20, §17 and §12. 155 route files exist.

### H–S. Cross-cutting groups

- **Icons** — lucide-react throughout; Tabler only in `src/components/icons/tooth-icon.tsx` (0 production importers); inline SVG in `decor/`, `logo.tsx`, `carrier-mark.tsx`; Font Awesome installed, referenced only by reference modules.
- **Forms** — §15.
- **Tables / data** — §16.
- **Cards / surfaces** — §17.
- **Headers** — §18.
- **Navigation** — §18, `src/lib/nav-config.ts` (`WORKSPACES`, `MEMBER_NAV`, `NavItem`, `NavSection`, `WorkspaceConfig`, `WorkspaceKey`).
- **Action groups** — `ACTION_PILL` (33) + `ui/button.tsx` (22) + `m06 Btn` + inline `<button>`.
- **Status / tier** — `StatusBadge` (87), `MetalBadge` (2), `m06 StatusTag`, `m08 OutcomeTag`, `lucie Tag`/`PostureTag`, `lucie-app StatusChip`, `ui/badge.tsx` (1).
- **Loading / empty / error** — `ui/skeleton.tsx` (4), `EmptyState` (8), `m06 StateBlock`/`QueryBlock`, `m08 LoadingRows`/`EmptyRows`/`Denied`, `ai-elements/shimmer.tsx`, `src/lib/error-page.ts`.
- **Overlays** — `ui/dialog.tsx` (4), `ui/sheet.tsx` (3), `ui/popover.tsx` (1), `ui/dropdown-menu.tsx` (3), `m06 Sheet`; `ui/drawer.tsx` unused.
- **Assistants** — `PlanOAssistant` (1), `PlanAIAssistant` (0), `ai-elements/*`.
- **Commerce** — `PlanCard` (4), `MetalBadge` (2), `ShoppingPathBar` (2), `CarrierMark` (1), `ProductSwitcher` (1), `QuoteEditPanel` (1), inline cart/summary in `cart.tsx` and `quote.tsx`.

---

## SECTION 2 — CANONICAL COMPONENT DEFINITION

For this codebase, a component is **canonical** only when all of the following hold:

1. **Real production source** — a single production file owns the implementation.
2. **Real production consumers** — verified by import, excluding the reference layer.
3. **Stable responsibility** — one clearly bounded job.
4. **Explicit API** — typed props that every consumer uses.
5. **Documented variants** — enumerated, each matching a current rendered output.
6. **Documented states** — every state the component can express.
7. **Documented sizing and density** — exact current dimensions.
8. **Documented accessibility** — roles, ARIA, keyboard, focus.
9. **Documented responsive behaviour** — per breakpoint.
10. **Declared foundation dependencies** — which tokens it consumes.
11. **Composition rules** — what it may contain and what it may not.
12. **Verified propagation path** — source → consumers, proven by imports.
13. **Regression contract and ownership** — what must be compared, and who approves changes.

A component is **not** canonical merely because it is visually common, lives in `src/components/ui` or `src/components/abox`, appears frequently, looks reusable, is documented in `src/lib/design`, or appears on `/design-system` or `/design-guide`.

---

## SECTION 3 — CANONICAL COMPONENT CANDIDATE REGISTER

### Actions

**Button** — `ui/button.tsx`, 22 consumers, 6 variants × 5 sizes, Radix `Slot` composition, focus ring `ring-1 ring-ring`, disabled `opacity-50 pointer-events-none`, icon rule `[&_svg]:size-4`. Competing implementations for the same responsibility: `ACTION_PILL` (33) and `m06 Btn`. Foundation deps: primary/destructive/secondary/accent/input/ring, `--radius-md`. Experience differences: pills dominate marketing and commerce; the primitive dominates admin forms. **Status: MULTIPLE CURRENT IMPLEMENTATIONS.** Future source: NOT YET DECIDED.

**ACTION_PILL** — `abox/action-pill.ts`, 33 consumers, 8 exact strings, no competing owner for the pill treatment itself. Technically possible as a canonical component. Required decision: constants vs component API. **Status: ALREADY SHARED PRODUCTION COMPONENT (as constants) / CANONICALIZATION CANDIDATE (as component).** Future source: `src/components/abox/action-pill.ts`.

**Icon-only action** — expressed as `ui/button.tsx` `size="icon"`/`icon-sm` and as inline `h-8`/`h-9` squares in shells and tables. **Status: NEEDS EVIDENCE.**

**Action group** — inline `flex flex-wrap items-center gap-2` clusters (e.g. `PageHeader` actions slot). **Status: NEEDS DESIGN DECISION.**

### Forms

**Input / Textarea / Select** — `ui/input.tsx` 7, `ui/textarea.tsx` 3, `ui/select.tsx` 7, versus `m06` `TextInput`/`TextArea`/`Picker`, `lucie` `Select`/`Search`, and raw elements in 15+ routes. **Status: MULTIPLE CURRENT IMPLEMENTATIONS.**

**Checkbox / RadioGroup / Switch** — 1 consumer each; most toggles in routes are custom `aria-pressed` buttons. **Status: NEEDS EVIDENCE.**

**Form field / validation presentation** — `ui/form.tsx` (react-hook-form + zod) versus `m06 Field` versus ad-hoc label/input pairs. **Status: MULTIPLE CURRENT IMPLEMENTATIONS / BLOCKED BY DUPLICATE.**

### Display

**Card / Surface** — `ui/card.tsx` 6 versus the inline surface pattern (15 / 13 / 10 / 10 / 10 in the top five route files) plus `DefinitionCard`, `BlockerCard`. **Status: BLOCKED BY DUPLICATE.**

**StatusBadge** — `abox/status-badge.tsx`, 87 consumers, 6 tones, runtime `color-mix`. Competing tone systems exist in four kits and `ui/badge.tsx`. Shell responsibility has no competing owner; tone vocabulary does. **Status: ALREADY SHARED PRODUCTION COMPONENT (shell) / BLOCKED BY DUPLICATE (tone vocabulary).**

**Tier / metal display** — `abox/metal-badge.tsx`, 2 consumers, 6 tiers, no competing implementation. **Status: ALREADY SHARED PRODUCTION COMPONENT.**

**KPI** — `abox/kpi-card.tsx` 16, versus `lucie Stat` and `lucie-app StatCard`. **Status: MULTIPLE CURRENT IMPLEMENTATIONS.**

**Avatar / icon container** — PageHeader plate (`h-9 w-9` / `h-12 w-12 md:h-14 md:w-14`, `rounded-2xl`), EmptyState plate (`h-12 w-12`, `rounded-md`), shell and route plates; `ui/avatar.tsx` unused in production. **Status: NEEDS DESIGN DECISION.**

**Typography roles** — `text-display`, `text-eyebrow`, `text-serial` utilities; no component owner. **Status: NOT APPLICABLE (foundation, see Phase 13).**

### Data

**Table / DataTable** — `abox/data-table.tsx` 19 with a real typed API; `lucie Table`; five raw `<table>` routes; `ui/table.tsx` unused. **Status: MULTIPLE CURRENT IMPLEMENTATIONS.**

**Table toolbar / filter controls** — `lucie Toolbar`/`Search`/`Select`, `m06 FilterBar`/`TextFilter`/`PersonPicker`, the inline filter rail in `plans.index.tsx`. **Status: MULTIPLE CURRENT IMPLEMENTATIONS.**

**Pagination** — `ui/pagination.tsx` installed, zero consumers; no production pagination behaviour exists. **Status: NOT APPLICABLE / DEFERRED.**

### Navigation

**PageHeader** — `abox/page-header.tsx` 23 (two variants) versus `lucie PageHead`, `lucie-app PageHeader`, inline `text-display` headings. **Status: MULTIPLE CURRENT IMPLEMENTATIONS.**

**Section header** — `m08 M08Section`, `lucie Section`, `lucie-app Section`, inline titles. **Status: NEEDS DESIGN DECISION.**

**Tabs** — `ui/tabs.tsx` 3 (panel switching) and `abox/module-tabs.tsx` 2 (route links). Different responsibilities. **Status: EXPERIENCE-SPECIFIC — two distinct components.**

**Breadcrumbs** — `ui/breadcrumb.tsx` present with no production importers. **Status: NOT APPLICABLE.**

**Shell navigation** — `nav-config.ts` drives InternalShell and MemberShell; MarketplaceShell nav is inline JSX. **Status: BLOCKED BY EXPERIENCE VARIATION.**

### Overlays

**Dialog** 4, **Sheet** 3, **Popover** 1, **DropdownMenu** 3, plus `m06 Sheet`; `ui/drawer.tsx` unused. **Status: Dialog/Popover/DropdownMenu ALREADY SHARED PRODUCTION COMPONENT; Sheet BLOCKED BY DUPLICATE.**

### Feedback

**Alert** 1; **toast** via `ui/sonner.tsx` mounted in `__root.tsx` plus `m06 Toast`; **EmptyState** 8 plus kit empties; **Loading/Skeleton** 4 plus `m08 LoadingRows`, `m06 QueryBlock`, `ai-elements/shimmer.tsx`; **error presentation** via `src/lib/error-page.ts` and `m08 Denied`. **Status: MULTIPLE CURRENT IMPLEMENTATIONS** for empty, loading and notification; **NEEDS EVIDENCE** for Alert.

### Commerce

**Plan display** — `PlanCard` 4, twelve props, compact/horizontal/best-match variants. **Status: ALREADY SHARED PRODUCTION COMPONENT (commerce-scoped).**
**Plan comparison** — route-local in the compare route. **Status: ROUTE-SPECIFIC.**
**Cart summary** — inline in `cart.tsx`/`quote.tsx` plus `QuoteEditPanel` (1). **Status: NEEDS PRODUCT DECISION.**
**Price / quantity presentation** — `src/lib/format.ts` plus inline `tabular-nums`. **Status: NEEDS EVIDENCE.**

### Brand

**Logo / wordmark / mark** — `abox/logo.tsx`: `AboxMark` 3 consumers, `AboxWordmark` 0. Favicon is `public/favicon.ico`, owned by hosting/branding, not a component. **Status: ALREADY SHARED PRODUCTION COMPONENT (mark) / NOT APPLICABLE (favicon).**

### Shell

**InternalShell** 89, **MarketplaceShell** 30, **MemberShell** 4 — see §14. **Status: EXPERIENCE-SPECIFIC, all three.**

No candidate is ranked or scored. A single existing source is named only where no competing implementation holds the same responsibility.

---

## SECTION 4 — CURRENT COMPONENT VS FUTURE CANONICAL SOURCE

| Candidate | Current production source | Future canonical source | Current consumers | Future verified consumers | Non-consumers | Local overrides | Experience extensions | Migration requirement | Preservation risk |
|---|---|---|---|---|---|---|---|---|---|
| Button | `ui/button.tsx` | NOT YET DECIDED | 22 | same, unless D-decisions widen it | pill users, `m06 Btn`, inline buttons | `className` at call sites | pill treatment | none until decided | High |
| Action pill | `abox/action-pill.ts` | same existing source | 33 | 33 | `ui/button.tsx` users | appended `className` | none | constants→component only if approved | High |
| Status badge shell | `abox/status-badge.tsx` | same existing source | 87 | 87 | kit tags, `ui/badge.tsx` | `className` | tone vocabularies | none | Highest |
| Metal badge | `abox/metal-badge.tsx` | same existing source | 2 | 2 | — | `className` | commerce only | none | Low |
| Page header | `abox/page-header.tsx` | NOT YET DECIDED | 23 | 23 | Lucie headers, inline headings | `className`, `actions` | Lucie kits | none until decided | High |
| Card / surface | `ui/card.tsx` + inline | NOT YET DECIDED | 6 + inline | unknown | inline instances | per-instance padding | all four | per-instance capture first | High |
| Form field | `ui/form.tsx`, `m06 Field`, raw | NOT YET DECIDED | mixed | unknown | raw element routes | many | m06 | per-field capture | High |
| DataTable | `abox/data-table.tsx` | same existing source | 19 | 19 | `lucie Table`, raw tables | `className` per column | Lucie | none | High |
| KPI | `abox/kpi-card.tsx` | NOT YET DECIDED | 16 | 16 | `Stat`, `StatCard` | `className` | Lucie | none until decided | Medium |
| Empty state | `abox/empty-state.tsx` | NOT YET DECIDED | 8 | 8 | kit empties | `className`, `action` | m06/m08 | none until decided | Medium |
| Loading | `ui/skeleton.tsx` | NOT YET DECIDED | 4 | 4 | kit loaders, shimmer | — | m06/m08 | none until decided | Medium |
| Dialog | `ui/dialog.tsx` | same existing source | 4 | 4 | `m06 Sheet` | — | m06 | none | Medium |
| Sheet | `ui/sheet.tsx` | NOT YET DECIDED | 3 | 3 | `m06 Sheet` | — | m06 | none until decided | Medium |
| Tooltip / Popover / DropdownMenu | `ui/*` | same existing sources | 4 / 1 / 3 | same | — | — | — | none | Low |
| Tabs (panel) | `ui/tabs.tsx` | same existing source | 3 | 3 | `ModuleTabs` | — | — | none | Low |
| Module tabs (links) | `abox/module-tabs.tsx` | same existing source | 2 | 2 | `ui/tabs.tsx` | — | admin | none | Low |
| Plan card | `abox/plan-card.tsx` | same existing source | 4 | 4 | — | props | commerce | none | Medium |
| Cart summary | inline `cart.tsx`, `quote.tsx`, `QuoteEditPanel` | FUTURE FILE — NOT CREATED | 1 + inline | unknown | — | inline | commerce | extraction decision | Medium |
| Icon container | PageHeader / EmptyState / shells | FUTURE FILE — NOT CREATED | 31+ | unknown | route plates | geometry differs | all | geometry capture | Medium |
| Brand mark | `abox/logo.tsx` | same existing source | 3 | 3 | — | `className` | all | none | Low |
| Shells | three files | same existing sources | 89 / 30 / 4 | same | each other | — | per experience | none | High |

No future file is created.

---

## SECTION 5 — COMPONENT API & CONTRACT BLUEPRINT

Only candidates whose current code supports a contract are blueprinted. Everything the code does not settle is marked **FUTURE DECISION**.

### ACTION_PILL → future pill component (if approved)
Responsibility: the rounded action treatment, nothing else. Anatomy: optional leading icon + label. Required props: children. Optional: `variant` (the 8 current names), `className`, `asChild` — FUTURE DECISION. Variants: `primaryXs/Md/Lg`, `outlineXs/Sm/SmCard/Md/Lg`. Sizes: `h-8` / `h-9` / `h-10` / `h-11` fixed per variant. Icon behaviour: current call sites pass icons as children; no size rule exists — FUTURE DECISION. Typography: `text-xs` (xs) / `text-sm` (others), `font-medium`. Spacing: `gap-1` / `gap-1.5`, `px-3/4/5/6`. Colour: `--primary`, `--primary-foreground`, `--border`, `--accent`, `--card`. Shape: `rounded-full`, no shadow. Responsive: none of its own; the global 44px min-height applies below 640px. Accessibility: renders as the element the call site chooses (`Link` or `button`) — the component must not force one. Composition: may contain icon + text only. Prohibited: owning routing, business logic or data.

### StatusBadge (shell)
Responsibility: render a tone-coloured status pill with a dot. Anatomy: dot + label. Required: `children`. Optional: `tone` (default `muted`), `className`. Tones: `sage`, `primary`, `warning`, `muted`, `destructive`, `info`. Colour contract: exactly `color-mix(in oklch, var(--tone) 88%, var(--foreground))` text, `12%` over `--card` background, `34%` border. Typography: `text-[10px] font-semibold uppercase tracking-[0.12em]`. Shape: `rounded-full px-2.5 py-0.5`. Accessibility: the dot is `aria-hidden`; the label carries meaning. Prohibited: owning tone vocabulary — the mapping from domain value to tone stays with the module.

### PageHeader
Responsibility: page opening. Anatomy: eyebrow/`scrId` → icon plate → title → description → actions → animated hairline. Props as written: `eyebrow`, `scrId`, `title`, `description`, `icon`, `actions`, `className`, `variant`. Variants: `default` (`mb-12`, title `text-display text-3xl md:text-4xl leading-[0.98]`, plate `h-12 w-12 md:h-14 md:w-14`, hairline) and `compact` (`mb-6`, title `text-xl md:text-2xl`, plate `h-9 w-9`, no eyebrow, no hairline). Motion: wrapped in `FadeRise`; hairline uses `animate-hairline`. Accessibility: renders `<header>` with `<h1>`; icon `aria-hidden`. Prohibited: navigation and data fetching.

### DataTable
Responsibility: tabular presentation. API as written: `Column<T>` = `{ key, header, cell, className?, align? }`; props `columns`, `rows`, `getRowId`, `caption`, `empty`, `onRowClick`, `ariaLabel`. Sizing: header `px-5 py-4 text-[10px] uppercase tracking-[0.18em]`; container `rounded-lg border border-hairline bg-card`; `min-w-[640px]` with horizontal scroll. States: hover row treatment, empty slot. Sorting and selection: **not implemented today — FUTURE DECISION**. Accessibility: `<caption class="sr-only">`, `scope="col"`, `aria-label`. Prohibited: fetching, sorting logic, pagination.

### KpiCard
Props as written: `label`, `value`, `delta`, `icon`, `hint`, `tone`. Value typography `text-display text-5xl tabular-nums leading-none`; label `text-eyebrow`; icon `h-8 w-8`; delta row `mt-4 text-xs`. Tones beyond `default`: enumerate before any migration — FUTURE DECISION.

### EmptyState
Props as written: `icon`, `title`, `body`, `action`, `className`. Anatomy: dashed container + `DiagonalWeave` decor + icon plate + title (`text-display text-2xl`) + body (`max-w-md text-sm`) + action slot. Prohibited: owning the empty *condition*.

### MetalBadge
Props: `tier`, `className`. Six tiers via paired `--tone`/`--tone-fg`. Fallback: unknown tier renders Silver. Geometry identical to StatusBadge but with a solid fill and no dot.

### ModuleTabs
Props: `tabs: ModuleTab[]` where `ModuleTab = { to, label, hint?, exact? }`. Renders `<nav aria-label="Module sections">` with `Link` and `activeProps`. Prohibited: panel switching — that is `ui/tabs.tsx`.

### Button
Contract already exists in `ui/button.tsx` (6 variants, 5 sizes, `asChild`). A canonical contract beyond that is **FUTURE DECISION** because the pill and `m06 Btn` treatments are unresolved.

### Card, Form field, Cart summary, Icon container, Section header
**FUTURE DECISION** — no current code settles a single contract.

---

## SECTION 6 — VARIANT ARCHITECTURE

| Concept | Variants present today | Classification |
|---|---|---|
| Button | `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes `default`, `sm`, `lg`, `icon`, `icon-sm` | Current production variants |
| Action pill | 8 named strings across 2 tones × 4 heights (+ a card-surface outline) | Current production variants |
| StatusBadge | 6 tones | Current production variants |
| Metal tiers | 6 tiers with paired foregrounds | Current production variants |
| PageHeader | `default`, `compact` | Current production variants |
| MarketplaceShell | `landing` vs default (`top-6` vs `top-4`) | Current production variant |
| PlanCard | `compact`, `horizontal`, `isBestMatch`, `inCart`, `inCompare`, `saved` | Current production variants |
| Alert / Badge | CVA variants in `ui/*` | Current production variants |
| Card padding | `p-3` 80, `p-4` 71, `p-5` 208, `p-6` 47 | Observed variation |
| Control density | `h-8` 40, `h-9` 43, `h-10` 139, `h-11` 66, `h-12` 7 | Observed variation |
| Table density | `DataTable` `px-5 py-4` vs `lucie Table` vs raw tables | Observed variation |
| Kit tags | `m06 StatusTag`, `m08 OutcomeTag`, `lucie Tag`, `lucie-app StatusChip` | Experience extensions |
| Exchange filter chips with suppressed selection ring | `plans.index.tsx` | Route-specific exception |
| Shared variant naming across components | — | FUTURE DECISION |

Visually similar variants are not merged, and no winner is chosen between competing implementations.

---

## SECTION 7 — STATE ARCHITECTURE

Current behaviour, to be reproduced exactly.

| State | Where it exists today | What changes |
|---|---|---|
| default | all | base classes |
| hover | Button (`hover:bg-primary/90`, `hover:bg-accent`), pills (`hover:bg-primary/90`, `hover:bg-accent`), ModuleTabs (`hover:bg-accent`), DataTable rows | background, sometimes text colour |
| focus | Button `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`; Radix primitives their own | ring, outline |
| active | Radix `data-state` on tabs, dropdowns, dialogs | background, ARIA |
| selected | `ModuleTabs` `activeProps` (`bg-primary/10 text-foreground border-primary/30`); filter chips via `aria-pressed`; exchange chips deliberately render **no visible ring** | background, border, text; ARIA only for exchange chips |
| disabled | Button `disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed` | opacity, pointer events, cursor |
| loading | `ui/skeleton.tsx`, `m08 LoadingRows`, `m06 QueryBlock`, `animate-shimmer`, `animate-pulse` | content replaced, animation |
| error | `ui/form.tsx` `FormMessage`, `m08 BlockerCard`, `src/lib/error-page.ts` | colour, extra node, `aria-describedby` |
| success / warning | StatusBadge tones, `--success`, `--warning` | colour only |
| expanded / collapsed | InternalShell rail, Radix collapsibles | width, icon rotation, `aria-expanded` |
| checked / unchecked | `ui/checkbox.tsx`, `ui/switch.tsx`, `ui/radio-group.tsx` | background, indicator, `data-state` |
| validation | `ui/form.tsx` only | message node, ARIA wiring |
| empty | `EmptyState`, `DataTable.empty`, `m08 EmptyRows` | content swap |

No state behaviour is changed. A future component must reproduce each consumer's current state behaviour exactly, including the intentionally ring-less exchange filters.

---

## SECTION 8 — SIZE & DENSITY ARCHITECTURE

Measured: `h-8` 40 (32px), `h-9` 43 (36px), `h-10` 139 (40px), `h-11` 66 (44px), `h-12` 7 (48px). Global rule at `src/styles.css` L264–266: below 640px, `button, a { min-height: 44px }` — so several nominal heights already render as 44px on mobile and any future component must reproduce that interaction.

| Family | Values in use | Where | Would a future component need… |
|---|---|---|---|
| Pills | 32 / 36 / 40 / 44px | `ACTION_PILL` | size variants (already expressed) |
| Button primitive | 36 default / 32 sm / 40 lg / 36 icon / 32 icon-sm | `ui/button.tsx` | size variants (already expressed) |
| Kit buttons | `m06 Btn` | m06 screens | experience variant |
| Inputs | primitive + kit + raw | mixed | FUTURE DECISION |
| Badges | `py-0.5` micro | StatusBadge, MetalBadge | fixed dimension |
| Icon plates | 36 / 48 / 56px | PageHeader, EmptyState | component-specific dimensions |
| Table rows | `py-4` (DataTable) vs Lucie vs raw | tables | density variant |
| Compact toolbars | `h-8`, `text-xs`, `gap-1` | filters, toolbars | density variant |

No standard size is selected. Exact current dimensions are preserved.

---

## SECTION 9 — COMPONENT PROPAGATION MODEL

```text
CANONICAL SOURCE -> COMPONENT API -> VERIFIED CONSUMERS -> PATTERN -> EXPERIENCE -> SCREEN
```

**ACTION_PILL** — import `@/components/abox/action-pill`; usage `className={ACTION_PILL.primaryMd}` on `Link`/`button`; variant = key chosen per call site; local override = appended classes; foundation deps `--primary`, `--border`, `--accent`, `--card`; responsive = global 44px rule; states = hover only; regression = every pill at three widths plus hover/focus. Verified consumers: 33 files. Non-consumers: `ui/button.tsx` users, `m06 Btn`, inline buttons.

**StatusBadge** — import `@/components/abox/status-badge`; usage `<StatusBadge tone="…">`; override via `className`; foundation deps status tokens plus `--card`/`--foreground` through `color-mix`; regression = all six tones in both themes plus the dot. Verified consumers: 87. Non-consumers: four kit tag systems and `ui/badge.tsx`.

**PageHeader** — import `@/components/abox/page-header`; usage with `title` and optional `eyebrow`/`icon`/`actions`/`variant`; foundation deps `--font-display`, `--surface`, `--border`, `animate-hairline`; regression = title wrapping and element height per route at three widths. Verified consumers: 23. Non-consumers: `lucie PageHead`, `lucie-app PageHeader`, inline headings.

**DataTable** — import `@/components/abox/data-table`; usage with `columns`/`rows`/`getRowId`; overrides via `Column.className` and `align`; regression = header casing, row height, hover treatment, empty slot, horizontal scroll at `min-w-[640px]`. Verified consumers: 19. Non-consumers: `lucie Table`, five raw-table routes.

**InternalShell** — import `@/components/abox/internal-shell`; usage wraps page content with `workspace` key; consumes `WORKSPACES`; renders `PlanOAssistant`; regression = rail collapse, mobile `Sheet`, header pill, `max-w-[1500px]` content width, account dropdown. Verified consumers: 89.

**MetalBadge** — 2 consumers; regression = six tiers in both themes.

Only these import-verified relationships are treated as propagation paths.

---

## SECTION 10 — COMPONENT DEPENDENCY GRAPH

```text
FOUNDATION            SEMANTIC ROLE       CORE COMPONENT     COMPOUND          PATTERN          EXPERIENCE   SCREEN
--primary         ->  action surface  ->  ACTION_PILL    ->  page header   ->  detail page  ->  all      ->  33 files
--primary         ->  action surface  ->  Button         ->  form          ->  form layout  ->  admin    ->  22 files
status tokens     ->  status tone     ->  StatusBadge    ->  table row     ->  table screen ->  admin    ->  87 files
--metal-*         ->  tier indicator  ->  MetalBadge     ->  plan card     ->  results grid ->  commerce ->  2 files
--font-display    ->  display type    ->  PageHeader     ->  page opening  ->  detail page  ->  all      ->  23 files
--hairline,--card ->  data surface    ->  DataTable      ->  table block   ->  table screen ->  admin    ->  19 files
--sidebar*,glass  ->  shell surface   ->  InternalShell  ->  workspace     ->  dashboard    ->  admin    ->  89 files
--card,--border   ->  surface         ->  (no owner)     ->  inline cards  ->  detail page  ->  all      ->  dozens
```

Edges evidenced today: component→foundation for every row above; component→component (`PageHeader`→`FadeRise`, `EmptyState`→`DiagonalWeave`, `InternalShell`→`Sheet`/`DropdownMenu`/`PlanOAssistant`, `MemberShell`→`MEMBER_NAV`, `MarketplaceShell`→`DropdownMenu`/`ProductSwitcher`); component→shell (page components render inside one of three shells); component→experience (PlanCard/MetalBadge commerce-only; DataTable/KpiCard admin-dominant).

Unsupported relationships are not created. Future rule: ownership flows one way only — foundation → role → component → compound → pattern → experience → screen. A component may never import a pattern, a shell or a route; a shell may never import a route's local kit.

---

## SECTION 11 — COMPOUND COMPONENT ARCHITECTURE

| Compound | Current implementations | Consumers | Distinct responsibility beyond grouping? | Status |
|---|---|---|---|---|
| Form field | `ui/form.tsx` (`FormItem`+`FormLabel`+`FormControl`+`FormMessage`), `m06 Field` | mixed | Yes — label/control/error association | MULTIPLE CURRENT IMPLEMENTATIONS |
| Result toolbar | `lucie Toolbar`, `m06 FilterBar`, inline in `plans.index.tsx` | 3 systems | Yes — filter/result coordination | FUTURE DECISION |
| Filter rail | inline in `plans.index.tsx` | 1 | Yes — persisted multi-facet filtering | ROUTE-SPECIFIC |
| Card collection | inline grids | many | No — grouping only | NOT APPLICABLE |
| KPI group | inline grids of `KpiCard` | admin routes | No — grouping only | NOT APPLICABLE |
| Table presentation | `DataTable` (self-contained) | 19 | Already one component | ALREADY SHARED |
| Plan comparison | compare route | 1 | Yes — cross-plan alignment | ROUTE-SPECIFIC |
| Cart summary | inline `cart.tsx`/`quote.tsx` + `QuoteEditPanel` | 1 + inline | Yes — totals and edit affordances | NEEDS PRODUCT DECISION |
| Page opening | `PageHeader` | 23 | Already one component | ALREADY SHARED |
| Navigation group | `WORKSPACES` sections in InternalShell, `MEMBER_NAV`, inline marketplace nav | 3 | Yes — section grouping with active state | BLOCKED BY EXPERIENCE VARIATION |
| Dialog sections | Radix `DialogHeader`/`Footer` | 4 | Already provided | ALREADY SHARED |

---

## SECTION 12 — DUPLICATE & OVERLAP REGISTER

No winner, no merge, no deletion.

| Concept | A | B (and further) | Responsibility | Concrete differences | Consumers | Experiences | Foundation deps | Risk | Decision required |
|---|---|---|---|---|---|---|---|---|---|
| Cards / surfaces | `ui/card.tsx` | inline `rounded-* border border-*`; `DefinitionCard`; `BlockerCard`; `KpiCard`; `PlanCard` | surface container | padding `p-3/4/5/6`, radius `lg/xl/2xl`, `border` vs `hairline`, shadow present or absent | 6 + dozens | all | `--card`, `--border`, `--hairline`, radius | High | Separate, variants, or one surface |
| Page headers | `abox/page-header.tsx` (23) | `lucie PageHead`; `lucie-app PageHeader`; inline `text-display` (index 12, app.index 7) | page opening | title scale, eyebrow, hairline, icon plate, motion | 23 + kits | all | `--font-display` | High | Global vs experience-specific |
| Form fields | `ui/form.tsx` (RHF+zod) | `m06 Field`/`TextInput`/`TextArea`/`Picker`; raw elements (brand 9, overrides 6/5, content 6, agency 6/6) | labelled input | label type, spacing, error slot, validation wiring | mixed | admin, marketing | `--input`, `--ring`, `--destructive` | High | Shared field wrapper or not |
| Tables | `abox/data-table.tsx` (19) | `lucie Table`; 5 raw `<table>` routes; `ui/table.tsx` unused | tabular data | header casing/tracking, row padding, hover, empty handling, min-width | 19 + 6 | admin | `--hairline`, `--card` | High | One foundation or several |
| Navigation | `nav-config.ts` + InternalShell/MemberShell | inline nav in MarketplaceShell; `ModuleTabs`; `ui/tabs.tsx` | navigation | data-driven vs inline; link vs panel | 123 | all | `--sidebar*`, `--primary` | Medium | Shared primitives with shell behaviour |
| Assistants | `plan-o-assistant.tsx` (1, via InternalShell) | `planai-assistant.tsx` (0); `ai-elements/*` | assistant surface | one renders, one is inert | 1 | admin | tokens | Low | Disposition of the inert module |
| Empty states | `abox/empty-state.tsx` (8) | `m06 StateBlock`; `m08 EmptyRows`/`Denied`; inline | empty presentation | decor, icon plate, copy structure, dashed border | 8 + kits | all | `--surface`, `--border-strong` | Medium | Variant model |
| Action groups | `ACTION_PILL` (33) | `ui/button.tsx` (22); `m06 Btn`; inline `<button>` | actions | radius `full` vs `md`, heights, shadow on primitive only | 55+ | all | `--primary`, `--accent` | High | Coexist or variants |
| Status / tone | `StatusBadge` (87) | `m06 StatusTag`+`statusTone`; `m08 OutcomeTag`; `lucie Tag`+`postureTone`; `lucie-app StatusChip`+`toneFor`; `ui/badge.tsx` (1) | status presentation | tone names, `color-mix` vs fixed classes, dot marker | 87 + kits | all | status tokens | Highest | Shell vs vocabulary split |
| Control sizing | `h-10` (139), `h-11` (66) | `h-8` (40), `h-9` (43), `h-12` (7) | control geometry | five heights; mobile 44px floor | all | all | none (literals) | High | Density roles |
| Icon containers | PageHeader plate | EmptyState plate; shell plates; route plates | icon framing | size 36/48/56, radius `2xl` vs `md`, border/background token | 31+ | all | `--surface`, `--border`, `--hairline` | Medium | Container model |
| Shells | `InternalShell` (89) | `MarketplaceShell` (30); `MemberShell` (4) | app chrome | header geometry, width (`1500px` vs `88rem`), nav source, footer, assistant | 123 | all | `--sidebar*`, `glass` | High | Shared shell primitives |
| Route-local kits | `m06/kit.tsx` | `m08/kit.tsx`; `lucie/ui.tsx`; `lucie-app/ui.tsx`; `ai-elements/*` | mini design systems | four parallel vocabularies | route scoped | admin | tokens | High | Which concepts graduate |

---

## SECTION 13 — EXPERIENCE-SPECIFIC COMPONENT BOUNDARIES

| Candidate | Classification | Code evidence |
|---|---|---|
| ACTION_PILL | GLOBAL COMPONENT | 33 files across all four experiences |
| StatusBadge (shell) | GLOBAL COMPONENT | 87 files across all experiences |
| Tone vocabularies | EXPERIENCE EXTENSION | four kit-specific mappers |
| PageHeader | SHARED COMPONENT WITH VARIANTS | two variants, 23 consumers; Lucie kits keep their own |
| Button | SHARED COMPONENT WITH VARIANTS | 22 consumers, concentrated in admin/forms |
| DataTable | SHARED COMPONENT WITH VARIANTS | 19 consumers, admin-dominant |
| KpiCard | SHARED COMPONENT WITH VARIANTS | 16 consumers, admin |
| EmptyState | SHARED COMPONENT WITH VARIANTS | 8 consumers, all experiences |
| PlanCard, MetalBadge, ShoppingPathBar, CarrierMark, ProductSwitcher, QuoteEditPanel | EXPERIENCE-SPECIFIC COMPONENT | commerce routes only |
| InternalShell / MarketplaceShell / MemberShell | EXPERIENCE-SPECIFIC COMPONENT | one per experience |
| m06 / m08 / Lucie / lucie-app / ai-elements kits | EXPERIENCE EXTENSION | imported only by their own routes |
| Hero plates, filter rail, add-ons block, branding swatches, asset plates | ROUTE-SPECIFIC COMPONENT | declared inside one route |
| Decor primitives | GLOBAL (decorative system) | used by marketing and `EmptyState` |

Intentional differences are not flattened.

---

## SECTION 14 — SHELL COMPONENT BOUNDARIES

Not merged. Three distinct chrome responsibilities.

**InternalShell** — `src/components/abox/internal-shell.tsx`, 501 lines, **89** consumers (admin: `app.*`, `agency.*`, `platform.*`, `marketplace.admin.*`). Navigation from `WORKSPACES` in `src/lib/nav-config.ts` with a workspace switcher orb. Header is a `glass` pill at `max-w-[1500px]`; content also `max-w-[1500px]`. Mobile uses `ui/sheet.tsx` (`side="left"`, `w-[300px]`, `bg-sidebar`); desktop rail collapses. Account control uses `ui/dropdown-menu.tsx`. Renders `PlanOAssistant surface="internal"`. Branding relationship: consumes `--sidebar*` tokens and `AboxMark`; owns no branding data. Asset relationship: none. Future canonical boundary: shell stays experience-specific; only shared *primitives* (header pill, account control, container width) could ever be extracted — FUTURE DECISION.

**MarketplaceShell** — `marketplace-shell.tsx`, 223 lines, **30** consumers (commerce). Floating pill navigation written inline: `PillLink` to `/select`, `/ichra`, `/schedule`, a cart link, an account dropdown or `/auth` link. `variant="landing"` shifts the sticky offset from `top-4` to `top-6`. Optional product rail via `ProductSwitcher`. Footer grid at `max-w-[88rem]`. User name truncates at `max-w-[10ch]`/`sm:max-w-[16ch]`. Branding: displays `brandName` and `AboxMark`; owns no branding data. Future boundary: navigation is inline and would need extraction before any shared nav primitive — FUTURE DECISION.

**MemberShell** — `member-shell.tsx`, 145 lines, **4** consumers. Navigation from `MEMBER_NAV`; icon rail with a connecting arc centred on 36px icon circles; header `sticky top-4`, full-width; content `max-w-[88rem]` with `pt-10`/`md:pt-14`. Future boundary: stays experience-specific.

Shared foundations across all three: colour tokens, radius, shadows, `glass`, motion, typography. Shared code today: only `ui/*` primitives and `nav-config.ts` (two of the three).

---

## SECTION 15 — FORMS ARCHITECTURE

Installed: `react-hook-form` ^7.71.2, `@hookform/resolvers` ^5.2.2, `zod` ^3.24.2. **The only production file importing react-hook-form is `src/components/ui/form.tsx`.** Every other form in the application is hand-rolled with local state.

Current implementations:

1. **`ui/form.tsx`** — `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`; provides label/control/description/error association and `aria-describedby`/`aria-invalid` wiring.
2. **`ui/*` field primitives** — `input.tsx` 7, `select.tsx` 7, `textarea.tsx` 3, `checkbox.tsx` 1, `radio-group.tsx` 1, `switch.tsx` 1, `label.tsx`.
3. **`m06/kit.tsx`** — `Field` (wrapper), `TextInput`, `TextArea`, `Picker`; plus `screens/common.tsx` `PersonPicker`, `TextFilter`.
4. **`lucie/ui.tsx`** — `Select`, `Search`.
5. **Raw elements** — `marketplace.admin.brand.tsx` 9, `platform.organizations.$organizationId.override.tsx` 6, `marketplace.admin.content.tsx` 6, `agency.organizations.$organizationId.locations.tsx` 6, `…contacts.tsx` 6, `platform.marketplaces.$marketplaceId.override.tsx` 5, `marketplace.admin.referral-links.index.tsx` 4, and others at 3.
6. **Custom toggles** — `aria-pressed` buttons used as filters in `plans.index.tsx` rather than checkboxes.

Nothing is consolidated. A future canonical form layer would require, before any migration: a per-field capture of dimensions, spacing, label typography, helper text, error presentation, focus ring, keyboard behaviour, validation timing and every ARIA attribute currently emitted — for each of the six implementation families above, separately.

---

## SECTION 16 — TABLE & DATA ARCHITECTURE

- **`abox/data-table.tsx`** — 19 consumers. Container `overflow-hidden rounded-lg border border-hairline bg-card`; inner `overflow-x-auto`; `<table class="w-full min-w-[640px] text-sm">`; `sr-only` caption; header `border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground` with `px-5 py-4` and `scope="col"`; per-column `align` and `className`; optional `onRowClick`; optional `empty` slot; hover row treatment.
- **`lucie/ui.tsx` `Table`** — separate generic table for the Lucie spine.
- **Raw `<table>`** — `agency.organization-imports.$importJobId.tsx`, `agency.organization-defaults.apply.tsx`, `agency.organization-imports.index.tsx`, `app.employer.ichra.tsx`, `marketplace.admin.releases.compare.tsx`.
- **`ui/table.tsx`** — installed, **zero production importers**.
- **`ui/pagination.tsx`** — installed, **zero production importers**; no pagination behaviour exists anywhere in production. None is introduced.
- **Toolbars / filters** — `lucie Toolbar`/`Search`/`Select`; `m06 FilterBar`/`TextFilter`/`PersonPicker`; the inline persisted filter rail in `plans.index.tsx`.
- **Sorting** — present only as route-local sort controls (plan results); `DataTable` has no sort API.
- **Selection** — no table selection API exists.
- **Loading / empty** — `DataTable.empty`, `m08 LoadingRows`/`EmptyRows`, `ui/skeleton.tsx`.
- **Responsive** — horizontal scroll below 640px via `min-w-[640px]`; no column collapsing.

No table is consolidated.

---

## SECTION 17 — CARD / SURFACE ARCHITECTURE

| Implementation | Padding | Radius | Border | Shadow | Background | Consumers | Experience |
|---|---|---|---|---|---|---|---|
| `ui/card.tsx` | via `CardHeader`/`CardContent` | `rounded-xl` family | `border` | `shadow` | `bg-card` | 6 | admin, member |
| Inline surface pattern | `p-3` 80 / `p-4` 71 / `p-5` 208 / `p-6` 47 | `lg` / `xl` / `2xl` | `border` or `border-hairline` | often none | `bg-card` or `bg-surface` | dozens (content 15, org index 13, quote 10, override 10, brand 10) | all |
| `KpiCard` | own internal spacing, value `mt-8`, delta `mt-4` | own | own | own | `bg-card` | 16 | admin |
| `PlanCard` | own, with `compact`/`horizontal` variants | own | own | own | `bg-card` | 4 | commerce |
| `m06 DefinitionCard` | own | own | own | — | — | m06 screens | admin |
| `m08 BlockerCard` | own | own | own | — | — | m08 screens | admin |
| `EmptyState` | `px-6 py-14` | `rounded-lg` | `border-dashed border-border-strong` | none | `bg-surface/60` | 8 | all |
| Marketing plates | route-local | varies | varies | varies | varies | `index.tsx` | marketing |
| Cart / summary | route-local | varies | varies | varies | varies | `cart.tsx`, `quote.tsx` | commerce |

No single universal card is decided.

---

## SECTION 18 — NAVIGATION & PAGE HEADER ARCHITECTURE

- **`abox/page-header.tsx`** — 23 consumers, `default` and `compact`, described in §5.
- **`lucie/ui.tsx` `PageHead`** and **`lucie-app/ui.tsx` `PageHeader`** — separate implementations for their route families.
- **Inline headings** — `text-display` used directly in `index.tsx` (12), `app.index.tsx` (7), `agency.organizations.$organizationId.index.tsx` (7), `plans.$planId.tsx` (6), `quote.tsx` (5) and others.
- **Section headers** — `m08 M08Section`, `lucie Section`, `lucie-app Section`, inline titles.
- **Tabs** — `ui/tabs.tsx` (3) switches panels; `abox/module-tabs.tsx` (2) navigates routes with `activeProps`. Distinct responsibilities, kept distinct.
- **Breadcrumbs** — `ui/breadcrumb.tsx` has no production importers.
- **Shell navigation** — `src/lib/nav-config.ts` exports `WorkspaceKey`, `NavItem`, `NavSection`, `WorkspaceConfig`, `WORKSPACES`, `MEMBER_NAV`; consumed by InternalShell and MemberShell. MarketplaceShell writes its navigation inline.
- **Route-local navigation** — shopping path bar, wizard stepper, product switcher.

Four layers stay distinct: design-system component (`PageHeader`), navigation configuration (`nav-config.ts`), shell (the three shells), and page-specific navigation. Nothing is modified and no replacement is invented.

---

## SECTION 19 — BRANDING & MARKETPLACE BOUNDARY

Runtime-owned, unchanged:

- `/app/jet/branding` → `src/routes/app.jet.branding.tsx` — palette swatches for `--primary`, `--sage`, `--background`, `--sidebar`; logo / mark / favicon upload placeholders; disclosure text.
- `src/routes/marketplace.admin.brand.tsx` — marketplace brand screen (10 inline surfaces, 9 raw inputs).
- `src/routes/marketplace.admin.assets.tsx` — `AssetType` LOGO / MARK / FAVICON / HERO; upload creates an id via `crypto.randomUUID().slice(0, 8)`, records `SCANNING`, transitions to `VALID` after 900ms.
- `src/lib/marketplace-store.ts` — asset records and marketplace state.
- `src/components/abox/logo.tsx` (`AboxMark` 3, `AboxWordmark` 0) and `public/favicon.ico`.

Future canonical display components may **consume** branding configuration — reading a brand name prop as `MarketplaceShell` already does, or reading CSS variables — and may never own branding state, branding storage, marketplace asset storage, or the upload / scan / validate / preview / retire workflow. Branding ownership does not move into the component library.

---

## SECTION 20 — ROUTE-LOCAL KIT ARCHITECTURE

| Kit | Owns | Imports | Should continue owning | Possible future shared concepts | Route scope | Blocker | Risk |
|---|---|---|---|---|---|---|---|
| `m06/kit.tsx` | `statusTone`, `StatusTag`, `Btn`, `Field`, `TextInput`, `TextArea`, `Picker`, `StateBlock`, `QueryBlock`, `PendingM00`, `OwnedElsewhere`, `Sheet`, `MetaRail`, `Toast`, `fmtDate`, `fmtDateTime` | tokens, `cn`, m06 models | domain tone mapping, governance notices, meta rail | field wrapper, sheet | m06 routes | domain coupling | High |
| `m06/screens/common.tsx` | `useProfiles`, `PersonPicker`, `FilterBar`, `TextFilter`, `useTextFilter`, `DefinitionCard`, `personLabel`, `CategoryTag` | m06 data | profile/domain helpers | filter bar, definition card | m06 screens | data coupling | Medium |
| `m08/kit.tsx` | locale provider, `useT`, `LanguageToggle`, `TraceRail`, `ApprovalDependentNotice`, `ReviewModeBanner`, `OutcomeTag`, `DimensionStrip`, `ProvenanceChip`, `ContextRibbon`, `BlockerCard`, `M13Dependency`, `LoadingRows`, `Denied`, `EmptyRows`, `M08Section` | m08 models, tokens | traceability, bilingual strings, authority outcomes | loading rows, section, empty rows | m08 routes | governed traceability | High |
| `lucie/ui.tsx` | `Id`, `IdList`, `Tag`, `postureTone`, `PostureTag`, `Section`, `PageHead`, `Stat`, `KV`, `Table`, `Toolbar`, `Select`, `Search`, `Note` | tokens | Lucie identifiers and posture vocabulary | table, toolbar, search | Lucie spine | vocabulary coupling | High |
| `lucie-app/ui.tsx` | `PageHeader`, `Section`, `StatCard`, `StatusChip`, `toneFor`; `frames.tsx` | tokens | prototype framing | stat card | Lucie app routes | prototype scope | Medium |
| `ai-elements/*` | `conversation.tsx`, `message.tsx`, `prompt-input.tsx`, `shimmer.tsx` | tokens | assistant UI | shimmer | assistant surfaces | assistant coupling | Low |
| `icons/tooth-icon.tsx` | `ToothIcon` (Tabler `IconDental`) | `@tabler/icons-react` | dental icon | — | none (0 importers) | inert today | None |

No kit is migrated.

---

## SECTION 21 — ICON & DECORATIVE COMPONENT BOUNDARIES

| Item | Layer |
|---|---|
| lucide-react icon set | Foundation (external library) |
| Icon size literals (`h-4 w-4` 287, `h-3.5` 68, `h-5` 32, `h-6` 4) | Foundation (unowned, see Phase 13) |
| `ToothIcon` (Tabler wrapper, 0 importers) | Primitive (inert) |
| `AboxMark` (3) / `AboxWordmark` (0) | Component (brand) |
| `CarrierMark` (1) | Component (commerce) |
| `decor/*` — `OrbitalRings`, `DotField`, `Aurora`, `CornerCrop`, `RadialTicks`, `TickerRule`, `MarqueeSerial`, `IsoStack`, `GlassPanel`, `HealthPulseShield`, `CoverageWeave`, `BlueprintGrid`, `PolicyLines`, `FamilySilhouette`, `PlateFrame`, aliases `HairlineGrid`/`ConcentricArcs`/`DiagonalWeave` | Decorative system |
| Icon plates in PageHeader / EmptyState / shells | Component-local, no shared owner |
| Icon-only controls | Component-local (`size="icon"`) and route-local |
| Inline auth/marketing SVG | Route-local |

No icon library is consolidated.

---

## SECTION 22 — ACCESSIBILITY CONTRACT

Every future canonical component must preserve exactly what exists today:

- **Semantic HTML** — `PageHeader` renders `<header>` + `<h1>`; `DataTable` renders `<table>` with `<caption class="sr-only">`, `<th scope="col">`; `ModuleTabs` renders `<nav aria-label="Module sections">`; `MarketplaceShell` renders `<nav aria-label="Marketplace navigation">`.
- **ARIA** — `aria-label` on `DataTable` and shell navigation; `aria-pressed` on filter toggles; `aria-hidden` on decorative icons and the StatusBadge dot; Radix `data-state` on all overlay primitives; `aria-describedby`/`aria-invalid` from `ui/form.tsx`.
- **Keyboard** — Radix keyboard behaviour for dialog, sheet, dropdown, select, tabs, popover, tooltip; native behaviour for links and buttons.
- **Focus** — `focus-visible:ring-1 focus-visible:ring-ring` on Button; Radix focus trapping and restore on overlays; the deliberately ring-less exchange filters must remain ring-less while keeping `aria-pressed`.
- **Disabled** — `disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed`.
- **Screen readers** — `sr-only` captions and labels preserved verbatim.
- **Reduced motion** — `src/styles.css` L268–274 clamps all animation and transition durations; `FadeRise` respects the same preference.
- **Touch targets** — `button, a { min-height: 44px }` below 640px (L264–266).

Accessibility behaviour must be exactly equivalent after any future migration.

---

## SECTION 23 — CONTENT & RESPONSIVE CONTRACT

| Candidate | Short content | Long content | Localization | Wrapping / truncation | Missing / optional | Dense | Mobile / tablet / desktop |
|---|---|---|---|---|---|---|---|
| PageHeader | title on one line | `max-w-3xl` container, `max-w-2xl` description | — | wraps; `leading-[0.98]` on default | eyebrow, icon, description, actions all optional | compact variant | title `text-3xl` → `md:text-4xl`; plate `h-12` → `md:h-14` |
| ACTION_PILL | fixed heights | `whitespace` not forced — long labels widen the pill | — | no truncation | icon optional | xs variant | 44px floor below 640px |
| StatusBadge | micro type | long labels widen the badge | — | no truncation | — | fixed | unchanged |
| DataTable | — | cells wrap | — | horizontal scroll below `min-w-[640px]` | `empty` slot | `py-4` rows | scroll on mobile |
| KpiCard | `text-5xl` value | long values may wrap | — | `tabular-nums` alignment | `delta`, `hint`, `icon` optional | — | unchanged |
| PlanCard | — | plan names wrap | — | `compact`/`horizontal` variants | optional score, subsidy, best-match | compact | grid reflow |
| MarketplaceShell | — | user name truncates | — | `max-w-[10ch]` → `sm:max-w-[16ch]` | account vs sign-in | — | pill nav reflows |
| m08 screens | — | — | **English/Spanish toggle via `M08LocaleProvider`** | Spanish strings are longer | — | — | must be verified in both languages |
| EmptyState | — | body `max-w-md` | — | wraps | icon, body, action optional | — | unchanged |

No copy is rewritten and no new copy is introduced. The component architecture must not cause unexpected wrapping or layout change in any of the above.

---

## SECTION 24 — FUTURE PRODUCTION FILE MAP

| Candidate | Current file | Current export | Future canonical file | Future export | Action | Consumers | Stage | Status | Approval |
|---|---|---|---|---|---|---|---|---|---|
| Action pill | `src/components/abox/action-pill.ts` | `ACTION_PILL` | same | same | none, unless componentized | 33 | 16 | CANDIDATE | Yes |
| Status badge | `src/components/abox/status-badge.tsx` | `StatusBadge` | same | same | none | 87 | 16 | ALREADY SHARED | No |
| Metal badge | `src/components/abox/metal-badge.tsx` | `MetalBadge` | same | same | none | 2 | — | ALREADY SHARED | No |
| Page header | `src/components/abox/page-header.tsx` | `PageHeader` | NOT YET DECIDED | NOT YET DECIDED | decision only | 23 | 16 | MULTIPLE IMPLEMENTATIONS | Yes |
| Data table | `src/components/abox/data-table.tsx` | `DataTable`, `Column` | same | same | none | 19 | 16 | ALREADY SHARED | No |
| KPI card | `src/components/abox/kpi-card.tsx` | `KpiCard` | NOT YET DECIDED | — | decision only | 16 | 16 | MULTIPLE IMPLEMENTATIONS | Yes |
| Empty state | `src/components/abox/empty-state.tsx` | `EmptyState` | NOT YET DECIDED | — | decision only | 8 | 16 | MULTIPLE IMPLEMENTATIONS | Yes |
| Plan card | `src/components/abox/plan-card.tsx` | `PlanCard` | same | same | none | 4 | — | ALREADY SHARED | No |
| Module tabs | `src/components/abox/module-tabs.tsx` | `ModuleTabs` | same | same | none | 2 | — | ALREADY SHARED | No |
| Brand mark | `src/components/abox/logo.tsx` | `AboxMark` | same | same | none | 3 | — | ALREADY SHARED | No |
| Button | `src/components/ui/button.tsx` | `Button` | NOT YET DECIDED | — | decision only | 22 | 16 | MULTIPLE IMPLEMENTATIONS | Yes |
| Card | `src/components/ui/card.tsx` | `Card` etc. | NOT YET DECIDED | — | decision only | 6 | 16 | BLOCKED BY DUPLICATE | Yes |
| Form field | `src/components/ui/form.tsx` | `FormItem` etc. | NOT YET DECIDED | — | decision only | see §15 | 16 | BLOCKED BY DUPLICATE | Yes |
| Overlays | `src/components/ui/{dialog,sheet,popover,dropdown-menu}.tsx` | Radix sets | same (sheet NOT YET DECIDED) | same | none | 4/3/1/3 | — | ALREADY SHARED / BLOCKED | Partly |
| Icon container | `page-header.tsx`, `empty-state.tsx`, shells | — | FUTURE FILE — NOT CREATED | — | decision only | 31+ | 16 | NEEDS DECISION | Yes |
| Cart summary | `src/routes/cart.tsx`, `quote.tsx`, `abox/quote-edit-panel.tsx` | — | FUTURE FILE — NOT CREATED | — | decision only | 1 + inline | 16 | NEEDS PRODUCT DECISION | Yes |
| Section header | `m08/kit.tsx`, `lucie/ui.tsx`, `lucie-app/ui.tsx` | `M08Section`, `Section` | FUTURE FILE — NOT CREATED | — | decision only | kits | 16 | NEEDS DESIGN DECISION | Yes |
| Shells | three shell files | three exports | same | same | none | 89/30/4 | — | EXPERIENCE-SPECIFIC | No |
| Route-local kits | m06 / m08 / lucie / lucie-app / ai-elements | many | same | same | none | route scoped | — | PRESERVED | No |
| Inert modules | `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx`, `icons/tooth-icon.tsx`, `ui/table.tsx`, `ui/pagination.tsx` | — | NOT YET DECIDED | — | disposition decision | 0 | — | OPEN | Yes |

No future component file is created.

---

## SECTION 25 — FUTURE COMPONENT LIBRARY STRUCTURE

Conceptual layers only. No directory or file is created.

```text
foundations        (src/styles.css — tokens, utilities, keyframes)
   |
primitives         (unstyled/low-level: Radix wrappers)
   |
canonical components   (single-responsibility, token-driven, no domain logic)
   |
compound components    (label+control+error; page opening; table block)
   |
patterns               (Phase 15)
   |
experience extensions  (commerce, admin, member, marketing variants and kits)
   |
shells                 (InternalShell, MarketplaceShell, MemberShell)

decorative components  (decor/*) — consumed by any layer, depends only on foundations
```

Structural guards the future organization must enforce:

- **No circular dependencies** — a lower layer may never import a higher one; shells import components, never the reverse; decorative components import only foundations.
- **No business-logic leakage** — components receive data and callbacks; stores (`cart-store`, `marketplace-store`, `org-store`, `quote-store`) stay outside the library.
- **No branding ownership leakage** — components may read branding configuration, never own or persist it.
- **No route-specific code becoming canonical** — a route-local component is promoted only through an approved decision with verified multi-route consumers.
- **No reference documentation becoming a runtime dependency** — `src/lib/design/*`, `reference-kit.tsx` and the two design routes must never be imported by production code.

---

## SECTION 26 — CONTROLLED COMPONENT MIGRATION SEQUENCE (future, not performed)

1. Freeze the current production baseline.
2. Confirm the foundation source for every token the component consumes.
3. Confirm the component's responsibility boundary.
4. Capture the current component API and behaviour.
5. Capture the current visual states — all of them, per consumer.
6. Establish the canonical source alongside the existing implementation.
7. Implement compatibility only where technically necessary and output-preserving.
8. Migrate exactly one verified consumer.
9. Compare exact rendered output against that consumer's capture.
10. Compare all states.
11. Compare responsive behaviour at desktop, tablet and mobile.
12. Compare accessibility.
13. Compare navigation and business behaviour.
14. Verify branding and marketplace boundaries.
15. Only then migrate another consumer.

No mass migration, no automatic replacement, no migration of unverified consumers, and no migration because a component merely appears similar. Every step is reversible; any divergence reverts the consumer.

---

## SECTION 27 — EXACT REGRESSION CONTRACT

Everything below must be **identical** before and after any future component migration. No tolerance language, no "visually equivalent".

**Visual** — exact colours (both themes), typography (family, size, weight, line height, tracking), wrapping and line breaks, spacing, dimensions, borders, radius, shadows, icons and icon size, decorative details (`DiagonalWeave` in `EmptyState`, the animated hairline in `PageHeader`, `glass` in the shells), animation.

**Responsive** — desktop, tablet, mobile; every `sm:` / `md:` / `lg:` / `xl:` behaviour; stacking, wrapping, overflow, scroll (including `DataTable`'s `min-w-[640px]`), visibility.

**Interaction** — hover, focus, active, selected (including `aria-pressed` states and the intentionally ring-less exchange filters), disabled, loading, error, success, expanded, collapsed, keyboard, pointer and touch.

**Accessibility** — semantic structure, ARIA, labels, focus order and restoration, screen-reader output, reduced motion, 44px touch targets.

**Functional** — routes, links, navigation, forms, state, business logic, persistence (cart, shopping mode, quote, wizard), dialogs, drawers, menus.

**Branding** — logo, wordmark, favicon, white-label behaviour, marketplace assets, and the upload / scan / validate / preview / retire workflow.

---

## SECTION 28 — FUTURE MANUAL CHANGE MAP

| Change | Current source | Future canonical source | Verified consumers | Propagation | Non-consumers | Local overrides | Blockers | Regression requirement |
|---|---|---|---|---|---|---|---|---|
| Button | `ui/button.tsx` | NOT YET DECIDED | 22 | source → 22 files | pills, `m06 Btn`, inline | `className` | three treatments | all variants × sizes × states |
| Action pill | `abox/action-pill.ts` | same | 33 | source → 33 files | Button users | appended classes | none | 8 variants, hover, 3 widths |
| Status badge | `abox/status-badge.tsx` | same (shell) | 87 | source → 87 files | 4 kit systems, `ui/badge.tsx` | `className` | tone vocabularies | 6 tones, both themes |
| Card | `ui/card.tsx` + inline | NOT YET DECIDED | 6 | would widen | inline instances | padding | padding variance | per-instance capture |
| Page header | `abox/page-header.tsx` | NOT YET DECIDED | 23 | source → 23 | Lucie, inline | `className`, `actions` | three implementations | wrapping per route |
| Form field | `ui/form.tsx` + kits + raw | NOT YET DECIDED | mixed | would widen | raw routes | many | six families | per-field capture |
| Table | `abox/data-table.tsx` | same | 19 | source → 19 | Lucie, raw tables | column `className` | none for DataTable | header, rows, scroll, empty |
| Navigation | `nav-config.ts` + shells | NOT YET DECIDED | 123 | config → 2 shells | marketplace inline nav | — | inline nav | active states, mobile drawer |
| Dialog | `ui/dialog.tsx` | same | 4 | source → 4 | `m06 Sheet` | — | none | open/close, focus trap |
| Drawer / Sheet | `ui/sheet.tsx` | NOT YET DECIDED | 3 | source → 3 | `m06 Sheet` | — | duplicate | side, width, overlay |
| Shell | three shell files | same | 89 / 30 / 4 | per shell | each other | — | inline marketplace nav | full chrome per shell |
| KPI | `abox/kpi-card.tsx` | NOT YET DECIDED | 16 | source → 16 | `Stat`, `StatCard` | `className` | three implementations | value type, delta row |
| Product / plan | `abox/plan-card.tsx` | same | 4 | source → 4 | — | props | none | all variants, grid reflow |
| Icon container | 3+ implementations | FUTURE FILE — NOT CREATED | 31+ | would widen | route plates | geometry | size/radius differ | plate geometry |
| Loading | `ui/skeleton.tsx` | NOT YET DECIDED | 4 | source → 4 | kit loaders | — | duplicates | animation, layout |
| Empty state | `abox/empty-state.tsx` | NOT YET DECIDED | 8 | source → 8 | kit empties | `className` | duplicates | decor, plate, copy |
| Typography role | `src/styles.css` utilities | same | all | foundation-wide | — | literals | Phase 13 D-decisions | wrapping |
| Spacing role | literals | FUTURE FILE — NOT CREATED | — | none today | — | everywhere | no model | layout |
| Control size | pills + primitives + kits | NOT YET DECIDED | all controls | would widen | — | literals | five heights, 44px floor | dimensions at 3 widths |
| Status tone | 5 mappers | NOT YET DECIDED | 87 + kits | would widen | — | vocabularies | domain meaning | tone-by-tone |

---

## SECTION 29 — OPEN DECISION REGISTER

**C1 — Should `ACTION_PILL` remain class constants or become a component?**
Evidence: 8 exact strings, 33 importing files, applied to both `Link` and `button`. Options in code: keep constants; add a component that accepts an element via `asChild`. Would change: call-site syntax only, if output is identical. Risk: element semantics could shift. Owner: Engineering + Design. Status: OPEN.

**C2 — Do `ui/button.tsx`, `ACTION_PILL` and `m06 Btn` represent distinct responsibilities?**
Evidence: 6 variants × 5 sizes with `rounded-md` and shadow, versus `rounded-full` pills with no shadow, versus a kit button. Consumers: 22 / 33 / m06 screens. Would change: which treatment a consumer inherits. Risk: high. Owner: Design. Status: OPEN.

**C3 — Do multiple card systems require separate canonical variants?**
Evidence: `ui/card.tsx` 6 versus inline surfaces up to 15 per file, plus 4 specialised cards. Options: separate, variants, one surface. Risk: high. Owner: Design. Status: OPEN.

**C4 — Do multiple table implementations require separate components?**
Evidence: `DataTable` 19 with a typed API, `lucie Table`, 5 raw tables, `ui/table.tsx` unused. Risk: high. Owner: Design + Engineering. Status: OPEN.

**C5 — Can the six form families share a canonical field wrapper?**
Evidence: `ui/form.tsx` is the only react-hook-form consumer; five other families are hand-rolled. Risk: high — validation and ARIA differ. Owner: Engineering + Design. Status: OPEN.

**C6 — Do page headers need variants or separate components?**
Evidence: `PageHeader` 23 with two variants, plus two kit headers and inline headings. Risk: line breaks. Owner: Design. Status: OPEN.

**C7 — How do status/tone systems relate to component variants?**
Evidence: `StatusBadge` shell with 6 tones and `color-mix` derivation, versus four kit vocabularies and `ui/badge.tsx`. Options: shared shell + local vocabularies; full convergence; status quo. Risk: highest fan-out. Owner: Product + Design. Status: OPEN.

**C8 — How are 32/36/40/44/48px controls represented?**
Evidence: `h-8` 40, `h-9` 43, `h-10` 139, `h-11` 66, `h-12` 7, plus the 44px mobile floor. Options: size variants, density variants, component-specific dimensions. Risk: high. Owner: Design. Status: OPEN.

**C9 — How are experience extensions structured?**
Evidence: four route-local kits with parallel vocabularies; commerce-only components. Options: kits stay independent; selected concepts graduate with variants. Risk: high. Owner: Product + Design. Status: OPEN.

**C10 — Which route-local components are eligible for future extraction?**
Evidence: filter rail (1 route), cart summary (2 routes + `QuoteEditPanel`), hero plates (1 route), definition card (m06). Risk: medium. Owner: Product. Status: OPEN.

**C11 — What is the disposition of the inert modules?**
Evidence: `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx`, `AboxWordmark`, `ToothIcon`, `ui/table.tsx`, `ui/pagination.tsx` — all zero production importers. Options: leave, adopt, or retire. Risk: none while inert. Owner: Product. Status: OPEN.

**C12 — Should `m06 Sheet` and `ui/sheet.tsx` remain separate overlay implementations?**
Evidence: `ui/sheet.tsx` 3 consumers (including the InternalShell mobile drawer) versus `m06 Sheet` in m06 screens. Risk: focus trapping and width differ. Owner: Engineering + Design. Status: OPEN.

**C13 — Should MarketplaceShell's inline navigation be extracted before any shared navigation primitive?**
Evidence: `WORKSPACES`/`MEMBER_NAV` drive two shells; the marketplace nav is inline JSX with `PillLink`. Risk: medium. Owner: Engineering. Status: OPEN.

**C14 — Should `DataTable` gain sorting and selection APIs, given route-local sorting exists today?**
Evidence: `DataTable` has no sort or selection API; plan results sort locally. Risk: medium — adding API surface is not preservation-neutral if consumers change. Owner: Product. Status: OPEN.

No decision is answered and no option is ranked.

---

## SECTION 30 — PHASE 15 DEPENDENCY GATE

Phase 15 (Production Pattern Library) cannot safely begin until Phase 14 establishes:

1. **Canonical component ownership** — patterns compose components; a pattern cannot own a component whose source is undecided.
2. **Component APIs** — patterns pass props; the props must exist and be stable.
3. **Variant architecture** — patterns select variants; the variant vocabulary must be settled (C2, C3, C6, C8).
4. **State architecture** — patterns coordinate states across components; state ownership must be clear.
5. **Foundation dependencies** — Phase 13 decisions D1–D13 that feed component styling.
6. **Compound-component boundaries** — §11 items still marked FUTURE DECISION must be resolved or excluded.
7. **Experience boundaries** — §13 classifications confirmed per component.
8. **Shell boundaries** — §14 decisions, especially C13.
9. **Duplicate decisions** — §12 register entries need a stated disposition for any concept entering Phase 15.
10. **Regression baseline** — the step-1/step-5 captures of §26 covering every route at three viewports, both themes, all states, and both M08 languages.

Phase 15 is not started.

---

## SECTION 31 — FINAL FILE-LEVEL IMPLEMENTATION MAP

| Item | Current file | Current export | Future canonical file | Future export | Current consumers | Future consumers | Future action | Phase | Status | Approval |
|---|---|---|---|---|---|---|---|---|---|---|
| Action pill | `src/components/abox/action-pill.ts` | `ACTION_PILL` | same | same or component | 33 | 33 | decision C1 | 14/16 | CANDIDATE | Yes |
| Status badge | `src/components/abox/status-badge.tsx` | `StatusBadge` | same | `StatusBadge` | 87 | 87 | none | — | ALREADY SHARED | No |
| Metal badge | `src/components/abox/metal-badge.tsx` | `MetalBadge` | same | `MetalBadge` | 2 | 2 | none | — | ALREADY SHARED | No |
| Data table | `src/components/abox/data-table.tsx` | `DataTable`, `Column` | same | same | 19 | 19 | none (C14 open) | — | ALREADY SHARED | No |
| Plan card | `src/components/abox/plan-card.tsx` | `PlanCard` | same | same | 4 | 4 | none | — | ALREADY SHARED | No |
| Module tabs | `src/components/abox/module-tabs.tsx` | `ModuleTabs` | same | same | 2 | 2 | none | — | ALREADY SHARED | No |
| Brand mark | `src/components/abox/logo.tsx` | `AboxMark` | same | same | 3 | 3 | none | — | ALREADY SHARED | No |
| Page header | `src/components/abox/page-header.tsx` | `PageHeader` | NOT YET DECIDED | NOT YET DECIDED | 23 | 23 | decision C6 | 14 | OPEN | Yes |
| KPI card | `src/components/abox/kpi-card.tsx` | `KpiCard` | NOT YET DECIDED | — | 16 | 16 | decision | 14 | OPEN | Yes |
| Empty state | `src/components/abox/empty-state.tsx` | `EmptyState` | NOT YET DECIDED | — | 8 | 8 | decision | 14 | OPEN | Yes |
| Button | `src/components/ui/button.tsx` | `Button` | NOT YET DECIDED | — | 22 | 22 | decision C2 | 14 | OPEN | Yes |
| Card | `src/components/ui/card.tsx` | `Card` | NOT YET DECIDED | — | 6 | unknown | decision C3 | 14 | OPEN | Yes |
| Form field | `src/components/ui/form.tsx` | `FormItem` etc. | NOT YET DECIDED | — | see §15 | unknown | decision C5 | 14 | OPEN | Yes |
| Sheet | `src/components/ui/sheet.tsx` | Radix set | NOT YET DECIDED | — | 3 | 3 | decision C12 | 14 | OPEN | Yes |
| Dialog / Popover / DropdownMenu / Tooltip / Tabs | `src/components/ui/*` | Radix sets | same | same | 4/1/3/4/3 | same | none | — | ALREADY SHARED | No |
| Icon container | `page-header.tsx`, `empty-state.tsx`, shells | — | FUTURE FILE — NOT CREATED | — | 31+ | unknown | decision | 14 | OPEN | Yes |
| Cart summary | `src/routes/cart.tsx`, `src/routes/quote.tsx`, `src/components/abox/quote-edit-panel.tsx` | — | FUTURE FILE — NOT CREATED | — | 1 + inline | unknown | decision C10 | 14 | OPEN | Yes |
| Section header | `src/components/m08/kit.tsx`, `src/components/lucie/ui.tsx`, `src/components/lucie-app/ui.tsx` | `M08Section`, `Section` | FUTURE FILE — NOT CREATED | — | kits | unknown | decision | 14 | OPEN | Yes |
| InternalShell | `src/components/abox/internal-shell.tsx` | `InternalShell` | same | same | 89 | 89 | none | — | EXPERIENCE-SPECIFIC | No |
| MarketplaceShell | `src/components/abox/marketplace-shell.tsx` | `MarketplaceShell` | same | same | 30 | 30 | decision C13 | 14 | EXPERIENCE-SPECIFIC | Partly |
| MemberShell | `src/components/abox/member-shell.tsx` | `MemberShell` | same | same | 4 | 4 | none | — | EXPERIENCE-SPECIFIC | No |
| Nav config | `src/lib/nav-config.ts` | `WORKSPACES`, `MEMBER_NAV` | same | same | 2 shells | 2 shells | none | — | CONFIGURATION | No |
| Route-local kits | `src/components/m06/*`, `m08/*`, `lucie/*`, `lucie-app/*`, `ai-elements/*` | many | same | same | route scoped | same | none | — | PRESERVED | No |
| Decor | `src/components/abox/decor/index.tsx` | 14 exports + aliases | same | same | marketing, EmptyState | same | none | — | DECORATIVE | No |
| Inert modules | `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx`, `icons/tooth-icon.tsx`, `ui/table.tsx`, `ui/pagination.tsx` | — | NOT YET DECIDED | — | 0 | unknown | decision C11 | 14 | OPEN | Yes |
| Branding | `src/routes/app.jet.branding.tsx`, `src/routes/marketplace.admin.brand.tsx` | — | same | — | runtime | runtime | none | — | OUT OF SCOPE | No |
| Marketplace assets | `src/routes/marketplace.admin.assets.tsx`, `src/lib/marketplace-store.ts` | — | same | — | runtime | runtime | none | — | OUT OF SCOPE | No |
| Reference layer | `src/lib/design/*`, `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx` | — | same | — | 0 production | 0 production | none | 17 | REFERENCE ONLY | No |

---

## VALIDATION RECORD

1. Only `.lovable/phase-14-canonical-production-component-library-plan.md` created — confirmed.
2. No production file changed — confirmed.
3. No route changed — confirmed.
4. No component changed — confirmed.
5. No component API changed — confirmed.
6. No token changed — confirmed.
7. No styling changed — confirmed.
8. No visual behaviour changed — confirmed.
9. No responsive behaviour changed — confirmed.
10. No accessibility behaviour changed — confirmed.
11. No interaction behaviour changed — confirmed.
12. No navigation changed — confirmed.
13. No branding behaviour changed — confirmed.
14. No marketplace behaviour changed — confirmed.
15. All consumer counts re-measured from today's code — confirmed.
16. All cited paths exist — confirmed.
17. Reference-layer files remain reference-only (no production importers) — confirmed.
18. No future component file created — confirmed.
19. No duplicate merged — confirmed.
20. No component renamed — confirmed.
21. No component deleted — confirmed.
22. No winner, ranking or score assigned — confirmed.
23. No normalization occurred — confirmed.
24. No production migration occurred — confirmed.
25. Current and future architecture clearly separated — confirmed.
26. Every proposed canonical component is evidenced or marked FUTURE DECISION — confirmed.
27. Exact-preservation regression contract present (§27) — confirmed.
28. Phase 15 prerequisites documented (§30) — confirmed.
29. The plan is implementation-ready but NOT IMPLEMENTED — confirmed.
