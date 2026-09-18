# Phase 41 — Production Accessibility & Interaction-State Source-of-Truth Audit (PLAN ONLY)

Outcome proposed by the evidence gathered so far: **zero migrations**. No production file changes. Only `.lovable/manual-work-map.md` would gain a Phase 41 record, after execution and evidence.

## 1. Current-state audit methodology

Read-only inventory across the eligible production surface only: `src/routes/**`, `src/components/abox/**`, production utilities, `src/styles.css`, and the shadcn primitives actually consumed. Excluded from the candidate pool: `/design-system`, `/design-guide`, `src/lib/design/**`, `src/components/design/**`, Lucie/Lucie-app, M06, M08, AI-elements, Branding & White-Label runtime, Marketplace Asset Management runtime.

Method, in order: (a) script inventory of interactive elements, ARIA attributes, roles, keyboard handlers, focus classes, disabled/state classes, label associations, live regions and visually-hidden text; (b) exact full-expression matching, not fragment matching; (c) per-occurrence ownership check against the existing canonical sources; (d) measurability check (public route versus auth-gated); (e) taxonomy classification; (f) candidate rule applied to each surviving group.

## 2. Fresh inventory (187 eligible files)

ARIA attribute occurrences: `aria-hidden` 233, `aria-label` 68, `aria-pressed` 26, `aria-current` 8, `aria-expanded` 6, `aria-invalid` 5, `aria-labelledby` 4, `aria-live` 2, `aria-describedby` 2, `aria-modal` 1, `aria-haspopup` 1, `aria-controls` 1.

Explicit roles: `alert` 8, `radiogroup` 3, `status` 2, `dialog` 2, `group` 1, `banner` 1.

Keyboard handlers: `onKeyDown` 7; no `onKeyUp`/`onKeyPress` anywhere in eligible production. All other keyboard behavior is native or Radix-managed.

Focus visuals: `focus:ring-2 focus:ring-ring` across 19 files (`controlClass` is one of them and owns the canonical form); `focus-visible:ring-2 focus-visible:ring-ring` 3; skip-link focus utilities 3 (one set per shell); `styles.css` carries `:focus-visible` only inside the `ember-underline` and `card-brackets` decorative utilities.

Disabled/state classes: `disabled:opacity-40` 17, `disabled:bg-muted` 15, `disabled:text-muted-foreground` 15, `disabled:opacity-60` 13, `disabled:opacity-50` 3, `disabled:cursor-not-allowed` 2, `disabled:opacity-70` 1.

Visually hidden text: `sr-only` in `quote.tsx` (4), `data-table.tsx` (1), and each of the three shells (1 each, the skip link).

Label association: `htmlFor` used in `quote.tsx` (9), `quote-edit-panel.tsx` (8), `app.jet.products.tsx` (4) and three single-use routes; everywhere else association is implicit via the wrapping-label composition owned by `LabeledField`.

Accessible names: 68 `aria-label` values, all distinct strings except `"Filters"` (2) and `"Available products"` (2) — per-context labels, not a shared pattern.

## 3. Current canonical ownership (to be re-verified at execution)

- `ActionPill` / `action-pill-component` — action-control class output and hover/disabled treatment; it does not own element choice (`<button>` vs `<a>` stays with the consumer).
- `controlClass` — control surface styling and the opt-in focus ring only; no semantic form behavior.
- `LabeledField` — wrapping-label composition (`<label>` + eyebrow span); consumers: `auth.tsx`, `schedule.tsx`.
- `PageHeader`, `KpiCard`, `DataTable`, `EmptyState`, `NoticePage`, `StatusBadge`, `PlanCard` — their own intrinsic semantics and structure.
- `Surface` — visual surface only; explicitly not an accessibility owner.
- shadcn/Radix primitives — dialog, sheet, select, tabs, dropdown-menu, popover, tooltip, switch, accordion, toggle: focus trapping, focus restoration, roving tabindex, `aria-expanded`/`aria-selected`/`aria-checked`, Escape handling.
- Native HTML — Enter/Space activation, tab order, label association, table header semantics, `disabled` semantics.
- The three shells — each owns its own landmarks, navigation labelling, `aria-current` and skip link independently.

## 4. Exact candidate inventory

