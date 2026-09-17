# Phase 15 — Canonical Production Component Library Definition & Implementation Preparation

**Mode:** SPECIFICATION ONLY. Nothing in this document has been implemented.
**Application state:** unchanged. No production file was created, modified, renamed, moved, deleted, or reformatted in this phase.
**Only file produced by Phase 15:** this document.

---

## 1. Scope, preservation rules, and status vocabulary

### 1.1 Preservation rule

The current running application is the source of truth. Any future canonical component that cannot be introduced with byte-for-byte rendered parity for a given consumer is recorded here as `BLOCKED` or `FUTURE DECISION`. No winner is selected in this phase; no implementation is preferred because it "looks cleaner".

### 1.2 Status vocabulary (categorical only, no scores, no ranking)

`CURRENT SHARED` · `CANONICAL CANDIDATE` · `FUTURE CANONICAL` · `EXPERIENCE-SPECIFIC` · `PATTERN` · `ROUTE-LOCAL` · `RUNTIME-OWNED` · `OBSERVED VARIATION` · `BLOCKED` · `FUTURE DECISION` · `DEFERRED`

### 1.3 Evidence labels used throughout

`CURRENT IMPLEMENTATION` — verified in code today.
`OBSERVED VARIATION` — more than one implementation exists today, preserved as-is.
`FUTURE CANONICAL TARGET` — proposed only.
`FUTURE DECISION` — unresolved, requires human approval.
`MIGRATION PREREQUISITE` — must be true before any future migration.

### 1.4 Excluded from all production counts

`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`. These are documentation support and have zero production importers.

---

## 2. Re-measured production usage inventory (CURRENT IMPLEMENTATION)

Counts are "number of production files that reference the source", measured by import/reference search with the reference layer excluded.

### 2.1 Directory census

| Area | Source | Count |
| --- | --- | --- |
| UI primitives | `src/components/ui/*` | 49 files |
| ABox modules | `src/components/abox/*` | 27 modules + `abox/decor` |
| Shells | `internal-shell`, `marketplace-shell`, `member-shell` | 3 |
| Route-local kits | `m06`, `m06/screens`, `m08`, `lucie`, `lucie-app`, `ai-elements`, `icons` | 7 collections |
| Routes | `src/routes/*` | flat file-route tree (no nested route folders) |

### 2.2 ABox / shared component consumers

| Component | Referencing production files |
| --- | --- |
| InternalShell | 92 |
| StatusBadge | 91 |
| ACTION_PILL | 36 |
| PageHeader (ABox) | 34 |
| MarketplaceShell | 32 |
| DataTable (ABox) | 26 |
| Button (`ui/button`) | 22 |
| KpiCard | 19 |
| EmptyState (ABox) | 12 |
| PlanCard | 7 |
| MetalBadge | 6 |
| MemberShell | 6 |
| ModuleTabs | 3 |
| CarrierMark | 3 |
| SaveContinueButton | 3 |
| DownlineWizardStepper | 8 |
| DownlineContextBanner | 6 |
| SuspendedMarketplaceNotice | 2 |
| ShoppingPathBar | 2 |
| Logo (`AboxMark` / `AboxWordmark`) | 5 |
| ProductSwitcher | 1 |
| QuoteEditPanel | 1 |
| OverflowText | 1 |
| decor | 1 |
| motion | 1 |

### 2.3 UI primitive consumers (non-zero only)

button 22 · input 7 · select 7 · card 6 · label 5 · skeleton 4 · dialog 4 · tooltip 4 · dropdown-menu 3 · sheet 3 · tabs 3 · textarea 3 · separator 2 · alert 1 · badge 1 · button-group 1 · checkbox 1 · command 1 · drawer 1 · hover-card 1 · input-group 1 · popover 1 · progress 1 · radio-group 1 · slider 1 · sonner 1 · spinner 1 · switch 1 · toggle 1

All other primitives in `src/components/ui` currently have zero production importers (see §25).

### 2.4 Route-local kit consumers

| Kit | Referencing production files |
| --- | --- |
| `components/lucie/ui` | 11 |
| `components/m06/kit` | 10 |
| `components/lucie-app/ui` | 7 |
| `components/lucie-app/frames` | 7 |
| `components/m08/kit` | 2 |
| `components/ai-elements/*` | 1 each |
| `components/icons/tooth-icon` | 1 |

### 2.5 Cross-cutting pattern counts

- Files using `react-hook-form`: **1** (forms are overwhelmingly hand-rolled).
- Files containing a raw `<table` element: **9**.
- Files using `Skeleton` or `animate-pulse`: **10**.
- Files referencing `Breadcrumb`: **1**.
- Pagination: no production consumer of `ui/pagination`.

---

## 3. Canonical qualification criteria

A component becomes a **FUTURE CANONICAL** target only when all applicable conditions hold: repeated production usage or clearly shared responsibility; stable conceptual responsibility; a reusable API boundary; predictable composition; identifiable owner; identifiable foundation dependencies; variants representable without consumer-specific hacks; states representable without touching unrelated behavior; a statable accessibility contract; documentable responsive behavior; migration verifiable with exact regression evidence; predictable propagation to verified consumers.

Explicitly **not** sufficient: similar appearance, similar JSX, similar Tailwind classes, same color, same padding, same icon, same markup shape.

