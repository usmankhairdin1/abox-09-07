# Phase 18 — Canonical StatusBadge Production Implementation Plan (plan only)

Phase 18 produces exactly one document. No production or reference file changes.

Deliverable on approval: `.lovable/phase-18-statusbadge-canonical-production-implementation-plan.md`

Plan mode only permits writing this plan file, so the Phase 18 document itself is created as the first (and only) action after approval.

## Fresh measurement (taken from the current repository)

Reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`) excluded from all counts below.

- Source: `src/components/abox/status-badge.tsx` — single shared source, 30 lines, no other definition of it exists.
- Production importers: **89 files** (87 route files + `src/components/abox/plan-card.tsx` + `src/components/m06/kit.tsx` + `src/components/lucie-app/ui.tsx`; the two reference routes are excluded).
- Call sites: **163** `<StatusBadge …>` usages.
- Tone is passed dynamically (`tone={…}`) far more often than literally — 172 dynamic `tone={` occurrences across the app (includes other components' `tone` props; the document will separate these per component).
- `className` is passed to StatusBadge exactly **once**: `src/routes/app.employer.ichra.tsx:68` (`className="mt-3"`).
- Zero call sites omit `tone` in a way that relies on the default? No — the default `tone="muted"` exists in source; the document records which call sites rely on it.

## Current API (from source, unchanged)

`StatusBadge({ tone = "muted", children, className })`
- `tone?: "sage" | "primary" | "warning" | "muted" | "destructive" | "info"` — six tones, default `muted`.
- `children: React.ReactNode` — required.
- `className?: string` — merged through `cn`.
- No ref, no events, no `asChild`, no icon prop, no size/density prop.
- Renders a single `<span>` containing a decorative `<span aria-hidden>` dot plus children.
- Colour is computed inline with `color-mix(in oklch, var(--tone) …)` against `--foreground` / `--card`, driven by a `[--tone:var(--x)]` utility class per tone.

## Distinct systems that must stay separate

- **F — semantic status:** `StatusBadge` (6 tones).
- **E — metal/tier:** `MetalBadge` (`src/components/abox/metal-badge.tsx`, 6 tiers, 3 consumers: `plan-card.tsx`, `plans.index.tsx`, `cart.tsx`). Different token family and foreground model. Not merged.
- **C — route-local/alternate:** `StatusTag` (`m06/kit.tsx`, wraps StatusBadge via a BADGE_TONE map), `StatusChip` (`lucie-app/ui.tsx`, wraps StatusBadge via CHIP_TONE), `Tag`/`Note` (`lucie/ui.tsx`, own `TONE_CLASS`, used by `m08/kit.tsx`), `ui/badge` (used only in `lucie-app/ui.tsx`). Recorded, not migrated, no winner chosen.
- Inline hand-built chips: only `src/routes/index.tsx` matched the chip class signature. Recorded as an open item, untouched.

## Canonical source decision

Evidence supports declaring the existing `src/components/abox/status-badge.tsx` the canonical source as-is: it is already the single definition, already imported by every semantic-status consumer, has no competing implementation, and has effectively no className composition at call sites. **No second file is proposed** — unlike ActionPill, there is no class-map module occupying the name, so no `-component` split is needed.

Consequence: the "migration" in a future phase is mostly zero-diff confirmation plus explicitly deciding the boundaries against `StatusTag`, `StatusChip`, `Tag`, and `ui/badge` — each of which stays untouched in this phase.

## Document structure (the 23 required sections)

1. Current production StatusBadge source
2. Fresh consumer count and measurement method
3. Consumer inventory (all 89 files, with element context)
4. Current API, exactly as coded
5. Tone inventory: exact key → CSS variable, consumers per tone, evidenced meaning, foreground model, light/dark behaviour
6. DOM structure: outer `<span>`, aria-hidden dot, inline style object
7. Foundation dependencies: `--sage`, `--primary`, `--warning`, `--foreground`, `--destructive`, `--info`, `--card`, `rounded-full`, `px-2.5 py-0.5`, `text-[10px]`, `font-semibold`, `tracking-[0.12em]`, `gap-1.5`, 1px border, no shadow/motion/opacity
8. Experience distribution: Dashboard/Admin (agency, platform, JET), Marketplace admin, Member/Account, Shopping (`plans`, `cart`, `compare`, `plan-card`), Web/Marketing (minimal)
9. Duplicate/overlap inventory (the four alternates above, unranked)
10. Inline/alternate status implementations
11. Accessibility behaviour: non-interactive span, no role, decorative dot hidden, meaning carried by text
12. Responsive behaviour: none tone-specific; fixed type scale at all widths
13. Density behaviour: single density; no size prop
14. Current propagation model: token → tone class → inline color-mix → span → consumer; token edits propagate automatically, tone-vocabulary edits do not
15. Future canonical source decision (keep existing file)
16. Migration eligibility rules: direct StatusBadge usage only; wrappers and inline chips blocked pending separate decisions
17. First-consumer proof-gate candidates (below)
18. Exact regression contract at 1440 / 834 / 390: tagName, full DOM subtree, class attribute, inline style attribute, dimensions, position, computed typography and colour, accessible name, console, screenshots; any unexplained difference stops the phase
19. Rollback contract: per-file revert, no unrelated files touched, no compensating edits
20. Out-of-scope areas: foundations, tokens, MetalBadge, Button, PageHeader, DataTable, shells, route-local kits, Branding & White-Label, Marketplace Asset Management, reference layer, cleanup of unused primitives
21. Open decisions (below)
22. Future migration sequence, grouped by experience
23. Final implementation file map

## Proposed proof-gate consumers (representative, evidence-selected)

| Route | File | Usage | Why representative |
|---|---|---|---|
| `/agency/organizations/:id/readiness` | `agency.organizations.$organizationId.readiness.tsx` | dynamic tone from a `RESULT_TONE` map, list rows | dynamic tone + dashboard list |
| `/plans` | `abox/plan-card.tsx` | three badges, conditional render, ternary tone | shopping surface + conditional rendering |
| `/app/employer/ichra` | `app.employer.ichra.tsx` | the only `className` consumer | proves className passthrough |
| `/app/schedule` | `app.schedule.tsx` | ternary tone in a card list | simple static baseline |

## Open decisions (recorded, not resolved)

- Whether `warning` and `destructive` overlap in meaning at some call sites.
- Whether `muted` is a tone or an absence of tone (it is also the default).
- Whether `StatusTag`, `StatusChip`, and `Tag` should ever converge on StatusBadge.
- Whether `ui/badge`'s single remaining consumer stays.
- Whether the inline chip in `index.tsx` is a status or a marketing element.

## Validation for this phase

Confirm `git status` shows only the new plan document; production and reference diffs empty; build unchanged.
