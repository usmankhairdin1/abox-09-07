# Phase 55 / Batch B8 — experiences & journey compositions (PLAN ONLY)

B7 is closed. The next approved scope after B7 is already defined in the governed roadmap
(`tools/figma-plugin/README.md`, "Phase 55 / Batch B8 — experiences") and in the extracted
contract `tokens-b8.js`. B8 builders exist in `plugin.js` but have never been run in real
Figma. This plan covers the pre-run corrections B8 needs plus its execution and verification.

## Scope — exactly five top-level FRAMEs on `04 Experiences`

| Experience | Shell (B7) | Patterns (B6) | Components (B4/B5) |
|---|---|---|---|
| ABox/Experience/Internal/DownlineAgencyCreation | Internal | WizardStepper | PageHeader, ActionPill, StatusBadge, LabeledField, Input |
| ABox/Experience/Internal/MarketplaceActivationGovernance | Internal | KpiRow (columns 4) | PageHeader, KpiCard, ActionPill, StatusBadge |
| ABox/Experience/Marketplace/PlanAIShoppingPath | Marketplace | none | PageHeader, StatusBadge, ActionPill, EmptyState |
| ABox/Experience/Marketplace/EnrollmentReviewAndSubmission | Marketplace | none | PageHeader, StatusBadge, ActionPill, EmptyState |
| ABox/Experience/Member/ContinuationWorkspace | Member | KpiRow (columns 3) | PageHeader, KpiCard, StatusBadge, EmptyState |

Each frame carries four approved regions in order: `metadata/source-and-limitations`,
`shell-reference`, `journey-sequence`, `representative-content`. Canonical width 1440,
deterministic x/y placement from `ABOX_B8.placement`.

## Source files to inspect (already recorded per experience)

- Internal: `src/routes/agency.downlines.new.identity|contacts|readiness|activate.tsx`,
  `src/components/abox/downline-wizard-stepper.tsx`, `src/routes/marketplace.admin.index|readiness|activation.tsx`
- Marketplace: `src/routes/select.tsx`, `quote.tsx`, `plans.index.tsx`, `cart.tsx`, `review.tsx`,
  `handoff.tsx`, `apply.tsx`, `src/lib/cart-store.ts`, `src/components/abox/product-switcher.tsx`
- Member: `src/routes/member.index|quotes|messages|settings.tsx`

Read-only re-verification that the recorded line ranges still match the live source; any drift is
reported, and `tokens-b8.js` is regenerated only by `extract-b8.mjs` (never hand-edited).

## Required pre-run corrections (plugin-only)

1. **Dynamic-page API compatibility.** The B8 builders call `b7FrameLegacy()` (synchronous
   `fillStyleId` / `strokeStyleId` / `effectStyleId` setters) and `b8BuildFrame` sets
   `root.fillStyleId` / `root.strokeStyleId` synchronously. Under `"documentAccess": "dynamic-page"`
   these throw — the exact failure class already fixed in B4, B6 and B7. Fix: add an async
   `b8Frame()` used only by B8 (await `setFillStyleIdAsync` / `setStrokeStyleIdAsync` /
   `setEffectStyleIdAsync`) and await the two root setters. `b7FrameLegacy` stays untouched for
   B9/B10.
2. **`b8MainName()` uses synchronous `inst.mainComponent`** — convert to `getMainComponentAsync()`
   and await all call sites (`b8SetInstanceProps`, `b8InstanceMainNames`, `verifyB8`).
3. **Verifier empty-page contract.** `verifyB8` requires `06 Documentation` strictly empty; the
   B5/B7/B9 verifiers already allow the approved B10 frames. Align B8 with that same allowance
   (`00 Foundations` and `05 Screens` stay strictly empty) and print B8 PAGE EVIDENCE naming
   offenders.
4. **Guarded rollback.** Add `b8Guarded()` in the B7 style: snapshot `04 Experiences` children and
   `currentPage` children before the run; on throw remove only nodes created during that run whose
   name is an approved B8 experience or region name; never remove COMPONENT / COMPONENT_SET, never
   a pre-existing node.

## Dependencies on B1–B7

Resolved read-only before any write; a missing dependency stops the run with nothing written:
B1 (9 collections / 200 variables), B2 (ABox/Typography, 19 variables), B3 (79 styles, exact
slash names), B4 (11 sets), B5 (3 standalone, 56 variant nodes), B6 (KpiRow, ModuleTabBar,
WizardStepper), B7 (Internal, Marketplace flow/landing, Member shells).

## Explicitly deferred / out of scope

No new variables, styles, components, component sets, patterns, component properties, variant
axes, responsive variants, prototype reactions, screenshots, HTML embeds or flattened images.
Route-local structures (PlanCard, ShoppingPathBar, application steppers, tables, checklists,
overlays, field groups, message rows) stay editable route composition and are not promoted.
`05 Screens` (B9) and `06 Documentation` (B10) untouched by B8.

## Validation & integrity checks

Offline: `node --check plugin.js`, `node build.mjs`, `node --check code.js`,
`git diff --stat -- src/` empty.
Real Figma: **Create experiences** → **Verify experiences** → **Create experiences** again.
Verify must pass every existing check: B0 seven pages in order, B1/B2/B3/B4/B5/B6/B7 unchanged
counts, five frames with matching plugin signature and sorted source list, deterministic
placement, four regions in order, shell/pattern/component instances resolving to live library
nodes, zero properties, zero prototypes, zero image fills, no components on `04 Experiences`.

## Idempotency requirement

Run 1 creates exactly five frames. Run 2 creates zero, reuses the same ids, and prints no STOP.
Reuse requires exact match of B8 plugin data, signature, sorted source list and the four region
names in order. Any mismatch, duplicate name, wrong type or missing dependency stops without
overwriting, moving, renaming or deleting any live object.

## Confirmation

`src/**` is inspected read-only and never modified. B0–B7 plugin logic, tokens, Figma objects and
ids (Internal 10:58, Marketplace flow 10:113, landing 10:188, Member 10:242) remain exactly as
verified. No Figma node is created or modified during planning or offline validation. No publish.
