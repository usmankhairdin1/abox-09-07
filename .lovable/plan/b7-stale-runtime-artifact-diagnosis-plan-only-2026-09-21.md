# B7 — stale runtime artifact diagnosis (PLAN ONLY)

## Finding: the repository artifact is already correct

A full audit of `tools/figma-plugin/**` was performed before writing this plan.

- The literal string `ABox/Semantic/sidebar-border` (and the `-foreground` / `-accent` hyphen forms as **style names**) occurs **zero times** in the whole plugin directory. The only hyphenated `sidebar-*` matches are CSS custom-property names inside token metadata strings (`--sidebar-border: oklch(...)` in `tokens-b1.js`, `tokens-b3.js` and their copies in `code.js`) — those are documentation of the source CSS, never passed to the style lookup.
- `plugin.js` lines 4015, 4018, 4024, 4025, 4026 all use the approved slash names: `ABox/Semantic/sidebar/border`, `ABox/Semantic/sidebar/foreground`, `ABox/Semantic/sidebar/accent`.
- The generated `code.js` carries the same corrected lines at 46012, 46015, 46021, 46022, 46023 — so `build.mjs` was run after the fix and the bundle is in sync.
- `build.mjs` is a plain concatenation of `tokens.js` + `tokens-b1..b10.js` + `plugin.js` into `code.js`. It copies, bundles, transforms or embeds no other source file, and there is no second/alternate plugin source in the directory.
- `manifest.json` points at `"main": "code.js"` and `"ui": "ui.html"` in the same folder — no alternate entry point, no build directory, no minified variant.

**Root cause: no source or build defect exists. The corrected bundle never reached the copy of the plugin that Figma is executing.** Figma Desktop loads a development plugin from a manifest path on the local machine, and Lovable's edits live in this sandboxed repository — they do not propagate to that local folder. The run that failed executed an older local `code.js`.

There is a second, lesser possibility with the same remedy: the local folder was refreshed but Figma kept the previously compiled plugin in memory (the plugin was not reloaded, only re-opened).

## Correction required

No file in this repository requires a code change. Nothing is rebuilt for correctness; `code.js` is regenerated only as a proof step so the byte-for-byte artifact that must be copied out is known-current.

The action is a delivery/import correction on the user's machine:

1. Take the current `tools/figma-plugin/` contents (at minimum `code.js`, `manifest.json`, `ui.html`) from this project.
2. Overwrite the corresponding files in the local folder that Figma's manifest points to. Confirm the destination path is the same one registered in Figma (Plugins → Development → Manage plugins in development → the ABox Figma Proof entry).
3. In Figma Desktop, close the plugin, then Plugins → Development → **Reload** (or re-run from the manifest) so the new `code.js` is compiled, rather than only reopening the cached instance.

## Proof the runtime artifact is clean

Before re-running anything in Figma, prove the bundle is correct at both ends:

- In the repository: `rg -c 'ABox/Semantic/sidebar-border' tools/figma-plugin/` must report no matches; `rg -n 'Semantic/sidebar/(border|foreground|accent)' tools/figma-plugin/code.js` must show the five B7 call sites.
- On the local machine: run the same search against the local `code.js` Figma actually loads (or open it and search for `sidebar-border`). Zero matches there is the only evidence that settles this; a clean repository copy proves nothing about what Figma executes.
- Record the byte size / checksum of the repository `code.js` and confirm the local copy matches.

## Offline validation

```
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
rg -c 'ABox/Semantic/sidebar-border' tools/figma-plugin/   # expect: no matches
git diff --stat -- src/                                     # expect: empty
```

## Figma sequence after the local copy is confirmed current

1. Reload the development plugin (not just reopen).
2. Remove incomplete B7 shell nodes — expect `0 removed` (the rollback guard already cleared the partial Internal shell).
3. Create shells — expect 4 physical components, 1 set, 5 properties, no `STOP:` line.
4. Verify shells — expect `RESULT: B7 PASSED`.
5. Create shells again — expect `0 created`, identical ids.
6. B6 Verify plus the B1–B5 verifiers — all PASS, ids 2:611 / 2:554 / 2:587 / 2:612 / 2:630 unchanged.

If step 3 still prints `STOP: MISSING B3 PAINT STYLE — "ABox/Semantic/sidebar-border"` after a confirmed-clean local `code.js` and a genuine reload, the error is coming from a different registered manifest entry — list the development plugins in Figma and identify which folder the running entry points at before any further change.

## Out of scope

No `src/**` change, no Figma object created/renamed/deleted, no B0–B6 change, no change to the B7 inventory, structure, properties, rollback guard or verification contract, no weakening of the missing-style assertion, no B3 style recreation, no unrelated cleanup.
