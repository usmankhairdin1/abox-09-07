# Batch B6 — patterns & interactions: dynamic-page async fix (plugin only)

## What happened

`B6 Create` completed: it resolved the B5 primitive, created both KpiRow variants, the
`ABox/Pattern/KpiRow` set, and both standalone pattern components — "pattern objects created
this run: 5". The failure came immediately afterwards, in the **verification** step that runs
after create:

`in get_mainComponent: Cannot call with documentAccess: dynamic-page. Use node.getMainComponentAsync instead.`

`manifest.json` declares `"documentAccess": "dynamic-page"`. Under that mode the synchronous
`instance.mainComponent` getter is forbidden; `getMainComponentAsync()` must be used. The build
path never reads it, so nothing was left half-built — the five created objects are complete and
must be preserved.

## Full audit of B6 for dynamic-page-incompatible synchronous calls

Scanned the whole B6 range (`b6Say` … `verifyB6`, plugin.js ~2686–3600) for every API the
dynamic-page rules restrict: style-id setters, `mainComponent`, `figma.getNodeById`,
`figma.getStyleById`, `figma.root.findAll*` without page loading, `page.children` on unloaded
pages, `component.instances`.

Found — must change (all are the same single defect, `inst.mainComponent`):

| line | function | current |
|---|---|---|
| 2743 | `b6MainName` | `const main = inst.mainComponent` |
| 2750 | `b6MainId` | `const main = inst.mainComponent` |

Found — already compliant, no change:

- `b6ApplyRoot` (2854) already uses `await node.setStrokeStyleIdAsync(...)` (fixed in the previous B6 task); no other style-id writes exist anywhere in B6.
- `getInstancesAsync()` is already used in `b6EnsurePattern` (orphan check), `b6InspectPatterns`, `b6StaleVariants`, `b6CleanupIncompletePatterns` — never `.instances`.
- Every B6 entry point (`ensureB6Patterns`, `verifyB6`, `b6InspectPatterns`, `b6StaleVariants`, `b6CleanupIncompletePatterns`) already begins with `await figma.loadAllPagesAsync()`, which is what makes `figma.root.findAllWithCriteria` (via `b4FindSet`/`b4FindComponent`) and cross-page `children` reads legal.
- All style lookups go through `b4StyleIndex()` → `getLocalPaintStylesAsync/TextStylesAsync/EffectStylesAsync`; no `figma.getStyleById`, no `figma.getNodeById` in B6.
- Reads of `strokeStyleId` / `fillStyleId` stay legal under dynamic-page and are unchanged.

## Exact edits — `tools/figma-plugin/plugin.js` only

1. `b6MainName(inst)` → `async function`, `const main = await inst.getMainComponentAsync()`.
2. `b6MainId(inst)` → `async function`, same replacement.
3. `b6LiveSignature(node, root, children)` → `async function`; line 2825 becomes
   `parts.push("INSTANCE:" + (await b6MainName(kid)) + ":" + b6LiveProps(kid, spec))`.
   (The children loop is already a plain `for`, so `await` is valid.)
4. `b6Check(node, root, children, label)` → `async function`; awaits `b6LiveSignature`.
5. Await the propagated calls at their existing sites, all already inside `async` functions with
   plain `for` loops (no `forEach`/`map` conversions needed):
   - `b6EnsurePattern` 2968 and 3011 — `await b6Check(...)`
   - `b6InspectPatterns` 3143 — `live = await b6LiveSignature(...)` (stays inside its try/catch)
   - `b6CleanupIncompletePatterns` 3271 — `const live = await b6LiveSignature(...)`
   - `verifyB6` 3427 — `const live = await b6LiveSignature(...)`
   - `verifyB6` 3439/3441 — `await b6MainName(kid)` (compute once into a local, compare, then reuse in the id line) and `await b6MainId(kid)`
   - `verifyB6` 3520/3525 — `await b6MainId(kid)` (compute once per child into a local)

No other file changes except the regenerated `code.js` and one README note recording that
`b6MainName` / `b6MainId` / `b6LiveSignature` / `b6Check` are async under dynamic-page.

## Partial-creation cleanup and rollback

- The failed run created only **complete** objects, and the verifier writes nothing, so there is
  no B6 debris to remove. The plan therefore performs **no deletion**. The existing guarded
  cleanup stays available but is not to be run blindly.
- Reconciliation is read-only first: `Inspect 02 Patterns` after the fix prints each pattern's
  live vs expected signature. Only if a pattern shows a mismatching signature, zero instances and
  an approved B6 name does `Remove incomplete B6 pattern nodes` apply — its five conditions
  already make it impossible to delete a complete approved pattern, a `COMPONENT_SET`, or any
  non-B6 node.
- `b6Guarded` rollback is unchanged and stays async-safe: it removes only non-`COMPONENT_SET`
  children created during the failing build whose names are B6-owned.
- Nothing in this plan touches B0 pages, B1/B2 variables, B3 styles, or B4/B5 components; the
  cleanup paths can only ever look at top-level children of `02 Patterns`.

## Idempotency

Unchanged by design and re-proved after the fix: `b6EnsurePattern` resolves an existing set or
component first, asserts its axis, checks each body against the approved signature, and returns
it without writing. A second `B6 Create` must report "pattern objects created this run: 0" with
the same node ids (KpiRow set, ModuleTabBar, WizardStepper).

## Verification / evidence

Offline:
1. `node --check tools/figma-plugin/plugin.js`
2. `node tools/figma-plugin/build.mjs` → regenerate `code.js`
3. `node --check tools/figma-plugin/code.js`
4. `rg -n "\.mainComponent\b" plugin.js` → zero hits inside the B6 range
5. `git diff --stat -- src/` → empty

Real Figma (user-run, after re-importing the plugin):
1. `Inspect 02 Patterns` — read-only; expect KpiRow set + both variants, ModuleTabBar,
   WizardStepper, each live signature equal to expected. Stop and report if anything differs.
2. `B6 Verify` — expect all checks PASS on the objects the failed run already created.
3. `B6 Create` — expect "pattern objects created this run: 0", identical ids.
4. `B6 Verify` again — PASS.
5. `B1`/`B2`/`B3`/`B4`/`B5 Verify` — PASS, unchanged; B0 seven-page order and state intact.

Until step 1 is executed, the evidence stays `REAL FIGMA NOT VERIFIED`.

## Scope confirmation

- Batch name unchanged: `Batch B6 — patterns & interactions`.
- No new patterns, variants, properties, states, or visual values; no spec or signature changes.
- B0–B5 artifacts untouched — no recreate, rename, mutation, or migration.
- B7–B10 builders keep their known synchronous setters (out of scope, already recorded).
- `src/**` untouched; nothing published.
