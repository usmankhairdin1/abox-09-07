# Phase 28 — Card / Surface Source-of-Truth Gap Closure (PLAN ONLY)

## 1. Phase objective

Produce an implementation-ready plan for the next production source-of-truth gap: the card/surface family. The plan defines what exists, what is genuinely one shared component, what must stay experience-specific, a candidate canonical API, and a batched migration sequence that preserves exact output. No production implementation is authorized here.

## 2. Current card/surface inventory (measured from the repository)

Measured with repository-wide search, excluding the reference layer (`src/lib/design/**`, `src/components/design/reference-kit.tsx`, `/design-system`, `/design-guide`).

- `rounded-2xl border border-(border|hairline) bg-card …` appears in **106 production files**.
- Exact-string frequency of the dominant family:
  - `rounded-2xl border border-border bg-card p-5` — 108 occurrences
  - `rounded-2xl border border-border bg-card p-6` — 17
  - `rounded-2xl border border-border bg-card p-4` — 10
  - `rounded-2xl border border-border bg-card` (no padding) — 19
  - remaining long tail: hover/accent variants, `shadow-[var(--shadow-card)]`, `card-brackets edge-sheen`, `hairline` border token, responsive padding pairs.
- `border-hairline` overall: 206 production occurrences across 35 files.
- `style={{ boxShadow: "var(--shadow-card)" }}`: 24 occurrences across 14 files.
- Clickable/selectable card surfaces (`<button>`/`<Link>` carrying card classes): 11 occurrences.
- Dashed empty/placeholder surfaces already owned by `EmptyState` and by M06 `StateBlock`.

## 3. Existing card definitions

| Definition | Location | Nature |
| --- | --- | --- |
| shadcn `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter` | `src/components/ui/card.tsx` | `rounded-xl border bg-card text-card-foreground shadow` — different radius/shadow from ABox surfaces |
| `KpiCard` | `src/components/abox/kpi-card.tsx` | metric orb, inline shadow, brackets/sheen, CountUp |
| `PlanCard` | `src/components/abox/plan-card.tsx` | commerce card, two layouts (grid/horizontal) |
| `EmptyState` | `src/components/abox/empty-state.tsx` | canonical dashed surface (Phases 24–26) |
| `PlaceholderScreen`, `DownlineContextBanner`, `SuspendedMarketplaceNotice`, `QuoteEditPanel` | `src/components/abox/*` | single-purpose surfaces |
| Lucie `Section`, `Stat` | `src/components/lucie/ui.tsx` | sectioned card with header band + body, `shadow-card` class |
| Lucie-app `Section`, `StatCard` | `src/components/lucie-app/ui.tsx` | `Section` is layout-only (no surface); `StatCard` is a surface |
| M08 `M08Section`, `BlockerCard`, `ContextRibbon`, `TraceRail` | `src/components/m08/kit.tsx` | wraps Lucie `Section`, adds governance rails |
| M06 `StateBlock`, `MetaRail`, `Sheet` | `src/components/m06/kit.tsx` | state/meta/drawer surfaces |
| Route-local inline surfaces | ~100 route files | raw Tailwind panels |

`src/components/ui/card.tsx` currently has **5 production importers** (employer census/contribution/proposal/results, jet launch-readiness) plus `lucie-app/ui.tsx`; the rest of its references are reference-layer documentation.

## 4. Production consumer map

Three consumer groups to enumerate exactly in execution:

- **Group A — plain static panel.** Files using `rounded-2xl border border-border bg-card p-{4,5,6}` with no hover, no shadow, no decor, no interactivity. Largest group; heaviest concentration in `agency.*`, `platform.*`, `marketplace.admin.*`, `app.jet.*`, `plans.$planId`, `member.*`, `apply`, `review`, `handoff`, `compliance`, `accessibility`.
- **Group B — decorated/elevated panel.** Adds `shadow-[var(--shadow-card)]` or the inline `style` shadow, and/or `card-brackets edge-sheen`, and/or hover translate/border-primary. Concentrated in `index.tsx`, `auth.tsx`, `quote.tsx`, `app.quick-quote.tsx`, `app.jet.module1.tsx`, `coverage.tsx`, plus the ABox components themselves.
- **Group C — interactive card.** `<button>`/`<Link>` rendered as a card (11 sites), each carrying its own semantics, focus and hover contract.

Execution must produce the full file:line table for each group before any edit.

## 5. Duplicate implementation map

