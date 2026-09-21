# Phase 52 / Batch B0 — Current-Page / Stray-Page Removal Fix (PLAN ONLY)

Scope unchanged: create and order the seven library pages in `ABox Design System — Library`. No variables, text styles, effects, components, variants, or page content. No `src/**` or ABox production/reference changes.

## A. Confirmed root cause of the removal failure

Evidence from `tools/figma-plugin/plugin.js`:

- Line 373: the seven required pages are moved to indices 0..6 via `figma.root.insertChild(index, page)`.
- Lines 375-383: every page not in the required list is treated as a stray; if it has no children it is removed with `stray.remove()`.
- Nothing anywhere in `ensureLibraryPages()` changes the active page.

The file was created fresh, so Figma's default `Page 1` is the active page when the plugin runs. The Figma Plugin API rejects `remove()` on the currently active page — the log shows the `page removed : Page 1 (empty default page)` line printing first (it is emitted before the call) and the API error `in remove: Removing this node is not allowed` immediately after. That is the exact and only failure: the stray being removed is the current page.

The earlier `loadAllPagesAsync()` fix was still necessary (line 377 reads `stray.children`) and stays in place; it simply exposed this second, separate defect.

## B. `00 Foundations` discrepancy — explanation and how it will be confirmed

The removal error is thrown from inside `ensureLibraryPages()`, so execution jumps straight to the catch handler at line 500. The `PAGE INVENTORY` block (lines 385-389) and `verifyLibraryPages()` never run. So the run produced no independent evidence of what the page list actually contained — the only signal was `page reused : 00 Foundations`, which proves the name matched but not its final index or state.

Most likely reading: `00 Foundations` does exist and sits at index 0, while the Figma Pages panel kept `Page 1` visible and selected as the active page; a panel that is scrolled or collapsed around the active page can make index 0 easy to miss. This is treated as unconfirmed. The correction adds a diagnostic inventory printed *before* any removal attempt, listing every page with index, name and id. The next run therefore answers the question with evidence rather than inference, and distinguishes the four possibilities named in the request: ordering/index, page-reference/current-page, UI/display, or genuine page-state inconsistency.

## C. Minimum exact code changes

All in `tools/figma-plugin/plugin.js`, inside `ensureLibraryPages()`. No other file or function changes.

1. After the resolve/reorder step (line 373) and before stray handling, print a pre-removal inventory:
   `PAGE INVENTORY (before stray removal)` followed by `[index] name id=…` for every `figma.root.children` entry.
2. Before the stray loop, make a required page current so no required page is ever a removal target and the active page can never be a stray:
   `await figma.setCurrentPageAsync(resolved[0]);` (i.e. `00 Foundations`), guarded so it only runs when the current page is not already one of the seven required pages.
3. In the stray loop, keep the existing emptiness test exactly as-is, and only log `page removed` *after* `stray.remove()` returns, so the log can never claim a removal that did not happen.
4. Keep the non-empty branch byte-identical: a stray with any children is still reported as `UNEXPECTED PAGE … (not empty — left untouched)` and left in place. The protection is not weakened in any way.

Then regenerate `tools/figma-plugin/code.js` with `node build.mjs` — the generated file is never hand-edited.

Unchanged: page names and order, duplicate-page protection (throws on two pages with the same name), file-isolation guard `requireFile(T.library.targetFileName)`, idempotent reuse-by-name, and the B0 no-content rule.

## D. Run 1 / Run 2 validation sequence

Run 1 — in Figma Desktop, re-import the plugin from `tools/figma-plugin/manifest.json`, open `ABox Design System — Library`, click **Create library pages**:
- file-name guard passes, all pages loaded
- seven `page created` / `page reused` lines
- pre-removal inventory printed
- active page switched to `00 Foundations`
- empty `Page 1` removed, logged after the fact
- final `PAGE INVENTORY` with seven entries at indices 0..6 and their ids
- `RESULT: B0 PASSED`

Run 2 — click **Create library pages** again in the same file:
- all seven lines read `page reused`
- no strays remain, nothing removed
- inventory ids identical to Run 1, same order
- `RESULT: B0 PASSED`

Optional third step: **Verify library pages** alone must also report `RESULT: B0 PASSED` without creating or removing anything.

## E. Success criteria for `RESULT: B0 PASSED`

`verifyLibraryPages()` passes independently when all of these hold:
1. file name is exactly `ABox Design System — Library`
2. each of the seven names exists exactly once
3. every one is a native `PAGE` node
4. they occupy indices 0..6 in the declared order: 00 Foundations, 01 Components, 02 Patterns, 03 Shells, 04 Experiences, 05 Screens, 06 Documentation
5. no unexpected extra pages remain
6. no page content was created by B0

Any single FAIL yields `RESULT: B0 FAILED`.

## F. FINAL REPORT evidence required

- Verbatim complete plugin output for Run 1 and Run 2
- Pre-removal inventory from Run 1 (this settles the `00 Foundations` question)
- Final page inventory with ids for both runs, shown to be identical
- Confirmation `Page 1` was removed and no other page was touched
- Confirmation no non-empty stray was deleted (or that none existed)
- Confirmation both runs report `RESULT: B0 PASSED`
- A screenshot or listing of the Figma Pages panel showing the seven pages in order
- Any deviation recorded verbatim

## G. Scope confirmation

No B1 (Variables), B2 (Typography), B3 (Foundational Styles) or later batch work is included. No library publishing. No ABox application, reference-layer, route, token, branding or governance file is modified — only `tools/figma-plugin/plugin.js` and the regenerated `code.js`.
