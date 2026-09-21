# B7 — provenance of the three `desktop-rail` frames on 00 Foundations (PLAN ONLY)

## What the code already proves about provenance

The three nodes are named `desktop-rail`, type FRAME, top-level on `00 Foundations`. That name is produced in exactly one place in the whole plugin:

- `plugin.js:4015` — `const rail = await b7Frame("desktop-rail", { w: 268, h: 900, … strokeStyle: "ABox/Semantic/sidebar/border", effectStyle: "ABox/Elevation/plate" }, index);` inside `b7BuildInternal`. No other batch (B4, B5, B6, B8, B9, B10) creates a node with this name; a repository-wide search for the literal finds only this line and its copy in the generated `code.js`.

Why they landed on `00 Foundations` rather than `03 Shells`:

- `b7Frame` (`plugin.js:3826-3827`) calls `figma.createFrame()`, which appends the new frame to `figma.currentPage` at creation time. The frame is reparented into the shell only later, after all its regions are built.
- If the build throws before that reparent, the frame stays on whatever page was active. The same hazard is documented at `plugin.js:1813-1817` and is why `b4Guarded` (1819-1835) sweeps `figma.currentPage`.
- `b7Guarded` (4285-4304) sweeps **only `03 Shells`**, and only children whose name is an approved shell/variant name. A stray `desktop-rail` on the active page matches neither condition, so it survived the rollback.

This matches the three failed Create attempts already observed: the rail is the first region built, `ABox/Semantic/sidebar/border` was requested immediately after, and each `STOP: MISSING B3 PAINT STYLE` run aborted at that point leaving exactly one orphan rail behind on the then-current page.

That is a code-level inference, not live evidence. The plan therefore establishes provenance in Figma first and only then proposes removal.

## Step 1 — read-only inspection (no deletion)

Add a new guarded, read-only command `b7-inspect-foundations-orphans` with a button "Inspect 00 Foundations orphans (read-only)". It writes nothing. For every top-level child of `00 Foundations` it prints:

- name, type, id, parent page
- width/height, layout mode, corner radius, fill / stroke / effect style ids resolved back to style names where bound
- child layer names in order, and depth-1 structure
- every descendant INSTANCE with its `await node.getMainComponentAsync()` name and id, so any live B4/B5/B6/B7 reference is exposed
- `await node.getInstancesAsync().length` where applicable (0 expected — an orphan frame has no instances)
- whether the name matches any approved B0–B7 object name, and whether it matches an approved B7 **region** name from `b7ExpectedRegions()`
- a verdict line per node: `ORPHAN B7 REGION DEBRIS` when name is an approved B7 region name, type is FRAME, parent is `00 Foundations`, and it is not referenced by any component; otherwise `UNIDENTIFIED — do not remove`

Expected evidence for 7:59, 8:59, 9:61: FRAME, 268×900, VERTICAL auto-layout, radius 28, stroke bound to `ABox/Semantic/sidebar/border` or unstroked (depending on how far each run got before the throw), effect `ABox/Elevation/plate`, few or no children, zero instances, name is the approved Internal-shell region `desktop-rail`.

## Step 2 — conditional cleanup, by identity, never by blanket id

Only if step 1 returns `ORPHAN B7 REGION DEBRIS` for all three: add a guarded command `b7-cleanup-foundations-orphans` with a button "Remove B7 orphan frames on 00 Foundations". It removes a top-level node on `00 Foundations` only when **every** condition holds:

1. `child.parent` is the `00 Foundations` PageNode
2. `child.type === "FRAME"` (never COMPONENT, never COMPONENT_SET, never anything else)
3. `b7ExpectedRegions(child.name)` is null **and** `child.name` is in the approved B7 region-name set (`desktop-rail`, and the other region names only if step 1 shows them) — i.e. it is a shell *region* fragment, not an approved shell object
4. it contains no INSTANCE whose main component is a live B4/B5/B6/B7 object, verified with `getMainComponentAsync()`
5. `(await child.getInstancesAsync()).length === 0` where the API applies

Anything failing a condition prints `KEPT — <name> id=<id> — <failing condition>` and is left alone. The command reports each removal with name and id and a final count.

The three ids (7:59, 8:59, 9:61) are printed for the record but are **not** used as the deletion criterion — identity conditions are, so a node whose state changed between inspection and cleanup cannot be removed by a stale id.

## Step 3 — close the leak that created them

`b7Guarded` gains the `b4Guarded` behaviour it is missing: in its catch block, after sweeping new approved-name children of `03 Shells`, also sweep `figma.currentPage` for nodes created during the run that are not COMPONENT or COMPONENT_SET, exactly as `plugin.js:1826-1831` does. Without this, any future aborted B7 Create leaves the same debris again. No other part of `b7Guarded` changes, and the `03 Shells` sweep keeps its existing name restriction.

## Safeguards

- The valid B7 shells `10:58`, `10:113`, `10:188`, `10:242` are on `03 Shells`; both new commands read and write only `00 Foundations`, and the cleanup rejects any node whose parent is not that page and any node of type COMPONENT/COMPONENT_SET. They cannot be reached.
- B0–B6 untouched: no command in this plan writes to `01 Components`, `02 Patterns`, variables, styles, or any page other than `00 Foundations`. The page count and order are unchanged — removing children of a page does not alter the 7-page inventory.
- `verifyB7()` and every B7 check, the approved shell inventory, regions, properties, variants, `b7CleanupIncompleteShells()`, `tokens-b7.js` and the API audit are all unchanged. The only edit to existing logic is the `figma.currentPage` sweep inside `b7Guarded`'s catch block.
- No `src/**` change; no application behaviour change.
- No node on `05 Screens`, `06 Documentation` or `04 Experiences` is read for mutation or touched.
- No other node on `00 Foundations` is affected: if the page holds anything beyond the three rails, step 1 reports it and step 2's conditions exclude it unless it independently qualifies as B7 region debris.

## If provenance cannot be established

If step 1 shows any of the three is not an approved B7 region name, or holds instances of live components, or is not a FRAME, the plan stops: nothing is deleted, the evidence is reported, and the next diagnostic is to compare that node's structure against the approved B4/B6 inventories before deciding ownership.

## Offline validation

```
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/      # expect: empty
```

## Figma sequence after implementation

1. Copy the rebuilt `code.js` locally and reload the development plugin.
2. Run **Inspect 00 Foundations orphans (read-only)** and send the output — nothing is deleted at this point.
3. Only after that evidence confirms all three are B7 region debris: run **Remove B7 orphan frames on 00 Foundations** (expect `removed 3`).
4. Run **Verify shells** — expect `RESULT: B7 PASSED`, 0 objects created.
5. Re-run B6 Verify and the B1–B5 verifiers — all PASS, ids `2:611 / 2:554 / 2:587 / 2:612 / 2:630` and shells `10:58 / 10:113 / 10:188 / 10:242` unchanged.

## Out of scope

No Figma change during this planning request; no B8 work; no re-run of Create shells; no change to the B7 verifier's assertions; no `src/**` change.
