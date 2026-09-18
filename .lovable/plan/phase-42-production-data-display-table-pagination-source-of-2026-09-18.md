# Phase 42 — Production Data-Display & Table/Pagination Source-of-Truth Audit (PLAN ONLY)

**Expected outcome: ZERO production migrations.** Every route-local table is structurally different from `DataTable` and from each other, no pagination system exists in production, and all five hand-built tables sit behind authentication. Only `.lovable/manual-work-map.md` would change, after execution.

## 1. Fresh inventory

Eligible production surface: 187 files under `src/routes/**` and `src/components/abox/**`, excluding design-system/design-guide/`src/lib/design`/`src/components/design`, Lucie, M06, M08, AI-elements, Branding and Marketplace-asset runtime.

**Table elements.** `<table>` 6, `<thead>` 6, `<tbody>` 6, `<tr>` 13 (plus mapped rows), `<th` 22, `<td` 23. Six table implementations total: `data-table.tsx` (canonical) and five route-local tables — `marketplace.admin.releases.compare.tsx:45`, `app.employer.ichra.tsx:39`, `agency.organization-imports.index.tsx:110`, `agency.organization-imports.$importJobId.tsx:65`, `agency.organization-defaults.apply.tsx:103`.

**Table systems.** ABox `DataTable` with 23 production consumers (plus one Lucie consumer, excluded). shadcn `src/components/ui/table.tsx` exists but has **zero production importers** — referenced only by `src/lib/design/*` documentation modules. Five raw `<table>` implementations. No data-grid library.

**Pagination.** `src/components/ui/pagination.tsx` exists with **zero production importers**. No Previous/Next control, no numbered pages, no page-size control, no infinite/append loading, and no route-local pagination pattern anywhere in the eligible surface. There is nothing to centralize.

**Table interaction.** `DataTable` supports optional `onRowClick`, hover row tint and an ember left-border indicator; it has no built-in sorting, filtering, selection, expandable rows or row-action column. None of the five route-local tables implement sorting, filtering, selection or expansion; they are static render loops. Search/filter controls that exist (organizations, leads, customers) are page-level inputs above a `DataTable`, not table-owned controls.

**Responsive behavior.** `DataTable` wraps in `overflow-hidden rounded-lg border border-hairline bg-card` → `overflow-x-auto` → `min-w-[640px]`. Route-local tables vary: `min-w-[640px]` (releases compare), `min-w-[720px]` (both import tables), `min-w-[560px]` (defaults apply), and no `min-w` and no scroll wrapper at all (`app.employer.ichra.tsx`). No stacked-row, hidden-column or alternate mobile markup exists for any table.

**Data states.** `DataTable` owns its own in-table empty row (`colSpan`, `px-5 py-10 text-center`, default "No results."). `EmptyState` is a separate page-level component with 8 production consumers (`cart`, `plans.index`, `compare`, `apply`, `review`, `handoff`, `shared.$token`, `member.quotes`) and is never rendered inside a table body. Loading: only two `animate-pulse` occurrences in eligible production (`app.agent-profile.tsx:37` placeholder block, `plan-o-assistant.tsx:32` decorative ring); no skeleton table, no `aria-busy`, no retry affordance. Error states are route-local `role="alert"` paragraphs (Phase 41 record).

**Styling vocabulary.** Header: `DataTable` uses `border-b border-hairline … text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground`; three route-local tables reuse the `text-[10px]/0.18em` header idiom but two of them omit the `border-b`, and `app.employer.ichra.tsx` uses a different idiom entirely (`text-xs uppercase tracking-widest`). Cell padding: `px-5 py-4` (canonical) versus `px-4 py-3`, `px-3 py-2`, and `py-2`/none. Dividers: `border-b border-hairline/60` per row (canonical) versus `divide-y divide-border` on tbody (all five route-local). Hover: canonical only. Numeric: canonical auto-applies `tabular-nums` on right-aligned cells; `ichra` applies `tabular-nums` manually per cell. Wrapper: canonical card + scroll wrapper versus ad-hoc or absent wrappers.