Recorded as parallel implementations, no winner assigned in this phase:

1. **Static panel duplication** — one class string repeated 108 times plus padding variants; no owning component.
2. **Elevated panel duplication** — two encodings of the same shadow (`shadow-card` utility class in Lucie vs inline `style={{ boxShadow: "var(--shadow-card)" }}` in ABox/lucie-app).
3. **Border token duplication** — `border-border` and `border-hairline` both used for the same visual hairline on card edges.
4. **Metric card duplication** — ABox `KpiCard`, Lucie `Stat`, lucie-app `StatCard`: same concept, three APIs, different typography scale and structure.
5. **Sectioned card duplication** — Lucie `Section` vs shadcn `Card`+`CardHeader` usage in the employer/jet routes.
6. **Radius duplication** — shadcn `rounded-xl` (18px) vs ABox `rounded-2xl` (22px) for surfaces of the same role.

## 6. Intentional experience-specific implementations (must remain separate)

- Lucie `Section` and M08 `M08Section` — governance-spine structure (header band, ID chip, trace rails, locale strings).
- M06 `Sheet`, `StateBlock`, `MetaRail` — module-scoped drawer/state semantics.
- `KpiCard`, `PlanCard`, `EmptyState` — already canonical in their own families; not absorbed into a generic card.
- Shells (`InternalShell`, `MarketplaceShell`, `MemberShell`) and `ModuleTabs` — shell structures.
- `CarrierMark`, `MetalBadge`, decor modules — brand/visual primitives.
- Dialog/drawer/popover surfaces in `src/components/ui/*` — overlay semantics, not cards.

## 7. Candidate canonical sources

- **Candidate 1 — new `Surface` component under `src/components/abox/`** that emits the existing ABox class strings verbatim. Covers Groups A and B without changing any token.
- **Candidate 2 — existing `src/components/ui/card.tsx`.** Rejected as-is for ABox routes: different radius, different shadow, sub-component model not used by the 106 files; adopting it would change rendered output.
- **Candidate 3 — no component, centralize class strings only** (an `action-pill.ts`-style class module). Lowest risk, weakest propagation.

Recommendation to decide at execution gate: Candidate 1 for Group A/B, with Candidate 3's class module as the single internal owner of the strings so Links/buttons in Group C can reuse them without changing element type.

## 8. Candidate canonical API (proposal, not built)

```
Surface({ padding, elevated, interactiveHover, decor, className, children, ...divProps })
padding:          "none" | "sm"(p-4) | "md"(p-5) | "lg"(p-6)   default "md"
elevated:         boolean  -> inline style boxShadow var(--shadow-card)
interactiveHover: boolean  -> transition/translate/border-primary set
decor:            boolean  -> card-brackets edge-sheen
```

`Surface` renders a native `div` only. No `as` prop, no Slot, no `asChild`, no polymorphic element switching, no automatic element substitution — so it cannot alter DOM semantics, accessibility, keyboard, link or button behavior during migration.

Plus `surfaceClass(opts)` exported for `<button>`/`<Link>` consumers, matching the ActionPill precedent. Interactive consumers keep their existing native element, href, handlers, focus and keyboard behavior and consume classes only; an existing Link/button card is never converted into a `Surface` wrapper.


## 9. Variant/state model

- Variants: padding scale, elevated, decor, hover.
- States: default, hover (only where already present), focus-visible (only on Group C, unchanged from today), disabled (not a surface concern).
- Any consumer whose class set cannot be expressed exactly by the variant matrix stays on its literal `className` and is recorded as an exception.

## 10. Accessibility model

- Default element is a plain `div`, no role, no ARIA — identical to today.
- Group C keeps its own `button`/`a` element, href, handlers, focus ring and tab order; the canonical source contributes classes only.
- No heading promotion, no `aria-live`, no landmark changes.

## 11. Responsive model

Responsive padding pairs (`p-4 md:p-5`) and grid/column classes stay in the consumer's `className`. The canonical source owns only base padding; it must never inject breakpoint classes.

## 12. Foundation/token dependencies

`--radius-2xl` (22px), `--radius` 0.875rem, `--shadow-card`, `--hairline`, `border`/`card`/`surface` color tokens, `card-brackets`, `edge-sheen`, `glass` utilities — all already in `src/styles.css`. No token is added, renamed or changed.

## 13. Migration eligibility rules

