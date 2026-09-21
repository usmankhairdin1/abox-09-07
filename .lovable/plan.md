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
- 1 native StatusBadge COMPONENT_SET.
- Exactly 2 native variant COMPONENT nodes inside that component set.
- Exactly 1 variant property named `tone`.
- Exactly 2 real tone values taken from the production StatusBadge source.
- 1 editable text child per variant component as appropriate to the existing plugin implementation.
- No IMAGE fills and no flattened substitutes.

Evidence per object: the object exists in the Figma file and is editable (variable appears in the Variables panel; text style in the Text Styles panel; component set is a real COMPONENT_SET node on canvas containing two COMPONENT variant children, not an image or flattened group).

Distinguish these structural counts separately in the report:
1. component-set count = 1
2. variant-component count = 2
3. variant-property count = 1
4. variant-value count = 2

### Step 4 — Structural self-check
The plugin's built-in structural self-check must pass every required native-object check:
- variable is a native VARIABLE
- style is a native TEXT style
- component set is a native COMPONENT_SET
- both variants are native COMPONENT nodes inside the set
- the set exposes exactly one variant property named `tone`
- that property exposes exactly two real tone values from the production StatusBadge source
- each variant contains an editable text child as appropriate to the plugin implementation
- there are no flattened image-based substitutes (no rectangle-with-image-fill stand-ins, no IMAGE fills).

### Step 5 — Result gate
The plugin output must report `PROOF PASSED`. Any other result = gate not passed; record the failure message verbatim and stop.

### Step 6 — Determinism / re-run
Run the plugin a second time in the same file. Verify it updates the existing variable, text style, component set, variant components, and variant property in place rather than creating duplicates. Evidence after run 2 must show unchanged structural counts:
- 1 Color Variable
- 1 Text Style
- 1 StatusBadge COMPONENT_SET
- 2 variant COMPONENT nodes inside that set
- 1 `tone` variant property
- 2 tone values
- 0 additional component sets, 0 additional variant components, 0 additional properties, 0 additional variables, 0 additional text styles.

### Step 7 — Library publishing availability (non-blocking)
Record whether the user can publish a library on the target team (Team/Org permission) as either `permitted` or `unavailable`. This is recorded for Batch 0 planning only and does not block the proof.

### Step 8 — Final report
Before Phase 52A can be marked COMPLETE, the user must return a FINAL REPORT containing:
1. Confirmation the file `ABox Proof — Scratch` exists with edit access.
2. Confirmation Inter Tight loaded (no font-substitution halt).
3. The plugin's verbatim output, including the `PROOF PASSED` line and the structural self-check results.
4. Object inventory after run 1: names/IDs of the 1 variable, 1 text style, 1 StatusBadge COMPONENT_SET, the 2 variant COMPONENT nodes inside it, the 1 `tone` variant property, and its 2 real tone values.
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
