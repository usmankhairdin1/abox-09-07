# PHASE 12 — Production Component Architecture & Canonicalization Plan

**Phase 12 does NOT implement a component architecture.** No production file was created, modified, renamed, deleted, refactored, migrated, normalized, consolidated, wrapped, aliased or restyled while producing this document. The only artefact of Phase 12 is this document.

Everything below describes how a centralized production component system *could* be built in a later, separately approved phase. Nothing here is built.

---

## PRESERVATION CONTRACT (governs every future phase)

The existing application is the source of truth for current rendered output. After any future implementation or migration phase, the application must be **exactly** equivalent — not approximately, not "close enough":

every page, every component appearance, every spacing relationship, every typography value and line break, every colour, border, radius and shadow, every icon, every responsive breakpoint and behaviour, every hover / focus / active / selected / disabled / loading / error state, every animation, every link destination and navigation behaviour, every form interaction, every business rule, every branding and white-label behaviour, every marketplace asset workflow.

The future work is architectural extraction and centralization, never redesign. No "improvement" because something looks cleaner. No normalization because two things look inconsistent. No preference-based winner. **Where two implementations render differently today, both are preserved until an explicit future decision approves consolidation.**

### How to read statuses

Neutral labels only, never a ranking: `READY FOR FUTURE DECISION`, `NEEDS EVIDENCE`, `NEEDS DESIGN DECISION`, `NEEDS PRODUCT DECISION`, `NEEDS TECHNICAL DECISION`, `BLOCKED BY DUPLICATE`, `BLOCKED BY EXPERIENCE VARIATION`, `DEFERRED`, `FUTURE OPPORTUNITY — NOT IMPLEMENTED`, `FUTURE FILE — NOT CREATED`, `NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE`.

### Measurement method

All counts below come from a search of the codebase performed for this document, not from Phase 1–11 records. Component counts are **importing files**, matched on `import … from "@/components/abox/…"` or `"@/components/ui/…"`, with `src/lib/design/**`, `src/components/design/**` and the two design routes excluded from the production count. Class and literal counts are occurrence counts across `src/routes` and `src/components` excluding the reference layer.

---

## SECTION 1 — COMPLETE PRODUCTION COMPONENT INVENTORY

### A. UI primitives — `src/components/ui/` (49 files)

Production importing files (reference layer excluded):

| Primitive | File | Prod importers | Representative routes | Notes |
|---|---|---|---|---|
| Button | `ui/button.tsx` | 22 | `auth.tsx`, `cart.tsx`, M06/M08 screens | Genuine shared production source; variant/size via CVA |
| Input | `ui/input.tsx` | 7 | `auth.tsx`, admin routes | Shared, but raw `<input>` also used widely (see §7) |
| Select | `ui/select.tsx` | 7 | admin + quote routes | Shared; `lucie/ui.tsx` has its own `Select` |
| Card | `ui/card.tsx` | 6 | a few admin/member routes | Shared, but most surfaces are inline (see §7) |
| Skeleton | `ui/skeleton.tsx` | 4 | loading blocks | Shared |
| Dialog | `ui/dialog.tsx` | 4 | admin routes | Shared |
| Tooltip | `ui/tooltip.tsx` | 4 | shells, tables | Shared |
| Tabs | `ui/tabs.tsx` | 3 | detail routes | Shared; `ModuleTabs` is a separate link-based concept |
| Textarea | `ui/textarea.tsx` | 3 | branding, admin | Shared; raw `<textarea>` also used |
| Sheet | `ui/sheet.tsx` | 3 | shells/drawers | Shared; `m06/kit.tsx` exports its own `Sheet` |
| DropdownMenu | `ui/dropdown-menu.tsx` | 3 | shell account controls | Shared |
| Alert | `ui/alert.tsx` | 1 | single route | Low adoption |
| Badge | `ui/badge.tsx` | 1 | single route | Low adoption; `StatusBadge` dominates |
| Checkbox | `ui/checkbox.tsx` | 1 | single route | Low adoption |
| RadioGroup | `ui/radio-group.tsx` | 1 | single route | Low adoption |
| Popover | `ui/popover.tsx` | 1 | single route | Low adoption |
| Switch | `ui/switch.tsx` | 1 | single route | Low adoption |

Behavioural responsibility across these: Radix state/ARIA plus CVA class composition. Visual responsibility: class strings in each file consuming `src/styles.css` variables.

### B. ABox shared components — `src/components/abox/` (27 modules + `decor/`)

| Component | File | Export | Prod importers | Already a genuine shared source? |
|---|---|---|---|---|
| InternalShell | `internal-shell.tsx` | `InternalShell` | 89 | Yes — dashboard/admin chrome |
| StatusBadge | `status-badge.tsx` | `StatusBadge` | 87 | Yes — single tone system via `--tone` |
| ACTION_PILL | `action-pill.ts` | `ACTION_PILL` | 33 | Yes — 8 exact class strings, centralized in an earlier phase |
| MarketplaceShell | `marketplace-shell.tsx` | `MarketplaceShell` | 30 | Yes — shopping/commerce chrome |
| PageHeader | `page-header.tsx` | `PageHeader` | 23 | Partly — competing header implementations exist (§7) |
| DataTable | `data-table.tsx` | `DataTable` | 19 | Partly — other table implementations exist (§7) |
| KpiCard | `kpi-card.tsx` | `KpiCard` | 16 | Yes |
| EmptyState | `empty-state.tsx` | `EmptyState` | 8 | Partly — kit-level empty states exist (§7) |
| DownlineWizardStepper | `downline-wizard-stepper.tsx` | — | 8 | Yes, flow-scoped |
| DownlineContextBanner | `downline-context-banner.tsx` | — | 6 | Yes, flow-scoped |
| PlanCard | `plan-card.tsx` | `PlanCard` | 4 | Yes, commerce-scoped |
| MemberShell | `member-shell.tsx` | `MemberShell` | 4 | Yes — member/account chrome |
| SaveContinueButton | `save-continue-button.tsx` | — | 3 | Yes, flow-scoped |
| Logo (`AboxMark`) | `logo.tsx` | `AboxMark`, `AboxWordmark` | 3 (`AboxMark`); `AboxWordmark` 0 | Mark yes; wordmark currently unused in production |
| MetalBadge | `metal-badge.tsx` | `MetalBadge` | 2 | Yes — tier tokens `--metal-*` / `--metal-*-fg` |
| ModuleTabs | `module-tabs.tsx` | `ModuleTabs` | 2 | Yes, module-scoped |
| ShoppingPathBar | `shopping-path-bar.tsx` | — | 2 | Yes, commerce-scoped |
| SuspendedMarketplaceNotice | `suspended-marketplace-notice.tsx` | — | 2 | Yes, narrow |
| CarrierMark | `carrier-mark.tsx` | `CarrierMark` | 1 | Single consumer today |
| ProductSwitcher | `product-switcher.tsx` | — | 1 | Single consumer |
| QuoteEditPanel | `quote-edit-panel.tsx` | — | 1 | Single consumer |
| PlanOAssistant | `plan-o-assistant.tsx` | — | 1 (`internal-shell.tsx`) | Single consumer |
| Motion (`FadeRise`) | `motion.tsx` | `FadeRise` | used by `page-header.tsx` and 1 route | Shared via PageHeader |
| decor | `decor/index.tsx` | `DiagonalWeave` etc. | used by `empty-state.tsx` and others | Decorative only |

