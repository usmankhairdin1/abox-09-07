# Phase 30 — Group A Plain Surface Batch Migration (PLAN ONLY)

No production file is created, modified or migrated by this document. Implementation begins only after this plan is separately approved.

## 1. Objective

Migrate eligible Group A plain static panels to the Phase 29 canonical `Surface` in `src/components/abox/surface.tsx` (and `surfaceClass(opts)` where the element must stay as-is), so one controlled source change propagates to all of them — with the rendered application byte- and pixel-identical.

This is not authorization to normalize every card-like surface.

## 2. Current measurement (re-measured at plan time, re-measured again at execution start)

Searching `src/` excluding `src/lib/design/**` and `src/components/design/**`:

| Class string | Occurrences |
| --- | --- |
| `rounded-2xl border border-border bg-card p-5` | 129 |
| `rounded-2xl border border-border bg-card p-6` | 17 |
| `rounded-2xl border border-border bg-card p-4` | 15 |

Spread across 87 files, overwhelmingly route files. Only one shared component under an ABox path matches (`src/components/abox/quote-edit-panel.tsx`); no match inside Lucie, Lucie-app, M06 or M08 sources. These are raw-string counts only — they are a search starting point, not the eligibility list.

Highest-density files (candidate batch anchors): `agency.organizations.$organizationId.index.tsx` (9), `quote.tsx` (5), `app.jet.module1.tsx` (5), `marketplace.admin.content.tsx` (4), `app.send-quote.tsx` (4), `app.jet.branding.tsx` (4), `app.agency.index.tsx` (4), `agency.marketplace-participation.tsx` (4), `accessibility.tsx` (4).

## 3. Fresh inventory (execution step 1, before any edit)

Repository-wide sweep producing a complete `file:line` table. Per candidate: file, line, route/screen, verbatim current class string, padding variant (`sm`/`md`/`lg`), any responsive padding classes, element type, inline style present, interactive descendants present, owning experience system, eligibility status, exclusion reason when ineligible.

The 87/161 figures above are replaced by whatever the fresh sweep returns; nothing is carried over as fact.

## 4. Eligibility rules

Eligible only when the panel is a plain static container whose surface styling is exactly `rounded-2xl border border-border bg-card` plus `p-4`/`p-5`/`p-6`, and it has: no hover treatment, no shadow, no decor, no interactive semantics on the panel element itself, no bespoke surface behavior, no experience-specific ownership, no breakpoint-specific surface override that the canonical API cannot reproduce.

Responsive padding (`p-4 md:p-5`, etc.) is never folded into the padding API. Such a consumer either keeps its overrides consumer-owned with a base variant that reproduces the exact class output, or it is excluded.

Automatically excluded: KpiCard, PlanCard, EmptyState internals, Lucie `Section`/`Stat`, Lucie-app `Section`/`StatCard`, M06 `StateBlock`/`MetaRail`/`Sheet`, M08 Section/Card structures, InternalShell, MarketplaceShell, MemberShell, ModuleTabs, dialogs, drawers, popovers, overlays, shadcn Card consumers with differing radius/shadow structure, Group B decorated/elevated surfaces, Group C interactive cards, and any bespoke or non-reproducible surface. Exclusions are never converted to raise the migration count.

## 5. Canonical usage form

```text
<Surface padding="sm" | "md" | "lg" className={...existing non-surface classes}>
  existing children unchanged
</Surface>
```

`Surface` contributes only `rounded-2xl border border-border bg-card` plus the padding variant. Every other class stays consumer-owned and is merged last.

If wrapping would change DOM hierarchy, child structure, layout, selector relationships or geometry, the consumer is not eligible for wrapper migration. If the element is not a plain `div` (a `Link`, `button`, `section`, `li`, `td`), `surfaceClass()` may be used only when it preserves the exact element and DOM structure; otherwise the literal class stays and the consumer is recorded as an exception.

## 6. Batch structure

Batch size: 8–12 consumers, grouped **by route file** so each batch is one reviewable, independently revertible unit. Boundaries are set from the fresh inventory; the intended ordering is:

