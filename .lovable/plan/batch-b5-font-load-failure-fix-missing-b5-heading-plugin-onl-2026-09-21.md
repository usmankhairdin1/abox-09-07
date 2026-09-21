# Batch B5 — font-load failure fix + missing B5 heading (plugin-only)

## What went wrong

B5's only text mutation writes the negative KPI delta chip:

`plugin.js:2309` — `if (chip.characters !== A.negative.characters) chip.characters = A.negative.characters;`

`chip` is an existing TEXT node inside a cloned B4 variant. Figma requires the font already used by that node to be loaded before any character write. B4 loads fonts as it creates text (`b4Build`, `b4Font`, `resolveFont`); B5 loads nothing, so the first write throws:

`in set_characters: Cannot write to node with unloaded font "Inter Tight Medium"`

Second, still inside B5: `plugin.js:2310` uses the synchronous `chip.fillStyleId = …` setter, which `documentAccess: dynamic-page` rejects exactly as it rejected B4's setters. Even after the font fix, B5 would fail on the next line.

Third, the plugin UI has no `Batch B5` heading paragraph; the two B5 buttons sit directly after the B4 buttons (`ui.html:90-92`), breaking the B1–B4 pattern.

No font name is guessed anywhere: the fix reads the font off the live node (and its text ranges) that B4 itself created from the approved typography data.

## Changes (all under `tools/figma-plugin/`)

### 1. `plugin.js` — load the node's own fonts before writing

Add one small helper next to the other B5 helpers (near `b5Texts`, ~line 2117):

- `async function b5LoadTextFonts(node)` — if `node.fontName !== figma.mixed`, await `figma.loadFontAsync(node.fontName)`; otherwise iterate the character ranges via `getRangeFontName` and await each distinct font. On failure, throw `STOP: B5 FONT — could not load "<family> <style>" used by <layer>. No substitution is permitted.` (same no-substitution rule as `loadFont`).

Call it in `b5KpiVariants` immediately before the chip mutation (~line 2308), for every chip B5 touches.

### 2. `plugin.js` — dynamic-page async style setter in B5

Replace `chip.fillStyleId = destructive.id` (line 2310) with `await chip.setFillStyleIdAsync(destructive.id)`; the read-side comparison `chip.fillStyleId !== destructive.id` stays (reads are legal). The enclosing loop is already inside `async function b5KpiVariants`. Verifier reads in `verifyB5` are unchanged.

### 3. `plugin.js` — partial-run safety / idempotency

- Wrap the per-tone negative-variant build in a `b5Guarded`-style try/catch modelled on `b4Guarded`: if the clone was created this run (`isNew`) and the mutation then throws, remove the clone before re-throwing, so a failed run leaves no half-built variant.
- Keep the existing duplicate guard (`STOP: DUPLICATE NEGATIVE VARIANT`) and the reuse-by-name lookup, which already make a successful re-run idempotent (0 created on run 2).

### 4. `ui.html` — restore the B5 heading

Insert, immediately before `<button id="b5run">` and after the B4 buttons, one paragraph matching the B1–B4 wording/format:

```
<p>
  <strong>Batch B5 — component states</strong><br />
  Run inside <code>ABox Design System — Library</code>. Adds the deltaSign variant axis,
  the component properties and the exposed nested instance to the existing B4 objects.
  No new component sets, no patterns, no publishing.
</p>
```

Nothing else in the UI moves: B1–B4 order, the B4 cleanup buttons, B6 and the B10 documentation controls stay exactly where they are.

### 5. `README.md`

One line noting that B5 loads each target TEXT node's own font before writing and uses the async style setters, same rule as B4.

## Explicitly not changed

- No `src/**` / production app changes.
- No change to B4 behaviour, inventory, names, variants or styles; no Figma writes in this plan stage.
- No change to the approved B5 scope, counts, spec (`tokens-b5.js`) or verifier assertions.
- B6 untouched (its `b6RequireB5()` preflight already covers the dependency); B7–B10 untouched.

## Validation (offline)

```
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/        # expected: empty
grep -n "fillStyleId =" plugin.js   # no synchronous setter left in the B5 range
```

## Expected result

In Figma Desktop: re-import the plugin, run **Create component states** — it completes without the unloaded-font error and without the dynamic-page setter error — then **Verify component states** (all checks PASS), then Create again (0 created, idempotent), then B1–B4 Verify to confirm nothing regressed. Real-Figma outcome remains unverified until run.