**Zero production importers** (editing these changes nothing rendered today): `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx`, `AboxWordmark`. Status: `INSTALLED BUT UNUSED` — recorded, not a removal proposal.

### C. Shell components

`internal-shell.tsx` (501 lines, 89 importers), `marketplace-shell.tsx` (223 lines, 30), `member-shell.tsx` (145 lines, 4). Destinations for the internal shell come from `src/lib/nav-config.ts` (`WORKSPACES`, `NavItem`, `NavSection`, `WorkspaceConfig`, `WorkspaceKey`) and member destinations from `MEMBER_NAV` in the same file; the marketplace shell's header/footer content is written inline in its own file.

### D. Compound components

`PageHeader` (eyebrow + icon plate + title + description + hairline + actions, two variants), `PlanCard`, `KpiCard`, `DataTable`, `QuoteEditPanel`, `DownlineWizardStepper`, `ShoppingPathBar`. Each composes primitives, tokens and `ACTION_PILL`.

### E. Reusable patterns (repeated, no component owner)

Inline card/surface (`rounded-{lg,xl,2xl} border border-{border,hairline}`) appears across many routes — highest concentrations `marketplace.admin.content.tsx` 15, `agency.organizations.$organizationId.index.tsx` 13, `quote.tsx` 10, `platform.organizations.$organizationId.override.tsx` 10, `marketplace.admin.brand.tsx` 10. Also: filter/toolbar rows, definition/summary key-value lists, upload plates, disclosure blocks. Status: `UNOWNED AREA`.

### F. Route-local components

Components declared inside a single route file (for example the hero product plates in `src/routes/index.tsx`, the filter rail in `plans.index.tsx`, the add-ons block in `cart.tsx`, the swatch grid in `app.jet.branding.tsx`, the asset plates in `marketplace.admin.assets.tsx`). 155 files exist under `src/routes`.

### G. Route-local kits

- `src/components/m06/kit.tsx` — `StatusTag`, `Btn`, `Field`, `TextInput`, `TextArea`, `Picker`, `StateBlock`, `QueryBlock`, `Sheet`, `MetaRail`, `Toast`, `statusTone`, plus `screens/common.tsx` (`PersonPicker`, `FilterBar`, `TextFilter`, `DefinitionCard`, `CategoryTag`) and `registry.tsx`, `workforce-page.tsx`.
- `src/components/m08/kit.tsx` — `TraceRail`, `OutcomeTag`, `DimensionStrip`, `ProvenanceChip`, `ContextRibbon`, `BlockerCard`, `LoadingRows`, `Denied`, `EmptyRows`, `M08Section`, `LanguageToggle`, locale provider; plus `screens.tsx`, `selling-setup.tsx`.
- `src/components/lucie/ui.tsx` — `Id`, `IdList`, `Tag`, `PostureTag`, `Section`, `PageHead`, `Stat`, `KV`, `Table`, `Toolbar`, `Select`, `Search`, `Note`.
- `src/components/lucie-app/ui.tsx` — `PageHeader`, `Section`, `StatCard`, `StatusChip`, `toneFor`; plus `frames.tsx`.
- `src/components/ai-elements/` — `conversation.tsx`, `message.tsx`, `prompt-input.tsx`, `shimmer.tsx`.
- `src/components/icons/tooth-icon.tsx` — `ToothIcon`, currently 0 production importers.

### H. Reference-only components

`src/components/design/reference-kit.tsx` and 118 modules in `src/lib/design/`, consumed only by `src/routes/design-system.tsx` and `src/routes/design-guide.tsx`. No production route imports them. Note that reference modules *mention* production component names frequently (for example `StatusBadge` appears in 52 reference files) — those are documentation records, not consumers.

### I. Installed-but-unused primitives

`ui/table.tsx` and `ui/pagination.tsx` have **zero** production importers. Many other primitives shipped with the template (`carousel`, `menubar`, `resizable`, `input-otp`, `context-menu`, `chart`, and similar) also have no production importers. Status: `INSTALLED BUT UNUSED`. Not a deletion proposal.

### J. Other reusable implementations found by search

`src/lib/utils.ts` (`cn`), `src/lib/format.ts`, `src/lib/design-tokens.ts`, the runtime stores (`cart-store`, `marketplace-store`, `org-store`, `quote-store`, `product-store`, `shopping-mode`), `src/lib/nav-config.ts`. These are shared logic/config sources, not visual components, but any future component phase depends on them.

---

## SECTION 2 — COMPONENT VS PATTERN VS FOUNDATION

