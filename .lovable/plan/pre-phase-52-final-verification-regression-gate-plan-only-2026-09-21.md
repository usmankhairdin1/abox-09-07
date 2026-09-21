# Pre-Phase-52 Final Verification & Regression Gate — PLAN ONLY

Audit only. No production file, reference file, route, asset, branding value, token or governance rule is created, modified, renamed or deleted. No Figma file is touched. The only file this gate would ever write is a governance block appended to `.lovable/manual-work-map.md`, and only after this plan is approved.

## H. No files modified during Plan Mode

During this plan-mode task nothing at all is written except `.lovable/plan.md`. No commands that change state are run. Every check listed below is read-only (`rg`, `cksum`, `git diff --stat`, typecheck, lint, build-log read).

## A. Audit approach and verification sequence

Run in this fixed order, so later checks inherit a known-good baseline:

1. **Integrity baseline** — `git status --porcelain` and `git diff --stat -- src/ public/ eslint.config.js package.json` to confirm no uncommitted production drift.
2. **Hash gate** — recompute the Phase 49 locked `cksum` set and compare each against the recorded value.
3. **Static health** — typecheck, lint totals, build-error log read.
4. **Enforcement gate** — confirm E1/E2/E3/E4 and the server-only rule are still present and configured as errors.
5. **Canonical ownership sweep** — one definition + measured consumers per canonical family.
6. **Boundary sweep** — reference↔production, branding runtime ownership, shell independence.
7. **Documentation consistency** — Phase 50 blueprint and Phase 51 readiness claims re-read against the code as it is now.
8. **Classification** — each finding assigned exactly one of B0/B1/B2.

## B. Phase-by-phase verification method (Phases 1–51)

Each phase is verified by re-measuring its recorded outcome, never by re-reading its own record as proof.

- **Phases 1–11 (foundations, inventory, architecture, graph, governance readiness)** — reference-only. Verified by confirming the modules under `src/lib/design/` still exist, still typecheck, and still have zero importers outside the reference layer and the two reference routes.
- **Phases 12–16 (component architecture and canonical library definition)** — verified by confirming each named canonical component file exists at its recorded path with its recorded export name.
- **Phases 17–27 (ActionPill, StatusBadge, KpiCard, PageHeader, DataTable, EmptyState consumer proofs)** — verified by searching for each export's importers across `src/` and confirming the component is the only definition of its concept in production; consumer counts are re-measured, not copied.
- **Phases 28–32 (Surface groups)** — verified by confirming `surface.tsx` is the single canonical surface source and that Group B/C exceptions are still exceptions (distinct decoration/interaction, not identical output).
- **Phases 33–34 (Control, Field)** — verified against `control.tsx` and `field.tsx` importers.
- **Phases 35–42 (navigation, typography, sizing, spacing, radius/elevation, motion, accessibility, tables)** — all recorded as zero-migration. Verified by confirming no new centralizing abstraction appeared for these concerns and that the recorded counts (tables, pagination consumers, motion and ARIA tallies) still match within the same measurement method.
- **Phase 43 (branding/white-label)** — verified by confirming the Brand record and `getActiveBrand`/`getDraftBrand` still live in `src/lib/marketplace-store.ts` and that no branding value has been copied into `src/lib/design/**` or `src/lib/design-tokens.ts`.
- **Phases 44–47 (enforcement batches)** — verified by reading `eslint.config.js` for the four rule groups plus server-only paths, and by running the report script to confirm it is still deterministic and still report-only for E5/E6/E7.
- **Phase 48 (reconciliation model)** — verified by confirming the governance artifacts still carry the classification vocabulary and staleness fields.
- **Phase 49 (outcome B)** — verified by re-running its completion checklist: every canonical family single-sourced, zero FUTURE MIGRATION CANDIDATE, zero REVIEW-REQUIRED, hashes unchanged, `src/` diff empty.
- **Phase 50 (Figma blueprint)** — verified for internal consistency only: every production file, export and token the blueprint names must still exist with that name.
- **Phase 51 (write path)** — verified as a readiness conclusion only. The gate confirms no Figma file, plugin, token or generation artifact exists in the project, so the conclusion cannot be mistaken for a build.

## C. Files, directories and evidence inspected

