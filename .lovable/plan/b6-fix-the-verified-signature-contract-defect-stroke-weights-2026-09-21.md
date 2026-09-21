# B6 — fix the verified signature-contract defect (stroke weights on unstroked roots)

## Verified evidence

Both `ABox/Pattern/KpiRow` roots (`columns=4` id 2:554, `columns=3` id 2:587) have
`strokes.length === 0` and an empty `strokeStyleId`, yet Figma keeps its default per-side
weights of `1/1/1/1` because per-side weights are meaningless when there is no stroke.
Every other segment of both signatures matches the approved `tokens-b6.js` definition, and
`ABox/Pattern/ModuleTabBar` (2:612) matches in full, including its real bottom stroke.

The contract is at fault: `b6RootParts` demands `strokeWeights=0/0/0/0` for roots whose
approved definition declares no stroke at all, so it compares a property the approved
definition never specifies.

## Exact change

One file: `tools/figma-plugin/plugin.js`. Two functions, same segment, same order.

1. `b6RootParts(root)` (line 2789) — the `strokeWeights` segment becomes:
   - declared `strokeBottomStyle` → `0/0/0/1` (unchanged)
   - no declared stroke → `n/a`
2. `b6LiveSignature(node, root, children)` (lines 2813-2814) — the matching segment:
   - declared `strokeBottomStyle` → the live `top/right/left/bottom` weights, exactly as
     today, so a stroked pattern must still measure `0/0/0/1`
   - no declared stroke → `n/a` **only when `node.strokes.length === 0`**; if the live node
     carries any stroke paint, emit the live weights, which then differ from `n/a` and the
     check fails as it should

Nothing else changes: the `stroke=` segment, `strokesInLayout=`, layout, sizing, padding,
child count, child types, main-component names, component properties, variant properties
and text properties all keep their current logic and order. Segment labels used by the
read-only diagnostic stay identical.

## Why this is the smallest correct fix

`strokes=[]` is the real structural property that says "this root is unstroked"; the per-side
weights are Figma defaults carrying no design meaning in that state. The new contract asserts
exactly what the approved definition states — unstroked means no stroke paint — and refuses
to assert anything about a property the definition is silent on.

## How stroked patterns stay protected

`ModuleTabBar` declares `strokeBottomStyle: "ABox/Semantic/hairline"`, so it takes the
unchanged branch and must still satisfy `stroke=ABox/Semantic/hairline` (matched by live
style id against the resolved B3 hairline), `strokeWeights=0/0/0/1` from the live per-side
weights, and `strokesInLayout=false`. The separate raw-evidence check in `verifyB6`
(strokeStyleId equality) and the dedicated one-bottom-stroke check are untouched. An
unstroked root that unexpectedly gains a stroke still fails.

## Not in scope

No Figma node is created, modified, renamed or deleted. No builder logic, no child or
component checks, no `tokens-b6.js` edit, no B0-B5 change, no `src/**` change, no publish.
Idempotency is unaffected; existing ids 2:611, 2:554, 2:587, 2:612, 2:630 stay as they are.

## Validation

Offline:

```text
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/        # must print nothing
```

In Figma, after re-importing the plugin:

1. `B6 Verify` — the structural-signature check now PASSES and every other B6 check stays
   PASS; 0 objects created.
2. `Inspect 02 Patterns` (read-only) — same 3 top-level objects with unchanged ids
   2:611 / 2:554 / 2:587 / 2:612 / 2:630.
3. Optional confirmation: `Diagnose B6 signature mismatch` reports SIGNATURE MATCHES for all
   four bodies.