| Concept | Classification | Evidence |
|---|---|---|
| Colour, radius, shadow, font family, tier and status tone variables | **Foundation** | Declared in `src/styles.css` `@theme inline` / `:root` / `.dark` |
| `text-display`, `text-eyebrow`, `text-serial`, `noise-field`, `contour`, `aurora`, `glass`, `ember-underline`, `ring-pill`, `divider-warm`, `card-brackets`, `edge-sheen` | **Foundation** (utility layer) | `@utility` blocks, `src/styles.css` lines 282–411 |
| Animations `abox-fade-rise`, `abox-orbit`, `abox-pulse-ring`, `abox-hairline-draw`, `abox-drift`, `abox-shimmer` | **Foundation** (motion) | `@keyframes`, lines 412–440 |
| Button, Input, Select, Dialog, Tooltip, Sheet, DropdownMenu, Tabs, Skeleton | **Primitive** | `src/components/ui/*` |
| StatusBadge, MetalBadge, ACTION_PILL, CarrierMark, AboxMark | **Component** | Single-purpose shared visual units |
| PageHeader, KpiCard, DataTable, PlanCard, EmptyState, ShoppingPathBar, DownlineWizardStepper, QuoteEditPanel | **Compound Component** | Compose primitives + tokens |
| Inline card/surface, filter rails, toolbars, definition lists, upload plates | **Pattern** (unowned) | Repeated class signatures, no component |
| Shopping flow, dashboard workspace, member account, marketing landing | **Experience Pattern** | Distinct shells, distinct chrome |
| Hero plates, add-ons block, swatch grid, asset plates | **Route-local** | Declared in one route file |
| Branding & white-label, marketplace assets | **Runtime-owned Brand/Asset feature** | `app.jet.branding.tsx`, `marketplace.admin.brand.tsx`, `marketplace.admin.assets.tsx`, `src/lib/marketplace-store.ts` |

Not every visual pattern is forced into a component, and no component with evidenced experience-specific behaviour is forced into one canonical implementation.

---

## SECTION 3 — CANONICAL PRODUCTION CANDIDATES

Each entry: current implementation(s), consumers, observed variants/states/sizes/density/responsive/accessibility behaviour, observed differences, whether the difference appears intentional, evidence sufficiency, blockers, dependencies, migration risk, status. No winners, no ranks, no scores.

**Button** — `ui/button.tsx` (22 importers), plus `m06/kit.tsx` `Btn`, plus `ACTION_PILL` strings (33 importers), plus inline `<button>` elements across routes. Variants/sizes exist in the CVA config; `Btn` and `ACTION_PILL` express a different rounded-pill treatment. Differences look experience-driven (pill treatment in marketing/commerce, square-ish primitive in admin forms). Evidence sufficient to describe, not to merge. Blockers: three coexisting treatments. Risk: high fan-out. **Status: BLOCKED BY DUPLICATE.**

**Action Pill** — `abox/action-pill.ts`, 8 exact strings, 33 importing files. Already a genuine single production source for those strings. Dependency: `src/styles.css` primary/border/accent tokens. **Status: READY FOR FUTURE DECISION** (the open decision is whether it becomes a component with props rather than class constants).

**Status Badge** — `abox/status-badge.tsx` (87 importers, 6 tones via `--tone` + `color-mix`), alongside `m06/kit.tsx` `StatusTag` + `statusTone`, `m08/kit.tsx` `OutcomeTag`, `lucie/ui.tsx` `Tag`/`PostureTag`, `lucie-app/ui.tsx` `StatusChip`/`toneFor`, and `ui/badge.tsx` (1 importer). Five tone-mapping functions exist. Differences: tone vocabularies differ per module and are tied to module domain enumerations. **Status: BLOCKED BY DUPLICATE / NEEDS PRODUCT DECISION** (tone vocabularies are domain data, not styling).

**Page Header** — `abox/page-header.tsx` (23 importers, `default` and `compact` variants), `lucie/ui.tsx` `PageHead`, `lucie-app/ui.tsx` `PageHeader`, plus inline `text-display` headings in 12+ route files (`index.tsx` 12 occurrences, `app.index.tsx` 7, `agency.organizations.$organizationId.index.tsx` 7). **Status: BLOCKED BY DUPLICATE.**

**Section Header** — no owner; `m08/kit.tsx` `M08Section`, `lucie/ui.tsx` `Section`, `lucie-app/ui.tsx` `Section`, plus inline section titles. **Status: NEEDS DESIGN DECISION.**

**Card / Surface** — `ui/card.tsx` (6 importers) versus the dominant inline surface pattern (dozens of routes, up to 15 in one file), plus `m06/screens/common.tsx` `DefinitionCard`, `m08/kit.tsx` `BlockerCard`, `abox/kpi-card.tsx`, `abox/plan-card.tsx`. Padding and radius differ between instances. **Status: BLOCKED BY DUPLICATE / NEEDS EVIDENCE** (per-instance padding must be captured before any shared surface could exist).

**Form Field** — `ui/form.tsx` + `ui/label.tsx`, `m06/kit.tsx` `Field`/`TextInput`/`TextArea`/`Picker`, and raw `<input>/<select>/<textarea>` across many routes (`marketplace.admin.brand.tsx` 9, `platform.organizations.$organizationId.override.tsx` 6, `marketplace.admin.content.tsx` 6, `agency.organizations.$organizationId.locations.tsx` 6, `…contacts.tsx` 6). Label typography and error handling differ. **Status: BLOCKED BY DUPLICATE / NEEDS TECHNICAL DECISION.**

**Input / Textarea / Select** — `ui/input.tsx` 7, `ui/textarea.tsx` 3, `ui/select.tsx` 7, alongside `m06/kit.tsx` and `lucie/ui.tsx` equivalents and raw elements. **Status: BLOCKED BY DUPLICATE.**

**Checkbox / Radio / Switch** — `ui/checkbox.tsx` 1, `ui/radio-group.tsx` 1, `ui/switch.tsx` 1; most toggles in routes are custom buttons with `aria-pressed` (for example the plan filters). **Status: NEEDS EVIDENCE.**

**Tabs** — `ui/tabs.tsx` 3 (panel tabs) versus `abox/module-tabs.tsx` 2 (route links styled as tabs). Behaviourally different: one switches panels, the other navigates. **Status: BLOCKED BY EXPERIENCE VARIATION** (they are not the same concept).

