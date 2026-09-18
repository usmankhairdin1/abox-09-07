# Phase 22 — DataTable Canonical Production Proof (PLAN ONLY)

Audit-only phase. Determine whether the existing shared ABox DataTable is reusable and canonical for its current verified consumers, using the same zero-diff methodology as ActionPill, StatusBadge, KpiCard and PageHeader. No production change.

The single deliverable of the execution phase is the document `.lovable/phase-22-datatable-canonical-production-proof-plan.md`. (Plan mode allows me to write only `.lovable/plan.md`, so the evidence below is recorded here and will be written into that file on approval.)

## 1. Current source inventory (measured now)

- Source: `src/components/abox/data-table.tsx`
- Hash before any work: `63c1e60eed38407aa9d6e6301b362637`
- Dependencies: only `cn` from `@/lib/utils`. No ABox or shadcn/UI primitive is imported. Consumers supply StatusBadge, links, buttons etc. through `cell` renderers.

## 2. Consumer inventory (production only; `design-system.tsx` excluded)

- **19 production importer files, 26 call sites.**
- Files: `agency.organization-admin`, `agency.organizations.index`, `app.agency.entities`, `app.agency.producers`, `app.agency.statements`, `app.commissions`, `app.customers.index`, `app.jet.acl`, `app.jet.appointments`, `app.jet.audit`, `app.jet.notifications`, `app.jet.platform` (7 call sites), `app.jet.products`, `app.tasks`, `marketplace.admin.availability.index`, `marketplace.admin.participants.index`, `marketplace.admin.referral-links.index`, `platform.marketplaces.index`, `platform.organizations.index` (2 call sites).
- Reference-only consumer: `src/routes/design-system.tsx` (1 call site) — excluded from all counts.

## 3. Prop/API inventory (measured)

API: `columns` (required), `rows` (required), `getRowId` (required), `caption?`, `empty?`, `onRowClick?`, `ariaLabel?`. `Column<T>` = `key`, `header`, `cell`, `className?`, `align?: left|right|center`. No defaults except `empty ?? "No results."`.

Production frequency: `columns` 26, `rows` 26, `getRowId` 26, `ariaLabel` 26, `empty` 4 (`agency.organizations.index`, `app.customers.index`, `agency.organization-admin`, `marketplace.admin.referral-links.index` — three strings, one JSX node), `caption` **0**, `onRowClick` **0** (the only `onRowClick` in the app is on the *lucie-app* DataTable in `app.jet.exceptions.tsx`). The component itself has no `className` prop; styling variance happens per column via `Column.className` and `align`, used across 14 route files.

Feature answers: no consumer uses component-level sorting, filtering, pagination, row selection, expandable rows, loading state or custom wrapper — none of those exist in the component. Filtering/sorting, when present, is done by consumers on the `rows` array before passing it in (e.g. `agency.organizations.index`, `app.customers.index`). Row actions and custom cell content are supplied through `cell` renderers.

## 4. Implementation anatomy to document verbatim

Wrapper `div.overflow-hidden.rounded-lg.border.border-hairline.bg-card` > `div.overflow-x-auto` > `table.w-full.min-w-[640px].text-sm` with optional `caption.sr-only`; `thead` with hairline bottom border and 10px uppercase `tracking-[0.18em]` muted headers, `th` `scope="col"` `px-5 py-4`; `tbody` rows `group border-b border-hairline/60 … hover:bg-panel/40`, `last:border-0`; cells `px-5 py-4`, right-aligned cells get `tabular-nums`; first cell of each row carries an `aria-hidden` 2px primary left bar that scales on group hover (200ms transform transition); empty state is a single `colSpan` cell `px-5 py-10 text-center`. `aria-label` on the table; no ARIA sort, no roles beyond native semantics; no focusable elements from the component itself.

## 5. Alternate table systems (recorded, not ranked, not converged)

