# Phase 23 — DataTable Canonical Production Proof Execution

Execution of the approved Phase 22 proof protocol. Verification only: no production file is edited, no consumer migrated, nothing normalized or fixed. If anything unexpected is found it is recorded, not repaired.

## Guardrails

- Approved source: `src/components/abox/data-table.tsx`, expected hash `63c1e60eed38407aa9d6e6301b362637`.
- Hash mismatch at step 1 → stop immediately and report the discrepancy instead of touching the file.
- Untouched throughout: DataTable, all 19 consumers, routes, shells, foundations, branding, marketplace assets, dependencies, `lucie/ui.tsx Table`, `lucie-app/ui.tsx DataTable`, `ui/table.tsx`, and the five route-local tables.
- No test fixtures, no injected data, no test IDs, no added ARIA (specifically no `aria-sort`).
- Only writable artifact: the Phase 22 evidence document.

## Execution sequence

1. **Source integrity** — recompute the md5, compare to the approved hash, capture `git status`, re-confirm 19 importer files / 26 call sites and the single excluded reference call site in `design-system.tsx`.
2. **Session setup** — authenticated Playwright session (existing project auth-session mechanism), scripts and artifacts under `/tmp/browser/dt/`. One script per route group, run at 1440, 834 and 390 px.
3. **Per-route capture** for each reachable proof gate:
   - DOM tree from the outer wrapper down through `caption?` / `thead` / `th[scope=col]` / `tbody` / `tr` / `td`, plus consumer-rendered controls inside cells, and the empty-state row where present.
   - Verbatim class strings for wrapper, scroll container, table, thead, th, tr, td, empty cell and the decorative left bar — recorded as-is, never normalized.
   - `getComputedStyle` for wrapper / table / thead / representative th / tr / td: font-family, size, weight, line-height, letter-spacing, padding, border width and colour, radius, background, overflow, width/min-width, display, position, transition, transform.
   - `getBoundingClientRect` (x, y, width, height) for wrapper, table, header row, first three body rows and representative columns.
   - Hover on a representative row: background change, left-bar `scaleY` transition and its 200 ms timing, and confirmation of no layout shift.
   - Accessibility: `aria-label` value, `th` scope, table/row focusability, tab order through cell controls, `aria-hidden` on the decorative bar.
4. **Route-specific gates**
   - `/app/tasks` — baseline simplest configuration; default empty behaviour recorded only if naturally reachable.
   - `/app/customers` — drive the existing filter controls to zero rows; verify the JSX empty node, `colSpan`, text, classes, geometry and semantics.
   - `/app/commissions` — right-aligned numeric columns, `tabular-nums` rendering and money formatting.
   - `/app/jet/platform` — locate all seven instances, distinguish them by rendered headers/content, check for cross-instance style or state leakage.
   - `/platform/organizations` — both instances, including the conditional pending-requests table as it currently behaves.
   - `/marketplace/admin/participants` — MarketplaceShell context.
   - `/agency/organization-admin` — dynamic rows plus the explicit string empty state if reachable through existing state.
   - Any gate that cannot be reached is reported with the exact reason; no substitute route, no invented evidence.
5. **Responsive verification** — at 390 px explicitly record wrapper width, table width, `scrollWidth` vs `clientWidth`, presence of horizontal scrolling inside `overflow-x-auto`, absence of page-level horizontal overflow, header/cell wrapping, row heights and column geometry. The 640 px minimum is existing behaviour and is preserved exactly.
6. **API / prop coverage** — record which gates exercise `columns`, `rows`, `getRowId`, `ariaLabel`, `empty` (absent / string / JSX), `Column.className`, `Column.align` (left, right, centre if present), custom cell renderers and consumer-owned filtering. `caption` and `onRowClick` have zero production consumers; no proof is manufactured for them.
7. **Shell / context** — confirm InternalShell, JET/admin and MarketplaceShell surroundings are unaffected and that the table introduces no unexpected navigation or spacing.
8. **Console / typecheck / build / lint** — zero new console errors; `tsgo` typecheck; build log; ESLint on `data-table.tsx` with pre-existing Prettier findings recorded and left unfixed. Pre-existing issues are explicitly separated from anything new.
9. **Final integrity** — recompute the hash, confirm it is unchanged, confirm `git status` shows no production, route, style, foundation, dependency, branding or marketplace change, and that only the documentation artifact differs.

## Documentation

All evidence is appended to `.lovable/phase-22-datatable-canonical-production-proof-plan.md` as a Phase 23 execution-evidence section. No second DataTable is created anywhere, and the reference layer is not used as evidence.

## Conclusion handling

The closing statement selects only the evidence-supported description among: reusable for the verified consumers / reusable with specific unresolved variants / verified specialization boundaries / evidence insufficient. No ranking against alternate table systems and no comparative language. Open decisions from Phase 22 remain unresolved and are restated, along with any new observations recorded during the proof.
