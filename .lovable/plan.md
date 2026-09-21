# ABox — Phase 52A Font Resolution Audit & Correction Plan — PLAN ONLY

## Status

**Phase 52 remains BLOCKED.** The native proof stopped before StatusBadge component/variant creation because Figma rejected the requested Inter Tight 600-weight font tuple. No proof pass may be claimed until the exact native font resolves and the complete proof is rerun.

## A. Evidence found in production typography source

1. `src/styles.css:27` defines the production sans stack as `"Inter Tight", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` through `--font-sans`.
2. `src/styles.css:243–245` applies that sans stack to the root `html` element. No root/body weight is declared, so normal body text resolves to the browser default **400 / Regular**.
3. `src/routes/__root.tsx:96–101` requests Inter Tight weights **400, 500, 600 and 700** from Google Fonts. This confirms 600 is an intentional production font weight.
4. `src/components/abox/status-badge.tsx:13–19` inherits the sans family and applies `font-semibold`; Tailwind’s production meaning here is **font-weight: 600**.
5. Therefore the proof contains two distinct, exact production typography requirements:
   - `ABox/Body/Base`: family **Inter Tight**, weight **400**, normal/upright style.
   - StatusBadge labels: family **Inter Tight**, weight **600**, normal/upright style.
6. The production source specifies CSS family and numeric weight. It does **not** prescribe Figma’s platform-specific named-style spelling (`Semi Bold`, `SemiBold`, or another exposed identifier).

## B. Evidence found in plugin font-resolution code

1. `tools/figma-plugin/tokens.js:30–39` maps the body text style to `{ family: "Inter Tight", style: "Regular" }`.
2. `tools/figma-plugin/tokens.js:53–59` maps StatusBadge text to `{ family: "Inter Tight", style: "Semi Bold" }`, derived from `font-semibold`.
3. `tools/figma-plugin/plugin.js:42–49` calls `figma.loadFontAsync({ family, style })`. The family and style are already passed as separate properties; the plugin is **not** passing `"Inter Tight Semi Bold"` as one family name.
4. The displayed failure text concatenates the two fields only for human-readable reporting. It does not reflect the shape sent to Figma.
5. `ensureTextStyle()` loads `Inter Tight` / `Regular` before `ensureComponentSet()` requests `Inter Tight` / `Semi Bold`. The reported failure at `Semi Bold` therefore isolates the failure to the badge’s 600-weight request, not the body role.
6. The current validator catches the Figma exception and replaces it with a generic message. It does not call `figma.listAvailableFontsAsync()`, does not report the exact available Inter Tight style names, does not inspect variable-font axes, and therefore cannot distinguish an unavailable named style from a naming mismatch.
7. Figma’s API requires an accessible editor font and accepts `family` and `style` separately; current APIs also support variable-font `variationSettings`. A plugin cannot download an unavailable font through `loadFontAsync()`.

## C. Exact root cause of the failure

The confirmed root cause is an **exact Figma font-resolution mismatch for the StatusBadge’s 600 weight**:

- Production requires Inter Tight at numeric weight 600.
- The plugin hard-codes the Figma named-style string `Semi Bold`.
- The active Figma environment does not expose an accessible font matching the exact tuple `{ family: "Inter Tight", style: "Semi Bold" }`.

This is **not** a family/style concatenation bug: the plugin passes two separate fields correctly. It is also **not** a body-role mapping error: body is correctly mapped to Inter Tight Regular and the run advanced beyond that load.

The current evidence cannot safely choose between the two remaining concrete sub-causes:

1. Figma exposes Inter Tight 600 under a different exact style identifier, such as `SemiBold`; or
2. the accessible Inter Tight resource is variable and expects weight 600 through a `wght` variation axis rather than the hard-coded named instance.

A genuinely missing 600 face remains possible, but the current generic catch block suppresses the available-font evidence needed to distinguish it. No spelling change may be guessed.

## D. Can the existing plugin represent the production font exactly?

