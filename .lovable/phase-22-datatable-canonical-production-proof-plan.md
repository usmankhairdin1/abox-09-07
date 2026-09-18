# PHASE 22 — DataTable Canonical Production Proof Plan (PLAN / AUDIT ONLY)

Status: plan document only. No production file, component, route, style, dependency or reference implementation was changed while producing it.

---

## 1. Phase objective

Establish, using the same zero-diff proof methodology applied to ActionPill (Phase 17), StatusBadge (Phase 19), KpiCard (Phase 20) and PageHeader (Phase 21), whether the existing shared ABox DataTable is a reusable canonical production component **for its current verified consumers, without changing it**.

This phase produces evidence and a verification protocol. It selects no winner, migrates no consumer, merges no implementation and ranks no alternate table system.

---

## 2. Current source inventory (measured from current repository state)

| Item | Value |
| --- | --- |
| Source path | `src/components/abox/data-table.tsx` |
| File hash before any work (md5) | `63c1e60eed38407aa9d6e6301b362637` |
| Exported symbols | `DataTable<T>`, `Column<T>` (type) |
| Imports | `cn` from `@/lib/utils` only |
| ABox/UI primitive dependency | **None, direct or indirect.** The component imports no ABox component and no shadcn/UI primitive. Badges, links, buttons and money formatting appear inside tables only because consumers render them through `Column.cell`. |
| Foundation dependency | Tailwind utilities bound to project tokens: `border-hairline`, `bg-card`, `bg-panel`, `bg-primary`, `text-muted-foreground`, `rounded-lg`, `text-sm` |

---

## 3. Current consumer inventory

Production only. `src/routes/design-system.tsx` is the reference layer and is excluded from every count below (it contains 1 additional call site, used for documentation rendering only).

**19 production importer files — 26 production call sites.**

| # | File | Call sites |
| --- | --- | --- |
| 1 | `src/routes/agency.organization-admin.tsx` | 1 |
| 2 | `src/routes/agency.organizations.index.tsx` | 1 |
| 3 | `src/routes/app.agency.entities.tsx` | 1 |
| 4 | `src/routes/app.agency.producers.tsx` | 1 |
| 5 | `src/routes/app.agency.statements.tsx` | 1 |
| 6 | `src/routes/app.commissions.tsx` | 1 |
| 7 | `src/routes/app.customers.index.tsx` | 1 |
| 8 | `src/routes/app.jet.acl.tsx` | 1 |
| 9 | `src/routes/app.jet.appointments.tsx` | 1 |
| 10 | `src/routes/app.jet.audit.tsx` | 1 |
| 11 | `src/routes/app.jet.notifications.tsx` | 1 |
| 12 | `src/routes/app.jet.platform.tsx` | 7 |
| 13 | `src/routes/app.jet.products.tsx` | 1 |
| 14 | `src/routes/app.tasks.tsx` | 1 |
| 15 | `src/routes/marketplace.admin.availability.index.tsx` | 1 |
| 16 | `src/routes/marketplace.admin.participants.index.tsx` | 1 |
| 17 | `src/routes/marketplace.admin.referral-links.index.tsx` | 1 |
| 18 | `src/routes/platform.marketplaces.index.tsx` | 1 |
| 19 | `src/routes/platform.organizations.index.tsx` | 2 |

Every consumer imports the same way: `import { DataTable, type Column } from "@/components/abox/data-table";`.

---

## 4. Prop / API inventory

### 4.1 Declared API

```
DataTable<T>({ columns, rows, getRowId, caption?, empty?, onRowClick?, ariaLabel? })

Column<T> = {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  className?: string
  align?: "left" | "right" | "center"
}
```

Required: `columns`, `rows`, `getRowId`. Optional: `caption`, `empty`, `onRowClick`, `ariaLabel`. The only default in the component is the empty-state fallback text `"No results."`.

### 4.2 Measured production frequency (26 call sites)