**Table** — `abox/data-table.tsx` 19, `lucie/ui.tsx` `Table`, raw `<table>` in `agency.organization-imports.$importJobId.tsx`, `agency.organization-defaults.apply.tsx`, `agency.organization-imports.index.tsx`, `app.employer.ichra.tsx`, `marketplace.admin.releases.compare.tsx`; `ui/table.tsx` unused. Density and header treatment differ. **Status: BLOCKED BY DUPLICATE.**

**KPI Card** — `abox/kpi-card.tsx` 16, plus `lucie/ui.tsx` `Stat` and `lucie-app/ui.tsx` `StatCard`. **Status: BLOCKED BY DUPLICATE.**

**Empty State** — `abox/empty-state.tsx` 8, `m06/kit.tsx` `StateBlock`, `m08/kit.tsx` `EmptyRows`/`Denied`, plus inline empties. **Status: BLOCKED BY DUPLICATE.**

**Loading / Skeleton** — `ui/skeleton.tsx` 4, `m08/kit.tsx` `LoadingRows`, `m06/kit.tsx` `QueryBlock`, `ai-elements/shimmer.tsx`, `animate-shimmer` utility. **Status: BLOCKED BY DUPLICATE.**

**Dialog / Drawer / Sheet** — `ui/dialog.tsx` 4, `ui/sheet.tsx` 3, `ui/drawer.tsx` unused, `m06/kit.tsx` `Sheet`. **Status: BLOCKED BY DUPLICATE.**

**Tooltip / Popover** — `ui/tooltip.tsx` 4, `ui/popover.tsx` 1, plus `title` attributes (for example `ModuleTabs`). **Status: NEEDS EVIDENCE.**

**Navigation** — `nav-config.ts` (`WORKSPACES`, `MEMBER_NAV`) drives the internal and member shells; the marketplace shell writes its navigation inline; `ModuleTabs` is a third navigation surface. **Status: BLOCKED BY EXPERIENCE VARIATION.**

**Icon Container** — icon plates appear in `PageHeader` (`h-9 w-9` compact, `h-12 w-12`/`md:h-14 md:w-14` default), `EmptyState` (`h-12 w-12`), shells and route-local plates, each with its own radius (`rounded-md`, `rounded-2xl`). **Status: NEEDS DESIGN DECISION.**

**Plan / Product Card** — `abox/plan-card.tsx` 4, commerce-only. **Status: READY FOR FUTURE DECISION.**

**Cart / Summary** — implemented inline in `cart.tsx` and `quote.tsx` with `abox/quote-edit-panel.tsx` (1 importer). **Status: NEEDS PRODUCT DECISION.**

**Search / Filter controls** — `lucie/ui.tsx` `Search`/`Select`/`Toolbar`, `m06/screens/common.tsx` `FilterBar`/`TextFilter`/`PersonPicker`, the plans filter rail inline in `plans.index.tsx`. **Status: BLOCKED BY DUPLICATE.**

**Pagination** — `ui/pagination.tsx` unused; no production pagination pattern found. **Status: DEFERRED.**

**Alerts / Notifications** — `ui/alert.tsx` 1, `ui/sonner.tsx`, `m06/kit.tsx` `Toast`, `m08/kit.tsx` `ApprovalDependentNotice`/`ReviewModeBanner`, `lucie/ui.tsx` `Note`, `abox/suspended-marketplace-notice.tsx`, `abox/downline-context-banner.tsx`. **Status: BLOCKED BY DUPLICATE.**

---

## SECTION 4 — FOUNDATION CENTRALIZATION PLAN

| Category | Current production source | One source? | Locations | Consumers | Centralizable without output change? | Needs approval | Must stay local |
|---|---|---|---|---|---|---|---|
| Colours (raw) | `src/styles.css` `:root` L91–177, `.dark` L178–248 | Yes | oklch literals | all | Already centralized | — | — |
| Semantic colours | `@theme inline` L32–79 | Yes | `--color-*` mappings | all | Already centralized | — | — |
| Font families | `@theme inline` L27–30 | Yes | `--font-sans`, `--font-display`; `--font-serif` and `--font-mono` alias existing families | all | Already centralized | Any change to the serif/mono aliases | — |
| Font weights | Tailwind classes in components | No | `font-medium`, `font-semibold` literals throughout | all | No | — | Per-component weights |
| Font sizes | Tailwind classes + `text-display`/`text-eyebrow`/`text-serial` | No | utilities L282–308 plus literals | all | Partly | Heading scale | Route-local sizes |
| Line heights / tracking | Utilities plus per-component literals (`leading-[0.98]`, `tracking-[0.12em]`) | No | `page-header.tsx`, `status-badge.tsx`, `metal-badge.tsx`, utilities | varied | No | — | Per-component values |
| Spacing | Tailwind literals | No | routes and components | all | No | — | Yes |
| Control heights | Literals: `h-8` 40, `h-9` 43, `h-10` 139, `h-11` 66, `h-12` 7 | No | `ACTION_PILL`, `ui/button.tsx`, kits, routes | all | No | Density variants | Yes |
| Icon sizes | Literals: `h-4 w-*` 287, `h-3.5` 68, `h-5` 32, `h-6` 4 | No | throughout | all | No | Icon scale | Yes |
| Radius | `@theme inline` L19–25 (`--radius-sm` 6px … `--radius-4xl` 36px) plus literal `rounded-full`, `rounded-md`, `rounded-2xl` in components | Tokens yes, usage no | styles + components | all | Tokens yes, application no | Which radius per concept | Component-level choices |
| Border widths | Literal `border`, `border-b`, `border-dashed` | No | throughout | all | No | — | Yes |
| Shadows / elevation | `@theme inline` L82–87 (`--shadow-card`, `--shadow-elevated`, `--shadow-drawer`, `--shadow-plate`, `--shadow-glow`) plus `--shadow-overlay` alias L462 | Tokens yes | styles.css | shells, cards | Tokens already centralized | Alias resolution | — |
| Opacity | Literal `/90`, `/60`, `opacity-40` etc. | No | throughout | all | No | — | Yes |
| Breakpoints | Tailwind defaults via `md:`/`lg:` literals | No explicit config | components | all | No | Any custom breakpoint | Yes |
| Motion | `@keyframes` L412–440 + `animate-*` classes | Yes | styles.css | `FadeRise`, PageHeader hairline, decor | Already centralized | — | — |
| Density | Not tokenized; expressed through control heights and padding literals | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** | everywhere | all | No | Density model | Yes |
| Status tones | `status-badge.tsx` tone map + `statusTone` (m06) + `toneFor` (lucie-app) + `OutcomeTag` (m08) + `postureTone` (lucie) | **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** | those five files | 87 + kit consumers | No | Tone vocabulary | Domain enumerations |
| Tier / metal colours | `--metal-{bronze,expanded-bronze,silver,gold,platinum,catastrophic}` and `-fg` pairs, consumed only by `abox/metal-badge.tsx` | Yes | styles.css + metal-badge | 2 | Already centralized | — | — |