**Repeated non-table value rows.** `flex items-center justify-between` appears 36 times bare and 18 times with `gap-2`; the longest exact repeats are `… rounded-xl border border-border p-3 text-sm` (4), `… gap-2 rounded-lg border border-border px-3 py-2` (4), `… py-3 text-sm` (3). `<dl>` is used in 7 files, each with a different definition-row shape.

## 2. Existing ownership map

- **`src/components/abox/data-table.tsx` — canonical, sole ABox table source.** Owns wrapper, scroll behaviour, header typography, cell padding, alignment, `tabular-nums` on right-aligned columns, hairline row dividers, hover tint, hover indicator, `caption` as `sr-only`, `aria-label`, and the in-table empty row. 23 production consumers. Not modified in this phase, not forked, not duplicated.
- **`src/components/abox/empty-state.tsx`** — page-level empty presentation, 8 consumers; deliberately separate from `DataTable`'s in-table empty row.
- **`src/components/abox/status-badge.tsx`** — cell-level status presentation, used inside both canonical and route-local tables.
- **`src/components/ui/table.tsx` and `src/components/ui/pagination.tsx`** — present but unconsumed in production. They are the main *duplication hazard*: either could silently become a second table or pagination source. Governance records them as non-adoptable without an explicit phase.
- **Route-local tables (5)** — each owned by its own route; all auth-gated.
- **Three shells** — remain independent; no table ownership.

## 3. Candidate register

| ID | Structure | Consumers | Class |
|---|---|---|---|
| P42-C1 | Route-local `<table>` → `DataTable` | 5 route-local tables | D/E/F + auth-gated |
| P42-C2 | Header typography idiom `text-[10px] … 0.18em` | 4 (canonical + 3 routes) | D — fragment only |
| P42-C3 | `divide-y divide-border` tbody | 5 route-local | D — differs from canonical per-row dividers |
| P42-C4 | Pagination | 0 | K — no production consumer exists |
| P42-C5 | Table loading/skeleton | 0 eligible | K — nothing to own |
| P42-C6 | In-table empty row vs `EmptyState` | 1 vs 8 | A — already two distinct owners, correct as is |
| P42-C7 | `flex items-center justify-between` value rows | 36+18 | D — layout fragment across unrelated semantics |
| P42-C8 | `<dl>` definition displays | 7 | D — different shapes per route |
| P42-C9 | `overflow-x-auto` scroll wrappers | 9 | D — 3 are non-table (quote, compare grid, product switcher, member shell) |

## 4. Exact-equivalence evidence requirements

Any future candidate must produce, before and after, at 1440/834/390: identical DOM tree, element names, attribute set and full class output; identical computed styles for padding, font-size/weight/letter-spacing, colour, border and divider rendering; identical row height, column widths and table min-width; identical wrapping and horizontal-overflow behaviour; identical hover/focus/selected/disabled treatment; identical accessibility tree (role, accessible name from `aria-label`/`caption`, header scope associations); identical keyboard traversal and row-activation behaviour; unchanged routing, handlers and business output; clean console and network. Screenshots alone are never sufficient.

## 5. Proposed canonicalization opportunities

None. No new source, wrapper, helper or abstraction is proposed. No `DataDisplay`, `TableCell`, `DataRow`, `ListItem`, `Pagination`, Slot, `asChild` or polymorphic abstraction. `DataTable` remains untouched.

## 6. Explicit non-candidates and reasons