| Prop | Uses | Notes |
| --- | --- | --- |
| `columns` | 26 | 24 pass a named `cols`-style array defined above the component; 2 pass an inline array (`app.jet.platform`, `design-system` excluded) |
| `rows` | 26 | static sample constants, store-derived arrays, or consumer-filtered arrays |
| `getRowId` | 26 | always an arrow returning a domain id (`r.id`, `r.organization_id`, `r.referral_link_id`, `r.participant_id`, `r.marketplace_id`, `r.availability_entry_id`, `r.request_id`, `r.key`, `r.name`) |
| `ariaLabel` | 26 | unique human-readable label on every call site |
| `empty` | 4 | `agency.organizations.index` (string), `agency.organization-admin` (string), `marketplace.admin.referral-links.index` (string), `app.customers.index` (JSX `<span>`) |
| `caption` | **0** | no production consumer |
| `onRowClick` | **0** | no production consumer of the ABox DataTable. The single `onRowClick` in the app is on the *lucie-app* DataTable in `app.jet.exceptions.tsx` |

Component-level `className`: **not part of the API** and therefore used by nobody. Styling variation is expressed per column.

### 4.3 Column-level variation

`Column.align="right"` and/or `Column.className` appear in 14 route files (`app.commissions` 4, `app.agency.statements` 4, `app.jet.platform` 5, `app.jet.products` 3, `app.jet.acl` 2, `app.agency.producers` 2, `app.customers.index` 2, `platform.organizations.index` 2, `marketplace.admin.referral-links.index` 2, plus single uses in `app.agency.entities`, `marketplace.admin.availability.index`, `platform.marketplaces.index`, `app.jet.notifications`, `marketplace.admin.participants.index`).

### 4.4 Feature questionnaire — factual answers

| Capability | Present in component? | Used by consumers? |
| --- | --- | --- |
| custom columns | yes (`Column[]`) | yes, all 26 |
| custom cell renderers | yes (`cell`) | yes, all 26 |
| custom headers | yes (`header` is `ReactNode`) | yes, all string headers today |
| custom cell styling | yes (`Column.className`, `align`) | yes, 14 files |
| custom row styling | no | n/a |
| custom table wrapper | no | n/a |
| component-level `className` | no | n/a |
| empty state | yes (single `colSpan` row) | 4 explicit, rest fall back to `"No results."` |
| sorting | no | consumers sort `rows` before passing |
| filtering | no | consumers filter `rows` before passing (`agency.organizations.index`, `app.customers.index`, others) |
| pagination | no | none |
| row selection | no | none |
| row actions | no dedicated API | rendered inside `cell` |
| expandable rows | no | none |
| loading state | no | none |
| responsive behaviour | `min-w-[640px]` inside `overflow-x-auto` (horizontal scroll) | inherited by all |

---

## 5. Current implementation anatomy (to be documented verbatim in the proof phase)

```
div.overflow-hidden.rounded-lg.border.border-hairline.bg-card
└ div.overflow-x-auto
  └ table.w-full.min-w-[640px].text-sm  [aria-label]
    ├ caption.sr-only                              (only when `caption` passed — 0 today)
    ├ thead.border-b.border-hairline
    │   .text-left.text-[10px].font-semibold.uppercase.tracking-[0.18em].text-muted-foreground
    │ └ tr > th[scope=col].px-5.py-4.font-semibold (+ text-right | text-center | Column.className)
    └ tbody
      ├ tr > td[colSpan].px-5.py-10.text-center.text-muted-foreground   (empty branch)
      └ tr.group.border-b.border-hairline/60.transition-colors.last:border-0
           .hover:bg-panel/40.relative  (+ cursor-pointer when onRowClick)
        └ td.px-5.py-4.relative (+ text-right.tabular-nums | text-center | Column.className)
           └ first cell only: span[aria-hidden].absolute.left-0.top-0.bottom-0.w-[2px]
                .origin-top.scale-y-0.bg-primary.transition-transform.duration-200
                .group-hover:scale-y-100
```

