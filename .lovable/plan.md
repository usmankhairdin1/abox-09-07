# Phase 47 — Governance Enforcement Batch C (report-only drift detection: E5 + E6 + E7)

PLAN ONLY. No files changed in this phase.

## 1. Executive summary

Batch C adds three **report-only** diagnostics that observe the repository and write a governance report. They introduce no lint severity, no build or dev-server wiring, no runtime code, no migration, and no ranking. Nothing they find ever changes a file.

Mechanism: one small Node script, `scripts/governance-report.mjs`, run on demand (`node scripts/governance-report.mjs`), with three separate analyzer functions (E5, E6, E7) so each can be rolled back or disabled independently. It uses only Node built-ins — no new dependency. Output goes to `.lovable/governance-report.md` plus `.lovable/governance-report.json`, never inside `src/`.

Phase 45/46 enforcement (E1/E2/E3/E4 and `server-only`) is untouched.

## 2. Current repository analysis (measured)

Color literals in production (`src/routes/**`, `src/components/**`, excluding `**/design/**` and the two reference routes):

- `#rrggbb` / `#rgb`: none in ABox components. Three matches exist and are all classifiable: `src/components/ui/chart.tsx` (recharts selector strings `[stroke='#ccc']`, `[stroke='#fff']` — library-owned Tailwind selectors, not colors applied by us) and `"#fff"` as inline text color inside the auth-gated runtime brand preview blocks `marketplace.admin.brand.tsx:119` and `marketplace.admin.preview.tsx:79`.
- `oklch(...)`: 7 occurrences — `carrier-mark.tsx` (3, computed from a per-carrier hue, a deliberate one-off visual treatment) and `app.jet.branding.tsx` (4, display copies of foundation token values shown as text in a swatch list).
- `rgb(...)`: 1 — `plan-o-assistant.tsx:27`, inside a `boxShadow` string alongside `var(--shadow-glow)`.
- `hsl()/hsla()/rgba()`: none.
- `src/styles.css` holds 131 color declarations — the canonical foundation, never a finding.

Canonical exports confirmed for E6/E7: `ActionPill` + `actionPillClass` (action-pill-component.tsx), `ACTION_PILL` (action-pill.ts), `StatusBadge`, `KpiCard`, `PageHeader`, `DataTable` + `Column`, `EmptyState`, `Surface` + `surfaceClass`, `controlClass`, `LabeledField`, `NoticePage`, `MARKETPLACE_PAGE_LAYOUT`, `FadeRise`/`Stagger`/`StaggerItem`/`CountUp`, `AboxMark`/`AboxWordmark`.

`package.json` scripts today: `dev`, `build`, `build:dev`, `preview`, `lint`, `format`. Batch C adds at most one optional `governance:report` script; it is never referenced by `build` or `dev`.

## 3. E5 — design and detection scope

Scans `src/routes/**` and `src/components/**` for `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`. `src/styles.css` is read as the token source, not scanned as a finding source.

Each match is emitted with a classification, never a verdict:

1. `token-usage` — the literal sits inside a `var(--…)` expression or a documented token display.
2. `documented-exception` — matches the frozen allowlist (below).
3. `runtime-branding` — the value comes from the Brand record (`primary_color`, `accent_color`) or is a fixed contrast color inside a runtime brand preview block.
4. `reference-content` — file under the reference/design layer or a reference route (reported separately, never a production finding).
5. `library-owned` — inside `src/components/ui/**` (shadcn/recharts vendored code).
6. `review-required` — anything else. This is the only candidate-drift bucket, and it is explicitly labelled as needing human review, not as a violation.

No finding is normalized, migrated, or scored.

## 4. E5 allowlist / exception strategy

A frozen allowlist literal inside the script, each entry file-scoped with a written reason:

- `src/components/abox/carrier-mark.tsx` — computed per-carrier hue; intentional one-off visual treatment (Phase 44).
- `src/routes/app.jet.branding.tsx` — foundation token values shown as display copy, not applied as style.
- `src/components/abox/plan-o-assistant.tsx` — shadow composition alongside `var(--shadow-glow)`.
- `src/routes/marketplace.admin.brand.tsx`, `src/routes/marketplace.admin.preview.tsx` — runtime brand preview; `#fff` is a fixed contrast color over a tenant-supplied background.
- `src/components/ui/**` — library-owned.

The allowlist is frozen at implementation time: a new literal in an allowlisted file still appears in the report as `review-required` if it does not match the recorded snippet, so the allowlist cannot silently absorb future drift.

## 5. E6 — canonical consumer-count model