- **P41-C1 — skip-to-content link.** Byte-identical element, text and class string in `internal-shell.tsx:51`, `marketplace-shell.tsx:49-54`, `member-shell.tsx:64`.
- **P41-C2 — raw focus-ring form controls.** `mt-1 h-10/h-11 … outline-none focus:ring-2 focus:ring-ring` in `member.settings.tsx`, `ai-review.tsx`, `auth.tsx` (two remaining raw inputs) plus 15 agency/app route files.
- **P41-C3 — `aria-current` navigation/step items.** `product-switcher.tsx`, `shopping-path-bar.tsx` (page); `downline-wizard-stepper.tsx`, `quote.tsx`, `apply.tsx`, `app.off-exchange.tsx` (step).
- **P41-C4 — `aria-pressed` toggle controls.** 14 files, including `plan-card.tsx`, `plans.index.tsx`, `theme-toggle.tsx`, `quote.tsx`.
- **P41-C5 — `role="alert"` inline error messages.** 8 occurrences, 6 of them inside `quote.tsx`.
- **P41-C6 — decorative `aria-hidden` glyph wrappers.** 233 occurrences.
- **P41-C7 — disabled-state class clusters.** `disabled:opacity-40` / `disabled:bg-muted disabled:text-muted-foreground` groups.
- **P41-C8 — `aria-live` status regions.** `quote.tsx:300` (polite step announcement), `downline-context-banner.tsx:21` (`role="status"`).

## 5. Candidate acceptance / rejection reasoning

- **P41-C1 — REJECT (J + E).** The strongest candidate: three exact copies. But `internal-shell` and `member-shell` render only behind the auth gate (`requireSessionIfEnforced`, `ENFORCE_LOGIN = true`), so only the marketplace shell is independently measurable. One measurable consumer fails the ≥2 rule; auth-gated consumers are recorded as NOT CAPTURED, never inferred. Shell landmark/skip ownership is also intentionally independent. Documented as a FUTURE OPPORTUNITY, not implemented.
- **P41-C2 — REJECT (A + J + K).** A canonical owner already exists (`controlClass({ focusRing: true })`); the remaining raw instances differ in height, radius, padding, text size and adjacent classes (`h-9 rounded-md px-2 text-sm`, `pl-9 pr-3`, `tracking-widest tabular-nums`), so replacement would not preserve exact class output. 15 of 19 files are auth-gated.
- **P41-C3 — REJECT (K + D + J).** Two different `aria-current` contracts (`page` vs `step`) on different elements (`Link` vs `<button>`), each intrinsic to its own component or route wizard, half of them auth-gated.
- **P41-C4 — REJECT (K + D).** `aria-pressed` marks unrelated toggles — theme, plan save/compare, filter chips, view switches — with different elements, labels, visual treatments and state models. Same attribute is not equivalence.
- **P41-C5 — REJECT (G + K).** Six of eight are internal to `quote.tsx` with distinct wrappers (bare `<p>`, tinted panel, id-linked field error); cross-file pair (`auth.tsx`, `app.jet.products.tsx`) differs in classes and one is auth-gated.
- **P41-C6 — REJECT (L + D).** Native/decorative attribute applied inline to per-context glyphs; centralizing would require a wrapper that changes DOM — explicitly forbidden.
- **P41-C7 — REJECT (K + D).** Disabled clusters vary per control family and are already emitted by `ActionPill` or by the consumer's own class string; no shared semantic contract.
- **P41-C8 — REJECT (K + J).** Two unrelated live regions: a sr-only polite step announcement and a visible status banner (auth-gated context).

## 6. Proposed canonical source(s)

None. No new accessibility source, helper, wrapper or utility is proposed.

## 7. Exact consumer list

Empty — no consumer is migrated.

## 8. Batch-by-batch sequence

- **Batch 0** — capture locked-source hashes and the fresh inventory. No file changes.
- **Batch 1** — zero-change gate: re-run the candidate rule against Batch 0 evidence; confirm no candidate survives; confirm no production diff.
- **Batch 2** — governance only: append the Phase 41 block to `.lovable/manual-work-map.md`.

If review overturns a rejection, that consumer group re-enters at Batch 0 with its own additive source and a single proof consumer, each later consumer behind its own parity gate.

## 9. Accessibility / keyboard / focus parity gates