- Typography: body `text-sm`; header `10px`, `font-semibold`, `uppercase`, `tracking-[0.18em]`, muted foreground.
- Spacing: uniform `px-5 py-4` in header and body; empty cell `px-5 py-10`.
- Borders/radii/shadows: outer `rounded-lg` + 1px hairline border; header bottom hairline; row bottom `hairline/60` with `last:border-0`; **no shadow**.
- Hover: row background `panel/40`; 2px primary left indicator scales vertically over 200ms. Both are the only motion in the component.
- Selected state: none. Loading state: none. Pagination: none. Sorting: none. Filtering: none.
- Accessibility: native `table/thead/tbody/th[scope=col]/td` semantics; `aria-label` on the table; optional `sr-only` caption; decorative left bar is `aria-hidden`. No `aria-sort`, no `role` overrides, no `tabIndex`; the component renders nothing focusable — keyboard reachability inside a table comes solely from consumer-rendered links/buttons in cells.
- Consumer-specific assumptions: `getRowId` must be unique; `columns.length` drives the empty-row `colSpan`; right-aligned columns are assumed numeric (`tabular-nums` is applied unconditionally with `align="right"`).

---

## 6. Alternate table systems (recorded, not ranked, not proposed for convergence)

### A. Shared ABox DataTable
`src/components/abox/data-table.tsx` — the subject of this audit. 19 files / 26 call sites.

### B. Alternate reusable table components

1. **`DataTable<T>` in `src/components/lucie-app/ui.tsx`**
   - Consumers: `app.employer.census`, `app.employer.results`, `app.jet.entitlements`, `app.jet.exceptions`.
   - API difference: `keyOf` instead of `getRowId`; `Column.head: string` instead of `header: ReactNode` + `key`; no `ariaLabel`, no `caption`, no `align`.
   - Behavioural difference: when `rows` is empty it returns a **dashed bordered panel instead of a table**; `onRowClick` is actually used here (`app.jet.exceptions` row selection).
   - Visual difference: `rounded-xl`, `border-collapse`, `align-top` rows, `leading-relaxed` cells, hover `bg-surface/60` only when clickable, no left hover indicator, header styling applied on `th` rather than `thead`.
   - Responsive: `overflow-x-auto` on the same element as the border; same `min-w-[640px]`.

2. **`Table<T>` in `src/components/lucie/ui.tsx`**
   - Structural purpose: governance/traceability tables in the Lucie surface.
   - Differences: `min-w-[520px]`, `rounded-xl`, `border-collapse`, `text-left align-top`, empty state rendered as a paragraph before the table is constructed.

3. **`src/components/ui/table.tsx`** (shadcn primitive set)
   - **No production consumer.** Referenced only by design-reference modules under `src/lib/design/`. Recorded as present-but-idle; not a duplicate by usage evidence.

### C. Route-local raw `<table>` implementations
`agency.organization-imports.index.tsx` (`min-w-[720px]`), `agency.organization-imports.$importJobId.tsx` (`min-w-[720px]`), `agency.organization-defaults.apply.tsx` (`min-w-[560px]`), `marketplace.admin.releases.compare.tsx` (`min-w-[640px]`), `app.employer.ichra.tsx` (inline `mt-3 w-full`). Each is local markup serving one screen; none exports a component.

### D. Table-like layouts that are not tables
Key/value plates (`KV`), definition lists, card grids and stacked rows across dashboards. Out of scope: they render no `<table>` and share no API with DataTable.

### E. Specialized data grids
None found. No virtualized grid, no `@tanstack/table`, no third-party grid dependency.

### F. Mobile-only list/card representations
None bound to DataTable. All DataTable instances reach small viewports through horizontal scroll, not through an alternate mobile rendering.

