# B4 Component Foundation — Verification Failure Fix (Plan Only)

Scope: `tools/figma-plugin/` only. No `src/**` changes. No Figma writes during planning. No B5 work. B4's approved inventory, names, variants, properties, source mappings, placement intent and styling intent stay exactly as approved.

## 1. Findings from the offline audit

Read: `plugin.js` (`b4Build` 1519–1617, `b4EnsureSet` 1676–1722, `b4EnsureComponent` 1724–1748, `ensureB4Components` 1750–1759, `verifyB4` 1761–1916) and the approved spec data in `tokens-b4.js`.

Spec-level audit of `tokens-b4.js` (11 sets, 3 components, 52 variants) shows every declared painted node already carries a style:

- 63 TEXT nodes — 0 without `colorStyle`
- 6 ELLIPSE nodes — 0 without `fillStyle`
- 51 FRAME nodes — the 17 without `fillStyle` are explicitly set to `fills = []` (line 1600)

So the 60 hard-coded fills are **not** produced by the approved spec. They come from nodes the builder creates outside the spec:

1. **52 variant components + 3 standalone components = 55 wrappers.** `figma.createComponent()` returns a node with Figma's default opaque white fill and no style. `b4EnsureSet`/`b4EnsureComponent` never clear it. The component-set containers are already cleared (`node.fills = []`, lines 1706/1711) — the same treatment was never applied to the component wrappers.
2. **Nested instance roots** (1 `INSTANCE` in the spec, per variant that uses it) inherit the main component's unstyled default fill, and the verifier's `walk` counts `INSTANCE` nodes.
3. **`MARK` SVG children** — `b4Build` binds vectors by fixed index `kids[0..5]`. If `figma.createNodeFromSvg` nests or reorders the six shapes, some vectors receive no style and are counted as raw. This must be proven by evidence rather than assumed.

55 + instance roots + any unbound mark vectors accounts for the reported 60; the correction below drives the number to 0 regardless of the exact split, and the new evidence output will state the split precisely.

## 2. Why the two page checks fail

Both page checks (`others.every(children.length === 0)` at 1907 and `page.children.length === 14` at 1909) are logically correct for the approved contract. Component nodes must live on a page, and the verifier already accounts for that — it does **not** falsely fail on the presence of the 14 B4 objects; it fails because the page holds *more* than 14 children and other pages hold *some* children.

The most probable cause is debris from the aborted first B4 Create run (the one that threw the dynamic-page setter error): `figma.createFrame()`, `createText()` and `createNodeFromSvg()` append to `figma.currentPage` at creation time and are only reparented into their component afterwards. When the build threw mid-way, the partially built frames/text stayed on whatever page was current. That is a builder robustness defect (no cleanup on failure), not a verifier defect.

This is stated as the leading hypothesis, not a confirmed fact — the plan's first step is to print exact evidence and confirm it before changing anything destructive.

## 3. Changes to make

### 3.1 `plugin.js` — `b4Build` (MARK branch, ~1567–1581)
Replace index-based SVG child binding with identity-based binding: locate each vector by its shape signature already known from the inline SVG, bind with `setFillStyleIdAsync` / `setStrokeStyleIdAsync`, and after binding assert that every painted descendant of the mark has a style id — otherwise `throw new Error("STOP: UNBOUND MARK VECTOR …")`. No approximation, no invented style.

### 3.2 `plugin.js` — `b4EnsureSet` / `b4EnsureComponent`
After the wrapper's layout is configured and before the description is written, clear the wrapper's container chrome exactly as the set container already does:

```js
component.fills = [];
component.strokes = [];
```

Rationale: the wrapper is Figma packaging, not a production surface — the production surface is the built child frame, which is style-bound. This changes no approved styling intent, no names, no variants, no counts.

Nested `INSTANCE` roots: after `createInstance()` in `b4Build`, clear the instance root's own override fill only when the main component's root is a chrome wrapper (same reasoning). If the instance root turns out to be style-bound already, no change is applied.