Insufficient evidence ⇒ classify as `FUTURE DECISION`, `LOCAL / EXPERIENCE-SPECIFIC`, `PATTERN`, `ROUTE-LOCAL`, or `RUNTIME-OWNED`.

---

## 4. Canonical register (categories A–L)

Each entry lists: current source · consumers · responsibility · qualification · future source · future export · API · variants/states/sizes/density · dependencies · responsive · accessibility · composition · experience boundary · migration prerequisites · regression · incompatibilities · owner · status.

### A. Actions

**A1. ActionPill**
- Current source: `src/components/abox/action-pill.ts` (class-string map, not a component).
- Consumers: 36 files.
- Responsibility: the rounded filled/outline action treatment repeated verbatim across routes.
- Qualifies: single owner already exists; exact strings; 8 named variants (`primaryXs/Md/Lg`, `outlineXs/Sm/SmCard/Md/Lg`).
- Future source: `src/components/abox/actions/action-pill.tsx` (component wrapper) with the existing class map re-exported unchanged.
- API (FUTURE CANONICAL TARGET): `variant: "primary" | "outline"`, `size: "xs" | "sm" | "md" | "lg"`, `surface?: "card"`, `asChild`, standard button/anchor props.
- Sizes today: h-8 / h-9 / h-10 / h-11 — all four preserved, no universal height.
- Dependencies: `--primary`, `--primary-foreground`, `--border`, `--accent`, rounded-full, text-xs/text-sm, gap-1/1.5, px-3/4/5/6.
- Accessibility: renders `button` or `a` per consumer; focus styling is currently inherited from browser default plus hover classes — **OBSERVED VARIATION**, no focus ring is part of the pill strings. Do not add one.
- Incompatibility: `outlineSmCard` differs only by `bg-card`; `primaryXs` uses `gap-1`, others `gap-1.5`. Any prop model must reproduce these exactly.
- Owner: ABox core actions. Status: `CANONICAL CANDIDATE`.

**A2. Button (`ui/button.tsx`)**
- Consumers: 22 files. Variants: default/destructive/outline/secondary/ghost/link. Sizes: default h-9, sm h-8, lg h-10, icon h-9, icon-sm h-8. Radius `rounded-md`; `[&_svg]:size-4`; `focus-visible:ring-1 ring-ring`; `disabled:opacity-50`.
- Status: `CURRENT SHARED`. It is already canonical for shadcn-shaped buttons and must **not** absorb ACTION_PILL (different radius, height set, shadow, focus behavior).
- Future source: unchanged at `src/components/ui/button.tsx`.

**A3. SaveContinueButton** — 3 consumers, wizard-specific submit affordance. Status: `EXPERIENCE-SPECIFIC` (agency onboarding).
**A4. M06 `Btn`** — route-local button in `m06/kit.tsx`. Status: `ROUTE-LOCAL`.
**A5. Inline/icon-only/link-like controls** — repeated inline class strings across routes with differing heights and hover treatments. Status: `OBSERVED VARIATION` / `FUTURE DECISION`.

### B. Forms

**B1. Field primitives** — `ui/input` (7), `ui/select` (7), `ui/textarea` (3), `ui/label` (5), `ui/checkbox` (1), `ui/radio-group` (1), `ui/switch` (1). Status: `CURRENT SHARED`.
**B2. `ui/form.tsx` + react-hook-form** — only **1** production file uses react-hook-form. Status: `CURRENT SHARED (low adoption)` — not a canonical target; standardizing validation is out of scope.
**B3. M06 form kit** — `Field`, `TextInput`, `TextArea`, `Picker` in `m06/kit.tsx`, 10 consumers. Own label/description/error conventions and own control heights. Status: `ROUTE-LOCAL`, extraction `BLOCKED` (error presentation and heights differ from `ui/*`).
**B4. Lucie-app `Field`**, **Lucie `Select` / `Search`** — separate field family, 11 + 7 consumers. Status: `ROUTE-LOCAL`.
**B5. FormField compound** — three coexisting field families. Status: `FUTURE DECISION` (see §31 Q3).

### C. Display

**C1. StatusBadge** — `src/components/abox/status-badge.tsx`, 91 consumers. Tones: sage/primary/warning/muted/destructive/info via `--tone` + `color-mix`. Fixed size (px-2.5 py-0.5, 10px uppercase, tracking .12em, 1.5px dot). Status: `CURRENT SHARED` → `FUTURE CANONICAL` (it is already the canonical status surface). No new tones may be added in migration.
**C2. MetalBadge** — 6 consumers, solid `--metal-*` background with `--metal-*-fg` foreground, 6 tiers including Expanded Bronze. Kept **separate** from StatusBadge: different semantics (product tier, not state). Status: `CURRENT SHARED`.
**C3. `ui/badge`** (1), **`ui/alert`** (1) — Status: `CURRENT SHARED (low adoption)`.
**C4. Lucie `Tag` / `PostureTag`**, **Lucie-app `StatusChip`**, **M06 `StatusTag`**, **M08 `OutcomeTag` / `ProvenanceChip`** — five further tone vocabularies. Status: `OBSERVED VARIATION` / `ROUTE-LOCAL`. Not merged.
**C5. CarrierMark** (3) — deterministic illustrative monogram. Status: `CURRENT SHARED`.
**C6. OverflowText** (1) — Status: `PATTERN`.

### D. Containers / Surfaces