- `src/components/abox/` — action-pill.ts, action-pill-component.tsx, status-badge.tsx, kpi-card.tsx, page-header.tsx, data-table.tsx, empty-state.tsx, surface.tsx, control.tsx, field.tsx, notice-page.tsx, marketplace-page-layout.ts, motion.tsx, logo.tsx, plan-card.tsx, metal-badge.tsx, the three shells, planai-assistant.tsx, plan-o-assistant.tsx.
- `src/components/ui/` — consumed vs unconsumed primitive counts, especially `table.tsx` and `pagination.tsx` (must remain zero-importer).
- `src/routes/**` — all production routes; the five auth-gated route-local tables stay NOT CAPTURED and are inspected at source only.
- `src/lib/marketplace-store.ts`, `src/lib/org-store.ts` — brand ownership and the persisted `ridSeq` fix.
- `src/styles.css` — theme blocks, custom variant, utilities, foundation roles.
- `src/lib/design/**`, `src/components/design/reference-kit.tsx`, `src/lib/design-tokens.ts`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx` — reference layer isolation.
- `eslint.config.js`, `scripts/governance-report.mjs`, `package.json`.
- `.lovable/manual-work-map.md`, `.lovable/governance-report.json`, `.lovable/governance-report.md`, `roadmap.md` — read for consistency, not treated as evidence of code state.
- `public/favicon.ico` — presence only.

## D. Validation, build, type, lint and runtime checks

- `git status --porcelain`; `git diff --stat -- src/`
- `cksum` on the ten locked files; compare to the Phase 49 values.
- `tsgo` typecheck — must be clean.
- `bun run lint` — total findings recorded; `no-restricted-imports` violations must be 0. The pre-existing backlog is not repaired and its size alone is not a finding.
- `/tmp/observability/build-errors.log` — newest entry must read build OK.
- Negative controls for E1, E2, E3, E4 and the server-only rule, each exercised in a throwaway file under `/tmp` only (never inside the project), to prove the rules still fire.
- `bun run governance:report` run twice; outputs compared byte-for-byte for determinism, then the working tree checked to confirm nothing under `src/` changed.
- Runtime: the public routes (`/`, `/faq`, `/select`, `/quote?step=1`, `/plans`, `/compare`, `/cart`, `/review`, `/handoff`) loaded headless at 1440/834/390 to confirm they still render without console or runtime errors. Auth-gated areas are not fabricated and stay NOT CAPTURED.

## E. How B0/B1/B2 are determined

- **B0 — blocks Phase 52.** Evidence shows the current code contradicts an approved outcome in a way that would make generated Figma content wrong or make production unsafe: a locked hash changed without an approved phase, a canonical component forked or duplicated, a branding value copied into the reference layer, a shell merged, a reference module imported by production, an enforcement rule removed or downgraded, typecheck or build failing.
- **B1 — required correction, not a blocker.** A real inconsistency that does not corrupt the Figma source mapping: an export renamed without its record updated, a consumer count that no longer matches under the same measurement method, a governance artifact whose schema no longer matches the code it describes.
- **B2 — record only.** Documentation wording, known divergent counting units (DataTable importer-vs-usage-site figures), the unused `planai-assistant.tsx`, the arbitrary numeric Tailwind values, the lint backlog, the `/quote?step=1` mobile overflow, the `roadmap.md` duplicate Phase 3 heading.

Each finding names the file, the exact evidence and the check that produced it. No ranking, scoring or priority ordering beyond the three buckets. A finding without evidence is not recorded.

## F. How intentional exceptions are verified

Each documented exception is re-tested against the migration-eligibility test, not assumed: two or more independently measurable consumers, same semantic role, same element semantics, same DOM shape, same class output, same responsive and accessible behavior, no business coupling, no shell or library conflict. An exception is only reclassified when current evidence proves every criterion is met.

Exceptions re-tested: the three shells, Lucie, M06, M08, AI-elements, Branding/White-Label runtime, Marketplace Asset Management, route-local auth-gated tables, metal vs status badge, store selector naming, Surface groups B and C, interaction states, Tailwind breakpoints, unconsumed shadcn primitives, the exported `Route` constant. Anything that fails a criterion stays an exception and is recorded as verified-still-valid.

## G. Completion criteria for this gate

The gate is complete when, with evidence:

1. Working tree clean and `src/` diff empty.
2. All ten locked hashes unchanged.
3. Typecheck clean, build OK, `no-restricted-imports` at 0.
4. All five enforcement controls fire.
5. Governance report deterministic across two runs.
6. Every canonical family confirmed single-sourced with re-measured consumers.
7. Reference layer confirmed to have zero production importers.
8. Branding and Marketplace Asset Management confirmed runtime-owned only.
9. Three shells confirmed independent.
10. Phase 50 blueprint confirmed to name only files and exports that still exist.
11. Phase 51 confirmed as a readiness conclusion with no Figma artifact in the project.
12. Every finding classified B0/B1/B2, with zero B0 outstanding.

The gate's verdict is one of **CLEAR FOR PHASE 52** or **NOT CLEAR — B0 OUTSTANDING**, and any B0 fix is its own separately approved phase, never done inside this gate.

## Rollback

Zero-change audit. If the governance block is later written, rollback is removing that block from `.lovable/manual-work-map.md`. Nothing else changes.
