# Phase 59 — Fix `'h' is not defined` in Create Current App

## Exact root cause

Not a build artifact, not minification, not a stale bundle. It is a single source typo: an object shorthand property that references an identifier that was never declared.

`tools/figma-plugin/plugin.js`, function `currentAppBuildMobile`, line 6831:

```text
const width  = ABOX_CURRENT_APP.layout.mobileWidth;
const height = Math.max(844, Math.round(placement.height * 0.82));
const frame  = await b8Frame("mobile/" + spec.key, { ..., w: width, h, ... }, index);
                                                              ^ shorthand for `h: h`
```

The local is named `height`, so `h` resolves to nothing at runtime. Figma's sandbox throws `'h' is not defined` the first time a mobile companion is built — after the page and the first groups/desktop screens already exist, which is exactly why the run created `07 Current App` (39:12916) and then rolled back.

`height` is currently unused, confirming the intent was `h: height`.

The generated bundle is in sync: `tools/figma-plugin/code.js` line 90508 contains the identical expression. No source/bundle mismatch.

## Exact change

One file, one function, one token.

- `tools/figma-plugin/plugin.js` → `currentAppBuildMobile` (line 6831): replace the shorthand `h,` with `h: height,`.

Nothing else changes. The mobile frame's intended fixed height (`max(844, round(placement.height * 0.82))`) is what the placement math and the approved spec already assume, so no geometry, identity, signature, mapping, binding, or interaction target shifts.

## Regression check (offline)

Add a deterministic static guard so this identifier class fails offline instead of inside Figma:

- New check step in `tools/figma-plugin/build.mjs` (or a small sibling script it invokes): parse the emitted `code.js` and the source `plugin.js` with a strict-mode scope walk and fail the build on any free (undeclared, non-global) identifier reference. The allowlist is the Figma plugin sandbox global surface already used by the plugin (`figma`, `__html__`, standard ES globals, `console`).
- Plus a focused unit-style harness run under Node: stub `b8Frame`, `currentAppText`, `currentAppInstance`, `currentAppLocalCard` and call `currentAppBuildMobile` against one real manifest screen from `tokens-current-app.js`, asserting it returns a frame with width 390 and the computed height. This exercises the exact failing path end to end without Figma.

Both checks run before any Figma Desktop attempt.

## Verification sequence (all offline, no Figma mutation)

1. `node --check plugin.js`
2. Rebuild the bundle from source via `build.mjs` — never hand-edit `code.js`
3. `node --check code.js`
4. New free-identifier scan: zero findings in the Phase 59 region and the whole bundle
5. New `currentAppBuildMobile` harness: passes
6. Re-run `extract-current-app.mjs`: 179 screens / 12 groups / 87 mobile companions / 682 Category-A reactions / 135 B / 102 C / 3 D unchanged; zero duplicate stable keys, screen names, frame names, group names — the previously fixed duplicate-identity/naming rule stays exactly as implemented
7. Confirm clean `src/**` diff and app build OK

## Guarantees preserved

- Preflight, duplicate detection, dependency validation, protected-page checks, guarded rollback, and idempotency are untouched — no guard is relaxed and no failing path is bypassed.
- B0–B10 objects, IDs, counts, signatures, bindings, and reactions are not modified; the protected-page snapshot/assert path is unchanged.
- No new variables, styles, components, component sets, variants, properties, patterns, or shells.
- No `src/**`, route, backend, or application behavior changes.
- No Figma Desktop mutation as part of this fix.

## Expected next Create Current App behavior

The leftover `07 Current App` page from the failed run was removed by the guarded rollback, so the next run starts additive and clean. Run in Figma Desktop:

1. Create Current App → creates `07 Current App`, 12 groups, 179 desktop screens, 87 mobile companions, native B4–B7 instances, and 682 Category-A reactions
2. Verify Current App → all Phase 59 and B0–B10 assertions pass
3. Create Current App (second pass) → zero new groups, zero new descendants, zero new reactions
4. Verify Current App → unchanged results

If the rollback left the page behind in this file, the plan's first Figma step is instead to confirm the page is empty/absent before the create run; the additive path handles an existing empty page without creating a duplicate.
