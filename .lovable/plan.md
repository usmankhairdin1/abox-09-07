# Phase 58 — B4 second diagnostic (PLAN ONLY)

## Finding: the repository source and bundle are already corrected

Audit performed before writing this plan:

- `rg` over `tools/figma-plugin/plugin.js` and `tools/figma-plugin/code.js` finds **zero** occurrences of the old label `pages 00, 03, 04, 05, 06 remain empty (02 Patterns is B6-owned)` and **zero** occurrences of the stale `others.every((p) => p.children.length === 0)` construct in `verifyB4()`.
- `verifyB4()` begins at `plugin.js:1974`. The page block now sits at `plugin.js:2128–2143` and reads:
  - `const others = figma.root.children.filter((p) => p.name !== B4_PAGE);`
  - `const approvedTopLevelB4 = aboxApprovedPageTopLevel();`
  - per page, per top-level child: anything not in that page's approved map increments `unexpectedOtherPages` and is pushed into `pageEvidence` as `page › name (type) id=…`
  - assertion label: `pages 00, 02–06 hold only their approved B6–B10 inventory (00 Foundations must stay empty)`
- The generated bundle carries the same corrected line at `code.js:44139`.
- Re-running `node tools/figma-plugin/build.mjs` reproduces the identical artifact: 2,039,616 bytes, md5 `a810ee81a3d1b980836a57a58e2e5eb9`. The bundle is in sync with the source; `build.mjs` is a plain concatenation with no alternate entry point, and `manifest.json` points at `code.js` in the same folder.

The remaining `children.length === 0` matches in the file belong to other functions (orphan-page cleanup at 391, B6 writable-page guard at 3682, B9 at 5974–5975, B10 at 6418) and are outside B4's scope.

**Root cause: no source or build defect exists.** The Figma run that printed the old label executed an older local `code.js`. Figma Desktop loads a development plugin from a folder on the local machine; edits made here do not propagate to it. A second, lesser possibility with the same remedy: the folder was refreshed but Figma kept the previously compiled plugin in memory (re-opened rather than reloaded).

## Correction required

No file in this repository requires a code change. The corrected assertion is already the only one present. The action is a delivery/reload correction on the local machine:

1. Copy `tools/figma-plugin/code.js` (plus `manifest.json`, `ui.html` if they differ) from this project over the local folder registered in Figma (Plugins → Development → Manage plugins in development → the ABox entry — confirm the path is the same one).
2. In Figma Desktop, close the plugin, then Plugins → Development → **Reload** so the new `code.js` is recompiled; reopening a cached instance is not sufficient.

## Proof before re-running

- Local copy must report md5 `a810ee81a3d1b980836a57a58e2e5eb9` and 2,039,616 bytes.
- Searching the local `code.js` for `remain empty (02 Patterns is B6-owned)` must return zero matches; searching for `hold only their approved B6–B10 inventory` must return one.
- If the old label still prints after a confirmed-matching local file and a genuine reload, a different registered manifest entry is running — list the development plugins and identify which folder the running entry points at before any further change.

## Expected B4 behaviour after the reload

- `00 Foundations` → approved list empty, so it must still hold zero top-level nodes.
- `02 Patterns` → exactly the approved B6 top-level inventory (3 objects).
- `03 Shells` → approved B7 inventory (3). `04 Experiences` → B8 (5). `05 Screens` → B9 (179). `06 Documentation` → B10 (10).
- `01 Components` → unchanged exact 14-object B4/B5 contract, checked by the untouched block at `plugin.js:2145–2153`.
- Any stray or renamed top-level node on any page still FAILs and is printed with page, name, type and id. No generic allowance.
- All B4 component, binding, source-mapping, exclusion and B0–B3 preservation checks are unchanged; expected result `B4 PASSED`.

## Guarantees

Verification/evidence logic only. Zero Figma objects created, modified or deleted. No publishing. No `src/**` changes. No B11. B4's 14-object inventory contract and all B1–B10 creation contracts untouched.
