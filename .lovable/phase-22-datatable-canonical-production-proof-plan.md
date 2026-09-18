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

---

# PHASE 23 — EXECUTION EVIDENCE (proof run, zero production changes)

## 23.1 Source integrity

| Check | Result |
| --- | --- |
| md5 before proof | `63c1e60eed38407aa9d6e6301b362637` — matches approved hash |
| md5 after proof | `63c1e60eed38407aa9d6e6301b362637` — unchanged |
| `git status` before | clean |
| Importer re-count | 20 files including `design-system.tsx` → **19 production** |
| Call-site re-count | 27 including the reference route → **26 production** |
| Production files changed | **0** |

Session: an authenticated session was required (all gates except `/app/tasks` redirect to `/auth?redirect=…` when signed out). A session was minted for the existing test account `dana_1789563948@example.com` and restored into `localStorage` by the proof scripts. No application code or data was modified to obtain access.

## 23.2 Proof-gate routes reached

All seven reached: `/app/tasks`, `/app/customers`, `/app/commissions`, `/app/jet/platform`, `/platform/organizations`, `/marketplace/admin/participants`, `/agency/organization-admin`. No substitutions.

Two observations affecting capture (recorded, not fixed):
- `/app/tasks` needs ~3.5 s before its table is present; a 1.5 s probe saw an empty body. With the longer wait the table renders normally. Two dev-only request failures are logged on that route (`virtual:lovable-preview-execute-client`, a `?t=` HMR entry) and are pre-existing dev-server artifacts.
- `/app/jet/platform` mounts one DataTable at a time because it uses Radix `Tabs`; each tab was clicked individually to reach all seven instances.

## 23.3 DOM findings

Every observed instance matches the approved structure exactly:

```
div.overflow-hidden.rounded-lg.border.border-hairline.bg-card
 └ div.overflow-x-auto
   └ table.w-full.min-w-[640px].text-sm  [aria-label]
     ├ thead.border-b.border-hairline…  > tr > th[scope="col"]
     └ tbody > tr.group… > td.px-5.py-4.relative
```

`caption` was absent everywhere (no production consumer). `th[scope="col"]` on all headers. Empty state renders as a real `TR > TD[colspan]` inside `tbody`. Consumer-rendered `A`/`BUTTON` controls appear inside cells (e.g. participants rows contain one link each; commissions rows contain an "Export" control).

## 23.4 Class findings (verbatim, unmodified)

- wrapper `overflow-hidden rounded-lg border border-hairline bg-card`
- scroll container `overflow-x-auto`
- table `w-full min-w-[640px] text-sm`
- thead `border-b border-hairline text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground`
- th `px-5 py-4 font-semibold` (+ `text-right` on aligned columns)
- tr `group border-b border-hairline/60 transition-colors last:border-0 hover:bg-panel/40 relative`
- td `px-5 py-4 relative` (+ `text-right tabular-nums`)
- empty cell `px-5 py-10 text-center text-muted-foreground`
- accent bar `absolute left-0 top-0 bottom-0 w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-200 group-hover:scale-y-100`

Identical strings observed on all seven routes and all seven JET tabs.

## 23.5 Computed-style findings (1440 px, `/app/commissions` representative)

wrapper: radius `14px`, border `1px oklch(0.3 0.04 265 / 0.11)`, background `oklch(1 0 0)`, overflow `hidden`, **box-shadow `none`**. Scroller: `overflow-x: auto`. Table: `min-width 640px`, `font-size 14px`, family `Inter Tight`. Header: `10px / 600 / letter-spacing 1.8px / uppercase / padding 16px 20px`, colour `oklch(0.5 0.018 265)`. Row: border-bottom `1px oklab(0.3 … / 0.066)`; last row `0px`. Cell: padding `16px 20px`, `14px / 20px`, `position: relative`. Right-aligned cells report `font-variant-numeric: tabular-nums`; default cells `normal`. Values are recorded as rendered; nothing was compared against or adjusted toward an idealized token.

## 23.6 Geometry (table width / scrollWidth / container / overflow / first row heights)