1. **Batch 1 — already-proven route family**: `plans.$planId.tsx` (Phase 29 baseline), `plans.index.tsx`, `review.tsx`, `compare.tsx`. Lowest risk, public routes, existing proof scripts reusable.
2. **Batch 2 — public flow routes**: `apply.tsx`, `handoff.tsx`, `quote.tsx`, `accessibility.tsx`, `compliance.tsx`.
3. **Batch 3 — member surface**: `member.index.tsx`, `member.settings.tsx`, `member.quotes.tsx` and neighbours.
4. **Batch 4 — agency routes**: `agency.organizations.$organizationId.index.tsx` and the agency organization/import/defaults family.
5. **Batch 5 — internal JET routes**: `app.jet.module1.tsx`, `app.jet.product-builder.tsx`, `app.agency.index.tsx`, `app.send-quote.tsx`.
6. **Batch 6 — marketplace/platform admin plain panels**: `marketplace.admin.*`, `platform.*` override routes — runtime ownership untouched.
7. **Batch 7 — residual singletons**, including the `app.jet.branding.tsx` panels, taken last and only if their panels are purely presentational.

Rationale: route-file grouping keeps each diff auditable, keeps one reachable URL per batch for browser proof, and orders exposure from public/low-risk to admin/high-sensitivity.

Verification gate runs after **every** batch; the next batch does not start until the previous one passes.

## 7. Per-batch verification gate

Before/after capture for each migrated panel, at 1440px, 834px and 390px independently (no inference between viewports):

- DOM structure, element semantics, child hierarchy, content, attributes, inline style
- Verbatim class attribute — byte-identical required; any difference is investigated and blocks the batch until proven unavoidable (only documented dev-only source metadata such as line-number attributes is acceptable)
- Computed styles: padding, margin, gap, border width/style/color, border-radius, background, box-shadow, overflow, alignment, text-align, min-height, transition, font-family, font-size, font-weight, line-height, color
- Panel and direct-child bounding rectangles, content placement, text wrapping
- `documentElement.scrollWidth` vs `clientWidth`; zero horizontal overflow
- Console clean; no new runtime errors

Computed-style equality alone is never sufficient.

## 8. Behavior and accessibility

Panels stay non-interactive: no role, no ARIA, no tabIndex change. Focusable descendants, links, buttons, handlers, routes and navigation unchanged. No behavioral refactor.

## 9. Boundaries

- Branding & White-Label state, stores and routes: untouched. Using `Surface` inside an eligible branding-route plain panel is permitted only if runtime ownership and behavior are unchanged; otherwise the panel stays literal.
- Marketplace Asset Management state, stores, upload flows, asset records and ownership: untouched, same condition.
- Reference/design-system layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`): untouched and never imported into production.
- Foundations: no token added, renamed or altered; no color, radius, shadow, typography or spacing change. Phase 30 is migration only.

## 10. Validation per sub-batch

`npx tsgo --noEmit`; production build; ESLint on touched files. Pre-existing findings recorded separately and left unfixed; any new error blocks that sub-batch.

## 11. Git / source integrity per sub-batch

Record git status before and after, files changed, files intentionally untouched, and source hashes of every touched file plus `src/components/abox/surface.tsx` (which must remain unchanged throughout). No unrelated file changes permitted.

## 12. Rollback

Each batch is independently reversible by restoring the literal class strings. On any parity failure: revert that consumer, classify it as an exception, do not force migration, continue with the remaining independently eligible consumers if the batch is still valid, and document the exact discrepancy. The canonical `Surface` is never altered to accommodate one incompatible consumer.

## 13. Final report

On completion the report carries exactly the 36 requested sections, from Status and the fresh Group A inventory count through the full `file:line` table, batch structure, per-batch evidence, boundary confirmations, validation results, git integrity, exceptions, confirmations that no Group B or Group C consumer was migrated and that intentionally independent families remain untouched, final migrated count, remaining Group A count, and the recommended next gate.

## 14. Authorization

PLAN ONLY. No production file is created or modified and no migration begins until this plan is separately approved.