For each canonical source the report lists: the source file, its exported symbols, importing files, and per-importer usage. Sources covered: `ActionPill`/`actionPillClass`, `ACTION_PILL`, `StatusBadge`, `KpiCard`, `PageHeader`, `DataTable`, `EmptyState`, `Surface`/`surfaceClass`, `controlClass`, `LabeledField`, `NoticePage`, `MARKETPLACE_PAGE_LAYOUT`, motion helpers, `AboxMark`/`AboxWordmark`.

Consumers are grouped, not merged: production consumers; reference consumers (the two reference routes and `src/components/design/**`, listed separately and excluded from production totals); route-local exceptions already documented (five route-local tables, Group B/C surfaces, control variants); intentionally independent systems (three shells, Lucie, M06, M08, AI elements).

## 6. E6 counting-unit strategy

Every canonical source reports **two explicitly labelled numbers**: `importerFiles` and `usageSites`. Neither is presented as a correction of the other, and no single "consumer count" is emitted. The Phase 44 DataTable discrepancy (20 importer files vs 23 call sites) is preserved verbatim as an illustration of why both units exist. Aliased imports (`import { X as Y }`) are resolved to the canonical export name and counted in both units; type-only imports are counted and labelled `typeOnly`.

## 7. E7 — duplicate-definition detection model

Static, name-and-location based. The script collects every exported declaration name across `src/routes/**` and `src/components/**` (excluding reference layers), then reports any canonical name — or documented component-family name — that is declared in more than one file, plus any local declaration that shadows a canonical export name.

It never infers duplication from JSX shape, class strings, Tailwind utilities, prop shapes, or visual similarity. Each hit is classified as: exact duplicate canonical export; alternate intentional component family; route-local implementation; shadcn/Radix primitive; business-coupled/bespoke; documented exception; or `review-required`.

Parsing: TypeScript's own compiler API is already present in the toolchain, so the analyzer parses with it rather than adding a dependency; if that proves brittle for a file, the file is reported as `parse-skipped` rather than guessed at.

## 8. Exception taxonomy

Carried forward unchanged from Phase 44 and applied by all three analyzers: three independent shells; Lucie; M06; M08; AI elements; shadcn/Radix primitives; the five route-local tables; business-coupled experiences; Group B/C Surface exceptions (54 sites); documented control variants (16 files); runtime branding; Marketplace Asset Management; the `logo.tsx` static-mark distinction from runtime White-Label. Exceptions are declared once in the script and consumed by every analyzer, so no analyzer can contradict another.

## 9. Report schema and output location

`.lovable/governance-report.json` — array of findings, each:

```
{ "rule": "E5|E6|E7", "file": "src/...", "line": 27, "type": "...",
  "canonicalOwner": "src/components/abox/... | null",
  "exception": "documented-exception | null",
  "reason": "...", "futureAction": "no-action | monitor | review-required",
  "category": "..." }
```

`.lovable/governance-report.md` — the same content grouped by rule, human readable, with E6's two counting units in adjacent labelled columns. No numeric score, no ranking, no ordering by severity; findings are sorted by rule, then file, then line for determinism.

Nothing is written under `src/`.

## 10. Deterministic execution model

Inputs are file contents only — no timestamps, no git state, no environment values, no network. File discovery uses a sorted recursive walk; output ordering is fixed; no random or date fields are emitted. Running twice on an unchanged tree produces byte-identical output, which the validation matrix checks by hashing both reports across two runs.

Generation is **on demand only**. Recommended handling: the script is committed; the generated reports are committed as governance artifacts so a future phase can diff them, and they are regenerated deterministically rather than incrementally updated. No build, dev-server, CI or deployment step reads or produces them.

## 11. Implementation mechanism

One file, `scripts/governance-report.mjs`, with three clearly separated analyzer functions and one shared exception table. Reasons for one script over three: a single shared exception table prevents divergence, one determinism harness covers all three, and rollback is a single deletion. Optional `"governance:report": "node scripts/governance-report.mjs"` in `package.json` scripts — additive, never referenced by `build`, `build:dev`, `dev` or `preview`. No new dependency, no plugin, no framework, no ESLint rule.

## 12. Validation matrix