Categories explicitly marked **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE**: font weights, font sizes, line heights/tracking, spacing, control heights, icon sizes, radius application, border widths, opacity, breakpoints, density, status tones, card padding, table density, form-field typography.

No new token is invented by this phase.

---

## SECTION 5 — COMPONENT PROPAGATION MODEL

Dependency model only; nothing is wired.

```text
src/styles.css  (:root / .dark / @theme inline)
        |
        v
semantic foundation  (--color-*, --radius-*, --shadow-*, --metal-*)
        |
        v
shared component  (ui/*, abox/*)
        |
        v
pattern  (page shell + header + table/card cluster)
        |
        v
screen  (src/routes/*.tsx)
```

```text
ACTION_PILL (8 class strings)
        |
        v
33 importing files
        |
        v
marketing, shopping, admin and member routes
```

Per candidate:

- **Action Pill** — future source would control pill height, radius, padding, type scale and hover. Inheritors: all 33 importers. Non-inheritors: inline `<button>` elements that never imported it, and `m06/kit.tsx` `Btn`. Local overrides remaining: the `className` appended at each call site. Breakage surface: every pill in the app simultaneously. Required checks: screenshot every route group at three widths plus hover/focus states.
- **StatusBadge** — would control the badge shell only. Tone *vocabularies* must stay with their modules (m06 `statusTone`, m08 outcomes, lucie postures) because they encode domain enumerations. Breakage: 87 files.
- **PageHeader** — would control eyebrow, icon plate, title scale, description and hairline. `lucie/PageHead`, `lucie-app/PageHeader` and inline `text-display` headings would intentionally not inherit unless a separate decision migrates them. Breakage: 23 files plus every heading line break.
- **Card / Surface** — cannot propagate safely until per-instance padding is captured; today's instances differ.
- **DataTable** — would control header, row and cell treatment for 19 consumers; `lucie/Table` and the five raw `<table>` routes would not inherit.
- **Shells** — would continue to own chrome; navigation data stays in `nav-config.ts`, and the marketplace shell's inline navigation stays inline unless a separate decision moves it.

---

## SECTION 6 — EXPERIENCE BOUNDARIES

| Experience | Chrome | Representative routes | Component posture |
|---|---|---|---|
| Web / Marketing | none / bare layout | `index.tsx`, `accessibility.tsx`, `auth.tsx` | Mostly route-local with shared pills and tokens |
| Shopping / Commerce | `MarketplaceShell` (30) | `plans.index.tsx`, `plans.$planId.tsx`, `cart.tsx`, `quote.tsx`, `coverage`, `apply`, `review` | Shared with commerce-specific components (`PlanCard`, `MetalBadge`, `ShoppingPathBar`, `CarrierMark`) |
| Dashboard / Admin | `InternalShell` (89) | `app.*`, `agency.*`, `platform.*`, `marketplace.admin.*` | Shared shell + `DataTable`, `KpiCard`, `StatusBadge`, plus module kits |
| Member / Account | `MemberShell` (4) | `member.settings.tsx` and siblings | Shared shell, mostly local content |

Posture per concept: **globally shared** — StatusBadge shell, ACTION_PILL, tokens, motion; **shared with variants** — PageHeader, DataTable, EmptyState, KpiCard; **experience-specific** — PlanCard, MetalBadge, ShoppingPathBar, module kits, shells; **route-specific** — hero plates, filter rail, add-ons block, branding swatches, asset plates.

Intentional differences are not flattened, and nothing becomes global merely because two things look similar.

---

## SECTION 7 — EXISTING DUPLICATES AND OVERLAPS (neutral register)

No winner is chosen and nothing is merged.

