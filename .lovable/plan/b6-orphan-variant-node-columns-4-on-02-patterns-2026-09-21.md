# B6 — orphan variant node `columns=4` on `02 Patterns`

Plan only. No Figma writes, no cleanup executed, no `src/**` changes, no B7 work.

## 1. Evidence available offline

Run output:

```text
primitive resolved: ABox/Card/KpiCard  id=4:142
STOP: ORPHAN VARIANT NODE ON 02 Patterns — columns=4.
RESULT: B6 FAILED — do not proceed to B7.
```

What the code proves (`tools/figma-plugin/plugin.js`):

- `b6EnsurePattern` step 1 resolves every nested primitive first and printed KpiCard
  `id=4:142`, so `b6RequireB5()` passed — B5 is applied and the `deltaSign` axis is live.
- `b4FindSet("ABox/Pattern/KpiRow")` returned null and no conflicting `COMPONENT_SET` of
  that name sits on the page, so execution reached branch **3b (absent — create)**.
- In 3b the variants are processed in declared order `columns=3`, then `columns=4`. For
  each, `b6FindOnPage(page, vname)` (2889-2893) matches page children **by exact name**.
  The `columns=3` check passed; the `columns=4` check matched an existing page child.
- `b6BuildNode` (2866-2873) appends each new node to the page, so `columns=3` created in
  this run is on the page too — but it cannot be what tripped the `columns=4` lookup,
  since the match is by exact name.

Therefore: a node literally named `columns=4` sat directly on `02 Patterns` **before**
this run started, and `columns=3` did not.

What is **not** yet known and must not be guessed: the node's Figma type, id, parent
chain, whether it carries variant properties, whether it has live instances, and whether
its internal structure matches the approved `columns=4` signature. The current STOP
message prints only the name. No live read of the file is possible in this request.

## 2. Root-cause classification

Ruled out by code:

- **(1) legitimate approved B6 content** — approved B6 top-level objects on `02 Patterns`
  are exactly `ABox/Pattern/KpiRow` (set), `ABox/Pattern/ModuleTabBar`,
  `ABox/Pattern/WizardStepper`. `columns=4` is a variant-matrix name that must live
  *inside* the set, never as a page child.
- **(3) B4/B5 leftover** — B4 and B5 write only to `01 Components`; no B4/B5 name is
  `columns=N`.
- **(4) wrong preflight expectation** — the guard is correct: creating a second
  `columns=4` and combining only the fresh nodes would strand a duplicate. Refusing is
  the right behaviour.

Remaining and most consistent with the code path: **(2) stale debris from an earlier
aborted B6 run**, the exact analogue of the B4 `variant=primaryXs id=3:81` case —
`b6BuildNode` parents each variant to the page before `combineAsVariants` absorbs it, so
any throw between creation and combination strands variants on `02 Patterns`.

Why the earlier failure's cleanup did not remove it — confirmed gap, not a malfunction:

- B6 has **no** guarded wrapper equivalent to `b4Guarded`; `ensureB6Patterns` lets the
  error propagate with no removal of nodes created in that run.
- `b4CleanupOrphans` (5343) skips every `COMPONENT` / `COMPONENT_SET` and additionally
  treats `ABox/Pattern/` names as owned — it can never remove `columns=4`.
- `b4StaleVariants` only considers `01 Components` and only B4 variant names.

So nothing in the plugin is currently able to remove a stranded B6 variant, and nothing
prevented it being stranded. The asymmetric survival (`columns=4` present, `columns=3`
absent) is consistent with a partial manual deletion or an abort mid-sequence, and is
**not** asserted as fact — step 3.1 below establishes it from the live file before any
removal.

## 3. Minimal corrective action (three plugin-only changes)

### 3.1 Read-only evidence command — `b6-inspect-patterns`

New command plus UI button **Inspect 02 Patterns (read-only)** under the B6 heading.
Writes nothing, deletes nothing. For every direct child of `02 Patterns` it prints:

- name, `type`, `id`, parent name and id;
- for `COMPONENT`: whether `parent.type === "COMPONENT_SET"`, its
  `variantProperties`, its `componentPropertyDefinitions`, child count and child names;