| Check | Expectation |
| --- | --- |
| Baseline lint before change | 16,783 findings, `no-restricted-imports` 0 |
| Full lint after change | identical |
| E5 run | completes; every finding carries a classification; production `review-required` count recorded as measured, not acted on |
| E6 run | every canonical source reports `importerFiles` and `usageSites` separately |
| E7 run | duplicate/shadow report emitted with classifications; no similarity-based finding |
| Determinism | two consecutive runs produce byte-identical `.json` and `.md` (SHA-256 compared) |
| Report-only proof | `rg` confirms no `src/` file and no build/dev/vite config references the script or the reports |
| ESLint severity | `eslint.config.js` unchanged (hash match) |
| E1/E2/E3/E4 + `server-only` probes | all still firing via `eslint --stdin` |
| `tsgo` typecheck | clean |
| Production build | OK |
| `git diff --check` / `git diff --stat -- src/` | clean / empty |
| No runtime behavior change | public routes render unchanged, read-only spot check, no console errors |
| No generated runtime assets | build output contains no report file |
| Secret safety | reports contain only file paths, line numbers, symbol names and classifications; scanner never reads `.env` or `process.env` |

## 13. False-positive / false-negative analysis

**E5.** Documented exceptions are allowlisted with reasons. Runtime branding values are classified, never flagged as drift. Reference/design content is reported in its own bucket. CSS custom properties and `var(--…)` usage are token usage, not literals. SVG fills that reference tokens are token usage; a hard-coded SVG fill would surface as `review-required`. One-off visual treatments (`carrier-mark`) are exceptions. Known false negative: a literal built by string concatenation at runtime is invisible to a static scan — accepted and documented.

**E6.** Importer files and usage sites are always separate. Aliased and default imports are resolved to the canonical name; re-exports are reported as re-export edges, not consumers. Helper/class consumers (`surfaceClass`, `controlClass`, `actionPillClass`, `ACTION_PILL`) are counted as their own sources rather than folded into the component. Excluded systems and route-local exceptions appear in labelled groups so totals cannot silently absorb them. Known false negative: dynamic/computed usage is not counted.

**E7.** Only exact exported names and documented family names are matched. Renamed imports do not create duplicates (the definition site is what counts). Wrappers around a canonical component are reported as `review-required`, never as duplicates. Route-local definitions, shadcn/Radix primitives, intentionally independent components and business-coupled implementations each get their own classification. Known false negative: a duplicate implementation published under a different name is not detected — accepted, because name-free detection would require the rejected similarity heuristics.

Across all three: anything unclassifiable is `review-required`, never a violation.

## 14. Source/hash integrity

SHA-256 before and after, all expected unchanged: `src/styles.css`, all canonical ABox sources, the three shells, `src/lib/marketplace-store.ts`, `src/components/abox/logo.tsx`, `src/components/ui/table.tsx`, `src/components/ui/pagination.tsx`, the reference sources (`src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `src/components/design/reference-kit.tsx`, `src/lib/design-tokens.ts`), and `eslint.config.js`. No production source hash may change.

## 15. Expected file diff

- `scripts/governance-report.mjs` — new, report-only.
- `package.json` — one optional `governance:report` script entry.
- `.lovable/governance-report.json`, `.lovable/governance-report.md` — generated artifacts.
- `.lovable/manual-work-map.md` — Phase 47 governance block, after implementation only.

No `src/` change, no ESLint change, no runtime change, no migration.

## 16. Rollback

Delete `scripts/governance-report.mjs`, the two generated reports, the `governance:report` package script, and the Phase 47 governance block. Phase 45/46 enforcement is untouched by construction (`eslint.config.js` is not edited in this batch). Then rerun typecheck, build, full lint, `git diff --check`, and confirm hashes. No production source rollback is required.

## 17. Governance update

After implementation only, `.lovable/manual-work-map.md` records: the three analyzers and their exact scopes, the frozen E5 allowlist with reasons, the E6 dual counting units and the preserved DataTable discrepancy, the E7 name-based detection model and what it deliberately cannot see, the shared exception taxonomy, the report location and determinism guarantee, the measured findings at implementation time, the report-only status, and that no enforcement or migration is authorized by any finding.

## 18. Report-only confirmation

E5, E6 and E7 remain report-only after this batch. No ESLint error or warning is added for them, they are not wired into build, dev, CI or runtime, and no finding changes a file. Converting any of them into blocking enforcement requires a separately approved plan.

## 19. No production migration

This batch performs zero production migrations. No import is replaced, no component replaced or deleted, no wrapper created, no API, visual, or DOM change occurs. Genuine candidates are recorded for a future separately approved phase.

## 20. Readiness

Ready. All three diagnostics are statically computable, deterministic, dependency-free, strictly additive, and reversible by deleting four artifacts. The measured baseline is small enough (single-digit color literals, a well-enumerated canonical set) that the report's first output can be reviewed in full rather than sampled.