**D1. `ui/card`** — 6 consumers. **D2. KpiCard** — 19 consumers, tone map default/primary/sage/warning, CountUp numeric, corner icon tile. **D3. PlanCard** — 7 consumers, commerce surface. **D4. Lucie `Section`**, **Lucie-app `Section` / `StatCard`**, **M08 `BlockerCard`** — route-local surfaces. **D5. Inline surfaces** — `rounded-lg border border-hairline bg-card` and `rounded-2xl border border-border bg-surface` repeated inline across routes with **differing padding** (p-4 / p-5 / p-6) and differing radius.
- Status: `OBSERVED VARIATION`. A single universal Card is **not** proposed. `FUTURE CANONICAL TARGET`: a *family* — `SurfaceCard` (hairline/card) and `PanelCard` (border/surface) — only if padding can be an explicit variant set reproducing every current value. Otherwise `BLOCKED`.

### E. Data

**E1. DataTable (ABox)** — 26 consumers. API: `columns: Column<T>[]` (`key`, `header`, `cell`, `className`, `align`), `rows`, `getRowId`, `caption`, `empty`, `onRowClick`, `ariaLabel`. Wrapper `rounded-lg border border-hairline bg-card`, `min-w-[640px]`, uppercase 10px headers, horizontal overflow. Status: `CURRENT SHARED` → `FUTURE CANONICAL`.
**E2. Lucie `Table<T>`** (11-file kit) and **Lucie-app `DataTable<T>`** (7-file kit) — separate generic table APIs with their own densities. Status: `ROUTE-LOCAL`. Merging is `BLOCKED` (different row/cell padding and header treatment).
**E3. Raw `<table>` implementations** — 9 files. Status: `OBSERVED VARIATION`.
**E4. `ui/table`, `ui/pagination`** — zero production consumers (see §25). Sorting/filtering/pagination are implemented per-screen today; no shared pagination component exists.

### F. Navigation

**F1. InternalShell** (92), **MarketplaceShell** (32), **MemberShell** (6) — three shells with distinct headers, navigation sources, and content widths. Status: `CURRENT SHARED`, shells remain **separate**; merging is explicitly out of scope.
**F2. `src/lib/nav-config.ts`** — `WORKSPACES`, `MEMBER_NAV`. Status: `CURRENT SHARED` data source; not to be changed.
**F3. ModuleTabs** (3) — Status: `CURRENT SHARED`.
**F4. Breadcrumbs** — 1 consumer of `ui/breadcrumb`. Status: `DEFERRED`.
**F5. Mobile navigation** — implemented inside each shell. Status: `EXPERIENCE-SPECIFIC`.

### G. Overlays

`ui/dialog` (4), `ui/sheet` (3), `ui/popover` (1), `ui/tooltip` (4), `ui/dropdown-menu` (3), `ui/drawer` (1), `ui/hover-card` (1), M06 `Sheet` (route-local). Status: `CURRENT SHARED` for the Radix primitives; M06 `Sheet` is `ROUTE-LOCAL`. A `DialogSections` compound is `FUTURE DECISION` (insufficient repetition evidence).

### H. Feedback

**H1. EmptyState (ABox)** — 12 consumers; dashed `border-border-strong`, `bg-surface/60`, DiagonalWeave decor, icon tile, `text-display text-2xl`. Status: `CURRENT SHARED` → `FUTURE CANONICAL`.
**H2. Lucie-app `EmptyState`**, **M08 `EmptyRows` / `Denied`**, **M06 `StateBlock` / `PendingM00` / `OwnedElsewhere`** — separate empty/denied families. Status: `ROUTE-LOCAL`.
**H3. Loading** — `ui/skeleton` (4), `animate-pulse` inline, `M08 LoadingRows`, `Lucie-app LoadingRows`, `ui/spinner` (1). Status: `OBSERVED VARIATION`.
**H4. Toast** — `ui/sonner` (1) plus M06 `Toast`. Status: `OBSERVED VARIATION`.

### I. Commerce

PlanCard (7), MetalBadge (6), CarrierMark (3), QuoteEditPanel (1), ShoppingPathBar (2), ProductSwitcher (1), cart/quote summary surfaces (inline in `cart.tsx` / quote routes). Status: `EXPERIENCE-SPECIFIC` to Shopping/Commerce, except MetalBadge/CarrierMark which are `CURRENT SHARED` display components. CartSummary is `PATTERN` (inline today).

### J. Brand

`src/components/abox/logo.tsx` (`AboxMark`, `AboxWordmark`, 5 consumers, code-drawn), `public/favicon.ico`. Runtime branding lives in `app.jet.branding.tsx` and `marketplace.admin.brand.tsx`. Status: `CURRENT SHARED` for the marks; branding configuration is `RUNTIME-OWNED` (§12).

### K. Shell

See F1. Status: `CURRENT SHARED`, boundary fixed.

### L. Compound components

See §14. None are created in this phase.

---

## 5. Button / action architecture

