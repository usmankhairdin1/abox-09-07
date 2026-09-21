# Phase 52A — Figma Write-Path Enablement & Native Proof Setup (PLAN ONLY)

Goal: unblock Phase 52 by standing up a development Figma plugin that can create genuine native objects, and prove it with four objects. No library generation in this phase.

## 1. User-side prerequisites (Figma plugin path)

Mandatory, all performed by you in Figma:

1. **Figma Desktop app installed** — development plugins only run in the desktop app, not the browser.
2. **A Figma account with edit rights** on the team/file used for the proof. A Viewer seat cannot run a plugin that writes.
3. **Development plugin registered** — in Figma Desktop: Menu → Plugins → Development → Import plugin from manifest, pointing at the manifest file produced in this phase.
4. **Ability to copy files to your machine** — the plugin is two small local files (manifest + code); you download them from here and import them.

REST alternative (documented only, not the primary path): a Figma personal access token with `file_variables:write`. It can create variables on Enterprise plans only, and cannot create text styles, components or component sets — so it cannot satisfy the proof. It stays a fallback for variables-only work if the plugin path fails.

## 2. Scratch file requirements and edit-access verification

- One **new, empty Figma Design file**, created by you, used for nothing else. Name it `ABox Proof — Scratch`.
- It must sit in a team/project where you hold **Can edit**, not Can view.
- Verification, before any plugin run: open the file, create and delete one rectangle. If that succeeds, edit access is confirmed. If the toolbar is read-only, stop.
- No existing ABox or client Figma library is touched at any point in this phase.

## 3. Library-publishing permission check

- In the scratch file: Assets panel → the publish/library control. If "Publish library" is available, publishing is permitted.
- If it is greyed out or absent, publishing is not permitted on that team (typically a Starter plan or a member-role restriction). This does **not** block the proof — the proof needs creation only. It is recorded as a constraint that would stop Phase 52 at an unpublished local library.

## 4. Proof objects and how the plugin creates them

The plugin runs once and creates exactly four things in the scratch file, via the Figma Plugin API:

1. **Color variable** — `createVariableCollection("ABox/Color/Semantic")`, one mode `Light`, variable `background/base` of type `COLOR`, value converted from the production `--background` role in `src/styles.css` (oklch converted to sRGB; the conversion is recorded as a known limitation, not a redesign).
2. **Text style** — `createTextStyle()` named `ABox/Body/Base` with family, size, weight, line-height and letter-spacing read from the production body typography role. Fonts are loaded with `loadFontAsync` first; if the exact family is unavailable on your machine, the plugin stops rather than substituting a font.
3. **Component** — `createComponent()` named `ABox/StatusBadge`, Auto Layout horizontal, padding/gap/corner radius taken from the canonical `status-badge.tsx` source, containing one editable text node, with its fill bound to the variable from step 1.
4. **Variant** — `combineAsVariants()` producing a component set with one variant property `tone`, two values taken from the real StatusBadge tones in source. No invented options, no artificial axes.

The plugin also writes the traceability id (`abox/StatusBadge`) into the component description. It is idempotent: on re-run it finds objects by name and updates them in place instead of duplicating.

## 5. Verifying native structure (not inferred from screenshots)

After creation, the plugin runs a structural self-check in the same session and prints a plain-text report in its UI panel:

- the variable resolves inside its collection, with a mode and a bound consumer;
- the text style exists in `getLocalTextStylesAsync()` and applies to a text node;
- the component node type is `COMPONENT`, its parent is `COMPONENT_SET`, `layoutMode` is not `NONE`, and it contains a `TEXT` child;
- the component set exposes `componentPropertyDefinitions` containing `tone` with two variant values;
- a scan of the whole page finds zero `IMAGE` fills and zero flattened `VECTOR`-only groups.

Any single failure fails the whole proof. Screenshots are never accepted as evidence.

## 6. Read-back verification after creation

Two independent read-backs, both optional-but-preferred:

- **In Figma directly** — you open the component set, change the `tone` variant in the right panel, edit the text, and rename the variable. If all three respond, the objects are editable natively.
- **Via the desktop-local Figma MCP** — if you install the Lovable Desktop app and enable the Figma Dev Mode MCP server, this workspace can read the scratch file back and confirm the node structure independently of the plugin's own report. This connection is read-only, which is exactly what read-back needs.

## 7. Stopping conditions

Stop immediately, record the reason, and do not continue to Phase 52 if:

- Figma Desktop is unavailable, or development plugins cannot be imported;
- the account has no edit access to the scratch file;
- the required font cannot be loaded (no substitution is permitted);
- any of the four objects fails to create;
- the structural self-check reports a non-native node, a missing variant property, or an image/flattened fill;
- re-running the plugin duplicates objects instead of updating them.

Publishing being unavailable is recorded as a constraint, not a stop.

## 8. Isolation from the ABox application

- The plugin lives in a new top-level `tools/figma-plugin/` folder — manifest, one code file, one small UI file. It is not imported by the app, not part of any route, not referenced by `src/`, and excluded from the build output.
- No production, reference, governance, token, branding or asset file is touched.
- The plugin reads token and component values that are transcribed into a static data file inside `tools/figma-plugin/`; it never imports from `src/`, so the app's module graph is unchanged.
- The plugin writes only to the scratch Figma file, selected by you at run time.

## 9. Artifacts required before Phase 52 library generation can begin

1. A passing proof report from the structural self-check, with all five checks green.
2. Confirmed edit access to the scratch file (or a named target file for real generation).
3. A recorded answer on library publishing permission.
4. Confirmed idempotent re-run behaviour.
5. The extraction data file covering the full foundation set and the 14 canonical component families, transcribed from current production source.
6. A recorded limitations list for anything Figma cannot express exactly (oklch notation, `color-mix()`, variable-font axes, decorative utilities, keyframe motion).

## Scope guard

No Figma file is created, read or modified in this planning task. No ABox file is modified. No claim is made that any Figma object exists.
