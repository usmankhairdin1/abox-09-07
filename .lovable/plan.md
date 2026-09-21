# B4 — Figma `documentAccess: dynamic-page` style-binding compatibility fix (plugin only)

## Cause

`manifest.json` declares `"documentAccess": "dynamic-page"`. Under that mode Figma forbids the
synchronous style-id setters (`node.fillStyleId = …`, `node.strokeStyleId = …`,
`node.effectStyleId = …`, `node.textStyleId = …`) and requires the async equivalents.
B4's builder assigns styles synchronously, so the first component write throws:

`in set_fillStyleId: Cannot call with documentAccess: dynamic-page. Use node.setFillStyleIdAsync instead.`

Reading these properties (used throughout the verifiers) stays valid and is not changed.

## Files to change

1. `tools/figma-plugin/plugin.js` — the only source file affected.
2. `tools/figma-plugin/code.js` — regenerated output of `build.mjs` (never hand-edited).
3. `tools/figma-plugin/README.md` — one short note recording the dynamic-page async-setter rule.

No other plugin file, no extractor, no token file, no `src/**`.

## Exact edits in `plugin.js` (B4 path)

All inside `b4Build(spec, index)` (already `async`), which is the shared builder used by
`b4EnsureSet` / `b4EnsureComponent` / `ensureB4Components`:

| line | current | becomes |
|---|---|---|
| 1529 | `node.textStyleId = style.id` | `await node.setTextStyleIdAsync(style.id)` |
| 1538 | `node.fillStyleId = b4Style(index,"paint",spec.colorStyle).id` | `await node.setFillStyleIdAsync(...)` |
| 1544 | `node.fillStyleId = …spec.fillStyle…` | `await node.setFillStyleIdAsync(...)` |
| 1579 | `kid.fillStyleId = …fill…` | `await kid.setFillStyleIdAsync(...)` |
| 1580 | `kid.strokeStyleId = …stroke…` | `await kid.setStrokeStyleIdAsync(...)` |
| 1599 | `frame.fillStyleId = …spec.fillStyle…` | `await frame.setFillStyleIdAsync(...)` |
| 1602 | `frame.strokeStyleId = …spec.strokeStyle…` | `await frame.setStrokeStyleIdAsync(...)` |
| 1608 | `frame.effectStyleId = …spec.effectStyle…` | `await frame.setEffectStyleIdAsync(...)` |

The style ids resolved by `b4Style(index, category, name)` are passed through unchanged, so every
binding targets the exact same B3 style as before. If any of these sites sits inside a
non-async callback (e.g. a `forEach` over children at 1579–1580), that loop is converted to a
`for … of` loop so the `await` is valid — no ordering or structural change.

## Explicitly out of scope

No change to B4 scope, component inventory, names, variants, properties, styling intent,
placement, signatures, or verification thresholds. `verifyB4()` keeps reading `fillStyleId` /
`strokeStyleId` / `effectStyleId` (reads remain legal), so its checks are unchanged.

## Known same-defect sites in later batches (NOT fixed in this task)

The identical synchronous pattern also exists in B5–B10 helpers: `b5KpiVariants` (2182),
`b6ApplyRoot` (2661, currently a sync function), `b7Frame` (3206/3209/3214, sync) and
`b7Text` (3232/3240), `b7Build*` (3335/3391/3445), `b8BuildFrame`, `b9BuildFrame`,
`b10BuildFrame`. Those batches will fail the same way when run. They are left untouched here
because the instruction is to not proceed past B4; fixing them (including making `b6ApplyRoot`
and `b7Frame` async and awaiting their callers) is recorded as the first item of the next batch.

## Validation (offline, no Figma writes)

1. `node --check tools/figma-plugin/plugin.js`
2. `node tools/figma-plugin/build.mjs` → regenerates `code.js`
3. `node --check tools/figma-plugin/code.js`
4. `rg -n "\.(fill|stroke|effect|text)StyleId\s*=" tools/figma-plugin/plugin.js` → zero matches
   within `b4Build`
5. `git status --short -- src/` → empty

## Real-Figma sequence after implementation (user-run, not part of this stage)

`B4 Create` → expect no `documentAccess` error and the approved inventory
(11 sets / 3 components / 52 variants) → `B4 Verify` all PASS → `B4 Create` again →
`B4 Verify` again to prove zero duplicate creations. Also re-run `B1`/`B2`/`B3 Verify` to
confirm they still PASS. Until executed, evidence stays `REAL FIGMA NOT VERIFIED`.

## Untouched confirmation

- `src/**`, production UI, routes, components, business logic, branding: untouched.
- B0 pages, B1 collections/variables, B2 typography variables, B3 styles: no code path modified;
  this fix only changes how B4 writes style bindings on nodes it creates.
- Nothing is created or modified in the Figma file during this plan stage.