| Treatment | Source | Radius | Heights | Focus | Shadow | Consumers |
| --- | --- | --- | --- | --- | --- | --- |
| shadcn Button | `ui/button.tsx` | `rounded-md` | 8/9/10 + icon 8/9 | `focus-visible:ring-1 ring-ring` | `shadow` / `shadow-sm` per variant | 22 files |
| ACTION_PILL | `abox/action-pill.ts` | `rounded-full` | 8/9/10/11 | none in the string | none | 36 files |
| M06 `Btn` | `m06/kit.tsx` | route-local | route-local | route-local | route-local | 10 files |
| SaveContinueButton | `abox/save-continue-button.tsx` | own | own | own | own | 3 files |
| Inline / icon-only / link-like | route files | mixed | mixed | mixed | mixed | many |

**Conclusion (FUTURE CANONICAL TARGET):** two peer action components — `Button` (square-ish, shadowed, focus-ring) and `ActionPill` (pill, unshadowed) — plus experience extensions. A single component cannot represent both without changing rendered output, so merging is `BLOCKED`. No treatment is merged in this phase.

---

## 6. Page header / section header architecture

| Implementation | Source | Structure | Consumers |
| --- | --- | --- | --- |
| ABox PageHeader `default` | `abox/page-header.tsx` | eyebrow/scrId · 12–14 icon tile · `text-display text-3xl md:text-4xl` · description `text-lg` · `mb-12` · animated hairline | 34 files (both variants) |
| ABox PageHeader `compact` | same file | no eyebrow · 9 icon tile · `text-xl md:text-2xl` · description `text-xs` · `mb-6` · no hairline | — |
| Lucie `PageHead` | `lucie/ui.tsx` | own head structure | 11-file kit |
| Lucie-app `PageHeader` | `lucie-app/ui.tsx` | own head structure | 7-file kit |
| Section headers | `lucie/ui.tsx` `Section`, `lucie-app/ui.tsx` `Section`, `m08/kit.tsx` `M08Section` | section-level heading + body | route-local |
| Marketing hero headings | landing routes | inline display headings | route-local |
| Toolbar headers | `lucie/ui.tsx` `Toolbar` + inline | inline | route-local |

**Conclusion:** no universal header. Canonical shared responsibility = "page opening: context label, title, description, actions, optional icon, optional rule". ABox PageHeader is the `CANONICAL CANDIDATE` for Marketplace/Member/Admin openings; Lucie and Lucie-app heads stay `ROUTE-LOCAL`; marketing heroes stay `EXPERIENCE-SPECIFIC`.

---

## 7. Card / surface architecture

Documented differences today (CURRENT IMPLEMENTATION): borders split between `border-border`, `border-hairline`, `border-border-strong` (dashed); backgrounds split between `bg-card`, `bg-surface`, `bg-surface/60`, `bg-background`; radius split between `rounded-lg`, `rounded-xl`, `rounded-2xl`; padding split between `p-4`, `p-5`, `p-6`, and header/body/footer split only in `ui/card`; shadows present in `ui/card` and absent in most ABox/inline surfaces.

**FUTURE CANONICAL TARGET:** a surface *family* with explicit `tone` (card/surface/dashed), `radius` (lg/xl/2xl) and `padding` (4/5/6) variants that reproduce every current combination, plus KpiCard and PlanCard as distinct display components on top. Any variant that cannot reproduce an existing surface exactly is `BLOCKED`.

---

## 8. Form architecture

- True primitives today: `ui/input`, `ui/select`, `ui/textarea`, `ui/label`, `ui/checkbox`, `ui/radio-group`, `ui/switch`.
- Compound/pattern today: `ui/form.tsx` (1 consumer), M06 `Field`/`TextInput`/`TextArea`/`Picker`, Lucie `Select`/`Search`, Lucie-app `Field`.
- Validation: mostly hand-rolled per screen; react-hook-form appears in a single file; zod is used for data/domain validation elsewhere, not as a shared form contract.
- Error, helper text, required-indicator and description presentation differ per family. Field heights differ per family.

**No migration, no standardization, no height change, no error-presentation change.** Three form families are recorded as coexisting; their relationship is `FUTURE DECISION`.

---

## 9. Data / table architecture

Three generic table systems (ABox DataTable, Lucie `Table<T>`, Lucie-app `DataTable<T>`) plus 9 raw `<table>` implementations. Densities, header casing, row hover, and action-column conventions differ. Sorting and filtering are screen-owned. Mobile behavior today is horizontal overflow (`min-w-[640px]` in ABox DataTable); no card-collapse table exists.

**Conclusion:** ABox DataTable is the `CANONICAL CANDIDATE` for its own 26 consumers only. The other two systems remain separate implementations. Unifying them is `BLOCKED` pending density and header decisions (§31 Q4).

---

## 10. Status / tone architecture

Five-plus tone vocabularies coexist:

1. `StatusBadge` — sage/primary/warning/muted/destructive/info (`color-mix` on `--tone`).
2. `ui/badge` and `ui/alert` — shadcn variants.
3. Lucie `Tag` / `PostureTag`.
4. Lucie-app `StatusChip`.
5. M06 `StatusTag`; M08 `OutcomeTag` / `ProvenanceChip`.
6. `MetalBadge` — product tier semantics, deliberately separate.

No universal status taxonomy is invented. Generic state semantics and metal/tier semantics remain distinct. Future semantic roles are documented without selecting a winner.

---

## 11. Navigation / shell architecture

Shells stay separate (InternalShell 92, MarketplaceShell 32, MemberShell 6). `nav-config.ts` (`WORKSPACES`, `MEMBER_NAV`) remains the single navigation data source and is not touched. Candidate future *primitives* only where responsibility is genuinely shared: `NavItem` rendering, active-state marking, and `ModuleTabs`. Breadcrumbs and pagination have insufficient adoption — `DEFERRED`.