| Route | 1440 | 834 | 390 |
| --- | --- | --- | --- |
| /app/tasks | 1082 / 1082 / 1082 / no / 69 | 802.8 / 803 / 768 / **yes** / 145 | 802.8 / 803 / 356 / **yes** / 145 |
| /app/customers | 1082 / 1082 / 1082 / no / 69 | 768 / 768 / 768 / no / 89 | 640 / 640 / 356 / **yes** / 93 |
| /app/commissions | 1082 / 1082 / 1082 / no / 65 | 825.6 / 826 / 768 / **yes** / 73 | 825.6 / 826 / 356 / **yes** / 77 |
| /app/jet/platform | 1082 / 1082 / 1082 / no / 73 | 768 / 768 / 768 / no / 93 | 640 / 640 / 356 / **yes** / 133 |
| /platform/organizations | 1080 / 1080 / 1080 / no / 69 | 766 / 766 / 766 / no / 69 | 640 / 640 / 354 / **yes** / 77 |
| /marketplace/admin/participants | 1082 / 1082 / 1082 / no / 55.1 | 768 / 768 / 768 / no / 73 | 642.8 / 643 / 356 / **yes** / 73 |
| /agency/organization-admin | 1080 / 1080 / 1080 / no / 55.1 | 766 / 766 / 766 / no / 55.1 | 640 / 640 / 354 / **yes** / 55.1 |

Header row height 46.8 px at 1440. `document.scrollWidth == clientWidth` at every viewport on every route: horizontal scrolling stays inside `overflow-x-auto` and never reaches the page. The 640 px floor holds at 390 px on all seven routes; two tables (`/app/commissions`, `/app/tasks`) exceed 640 px on content and already scroll at 834 px.

## 23.7 Hover / interaction findings

`/app/commissions` first row: background `rgba(0,0,0,0)` → `oklab(0.945 … / 0.4)` on hover. The accent bar animates through the CSS `scale` property (Tailwind v4), not `transform`: `scale: "1 0"` → `"1"` → back to `"1 0"` on unhover, measured height `0px` → `64px` → `0px`, width constant `2px`, `transition-duration: 0.2s`, `transform-origin: 1px 0px`. Row `y` and `height` identical before and after hover — no layout shift. Consumer controls: the participants in-cell link `/marketplace/admin/participants/ptp-000008` navigated correctly on click; `/agency/organization-admin` rows contain a consumer link ("Northwind Health Group"). All such controls are consumer-rendered, not DataTable behaviour.

## 23.8 Empty-state findings

