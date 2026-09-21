# B4 — Remove the single stale component node (id=3:81)

Plan only. No Figma writes, no `src/**` changes, no B5 work.

## 1. What the evidence shows

Verifier output:

```text
FAIL page "01 Components" holds exactly the 14 B4 component objects and nothing else
     (found 14 B4 objects, 1 extra node(s))
01 Components › EXTRA variant=primaryXs (COMPONENT) id=3:81
ABox/Action/ActionPill › variant=primaryXs id=4:2   <- the valid one
```

All 14 valid B4 objects are present and pass every inventory, source, property and
style check. The extra node is a 15th, top-level component.

## 2. Root cause (confirmed in `plugin.js`)

`b4EnsureSet` (lines 1717-1771) builds each variant like this:

1. `figma.createComponent()` and `page.appendChild(component)` — Figma requires a
   component to live on a page before `combineAsVariants` can absorb it.
2. build the child content (`b4Build`).
3. after the whole loop, `figma.combineAsVariants(variants, page)` moves every variant
   inside the set.

The first B4 Create aborted at step 2 (the `set_fillStyleId` dynamic-page throw) while
the first variant, `variant=primaryXs`, was already parented to `01 Components`. Step 3
never ran, so it stayed a top-level component — that is id=3:81.

Two guards deliberately leave it alone:

- `b4Guarded` (1809-1825) skips `COMPONENT` / `COMPONENT_SET` when clearing transient
  debris, so it will never delete something that could be a real component.
- `b4CleanupOrphans` (5248-5290) skips `COMPONENT` / `COMPONENT_SET` for the same reason.

And it is invisible to reconciliation: `b4FindSet("ABox/Action/ActionPill")` returned
null on the successful re-run (no set existed yet), so `children` was empty and
`b4MatchVariant` had nothing to match against — stray top-level variants are never
consulted. A fresh `variant=primaryXs` was created and combined into the set as id=4:2.
`b4FindComponent` also ignores it, because `variant=primaryXs` is not one of the three
standalone B4 component names.

So id=3:81 is genuinely stale: it is not one of the 14 valid objects, its name is a
variant name that must live inside a set, and the set already owns a live variant of
that exact name.

## 3. Correction

Two changes, both in `tools/figma-plugin/plugin.js`, plus docs.

### 3.1 New narrowly guarded cleanup rule — `b4StaleVariants()` and command `b4-cleanup-stale-variants`

A separate command from the existing orphan cleanup (which stays exactly as it is, still
refusing to touch any component). The new rule deletes a node only when **all** of these
hold:

1. the node sits directly on page `01 Components` (`node.parent.id === page.id`);
2. `node.type === "COMPONENT"` (never a `COMPONENT_SET`);
3. its name is **not** one of the three approved standalone B4 component names from
   `ABOX_B4.components`, and not batch-owned (`ABox/Pattern/`, `ABox/Shell/`,
   `ABox/Screen/`, `ABox/ScreenState/`, `ABox/Doc/`, approved B8/B9/B10 names);
4. its name equals a B4 variant name — it matches `b4VariantName(set, value)` for some
   set/value in the approved spec (so it is a node that belongs *inside* a set);
5. the correctly named `COMPONENT_SET` for that spec exists and already contains a live
   variant matching the same name via `b4MatchVariant`, and that live variant is a
   different node id — i.e. the valid replacement is proven present;
6. `(await node.getInstancesAsync()).length === 0` — nothing in the document references
   it, so removal breaks no instance. (Async getter: `documentAccess: dynamic-page`
   forbids the synchronous `.instances`.)

Any node failing even one condition is reported and **kept**. For each candidate the
report prints name, id, the owning set name and the surviving variant id, then removes
it, then prints per-page counts and `removed this run: N`. If a candidate satisfies 1-5
but fails 6, it is listed under `KEPT — has live instances` and left in place rather
than deleted silently.

This is exactly the id=3:81 case and nothing wider: a valid variant inside a set fails
condition 1, a standalone B4 component fails condition 3, a B5+ component fails
conditions 3 and 4, and a stale variant with no surviving replacement fails condition 5.

### 3.2 Builder-side prevention — stray detection in `b4EnsureSet`

Before creating a new variant, `b4EnsureSet` will additionally look for a top-level
`COMPONENT` on `01 Components` whose name matches the variant name it is about to
create. If one exists it does **not** silently adopt or delete it; it throws

```text
STOP: STALE TOP-LEVEL VARIANT — "variant=primaryXs" (id=...) sits on 01 Components
outside its set. Run "Remove stale B4 variant components" first.
```

so the operator resolves debris explicitly and no duplicate is created. Once id=3:81 is
removed this branch never fires again, and future aborted runs surface the cause instead
of quietly producing a 15th object.

### 3.3 UI and docs

- `ui.html`: a `Remove stale B4 variant components` button posting
  `b4-cleanup-stale-variants` (next to the existing orphan-cleanup button).
- `plugin.js` entry section: register the message type alongside the other `b4-*`
  commands, with the same `requireFile(T.library.targetFileName)` guard.
- `README.md`: document the rule, its six identity conditions, and the fact that it
  removes components only when the valid replacement is proven to exist.

## 4. Explicitly unchanged

- `verifyB4`'s assertion stays exactly as written: the 14 B4 objects on `01 Components`
  and nothing else. It is not weakened, and 15 objects never becomes acceptable.
- B4 inventory, names, variants, properties, source mappings, styling intent: unchanged.
- No valid B4 component or set is deleted or recreated; id=4:2 and the other 13 objects
  are untouched.
- B0/B1/B2/B3 data: untouched. The cleanup only ever considers top-level components on
  `01 Components`; it reads no variables and no styles.
- `b4CleanupOrphans` keeps its existing COMPONENT protection.
- B5-B10 builders: untouched.
- `src/**`: untouched.

## 5. Idempotency

After cleanup, `01 Components` holds the 11 sets plus 3 standalone components. A
subsequent B4 Create finds every set via `b4FindSet` and every variant via
`b4MatchVariant`, so it updates in place — `objects created this run: 0` — and B4 Verify
passes with exactly 14 objects. Running the new cleanup a second time reports
`nothing to remove`.

## 6. Validation

Offline:

```bash
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/     # must print nothing
```

In Figma Desktop (after approval, re-import the plugin):

1. B4 Verify — confirm the single failure and the `EXTRA variant=primaryXs id=3:81` line.
2. Remove stale B4 variant components — confirm the report names id=3:81, cites
   `ABox/Action/ActionPill` and surviving id=4:2, and removes exactly 1 node.
3. B4 Verify — expect `RESULT: B4 PASSED`, 14 objects.
4. B4 Create, then B4 Verify — expect `objects created this run: 0` and PASS again.
5. Run the cleanup once more — expect `nothing to remove`.
6. B1 / B2 / B3 Verify — expect PASS, unchanged.

Until step 1-6 are actually executed, the result stays labelled `REAL FIGMA NOT VERIFIED`.