- **P42-C1 — REJECT.** All five differ from `DataTable` in cell padding (`px-4 py-3` / `px-3 py-2` / `py-2` vs `px-5 py-4`), divider mechanism (`divide-y divide-border` on tbody vs `border-b border-hairline/60` per row), border colour token (`border` vs `hairline`), wrapper (card wrapper absent or ad-hoc), min-width (`720`/`560`/none vs `640`), and hover behaviour (none vs tinted row plus ember indicator). `releases.compare` also renders rows through a local `Row` fragment component and `ichra` computes a derived monthly cost per row. Migrating any of them would change visible pixels and DOM — forbidden. Additionally every one is behind the auth gate, so none is independently measurable.
- **P42-C2 / P42-C3 — REJECT.** Shared class fragments on differently padded, differently bordered tables; fragment matching is explicitly not equivalence proof.
- **P42-C4 — REJECT.** No production pagination exists; creating one from an unconsumed shadcn file would be inventing a system, not centralizing one.
- **P42-C5 — REJECT.** The only eligible `animate-pulse` is an auth-gated placeholder block, not a table skeleton.
- **P42-C6 — KEEP AS IS.** In-table empty row and page-level `EmptyState` are different semantic roles with different DOM positions; merging would change table DOM.
- **P42-C7 / P42-C8 / P42-C9 — REJECT.** Generic layout fragments spanning unrelated semantics, including non-table consumers.

## 7. Public / measurable proof routes

Measurable public routes containing data display: `/plans` (plan card grid plus `EmptyState`), `/compare` (comparison grid with `overflow-x-auto`), `/cart`, `/review`, `/handoff`, `/quote?step=1`. **None of these renders a `<table>`.** There is therefore no publicly measurable table consumer at all, which alone blocks any table candidate from satisfying the two-measurable-consumer rule.

## 8. Auth-gated — NOT CAPTURED

All 23 `DataTable` consumers (`/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`) and all five route-local tables: `marketplace.admin.releases.compare`, `app.employer.ichra`, `agency.organization-imports.index`, `agency.organization-imports.$importJobId`, `agency.organization-defaults.apply`. Source is inspected and recorded; runtime parity is never inferred, no session is fabricated, no state is manufactured.

## 9. Migration batches

None in this phase. If a candidate were ever approved: Batch 0 additive source only (no consumer change), Batch 1 exactly one measurable proof consumer with full parity evidence, then one explicit gate per later consumer. Zero migration is the valid outcome here.

## 10. Validation gates (execution of this audit)

`npx tsgo --noEmit`; production build; targeted ESLint on changed production files (none expected); full lint compared with the 16,783-finding baseline, not repaired; `git diff --check`; focused `git diff`; `git status --short`; fresh rg inventory of table elements, table systems, pagination, interaction, responsive wrappers and data states; Playwright verification of the measurable public data-display routes at 1440/834/390 with accessibility-tree snapshots and console/network inspection; changed-file inventory; locked-source hashes.

## 11. Rollback

Zero migration means an empty production rollback; only the Phase 42 governance block would be reversed. If a migration is ever approved, rollback restores the exact original table markup and class strings, re-runs typecheck/build, re-runs responsive and accessibility-tree checks, verifies hashes and confirms Phases 29–41 are unaffected. Any unexpected production change: stop, restore the file exactly, do not expand scope.

## 12. Governance updates (after execution only)

Append to `.lovable/manual-work-map.md`: the fresh data-display inventory, the ownership map, candidate register P42-C1…C9 with reasoning, NOT CAPTURED list, validation evidence, locked hashes, rollback, and these standing rules — no second canonical table source may be introduced; `src/components/ui/table.tsx` and `src/components/ui/pagination.tsx` stay unconsumed and may not be adopted without an explicit phase; no table abstraction may alter DOM semantics; pagination may never be centralized from visual similarity; responsive variants must remain behaviorally equivalent; business-coupled data displays stay independently owned; every future migration requires exact parity evidence at 1440/834/390; zero migration remains valid.

## 13. Expected changed files

`.lovable/manual-work-map.md` only.

## 14. Statement of expected migrations

**ZERO production migrations.** No route-local table, list, value row or pagination control satisfies the strict candidate test, and no publicly measurable table consumer exists. `src/components/abox/data-table.tsx` stays the single canonical ABox table source, unmodified.