- **Body role:** Yes, already represented natively as Inter Tight Regular, 16 px, 150% line height and 0% letter spacing.
- **StatusBadge 600 role:** The Figma Plugin API can represent it natively if the active editor exposes either an exact 600 named instance or an Inter Tight variable font with a `wght` axis accepting 600.
- **Current implementation:** Not yet proven capable in the active environment because it assumes one named-style spelling and does not discover or verify the available native font identity.
- **Stopping rule:** If neither an exact native 600 instance nor a `wght: 600` variable-font representation is available, stop. Do not substitute a font, map to 500/700, change production, or continue to component creation.

## E. Minimum correction plan

No correction is made during this plan-only task. After separate approval:

1. **Add read-only font discovery before any proof object is created.** Call `figma.listAvailableFontsAsync()`, filter by exact family `Inter Tight`, and record only the available style names. Also inspect `figma.getFontFamilyVariationAxes("Inter Tight")` where supported.
2. **Resolve by production semantics, not guessed spelling.** Select exactly one of these paths:
   - **Named-instance path:** use the exact Figma-reported Inter Tight style whose native weight is 600.
   - **Variable-font path:** load Inter Tight and assign a native `FontNameInput` with `variationSettings: { wght: 600 }`, preserving normal/upright styling, only when Figma reports a `wght` axis.
3. **Fail closed on ambiguity.** If the plugin cannot prove that the selected native representation is weight 600, report the discovered family/styles/axes and stop before `ensureComponentSet()`.
4. **Preserve body mapping.** Keep `ABox/Body/Base` at Inter Tight 400/Regular. Do not alter production typography or broaden the proof.
5. **Improve the failure report only as needed.** Report the requested family, required numeric weight, discovered styles/axes and underlying Figma error without combining family and style into an ambiguous pseudo-name.
6. **Regenerate only the plugin entry artifact** from the corrected `tokens.js` / `plugin.js` using the existing build script. Do not edit generated `code.js` directly.
7. **Do not change proof scope.** The corrected run must still create only the approved variable, body text style, StatusBadge component set and its two tone variants.

Expected implementation scope, only after approval: `tools/figma-plugin/tokens.js` and/or `tools/figma-plugin/plugin.js`, generated `tools/figma-plugin/code.js`, and the plugin README only if its exact prerequisite wording must reflect the verified Figma identifier. No `src/**`, reference, route, token, branding, governance or production UI file changes.

## F. Exact validation criteria after correction

The correction passes only when all of the following are evidenced in `ABox Proof — Scratch`:

1. Font discovery reports exact family `Inter Tight` and identifies a native route to weight 600.
2. Body font resolves as Inter Tight, normal/upright, weight 400; `ABox/Body/Base` remains native and editable.
3. Each StatusBadge label resolves as Inter Tight, normal/upright, **weight 600** through either the verified named instance or `wght: 600`—never an inferred visual match.
4. Read-back from each created text node confirms `fontName.family === "Inter Tight"`; its exact style and, for a variable font, `variationSettings.wght === 600`, match the resolved path.
5. No fallback family, substitution, missing-font state, 500/700 approximation or bypass is present.
6. Font validation completes before StatusBadge component/variant creation; any unresolved font stops the run.
7. The complete structural proof then passes unchanged: 1 Color Variable, 1 Text Style, 1 native `ABox/StatusBadge` COMPONENT_SET, exactly 2 native variant COMPONENT children, exactly 1 `tone` property, exactly 2 production tone values, editable text children, and zero IMAGE fills/flattened substitutes.
8. The plugin reports `RESULT: PROOF PASSED`.
9. A second run preserves the same counts and font read-back, with no duplicate variable, text style, component set, variant component or property.
10. The final report includes the discovered Inter Tight styles/axes, selected 600 representation, text-node read-back, complete structural self-check, first/second-run inventories and verbatim final result.

## G. Blocking statement

Phase 52A remains incomplete and Phase 52 remains blocked until the exact Inter Tight 600 native representation is discovered in the active Figma environment, applied without substitution, read back from the generated text nodes, and the full native-object proof—including idempotent rerun—reports `PROOF PASSED`.

## Plan-mode preservation

No ABox application, plugin, Figma file, reference layer, route, token, branding or governance file is modified during this plan-only task. Only this plan record is written for review.
