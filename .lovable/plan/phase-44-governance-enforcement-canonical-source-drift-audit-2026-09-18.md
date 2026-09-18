# Phase 44 — Governance Enforcement & Canonical-Source Drift Audit (PLAN ONLY)

Audit only. No production code, UI, route, asset, branding, token, component or runtime-ownership change. No lint rule, script or registry created in this phase. Preservation rule: not one pixel, not one dot.

## 1. Fresh drift inventory

Measured on the current tree (`src/routes/**`, `src/components/**`, `src/lib/**`, excluding design/reference layers):

Canonical component adoption (files importing each source):
- `status-badge` 89, `surface` 82, `action-pill-component` 38, `page-header` 25, `data-table` 20, `kpi-card` 18, `empty-state` 10, `marketplace-page-layout` 10, `notice-page` 4, `action-pill` (class helper) 2, `control` 2, `field` 2, `motion` 1.

Style-source duplication signals (evidence, not verdicts):
- Surface base string `rounded-2xl border border-hairline bg-card` appears 54 times outside `surface.tsx`. Phases 29–32 already classified these as Group B/C exceptions (elevated, decorated, interactive/selectable variants) — not accidental copies.
- Control base string `h-10 w-full rounded-lg border border-border bg-background` appears in 16 files while `controlClass` has 2 importers. Phase 33 classified the non-adopters as differing in height, radius, padding or text role.
- `.story-link` is used 59 times in production with no definition in `src/styles.css` — an unowned pattern carried since Phase 3, still unowned.
- No literal `#rrggbb` colour exists in production routes/components. `oklch()` literals outside `styles.css` appear only in `carrier-mark.tsx` (3) and `app.jet.branding.tsx` (4, display copies).

Component/system duplication:
- Tables: 1 canonical `data-table.tsx` + 5 route-local tables (all auth-gated), per Phase 42.
- Pagination: zero production consumers of any kind.
- Unconsumed shadcn primitives (0 production importers): accordion, alert-dialog, aspect-ratio, avatar, breadcrumb, calendar, carousel, chart, collapsible, context-menu, form, input-otp, menubar, navigation-menu, pagination, resizable, scroll-area, separator, sidebar, table, toggle, toggle-group. These are the principal accidental-second-source hazard.
- Consumed shadcn primitives: button 16, select 7, card 6, input 5, label 4, dialog 3, dropdown-menu 3, skeleton 3, tabs 3, tooltip 3, sheet 2, textarea 2, plus eleven single-consumer primitives.

Governance drift:
- `.lovable/manual-work-map.md` records Phases 1–43 with the newest blocks at lines 297–541. No statement contradicts the current tree as measured above.
- `roadmap.md` still lists Phase 3 as deferred (FUTURE OPPORTUNITY) — stale relative to Phases 36–43; correcting it is a governance-only future task, not part of this audit.
- Consumer counts recorded in older phases (e.g. DataTable "23 consumers") differ from today's measured import-file counts (20 files) because earlier counts were call sites, not files. Recorded as a counting-unit inconsistency to normalise in a future governance pass, not as architectural drift.

## 2. Canonical-source matrix

| Domain | Canonical source | Production consumers | Known exceptions | Drift found | Enforceable? |
| --- | --- | --- | --- | --- | --- |
| Tokens / foundations | `src/styles.css` | Whole app via utilities | `carrier-mark.tsx`, `app.jet.branding.tsx` oklch literals | None | Yes — static: ban new raw colour literals in production |
| ActionPill | `action-pill-component.tsx` + `action-pill.ts` | 38 | Shell-local and business buttons | None | Partial — ownership only |
| StatusBadge | `status-badge.tsx` | 89 | Lucie/M06/M08 kits | None | Partial |
| KpiCard | `kpi-card.tsx` | 18 | Route-local metric blocks | None | No — visual similarity only |
| PageHeader | `page-header.tsx` | 25 | Three shells own their own headers | None | Partial |
| DataTable | `data-table.tsx` | 20 | 5 route-local tables (Phase 42) | None new | Yes — ban a second table source |
| EmptyState | `empty-state.tsx` | 10 | DataTable in-table empty row | None | Partial |
| Surface | `surface.tsx` / `surfaceClass` | 82 | 54 Group B/C variants | None new | No — string matching rejects legitimate variants |
| Controls | `control.tsx` / `controlClass` | 2 | 16 differing control shapes | None new | No |
| Field composition | `field.tsx` | 2 | Wrapping-label exceptions (Phase 34) | None | No |
| Marketplace page layout | `marketplace-page-layout.ts` | 10 | Dashboard shells excluded by instruction | None | Partial |
| Typography | `styles.css` text roles | App-wide | `.story-link` unowned (59 uses) | Unowned pattern | Partial |
| Spacing / layout | `styles.css` + page-layout constant | App-wide | Shell-specific shells | None | No |
| Border / radius / elevation | `styles.css` | App-wide | Group B/C surfaces | None | No |
| Motion / interaction | `motion.tsx` + `styles.css` keyframes | 1 | 77 route-local transitions | None new | No |
| Accessibility / interaction states | Native semantics + `controlClass` focus ring | Distributed | Phase 41 C1–C8 exceptions | None | No |
| Navigation / page composition | `nav-config.ts` + three shells | 3 shells | Shells intentionally independent | None | Partial |
| Branding / White-Label | Brand record in `marketplace-store.ts` | marketplace-shell, `routes/index.tsx`, admin screens | 37 literal brand strings (Phase 43 D1) | Documented | Yes — ban branding data in design layers |
| Marketplace Asset Management | `marketplace-store.ts` assets + `marketplace.admin.assets.tsx` | 1 admin screen | — | None | Yes — ban asset duplication into design layers |