- **B. `Table<T>` in `src/components/lucie/ui.tsx`** — separate reusable table, `min-w-[520px]`, `rounded-xl`, own empty rendering.
- **B. `DataTable<T>` in `src/components/lucie-app/ui.tsx`** — different API (`keyOf`, `Column.head`, no `ariaLabel`/`caption`/`align`), empty state rendered as a dashed panel instead of a table row, `align-top` rows, `hover:bg-surface/60` only when clickable. Consumers: `app.employer.census`, `app.employer.results`, `app.jet.entitlements`, `app.jet.exceptions` (the sole `onRowClick` user).
- **C. Route-local raw `<table>`**: `agency.organization-imports.index`, `agency.organization-imports.$importJobId`, `agency.organization-defaults.apply`, `marketplace.admin.releases.compare`, `app.employer.ichra`.
- **B/idle. `src/components/ui/table.tsx`** — shadcn primitive with no production consumer (only design-reference modules mention it).
- **D/F.** Card/list layouts and definition lists that read as tables are out of scope unless they render `<table>`.

## 6. Proposed proof-gate consumers

1. `/app/tasks` — simplest static table, no empty prop.
2. `/app/customers` — consumer-side filtering plus JSX `empty` node; exercises the empty branch by filtering to zero.
3. `/app/commissions` — 4 right-aligned numeric columns (`tabular-nums`) and money formatting.
4. `/app/jet/platform` — 7 call sites on one page, including inline column arrays.
5. `/platform/organizations` — 2 tables on one page, one conditional on pending requests.
6. `/marketplace/admin/participants` — marketplace/admin shell context.
7. `/agency/organization-admin` — dynamic downline rows plus string `empty`.

Rationale: together they cover every prop actually used, both empty-prop shapes, column `align`/`className` variance, multi-instance pages, and all three shells.

## 7. Zero-diff verification protocol (for the future proof phase)

Per consumer, at 1440 / 834 / 390: capture `tagName` tree, full class strings, `getComputedStyle` for wrapper/table/thead/th/tr/td (font-size, weight, line-height, letter-spacing, padding, border color/width, radius, background, overflow), `getBoundingClientRect` for table, header row and first three body rows/columns, horizontal-scroll behaviour of the `min-w-[640px]` rule at 390px, hover state on a row (left bar `scaleY` 0 → 1, `hover:bg-panel/40`), and the empty branch via consumer-owned filters only. Keyboard/accessibility: confirm the table is not focusable, `aria-label` matches, the left bar and any decorative nodes stay `aria-hidden`, and that focus order runs through consumer-rendered links/buttons inside cells. Also record: console clean, `tsgo` typecheck, build OK, and the pre-existing ESLint/Prettier findings on `data-table.tsx` left unfixed. Dynamic data is handled by using existing route sample/store data and reading it from the DOM rather than seeding anything; no test data is added to production.

## 8. Regression / safety contract

Zero production edits. No migration, rename, merge, prop change, DOM change, class change, styling, spacing, typography, responsive, route, navigation, business-logic, branding, marketplace-asset or shell change. Alternate table systems stay exactly as they are. The reference layer is not evidence and gains no second DataTable. `git status` must be clean at the end.

## 9. Open decisions (left unresolved)

`caption` and `onRowClick` have zero production consumers; the component has no sorting/filtering/pagination/selection/loading API while several routes implement those around it; two DataTable APIs coexist (`getRowId`/`header` vs `keyOf`/`head`) with different empty-state rendering; five route-local raw tables exist; no `className` escape hatch at component level; no mobile/card representation — the 640px minimum forces horizontal scroll at 390px; no `aria-sort` or sortable-header semantics; `ui/table.tsx` is unused.

## 10. Non-goals and expected boundary

This phase can establish only whether the current implementation renders consistently and correctly for its 19 files / 26 call sites without modification. It cannot establish that alternate tables should converge, that missing features should be added, or that any implementation is preferable to another.
