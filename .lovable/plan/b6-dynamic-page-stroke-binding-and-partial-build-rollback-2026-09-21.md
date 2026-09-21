# B6 — dynamic-page stroke binding and partial-build rollback

## 1. Diagnosis (from the current plugin code, no Figma reads)

**The failing setter — exactly one.** A full audit of every style-setting line reachable from B6
construction (`ensureB6Patterns` → `b6Guarded` → `b6EnsurePattern` → `b6BuildNode` →
`b6ApplyRoot` / `b6CreateInstance`) finds a single synchronous style setter:

- `plugin.js:2854` — `node.strokeStyleId = b4Style(index, "paint", root.strokeBottomStyle).id;`
  inside `b6ApplyRoot`.

No other B6 write path binds a style:
- `b6ApplyRoot` otherwise only sets layout fields, `fills = []`, `strokes = []`, stroke weights.
- `b6CreateInstance` only calls `createInstance()` + `setProperties()` — no style ids.
- `b6BuildNode` sets `name`, parents the node, calls `b6ApplyRoot`, appends instances.
- `figma.combineAsVariants` result gets `set.fills = []` only.
- `b6LiveSignature` (2802–2803), `b6HairlineId`, the verifier (3355, 3414, 3422) and
  `b6InspectPatterns` only **read** `strokeStyleId` — reads stay legal under `documentAccess:
  dynamic-page`, exactly as established in the B4 fix.
- No `setTextStyleId`, `fillStyleId` or `effectStyleId` write exists anywhere in B6.

(The other synchronous setters that remain in the file — lines 3607–3641, 3736, 3792, 3846, 4437,
4818, 5330 — belong to B7/B8/B9/B10 builders and are out of scope, as already recorded.)

**Why it throws.** `manifest.json` declares `"documentAccess": "dynamic-page"`, which forbids the
synchronous style-id setters. B4 and B5 were already converted to
`await node.setFillStyleIdAsync(...)` / `setStrokeStyleIdAsync(...)`; B6 was never converted, so
the first pattern that declares a stroke fails. Only `ABox/Pattern/ModuleTabBar` (and, by the same
spec shape, any pattern declaring `strokeBottomStyle`) reaches that line — which is exactly why
`ABox/Pattern/KpiRow` (no stroke) completed and the run died on the next pattern.

**Rollback gap — confirmed, and it is real debris.** `b6BuildNode` creates the component, names it
`ABox/Pattern/ModuleTabBar`, parents it to 02 Patterns, and only then calls `b6ApplyRoot`, which
throws. `b6Guarded` then removes a new child only when `owners[child.name]` matches — and
`b6VariantOwners()` contains only variant-matrix names (`columns=3`, `columns=4`). A top-level
`COMPONENT` pattern name is not in that map, so the half-built ModuleTabBar node **was left on the
page**, while the log line `"(ABox/Pattern/ModuleTabBar left no new node on 02 Patterns)"` printed
unconditionally and is therefore misleading.

Consequence on the next run: `b4FindComponent("ABox/Pattern/ModuleTabBar")` resolves that stump,
`b6Check` compares signatures and stops with `LIVE PATTERN DIFFERS FROM THE APPROVED DEFINITION`.
`b6StaleVariants` cannot clear it (approved top-level name, correctly protected), so a new,
narrowly-scoped removal path is required.

The KpiRow variants and the `ABox/Pattern/KpiRow` set (id 14:65) are legitimate, fully-built
approved content and must be preserved.

## 2. Corrective changes (plugin only, `tools/figma-plugin/**`)

**(a) Async stroke binding.** `b6ApplyRoot` becomes `async`; line 2854 becomes
`await node.setStrokeStyleIdAsync(b4Style(index, "paint", root.strokeBottomStyle).id);`. The style
id resolution through `b4Style` is unchanged, so the binding target is identical. `b6BuildNode`
becomes `async` and awaits it; its two call sites in `b6EnsurePattern` (3b variant loop, standalone
component branch) await. Both loops are already `for…of` inside an `async` function.

**(b) Rollback covers every node the failing build parented.** `b6Guarded` currently filters by
`owners[child.name]`. It will additionally accept approved top-level B6 names via
`b6ApprovedNames()`. Unchanged safety: only children **not present before this build** are ever
removed (`before[child.id]`), and `COMPONENT_SET` is never removed. The misleading
"left no new node" line only prints when the rollback actually removed nothing new.

**(c) One-time removal path for the stump already on the page.** New guarded command
`b6-cleanup-incomplete-patterns` (`b6CleanupIncompletePatterns()`), plus a
"Remove incomplete B6 pattern nodes" secondary button under the existing B6 heading in `ui.html`.
It removes a top-level node on 02 Patterns only when **all** hold:
1. `node.parent.id === page.id`;
2. `type === "COMPONENT"` (never `COMPONENT_SET`);
3. its name is an approved B6 `kind: "COMPONENT"` pattern name;
4. its live signature (`b6LiveSignature`) **differs** from `b6ExpectedSignature` — i.e. it is
   provably incomplete, so a correct approved pattern can never be removed;
5. `(await node.getInstancesAsync()).length === 0`.
Anything failing a condition prints `KEPT — …` with the reason and is left alone. The command
prints the live/expected signatures as evidence and ends with `removed this run: N`. Same
conditional-proof style as `b4StaleVariants` / `b6StaleVariants`.

**Explicitly unchanged:** B6 scope, pattern inventory, property names, variant matrices,
signatures, source strings, `b6RequireB5()` preflight, the orphan-variant STOP, `b6StaleVariants`
and its conditions, B0 page-state protections, B4/B5 logic, `src/**`.

## 3. Offline validation

```text
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/      # must remain empty
rg -n "\.strokeStyleId =|\.fillStyleId =|\.textStyleId =|\.effectStyleId =" plugin.js
#   -> no remaining hit inside the B6 range
```

## 4. Real-Figma validation sequence (after the fix, in order)

1. Re-import the plugin, run **Inspect 02 Patterns** (read-only) — record the exact live state:
   the KpiRow set, and the ModuleTabBar stump with its type, id, instance count and live-vs-expected
   signature. If the stump is not present, or anything unexpected appears, stop and report before
   removing anything.
2. Run **Remove incomplete B6 pattern nodes** — expect exactly the ModuleTabBar stump removed,
   `removed this run: 1`, KpiRow untouched.
3. **Inspect 02 Patterns** again — only `ABox/Pattern/KpiRow` (complete, matching signature) remains.
4. **B6 Create** — expect the primitive resolutions, KpiRow **reused** (0 created),
   ModuleTabBar and WizardStepper created, then the run completes.
5. **B6 Verify** — PASS.
6. **B6 Create** again — `pattern objects created this run: 0`, identical ids (idempotency).
7. **B1 / B2 / B3 / B4 / B5 Verify** — PASS, unchanged; B0 seven pages in order, only
   01 Components / 02 Patterns / 03 Shells populated.

Results stay labelled REAL FIGMA NOT VERIFIED until step 7 is actually executed.
