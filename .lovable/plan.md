# Batch B8 — runtime failure diagnostic (PLAN ONLY)

Read-only diagnosis of the `not a function` failure that happened after all five B8 frames were created. No implementation, no Figma mutation.

## Suspected failing expression

`plugin.js` line 5407, inside `verifyB8()`:

```js
const mains = b8InstanceMainNames(frame);   // returns a Promise — not awaited
if (mains.indexOf(spec.shell.name) === -1) shellOk = false;   // <-- "mains.indexOf is not a function"
```

`b8InstanceMainNames()` became `async` in the approved B8 fix (it now awaits `b8MainName()` per instance). Every other call site of the converted helpers was awaited; this one was not. A Promise has no `.indexOf`, so the first `mains.indexOf(...)` throws `not a function`.

## Evidence from the code path

- Creation path is fully awaited and clean: `b8Guarded` → `ensureB8Experiences` → `b8BuildFrame` → `await b8MetadataRegion / b8ShellRegion / b8SequenceRegion / b8ContentRegion`, all region builders `await b8Frame(...)`, all instance helpers `await b8CreateInstance` → `await b8SetInstanceProps` → `await b8MainName`. Consistent with the observed run: dependencies resolved, all five frames created, `b8Created = 5`.
- The handler (line 6680-6681) then calls `await verifyB8()` — the failure is therefore after creation, in verification, exactly as reported.
- In `verifyB8` the per-frame loop uses `mains` three times (`shellOk`, patterns, components) plus `mains.join(" | ")` in the inventory line. The first use throws.
- `b8Guarded` is compatible with the async path (`return await fn()`), and it wraps only `ensureB8Experiences`, not `verifyB8` — so the throw in verify is outside the guard. No rollback ran. This matches the five frames still existing.
- Second, identical un-awaited call at line 5862 inside `verifyB9()` (same helper). B9 is not being run now, but it will fail the same way; it should be recorded, not fixed in this step unless the approved fix scope is extended.
- Adjacent observation, out of scope for this failure: `b9Instance()` (line 5526) returns `b8CreateInstance(...)` without `await`, so its callers receive Promises. Not on the B8 path; record only.

## Read-only inspection to perform

All of it is static; nothing runs against Figma.

1. Confirm `b8InstanceMainNames` is declared `async` (line 5298) and list every call site: expect exactly two — 5407 (`verifyB8`) and 5862 (`verifyB9`), both missing `await`.
2. Grep the B8 range for every remaining un-awaited call to the converted async helpers (`b8Frame`, `b8MainName`, `b8SetInstanceProps`, `b8CreateInstance`, `b8ShellInstance`, `b8PatternInstance`, `b8ComponentInstance`, `b8Card`, the four region builders, `b8BuildFrame`, `b8InstanceMainNames`) to prove 5407 is the only one on the executed B8 path.
3. Confirm `verifyB8` is itself `async` (line 5322), so adding `await` at 5407 is syntactically valid.
4. Confirm no other `.indexOf` / `.join` / `.map` / `.filter` in the post-creation B8 path is applied to a value produced by an async helper.
5. Confirm the built `code.js` contains the same un-awaited expression, ruling out a stale-bundle explanation.

## Expected diagnostic output

- `b8InstanceMainNames` is async; two call sites; both un-awaited.
- No other un-awaited async B8 call on the executed path.
- `verifyB8` is async.
- `code.js` matches plugin.js at the failing line.

Conclusion the diagnostic should produce: the smallest exact fix is adding `await` at line 5407 (and, if B9 is in scope later, at 5862). No builder, guard, signature, or Figma-structure change.

## Current Figma state implications

- Rollback did **not** execute — the throw occurred in `verifyB8()`, outside `b8Guarded`.
- All five frames remain, with plugin data written (`b8SetPluginData` runs before the regions are appended) and all four regions appended, because `b8BuildFrame` completed for each frame before `page.appendChild(root)`.
- No partially-created frames: each frame is appended only after its four regions are built, and `b8Created` reached 5.
- A rerun of Create would take the reuse path: `b8FindFrame` finds each frame once, `b8AssertReusable` compares plugin data (batch/kind/name/signature/sorted sources) and the four ordered region names — all written by this successful run. Expected result: "frame reused" ×5, zero creations, no duplicates. The rerun would then hit the same verify failure until the `await` is added.

## Safety

- Nothing is deleted, renamed, moved or recreated; the five frames and their ids stay as-is.
- No changes to `plugin.js`, `code.js`, `tokens-b8.js`, `src/**`, or roadmap files in this step.
- B0–B7 logic and Figma structures untouched; B9/B10 untouched.
- Idempotency is preserved by the existing signature contract; the eventual fix touches only verification reading, never writing.
