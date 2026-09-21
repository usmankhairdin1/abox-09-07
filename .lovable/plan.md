# ABox — Phase 52A: Native Figma Proof Execution — Verification Plan

## Purpose
Define the exact verification sequence to complete the Phase 52A proof gate using the already-built plugin in `tools/figma-plugin/`. No code changes, no Figma library generation, no Phase 52 work.

## Constraints
- No modification to the ABox app, reference layer, or the plugin itself.
- No Figma file is created or modified by this plan — execution is performed by the user in Figma Desktop.
- The proof is not assumed to have passed; completion requires returned evidence.
- PLAN ONLY.

## Verification sequence

### Step 1 — Environment prerequisites (user-side, in Figma Desktop)
1. Open Figma Desktop and create a new blank file named exactly `ABox Proof — Scratch`.
2. Confirm edit access: the file must be in a location where the user has can-edit permission (a personal draft satisfies this). Evidence: user confirms they can add/edit objects in the file.
3. Confirm the Inter Tight font is available in Figma (Google Fonts are bundled in Figma Desktop; verify by creating a text node with font family "Inter Tight" — if the font is missing the plugin stops rather than substituting). Evidence: plugin does not halt on font load, or user confirms Inter Tight renders in the file.

### Step 2 — Plugin installation and run
1. In Figma Desktop: Plugins → Development → Import plugin from manifest → select `tools/figma-plugin/manifest.json`.
2. Run the plugin against `ABox Proof — Scratch` and click "Run proof".

### Step 3 — Native object assertions
The run must create exactly:
- 1 Color Variable (from `tokens.js` extraction source).
- 1 Text Style (Inter Tight).
- 1 native StatusBadge Component.
- 1 Variant property with exactly 2 real StatusBadge tone values (the approved tone variants — no invented options).

Evidence per object: the object exists in the Figma file and is editable (variable appears in the Variables panel; text style in the Text Styles panel; component is a real COMPONENT/COMPONENT_SET node on canvas, not an image).

### Step 4 — Structural self-check
The plugin's built-in structural self-check must pass every native-object check: variable is a native VARIABLE, style is a native TEXT style, component is a native component with variant properties — and it must confirm there are no flattened image-based substitutes (no rectangle-with-image-fill stand-ins).

### Step 5 — Result gate
The plugin output must report `PROOF PASSED`. Any other result = gate not passed; record the failure message verbatim and stop.

### Step 6 — Determinism / re-run
Run the plugin a second time in the same file. Verify it updates the existing variable, text style, and component in place rather than creating duplicates. Evidence: object counts remain exactly 1 variable / 1 text style / 1 component after the second run.

### Step 7 — Library publishing availability (non-blocking)
Record whether the user can publish a library on the target team (Team/Org permission) as either `permitted` or `unavailable`. This is recorded for Batch 0 planning only and does not block the proof.

### Step 8 — Final report
Before Phase 52A can be marked COMPLETE, the user must return a FINAL REPORT containing:
1. Confirmation the file `ABox Proof — Scratch` exists with edit access.
2. Confirmation Inter Tight loaded (no font-substitution halt).
3. The plugin's verbatim output, including the `PROOF PASSED` line and the structural self-check results.
4. Object inventory after run 1: names/IDs of the 1 variable, 1 text style, 1 component, and the variant property name with its 2 values.
5. Object inventory after run 2 confirming no duplicates (counts unchanged; update-in-place observed).
6. Explicit confirmation no flattened image-based objects were created.
7. Library-publishing availability: `permitted` or `unavailable`.
8. Any failure or deviation, recorded verbatim, if the gate did not pass.

## Out of scope
- Phase 52 library generation — not started.
- Figma library creation or publishing — not performed.
- Any change to the ABox application — none.

## Success condition
Phase 52A is COMPLETE only when all FINAL REPORT items above are returned and show: PROOF PASSED, all structural checks green, no duplicates on re-run, no image substitutes. Until then Phase 52A remains OPEN and Phase 52 remains blocked.

## Technical details
- Plugin source: `tools/figma-plugin/` (`manifest.json`, `plugin.js`, `tokens.js`, `ui.html`, `build.mjs`, `README.md`) — used as-is.
- The desktop-local Figma MCP connector remains read-only and is not a write path; it is not used for this proof.
- No ABox files are modified during this task; the only file written is this plan.