---

## 12. Branding & marketplace boundary (RUNTIME-OWNED)

| System | Route | Source | Responsibility |
| --- | --- | --- | --- |
| Branding & White-Label | `/app/jet/branding` | `src/routes/app.jet.branding.tsx` | tenant brand configuration at runtime |
| Marketplace Brand | `/marketplace/admin/brand` | `src/routes/marketplace.admin.brand.tsx` | marketplace-facing brand settings |
| Marketplace Assets | `/marketplace/admin/assets` | `src/routes/marketplace.admin.assets.tsx`, `src/lib/marketplace-store.ts` | LOGO / MARK / FAVICON / HERO upload, scan, validate, preview, retire |
| Static brand marks | `abox/logo.tsx`, `public/favicon.ico` | code-drawn marks | design-system-owned |

These are runtime data systems, not design-system components. They consume tokens and components but are never absorbed by the library. No competing branding editor or asset manager is proposed.

---

## 13. Route-local kit boundary

| Kit | Source | Consumers | Reusable pieces (observed) | Intentionally local | Extraction blockers |
| --- | --- | --- | --- | --- | --- |
| M06 | `components/m06/kit.tsx`, `registry.tsx`, `screens/*`, `workforce-page.tsx` | 10 | `Field`, `TextInput`, `TextArea`, `Picker`, `StatusTag`, `Btn`, `Sheet`, `Toast` | `QueryBlock`, `PendingM00`, `OwnedElsewhere`, `MetaRail`, `StateBlock` | own control heights and error presentation |
| M08 | `components/m08/kit.tsx`, `screens.tsx`, `selling-setup.tsx` | 2 | `LoadingRows`, `EmptyRows`, `M08Section`, `BlockerCard` | `TraceRail`, `ApprovalDependentNotice`, `ReviewModeBanner`, `DimensionStrip`, `ProvenanceChip`, `ContextRibbon`, `M13Dependency`, locale provider | governance semantics are M08-specific |
| Lucie | `components/lucie/ui.tsx` | 11 | `Section`, `Table`, `Toolbar`, `Search`, `Select`, `Stat`, `KV`, `Note` | `Id`, `IdList`, `PostureTag`, `PageHead` | traceability-specific vocabulary and density |
| Lucie-app | `components/lucie-app/ui.tsx`, `frames.tsx` | 7 each | `PageHeader`, `Section`, `StatCard`, `DataTable`, `EmptyState`, `LoadingRows`, `Stepper`, `Field`, `Money`, `StatusChip`, `NotPermitted` | frames | parallel header/table/field families |
| ai-elements | `components/ai-elements/*` | 1 each | conversation/message/prompt-input/shimmer | all | assistant-specific |
| icons | `components/icons/tooth-icon.tsx` | 1 | `ToothIcon` | — | none; simply low usage |

Nothing is extracted now.

---

## 14. Compound component architecture (FUTURE CANONICAL TARGET, none created)

| Compound | Production evidence today | Anatomy | Status |
| --- | --- | --- | --- |
| FormField | three families (ui/form, M06, Lucie-app) | label · control · description · error | `FUTURE DECISION` |
| ResultToolbar | plan results + Lucie `Toolbar` + inline toolbars | count · sort · view controls | `PATTERN` |
| FilterRail | `/plans` filter rail (single, rich implementation) | group · chips · clear | `EXPERIENCE-SPECIFIC` |
| CardCollection | repeated grid wrappers | grid · card · empty | `PATTERN` |
| KPIGroup | KpiCard used in grids across 19 files | grid of KpiCard | `CANONICAL CANDIDATE` |
| TablePresentation | DataTable + caption + empty + toolbar | header · table · empty | `PATTERN` |
| PlanComparison | compare route | column set per plan | `EXPERIENCE-SPECIFIC` |
| CartSummary | inline in cart/quote routes | lines · totals · actions | `PATTERN` |
| PageOpening | PageHeader + actions + tabs | header · tabs | `CANONICAL CANDIDATE` |
| NavigationGroup | shells | group label · items · active state | `FUTURE DECISION` |
| DialogSections | 4 dialog consumers | header · body · footer | `DEFERRED` |
| Search/Filter/Results | `/plans` only | search · filters · results | `EXPERIENCE-SPECIFIC` |

---

## 15. Canonical source file map (proposed, not created)

Derived from actual ownership, not from a template. Every path below is a **future** path; none exists today.

| Future file | Responsibility | Current evidence | Safe to create later? |
| --- | --- | --- | --- |
| `abox/actions/action-pill.tsx` | pill action component over existing class map | `abox/action-pill.ts`, 36 consumers | Yes, additive |
| `abox/display/status-badge.tsx` | move of existing StatusBadge (or keep in place) | 91 consumers | Yes, but move requires import churn — `FUTURE DECISION` |
| `abox/display/metal-badge.tsx` | tier badge | 6 consumers | Yes |
| `abox/display/page-header.tsx` | page opening | 34 consumers | Yes |
| `abox/data/data-table.tsx` | editorial table | 26 consumers | Yes |
| `abox/feedback/empty-state.tsx` | empty surface | 12 consumers | Yes |
| `abox/display/kpi-card.tsx` | metric surface | 19 consumers | Yes |
| `abox/containers/surface-card.tsx` | surface family | inline surfaces | Only if padding/radius variants reproduce all current values — otherwise `BLOCKED` |
| `abox/commerce/*` | PlanCard, CarrierMark, cart summary | 7 / 3 / inline | PlanCard yes; CartSummary `FUTURE DECISION` |
| `abox/shell/*` | three existing shells | 92 / 32 / 6 | Relocation only, no merge |
| `abox/experience/*` | experience extensions | marketing/shopping/admin/member | Only with evidence |