A consumer is eligible only if all hold:
1. Its full class string is reproducible byte-identically by the canonical API (order-insensitive after `cn`/tailwind-merge, verified by computed-style diff).
2. Element type is unchanged.
3. No inline `style` other than the exact `--shadow-card` shadow.
4. No hover/focus behavior outside the variant matrix.
5. Not inside a shell, overlay, governance spine or module kit listed in section 6.

## 14. Consumers eligible for exact migration

Group A (plain `p-5`/`p-6`/`p-4` panels) is the primary batch — the single largest cluster, one class string, no interactivity. Group B is a second batch once `elevated`/`decor` variants are proven. Exact file:line lists are produced at execution start, then migrated in controlled sub-batches with per-batch verification.

## 15. Consumers requiring exceptions

Lucie/M08 sectioned cards, M06 kit surfaces, shells, overlays, `KpiCard`/`PlanCard`/`EmptyState` internals, the 5 shadcn-`Card` routes (different radius/shadow), and any Group A/B site with bespoke class combinations that fail rule 13.1.

## 16. Consumers requiring further investigation

- The 11 interactive card sites — decide per site whether `surfaceClass` applies without touching focus behavior.
- `border-border` vs `border-hairline` split — same visual, two tokens; investigate before deciding whether both are supported variants or two separate families.
- lucie-app `StatCard` vs ABox `KpiCard` overlap.

## 17. Branding/White-Label boundary

Runtime branding stays owned by the branding routes/stores/assets. The canonical surface consumes existing CSS tokens only; it never reads, writes or re-owns branding state, and no branding file is touched.

## 18. Marketplace Asset Management boundary

Marketplace asset ownership remains in the marketplace admin routes/store/assets. Marketplace admin pages may consume the canonical surface for plain panels only; asset logic, upload flows and asset records stay untouched.

## 19. Exact-preservation regression strategy

Per batch: capture pre-migration DOM, verbatim class attribute, computed styles and bounding rectangles for each migrated node at 1440/834/390; migrate; re-capture; require zero diff. Any diff reverts the site to its literal class string and reclassifies it as an exception.

## 20. Browser proof strategy

Authenticated Playwright against `http://localhost:8080`, viewports 1440/834/390 measured independently. Evidence per batch: DOM hierarchy, class strings, computed styles (padding, gap, border, radius, background, shadow, transition), geometry, hover/focus where applicable, horizontal-overflow check, console/page errors. Known environment workarounds apply (mouse-driven range inputs, explicit drawer Close control). No SVG source inspection.

## 21. Typecheck/build/lint validation

`npx tsgo --noEmit`, production build, and ESLint on every touched file per batch. Pre-existing Prettier/hook findings are recorded separately and left unfixed; any new finding blocks the batch.

## 22. Rollback strategy

One batch per commit-sized unit; each batch is independently revertible to the literal class strings. Canonical source file hash recorded before/after every batch; `git status` verified clean at batch boundaries.

## 23. Risks/blockers

- Tailwind class-order/merge differences producing a non-identical class attribute string even with identical computed styles — mitigated by comparing both, and treating a string diff as a blocker unless the attribute is byte-identical.
- The `border-border`/`border-hairline` split could double the variant matrix.
- Large batch size raises review surface; mitigated by sub-batches with per-batch proof.
- Inline shadow vs utility-class shadow may not be interchangeable in specificity; must be proven, not assumed.

## 24. Open architectural decisions

1. New `Surface` component vs class-module-only centralization.
2. Whether `border-hairline` and `border-border` are one family or two.
3. Whether the 5 shadcn-`Card` routes stay on shadcn permanently.
4. Whether metric cards (`KpiCard`/`Stat`/`StatCard`) are ever unified — deferred to a later phase.
5. Component name and location (`src/components/abox/surface.tsx` proposed).

## 25. Proposed execution sequence

1. Phase 29 — build the canonical source + class module, zero consumers migrated; prove it renders byte-identical markup in isolation.
2. Phase 30 — batch-migrate Group A plain panels in sub-batches, full proof per sub-batch.
3. Phase 31 — Group B elevated/decor panels.
4. Phase 32 — resolve section 16 investigations; Group C decided per site.
5. Exceptions documented and closed out; no further migration without a new gate.

## 26. Authorization statement

NO production implementation is authorized in this phase. No production file, route, style, token, branding or marketplace asset is modified. No consumer is migrated. No component is created, renamed, merged or deleted. This document is a plan only.
