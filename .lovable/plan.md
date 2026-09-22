# Batch B8 — minimal runtime fix

## Root cause (confirmed by read)

`plugin.js` line 5407 in `verifyB8()`:

```js
const mains = b8InstanceMainNames(frame);   // async helper, not awaited
if (mains.indexOf(spec.shell.name) === -1)  // Promise has no .indexOf -> "not a function"
```

`b8InstanceMainNames()` became async in the approved B8 fixes; this call site was the only one on the executed B8 path left un-awaited. The five frames were created successfully before this line ran, and the throw happened inside `verifyB8()`, which sits outside `b8Guarded` — so no rollback executed and all five frames remain intact with correct plugin data and regions.

## The change

One line, in `verifyB8()` only:

```js
const mains = await b8InstanceMainNames(frame);
```

`verifyB8()` is already `async`, so this is valid as-is. Nothing else changes: no builders, no `b8Guarded`, no signatures, no region structure, no creation logic, no B0–B7 logic, no `src/**`.

Recorded, not fixed in this step: the same un-awaited call exists at line 5862 inside `verifyB9()`, and `b9Instance()` (line 5526) returns an un-awaited `b8CreateInstance(...)`. Both are B9 scope.

## Validation

- `node --check tools/figma-plugin/plugin.js`
- `node build.mjs` (regenerate `code.js`)
- `node --check tools/figma-plugin/code.js`
- `git diff --stat -- src/` (expected empty)

No Figma execution or mutation in this step.

## Expected outcome after rerun in Figma

Create takes the reuse path for all five frames (zero creations, same ids) and Verify B8 now completes instead of throwing.