## 3. Import / ownership boundary audit

- Production files importing `@/lib/design/**` or `@/components/design/**`: **zero**, excluding the two unlisted reference routes `/design-system` and `/design-guide`. The reference boundary holds.
- `src/lib/design/**` importing `@/components/abox/**`: **zero**. No reverse ownership confusion.
- No circular ownership found between canonical sources.
- Shells do not import one another. Branding data is read only through `marketplace-store.ts`.
- Existing lint already has one `no-restricted-imports` entry (`server-only`), so the mechanism for path bans exists and is additive.

## 4. Duplicate-source findings

- F1 — 22 unconsumed shadcn primitives, including `table.tsx` and `pagination.tsx`, could become competing canonical sources by a single future import. Highest-value, lowest-risk enforcement target.
- F2 — Five route-local tables (auth-gated) duplicate the table *idea* but not DataTable's DOM, padding or dividers. Intentional, documented, non-migratable today.
- F3 — 54 Surface-adjacent and 16 control-adjacent class clusters. Already adjudicated as legitimate variants; string-based enforcement would produce mass false positives.
- F4 — `.story-link` used 59 times with no owning declaration. Genuine unowned pattern, unchanged since Phase 3.
- F5 — 37 literal brand strings bypassing the runtime brand record (Phase 43 D1), all in auth-gated shells or static route metadata.
- F6 — Counting-unit inconsistency between phases (call sites vs importing files).

## 5. Exception register

| Exception | Owner | Reason | Scope | Ever migratable | Evidence required first |
| --- | --- | --- | --- | --- | --- |
| Three shells | each shell file | Deliberately independent experiences | internal/marketplace/member shells | No | n/a — merge prohibited |
| Lucie | `src/components/lucie*`, `src/lib/lucie*` | Separate prototype spine | whole subtree | No | n/a |
| M06 | `src/components/m06/**` | Governed module kit | whole subtree | No | n/a |
| M08 | `src/components/m08/**` | Governed baseline | whole subtree | No | n/a |
| AI elements | `src/components/ai-elements/**` | Vendored chat primitives | whole subtree | Unlikely | Upstream divergence analysis |
| Branding / White-Label runtime | `marketplace-store.ts` Brand + admin screens | Runtime-owned tenant data | brand record + screens | No | n/a |
| Marketplace Asset Management | store assets + `marketplace.admin.assets.tsx` | Runtime asset lifecycle | assets only | No | n/a |
| Group B/C surfaces | route files | Elevated/decorated/interactive variants | 54 sites | Case by case | Exact parity at 1440/834/390 |
| Control-shape variants | route files | Different height/radius/padding | 16 files | Case by case | Exact parity |
| Route-local tables | 5 route files | Different padding, dividers, derived data | 5 sites | Case by case | Parity + authenticated runtime access |
| Distinct shadcn/Radix primitives | `src/components/ui/**` | Library-owned behaviour | consumed primitives | No | n/a |
| Business-coupled route components | each route | Domain logic embedded | per route | No | n/a |
| Responsive-specific structures | each route | Viewport-specific markup | per site | Case by case | Three-viewport parity |

## 6. Enforcement candidate register

| ID | Invariant protected | Mechanism | Static | Prod output change | Additive | Recommended |
| --- | --- | --- | --- | --- | --- | --- |
| E1 | No production file imports `@/lib/design/**` or `@/components/design/**` | ESLint `no-restricted-imports` pattern with an override allowing only `src/routes/design-system.tsx` and `src/routes/design-guide.tsx` | Yes | No | Yes | Yes |
| E2 | No second table source: `@/components/ui/table` and `@/components/ui/pagination` stay unconsumed | ESLint restricted-import patterns | Yes | No | Yes | Yes |
| E3 | Runtime branding never imported into design/reference layers | ESLint restricted-import scoped to `src/lib/design/**` and `src/components/design/**` banning `@/lib/marketplace-store` | Yes | No | Yes | Yes |
| E4 | Shells never import one another | ESLint restricted-import between the three shell files | Yes | No | Yes | Yes |
| E5 | No new raw hex/oklch colour literals in production routes/components | Custom audit script with a frozen allowlist (`carrier-mark.tsx`, `app.jet.branding.tsx`) | Yes | No | Yes | Yes, report-only first |
| E6 | Canonical-source consumer counts stay observable over time | Generated audit report (derived artefact, not governance) | Yes | No | Yes | Yes, report-only |
| E7 | No duplicate canonical component definition (same exported name in two files) | AST/export-name scan | Yes | No | Yes | Yes, report-only |
| E8 | Class-cluster duplication of `surfaceClass` / `controlClass` | String or AST class matching | Yes | No | Yes | **No** — 70 known legitimate variants, unacceptable false positives |
| E9 | "Design system is followed" generically | any | — | — | — | **No** — no identifiable invariant |
| E10 | Runtime propagation of brand values to all shells | requires authenticated runtime evidence | No | — | — | **No** — unmeasurable today |