Would apply only to an approved migration: at 1440/834/390, before and after — exact element, DOM tree, attributes and class output; accessibility-tree role, name, description and state; heading, landmark, table and form associations; Tab order, Enter/Space/Escape/Arrow behavior, focus target, restoration, trapping; hover/focus/focus-visible/active/selected/checked/pressed/expanded/disabled/readonly/invalid; ARIA dynamic changes and live-region behavior; focus-ring geometry, outline, shadow, opacity, wrapping, overflow; activation, navigation, handlers, state updates, console and network cleanliness. Screenshots alone are never sufficient.

## 10. Auth-gated exclusions (NOT CAPTURED)

`/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*` — including `InternalShell` (40+ routes), `MemberShell` (4 routes), the downline wizard, `member.settings.tsx` and the agency form routes. Source is inspected and recorded; runtime parity is never inferred and no session is fabricated.

## 11. Native semantic boundaries

No `<button>` becomes an `<a>` or vice versa; no native input becomes a custom element; no native keyboard behavior is replaced by JavaScript; no heading is downgraded; no `<label>` is replaced by a generic wrapper. Native semantics remain the preferred implementation and are recorded as owner (taxonomy L) wherever they already carry the behavior.

## 12. shadcn / Radix / third-party boundaries

Radix keeps ownership of overlay focus trapping and restoration, roving tabindex, Escape handling and its managed ARIA state attributes. shadcn primitives keep their existing class and semantic contracts. AI-elements and other library-owned semantics stay out of scope.

## 13. Intentional exceptions

Three independent shell skip links and landmark implementations; per-context `aria-label` strings; the `quote.tsx` route-local error and live-region system; decorative `aria-hidden` glyphs applied inline; `controlClass` staying a styling owner rather than a semantic one.

## 14. Validation commands

`npx tsgo --noEmit`; production build; targeted ESLint on changed production files (none expected); full lint compared with the pre-existing baseline (16,783 findings — not repaired); `git diff --check`; focused `git diff`; `git status --short`; fresh rg inventory of ARIA, roles, keyboard handlers, focus classes, labels and state attributes; Playwright verification of public routes at 1440/834/390; console/runtime/network inspection; changed-file inventory.

## 15. Accessibility-tree verification

Playwright accessibility-tree snapshots on the measurable public routes (`/`, `/faq`, `/select`, `/quote?step=1`, `/plans`) recording role, accessible name, state and focus order for the audited controls, plus keyboard traversal including the marketplace skip link. Used as evidence of current state only; no compliance claim is made from a single tool run.

## 16. Locked-source verification

Capture fresh SHA-256 hashes from the post-Phase-40 tree before and after: all ABox canonical sources (`action-pill.ts`, `action-pill-component.tsx`, `surface.tsx`, `control.tsx`, `field.tsx`, `page-header.tsx`, `kpi-card.tsx`, `plan-card.tsx`, `data-table.tsx`, `empty-state.tsx`, `notice-page.tsx`, `status-badge.tsx`, `motion.tsx`, `marketplace-page-layout.ts`), the three shells, the consumed shadcn/Radix primitives, and `src/styles.css`. Under a zero-migration result every hash must be unchanged.

## 17. Rollback

Zero migration: production rollback is empty; only the Phase 41 governance block would be reversed. If a migration is later approved: restore the exact original source, DOM and behavior, re-run typecheck/build, re-run accessibility-tree and keyboard checks, verify hashes, confirm no Phase 29–40 behavior is affected. Any unexpected production change: stop, restore the file exactly, do not expand scope.

## 18. Governance updates (after execution only)

Append to `.lovable/manual-work-map.md`: fresh accessibility/interaction inventory, semantic ownership map, taxonomy classification, candidate decisions P41-C1…C8 with reasoning, migrated consumers (expected: none), intentional exceptions, NOT CAPTURED consumers, native semantic boundaries, shadcn/Radix/library ownership, validation evidence, locked hashes, rollback procedure, and the future admission rule (≥2 independently measurable consumers with identical semantic role, element, accessible name/description, keyboard, focus, ARIA, state and responsive behavior, and no existing owner).

## 19. Preservation contract

No visual, focus-ring, focus-order, keyboard, activation, ARIA, screen-reader-text, semantic-element, tab-order, disabled, selected/checked/expanded, validation, navigation, route, DOM, responsive, layout, typography, color, spacing, border/radius/shadow, motion, content, branding, asset or business-logic change. No shell merge. Phase 40 reduced-motion ownership stays untouched.

## 20. Expected changed-file scope

`.lovable/manual-work-map.md` only.
