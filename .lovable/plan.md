# Phase 45 — Governance Enforcement Batch A (Static Import & Ownership Boundaries)

PLAN ONLY. No files changed in this phase.

## 1. Executive summary

Batch A adds static, configuration-only boundaries for the three approved Phase 44 candidates: E1 (production must not import the reference/design layers), E2 (the unconsumed shadcn `table`/`pagination` primitives must not become a second data-display source), E4 (the three shells stay independent).

All three are enforceable today with the ESLint flat config already in the project, using the `no-restricted-imports` rule that is already present, plus narrowly scoped file overrides for the two documented reference routes. Expected production diff: none. Expected new lint findings: zero, because the repository is already compliant — the rules freeze the current state rather than change it.

E3, E5, E6, E7 are explicitly out of scope.

## 2. Current configuration architecture (verified)

- `eslint.config.js` is a flat config built with `tseslint.config(...)`: one `ignores` entry (`dist`, `.output`, `.vinxi`), one main block for `**/*.{ts,tsx}`, then `eslint-plugin-prettier/recommended` last.
- The main block already sets `no-restricted-imports: ["error", { paths: [{ name: "server-only", ... }] }]`. Batch A extends this same rule with a `patterns` array and keeps the existing `paths` entry untouched.
- `tsconfig.json` maps only `@/*` → `./src/*`. There is exactly one alias form to restrict; relative-path escapes are handled by an additional relative pattern where meaningful.
- Reference/design layers as they actually exist: `src/lib/design/**`, `src/components/design/**`, and `src/lib/design-tokens.ts`. There are no `src/design-system/**` or `src/design-guide/**` directories; the reference surfaces are the two routes `src/routes/design-system.tsx` and `src/routes/design-guide.tsx`.
- Current importers of the reference layer: `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, and `src/components/design/reference-kit.tsx` (which imports `@/lib/design-tokens` — an intra-reference import).
- Current importers of `@/components/ui/table` and `@/components/ui/pagination`: zero. The only matches are string literals inside `src/lib/design/*` documentation data, which are not imports.
- Shell files: `src/components/abox/internal-shell.tsx`, `marketplace-shell.tsx`, `member-shell.tsx`. None imports another shell today.

## 3. E1 — block production imports of the reference/design layers

Add to the existing `no-restricted-imports` rule a `patterns` entry:

- `@/lib/design`, `@/lib/design/*`, `@/lib/design-tokens`
- `@/components/design`, `@/components/design/*`

Message names the invariant: "Reference/design layers are documentation-only. Production code must not import them."

The rule intentionally does not restrict the reverse direction (design importing production) — Phase 44 found no violation there, and restricting it would need a different mechanism.

## 4. E2 — block production imports of the unconsumed table/pagination primitives

Same `patterns` array, two more entries:

- `@/components/ui/table`
- `@/components/ui/pagination`

A plain restricted-import pattern is sufficient and safe: importer count is zero, there is no barrel file re-exporting them, and `DataTable` in `src/components/abox/data-table.tsx` does not import them. Message: "DataTable (src/components/abox/data-table.tsx) is the only table source; no pagination system exists in production. Adopting these primitives requires an approved phase."

The files themselves are not deleted or modified.

## 5. E4 — block shell-to-shell imports

Three per-file overrides appended after the main block, each restricting only the other two shells:

- `src/components/abox/internal-shell.tsx` → cannot import `./marketplace-shell`, `./member-shell`, or their `@/components/abox/...` equivalents
- `src/components/abox/marketplace-shell.tsx` → cannot import the internal or member shell
- `src/components/abox/member-shell.tsx` → cannot import the internal or marketplace shell

Scoped this way, routes and other components keep importing whichever single shell they render (verified: routes import exactly one shell each), and the rule only forbids the merge direction. A global rule is explicitly rejected — it would break every route.

Because per-file overrides replace `no-restricted-imports` for those files, each override re-states the `server-only` path entry plus the E1/E2 patterns so no boundary is silently dropped inside the shells.

## 6. Reference-route exception handling

Two file-scoped overrides, listing exactly `src/routes/design-system.tsx` and `src/routes/design-guide.tsx`, plus `src/components/design/**` (intra-reference imports). In those overrides `no-restricted-imports` keeps the `server-only` path and the E2 patterns, and drops only the E1 patterns. The production rule stays global and unweakened; the exception is enumerated file-by-file, so a new production file cannot inherit it.

## 7. Severity and scope

| Rule | Severity | Scope | Why |
| --- | --- | --- | --- |
| E1 | error | all `**/*.{ts,tsx}` minus the enumerated reference files | Boundary is binary and currently clean; zero false positives |
| E2 | error | all `**/*.{ts,tsx}` including reference files | Importer count is zero everywhere; nothing legitimate to allow |
| E4 | error | the three shell files only | Only the merge direction is forbidden |

No warnings: a warning on an already-clean, binary boundary adds noise to a 16,783-finding backlog and would be invisible.

## 8. Baseline and expected findings

- Baseline: 16,783 pre-existing findings (unchanged, not repaired).
- Expected new findings from Batch A: **0**. Each rule is verified clean before it is enabled; if any rule reports a finding, that rule is not shipped and the finding is documented instead of the rule being broadened.

## 9. Validation matrix

| Check | Expectation |
| --- | --- |
| Baseline lint capture before edit | 16,783 findings recorded |
| Targeted lint on `src/routes/**`, `src/components/abox/**`, `src/lib/**` for E1 | 0 findings |
| Targeted lint for E2 across all of `src/` | 0 findings |
| Targeted lint on the three shell files for E4 | 0 findings |
| Negative control (temporary in-memory probe only, never written) | each rule reports when the forbidden import is present |
| Lint on the two reference routes | still 0 E1 findings (exception works) |
| `server-only` restriction | still reported when present |
| Full lint | total equals baseline |
| `tsgo` typecheck | clean |
| Production build | OK |
| `git diff --check` | clean |
| `git diff --stat -- src/` | empty |
| Fresh `rg` import counts (design layer 3 files, ui/table 0, ui/pagination 0, shell-to-shell 0) | unchanged |
| Read-only public-route spot check (`/`, `/plans`, `/compare`, `/cart`, `/review`, `/handoff`, `/quote?step=1`) at 1440/834/390 | no console errors, no rendering change |

## 10. Source/hash integrity

SHA-256 recorded before and after, all must be unchanged: `logo.tsx`, `internal-shell.tsx`, `marketplace-shell.tsx`, `member-shell.tsx`, `data-table.tsx`, `empty-state.tsx`, `status-badge.tsx`, `kpi-card.tsx`, `page-header.tsx`, `surface.tsx`, `control.tsx`, `field.tsx`, `notice-page.tsx`, `action-pill-component.tsx`, `marketplace-page-layout.ts`, `motion.tsx`, `marketplace-store.ts`, `ui/table.tsx`, `ui/pagination.tsx`, `styles.css`, `__root.tsx`.

## 11. Expected file diff

- `eslint.config.js` — the only code/config change.
- `.lovable/manual-work-map.md` — Phase 45 governance block, appended after implementation only.

No `src/` file, route, component, style, asset, or branding file changes.

## 12. Risk / false-positive analysis

- E1: near-zero risk; the only three importers are enumerated as exceptions. Risk if a new reference route is added later without an override — the failure is a clear, actionable lint error, not a runtime break.
- E2: zero risk; no importer exists. Residual risk is philosophical only (the files remain in the tree).
- E4: zero risk today; the per-file scope cannot affect routes. Main hazard is an over-broad pattern, avoided by restricting only the two sibling shell paths per file.
- Restated boundaries inside overrides are the main maintenance hazard (drift between blocks); mitigated by shared constant arrays defined once at the top of the config.
- No rule inspects classes, DOM, or visual similarity.

## 13. Rollback

Revert `eslint.config.js` to its current single-`server-only` form and delete the Phase 45 governance block. No production source rollback is needed because none changes. Then rerun typecheck, build, full lint, `git diff --check`, and confirm hashes. Phases 1–44 are unaffected.

## 14. Governance update

After implementation only, `.lovable/manual-work-map.md` gains a Phase 45 block recording: the three accepted rules and their exact invariants, the enumerated reference-route exceptions, the shell-independence rule, the unchanged baseline, that Batch A is configuration-only, and that E3/E5/E6/E7 remain unimplemented.

## 15. Not included

E3 (branding-store imports in reference layers), E5 (raw colour scan), E6 (consumer-count report), E7 (duplicate-export scan) are **not** part of this batch. No script, scanner, report generator, or registry is created.

## 16. Readiness

Ready. All three rules are narrowly enforceable with the existing flat config, the repository is already compliant, expected new findings are zero, and rollback is a single-file revert.
