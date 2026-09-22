# B7 — read-only diagnostic for the Member shell idempotency stop

Internal and both Marketplace variants now reuse correctly. Only
`ABox/Shell/Member` still trips `STOP: LIVE SHELL DIFFERS FROM THE APPROVED
DEFINITION`. This adds a read-only diagnostic for Member, built to the same
standard as the Internal one. Nothing in Figma is created, moved, renamed,
deleted or mutated.

## What is already known from the code

- `b7ExpectedPaths("ABox/Shell/Member")` (plugin.js:4287-4289) returns five
  flat paths: `header-pill`, `member-body`, `member-nav`,
  `content-region — shell placeholder`, `assistant-launcher-region`.
- `b7HasRequiredShape` (plugin.js:3995) does exact-path matching against
  `b7NodePaths`. Internal failed because its regions are nested under
  `workspace-column/`; Member may have the same class of nesting (e.g. regions
  living under `member-body/`), or a literal name difference. The diagnostic
  must establish which from live evidence — no assumption is encoded.

## Change (plugin-only)

1. **Generalize the existing Internal diagnostic.** Rename the body of
   `b7DiagnoseInternalShell()` (plugin.js:4515) to
   `b7DiagnoseShell(shellName)`, taking the shell name as its only parameter
   and replacing the hard-coded `"ABox/Shell/Internal"`, the header text and
   the approved-property lookup with values derived from that argument.
   `b7DiagnoseInternalShell()` remains as a one-line wrapper calling
   `b7DiagnoseShell("ABox/Shell/Internal")`, so the existing button and
   message type behave exactly as today.
2. **Add `b7DiagnoseMemberShell()`** — a one-line wrapper calling
   `b7DiagnoseShell("ABox/Shell/Member")`.
3. **Message routing:** add `b7-diagnose-member-shell` to the B7 message-type
   guard (plugin.js:6378) and a handler next to the Internal one
   (plugin.js:6546), both read-only.
4. **ui.html:** add button `b7diagnosemember` —
   "Diagnose B7 Member shell (read-only)" — next to the Internal button, with
   the matching `onclick` postMessage.

## What the diagnostic prints (all for Member)

- **Identity:** page inventory of `03 Shells`; node name/type/id; parent page;
  whether the parent is `03 Shells`; whether `b4FindComponent("ABox/Shell/Member")`
  resolves that same node.
- **Shape verdict** (the assertion that fired): the exact approved paths passed
  to `b7HasRequiredShape`, the complete live descendant path list, PRESENT or
  MISSING per expected path, and the first missing path.
- **Near-miss detection** for each missing path: case-insensitive and
  whitespace/dash-normalized comparison against every live path, listing likely
  candidates that differ from the expected literal (e.g. a nested
  `member-body/member-nav` where `member-nav` was expected).
- **Structural evidence** for the root and every relevant descendant: name,
  type, id, width/height, `layoutMode`/wrap, primary and counter axis sizing
  and alignment, padding, item and counter-axis spacing, corner radius, fills,
  strokes and effects with resolved style names from the live style index, raw
  paints, per-side stroke weights, `characters` for TEXT nodes,
  `componentPropertyReferences`, and for INSTANCE nodes the main component
  name and id via `getMainComponentAsync`.
- **Component properties:** live `componentPropertyDefinitions` (name, type,
  default, variant options) with the live node that references each property,
  compared against the approved Member definition in `tokens-b7.js`.
- **Exactly one classification line:** GENUINE CONSTRUCTION MISMATCH /
  EXPECTED/GENERATED VALUE MISMATCH / IDEMPOTENCY CONTRACT DEFECT, chosen the
  same way as the Internal diagnostic (approved region genuinely absent with no
  near-miss / region present under a different literal path / all paths present
  and the stop not reproducible from the live tree).

## Explicitly unchanged

`src/**`; B0–B6 artifacts; the B7 builders; `b7ExpectedPaths()`;
`b7HasRequiredShape()`; `verifyB7()`; the rollback, cleanup and orphan logic;
the Internal diagnostic's observable behaviour; every existing Figma object and
id (Internal 10:58, Marketplace flow 10:113, landing 10:188, Member 10:242).

## Validation

- `node --check tools/figma-plugin/plugin.js`
- `node tools/figma-plugin/build.mjs`
- `node --check tools/figma-plugin/code.js`
- `git diff --stat -- src/` — must be empty

No Figma run occurs during implementation. Afterwards you copy the rebuilt
`code.js` and `ui.html` to your local plugin folder, reload the development
plugin, and run only the new Member diagnostic button — no Create shells run is
requested.
