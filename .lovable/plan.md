# Phase 17 — Controlled Migration of the Remaining ActionPill Consumers

## Re-measurement (current repository, just verified)

Files still referencing `ACTION_PILL` directly, excluding the class-string owner and the reference layer: **33 files**.

Of those, **2 are reference routes** (`src/routes/design-system.tsx`, `src/routes/design-guide.tsx`) which the migration boundary places out of scope. They are excluded and left untouched.

**31 production consumers remain** — this matches the approved register.

Already migrated (proof gate, unchanged in this phase):
- `src/routes/marketplace.admin.readiness.tsx` (button, `primaryMd`)
- `src/routes/platform.organizations.index.tsx` (Link, `outlineXs`)

Contract check performed on the current code: every remaining reference is a bare `className={ACTION_PILL.<literal>}` with no `cn()` composition, no computed variant, and no additional class string appended. Any consumer found to deviate during per-file inspection is excluded, not forced.

## Migration rules (unchanged from the approved contract)

- Native `<button className={ACTION_PILL.x}>` becomes `<ActionPill variant="x">` — every other prop, handler, child, `type`, `disabled`, `title`, `aria-*`, `data-*` copied verbatim.
- `<Link ... className={ACTION_PILL.x}>` keeps the Link element; only the class expression becomes `actionPillClass("x")`. No Slot, no asChild, no wrapper.
- Non-Link, non-button elements (if any surface) use `actionPillClass()` the same way.
- `src/components/abox/action-pill.ts` is not opened for editing; all eight strings stay byte-identical.
- The `ACTION_PILL` import is removed from a file only once its last reference in that file is migrated.

## Controlled groups

Each group is migrated, validated, and only then followed by the next.

1. **Downline wizard (8 files)** — `agency.downlines.new.{activate,administrator,contacts,identity,legal,locations,readiness,settings}.tsx`. Mixed Lg buttons plus one Link.
2. **Agency organization administration (6 files)** — `agency.my-organization`, `agency.organization-admin`, `agency.organization-structure`, `agency.organization-work`, `agency.organization-imports.index`, `agency.organization-imports.$importJobId`.
3. **Organization profile subpages (6 files)** — `agency.organizations.$organizationId.{index,contacts,identifiers,locations,readiness,settings}.tsx`.
4. **Marketplace admin (6 files)** — `marketplace.admin.{index,brand,content,assets,domains.index,referral-links.index}.tsx` plus `marketplace.admin.work.tsx`. Brand and Assets are migrated for the class source only; their upload/validate/preview/retire logic is untouched.
5. **Platform + JET (4 files)** — `platform.marketplaces.index`, `platform.marketplaces.$marketplaceId.override`, `platform.organizations.$organizationId.override`, `app.jet.module1`.

## Per-group validation

Before each group: capture the rendered `tagName`, full `class` attribute, bounding box, and relevant attributes for every touched call site on its route, at 1440 / 834 / 390.

After each group: repeat the same capture and require exact equality; then typecheck, build, exercise the click/navigation path of at least one migrated button and one migrated Link, confirm focus and keyboard behaviour, read the console, and confirm `git diff` touches only that group's files.

Any unexplained difference stops the migration at that group, with the exact consumer and difference reported and no compensating edits.

## Final validation after the last group

Typecheck, lint, production build, route checks across every touched route, console-error check, responsive check, accessibility/keyboard check, a grep proving no production file outside the canonical module and the two reference routes still imports `ACTION_PILL`, a diff of `action-pill.ts` proving it unchanged, and a confirmation that no Slot/asChild/polymorphism, new variant, or duplicate class string exists.

## Out of scope

`src/styles.css`, tokens, StatusBadge, PageHeader, Button, cards, forms, tables, shells, route-local kits, assistants, landing hero pills, navigation config, Branding & White-Label logic, Marketplace Asset Management logic, and the reference layer (`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`).

## Outcome statement

If all 31 migrate cleanly: PHASE 17 — ACTIONPILL MIGRATION COMPLETE.
If any consumer cannot migrate without altering the preservation contract: it is left untouched and reported as PHASE 17 — PARTIALLY COMPLETE — CONSUMER(S) BLOCKED.