### G. Marketplace/admin-specific table systems
None. Marketplace admin screens (`participants`, `availability`, `referral-links`) consume the shared ABox DataTable; `marketplace.admin.releases.compare` uses a route-local table (category C).

### H. Other feature-area table kits
The Lucie and Lucie-app kits (category B) are the only two. No further kit exports a table.

No alternate implementation is labelled a duplicate: each differs in API surface, empty-state structure, or both.

---

## 7. Consumer classification

| Class | Members |
| --- | --- |
| Basic static table (required props + `ariaLabel` only) | `app.tasks`, `app.agency.producers`, `app.agency.entities`, `app.jet.acl`, `app.jet.appointments`, `app.jet.audit`, `app.jet.notifications`, `app.jet.products`, `marketplace.admin.availability.index`, `marketplace.admin.participants.index`, `platform.marketplaces.index` |
| Numeric/right-aligned heavy | `app.commissions`, `app.agency.statements` |
| Explicit `empty` (string) | `agency.organizations.index`, `agency.organization-admin`, `marketplace.admin.referral-links.index` |
| Explicit `empty` (JSX node) | `app.customers.index` |
| Consumer-side filtering feeding `rows` | `agency.organizations.index`, `app.customers.index` |
| Store/dynamic data | `agency.organization-admin`, `platform.organizations.index`, `platform.marketplaces.index`, `marketplace.admin.*`, `app.jet.products` |
| Multiple instances on one page | `app.jet.platform` (7), `platform.organizations.index` (2) |
| Conditional rendering | `platform.organizations.index` (pending-requests table only when requests exist) |
| Shell context | InternalShell (`app.*`, `agency.*`, `platform.*`), MarketplaceShell (`marketplace.admin.*`) |
| Reference only (excluded) | `design-system.tsx` |

---

## 8. Proposed proof-gate consumers

| Route | File | Why selected |
| --- | --- | --- |
| `/app/tasks` | `app.tasks.tsx` | Simplest configuration: required props + `ariaLabel`, default empty fallback never triggered. Baseline anatomy. |
| `/app/customers` | `app.customers.index.tsx` | Only JSX `empty` node; consumer-side filtering lets the empty branch be exercised through existing UI without touching data. |
| `/app/commissions` | `app.commissions.tsx` | Four right-aligned columns: proves `align="right"` + `tabular-nums` geometry and numeric typography. |
| `/app/jet/platform` | `app.jet.platform.tsx` | Seven instances on one page, including inline column arrays — proves repeat rendering and independence between instances. |
| `/platform/organizations` | `platform.organizations.index.tsx` | Two instances, one conditional — proves conditional mounting and store-driven rows. |
| `/marketplace/admin/participants` | `marketplace.admin.participants.index.tsx` | MarketplaceShell context; admin surface. |
| `/agency/organization-admin` | `agency.organization-admin.tsx` | Store-driven downline rows with string `empty` — the dynamic-data + empty-string case. |

Together these seven cover every prop actually used in production, both `empty` shapes, column `align`/`className` variance, single- and multi-instance pages, conditional rendering, and both shells. No route is invented; each path is resolved from the existing file-based route names.

---

## 9. Exact zero-diff verification protocol (future proof phase)

Executed read-only against the running app with Playwright; nothing is edited.