**Recommendation recorded, not applied:** the lowest-risk future structure keeps current file paths and adds folders only for genuinely new canonical components, because relocating a 91-consumer component is pure import churn with no user-visible benefit.

---

## 16. Public API / export architecture (proposed)

For each future canonical component: component name · export path · public props · variant model · state model · size model · density model · slots · accessibility contract · legacy compatibility. Props that imply behavior not present today (e.g. `loading` on ActionPill, `sortable` on DataTable, `collapsible` on SurfaceCard) are marked `FUTURE DECISION` and must not be introduced silently. Existing prop names are preserved verbatim where a component already exists (`PageHeader`, `DataTable`, `EmptyState`, `KpiCard`, `StatusBadge`, `MetalBadge`) so that migration is a no-op at call sites.

---

## 17. Propagation model

```text
FOUNDATION (src/styles.css tokens)
  → SEMANTIC ROLE (tone, surface, text role)
    → CANONICAL COMPONENT (ActionPill, StatusBadge, PageHeader, DataTable, ...)
      → COMPOUND COMPONENT (PageOpening, KPIGroup, TablePresentation)
        → PATTERN (results toolbar, card collection, cart summary)
          → EXPERIENCE PATTERN (marketing hero, shopping rail, admin console)
            → VERIFIED CONSUMER (a route file proven at parity)
              → SCREEN
```

Allowed dependencies point **downward only**. A canonical component may depend on foundations and semantic roles; it may not depend on a pattern, an experience, a route, a store, or navigation data. Shells may depend on `nav-config.ts`; canonical components may not. Runtime branding/marketplace systems may consume components; components may never read branding state.

Change propagation: editing a canonical source changes every verified consumer at once. Consumers that copied local implementations do **not** receive the change and are recorded as intentional exceptions. The goal of future phases is genuine source-level reuse, not duplicated styling.

---

## 18. Migration eligibility classification

| Consumer group | Classification | Evidence |
| --- | --- | --- |
| 36 ACTION_PILL call sites | READY FOR FUTURE MIGRATION | already import one owned class map; wrapping is mechanical |
| 91 StatusBadge call sites | READY FOR FUTURE MIGRATION (no change needed) | already canonical |
| 34 PageHeader call sites | REQUIRES VISUAL BASELINE | two variants, animated hairline, responsive title sizes |
| 26 DataTable call sites | REQUIRES VISUAL BASELINE | column/align/overflow behavior per screen |
| 19 KpiCard call sites | REQUIRES VISUAL BASELINE | CountUp animation and tone map |
| 12 EmptyState call sites | READY FOR FUTURE MIGRATION | stable API |
| Inline surfaces | REQUIRES API ADAPTER | padding/radius/border combinations vary |
| Inline / icon-only buttons | REQUIRES BEHAVIOR BASELINE | focus and hover differ |
| M06 / M08 / Lucie / Lucie-app screens | ROUTE-LOCAL | own kits and densities |
| Marketing landing, `/plans`, `/cart`, compare | EXPERIENCE-SPECIFIC | bespoke layout and interaction |
| Branding, marketplace assets | RUNTIME-OWNED | runtime data systems |
| Form families | BLOCKED | heights and error presentation differ |
| Shells | DO NOT MIGRATE | boundary is intentional |

No consumer file was altered.

---

## 19. Exact-preservation migration contract (mandatory for any future migration)

**Before:** desktop, tablet and mobile baselines; hover/focus/active/disabled/error/loading/selected states where applicable; route and navigation verification; content verification; responsive verification; accessibility verification; business-behavior verification; console verification.

**After:** compare screenshots; rendered/computed behavior; responsive states; interactions; keyboard behavior; accessibility; routes; navigation; business logic; data behavior; asset behavior.

**Any unexplained difference ⇒ STOP. Do not accept the migration. Roll back or revise.** There is no "close enough" acceptance.

---

## 20. Design foundation dependencies

Per component, the exact dependencies are colors (`--primary`, `--border`, `--hairline`, `--card`, `--surface`, `--muted-foreground`, `--sage`, `--warning`, `--info`, `--destructive`, `--metal-*`), typography (`text-display`, `text-eyebrow`, text-[10px]/xs/sm/lg/xl/2xl/3xl/4xl, tracking-[0.12em]/[0.18em]), spacing (gap-1/1.5/2/4, px-2.5/3/4/5/6, py-0.5/4/14, mb-6/mb-12), radius (`rounded-full`, `rounded-md`, `rounded-lg`, `rounded-2xl`), borders, shadows (`shadow`, `shadow-sm` in `ui/*` only), opacity (`/60`, `/90`, `/6`), icon sizes (h-4/5/6/7, `[&_svg]:size-4`), control heights (h-8/9/10/11/12/14), density, motion (`animate-hairline`, FadeRise, CountUp) and breakpoints (`md:`, `lg:`).

