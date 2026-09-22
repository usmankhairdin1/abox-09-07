# Phase 58 — Verify B0 closure-time failure: diagnosis (PLAN ONLY)

## What the run actually proves

All five B0 page assertions PASS: the file is `ABox Design System — Library`, the seven pages exist exactly once, each is a native PAGE node, they sit at indices 0..6 in the declared order, and there are no extra pages. The original B0 contract — the page baseline — is intact.

The two FAILs are not B0-era mutations. They come from two assertions inside `verifyLibraryPages()` that were written when the file was empty and were never given the later-batch allowances that every subsequent verifier (B4, B5, B7, B8, B9, B10) received.

## Exact cause, line by line

File: `tools/figma-plugin/plugin.js`, function `verifyLibraryPages()` (lines 409-479).

**FAIL 1 — "no variables outside the approved B1 collections, and no text or effect styles"** (lines 439-455)

The assertion is a conjunction of three terms:

```
unexpectedCollections.length === 0  &&  textStyles.length === 0  &&  effectStyles.length === 0
```

The first term already has a B1 allowance and still passes. The second and third are hard zeros. B3 legitimately creates text styles and effect styles (`tokens-b3.js` declares a `textStyles` block at line 442 and an `effectStyles` block at line 474, part of the approved 79-style inventory). So after B3 the two hard zeros can never hold, and the compound `add(...)` prints one sentence with no breakdown of which term failed.

**FAIL 2 — "no components or component sets created by this batch"** (lines 457-467)

`components` is accumulated with `page.findAll(n => n.type === "COMPONENT" || n.type === "COMPONENT_SET")` over every page, then asserted `=== 0`. The label says *"created by this batch"*, but the code counts every component in the file. B4/B5 (11 sets, 3 standalone, 59 physical nodes) and B7 (shells as COMPONENT/COMPONENT_SET) make this count non-zero by design. The intent was "B0 itself created none"; the implementation is "the file contains none".

Both failures are therefore verifier-expectation defects at closure time, not evidence of any unexpected mutation. Nothing in the library is wrong.

## Which route Phase 58 should take

There is no other closure-safe B0 path in the repository — `verifyLibraryPages()` is the only B0 verifier, reached by both handlers at lines 6580 and 6586. So option (a): adapt B0 verification to keep validating the original page/baseline contract while explicitly permitting the protected, named B1–B10 inventory.

This is the same treatment already approved and applied elsewhere: `verifyB5`/`verifyB7`/`verifyB8`/`verifyB9` allow the approved B10 frames on `06 Documentation` by exact-name comparison (plugin.js 2599, 4796, 5338, 5843), and `verifyB4` scopes its component counts by ownership prefix (line 1859). B0 gets the analogous allowance — by exact approved identity, never by relaxation.

## Exact correction that would be required (not implemented here)

Only inside `verifyLibraryPages()` in `tools/figma-plugin/plugin.js`. Nothing else in the file, no tokens file, no extractor, no `src/**`.

1. **Split the compound style/variable assertion** (lines 452-455) into three separately reported checks, each with printed evidence of the offending names:
   - variable collections: unchanged — every collection must be in `ABOX_B1.collections`;
   - text styles: names must be a subset of the approved `ABOX_B3.textStyles` names;
   - effect styles: names must be a subset of the approved `ABOX_B3.effectStyles` names.
   Any style not in the approved B3 inventory still FAILs and is named in the output.

2. **Scope the component assertion** (lines 457-467) to its stated intent: the count of COMPONENT/COMPONENT_SET nodes whose names are *not* in the approved B4/B5/B7 inventories (`ABOX_B4.sets`, `ABOX_B4.components`, `ABOX_B7.shells`) must be 0, and each unexpected node is printed as `page › name (type) id=…`. Relabel to "no components or component sets outside the approved B4/B5/B7 inventory".

3. **Keep every page assertion byte-identical** — file name, existence, PAGE type, indices 0..6, no extra pages, no image fills. These are the original B0 contract and are not touched.

4. Add a printed `B0 INVENTORY` block listing observed counts (collections, text styles, effect styles, components/sets per page) so the closure evidence records the real numbers rather than asserting zeros.

No check becomes a generic PASS: each keeps its failing condition and gains only an exact-name allowance for inventory that B1–B10 are contractually required to have created.

## Effect confirmation

The correction touches verification and evidence output only. It creates, renames, moves or deletes **zero Figma objects**, reads only, and changes no B0–B10 creation contract, signature, placement, region or idempotency rule. No B11 is created.

## Out of scope

No new batch, no B11, no Figma writes, no changes to B1–B10 builders or verifiers, no `tokens-*.js` or `extract-*.mjs` edits, no `src/**` changes, no publish.

## Validation once approved

Offline: `node --check tools/figma-plugin/plugin.js`, `node tools/figma-plugin/build.mjs`, `node --check tools/figma-plugin/code.js`, `git diff --stat -- src/` empty.

Real Figma Desktop: Verify B0 only (read-only) — expect all page checks PASS as now, the two reworked checks PASS with the inventory block printed, and `RESULT: B0 PASSED`. Then resume the Phase 58 sweep B1 → B10.

## Confirmation

No Figma mutation and no implementation occurred during this planning step. Only `.lovable/plan.md` was written.
