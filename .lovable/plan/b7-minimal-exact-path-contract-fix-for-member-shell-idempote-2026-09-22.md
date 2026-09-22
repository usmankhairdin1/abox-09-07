# B7 — Minimal exact-path contract fix for Member shell idempotency

## Objective
Update only the `b7ExpectedPaths(name)` contract in `tools/figma-plugin/plugin.js` so the existing live `ABox/Shell/Member` shell is recognized as structurally complete during `Create shells` idempotency. Do not change the Member builder, any Figma nodes, or any other behavior.

## Current false-failure cause
- `b7ExpectedPaths("ABox/Shell/Member")` currently returns the flat region list:
  - `header-pill`
  - `member-body`
  - `member-nav`
  - `content-region — shell placeholder`
  - `assistant-launcher-region`
- `b7HasRequiredShape(root, expectedNames)` performs an exact equality check (`b7NodePaths(root).includes(expectedName)`) on full descendant paths relative to the shell root.
- The read-only Member diagnostic confirmed the live Member shell has the two regions nested under `member-body`:
  - `member-body/member-nav`
  - `member-body/content-region — shell placeholder`
- Because the expected names are root-level literals, the exact-match fails for those two paths, producing:  
  `STOP: LIVE SHELL DIFFERS FROM THE APPROVED DEFINITION — ABox/Shell/Member`.

## Proposed contract change
In `b7ExpectedPaths(name)`, change only the `ABox/Shell/Member` branch to return the approved exact descendant paths:

```text
header-pill
member-body
member-body/member-nav
member-body/content-region — shell placeholder
assistant-launcher-region
```

Keep the existing `ABox/Shell/Internal`, `variant=flow`, and `variant=landing` expectations unchanged.

## Scope
- **Allowed file:** `tools/figma-plugin/plugin.js`.
- **Function changed:** `b7ExpectedPaths(name)` — one branch only.
- **No call-site changes required:** all consumers (`b7EnsureStandalone`, Marketplace variant check, `b7CleanupIncompleteShells`, `b7DiagnoseShell`) already call `b7ExpectedPaths(...)` generically and will receive the corrected list automatically.
- **Explicitly unchanged:**
  - `b7HasRequiredShape()`
  - `b7ExpectedRegions()`
  - B7 builders/construction logic
  - `verifyB7()`
  - rollback/cleanup/orphan logic
  - component properties
  - existing Figma IDs/nodes
  - B0–B6 behavior
  - any `src/**` files

## Incomplete-shell protection
The exact-match contract remains strict. A Member shell missing any of the five approved exact paths will still fail idempotency, so genuinely incomplete shells are still rejected.

## Validation
After the edit:
1. `node --check tools/figma-plugin/plugin.js`
2. `node tools/figma-plugin/build.mjs`
3. `node --check tools/figma-plugin/code.js`
4. `git diff --stat -- src/` must be empty
5. Review `git diff` on the plugin files to confirm only the Member expected-path list changed — no builder/verify/cleanup logic.

## Figma mutation
No Figma objects are created, moved, renamed, deleted, overwritten, or otherwise modified during implementation or validation. The fix is purely the idempotency contract used on the next `Create shells` run.