Foundations are **not** centralized in this phase. Unsafe-to-centralize foundations (control heights, card padding, heading scale, focus treatment, disabled tokens, tone systems) are recorded as `MIGRATION PREREQUISITE` and reference the Phase 13 plan.

---

## 21. Experience boundaries

| Experience | Shell | Shared core | Experience extensions | Route-local |
| --- | --- | --- | --- | --- |
| Web / Marketing | none (root layout) | ActionPill, Logo, motion | hero headings, guide cards | landing routes |
| Shopping / Commerce | MarketplaceShell | StatusBadge, MetalBadge, CarrierMark, ActionPill | PlanCard, FilterRail, ShoppingPathBar, QuoteEditPanel, cart summary | `/plans`, `/cart`, compare, coverage |
| Dashboard / Admin | InternalShell | PageHeader, DataTable, KpiCard, EmptyState, StatusBadge | Lucie, Lucie-app, M06, M08 kits | agency/app/marketplace admin routes |
| Member / Account | MemberShell | PageHeader, StatusBadge | member settings layout | `member.*` routes |

No "one component for everything" architecture is proposed.

---

## 22. Accessibility contract (derived from current behavior only)

Per canonical component: semantic element; keyboard behavior; focus behavior; `focus-visible` behavior; disabled behavior; aria requirements; screen-reader behavior; decorative icons marked `aria-hidden` (as PageHeader, EmptyState, StatusBadge dot and MetalBadge already do); minimum touch target; reduced-motion considerations; error announcement where applicable.

Recorded gaps that must **not** be fixed in migration (they would change the app): ACTION_PILL strings carry no focus ring; DataTable rows with `onRowClick` are not keyboard-activatable rows; several inline icon-only controls rely on title text. These are `FUTURE DECISION` items for a separate, explicitly approved accessibility phase.

---

## 23. Responsive / density contract

Current control heights 32/36/40/44 px (h-8/9/10/11) plus 48/56 px icon tiles are all preserved; no universal control height is selected. Mobile transformations today: PageHeader title scales `text-3xl → md:text-4xl` (compact `text-xl → md:text-2xl`); icon tile `h-12 w-12 → md:h-14 md:w-14`; DataTable overflows horizontally at `min-w-[640px]`; shells switch navigation presentation at their own breakpoints; web-experience pages use the `max-w-[88rem]` container while dashboard pages do not.

---

## 24. Duplicate / overlap register (unranked, unmerged)

| Area | Implementations | Consumers | Future relationship | Migration status |
| --- | --- | --- | --- | --- |
| Buttons | ui/button · ACTION_PILL · M06 Btn · SaveContinueButton · inline | 22 · 36 · 10 · 3 · many | peers | BLOCKED (merge) |
| Page headers | ABox PageHeader (2 variants) · Lucie PageHead · Lucie-app PageHeader · inline | 34 · 11 · 7 · many | core + route-local | FUTURE DECISION |
| Cards | ui/card · KpiCard · PlanCard · StatCard · BlockerCard · inline surfaces | 6 · 19 · 7 · 7 · 2 · many | family | FUTURE DECISION |
| Forms | ui/form · M06 kit · Lucie-app Field · Lucie Select/Search | 1 · 10 · 7 · 11 | coexisting families | BLOCKED |
| Tables | ABox DataTable · Lucie Table · Lucie-app DataTable · raw tables | 26 · 11 · 7 · 9 | separate | BLOCKED |
| KPI | KpiCard · Lucie Stat · Lucie-app StatCard | 19 · 11 · 7 | separate | FUTURE DECISION |
| Empty states | ABox EmptyState · Lucie-app EmptyState · M08 EmptyRows/Denied · M06 StateBlock | 12 · 7 · 2 · 10 | core + route-local | FUTURE DECISION |
| Loading | ui/skeleton · animate-pulse · M08 LoadingRows · Lucie-app LoadingRows · ui/spinner | 4 · 10 · 2 · 7 · 1 | separate | FUTURE DECISION |
| Status tones | StatusBadge · ui/badge · ui/alert · Lucie Tag/PostureTag · Lucie-app StatusChip · M06 StatusTag · M08 OutcomeTag | 91 · 1 · 1 · 11 · 7 · 10 · 2 | distinct vocabularies | BLOCKED |
| Shells | InternalShell · MarketplaceShell · MemberShell | 92 · 32 · 6 | separate by design | DO NOT MIGRATE |
| Navigation | nav-config WORKSPACES · MEMBER_NAV · marketplace nav · ModuleTabs | — | shared data, separate rendering | DEFERRED |
| Icon plates | PageHeader tile · EmptyState tile · KpiCard tile · inline plates | 34 · 12 · 19 · many | pattern | FUTURE DECISION |
| Assistants | planai-assistant · plan-o-assistant · ai-elements | 0 · 0 · 1 | local | DEFERRED |
| Route-local kits | M06 · M08 · Lucie · Lucie-app · ai-elements · icons | 10 · 2 · 11 · 7 · 1 · 1 | remain local | ROUTE-LOCAL |

---

## 25. Legacy / unused inventory (classified only, nothing deleted)

Zero production importers, verified:

