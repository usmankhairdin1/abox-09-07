# Phase 59 — correct the 00 Foundations debris classification

The read-only inspection found exactly one node on `00 Foundations`:
`ABox/CurrentAppGroup/Public & Marketplace` (FRAME, id 39:12917), stamped
`aboxCurrentAppOwner = Phase59`, `aboxCurrentAppKind = module-group`,
`aboxCurrentAppKey = group:public`, no `aboxBatch`, no `aboxKey`, used as main by 0 instances.
The inspector reported `UNIDENTIFIED — DO NOT REMOVE`. That verdict is wrong, and the reason
is an ordering bug in the predicate, not a missing signal.

## Root cause

`currentAppFoundationsVerdict` in `tools/figma-plugin/plugin.js` runs its checks in this order:

```text
1. COMPONENT / COMPONENT_SET            -> UNIDENTIFIED
2. not FRAME and not TEXT               -> UNIDENTIFIED
3. node is used as a main component     -> UNIDENTIFIED
4. node contains ANY descendant INSTANCE-> UNIDENTIFIED   <-- fires here
5. aboxCurrentAppOwner === "Phase59"    -> PHASE 59 TRANSIENT DEBRIS (never reached)
...
```

Step 4 was written for B7 region orphans, where a live descendant instance means the node is
still in use. But a Phase 59 module group is *built out of* B4–B7 instances by design: this
group already contains `module-heading` and
`desktop/ABox/CurrentApp/Public & Marketplace/route-accessibility`, whose subtree holds native
component instances. So every partially built Phase 59 group will always trip step 4 and can
never reach step 5. The ownership stamp was present and correct; it was simply evaluated too
late. The node itself is genuine Phase 59 debris: it is a module group written by the run that
threw, left on the active page because that run predates the working-page pin.

## The ownership predicate

`aboxCurrentAppOwner = "Phase59"` is written only by `currentAppSetData`, which is called only
from Phase 59 creation paths, and `aboxCurrentAppKind`/`aboxCurrentAppKey` come from the same
write. No B0–B10 batch writes those keys. They are therefore definitive proof of Phase 59
ownership — but the plan keeps a second, structural invariant so a single stray stamp can never
authorise a delete:

A node is `PHASE 59 TRANSIENT DEBRIS` only when **all** of these hold:
- it is a FRAME or TEXT (never COMPONENT / COMPONENT_SET);
- it is not used as a main component by any instance;
- it carries no `aboxBatch` and no `aboxKey` (no B0–B10 identity);
- `aboxCurrentAppOwner === "Phase59"`; **and**
- `aboxCurrentAppKind` is one of the known Phase 59 kinds (`module-group`, `screen`,
  `mobile-screen`, `section`, and the remaining kinds passed to `currentAppSetData`), **and**
  `aboxCurrentAppKey` is non-empty and matches the Phase 59 key contract
  (`group:<slug>` for `module-group`, `current:*` for screens/sections).

Anything failing any clause stays `UNIDENTIFIED — DO NOT REMOVE`. The name-prefix heuristic is
narrowed accordingly: an unstamped FRAME/TEXT is only debris when its name matches a Phase 59
prefix **and** it has no descendant instances — unchanged behaviour for unstamped strays, so no
arbitrary frame becomes deletable.

## Exact changes

`tools/figma-plugin/plugin.js` — `currentAppFoundationsVerdict` only:
- move the descendant-instance check so it applies to the unstamped name-heuristic branch only,
  not to stamped Phase 59 nodes;
- add `currentAppOwnedVerdict(node)` implementing the full ownership predicate above (kind
  whitelist + key-format check) and return `PHASE 59 TRANSIENT DEBRIS` when it passes;
- keep the "used as main" and `aboxBatch`/`aboxKey` guards ahead of everything;
- extend the inspector output with one line, `ownership check : <pass/fail reason>`, so the next
  real-Figma run shows why each verdict was reached.

Nothing else changes: the protected-page assertion, the `00 Foundations` expected count of 0,
the working-page pin, guarded rollback and its sweep, the duplicate-name fix and the
`h: height` fix are untouched. The cleanup command stays evidence-gated and still removes only
nodes the same predicate positively classifies.

## Regression test

`tools/figma-plugin/check-current-app-verdict.mjs` (new, wired into `build.mjs` next-steps),
running `currentAppFoundationsVerdict` extracted from source against stubbed nodes:
- the exact failing node — FRAME, owner `Phase59`, kind `module-group`, key `group:public`, no
  batch/key, children `module-heading` + `desktop/.../route-accessibility` with descendant
  instances inside -> `PHASE 59 TRANSIENT DEBRIS`;
- the same node with a `aboxBatch` stamp, or a bad key (`public`), or an unknown kind -> stays
  `UNIDENTIFIED`;
- a pre-existing unrelated frame (`Cover`, no stamps, with instances) -> `UNIDENTIFIED`;
- a COMPONENT with a Phase 59 stamp -> `UNIDENTIFIED`;
- inspecting a page performs zero mutations (stub node `remove` throws if called).

## Verification before the next Figma attempt

`node --check` on plugin and bundle, the new verdict test, plus the existing guard, mobile and
globals checks; rebuild `code.js` from source; re-run the extractor and confirm unchanged
inventory — 12 groups, 179 desktop screens, 87 mobile companions, 682 A / 135 B / 102 C / 3 D.
No `src/**` changes; no new variables, styles, components, sets, variants, properties, patterns
or shells; no B0–B10 object modified; no Figma mutation performed during implementation, and
node 39:12917 is left exactly as it is.

## Expected inspector output after the fix

```text
actual top-level nodes   : 1
  ABox/CurrentAppGroup/Public & Marketplace  (FRAME)  id=39:12917
      aboxCurrentAppOwner : Phase59
      aboxCurrentAppKind  : module-group
      aboxCurrentAppKey   : group:public
      aboxBatch           : (none)
      used as main by     : 0 instance(s)
      ownership check     : pass (Phase 59 kind + key contract)
      VERDICT             : PHASE 59 TRANSIENT DEBRIS

  Phase 59 debris: 1 · other nodes: 0 of 1 top-level node(s).
```

Then, on your instruction: run the removal command (it deletes that one group and reports
`remaining top-level nodes on 00 Foundations: 0`), re-inspect to confirm the baseline, and only
then Create Current App -> Verify -> Create -> Verify, with the second create reporting zero new
groups, descendants and reactions.