1. **Pre-flight** — re-hash `data-table.tsx`, re-run the consumer/call-site scan, confirm the numbers in sections 2–4 still hold, confirm `git status` clean.
2. **DOM structure** — for each proof consumer capture the full `tagName` tree from wrapper `div` down to the first three `td` nodes, plus `thead`/`tbody` child counts and the presence/absence of `caption`.
3. **Class strings** — capture verbatim `className` for wrapper, scroll div, `table`, `thead`, header `tr`, each `th`, first three `tr`, first three `td` of each, and the first-cell indicator `span`.
4. **Computed styles** — `getComputedStyle` for those nodes: font-family, font-size, font-weight, line-height, letter-spacing, text-transform, text-align, color, background-color, padding, border-width/style/color, border-radius, box-shadow, overflow-x, transition, transform.
5. **Dimensions and geometry** — `getBoundingClientRect` for table, header row, first three body rows and first three columns; record header row height, body row height and column widths per viewport.
6. **Borders / radii / shadows** — assert outer `rounded-lg` radius value, hairline border colour resolved from the live token, `last:border-0` on the final row, and absence of box-shadow.
7. **Sorting / filtering** — none exist in the component; verify only that consumer-side filters (`/app/customers`, `/agency/organizations`) mutate `rows` and that the table re-renders with unchanged structure.
8. **Pagination** — verify absence: no pagination nodes rendered by the component on any proof route.
9. **Row actions** — verify that links/buttons inside cells remain consumer-rendered, focusable, and navigate/act as before (one navigation per proof route where present).
10. **Empty state** — trigger through existing consumer filters only: assert a single `td` with `colSpan == columns.length`, class `px-5 py-10 text-center text-muted-foreground`, and the consumer-supplied node/string; separately confirm the `"No results."` fallback path on a consumer without `empty` by filtering where the UI allows, otherwise record it as unexercised rather than forcing it.
11. **Loading state** — verify absence; record how each route handles loading outside the component.
12. **Keyboard** — tab through a table: the table, rows and cells must never receive focus; focus order must follow the DOM order of consumer-rendered controls; Enter/Space behaviour of those controls unchanged.
13. **Accessibility** — `aria-label` present and matching the consumer string on every instance; `th[scope=col]` on all headers; the left indicator `span` `aria-hidden`; no `aria-sort`, no `role` overrides; accessible name of the table equals its `ariaLabel`.
14. **Responsive** — repeat steps 2–6 at **1440px, 834px and 390px**. At 390px explicitly verify that the `min-w-[640px]` rule produces horizontal scrolling inside `overflow-x-auto` (scrollWidth > clientWidth) and that the page itself does not scroll horizontally.
15. **Navigation and shell** — confirm the surrounding InternalShell / MarketplaceShell header, sidebar and breadcrumbs are unaffected, and that at least one in-table link navigates correctly per applicable route.
16. **Console** — zero errors on every proof route at every viewport; known intermittent warnings on untouched code recorded, not fixed.
17. **Typecheck** — `tsgo` clean.
18. **Build** — build log reports OK.
19. **Lint** — run ESLint on `data-table.tsx`, record pre-existing Prettier/format findings verbatim and leave them unfixed.

**Stable data handling.** Dynamic tables are driven by existing sample constants and existing stores. The protocol reads whatever the route renders and compares *before vs after* within the same session and across viewports; it does not seed, mock, freeze or inject test data, and it does not add test IDs. Where a state (e.g. the default `"No results."` fallback) cannot be reached through existing UI, it is recorded as unexercised rather than manufactured.

---

## 10. Responsive verification protocol

Viewports 1440 / 834 / 390. Per viewport and proof consumer: table and wrapper widths, scrollWidth vs clientWidth, header and body row heights, column widths, padding and font sizes (expected constant — the component declares no responsive variants), document horizontal overflow, and a screenshot of the table region. Any measured difference between viewports must be explainable purely by the `min-w-[640px]` + `overflow-x-auto` pair or by consumer content; anything else halts the phase.

---

## 11. Accessibility verification protocol

Per proof consumer: native table semantics intact (`table > thead > tr > th[scope=col]`, `tbody > tr > td`); accessible name from `aria-label`; no `caption` rendered today; decorative indicator `aria-hidden`; table and rows not focusable (`tabIndex` absent/-1); focus order through cell controls verified by sequential Tab; colour-carrying content inside cells is consumer-owned (StatusBadge etc.) and is out of scope; no `aria-sort`/`aria-live`/`aria-busy` expected because no sorting, filtering or loading exists in the component. Findings are recorded, not remediated.