| # | Concept | Implementation A | Implementation B (and further) | Concrete differences | Experience-specific? | Decision required | Risk |
|---|---|---|---|---|---|---|---|
| 1 | Card / surface | `ui/card.tsx` (6) | inline `rounded-* border border-*` across dozens of routes; `DefinitionCard`; `BlockerCard` | padding, radius, border colour token, shadow presence | Partly | Keep separate or variants | High |
| 2 | Page header | `abox/page-header.tsx` (23) | `lucie/ui.tsx` `PageHead`; `lucie-app/ui.tsx` `PageHeader`; inline `text-display` headings | title scale, eyebrow presence, hairline, icon plate | Yes for Lucie | Global vs experience-specific | High |
| 3 | Form field | `ui/form.tsx` + `ui/input.tsx` (7) | `m06/kit.tsx` `Field`/`TextInput`/`TextArea`/`Picker`; raw elements in 15+ routes | label typography, spacing, error slot, focus ring | Partly | Which systems share primitives | High |
| 4 | Table | `abox/data-table.tsx` (19) | `lucie/ui.tsx` `Table`; five raw `<table>` routes; `ui/table.tsx` unused | header casing, row height, borders, empty handling | Partly | Shared foundation scope | High |
| 5 | Navigation | `nav-config.ts` + `InternalShell`/`MemberShell` | inline navigation in `MarketplaceShell`; `ModuleTabs` | data-driven vs inline; link vs panel semantics | Yes | Shared primitives with shell behaviour | Medium |
| 6 | Assistants | `plan-o-assistant.tsx` (1 importer, via `InternalShell`) | `planai-assistant.tsx` (0 importers); PlanAI text in plans/cart/marketplace footer | one renders, one does not | n/a | Product decision on the unused module | Low |
| 7 | Empty state | `abox/empty-state.tsx` (8) | `m06` `StateBlock`; `m08` `EmptyRows`/`Denied`; inline empties | decor, icon plate, copy structure | Partly | Variant model | Medium |
| 8 | Action groups | `ACTION_PILL` (33) | `ui/button.tsx` (22); `m06` `Btn`; inline `<button>` | radius (pill vs md), height, hover token | Yes | Coexistence vs variants | High |
| 9 | Control sizing | `h-10` (139) and `h-11` (66) | `h-8` (40), `h-9` (43), `h-12` (7) | 32/36/40/44/48px controls coexist | Partly (density) | Density variant model | High |
| 10 | Icon containers | PageHeader plate (`h-9`/`h-12`/`md:h-14`, `rounded-2xl`) | EmptyState plate (`h-12`, `rounded-md`); shell and route plates | size, radius, border, background token | Partly | Icon container model | Medium |
| 11 | Status / tone systems | `abox/status-badge.tsx` (87) | `m06` `statusTone`/`StatusTag`; `m08` `OutcomeTag`; `lucie` `Tag`/`postureTone`; `lucie-app` `StatusChip`/`toneFor`; `ui/badge.tsx` (1) | tone names, colour derivation (`color-mix` vs fixed classes), dot marker | Yes (domain enums) | Shell vs vocabulary split | High |
| 12 | Route-local kits | `m06/kit.tsx` | `m08/kit.tsx`, `lucie/ui.tsx`, `lucie-app/ui.tsx`, `ai-elements/*` | four parallel mini-systems | Yes | Which kit concepts graduate | High |
| 13 | Shells | `InternalShell` (501 lines) | `MarketplaceShell` (223), `MemberShell` (145) | header height, container width, nav source, footer | Yes | Shared shell primitives | High |
| 14 | Loading | `ui/skeleton.tsx` (4) | `m08` `LoadingRows`; `m06` `QueryBlock`; `ai-elements/shimmer.tsx`; `animate-shimmer` | shimmer vs static, row model | Partly | Loading model | Medium |
| 15 | Dialog surfaces | `ui/dialog.tsx` (4) / `ui/sheet.tsx` (3) | `m06/kit.tsx` `Sheet`; `ui/drawer.tsx` unused | width, overlay, close affordance, focus trap | Partly | Overlay model | Medium |

---

## SECTION 8 — FUTURE MIGRATION ARCHITECTURE

Designed, not performed. **No component may replace an existing implementation until that implementation's current rendered and behavioural contract has been captured first.**

1. **Foundation verification** — confirm each foundation category's real source and consumers; confirm which are already single-source.
2. **Canonical component decision** — an explicit approval per concept, from the §15 register. No implicit winners.
3. **Canonical component implementation** — build the approved component alongside the existing one; nothing is replaced yet.
4. **Characterization / regression capture** — capture the current rendered and behavioural contract of every consumer to be migrated: screenshots at three widths, all interaction states, DOM/class snapshots, behaviour notes.
5. **Consumer-by-consumer migration** — one consumer at a time, never a bulk replace.
6. **Visual comparison** — post-migration output compared against the captured baseline for that consumer.
7. **Behavioural comparison** — clicks, forms, validation, navigation, state persistence.
8. **Responsive comparison** — desktop, tablet, mobile.
9. **Accessibility comparison** — roles, labels, `aria-*`, focus order, keyboard operation.
10. **Route verification** — every route that renders the migrated consumer.
11. **Production validation** — typecheck, build, console, network, full route sweep.
12. **Final source-of-truth confirmation** — record the component as canonical only once every consumer is migrated and verified; until then both implementations remain.

Any divergence found at steps 6–9 reverts the consumer to its previous implementation. Divergence is never accepted as an improvement.

---

## SECTION 9 — PIXEL-PERFECT REGRESSION CONTRACT

Applies to every future migration step. **Exact preservation. No tolerance value is defined, because none is permitted.**

Viewports: desktop, tablet, mobile — each verified separately.

Surfaces covered: typography (family, size, weight, line height, tracking, line breaks, wrapping, truncation), spacing (margin, padding, gap, stacking), dimensions (width, height, min/max, control heights), colour (background, foreground, border, token resolution in light and dark), borders, radius, shadows, icons (identity, size, stroke, colour, placement), animations (name, duration, easing, trigger).

States covered: hover, focus, focus-visible ring, active, selected, `aria-pressed`, disabled, loading, error, empty, form validation messaging.

Behaviour covered: links and destinations, navigation and active states, dialogs, drawers and sheets (open/close, overlay, focus trap, restore), responsive layout changes at each breakpoint, content wrapping and overflow, scroll behaviour and sticky elements, business logic and state handling, branding/white-label behaviour, marketplace asset workflow (upload, scanning→valid transition, preview, retirement).

A migration is acceptable only when the application is visually and behaviourally equivalent to its pre-migration state.

---

## SECTION 10 — MANUAL CHANGE MAP AFTER FUTURE CENTRALIZATION

Future sources are hypothetical. None of them exists today.