- `(await node.getInstancesAsync()).length`;
- whether the name equals an approved B6 top-level name, an approved B6 variant-matrix
  name, or neither;
- for a name matching an approved matrix: the live vs expected `b6ExpectedSignature` /
  `b6LiveSignature` pair, so the node's fidelity is stated rather than assumed.

This is what answers "exact type, id, parent, ownership" with evidence. It runs first.

### 3.2 Guarded cleanup — `b6StaleVariants()` / command `b6-cleanup-stale-variants`

Modelled verbatim on `b4StaleVariants`' six-condition rule. Removes a node only when
**all** hold:

1. `node.parent.id === page.id` for page `02 Patterns`;
2. `node.type === "COMPONENT"` (never `COMPONENT_SET`, never a frame);
3. its name is not an approved B6 top-level name and not batch-owned
   (`ABox/Pattern/`, `ABox/Shell/`, `ABox/Screen/`, `ABox/ScreenState/`, `ABox/Doc/`,
   approved B8/B9/B10 names);
4. its name equals an approved B6 variant-matrix name (`property + "=" + value`) from
   `ABOX_B6.patterns`, i.e. a node that belongs inside a set;
5. `(await node.getInstancesAsync()).length === 0`.

Divergence from B4, deliberate: B4's condition 5 required the surviving valid variant to
already exist inside the set. Here the set does not exist at all, so that condition is
replaced by an explicit either/or, both printed:

- if `ABox/Pattern/KpiRow` exists and already holds a live variant of the same matrix →
  same proof as B4, remove;
- if the set does not exist → the node is removable only because it is a bare matrix
  node with zero instances that no approved page inventory permits; the report says so
  in those words before removing.

Anything failing a condition is printed as `KEPT —` with the reason and left untouched.
The report ends with per-page counts and `removed this run: N`.

### 3.3 Builder-side prevention and a louder STOP

- `ensureB6Patterns` gains a `b6Guarded`-style wrapper per pattern: record the page's
  children before the build; on throw, remove only nodes created during that build that
  are not `COMPONENT_SET` and whose names are approved matrix names, then re-throw. A
  future aborted run then strands nothing.
- The existing STOP at 2980 is extended to print the offending node's `type`, `id` and
  instance count, plus `Run "Remove stale B6 variant components" first.` The guard
  itself is unchanged — it still refuses to adopt or silently delete.

## 4. Explicitly unchanged

B6 scope, pattern inventory, names, variant axis (`columns` = 3 | 4), signatures and
`verifyB6`'s assertions; B0 page-state protections and page-writability rules; B1/B2/B3
data; B4 and B5 inventory and behaviour (`b4CleanupOrphans` and `b4StaleVariants` keep
their exact current rules); B7–B10; `src/**`.

Dynamic-page compatibility preserved: `getInstancesAsync`, `loadAllPagesAsync`, async
style setters only.

## 5. Validation and proof

Offline:

```bash
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/     # must print nothing
```

In Figma Desktop, after approval and re-import, in this order:

1. **Inspect 02 Patterns** — read the evidence block. It must name the `columns=4` node's
   type, id, parent and instance count. Report it before removing anything. If it turns
   out not to be a stale bare matrix component, stop and re-plan.
2. **Remove stale B6 variant components** — expect exactly the reported node removed,
   with its id and reason cited, `removed this run: 1`.
3. **Inspect 02 Patterns** again — expect only approved B6 objects, or an empty page.
4. **B6 Create** — expect `primitive resolved: ABox/Card/KpiCard`, both variants created,
   the set created, `pattern objects created this run: 3`, then B6 Verify PASS.
5. **B6 Create** again — expect `pattern objects created this run: 0` and PASS
   (idempotency), with identical set and variant ids.
6. **Remove stale B6 variant components** again — expect `nothing to remove`.
7. **B1 / B2 / B3 / B4 / B5 Verify** — expect PASS, unchanged, and the B0 seven-page
   order/state check intact.

Until steps 1-7 are executed the result stays labelled `REAL FIGMA NOT VERIFIED`.