## 7. Static vs runtime enforceability

Statically enforceable: import boundaries (E1–E4), literal-token introduction (E5), duplicate export names (E7), consumer-count reporting (E6). Not statically enforceable: visual/DOM equivalence, responsive behaviour, accessibility parity, White-Label propagation, table behaviour equivalence — all require runtime evidence, and the relevant consumers are auth-gated, so they stay audit-driven per phase.

## 8. False-positive / false-negative analysis

- E1: near-zero false positives (two reference routes need an explicit override); false negative only via dynamic import — acceptable.
- E2: zero false positives today (both modules unconsumed); false negative if someone forks the file instead of importing it — E7 partially covers this.
- E3/E4: zero known violations, so enabling them cannot break existing code; false negatives via indirect re-export.
- E5: false positives on legitimate new one-off colours; must ship report-only with a frozen allowlist and be promoted to error only after a clean baseline.
- E7: false positives where two modules legitimately export the same generic name; report-only.
- E8: mass false positives — rejected.
- Any rule producing false positives against current legitimate architecture stays disabled until the exception model is corrected.

## 9. Proposed future enforcement batches

- Batch A (config only): E1 + E2 + E4 as ESLint errors, with the two reference-route overrides. Expected: zero new findings against the current tree.
- Batch B (config only): E3 scoped to design/reference layers. Expected: zero findings.
- Batch C (additive script, no wiring into build): report-only audit producing E5, E6, E7 output on demand. Not part of the build or dev server.
- Batch D (governance only): record the canonical-source matrix, exception register, accepted rules and non-enforceable domains in `.lovable/manual-work-map.md`; optionally normalise the counting unit and refresh `roadmap.md`.
- No batch touches a production source file. Each batch is independently approvable and independently reversible.

## 10. Validation gates

For any future enforcement implementation: baseline lint capture before enabling; rerun lint and confirm zero new findings beyond the existing 16,783-finding baseline; `tsgo` clean; harness build OK; `git diff --check` clean; production source diff empty; locked-source hashes unchanged (all ABox canonical sources, three shells, shadcn primitives, `styles.css`, `marketplace-store.ts`, `logo.tsx`); production import-graph re-scan; exception-register verification; public-route runtime spot-check at 1440/834/390 confirming zero DOM, visual or console change; failure messages must name the exact violated invariant, not a generic design-system message.

## 11. Rollback strategy

Each batch is reversible on its own: Batches A/B revert `eslint.config.js` to the current content (single `server-only` restriction); Batch C deletes the added script file; Batch D deletes its governance block. Rollback leaves every production source byte-identical, then reruns typecheck, build and lint, verifies `git diff` and locked hashes, and confirms Phases 1–43 are unaffected. If any enforcement work ever produces a rendering or behaviour change, stop immediately and roll back.

## 12. Governance update plan

After eventual execution only, append a Phase 44 block to `.lovable/manual-work-map.md` recording: the canonical-source matrix, the drift inventory, the enforcement candidate register with accepted and rejected rules, explicitly non-enforceable domains, the exception register with owner/reason/scope/migratability/evidence, reference-vs-runtime import boundaries, branding and asset boundaries, an audit cadence, exact-preservation validation requirements, the rule that zero migration is valid, and the rule that visual similarity alone never establishes duplication. `.lovable/manual-work-map.md` remains the single human governance source; any generated report or registry is explicitly a derived implementation aid, never a competing source.

## 13. Expected changed files

Plan only — **none**, including `.lovable/manual-work-map.md`. After eventual approved execution: `eslint.config.js` (Batches A/B), one new report-only script (Batch C), `.lovable/manual-work-map.md` and possibly `roadmap.md` (Batch D). No file under `src/` changes in any batch.

## 14. Migration statement

Phase 44 performs **ZERO production migrations and ZERO production modifications**. The import boundary between production and the reference/design layers is currently clean in both directions, branding and asset ownership are intact, and no new accidental duplication was found beyond the exceptions already documented in Phases 29–43. The enforceable surface is narrow and ownership-based: import boundaries, the unconsumed table/pagination hazard, shell isolation, and report-only literal/duplicate-export scans.
