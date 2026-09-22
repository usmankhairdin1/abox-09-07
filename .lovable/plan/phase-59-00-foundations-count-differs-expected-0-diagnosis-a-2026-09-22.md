# Phase 59 — "00 Foundations count differs (expected 0)" diagnosis and corrected plan

## What the message actually means

`currentAppAssertProtected()` (plugin.js line 6908) checks that each protected page holds
exactly its approved number of top-level nodes: `00 Foundations: 0`, `01 Components: 14`,
`02 Patterns: 3`, `03 Shells: 3`, `04 Experiences: 5`, `05 Screens: 179`, `06 Documentation: 10`.
It is called from exactly two places: `currentAppPreflight()` (line 6937, **before any write**)
and `verifyCurrentApp()` (line 6996). The run reported guarded rollback, and the rollback in
`currentAppGuarded` is a no-op when nothing was created — so the stop happened at preflight,
i.e. **`00 Foundations` already held at least one top-level node when the run started**.

The assertion behaved correctly. It is the state of the page that is wrong.

## Root cause (file state, caused by a plugin gap)

Two findings, both verified in source:

1. **Node creation is not pinned to the target page.** `figma.createFrame()` / `createText()`
   attach the new node to `figma.currentPage` and it is only reparented on `appendChild`.
   Batches B4–B10 know this: `b7Guarded` (line 4471) and its B8/B9/B10 equivalents snapshot
   `figma.currentPage.children` before the run and sweep any transient stray on failure.
   Phase 59 has **no such sweep** — `currentAppGuarded` (line 7058) only cleans the
   `07 Current App` page — and Phase 59 never calls `figma.setCurrentPageAsync`.
2. **The previous Phase 59 run threw mid-build** (`h is not defined`, during the first mobile
   companion). If `00 Foundations` was the active page in Figma Desktop at that moment, the
   partially built frames/text created just before the throw stayed there as orphans. The
   next run's preflight then sees a non-zero count — exactly the observed failure.

So: the Figma file is most likely contaminated by Phase 59 debris from the previous failed run,
and the plugin gap that allowed it is the missing current-page pin plus the missing transient
sweep. The assertion, the B0 baseline of zero, and the expected counts are all correct and stay
unchanged.

This diagnosis is confirmed in source but **not yet confirmed against the live file** — step 1
below is the evidence gate; nothing is deleted before that evidence is read.

## Evidence required from Figma Desktop (before any cleanup)

Add a read-only Phase 59 inspector (no writes) and run it first. For every top-level node on
`00 Foundations` it prints: name, type, id, size, parent, child names, and the plugin-data
stamps `aboxCurrentAppOwner`, `aboxCurrentAppKind`, `aboxCurrentAppKey`, `aboxBatch`,
`aboxKey`, and whether the node is used as a main component. It ends with
`actual N / expected 0` and a verdict per node:

- `PHASE 59 TRANSIENT DEBRIS` — `aboxCurrentAppOwner = "Phase59"`, or an unstamped
  FRAME/TEXT whose name matches a Phase 59 naming prefix (`desktop/`, `mobile/`,
  `section/`, `prototype-control`, `prototype-controls`, `route-local-content`,
  `component-instances`, `pattern-instances`, `item-`, `row`, `title`, `route-label`,
  `page-title`, `runtime-boundaries`, `control-label`, `section-grid`), with zero live
  instances and no component identity.
- `B7 REGION ORPHAN` — already covered by the existing B7 inspector/cleanup.
- `UNIDENTIFIED — DO NOT REMOVE` — anything else.

Removal is a **separate, explicitly invoked** command that deletes only nodes the inspector
verdicted as Phase 59 debris, printing each removal. Nothing is auto-deleted, nothing is
overwritten, and `UNIDENTIFIED` nodes always require your decision.

## Code changes (minimal, no redesign)

All in `tools/figma-plugin/`:

1. **`plugin.js` — pin the working page.** In `ensureCurrentApp`, after `currentAppPage(true)`
   resolves, `await figma.setCurrentPageAsync(page)` so all transient creation lands on
   `07 Current App`, never on a protected page. Restore nothing else.
2. **`plugin.js` — `currentAppGuarded` transient sweep.** Snapshot
   `figma.currentPage.children` ids before `fn()` (same pattern as `b7Guarded`); on failure,
   remove new non-COMPONENT/COMPONENT_SET strays left on the active page when it is not the
   `07 Current App` page, logging each. This closes the debris leak at source.
3. **`plugin.js` — pre-write diagnostic.** `currentAppAssertProtected()` gains a reporting
   path: on mismatch it prints, before throwing, the page name, `expected` vs `actual`, and
   every top-level node as `name [TYPE] id=… owner=…`, then throws the same STOP message with
   `(expected 0, actual N)` appended. Preflight also prints a one-line protected-page census
   (`page : n node(s)`) on every run, pass or fail.
4. **`plugin.js` — inspector + guarded cleanup functions** and their `current-app-inspect-foundations`
   / `current-app-cleanup-foundations` message handlers.
5. **`ui.html`** — two buttons: "Inspect 00 Foundations (read-only)" and
   "Remove Phase 59 debris on 00 Foundations".
6. **`build.mjs` output** — rebuild `code.js` from source; the bundle is never hand-edited.
7. **`README.md` / `roadmap.md`** — record the root cause and the new commands.

Nothing else changes. The assertion, expected counts, duplicate-name identity fix,
`h: height` mobile fix, preflight, dependency validation, guarded rollback, stable identity and
idempotency all stay exactly as they are.

## How the B0 zero baseline stays protected

`expected["00 Foundations"] = 0` is unchanged, still checked in preflight before any write and
again in verify. A run cannot proceed while the page holds any node; the only difference is
that you now see exactly which nodes block it. Cleanup is manual, evidence-gated, and limited
to nodes proven to be Phase 59 debris.

## Offline verification (before the next Figma attempt)

- `node --check` on `plugin.js` and the rebuilt `code.js`.
- `check-globals.mjs` free-identifier scan over the rebuilt bundle.
- `check-current-app-mobile.mjs` — all 87 companions still build.
- Re-run `extract-current-app.mjs`: 12 groups / 179 desktop screens / 87 mobile companions /
  682 Category-A / 135 B / 102 C / 3 D, zero duplicate keys and names.
- A new stub-based test for `currentAppGuarded` asserting that a stray created on a simulated
  active page during a failing run is removed, and that nodes present before the run are not.
- App build check; no `src/**` diff.

## Expected behavior on the next Figma Desktop run

1. "Inspect 00 Foundations (read-only)" — reports actual vs expected 0 and a verdict per node.
2. If and only if every node is verdicted Phase 59 debris, run the removal command and
   re-inspect until the page reports 0.
3. "Create Current App" — preflight passes, the page is pinned, 12 groups / 179 screens /
   87 companions / 682 reactions are created.
4. "Verify Current App", then "Create Current App" again — second create must report zero new
   groups, screens, descendants and reactions — then "Verify Current App".
5. If the inspector reports any `UNIDENTIFIED` node, the run stops and you are asked before
   anything is touched.

## Confirmations

- No `src/**`, route, backend, migration or application-behavior changes.
- No new variables, styles, components, component sets, variants, properties, patterns or shells.
- No B0–B10 Figma object is modified by this fix; no Figma mutation occurs as part of
  implementing it.