### 3.3 `plugin.js` — `ensureB4Components` (orphan safety)
Wrap each per-object build so transient nodes created during a failed build are removed instead of being left on `figma.currentPage`: record `figma.currentPage.children` length before the build, and on a thrown error remove any nodes created during that build before re-throwing. This prevents the debris class that caused the page failures from recurring.

### 3.4 `plugin.js` — `verifyB4` (evidence, not weakened checks)
All existing checks stay. Only their reporting is made precise:

- Raw fill/stroke check (1857–1865): keep `rawFill === 0`, but collect up to 40 offending entries as `page › ancestor › node name (TYPE) fill|stroke` and print them under a new `B4 RAW FILL EVIDENCE` block. Continue skipping nothing — component wrappers are included, because after 3.2 they legitimately hold no fills.
- Page emptiness check (1906–1907): keep the assertion; on failure print every offending page with each child's `name (TYPE) id=…` under `B4 PAGE EVIDENCE`, so orphan debris is named rather than merely counted.
- `01 Components` check (1908–1911): keep the requirement that the page holds exactly the 14 B4 objects, and reword the label so it reads as the contract rather than an explanation ("page \"01 Components\" holds exactly the 14 B4 component objects and nothing else"). On failure, list the extra/missing children by name, type and id.
- Non-B4 child check (1912–1915) stays unchanged.

No assertion is removed, relaxed, or made conditional.

### 3.5 `plugin.js` — new `b4-cleanup-orphans` command (guarded, opt-in)
A separate command in the message handler and a button in `ui.html`, used only after the evidence above names the debris. It removes **only** nodes that are all of: on one of the seven B0 library pages, not a `COMPONENT` or `COMPONENT_SET`, not owned by B6–B10 (`ABox/Pattern/`, `ABox/Shell/`, and the approved B8/B9/B10 frame names), and not inside any component. It prints every node it would remove, removes them, and prints the resulting per-page counts. It never touches B0/B1/B2/B3 data, never touches the 14 B4 objects, and never deletes and recreates components to hide a failure.

### 3.6 Async-setter safety sweep (B4 surface only)
Re-check every style setter reachable from `ensureB4Components` → `b4EnsureSet` / `b4EnsureComponent` / `b4Build` / `b4Style` to confirm they all use `setFillStyleIdAsync` / `setStrokeStyleIdAsync` / `setEffectStyleIdAsync` / `setTextStyleIdAsync` and are awaited inside `for…of` loops. Any new setter added by this plan follows the same rule. B5–B10 builders keep their known synchronous sites — out of scope for this batch, already recorded in `README.md`.

### 3.7 `README.md`
Add a short note: component/variant wrappers are chrome (`fills = []`, `strokes = []`) so the "no hard-coded foundation fill or stroke" check is exact; and document the `b4-cleanup-orphans` command with its guard list.

## 4. Validation

```
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/
```

Then, in Figma Desktop (after approval and implementation, not now):

1. B4 Verify — read `B4 RAW FILL EVIDENCE` and `B4 PAGE EVIDENCE` to confirm the diagnosis of section 2 before any cleanup.
2. `b4-cleanup-orphans` if and only if the evidence names orphan debris.
3. B4 Create → B4 Verify — expect all checks PASS, `rawFill = 0`, 14 objects on `01 Components`, other pages empty.
4. B4 Create → B4 Verify a second time — expect `objects created this run: 0` (idempotency).
5. B1 Verify, B2 Verify, B3 Verify — expect unchanged PASS.

Until step 5 is executed, B4 stays labelled `REAL FIGMA NOT VERIFIED`.

## 5. Confirmations

- `src/**` and all production application code, routes and UI: untouched (`git diff --stat -- src/` must stay empty).
- B0 pages, B1 variables (9 collections / 200 variables), B2 typography (19 variables), B3 styles (72 paint / 2 text / 5 effect): not modified by any change in this plan; the verifier keeps asserting them.
- B4's approved component inventory, names, variants, properties, source mappings, placement and styling intent: unchanged.
- No existing B4 component is deleted or recreated to mask a failure.
- No B5 work.
- No Figma writes during this plan-only stage.