| Change | Current source | Future canonical source | Currently centralized? | Future propagation scope | Blockers |
|---|---|---|---|---|---|
| Primary colour | `src/styles.css` `:root`/`.dark` `--primary` | same file | **Yes** | Whole app | None |
| Typography scale | utilities + literals | FUTURE — NOT YET DECIDED | No | Headings and body everywhere | Line-break preservation |
| Spacing | Tailwind literals | FUTURE — NOT YET DECIDED | No | Whole app | No spacing model exists |
| Radius | `--radius-*` tokens; applied per component | tokens exist; application not centralized | Partly | Components that adopt tokens | Per-component literals |
| Shadow | `--shadow-*` tokens | same file | **Yes** | Consumers of the tokens | Alias `--shadow-overlay` |
| Button | `ui/button.tsx` + `ACTION_PILL` + `Btn` + inline | FUTURE — NOT YET DECIDED | No | Potentially every action | Three coexisting treatments |
| Input | `ui/input.tsx` + kit inputs + raw elements | FUTURE — NOT YET DECIDED | No | All forms | Raw elements in 15+ routes |
| Badge | `abox/status-badge.tsx` shell | shell could be canonical; vocabularies stay local | Partly | 87 files | Five tone maps |
| Tabs | `ui/tabs.tsx` vs `abox/module-tabs.tsx` | separate concepts; no single source | No | n/a | Different semantics |
| Card | `ui/card.tsx` + inline | FUTURE — NOT YET DECIDED | No | Most screens | Padding variance |
| Table | `abox/data-table.tsx` + others | FUTURE — NOT YET DECIDED | No | 19+ screens | Density variance |
| Page header | `abox/page-header.tsx` + others | FUTURE — NOT YET DECIDED | No | 23+ screens | Three implementations |
| Navigation | `src/lib/nav-config.ts` (internal + member) | same file for those two shells | Partly | Internal and member shells | Marketplace nav is inline |
| Dialog | `ui/dialog.tsx` / `ui/sheet.tsx` / `m06 Sheet` | FUTURE — NOT YET DECIDED | No | Overlay surfaces | Three implementations |
| Form field | `ui/form.tsx` + kits + raw | FUTURE — NOT YET DECIDED | No | All forms | Label/error variance |
| Icon sizing | literals (`h-4 w-4` 287 occurrences) | FUTURE — NOT YET DECIDED | No | Whole app | No icon scale exists |
| Status tone | five tone maps | FUTURE — NOT YET DECIDED | No | Every status surface | Domain vocabularies |

---

## SECTION 11 — PRODUCTION VS REFERENCE BOUNDARY

**Live production sources:** `src/styles.css`; `src/components/ui/*`; `src/components/abox/*`; `src/components/m06/*`, `src/components/m08/*`, `src/components/lucie/*`, `src/components/lucie-app/*`, `src/components/ai-elements/*`, `src/components/icons/*`; `src/routes/*` (excluding the two design routes); `src/lib/*` runtime stores, `nav-config.ts`, `utils.ts`, `format.ts`; `public/favicon.ico`.

**Reference / documentation sources — no production importers, verified by search:** `src/lib/design/*` (118 modules); `src/components/design/reference-kit.tsx`; `src/routes/design-system.tsx` (`/design-system`); `src/routes/design-guide.tsx` (`/design-guide`); `.lovable/design-system.md`; `roadmap.md`; `.lovable/manual-work-map.md`; and this document.

Editing anything in the reference list changes documentation only. Phase 12 does not turn any reference file into a production source. Both design routes remain reachable by direct URL only and appear in no navigation.

---

## SECTION 12 — BRANDING AND MARKETPLACE BOUNDARY

Runtime-owned and out of scope for the component architecture:

- **Branding & white-label** — `src/routes/app.jet.branding.tsx` (palette swatches for `--primary`, `--sage`, `--background`, `--sidebar`; logo/mark/favicon upload placeholders; disclosure text) and `src/routes/marketplace.admin.brand.tsx`.
- **Marketplace asset management** — `src/routes/marketplace.admin.assets.tsx` with `src/lib/marketplace-store.ts` (`AssetType` LOGO / MARK / FAVICON / HERO; upload creates an id then transitions SCANNING → VALID).

No future phase moves branding configuration or asset storage into the design-system or component layer. Future shared components may **read** branding configuration through the existing runtime store or CSS variables, and must never own, persist, validate or default that data. Ownership of branding values, asset records and their lifecycle stays with these routes and their store.

---

## SECTION 13 — FINAL IMPLEMENTATION ROADMAP (none executed)

**PHASE 13 — Production Foundations Centralization.** Purpose: give each foundation category a verified single production source where that is possible with zero output change. Files likely involved: `src/styles.css` only. Allowed to change: token definitions that provably resolve to the identical computed value. Protected: every rendered value, all components, all routes. Prerequisites: §4 verification. Regression: full route sweep at three widths, light and dark. Approval gate: per-category approval before any edit.

**PHASE 14 — Canonical Production Component Library.** Purpose: implement approved canonical components alongside existing ones. Files: new files under `src/components/` (`FUTURE FILE — NOT CREATED`). Allowed: additive creation only. Protected: every existing component and consumer — nothing is replaced in this phase. Prerequisites: §15 decisions answered; §8 step 4 captures exist. Regression: the new components render nothing in production yet, so the baseline must be unchanged. Gate: per-component approval.

**PHASE 15 — Production Pattern Library.** Purpose: give owners to the unowned repeated patterns (surfaces, filter rails, toolbars, definition lists). Files: additive. Protected: all current output. Prerequisites: Phase 14 for the primitives each pattern uses. Regression: as Phase 14. Gate: per-pattern approval.

**PHASE 16 — Controlled Consumer Migration.** Purpose: move consumers onto canonical sources, one at a time. Files: individual route and component files, one per step. Allowed: swap an implementation only when the captured contract is reproduced exactly. Protected: rendered output and behaviour — the whole point of the phase. Prerequisites: Phases 13–15 plus characterization captures. Regression: the full §9 contract per consumer. Gate: approval per consumer batch, with revert on any divergence.

**PHASE 17 — Final Design Guide / Figma Handoff.** Purpose: align `/design-guide`, `/design-system` and the Figma blueprint with the post-migration production reality. Files: reference layer and documentation only. Protected: all production code. Prerequisites: Phase 16 complete for the concepts documented. Regression: reference routes only. Gate: documentation review.

---

## SECTION 14 — EXACT FILE-LEVEL FUTURE TARGET MAP