`/app/customers`: driven purely by the existing "Search by name or ID…" input (page input index 1; index 0 is the shell's global search). Typing a non-matching string collapsed 8 rows to a single row containing `TD[colspan="6"]` (column count 6), class `px-5 py-10 text-center text-muted-foreground`, inner HTML `<span>No leads match those filters.</span>`, rect 1082 × 100.5. Clearing the input restored 8 rows. No data injected, no fixture created.

`/agency/organization-admin`: 2 rows present in the current state; the explicit string empty state (`"No direct downlines yet. Create one to get started."`) was **not naturally reachable** and is recorded as unexercised rather than forced.

`/app/tasks`: no `empty` prop; rows always present, so the `"No results."` fallback is **unexercised**.

## 23.9 API / prop coverage across the gates

| Prop / feature | Exercised | Where |
| --- | --- | --- |
| `columns`, `rows`, `getRowId` | yes | all gates |
| `ariaLabel` | yes | all gates — e.g. "Tasks", "Leads and customers", "Commission statements", "Marketplace participants", "Direct downlines", plus all 7 JET labels |
| `empty` (absent) | yes | `/app/tasks`, `/app/commissions`, `/app/jet/platform`, `/marketplace/admin/participants`, `/platform/organizations` |
| `empty` (JSX) | yes | `/app/customers` |
| `empty` (string) | partially — prop present, state not reachable | `/agency/organization-admin` |
| `Column.align="right"` | yes | `/app/commissions` — Booked, Projected, Carriers, Policies |
| `Column.align="center"` | **not observed** on any gate | — |
| default/left alignment | yes | all gates |
| `Column.className` | yes | within column definitions on commissions/jet gates |
| custom cell renderers | yes | badges, codes, links, money, Export controls |
| consumer-owned filtering | yes | `/app/customers` |
| `caption` | zero consumers — no proof manufactured | — |
| `onRowClick` | zero ABox consumers — no proof manufactured | — |

## 23.10 Multi-instance findings

`/app/jet/platform`: all **seven** instances reached by clicking each tab, each distinguishable by `aria-label` and headers — "M00 change and clarification records" (6 cols, 3 rows), "Environment separation" (4/4), "Launch gates" (6/9), "Risk register" (6/4), "Open item register" (5/2), "Governed screen register" (5/3), "M00 governance versus Lucie business surface classification" (4/13). Wrapper and table class strings identical across all seven; no cross-instance style or state leakage observed (only one instance mounted at a time by Radix Tabs).

`/platform/organizations`: **one** table rendered in the current state ("All organizations", 3 rows). The conditional pending-reference-requests table did not render because no pending requests exist — existing conditional behaviour, recorded as unexercised.

## 23.11 Accessibility findings

`/marketplace/admin/participants` representative: `aria-label="Marketplace participants"`, `table.tabIndex === -1` (not focusable), no `role` override, all 5 headers `scope="col"`, every `tbody tr` `tabIndex === -1`, first-cell accent spans `aria-hidden="true"` (non-first-cell spans are consumer content). Focusables inside the table are only consumer links. Tab order from page load runs Skip to content → shell brand → shell controls → sidebar navigation, i.e. the table contributes nothing to focus order beyond its consumer controls. No `aria-sort` present anywhere; none added. Empty-state semantics valid (`tbody > tr > td[colspan]`).

## 23.12 Shell / context findings

InternalShell (`/app/*`, `/agency/*`, `/platform/*`) and MarketplaceShell (`/marketplace/admin/*`) render unchanged around every table; sidebar, header and skip link behave normally, in-table navigation resolves to the expected detail route, and no shell spacing or navigation change is attributable to DataTable.

## 23.13 Console / typecheck / build / lint

- Console: zero errors on `/app/customers`, `/app/commissions`, `/app/jet/platform`, `/platform/organizations`, `/marketplace/admin/participants`, `/agency/organization-admin` across all three viewports. One error on `/app/tasks`: "Can't perform a React state update on a component that hasn't mounted yet…" — the known pre-existing warning reproduced on untouched code, not attributable to this phase and not fixed.
- Typecheck: `tsgo --noEmit` clean.
- Build: build log reports `build OK`.
- ESLint on `data-table.tsx`: **2 pre-existing `prettier/prettier` formatting errors** (lines 25 and 52). Recorded, not fixed. No new findings.

## 23.14 Alternate table systems

Untouched and unmodified: `src/components/lucie/ui.tsx Table`, `src/components/lucie-app/ui.tsx DataTable`, `src/components/ui/table.tsx`, and the five route-local raw tables. No comparison, ranking or convergence performed.

## 23.15 Final integrity

Hash unchanged (`63c1e60eed38407aa9d6e6301b362637`); zero production, route, style, foundation, dependency, branding or marketplace-asset files changed; the only modified file in the repository is this documentation artifact; no second DataTable created anywhere.

## 23.16 Conclusion

**Current implementation is reusable with specific unresolved variants.**

Evidence supports reuse without modification for the verified consumers: identical DOM, identical class strings, identical computed styles and consistent geometry across seven routes, thirteen distinct table instances and three viewports, with hover, empty-state, accessibility, navigation and shell behaviour intact and zero production change. The variants that remain unresolved and unexercised by this proof are: the string `empty` state on `/agency/organization-admin`, the default `"No results."` fallback, the conditional second table on `/platform/organizations`, and `Column.align="center"` — none of which were reachable through existing state without altering production. All Phase 22 open decisions (dormant `caption`/`onRowClick`, absent sorting/pagination/selection/loading APIs, coexisting table systems, no mobile representation, `tabular-nums` coupled to right alignment, no `aria-sort`) remain unresolved. No ranking against any alternate implementation is expressed or implied.
