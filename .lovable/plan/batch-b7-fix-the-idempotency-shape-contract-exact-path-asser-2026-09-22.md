# Batch B7 — fix the idempotency shape contract (exact-path assertion)

## Root cause (confirmed in code)

`b7NodePaths(root)` (plugin.js:3973) records each descendant as a full path
relative to the shell root, e.g. `workspace-column/top-bar`.
`b7HasRequiredShape(root, expectedNames)` (plugin.js:3995-3998) extracts those
paths and requires each expected entry to match one of them **exactly**
(`names.indexOf(n) !== -1`).

The live, approved `ABox/Shell/Internal` (id 10:58) has `desktop-rail` as a
direct child and the other four regions nested under `workspace-column/`.
So the live paths are:

```text
desktop-rail
workspace-column/top-bar
workspace-column/page-header
workspace-column/content-region — shell placeholder
workspace-column/assistant-launcher-region
```

but `b7EnsureStandalone` (plugin.js:4247-4250) expects the bare names
`top-bar`, `page-header`, … — four exact misses, hence the false
`STOP: LIVE SHELL DIFFERS FROM THE APPROVED DEFINITION`.
This matches the completed read-only diagnosis exactly: verifier/contract
defect, not a construction defect.

## Minimal correction — exact-path contract, no matching loosening

Add one new helper beside `b7ExpectedRegions` (plugin.js:4266), which is NOT
modified:

```text
b7ExpectedPaths(name) — approved exact descendant paths per shell:
  ABox/Shell/Internal:
    desktop-rail
    workspace-column/top-bar
    workspace-column/page-header
    workspace-column/content-region — shell placeholder
    workspace-column/assistant-launcher-region
  ABox/Shell/Member:    (unchanged, all direct children)
    header-pill, member-body, member-nav,
    content-region — shell placeholder, assistant-launcher-region
  variant=flow:         (unchanged, all direct)
    header-pill, product-switcher-region,
    content-region — shell placeholder, footer-plate,
    assistant-launcher-region
  variant=landing:      (unchanged, all direct)
    header-pill, content-region — shell placeholder, footer-plate,
    assistant-launcher-region
  otherwise: null
```

`b7HasRequiredShape` itself is **unchanged** — it already does exact equality
on full paths; only the expected inputs become path-accurate. No substring or
leaf matching is introduced anywhere.

Callers switch from region names to the exact paths (4 sites):

1. `b7EnsureStandalone` (plugin.js:4247-4250): expected list replaced by
   `b7ExpectedPaths(shell.name)` — this is the assertion that fired.
2. Marketplace variant check (plugin.js:4205-4208): expected lists replaced by
   `b7ExpectedPaths("variant=flow")` / `b7ExpectedPaths("variant=landing")`.
   These equal the current direct-child names, so behaviour there is identical.
3. `b7CleanupIncompleteShells` (plugin.js:4327-4334): uses `b7ExpectedPaths`
   for the completeness check so a complete nested Internal is never a
   deletion candidate (KEPT), and a genuinely incomplete shell still fails the
   exact-path check and remains removable under the existing zero-instances
   guard.
4. `b7DiagnoseShell` shape-verdict section (plugin.js:4522-4530): expected
   display uses `b7ExpectedPaths` so future diagnosis prints the same contract
   the assertion enforces.

`b7ExpectedRegions` and all its other uses stay exactly as they are
(rollback name guard plugin.js:4300, region-key map at 4358, orphan-name
guard at 4456): those operate on top-level node names and region keys, where
the bare region names remain correct.

## What does NOT change

- `verifyB7()` — untouched; it already passes and checks regions through its
  own per-region lookups.
- B7 builders, construction geometry, properties, variants, rollback guard,
  orphan/Foundations cleanup, component definitions.
- `tokens-b7.js`, `ui.html` (no new button needed), `src/**`.
- No Figma object is created, moved, renamed, rebuilt, deleted or overwritten.
- IDs preserved: Internal 10:58, flow 10:113, landing 10:188, Member 10:242.

## Protection against incomplete shells (preserved)

The assertion remains exact-match on full approved paths. A shell missing any
of the five approved regions — at any position — still fails
`b7HasRequiredShape`, `b7EnsureStandalone` still throws the same STOP without
overwriting, and cleanup still only removes provably incomplete, zero-instance
nodes.

## Validation

Offline (no Figma execution):

```text
node --check tools/figma-plugin/plugin.js
node tools/figma-plugin/build.mjs
node --check tools/figma-plugin/code.js
git diff --stat -- src/        (must be empty)
```

Then in Figma (user-run): copy the rebuilt `code.js`/`ui.html` into the local
plugin folder, reload the development plugin, and run:
**Create shells** → expected: Internal/Marketplace/Member all resolve live,
"created 0", no STOP; then **Verify shells** → B7 PASSED; then B6 Verify and
the B1–B5 verifiers unchanged.

No Figma mutation occurs during implementation or offline validation.