| Candidate | Current | Future target |
|---|---|---|
| Button | `src/components/ui/button.tsx` (+ `ACTION_PILL`, `m06/kit.tsx` `Btn`, inline) | NOT YET DECIDED |
| Action Pill | `src/components/abox/action-pill.ts` | same existing production source, IF evidence supports it |
| Status Badge | `src/components/abox/status-badge.tsx` (+ four kit tone systems) | same existing production source for the shell, IF evidence supports it; tone vocabularies NOT YET DECIDED |
| Metal Badge | `src/components/abox/metal-badge.tsx` | same existing production source |
| Page Header | `src/components/abox/page-header.tsx` (+ `lucie/ui.tsx`, `lucie-app/ui.tsx`, inline) | NOT YET DECIDED |
| Section Header | multiple local implementations | FUTURE FILE — NOT CREATED |
| Card / Surface | `src/components/ui/card.tsx` + inline | NOT YET DECIDED |
| Form Field | `src/components/ui/form.tsx`, `m06/kit.tsx`, raw elements | NOT YET DECIDED |
| Input / Textarea / Select | `src/components/ui/{input,textarea,select}.tsx` + kits + raw | NOT YET DECIDED |
| Checkbox / Radio / Switch | `src/components/ui/{checkbox,radio-group,switch}.tsx` | same existing production sources, IF evidence supports it |
| Tabs | `src/components/ui/tabs.tsx`; `src/components/abox/module-tabs.tsx` | both retained as distinct concepts |
| Table | `src/components/abox/data-table.tsx` + others | NOT YET DECIDED |
| KPI Card | `src/components/abox/kpi-card.tsx` + `Stat`/`StatCard` | NOT YET DECIDED |
| Empty State | `src/components/abox/empty-state.tsx` + kit states | NOT YET DECIDED |
| Loading State | `src/components/ui/skeleton.tsx` + kit loaders | NOT YET DECIDED |
| Dialog / Drawer | `src/components/ui/{dialog,sheet,drawer}.tsx`, `m06/kit.tsx` `Sheet` | NOT YET DECIDED |
| Tooltip / Popover | `src/components/ui/{tooltip,popover}.tsx` | same existing production sources, IF evidence supports it |
| Navigation | `src/lib/nav-config.ts` + three shells | NOT YET DECIDED |
| Icon Container | no owner | FUTURE FILE — NOT CREATED |
| Plan / Product Card | `src/components/abox/plan-card.tsx` | same existing production source, IF evidence supports it |
| Cart / Summary | inline in `src/routes/cart.tsx`, `quote.tsx`; `abox/quote-edit-panel.tsx` | NOT YET DECIDED |
| Search / Filter controls | `lucie/ui.tsx`, `m06/screens/common.tsx`, inline in `plans.index.tsx` | NOT YET DECIDED |
| Pagination | none in production | DEFERRED |

No future file is created by this phase.

---

## SECTION 15 — FINAL DECISION REGISTER

Unanswered by design, unranked, unprioritized. Each must be settled before any implementation phase touches the concept.

1. Should the multiple card/surface implementations remain separate, or become variants of one source, given today's differing padding and radius?
2. Should 32 / 36 / 40 / 44 / 48px controls remain separate density variants, or resolve to a smaller set, given `h-10` (139) and `h-11` (66) dominate?
3. Which table implementations can share a canonical foundation — `DataTable` (19), `lucie/Table`, the five raw `<table>` routes — and which must stay separate?
4. Which form systems can share primitives — `ui/form.tsx`, `m06/kit.tsx` fields, raw elements in 15+ routes?
5. Which page headers are global versus experience-specific — `abox/PageHeader` (23), `lucie/PageHead`, `lucie-app/PageHeader`, inline headings?
6. Which navigation structures can share primitives while retaining shell-specific behaviour, given `nav-config.ts` drives two shells and the marketplace shell is inline?
7. Which spacing values, if any, are safe to centralize without changing output?
8. Should the status tone *shell* be canonical while the five tone vocabularies stay with their modules, or should the vocabularies also converge?
9. Should `ACTION_PILL` remain class constants, or become a component with props?
10. Should `ui/button.tsx`, `ACTION_PILL` and `m06 Btn` coexist permanently as experience treatments, or become variants of one source?
11. Do the four route-local kits (`m06`, `m08`, `lucie`, `lucie-app`) keep their own components permanently, or do specific concepts graduate to shared?
12. What happens to the zero-consumer modules `planai-assistant.tsx`, `overflow-text.tsx`, `placeholder-screen.tsx`, `theme-toggle.tsx`, `AboxWordmark`, `ToothIcon`, `ui/table.tsx`, `ui/pagination.tsx`?
13. Should overlays converge on `ui/dialog.tsx` + `ui/sheet.tsx`, or does `m06 Sheet` stay separate?
14. Is there an icon-size scale and an icon-container model, or do literals remain intentional per context?
15. Do the three shells share extracted primitives (header bar, container width, account control), or stay fully independent?
16. Which typography literals may move behind utilities without altering a single line break?

---

## FUTURE OPPORTUNITIES — NOT IMPLEMENTED

Recorded as observations only, with no recommendation attached: unowned repeated surface pattern; five parallel tone systems; four parallel route-local kits; zero-consumer modules; unused primitives; no density model; no icon scale; marketplace shell navigation written inline while two shells are data-driven.

---

## VALIDATION RECORD

1. No production file modified — confirmed; only this document was written.
2. No production component created — confirmed.
3. No production token created or changed — confirmed.
4. No route changed — confirmed.
5. No navigation changed — confirmed.
6. No branding or marketplace code changed — confirmed.
7. All component and file paths named above exist in the current tree — confirmed by directory listing and search.
8. All consumer counts come from searches of the current code performed for this document — confirmed.
9. All duplicate records cite the actual files and observed differences — confirmed.
10. No winner, ranking, score or recommendation appears — confirmed.
11. Current architecture and future architecture are separated by section and by label — confirmed.
12. Every proposed future canonical source is labelled future, `NOT YET DECIDED`, or `FUTURE FILE — NOT CREATED` unless it already exists — confirmed.
13. The document states explicitly that Phase 12 does not implement the component architecture — stated at the top.
14. The preservation contract requires exact visual and behavioural equivalence — stated at the top and in §9.
