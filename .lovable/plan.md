# Phase 17 — Canonical ActionPill Production Implementation & Controlled Migration

## Goal

Introduce one canonical production ActionPill source and point the verified consumers at it, with zero observable change to the running application. This is source centralization only — no redesign, no normalization, no unrelated cleanup.

## Re-measurement (confirmed against current code)

- `src/components/abox/action-pill.ts` exports `ACTION_PILL` (8 keys) and `ActionPillVariant`.
- 34 files reference `ACTION_PILL` (33 consumers plus the source file), 99 references total.
- Variant distribution: primaryMd 19, outlineXs 10, primaryLg 9, outlineLg 7, outlineSmCard 6, outlineSm 6, outlineMd 4, primaryXs 3.
- Element usage: 52 `<button>`, 22 `<Link>`. Every call site is a bare `className={ACTION_PILL.<variant>}`; zero `cn()` compositions, zero appended classes.
- `@radix-ui/react-slot` is already a dependency and already used by `ui/button.tsx`.

This matches the Phase 16 evidence, so no discrepancy stop is triggered.

## Canonical source

Create one new file: `src/components/abox/action-pill.tsx`.

- It imports `ACTION_PILL` from the existing `action-pill.ts` — the class strings keep their single owner and are never re-typed or re-ordered.
- It re-exports `ACTION_PILL` and `ActionPillVariant` so the map stays reachable from one place.
- `action-pill.ts` is not modified and not deleted. No second copy of the strings is created.

Component contract, derived only from current usage:

```tsx
ActionPill({ variant, asChild, className, children, ...rest })
```

- `variant` — required, one of the eight existing keys. No default.
- `asChild` — optional; when true renders the single child element (Radix `Slot`) so `<Link>` call sites keep their exact DOM. When false renders `<button>`, matching the 52 button call sites.
- `className` — optional, merged via `cn` after the variant string, so with no caller class the output string is byte-identical to today.
- All other props (`type`, `disabled`, `onClick`, `aria-*`, `title`, `data-*`) pass through untouched.
- Forwards a ref, like `ui/button`.
- No new variants, no new defaults, no renames, no added wrapper element, no added transition/focus utilities.

## Migration

Migrate the 33 verified consumers one controlled group at a time, grouped by variant so each variant's parity is proven once.

Per consumer, the only change is the call-site form:

```tsx
// before
<button className={ACTION_PILL.primaryMd} onClick={…}>…</button>
// after
<ActionPill variant="primaryMd" onClick={…}>…</ActionPill>

// before
<Link to="…" className={ACTION_PILL.outlineXs}>…</Link>
// after
<ActionPill variant="outlineXs" asChild><Link to="…">…</Link></ActionPill>
```

Surrounding JSX, props, handlers, content, routes, responsive classes and any local non-pill styling stay exactly as they are. No surrounding refactoring, no text replacement, no similarity-based migration.

Sequence: first target `routes/marketplace.admin.readiness.tsx` (single `primaryMd` Link). Verify parity, then proceed through the remaining consumers in the Phase 16 register order, verifying after each group.

## Excluded — not touched

Landing hero pills in `src/routes/index.tsx` (inline marketing classes, not the shared map), all `ui/button` consumers, StatusBadge, PageHeader, cards, forms, tables, shells, route-local kits (M06, M08, Lucie, Lucie-app, ai-elements, icon helpers), branding and white-label, marketplace asset management, and every token in `src/styles.css`.

## Preservation evidence

The decisive check is string-level: for every migrated call site the rendered `class` attribute and the emitted DOM element type must be identical to the pre-change markup. Because the component emits `ACTION_PILL[variant]` verbatim and `Slot` merges onto the caller's own element, this is structurally guaranteed; it will still be verified, not assumed.

## Validation

- Baselines captured before migration: `/marketplace/admin/readiness`, `/marketplace/admin`, `/agency/organization-admin`, `/agency/downlines/new/contacts`, `/platform/organizations` at desktop 1440, tablet 834 and mobile 390, plus default / hover / focus-visible / disabled states where they exist on those pages.
- After migration: same captures compared against baselines, plus rendered class-attribute and element-type comparison, keyboard traversal, link navigation, accessible names, and console output.
- Typecheck, ESLint, production build, route rendering checks.
- Import audit confirming nothing in production imports `src/lib/design/**` or `src/components/design/**`.
- Final git diff inspected: only `src/components/abox/action-pill.tsx` plus the migrated consumer files.

## Stop and rollback

Any unexplained visual, responsive, interaction, accessibility, navigation, content or functional difference stops the phase. The consumer is not patched and foundations are not touched; the change is reverted so the application returns to its exact pre-phase state, and the discrepancy is reported instead of completion.

## Final report

Delivered per the requested 28 points, including the consumer-by-consumer list, preservation evidence, validation results and diff scope. Completion is claimed only if exact preservation is verified.