---

## 12. Regression / safety contract

The application must remain pixel-identical and behaviourally identical. Explicitly preserved:

- exact existing visual output and DOM
- exact interaction behaviour, navigation and routes
- exact responsive behaviour and content
- exact branding, Branding & White-Label functionality, Marketplace Asset Management functionality and marketplace assets
- existing business logic and shell behaviour
- all alternate table systems (Lucie `Table`, Lucie-app `DataTable`, five route-local tables, idle `ui/table.tsx`) exactly as they are

Prohibited in this and the following proof phase: editing production files, migrating consumers, renaming, merging, deleting duplicates, changing props/DOM/classes/styling/spacing/typography, adding sorting/pagination/selection, adding test IDs, fixing pre-existing lint, or cleaning up anything merely because it looks inconsistent. `git status` must be clean at completion apart from this plan document.

---

## 13. Open decisions (recorded, deliberately unresolved)

1. `caption` has zero production consumers — keep, remove, or leave dormant? Undecided.
2. `onRowClick` has zero ABox-DataTable consumers while the lucie-app DataTable uses it — undecided.
3. No component-level `className` escape hatch; all variance is per column — undecided whether that is a gap.
4. No sorting API; several routes sort/filter externally — undecided.
5. No pagination API; no route paginates today — undecided.
6. No row selection, expandable rows or loading state — undecided.
7. Two DataTable APIs coexist (`getRowId`/`key`/`header`/`align` vs `keyOf`/`head`) with structurally different empty states (table row vs dashed panel) — undecided.
8. Lucie `Table` uses `min-w-[520px]`/`rounded-xl` vs ABox `min-w-[640px]`/`rounded-lg` — undecided.
9. Five route-local raw tables with three different `min-w` values — undecided.
10. `src/components/ui/table.tsx` is installed and unused — undecided.
11. No mobile card/list representation: every table horizontally scrolls at 390px — undecided.
12. `tabular-nums` is coupled to `align="right"` rather than being independently controllable — undecided.
13. No `aria-sort`/sortable-header semantics — undecided.
14. Whether marketplace/admin tables need any specialization at all — undecided.

---

## 14. Explicit non-goals

No migration, no canonical winner, no ranking, no merging, no duplicate deletion, no API extension, no accessibility remediation, no responsive redesign, no mobile representation, no lint cleanup, no dependency change, no Figma asset, no second DataTable implementation in the reference layer, and no architectural decision that was not already approved.

---

## 15. Expected implementation boundary for the future proof phase

The proof phase is **observation only**: run the app, drive the seven proof routes with Playwright, capture the measurements in sections 9–11, run typecheck/build/lint, and write the findings into a Phase 22 proof report. Zero production files may change. The reference/design-system layer may only receive descriptive documentation of production evidence; it must not gain a second DataTable and must never be used as a source for consumer counts.

---

## 16. Final factual conclusion about scope

This phase can establish:

- the exact current source, hash, API, defaults, DOM, classes, tokens and behaviour of the ABox DataTable;
- the exact production consumer set (19 files / 26 call sites) and the exact prop surface those consumers rely on;
- whether that implementation renders and behaves identically and correctly across a representative proof set at three viewports **without modification** — i.e. whether it is reusable as-is for its verified consumers.

This phase cannot establish:

- that any alternate table system should converge with it, or which of them is preferable;
- that absent capabilities (sorting, pagination, selection, loading, mobile representation, `className`) should be added;
- that the five route-local tables or the idle shadcn primitive are duplicates;
- any migration order, canonical winner, or Figma library structure.

Possible conclusions for the proof phase are descriptive only: *reusable for the verified current consumers*, *reusable with specific unresolved variants*, *specialized in some areas*, or *evidence insufficient*.
