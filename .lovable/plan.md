# Phase 52 / Batch B0 — Verification Bug Fix (Page Loading)

Plan only. Nothing is implemented in this phase. The ABox application, `src/**`, reference layer, routes, tokens, branding, governance files, and all later Phase 52 batches are untouched. Only `tools/figma-plugin/` (the standalone desktop plugin, not part of the app) is in scope for the eventual approved fix.

## Root cause (confirmed by source inspection)

`tools/figma-plugin/manifest.json` declares `"documentAccess": "dynamic-page"`. Under dynamic-page document access, a page's `children` may only be read after `await page.loadAsync()` (or after `figma.loadAllPagesAsync()`). Two call sites violate this:

1. **`ensureLibraryPages()` — `plugin.js` line 375**: `stray.children.length === 0` is read to decide whether an unexpected page is an empty default page that may be removed. `ensureLibraryPages()` is synchronous and never loads any page. On the B0 run, the default "Page 1" of a fresh file is exactly such an unloaded stray, so this read throws the reported error. Because the throw happens after page creation, the pages exist but the run reports `RESULT: B0 FAILED`.
2. **`verifyLibraryPages()` — `plugin.js` lines 438–444**: the per-page loop does `await page.loadAsync()` before reading `page.children` — this is correct in isolation, but the crash at site 1 (and any future unloaded-page access, e.g. a stray page left by the user) means verification is reached only when creation did not already throw. The error message quoted in the failure report ("Cannot access property 'children' on a page that has not been explicitly loaded") is consistent with site 1 firing inside the run, after which `verifyLibraryPages()` output is never produced or is produced only partially.

`figma.root.children` (page list, names, ids, ordering) does NOT require page loading and is unaffected; name/order/duplicate checks are already safe.

## Minimum safe fix

Two changes in `tools/figma-plugin/plugin.js` (source of truth; `code.js` is regenerated, never hand-edited):

1. Make `ensureLibraryPages()` async and add `await figma.loadAllPagesAsync()` as its first statement, before any page `children` access (specifically before the stray-page emptiness check at current line 375). `loadAllPagesAsync()` is the Figma-documented way to satisfy dynamic-page access for all pages at once; the file contains at most a handful of empty pages at this stage, so the load cost is negligible.
2. In `verifyLibraryPages()`, add `await figma.loadAllPagesAsync()` at the top and drop the now-redundant per-page `await page.loadAsync()` inside the loop (keeping it would also be correct, but removing it makes the single loading point explicit and matches the helper). All subsequent `page.children` / `page.findAll(...)` reads are then legal.
3. Update the `b0-run` entry call from `ensureLibraryPages();` to `await ensureLibraryPages();`.

No other logic changes: page names, exact order, duplicate detection (`STOP: DUPLICATE PAGE`), stray handling, `figma.root.insertChild` reordering, page inventory output, the structural checks, and the `RESULT: B0 PASSED / B0 FAILED` verdict remain exactly as they are.

## What the fix must preserve

- The exact seven-page creation/reuse logic, names, and order (`T.library.pages` 00–06).
- Duplicate-page stop and non-empty stray protection (page left untouched, reported, never guessed at).
- Idempotency: run 2 reuses the same page ids; nothing is recreated.
- The file-isolation guard `requireFile(T.library.targetFileName)` — B0 can only run in `ABox Design System — Library`; the proof file `ABox Proof — Scratch` is never touched.
- Verification creates nothing: no variables, text styles, effect styles, components, variants, or page content. Pages remain empty by design.
- The existing Phase 52A proof actions (`run` / `verify`) are not modified.

## Verification coverage after the fix

`verifyLibraryPages()` must be able to confirm, in one pass:

- exactly the 7 required pages exist
- exact declared order at indices 0..6
- exactly one page per name
- no unexpected extra pages
- B0 created zero local variable collections, text styles, and effect styles
- zero COMPONENT / COMPONENT_SET nodes in the file
- zero IMAGE fills anywhere (nothing flattened)
- run 1 reports `RESULT: B0 PASSED` after successful creation
- run 2 reports `RESULT: B0 PASSED` while reusing the same page ids

## Implementation steps (when approved)

1. Edit `tools/figma-plugin/plugin.js` as described above (3 small changes).
2. Regenerate `code.js` with the existing build: `node tools/figma-plugin/build.mjs`. Never hand-edit `code.js`.
3. Confirm the generated `code.js` contains both `loadAllPagesAsync()` calls and the awaited `ensureLibraryPages()` entry call.
4. Update `tools/figma-plugin/README.md` B0 section to note the dynamic-page loading requirement.
5. Confirm the ABox app is untouched: `git status` shows changes only under `tools/figma-plugin/`; no `src/**` diff.
6. User re-imports the plugin in Figma Desktop from `tools/figma-plugin/manifest.json` (Figma reloads development plugins from disk; re-import guarantees the new build) and re-runs B0.

## FINAL REPORT evidence required after execution

- Verbatim plugin output for run 1: seven `page created`/`page reused` lines, the `PAGE INVENTORY` block with page ids at indices 0..6, all `PASS` structural checks, `RESULT: B0 PASSED`.
- Verbatim plugin output for run 2: seven `page reused` lines, identical page ids, `RESULT: B0 PASSED` (idempotent, no duplicates).
- Explicit confirmation that the file-isolation guard still names `ABox Design System — Library`.
- Explicit confirmation that no variables, text styles, components, variants, or page content were created (from the verifier's own local-object and component counts).
- Any failure recorded verbatim, with the batch left OPEN — do not proceed to B1 on anything other than two passing runs.
