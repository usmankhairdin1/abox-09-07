# B5 — B0 page-state check failed: diagnosis and minimal verifier correction

## What the evidence already proves

B5 writes nothing to any page. Its whole write surface is: rename existing variants, clone existing KpiCard variants into the existing set (`set.appendChild`), set text/fill on the delta chip, add component properties, expose one nested instance (`b5KpiVariants`, `b5Properties`, `b5Exposed`). There is no `figma.createPage`, no `page.appendChild`, and no page reorder anywhere in the B5 code path.

The run's own numbers confirm nothing was misplaced:

- 11 sets, 3 standalone, 56 variant ComponentNodes, 59 physical — exactly the approved B5 targets (52 B4 variants + 4 new negatives).
- All B5 structural, property and layer checks PASS, so every object B5 touched is where the spec says it is.

So category 2 (B5 content written to the wrong page) is ruled out by the counts, and category 1 is ruled out for the component page — `01 Components` is on the writable list.

## Why the failure message cannot yet name the cause

`verifyB5` (plugin.js:2585-2592) folds three independent conditions into one `add(...)` with no evidence output:

1. exactly 7 pages,
2. the 7 names in the approved order,
3. every page not in `writable = ["01 Components", "02 Patterns", "03 Shells"]` has `children.length === 0`.

Any one of them failing prints the same sentence and no node names. B4's verifier already does this correctly — it splits count/order from emptiness and prints `B4 PAGE EVIDENCE` listing every unexpected child. B9's verifier goes further and accepts `06 Documentation` when it is empty **or** holds exactly the approved B10 frames (plugin.js:4797-4799); B5's rule was written before that allowance and does not have it.

Given that B5 creates no page content, the remaining possibilities are all off-page-B5:

- **(3) stale debris** left on `00 Foundations`, `04 Experiences`, `05 Screens` or `06 Documentation` by an earlier aborted run (the pre-fix B4/B5 failures are known to have left transient nodes).
- **(4) an incorrect verifier expectation** — approved B10 documentation frames on `06 Documentation` (legal per B9's rule) or approved B8 content on `04 Experiences` would fail B5's stricter rule even though nothing is wrong.

I will not guess which. The minimal correction makes the verifier say it.

## Minimal change — verifier only, `tools/figma-plugin/plugin.js`

In `verifyB5`, replace the single compound assertion (lines ~2585-2592) with:

1. `add(figma.root.children.length === 7 && names.join("|") === wantPages.join("|"), "B0 pages unchanged: exactly 7, in the approved order")` — with the actual name list printed when it fails.
2. A per-page emptiness check over the non-writable pages that collects evidence exactly like `verifyB4`: for every unexpected child, push `"  <page> › <name> (<type>)  id=<id>"` into a `B5 PAGE EVIDENCE` block printed after the checks (capped at 40 entries), so the failing page and node are named.
3. Adopt B9's already-approved allowance verbatim: `06 Documentation` passes when it is empty **or** its children are exactly `b10ApprovedNames()` in order. No other page gains a new allowance; `writable` stays `01 Components`, `02 Patterns`, `03 Shells`.

Everything else in `verifyB5` is untouched, including every structural, count, property, binding and B1/B2/B3 check. No assertion is weakened: the emptiness requirement is kept, only reported precisely.

## How this proves the seven B0 pages are intact

After the change one B5 Verify run prints, separately: the live page count, the live page-name list compared to the approved order, and — for each non-writable page — either nothing or an explicit line per offending node. A PASS on checks 1 and 2 plus an empty evidence block is positive proof that all seven pages exist, in order, with only the approved pages populated.

## Follow-up that depends on the evidence (not part of this change)

Once the evidence block names the nodes:

- if they are approved B10 frames on `06 Documentation` → already covered by the new allowance, it passes, nothing further;
- if they are orphan debris → clear them with the existing guarded `b4-cleanup-orphans` command, which removes only top-level non-component nodes and never touches COMPONENT/COMPONENT_SET, then re-verify;
- if they are something else, I will report it before touching anything.

## Not changed

- No `src/**` or production app code.
- No B4 inventory or behaviour; no B5 scope, component/property inventory, bindings or counts.
- No B6 or later batch logic; `b10ApprovedNames()` is only read.
- No Figma writes in this stage; dynamic-page async patterns and the existing idempotency/cleanup behaviour are untouched (the verifier only reads).

## Validation (offline)

```
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/     # expected: empty
```

Then, in Figma: **Verify component states** only (read-only) and read the new `B5 PAGE EVIDENCE` block.