- `src/components/abox/planai-assistant.tsx` — 0
- `src/components/abox/plan-o-assistant.tsx` — 0
- `src/components/abox/placeholder-screen.tsx` — 0
- `src/components/abox/theme-toggle.tsx` — 0
- `src/components/ui/table.tsx` — 0
- `src/components/ui/pagination.tsx` — 0
- Other `ui/*` primitives with 0 consumers: accordion, alert-dialog, aspect-ratio, avatar, breadcrumb (1 reference only, via name), calendar, carousel, chart, collapsible, context-menu, input-otp, menubar, navigation-menu, resizable, scroll-area, sidebar, toggle-group

Low usage but live: `ToothIcon` (1), `OverflowText` (1), `abox/decor` (1 direct importer, plus internal use by EmptyState), `ai-elements/*` (1 each).

Status for all of the above: `DEFERRED`. No deletion, no refactor, no rename.

---

## 26. Change-impact examples

```text
ui/button.tsx            → 22 route/component files → dialog & form patterns → admin/member experiences → those screens
abox/action-pill.ts      → 36 files → toolbars, page openings, cart actions → all four experiences → broad
abox/status-badge.tsx    → 91 files → tables, cards, list rows → all four experiences → widest blast radius
ui/card.tsx              → 6 files → card collections → admin/marketing → narrow
abox/page-header.tsx     → 34 files → page openings → marketplace/member/admin → wide
form field families      → M06 10 · Lucie-app 7 · ui/form 1 → wizards & settings → admin → segmented
abox/data-table.tsx      → 26 files → table presentations → admin → wide
typography foundation    → every component → every pattern → every experience → global
spacing foundation       → every container → every pattern → every experience → global
icon-size foundation     → PageHeader, EmptyState, KpiCard, ActionPill, Button → all patterns → global
control-height foundation→ Button, ActionPill, inputs, M06 kit → all forms/toolbars → global
```

---

## 27. Future implementation sequence (not performed)

1. Freeze this specification. 2. Review canonical candidates. 3. Resolve only the decisions required to start. 4. Create canonical source files additively. 5. Implement one family at a time (suggested order: ActionPill wrapper → EmptyState → KpiCard → PageHeader → DataTable → surfaces). 6. Leave legacy consumers untouched until parity is proven. 7. Migrate only verified consumers. 8. Run the §19 regression contract after each batch. 9. Update dependency/impact records. 10. Document intentional exceptions. 11. Retire obsolete implementations only with explicit approval after proven parity. 12. Never perform bulk blind replacement.

---

## 28. Management decision register (open questions only)

1. Which canonical components may be created first — ActionPill wrapper only, or the full display set?
2. Should StatusBadge and other high-consumer components be relocated into new folders, given the import churn and zero user-visible benefit?
3. How should the three form families coexist long-term — permanent separation or eventual core field?
4. Should the three table systems remain separate permanently?
5. How should PageHeader variants be modeled — one component with variants (today) or core + experience extensions?
6. How should the seven status/tone vocabularies be represented without changing any rendered badge?
7. Which control heights (32/36/40/44) require explicit named variants?
8. Which icon-plate patterns should remain experience-specific?
9. Should the two unused assistants remain installed?
10. Which route-local kits (M06, Lucie, Lucie-app) may eventually contribute extracted primitives?
11. Should unused `ui/*` primitives remain installed?
12. Which legacy implementations may be retired after parity is proven?
13. What requires explicit management approval before any consumer migration begins?
14. Is a separate, explicitly approved accessibility phase authorized for the gaps in §22?

No question is answered by guessing.

---

## 29. Technical review checklist

Ownership defined · dependency direction one-way · single source of truth per canonical component · public APIs specified · variants specified · states specified · density specified · responsive behavior documented · accessibility documented from current behavior · experience boundaries preserved · migration eligibility classified · regression contract exact · propagation chain defined · impact mapping produced · legacy classified not deleted · branding boundary intact · marketplace boundary intact · route-local boundaries intact · Figma readiness documented.

---

## 30. Future Figma mapping (no assets created)

For each future canonical component: Figma component name; component set; variant properties (`variant`, `tone`, `surface`); state properties (default/hover/focus/active/disabled/selected/error/loading where the code has them); size properties (xs/sm/md/lg matching h-8/9/10/11); density properties; icon slot; content slots; semantic variables bound to `--primary`, `--border`, `--hairline`, `--card`, `--surface`, `--metal-*`; experience extensions; responsive guidance; accessibility notes. The library must mirror the canonical production architecture rather than trace screenshots.

---

## 31. Document relationships

- `.lovable/manual-work-map.md` — where to manually change the real app.
- `.lovable/design-system.md` — technical reference narrative.
- `.lovable/phase-12-component-architecture-plan.md` — component architecture audit.
- `.lovable/phase-13-production-foundations-centralization-plan.md` — foundation prerequisites referenced in §20.
- `.lovable/phase-14-canonical-production-component-library-plan.md` — prior library plan this document makes implementation-ready.
- `roadmap.md`, `src/lib/design/*` — reference modules, not production dependencies.

None of these files were modified in this phase.

---

## 32. Validation performed

- Exactly one new file created: `.lovable/phase-15-canonical-production-component-library-definition.md`.
- No production file created, modified, renamed, moved, or deleted.
- No production component created; no imports changed; no route changed; no style or token changed.
- Reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`) untouched.
- Application remains buildable; runtime behavior unchanged.
